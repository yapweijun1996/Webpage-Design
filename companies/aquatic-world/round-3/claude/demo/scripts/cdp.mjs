// Minimal Chrome DevTools Protocol driver (Node >= 22 built-in WebSocket; no dependencies).
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);

export async function launchChrome() {
  const executable = CHROME_CANDIDATES.find((p) => existsSync(p));
  if (!executable) throw new Error("Chrome not found. Set CHROME_PATH to a Chrome/Chromium executable.");
  const profile = mkdtempSync(join(tmpdir(), "aw-verify-"));
  const proc = spawn(executable, [
    "--headless=new", "--remote-debugging-port=0", `--user-data-dir=${profile}`,
    "--no-first-run", "--no-default-browser-check", "--disable-extensions", "--hide-scrollbars",
    "--force-color-profile=srgb", "about:blank",
  ], { stdio: ["ignore", "ignore", "pipe"] });
  const wsUrl = await new Promise((resolve, reject) => {
    let buf = "";
    const timer = setTimeout(() => reject(new Error("Chrome did not start")), 20000);
    proc.stderr.on("data", (d) => {
      buf += d;
      const m = buf.match(/DevTools listening on (ws:\/\/\S+)/);
      if (m) { clearTimeout(timer); resolve(m[1]); }
    });
    proc.on("exit", (code) => reject(new Error(`Chrome exited ${code}`)));
  });
  const browser = new Browser(wsUrl, proc, profile);
  await browser.ready;
  const version = await browser.send("Browser.getVersion");
  browser.version = version.product;
  return browser;
}

class Browser {
  constructor(wsUrl, proc, profile) {
    this.proc = proc;
    this.profile = profile;
    this.id = 0;
    this.pending = new Map();
    this.listeners = new Set();
    this.ws = new WebSocket(wsUrl);
    this.ready = new Promise((resolve) => this.ws.addEventListener("open", resolve, { once: true }));
    this.ws.addEventListener("message", (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        msg.error ? reject(new Error(`${msg.error.message}`)) : resolve(msg.result);
      } else if (msg.method) {
        for (const fn of this.listeners) fn(msg);
      }
    });
  }
  send(method, params = {}, sessionId) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => { this.pending.delete(id); reject(new Error(`CDP timeout: ${method}`)); }, 30000);
      this.pending.set(id, { resolve: (v) => { clearTimeout(timer); resolve(v); }, reject: (e) => { clearTimeout(timer); reject(e); } });
    });
  }
  async newPage() {
    const { targetId } = await this.send("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await this.send("Target.attachToTarget", { targetId, flatten: true });
    const page = new Page(this, sessionId, targetId);
    await page.init();
    return page;
  }
  async close() {
    try { await this.send("Browser.close"); } catch { /* already closed */ }
    await new Promise((r) => (this.proc.exitCode !== null ? r() : this.proc.once("exit", r)));
    rmSync(this.profile, { recursive: true, force: true });
  }
}

export class Page {
  constructor(browser, sessionId, targetId) {
    this.browser = browser;
    this.sessionId = sessionId;
    this.targetId = targetId;
    this.consoleErrors = [];
    this.requests = [];
    this.failed = [];
    this.lastDocStatus = null;
    this.waiters = [];
    browser.listeners.add((msg) => {
      if (msg.sessionId !== this.sessionId) return;
      const { method, params } = msg;
      if (method === "Runtime.exceptionThrown") this.consoleErrors.push(params.exceptionDetails.exception?.description || params.exceptionDetails.text);
      if (method === "Runtime.consoleAPICalled" && params.type === "error") this.consoleErrors.push(params.args.map((a) => a.value ?? a.description).join(" "));
      if (method === "Log.entryAdded" && params.entry.level === "error") this.consoleErrors.push(`${params.entry.text} ${params.entry.url ?? ""}`.trim());
      if (method === "Network.requestWillBeSent") this.requests.push({ url: params.request.url, method: params.request.method, type: params.type });
      if (method === "Network.responseReceived" && params.type === "Document") this.lastDocStatus = params.response.status;
      if (method === "Network.loadingFailed" && !params.canceled) this.failed.push(params.errorText);
      this.waiters = this.waiters.filter((w) => (w.method === method ? (w.resolve(params), false) : true));
    });
  }
  send(method, params) { return this.browser.send(method, params, this.sessionId); }
  async init() {
    await Promise.all(["Page.enable", "Runtime.enable", "Network.enable", "Log.enable"].map((m) => this.send(m)));
  }
  waitFor(method, timeout = 15000) {
    return new Promise((resolve, reject) => {
      const waiter = { method, resolve };
      this.waiters.push(waiter);
      setTimeout(() => {
        if (this.waiters.includes(waiter)) {
          this.waiters = this.waiters.filter((w) => w !== waiter);
          reject(new Error(`Timeout waiting for ${method}`));
        }
      }, timeout);
    });
  }
  async viewport(width, height) {
    this.size = { width, height };
    await this.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width <= 430 });
  }
  async goto(url) {
    const loaded = this.waitFor("Page.loadEventFired");
    await this.send("Page.navigate", { url });
    await loaded;
    await this.settle();
  }
  // Run an action that triggers a full navigation and wait for the new document's load.
  async navigateBy(action) {
    const loaded = this.waitFor("Page.loadEventFired");
    await action();
    await loaded;
    await this.settle();
  }
  // History traversal may be restored from the back/forward cache (no load event), so poll the URL.
  async history(direction) {
    const before = await this.eval("location.href");
    await this.eval(`history.${direction}()`).catch(() => null); // may race the navigation it starts
    for (let i = 0; i < 100; i++) {
      await new Promise((r) => setTimeout(r, 50));
      const now = await this.eval("location.href + '|' + document.readyState").catch(() => "");
      if (now && !now.startsWith(before + "|") && now.endsWith("|complete")) break;
    }
    await this.settle().catch(() => null);
  }
  async settle() {
    // With script execution disabled, page timers never fire; wait on the Node side instead.
    if (this.scriptsDisabled) return new Promise((r) => setTimeout(r, 250));
    // rAF never fires in a background tab, so cap the wait.
    await this.eval(`new Promise(r => { requestAnimationFrame(() => requestAnimationFrame(r)); setTimeout(r, 300); })`);
  }
  async eval(expression) {
    const res = await this.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (res.exceptionDetails) throw new Error(`eval failed: ${res.exceptionDetails.exception?.description || res.exceptionDetails.text}\n${expression.slice(0, 200)}`);
    return res.result.value;
  }
  async loadAllImages() {
    return this.eval(`(async () => {
      const imgs = [...document.images];
      imgs.forEach(i => { i.loading = "eager"; });
      await Promise.all(imgs.map(i => i.complete && i.naturalWidth ? null : new Promise(r => { i.addEventListener("load", r, { once: true }); i.addEventListener("error", r, { once: true }); setTimeout(r, 8000); })));
      await Promise.all(imgs.map(i => i.decode().catch(() => null)));
      await new Promise(r => setTimeout(r, 400));
      return imgs.filter(i => !i.naturalWidth).map(i => i.currentSrc || i.src);
    })()`);
  }
  async screenshot(path, { fullPage = true } = {}) {
    const { writeFileSync } = await import("node:fs");
    let clip;
    if (fullPage) {
      const height = await this.eval(`Math.ceil(document.documentElement.scrollHeight)`);
      clip = { x: 0, y: 0, width: this.size.width, height, scale: 1 };
    }
    const { data } = await this.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: fullPage, ...(clip ? { clip } : {}) });
    writeFileSync(path, Buffer.from(data, "base64"));
  }
  async key(key, { shift = false } = {}) {
    const codes = { Tab: [9, "Tab"], Escape: [27, "Escape"], Enter: [13, "Enter"], " ": [32, "Space"] };
    const [keyCode, code] = codes[key];
    const base = { key, code, windowsVirtualKeyCode: keyCode, nativeVirtualKeyCode: keyCode, modifiers: shift ? 8 : 0 };
    const text = key === "Enter" ? "\r" : key === " " ? " " : undefined;
    await this.send("Input.dispatchKeyEvent", { type: text ? "keyDown" : "rawKeyDown", ...base, ...(text ? { text, unmodifiedText: text } : {}) });
    await this.send("Input.dispatchKeyEvent", { type: "keyUp", ...base });
    await this.settle();
  }
  async click(selector) {
    const box = await this.eval(`(() => { const el = document.querySelector(${JSON.stringify(selector)}); if (!el) return null; el.scrollIntoView({ block: "center" }); const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; })()`);
    if (!box) throw new Error(`No element for ${selector}`);
    await this.clickAt(box.x, box.y);
  }
  async clickAt(x, y) {
    for (const type of ["mousePressed", "mouseReleased"]) {
      await this.send("Input.dispatchMouseEvent", { type, x, y, button: "left", clickCount: 1 });
    }
    await this.settle();
  }
  async type(text) { await this.send("Input.insertText", { text }); await this.settle(); }
  async close() { await this.browser.send("Target.closeTarget", { targetId: this.targetId }); }
}
