// Acceptance checks (ACCEPTANCE.md IDs) driven through Chrome DevTools Protocol.
// STALE FOR ROUND 7: inherited round-6 harness. Its Home checks (REV-B, BUILD-01, the hero CTA selector
// and Home H1) target the removed framed scene, so they are expected to fail against the immersive Home.
// Not run in Stage 1 (no browser automation permitted); the coordinator reviews rendered pages with CUA.
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
  current: [...document.querySelectorAll(".site-nav a[aria-current]")].map(a => [a.querySelector(".nav-label").textContent.trim(), a.getAttribute("aria-current")]),
  currentNote: document.querySelector(".site-nav a[aria-current] .visually-hidden")?.textContent.trim() ?? null,
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
      (r.current === "location" ? s1.currentNote === "(current section)" : s1.currentNote === null) &&
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

  /* NAV-01 header geometry on every page at 1440, 1180, 1100, 1024, 768, 390, 360, 320 (REVIEW.md B) */
  for (const [w, h] of [[1440, 900], [1180, 820], [1100, 800], [1024, 768], [768, 1024], [390, 844], [360, 780], [320, 700]]) {
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
        const bg = getComputedStyle(document.querySelector(".site-header")).backgroundColor;
        return { hdrH: hdr.height, brand, toggle, links, cta, fontSize, bg, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
      })()`);
      const compact = w < 1100;
      if (g.bg !== "rgb(10, 53, 65)") problems.push({ route: r.path, bg: g.bg });
      const overlap = (a, b) => a.vis && b.vis && a.x < b.r && b.x < a.r && a.y < b.y + b.h && b.y < a.y + a.h;
      if (compact) {
        if (!g.toggle.vis || g.toggle.h < 44 || g.links.some((l) => l.vis) || overlap(g.brand, g.toggle) || g.toggle.r > w || g.hdrH !== 65) problems.push({ route: r.path, g });
      } else {
        const items = [g.brand, ...g.links, g.cta];
        const sameLine = items.every((it) => Math.abs(it.cy - g.brand.cy) <= 2);
        const ordered = items.every((it, i) => i === 0 || items[i - 1].r <= it.x + 0.5);
        const singleLine = g.links.every((l) => l.h === 44) && g.cta.h >= 44;
        // Visible separation: at least 16px between brand and first link, and between last link and CTA.
        const spaced = g.links[0].x - g.brand.r >= 16 && g.cta.x - g.links[g.links.length - 1].r >= 16;
        if (!sameLine || !ordered || !singleLine || !spaced || g.toggle.vis || g.hdrH !== 77 || g.fontSize < 15) problems.push({ route: r.path, sameLine, ordered, singleLine, spaced, hdrH: g.hdrH, fontSize: g.fontSize });
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
      const s = await page.eval(`({ cls: document.documentElement.className, h1: document.querySelector("h1").textContent, links: [...document.querySelectorAll(".site-nav a")].filter(a => a.getBoundingClientRect().height > 0).map(a => a.getAttribute("href")), toggle: getComputedStyle(document.querySelector(".menu-toggle")).display, noscript: document.querySelector("noscript") ? true : false, submitDisabled: document.querySelector("[data-requires-js]")?.disabled ?? null, localNoteShown: document.querySelector("[data-local-note]") ? getComputedStyle(document.querySelector("[data-local-note]")).display !== "none" : null, noJsNotice: document.querySelector(".form-note--nojs")?.getBoundingClientRect().height > 0 })`);
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
    const ok = out.every((o) => o.cls === "no-js" && o.links.length === 5 && o.toggle === "none") && out[2].submitDisabled === true && out[2].localNoteShown === false && out[2].noJsNotice === true && nav === "/collections/";
    record("NAV-04", "no-JS: destinations visible, menu toggle hidden, contact preview honestly unavailable (one notice, not two)", ok, { out, navigatedTo: nav });
  }

  /* FORM-01 validation, recovery, honest preview, no outbound submission — desktop and phones */
  for (const [fw, fh] of [[1440, 900], [390, 844], [320, 700]]) {
    await page.viewport(fw, fh);
    await page.goto(O + "/contact/");
    const reqStart = page.requests.length;
    await page.click(".enquiry-form button[type=submit]");
    const blank = await page.eval(`({ summaryVisible: !document.querySelector("[data-error-summary]").hidden, focused: document.activeElement.matches("[data-error-summary]"), summaryClear: document.querySelector("[data-error-summary]").getBoundingClientRect().top >= document.querySelector(".site-header").getBoundingClientRect().bottom, items: [...document.querySelectorAll("[data-error-list] li")].map(l => l.textContent), invalid: [...document.querySelectorAll("[aria-invalid=true]")].map(e => e.id || e.value), described: document.getElementById("f-name").getAttribute("aria-describedby"), nameErr: document.getElementById("f-name-error").textContent })`);
    await page.screenshot(join(shots, `check-form-errors-${fw}.png`), { fullPage: false });
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
    const preview = await page.eval(`({ visible: !document.querySelector("[data-preview]").hidden, formHidden: document.querySelector("[data-enquiry-form]").hidden, focus: document.activeElement.matches("[data-preview]"), status: document.querySelector(".preview-status").textContent, rows: [...document.querySelectorAll("[data-preview-list] div")].map(d => d.textContent), labels: [...document.querySelectorAll("[data-preview-list] dt")].map(d => d.textContent), editNoteShown: document.querySelector("[data-local-note]").getBoundingClientRect().height > 0, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, path: location.pathname + location.search, statusClear: document.querySelector(".preview-status").getBoundingClientRect().top >= document.querySelector(".site-header").getBoundingClientRect().bottom })`);
    await page.eval(`document.querySelector("[data-preview]").scrollIntoView({ block: "center" })`);
    await page.screenshot(join(shots, `check-form-preview-${fw}.png`), { fullPage: false });
    await page.click("[data-edit]");
    const edit = await page.eval(`({ focus: document.activeElement.id, kept: document.getElementById("f-name").value })`);
    await page.click(".enquiry-form button[type=submit]");
    await page.click("[data-clear]");
    const cleared = await page.eval(`({ noteBack: document.querySelector("[data-local-note]").getBoundingClientRect().height > 0, name: document.getElementById("f-name").value, email: document.getElementById("f-email").value, project: document.getElementById("f-project").value, checked: document.querySelectorAll("input[name=interest]:checked").length, formVisible: !document.querySelector("[data-enquiry-form]").hidden })`);
    const outbound = page.requests.slice(reqStart).filter((r) => !r.url.startsWith(O) || r.method !== "GET" || r.type === "Document");
    const ok = blank.summaryVisible && blank.focused && blank.summaryClear && blank.items.length === 4 && blank.invalid.length >= 4 && blank.described.includes("f-name-error") && blank.nameErr &&
      linkFocus === "f-name" && partial.items.length === 3 && !partial.nameInvalid && emailCleared &&
      preview.visible && preview.formHidden && preview.focus && preview.status.includes("Nothing was sent") && preview.labels.join() === "Name,Email,Collections,Project" && !preview.editNoteShown && preview.statusClear && preview.overflow === 0 && preview.path === "/contact/" &&
      edit.focus === "f-name" && edit.kept === "Ari Tan" && cleared.name === "" && cleared.email === "" && cleared.project === "" && cleared.checked === 0 && cleared.noteBack && cleared.formVisible && outbound.length === 0;
    record("FORM-01", `blank/invalid errors, summary links, recovery, honest preview, no outbound request at ${fw}px`, ok, { blank, linkFocus, partial, emailCleared, preview, edit, cleared, outbound });
  }

  /* REV-C Contact (round 5): one heading, four field groups, one local-only disclosure, first input ≤320px on phones,
     help after the workspace in DOM/keyboard order. */
  const contactShape = `(() => {
    const before = (a, b) => !!(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
    const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== "hidden"; };
    const main = document.querySelector("main"), panel = document.getElementById("enquiry"), aside = document.querySelector(".contact-aside");
    const firstInput = document.getElementById("f-name");
    const r = (el) => el.getBoundingClientRect();
    const hdr = r(document.querySelector(".site-header")).bottom;
    const hit = document.elementFromPoint(r(firstInput).x + r(firstInput).width / 2, r(firstInput).y + r(firstInput).height / 2);
    const leaves = [...main.querySelectorAll("p, li, span, strong, label, legend, h1, h2, h3, button")].filter(el => vis(el) && !el.querySelector("p, li, span, strong"));
    return { scrollY,
      h1s: document.querySelectorAll("h1").length,
      headingsBeforeForm: [...main.querySelectorAll("h1, h2, h3, h4, .eyebrow")].filter(el => vis(el) && before(el, firstInput)).map(el => el.textContent.trim()),
      groups: [...document.querySelectorAll("[data-enquiry-form] [data-field]")].map(el => el.dataset.field),
      removed: [...document.querySelectorAll("[name=organisation], [name=role], [name=timing]")].length,
      disclosures: leaves.filter(el => /nothing (is|was|you type)|leaves this page|no message|not sent/i.test(el.textContent)).map(el => el.textContent.trim().slice(0, 60)),
      formName: document.getElementById(document.querySelector("[data-enquiry-form]").getAttribute("aria-labelledby"))?.tagName,
      button: document.querySelector("[data-enquiry-form] button[type=submit]").textContent.trim(),
      inputTop: r(firstInput).top, nameBottom: r(firstInput).bottom, emailTop: r(document.getElementById("f-email")).top, emailBottom: r(document.getElementById("f-email")).bottom,
      hdr, vh: innerHeight, hitIsInput: hit === firstInput,
      labelFont: parseFloat(getComputedStyle(document.querySelector("label[for=f-name]")).fontSize), inputH: r(firstInput).height,
      order: before(document.querySelector("h1"), panel) && before(panel, aside),
      asideAfterVisually: innerWidth < 900 ? r(aside).top >= r(panel).bottom : r(aside).left >= r(panel).right,
      helpBeforePanel: [...document.querySelectorAll(".contact-aside .checklist, .contact-aside .notice")].filter(el => before(el, panel)).length,
      positiveTabindex: document.querySelectorAll("[tabindex]:not([tabindex='-1']):not([tabindex='0'])").length };
  })()`;
  for (const [w, h] of [[390, 844], [360, 800], [320, 700], [768, 1024], [1440, 900]]) {
    await page.viewport(w, h);
    await page.goto(O + "/contact/");
    await page.eval(`scrollTo(0, 0)`);
    const c = await page.eval(contactShape);
    await page.key("Tab"); await page.key("Enter"); await page.key("Tab");
    const firstStop = await page.eval(`document.activeElement.id`);
    if (w !== 320) await page.screenshot(join(shots, `check-contact-first-${w}.png`), { fullPage: false });
    const phoneTarget = w === 390 || w === 360;
    const ok = c.scrollY === 0 && c.h1s === 1 && c.headingsBeforeForm.length === 1 && c.groups.join() === "name,email,interest,project" && c.removed === 0 &&
      c.disclosures.length === 1 && c.formName === "H1" && c.button.startsWith("Preview enquiry") && c.labelFont >= 16 && c.inputH >= 44 &&
      c.order && c.asideAfterVisually && c.helpBeforePanel === 0 && c.positiveTabindex === 0 && firstStop === "f-name" &&
      c.hitIsInput && c.nameBottom <= c.vh && c.emailTop >= c.hdr && c.emailBottom <= c.vh &&
      (!phoneTarget || c.inputTop <= 320);
    record("REV-C", `contact: one heading, four groups, one disclosure, Name+Email visible${phoneTarget ? ", first input ≤320px" : ""} at ${w}×${h}`, ok, { ...c, firstStop });
  }
  // Category context sits at the Collection(s) group, keeps the phone target, survives Edit and is reset by Clear.
  {
    await page.viewport(390, 844);
    const ctx = [];
    for (const q of ["ornamental-fish", "aquatic-plants", "driftwood", "not-sure", "bogus", "driftwood,unknown"]) {
      await page.goto(O + `/contact/?interest=${q}`);
      await page.eval(`scrollTo(0, 0)`);
      ctx.push({ q, ...(await page.eval(`({ checked: [...document.querySelectorAll("input[name=interest]:checked")].map(i => i.value).join(), shown: !document.querySelector("[data-context]").hidden, atField: !!document.querySelector("fieldset[data-field=interest] [data-context]"), text: document.querySelector("[data-context-text]").textContent, described: document.querySelector("fieldset[data-field=interest]").getAttribute("aria-describedby"), inputTop: document.getElementById("f-name").getBoundingClientRect().top })`)) });
    }
    const expectChecked = { "ornamental-fish": "ornamental-fish", "aquatic-plants": "aquatic-plants", driftwood: "driftwood", "not-sure": "not-sure", bogus: "", "driftwood,unknown": "driftwood" };
    const ctxOk = ctx.every((c) => c.checked === expectChecked[c.q] && c.shown === Boolean(expectChecked[c.q]) && c.atField && c.inputTop <= 320 && c.described.includes("f-interest-hint") && c.described.includes("f-interest-context") === c.shown);
    await page.screenshot(join(shots, "check-contact-context-390.png"), { fullPage: false });
    record("REV-C", "prefill context at the Collection(s) group for all categories + Not sure; unknown values ignored", ctxOk, { ctx });

    // Quality → Contact keeps a neutral form (no invented context).
    await page.goto(O + "/quality/");
    await page.navigateBy(() => page.click(`main a[href^="/contact/"]`));
    const fromQuality = await page.eval(`({ path: location.pathname, checked: document.querySelectorAll("input[name=interest]:checked").length, shown: !document.querySelector("[data-context]").hidden })`);
    record("REV-C", "Quality → Contact opens the neutral four-field form", fromQuality.path === "/contact/" && fromQuality.checked === 0 && !fromQuality.shown, fromQuality);

    await page.goto(O + "/contact/?interest=driftwood#enquiry");
    await page.eval(`(() => { document.getElementById("f-name").value = "Ari Tan"; document.getElementById("f-email").value = "ari@example.com"; document.getElementById("f-project").value = "A 90 cm hardscape for a reception desk."; })()`);
    await page.click(".enquiry-form button[type=submit]");
    const pv = await page.eval(`[...document.querySelectorAll("[data-preview-list] div")].map(d => [d.querySelector("dt").textContent, d.querySelector("dd").textContent])`);
    await page.click("[data-edit]");
    const edited = await page.eval(`({ checked: [...document.querySelectorAll("input[name=interest]:checked")].map(i => i.value).join(), project: document.getElementById("f-project").value, shown: !document.querySelector("[data-context]").hidden })`);
    await page.click(".enquiry-form button[type=submit]");
    await page.click("[data-clear]");
    const clr = await page.eval(`({ search: location.search, shown: !document.querySelector("[data-context]").hidden, checked: document.querySelectorAll("input[name=interest]:checked").length, name: document.getElementById("f-name").value, focus: document.activeElement.id })`);
    record("REV-C", "prefilled preview → edit keeps values → clear empties fields, context and query", pv.length === 4 && pv[2][1] === "Driftwood" && edited.checked === "driftwood" && edited.project.startsWith("A 90 cm") && edited.shown && clr.search === "" && !clr.shown && clr.checked === 0 && clr.name === "" && clr.focus === "f-name", { pv, edited, clr });
  }

  /* REV-B Home first viewport: full uncropped scene; copy beside (≥1100) or before it; frame and control visible together at 1280×800 */
  for (const [w, h] of [[1440, 900], [1280, 800], [1024, 768], [768, 1024], [390, 844], [360, 800], [320, 800]]) {
    await page.viewport(w, h);
    await page.goto(O + "/");
    await page.loadAllImages();
    const r = await page.eval(`(() => {
      const copy = [...document.querySelectorAll(".home-hero-copy > *")].map(e => e.getBoundingClientRect());
      const frame = document.querySelector(".home-scene-frame").getBoundingClientRect();
      const im = document.querySelector(".home-scene-frame img");
      const btn = document.querySelector("[data-motion-toggle]").getBoundingClientRect();
      const right = Math.max(...copy.map(b => b.right)), bottom = Math.max(...copy.map(b => b.bottom));
      return { copyRight: right, copyBottom: bottom, frame: [frame.left, frame.top, frame.width, frame.height].map(Math.round), ratio: +(frame.width / frame.height).toFixed(3), fit: getComputedStyle(im).objectFit, transform: getComputedStyle(im).transform, btn: [btn.width, btn.height, btn.bottom].map(Math.round), src: im.currentSrc.split("/").pop() };
    })()`);
    const layoutOk = w >= 1100 ? r.copyRight <= r.frame[0] - 16 : r.copyBottom <= r.frame[1];
    const firstViewOk = w === 1280 ? r.btn[2] <= h && r.frame[1] + r.frame[3] <= h : true;
    const ok = layoutOk && firstViewOk && Math.abs(r.ratio - 1882 / 836) < 0.01 && r.fit === "contain" && r.transform === "none" && r.src === "hero-angelfish.png" && r.btn[0] >= 44 && r.btn[1] >= 44;
    await page.screenshot(join(shots, `check-home-first-${w}.png`), { fullPage: false });
    record("REV-B", `home scene full frame, copy clear, control reachable at ${w}×${h}`, ok, r);
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
    const phoneHero = await p2.eval(`document.querySelector(".home-scene-frame img").currentSrc`);
    const consoleErrors = p2.consoleErrors.filter((e) => !e.includes("404 (Not Found)") || !e.includes("/missing/"));
    record("BUILD-01", "no console errors, failed requests or broken images; phone hero uses the full original scene", consoleErrors.length === 0 && p2.failed.length === 0 && broken.length === 0 && phoneHero.endsWith("/assets/motion/hero-angelfish.png"), { consoleErrors, failed: p2.failed, broken, phoneHero });
    await p2.close();
  }
} finally {
  // Stop the owned preview even if closing Chrome fails.
  await browser.close().catch((e) => console.error("Chrome close failed:", e.message));
  await server.stop();
}

const summary = { run_at: new Date().toISOString(), origin: O, server_owned_by_script: server.owned, chrome: browser.version, total: results.length, passed: results.filter((r) => r.pass).length, results };
writeFileSync(join(evidence, "verification.json"), JSON.stringify(summary, null, 2) + "\n");
console.log(`\n${summary.passed}/${summary.total} checks passed (${browser.version}). Wrote evidence/verification.json`);
process.exitCode = summary.passed === summary.total ? 0 : 1;
