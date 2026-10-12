// Acceptance checks (ACCEPTANCE.md IDs) driven through Chrome DevTools Protocol.
// Usage: node scripts/verify.mjs [--url=http://127.0.0.1:4192]
// Writes evidence/verification.json and evidence/screenshots/check-*.png.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { launchChrome } from "./cdp.mjs";
import { ensureServer } from "./server-handle.mjs";

const evidence = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "evidence");
const shots = join(evidence, "screenshots");
mkdirSync(shots, { recursive: true });

const routes = [
  { path: "/", h1: "A world of ornamental beauty", nav: "Home", current: "page" },
  { path: "/collections/", h1: "Three collection families", nav: "Collections", current: "page" },
  { path: "/collections/ornamental-fish/", h1: "Ornamental Fish", nav: "Collections", current: "location" },
  { path: "/collections/aquatic-plants/", h1: "Aquatic Plants", nav: "Collections", current: "location" },
  { path: "/collections/driftwood/", h1: "Driftwood", nav: "Collections", current: "location" },
  { path: "/our-story/", h1: "Bringing the beauty of nature", nav: "Our Story", current: "page" },
  { path: "/quality/", h1: "A thoughtful selection process", nav: "Quality", current: "page" },
  { path: "/contact/", h1: "Prepare an enquiry brief", nav: "Contact", current: "page" },
];
const categories = ["ornamental-fish", "aquatic-plants", "driftwood"];

const results = [];
const record = (id, name, pass, details = {}) => {
  results.push({ id, name, pass, ...details });
  console.log(`${pass ? "PASS" : "FAIL"}  ${id}  ${name}${pass ? "" : `  ${JSON.stringify(details).slice(0, 400)}`}`);
};

const server = await ensureServer();
const O = server.origin;
const browser = await launchChrome();
const page = await browser.newPage();
const state = () => page.eval(`({
  path: location.pathname, search: location.search, title: document.title,
  h1: document.querySelector("h1")?.textContent.trim().replace(/\\s+/g, " "),
  current: [...document.querySelectorAll(".site-nav a[aria-current]")].map(a => [a.textContent.trim(), a.getAttribute("aria-current")]),
  mainText: document.querySelector("main")?.innerText.length
})`);

try {
  /* IA-01 direct load + reload */
  await page.viewport(1440, 900);
  const seen = new Set();
  for (const r of routes) {
    await page.goto(O + r.path);
    const s1 = { ...(await state()), status: page.lastDocStatus };
    await page.navigateBy(() => page.send("Page.reload", {}));
    const s2 = { ...(await state()), status: page.lastDocStatus };
    const broken = await page.loadAllImages();
    const ok = s1.status === 200 && s2.status === 200 && s1.h1?.startsWith(r.h1) && s2.h1 === s1.h1 &&
      s1.current.length === 1 && s1.current[0][0] === r.nav && s1.current[0][1] === r.current &&
      s1.mainText > 600 && !seen.has(s1.title) && broken.length === 0;
    seen.add(s1.title);
    record("IA-01", `direct load + reload ${r.path}`, ok, { status: [s1.status, s2.status], title: s1.title, h1: s1.h1, current: s1.current, mainChars: s1.mainText, broken });
  }

  /* IA-02 header + footer global links from Home, Quality, Contact */
  for (const from of ["/", "/quality/", "/contact/"]) {
    await page.goto(O + from);
    const links = await page.eval(`[...document.querySelectorAll(".site-nav a, .site-footer nav a")].map((a, i) => ({ i, href: a.getAttribute("href"), area: a.closest(".site-footer") ? "footer" : "header", text: a.textContent.trim() }))`);
    const failures = [];
    for (const link of links) {
      await page.goto(O + from);
      const sel = link.area === "header" ? ".site-nav a" : ".site-footer nav a";
      const idx = await page.eval(`[...document.querySelectorAll(${JSON.stringify(sel)})].findIndex(a => a.getAttribute("href") === ${JSON.stringify(link.href)})`);
      await page.navigateBy(() => page.eval(`document.querySelectorAll(${JSON.stringify(sel)})[${idx}].click()`));
      const s = await state();
      const expected = routes.find((r) => r.path === link.href);
      if (link.href.includes("#") || s.path !== link.href || !expected || !s.h1.startsWith(expected.h1)) failures.push({ ...link, got: s.path, h1: s.h1 });
    }
    record("IA-02", `header/footer links from ${from} (${links.length} links)`, failures.length === 0, { failures });
  }

  /* IA-03 Home -> Collections -> category -> Contact, for each category */
  for (const slug of categories) {
    await page.goto(O + "/");
    await page.navigateBy(() => page.click(`.home-hero a[href="/collections/"]`));
    const s1 = await state();
    await page.navigateBy(() => page.click(`.col-card a[href="/collections/${slug}/"]`));
    const s2 = await state();
    await page.navigateBy(() => page.click(`.cat-hero a[href^="/contact/?interest=${slug}"]`));
    const s3 = await state();
    const ctx = await page.eval(`({ checked: [...document.querySelectorAll('input[name=interest]:checked')].map(i => i.value), context: !document.querySelector("[data-context]").hidden ? document.querySelector("[data-context-text]").textContent : null, back: document.querySelector("[data-context-link]").getAttribute("href") })`);
    const ok = s1.path === "/collections/" && s2.path === `/collections/${slug}/` && s3.path === "/contact/" &&
      ctx.checked.join() === slug && ctx.context && ctx.back === `/collections/${slug}/`;
    record("IA-03", `journey Home → Collections → ${slug} → Contact`, ok, { paths: [s1.path, s2.path, s3.path + s3.search], ctx });
  }

  /* IA-04 new tab + Back/Forward */
  {
    await page.goto(O + "/collections/");
    const href = await page.eval(`document.querySelector('.col-card a[href*="driftwood"]').href`);
    const tab = await browser.newPage();
    await tab.viewport(1440, 900);
    await tab.goto(href);
    const t = await tab.eval(`({ path: location.pathname, h1: document.querySelector("h1").textContent, current: document.querySelector(".site-nav a[aria-current]").getAttribute("aria-current") })`);
    await tab.close();
    const cardHasHandler = await page.eval(`document.querySelector('.col-card a[href*="driftwood"]').getAttribute("target") === null && document.querySelector('.col-card a[href*="driftwood"]').tagName === "A"`);
    record("IA-04", "category link opens in a new tab as a native link", t.path === "/collections/driftwood/" && t.h1 === "Driftwood" && t.current === "location" && cardHasHandler, t);

    await page.goto(O + "/");
    await page.navigateBy(() => page.click(`.site-nav a[href="/collections/"]`));
    await page.navigateBy(() => page.click(`.col-card a[href="/collections/aquatic-plants/"]`));
    await page.history("back");
    const back1 = await state();
    await page.history("back");
    const back2 = await state();
    await page.history("forward");
    await page.history("forward");
    const fwd = await state();
    const ok = back1.path === "/collections/" && back1.current[0][1] === "page" && back2.path === "/" && back2.current[0][0] === "Home" &&
      fwd.path === "/collections/aquatic-plants/" && fwd.current[0].join() === "Collections,location";
    record("IA-04", "Back/Forward across pages keeps current navigation context", ok, { back1, back2, fwd });
  }

  /* IA-05 logo, breadcrumbs, index return, siblings on each category page */
  for (const slug of categories) {
    const path = `/collections/${slug}/`;
    const targets = [
      [".site-header .brand", "/"],
      [".breadcrumbs a[href='/']", "/"],
      [".breadcrumbs a[href='/collections/']", "/collections/"],
      [".siblings .text-link", "/collections/"],
      ...categories.filter((c) => c !== slug).map((c) => [`.siblings a[href='/collections/${c}/']`, `/collections/${c}/`]),
    ];
    const failures = [];
    for (const [sel, expected] of targets) {
      await page.goto(O + path);
      await page.navigateBy(() => page.click(sel));
      const s = await state();
      if (s.path !== expected) failures.push({ sel, expected, got: s.path });
    }
    const crumb = await (async () => { await page.goto(O + path); return page.eval(`[...document.querySelectorAll(".breadcrumbs li")].map(li => li.textContent.trim() + (li.querySelector("[aria-current=page]") ? "*" : ""))`); })();
    record("IA-05", `logo/breadcrumbs/index/siblings from ${slug}`, failures.length === 0 && crumb.length === 3 && crumb[2].endsWith("*"), { failures, crumb });
  }

  /* IA-06 unknown path */
  {
    await page.goto(O + "/no-such-page/deeper");
    const s = await state();
    const docStatus = page.lastDocStatus;
    const links = await page.eval(`[...document.querySelectorAll(".nf-links a")].map(a => a.getAttribute("href"))`);
    const cssOk = await page.eval(`getComputedStyle(document.body).fontFamily.includes("system-ui")`);
    await page.navigateBy(() => page.click(`.nf-links a[href="/collections/"]`));
    const after = await state();
    record("IA-06", "unknown path → honest 404 with recovery", docStatus === 404 && s.h1.includes("not part of the collection") && links.length === 8 && cssOk && after.path === "/collections/", { docStatus, h1: s.h1, links, cssLoadedOnDeepPath: cssOk, recoveredTo: after.path });
    const status = await fetch(O + "/no-such-page/deeper").then((r) => r.status);
    record("IA-06", "unknown path HTTP status", status === 404, { status });
  }

  /* NAV-01 header geometry on every page at 1440, 1024, 768, 390 */
  for (const [w, h] of [[1440, 900], [1024, 768], [768, 1024], [390, 844]]) {
    await page.viewport(w, h);
    const problems = [];
    for (const r of routes) {
      await page.goto(O + r.path);
      const g = await page.eval(`(() => {
        const hdr = document.querySelector(".site-header").getBoundingClientRect();
        const box = el => { const b = el.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height, r: b.right, cy: b.y + b.height / 2, vis: b.width > 0 && getComputedStyle(el).visibility !== "hidden" && el.offsetParent !== null }; };
        const brand = box(document.querySelector(".site-header .brand"));
        const toggle = box(document.querySelector(".menu-toggle"));
        const links = [...document.querySelectorAll(".site-nav .nav-link")].map(box);
        const cta = box(document.querySelector(".header-cta"));
        const fontSize = parseFloat(getComputedStyle(document.querySelector(".nav-link")).fontSize);
        return { hdrH: hdr.height, brand, toggle, links, cta, fontSize, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
      })()`);
      const compact = w < 1000;
      const overlap = (a, b) => a.vis && b.vis && a.x < b.r && b.x < a.r && a.y < b.y + b.h && b.y < a.y + a.h;
      if (compact) {
        if (!g.toggle.vis || g.links.some((l) => l.vis) || overlap(g.brand, g.toggle) || g.hdrH !== 65) problems.push({ route: r.path, g });
      } else {
        const items = [g.brand, ...g.links, g.cta];
        const sameLine = items.every((it) => Math.abs(it.cy - g.brand.cy) <= 2);
        const ordered = items.every((it, i) => i === 0 || items[i - 1].r <= it.x + 0.5);
        const singleLine = g.links.every((l) => l.h === 44);
        if (!sameLine || !ordered || !singleLine || g.toggle.vis || g.hdrH !== 77 || g.fontSize < 15) problems.push({ route: r.path, sameLine, ordered, singleLine, hdrH: g.hdrH });
      }
      if (g.overflow > 0) problems.push({ route: r.path, overflow: g.overflow });
    }
    await page.goto(O + "/collections/driftwood/");
    await page.screenshot(join(shots, `check-header-${w}.png`), { fullPage: false });
    record("NAV-01", `header layout on all routes at ${w}px`, problems.length === 0, { problems });
  }

  /* NAV-02 phone menu by pointer and keyboard */
  {
    await page.viewport(390, 844);
    await page.goto(O + "/quality/");
    await page.click(".menu-toggle");
    const open = await page.eval(`({ expanded: document.querySelector(".menu-toggle").getAttribute("aria-expanded"), label: document.querySelector(".menu-text").textContent, links: [...document.querySelectorAll(".site-nav a")].map(a => { const b = a.getBoundingClientRect(); return { t: a.textContent.trim(), visible: b.height > 0 && b.bottom <= innerHeight, cur: a.getAttribute("aria-current") }; }), cta: document.querySelector(".header-cta").getBoundingClientRect().bottom <= innerHeight, bodyLocked: getComputedStyle(document.body).overflow === "hidden" })`);
    await new Promise((r) => setTimeout(r, 400)); // let the icon transition finish before capturing
    await page.screenshot(join(shots, "check-menu-open-390.png"), { fullPage: false });
    await page.key("Escape");
    const esc = await page.eval(`({ expanded: document.querySelector(".menu-toggle").getAttribute("aria-expanded"), focus: document.activeElement.className, panel: getComputedStyle(document.querySelector(".site-menu")).display })`);
    // Keyboard: Enter on focused toggle, Tab into first link, then outside click closes.
    await page.eval(`document.querySelector(".menu-toggle").focus()`);
    await page.key("Enter");
    const kOpen = await page.eval(`document.querySelector(".menu-toggle").getAttribute("aria-expanded")`);
    await page.key("Tab");
    const firstFocus = await page.eval(`document.activeElement.textContent.trim()`);
    await page.clickAt(200, 800);
    const outside = await page.eval(`document.querySelector(".menu-toggle").getAttribute("aria-expanded")`);
    // Following a menu link navigates.
    await page.click(".menu-toggle");
    await page.navigateBy(() => page.click(`.site-nav a[href="/our-story/"]`));
    const nav = await state();
    const ok = open.expanded === "true" && open.label === "Close" && open.links.every((l) => l.visible) && open.cta && open.bodyLocked &&
      open.links.find((l) => l.t.startsWith("Quality")).cur === "page" &&
      esc.expanded === "false" && esc.focus.includes("menu-toggle") && esc.panel === "none" &&
      kOpen === "true" && firstFocus.startsWith("Home") && outside === "false" && nav.path === "/our-story/";
    record("NAV-02", "phone menu: pointer, Enter, Tab, Escape (focus returns), outside click, link", ok, { open, esc, kOpen, firstFocus, outside, navigatedTo: nav.path });
  }

  /* NAV-03 keyboard: skip link, focus visibility, focus not hidden under sticky header */
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    await page.viewport(w, h);
    await page.goto(O + "/contact/");
    await page.key("Tab");
    const first = await page.eval(`({ cls: document.activeElement.className, visible: document.activeElement.getBoundingClientRect().top >= 0 })`);
    await page.key("Enter");
    const afterSkip = await page.eval(`document.activeElement.id`);
    const hidden = [];
    const order = [];
    for (let i = 0; i < 40; i++) {
      await page.key("Tab");
      const f = await page.eval(`(() => { const el = document.activeElement; const r = el.getBoundingClientRect(); const hdr = document.querySelector(".site-header").getBoundingClientRect().bottom; const cs = getComputedStyle(el); return { tag: el.tagName, text: (el.textContent || el.name || "").trim().slice(0, 30), inHeader: !!el.closest(".site-header"), top: r.top, bottom: r.bottom, hdr, outline: cs.outlineStyle !== "none" || el.closest(".choice") !== null }; })()`);
      order.push(`${f.tag}:${f.text}`);
      if (f.tag === "BODY" || f.text.startsWith("Skip to content")) continue; // focus wrapped past the end
      if (!f.inHeader && (f.top < f.hdr - 1 || f.top >= h)) hidden.push(f);
      if (!f.outline) hidden.push({ ...f, reason: "no visible outline" });
    }
    record("NAV-03", `keyboard at ${w}px: skip link first, focus visible and not under sticky header`, first.cls.includes("skip-link") && first.visible && afterSkip === "main" && hidden.length === 0, { first, afterSkip, hidden, order: order.slice(0, 16) });
  }

  /* NAV-04 JavaScript disabled */
  {
    await page.send("Emulation.setScriptExecutionDisabled", { value: true });
    page.scriptsDisabled = true;
    await page.viewport(390, 844);
    const out = [];
    for (const path of ["/quality/", "/collections/driftwood/", "/contact/"]) {
      await page.goto(O + path);
      const s = await page.eval(`({ cls: document.documentElement.className, h1: document.querySelector("h1").textContent, links: [...document.querySelectorAll(".site-nav a")].filter(a => a.getBoundingClientRect().height > 0).map(a => a.getAttribute("href")), toggle: getComputedStyle(document.querySelector(".menu-toggle")).display, noscript: document.querySelector("noscript") ? true : false, submitDisabled: document.querySelector("[data-requires-js]")?.disabled ?? null })`);
      out.push({ path, ...s });
    }
    await page.goto(O + "/collections/driftwood/");
    await page.screenshot(join(shots, "check-nojs-390-driftwood.png"), { fullPage: false });
    await page.goto(O + "/contact/");
    await page.eval(`document.querySelector("#enquiry").scrollIntoView()`).catch(() => {});
    await page.screenshot(join(shots, "check-nojs-390-contact.png"), { fullPage: false });
    // Navigation still works by native link click.
    await page.navigateBy(() => page.click(`.site-nav a[href="/collections/"]`));
    const nav = await page.eval(`location.pathname`);
    await page.send("Emulation.setScriptExecutionDisabled", { value: false });
    page.scriptsDisabled = false;
    const ok = out.every((o) => o.cls === "no-js" && o.links.length === 5 && o.toggle === "none") && out[2].submitDisabled === true && nav === "/collections/";
    record("NAV-04", "no-JS: destinations visible, menu toggle hidden, contact preview honestly unavailable", ok, { out, navigatedTo: nav });
  }

  /* FORM-01 validation, recovery, honest preview, no outbound submission */
  {
    await page.viewport(1440, 900);
    await page.goto(O + "/contact/");
    const reqStart = page.requests.length;
    await page.click(".enquiry-form button[type=submit]");
    const blank = await page.eval(`({ summaryVisible: !document.querySelector("[data-error-summary]").hidden, focused: document.activeElement.matches("[data-error-summary]"), items: [...document.querySelectorAll("[data-error-list] li")].map(l => l.textContent), invalid: [...document.querySelectorAll("[aria-invalid=true]")].map(e => e.id || e.value), described: document.getElementById("f-name").getAttribute("aria-describedby"), nameErr: document.getElementById("f-name-error").textContent })`);
    await page.screenshot(join(shots, "check-form-errors-1440.png"), { fullPage: false });
    // Summary link moves focus to the field.
    await page.eval(`document.querySelector("[data-error-list] a").click()`);
    const linkFocus = await page.eval(`document.activeElement.id`);
    await page.type("Ari Tan");
    await page.eval(`document.getElementById("f-email").focus()`);
    await page.type("not-an-email");
    await page.eval(`document.getElementById("f-project").focus()`);
    await page.type("Too short");
    await page.click(".enquiry-form button[type=submit]");
    const partial = await page.eval(`({ items: [...document.querySelectorAll("[data-error-list] li")].map(l => l.textContent), nameInvalid: document.getElementById("f-name").getAttribute("aria-invalid") })`);
    // Correct everything; errors clear as fields are fixed.
    await page.eval(`(() => { const e = document.getElementById("f-email"); e.value = ""; e.focus(); })()`);
    await page.type("ari@example.com");
    const emailCleared = await page.eval(`document.getElementById("f-email-error").textContent === "" && !document.getElementById("f-email").hasAttribute("aria-invalid")`);
    await page.click(`input[name=interest][value=aquatic-plants]`);
    await page.eval(`document.getElementById("f-project").focus()`);
    await page.type(" — a 120 cm planted display for a shop window, opening in spring. LongUnbrokenTokenWithoutSpacesToTestWrappingBehaviourInsideThePreviewList_________________________________");
    await page.click(".enquiry-form button[type=submit]");
    const preview = await page.eval(`({ visible: !document.querySelector("[data-preview]").hidden, formHidden: document.querySelector("[data-enquiry-form]").hidden, focus: document.activeElement.matches("[data-preview]"), status: document.querySelector(".preview-status").textContent, rows: [...document.querySelectorAll("[data-preview-list] div")].map(d => d.textContent), overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, path: location.pathname + location.search })`);
    await page.eval(`document.querySelector("[data-preview]").scrollIntoView({ block: "center" })`);
    await page.screenshot(join(shots, "check-form-preview-1440.png"), { fullPage: false });
    await page.click("[data-edit]");
    const edit = await page.eval(`({ focus: document.activeElement.id, kept: document.getElementById("f-name").value })`);
    await page.click(".enquiry-form button[type=submit]");
    await page.click("[data-clear]");
    const cleared = await page.eval(`({ name: document.getElementById("f-name").value, formVisible: !document.querySelector("[data-enquiry-form]").hidden })`);
    const outbound = page.requests.slice(reqStart).filter((r) => !r.url.startsWith(O) || r.method !== "GET" || r.type === "Document");
    const ok = blank.summaryVisible && blank.focused && blank.items.length === 4 && blank.invalid.length >= 4 && blank.described.includes("f-name-error") && blank.nameErr &&
      linkFocus === "f-name" && partial.items.length === 3 && !partial.nameInvalid && emailCleared &&
      preview.visible && preview.formHidden && preview.focus && preview.status.includes("Nothing was sent") && preview.overflow === 0 && preview.path === "/contact/" &&
      edit.focus === "f-name" && edit.kept === "Ari Tan" && cleared.name === "" && cleared.formVisible && outbound.length === 0;
    record("FORM-01", "blank/invalid errors, summary links, recovery, honest preview, no outbound request", ok, { blank, linkFocus, partial, emailCleared, preview, edit, cleared, outbound });
  }

  /* UI-02 horizontal overflow on all routes at 320, 360, 430, 1024, 1920 */
  for (const w of [320, 360, 390, 430, 768, 1024, 1920]) {
    await page.viewport(w, 900);
    const over = [];
    for (const r of [...routes, { path: "/missing/" }]) {
      await page.goto(O + r.path);
      const o = await page.eval(`(() => { const d = document.documentElement.scrollWidth - document.documentElement.clientWidth; const clipped = [...document.querySelectorAll(".btn, .nav-link, .text-link, h1, h2, h3, .brand-name")].filter(el => el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflow !== "visible").map(el => el.textContent.trim().slice(0, 30)); const offscreen = [...document.querySelectorAll("main *")].filter(el => { const b = el.getBoundingClientRect(); return b.width > 0 && b.right > innerWidth + 1 && !el.closest(".site-menu"); }).map(el => el.className || el.tagName).slice(0, 5); return { d, clipped, offscreen }; })()`);
      if (o.d > 0 || o.clipped.length || o.offscreen.length) over.push({ path: r.path, ...o });
    }
    record("UI-02", `no horizontal overflow / clipped labels at ${w}px`, over.length === 0, { over });
  }

  /* UI-03 reduced motion + no reveal dependence */
  {
    await page.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
    await page.viewport(1440, 900);
    await page.goto(O + "/");
    const rm = await page.eval(`({ btn: getComputedStyle(document.querySelector(".btn")).transitionDuration, img: getComputedStyle(document.querySelector(".cat-card-media img")).transitionDuration, hiddenContent: [...document.querySelectorAll("main section")].filter(s => parseFloat(getComputedStyle(s).opacity) < 1).length })`);
    await page.send("Emulation.setEmulatedMedia", { features: [] });
    const durations = [rm.btn, rm.img].map((d) => parseFloat(d));
    record("UI-03", "reduced motion removes transitions; no content hidden for animated reveal", durations.every((d) => d < 0.001) && rm.hiddenContent === 0, rm);
  }

  /* BUILD-01 console errors, failed requests, broken images across all routes */
  {
    const p2 = await browser.newPage();
    await p2.viewport(1440, 900);
    const broken = [];
    for (const r of [...routes, { path: "/missing/" }]) {
      await p2.goto(O + r.path);
      const b = await p2.loadAllImages();
      if (b.length) broken.push({ path: r.path, b });
    }
    await p2.viewport(390, 844);
    await p2.goto(O + "/");
    const phoneHero = await p2.eval(`document.querySelector(".home-hero-media img").currentSrc`);
    const consoleErrors = p2.consoleErrors.filter((e) => !e.includes("404 (Not Found)") || !e.includes("/missing/"));
    record("BUILD-01", "no console errors, failed requests or broken images; phone hero uses art-directed crop", consoleErrors.length === 0 && p2.failed.length === 0 && broken.length === 0 && phoneHero.includes("hero-angelfish-fish"), { consoleErrors, failed: p2.failed, broken, phoneHero });
    await p2.close();
  }
} finally {
  await browser.close();
  await server.stop();
}

const summary = { run_at: new Date().toISOString(), origin: O, server_owned_by_script: server.owned, chrome: browser.version, total: results.length, passed: results.filter((r) => r.pass).length, results };
writeFileSync(join(evidence, "verification.json"), JSON.stringify(summary, null, 2) + "\n");
console.log(`\n${summary.passed}/${summary.total} checks passed (${browser.version}). Wrote evidence/verification.json`);
process.exitCode = summary.passed === summary.total ? 0 : 1;
