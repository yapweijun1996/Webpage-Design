// Simulated state-logic test: runs the built dist/assets/site.js in a Node vm with stub DOM objects
// and a stub <video> whose play() resolves or rejects on demand. This exercises the Home background
// controller only; it is NOT browser evidence of rendering, real autoplay policy, media queries,
// Save-Data delivery, visibility, network loading or actual film playback.
// Usage: node scripts/check-motion-logic.mjs
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const code = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "dist", "assets", "site.js"), "utf8");
const QUERY = "(min-aspect-ratio: 6/5)";
const LANDSCAPE = "/base/assets/immersive/landscape.mp4";
const PORTRAIT = "/base/assets/immersive/portrait.mp4";
const flush = () => new Promise((r) => setImmediate(r));

class Target {
  constructor() { this.listeners = {}; }
  addEventListener(type, fn) { (this.listeners[type] ||= []).push(fn); }
  fire(type, event = {}) { (this.listeners[type] || []).forEach((fn) => fn({ target: this, ...event })); }
}
class El extends Target {
  constructor(children = {}) {
    super();
    this.attrs = {}; this.dataset = {}; this.hidden = false; this.textContent = ""; this.children = children;
    const set = new Set();
    this.classList = { toggle: (c, on) => (on ? set.add(c) : set.delete(c)), contains: (c) => set.has(c) };
  }
  setAttribute(k, v) { this.attrs[k] = String(v); }
  getAttribute(k) { return this.attrs[k] ?? null; }
  hasAttribute(k) { return k in this.attrs; }
  removeAttribute(k) { delete this.attrs[k]; }
  querySelector(sel) { return this.children[sel] ?? null; }
  contains(el) { return el === this || Object.values(this.children).some((c) => c.contains?.(el)); }
  focus() { focused = this; }
}
// play(): "ok" fires playing and resolves; otherwise rejects with that DOMException name.
class Video extends El {
  constructor(canPlay) { super(); this.paused = true; this.plays = 0; this.mode = "ok"; this.canPlay = canPlay; }
  canPlayType() { return this.canPlay; }
  load() {}
  play() {
    this.plays++;
    this.paused = false;
    if (this.mode === "ok") { this.fire("playing"); return Promise.resolve(); }
    this.paused = true;
    return Promise.reject(Object.assign(new Error(this.mode), { name: this.mode }));
  }
  pause() { this.paused = true; }
}
const memoryStorage = () => {
  const map = new Map();
  return { getItem: (k) => map.get(k) ?? null, setItem: (k, v) => map.set(k, String(v)), removeItem: (k) => map.delete(k) };
};
let focused = null;

const HOME_COMPACT = "(max-width: 1119.98px)";
function setup({ reduce = false, reducedData = false, saveData, landscape = true, storage = memoryStorage(), canPlay = "maybe", mode = "ok", poster = {}, home = true } = {}) {
  const menuText = new El();
  menuText.textContent = "Menu";
  const toggle = new El({ ".menu-text": menuText });
  toggle.setAttribute("aria-expanded", "false");
  const link = new El();
  const header = new El({ toggle, link });
  if (home) header.dataset.compactQuery = HOME_COMPACT;
  const label = new El();
  label.textContent = "Pause background";
  const button = new El({ "[data-bg-label]": label });
  button.hidden = true;
  const video = new Video(canPlay);
  video.mode = mode;
  video.dataset = { landscapeSrc: LANDSCAPE, portraitSrc: PORTRAIT };
  const img = Object.assign(new El(), { complete: false, naturalWidth: 0, currentSrc: "", ...poster });
  const source = Object.assign(new El(), { media: QUERY });
  const env = new El({ video, img, source });
  const document = new Target();
  Object.assign(document, {
    hidden: false, body: new El(),
    querySelector: (sel) => ({ "[data-header]": header, "[data-menu-toggle]": toggle, ...(home && { "[data-home-env]": env, "[data-bg-toggle]": button }) })[sel] ?? null,
  });
  const initial = { [QUERY]: landscape, "(prefers-reduced-motion: reduce)": reduce, "(prefers-reduced-data: reduce)": reducedData };
  const queries = {};
  const matchMedia = (q) => (queries[q] ||= Object.assign(new Target(), { matches: initial[q] ?? false }));
  const window = Object.assign(new Target(), { scrollY: 0, matchMedia, sessionStorage: storage });
  const connection = saveData === undefined ? undefined : Object.assign(new Target(), { saveData });
  vm.runInNewContext(code, { window, document, navigator: { connection }, URLSearchParams, location: { search: "" } });
  const api = {
    env, video, button, label, toggle, img, storage, window, header, link, document, queries,
    menuState: () => ({
      expanded: toggle.getAttribute("aria-expanded"), label: menuText.textContent,
      open: header.classList.contains("is-open"), bodyOpen: document.body.classList.contains("menu-open"),
    }),
    outside: () => document.fire("click", { target: new El() }),
    inside: () => document.fire("click", { target: link }),
    focusTo: (relatedTarget) => header.fire("focusout", { relatedTarget }),
    state: () => ({
      src: video.getAttribute("src"), playing: !video.paused, plays: video.plays,
      button: button.hidden ? "hidden" : label.textContent, env: env.dataset.state, film: env.dataset.video,
    }),
    hide: (h) => { document.hidden = h; document.fire("visibilitychange"); },
    menu: () => toggle.fire("click"),
    escape: () => document.fire("keydown", { key: "Escape" }),
    click: () => button.fire("click"),
    setQuery: (q, m) => { matchMedia(q).matches = m; matchMedia(q).fire("change"); },
    setSaveData: (v) => { connection.saveData = v; connection.fire("change"); },
    filmError: () => video.fire("error"),
  };
  return api;
}

const results = [];
const expect = (name, actual, want) => {
  const pass = Object.entries(want).every(([k, v]) => actual[k] === v);
  results.push(pass);
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${pass ? "" : `  got ${JSON.stringify(actual)} want ${JSON.stringify(want)}`}`);
};
const PAUSE = "Pause background", RESUME = "Resume background", PLAY = "Play background";
const RM = "(prefers-reduced-motion: reduce)", RD = "(prefers-reduced-data: reduce)";

{ // Eligible entry, Pause/Resume, suspension gates
  const t = setup();
  expect("eligible landscape entry attaches the landscape film from its data attribute and plays", t.state(), { src: LANDSCAPE, playing: true, button: PAUSE, env: "motion", film: "shown" });
  t.click();
  expect("Pause freezes the frame and offers Resume", t.state(), { playing: false, button: RESUME, env: "poster", film: "shown" });
  expect("Pause stored for the tab session", { v: t.storage.getItem("aquatic-world:background-paused") }, { v: "1" });
  t.hide(true); t.hide(false);
  expect("hidden tab → visible keeps the Pause", t.state(), { playing: false, button: RESUME });
  t.menu(); t.escape();
  expect("menu open/Escape keeps the Pause", t.state(), { playing: false });
  expect("Escape returns focus to the menu trigger", { f: focused === t.toggle }, { f: true });
  t.click();
  expect("Resume plays and clears the stored Pause", { ...t.state(), v: t.storage.getItem("aquatic-world:background-paused") }, { playing: true, button: PAUSE, v: null });
  t.hide(true);
  expect("hidden document suspends", t.state(), { playing: false, button: PAUSE });
  t.hide(false);
  expect("visible again resumes", t.state(), { playing: true });
  t.menu();
  expect("open menu suspends", t.state(), { playing: false });
  t.menu();
  expect("closed menu resumes", t.state(), { playing: true });
}
{ // Session Pause on a later Home visit
  const storage = memoryStorage();
  storage.setItem("aquatic-world:background-paused", "1");
  const t = setup({ storage });
  expect("retained Pause: poster only, no film src, no play()", t.state(), { src: null, plays: 0, button: RESUME, env: "poster" });
  t.menu(); t.menu(); t.hide(true); t.hide(false);
  expect("menu and visibility cannot override the retained Pause", t.state(), { src: null, plays: 0 });
  t.click();
  expect("explicit Resume attaches and plays", t.state(), { src: LANDSCAPE, playing: true, button: PAUSE });
}
{ // Portrait selection and orientation switches
  const t = setup({ landscape: false });
  expect("portrait entry attaches the portrait film", t.state(), { src: PORTRAIT, playing: true });
  t.setQuery(QUERY, true);
  expect("switch to landscape while playing swaps the film", t.state(), { src: LANDSCAPE, playing: true });
  t.click(); t.setQuery(QUERY, false);
  expect("switch while paused drops the film without reattaching", t.state(), { src: null, playing: false, button: RESUME, film: "none" });
}
{ // Reduced motion
  const t = setup({ reduce: true });
  expect("initial reduced motion: no film src, no play(), Play offered", t.state(), { src: null, plays: 0, button: PLAY, env: "poster" });
  t.click();
  expect("explicit Play opts in under reduced motion", t.state(), { src: LANDSCAPE, playing: true, button: PAUSE });
  const u = setup();
  u.setQuery(RM, true);
  expect("live change toward reduced motion stops", u.state(), { playing: false, button: PLAY });
  u.setQuery(RM, false);
  expect("reversing the preference alone cannot resume", u.state(), { playing: false, button: PLAY });
  u.click();
  expect("explicit Play after the policy stop runs", u.state(), { playing: true });
}
{ // Data saving
  const t = setup({ saveData: true });
  expect("initial Save-Data: no film src, Play offered", t.state(), { src: null, plays: 0, button: PLAY });
  const r = setup({ reducedData: true });
  expect("initial prefers-reduced-data: no film src", r.state(), { src: null, plays: 0, button: PLAY });
  const u = setup({ saveData: false });
  u.setSaveData(true);
  expect("Save-Data change event stops", u.state(), { playing: false, button: PLAY });
  u.setSaveData(false);
  expect("Save-Data off alone cannot resume", u.state(), { playing: false });
}
{ // Autoplay refused
  const t = setup({ mode: "NotAllowedError" });
  await flush();
  expect("blocked autoplay: poster, Play offered", t.state(), { playing: false, button: PLAY, env: "blocked", plays: 1 });
  t.hide(true); t.hide(false); t.menu(); t.menu();
  expect("no automatic retry after a refusal", t.state(), { plays: 1 });
  t.click();
  await flush();
  expect("second (explicit) refusal: poster, control hidden, no retry loop", t.state(), { playing: false, button: "hidden", env: "denied", plays: 2 });
  const u = setup({ mode: "NotAllowedError" });
  await flush();
  u.video.mode = "ok"; u.click();
  expect("explicit Play after a blocked autoplay can succeed", u.state(), { playing: true, button: PAUSE });
}
{ // Missing or unusable film (404, decode error or no MP4 support)
  const t = setup();
  t.filmError();
  expect("film error: poster stays, control hidden", t.state(), { playing: false, button: "hidden", env: "error", film: "none" });
  t.hide(true); t.hide(false);
  expect("no retry after a film error", t.state(), { plays: 1 });
  const n = setup({ mode: "NotSupportedError" });
  await flush();
  expect("NotSupportedError rejection: poster, control hidden", n.state(), { button: "hidden", env: "error" });
  const c = setup({ canPlay: "" });
  expect("no MP4 support: no film src, control hidden", c.state(), { src: null, plays: 0, button: "hidden" });
}
{ // Poster failure, page lifecycle, storage unavailable
  const t = setup();
  t.img.fire("error");
  expect("poster error exposed for the deep-teal fallback", { p: t.env.dataset.poster }, { p: "error" });
  const b = setup({ poster: { complete: true, naturalWidth: 0, currentSrc: "/base/assets/immersive/portrait-poster.webp" } });
  expect("already-broken poster detected at init", { p: b.env.dataset.poster }, { p: "error" });
  const l = setup();
  l.window.fire("pagehide");
  expect("leaving Home pauses the film", l.state(), { playing: false });
  // A Pause stored in this tab session before a Back/Forward cache return is honoured.
  l.storage.setItem("aquatic-world:background-paused", "1");
  l.window.fire("pageshow", { persisted: true });
  expect("bfcache return re-reads the session Pause", l.state(), { playing: false, button: RESUME });
  const r = setup();
  r.window.fire("pagehide"); r.window.fire("pageshow", { persisted: true });
  expect("bfcache return without a Pause resumes", r.state(), { playing: true, button: PAUSE });
  const throwing = { getItem() { throw new Error("denied"); }, setItem() { throw new Error("denied"); }, removeItem() { throw new Error("denied"); } };
  const s = setup({ storage: throwing });
  s.click();
  expect("storage unavailable: Pause still works for this view", s.state(), { playing: false, button: RESUME });
}

{ // Fusion Home disclosure: nonmodal open/close paths (state and focus only; no layout or rendering)
  const OPEN = { expanded: "true", label: "Close", open: true, bodyOpen: true };
  const CLOSED = { expanded: "false", label: "Menu", open: false, bodyOpen: false };
  const t = setup();
  expect("closed by default: Menu label, collapsed", t.menuState(), CLOSED);
  t.menu();
  expect("Menu opens: aria-expanded, Close label at the same control, open classes", t.menuState(), OPEN);
  t.inside();
  expect("activating a link inside the header leaves it open (navigation proceeds)", t.menuState(), OPEN);
  t.focusTo(t.link);
  expect("focus moving within the header keeps it open (ordinary tab order)", t.menuState(), OPEN);
  t.focusTo(null);
  expect("focus to nothing (e.g. window blur) does not close", t.menuState(), OPEN);
  focused = null;
  t.focusTo(new El());
  expect("focus leaving the header closes without pulling focus back", { ...t.menuState(), back: focused === t.toggle }, { ...CLOSED, back: false });
  t.menu(); t.outside();
  expect("outside interaction closes without moving focus", { ...t.menuState(), back: focused === t.toggle }, { ...CLOSED, back: false });
  t.menu(); t.escape();
  expect("Escape closes and returns focus to Menu", { ...t.menuState(), back: focused === t.toggle }, { ...CLOSED, back: true });
  focused = null; t.escape();
  expect("Escape while closed does nothing", { ...t.menuState(), back: focused === t.toggle }, { ...CLOSED, back: false });
  t.menu(); t.menu();
  expect("Close on the same control closes", t.menuState(), CLOSED);
  t.menu(); t.setQuery(HOME_COMPACT, false);
  expect("leaving Home's 1120px compact range closes", t.menuState(), CLOSED);
  expect("Home listens to its own compact query, not the inner-page 1100px query", { home: HOME_COMPACT in t.queries, inner: "(max-width: 1099.98px)" in t.queries }, { home: true, inner: false });
  const inner = setup({ home: false });
  inner.menu();
  expect("inner page: same disclosure without a Home film", inner.menuState(), OPEN);
  expect("inner page keeps the 1100px compact query", { inner: "(max-width: 1099.98px)" in inner.queries }, { inner: true });
  inner.escape();
  expect("inner page: Escape closes", inner.menuState(), CLOSED);
}
{ // Fusion Home disclosure × film intent
  const t = setup();
  t.menu();
  expect("open: film suspended; control state kept for after closing", t.state(), { playing: false, button: PAUSE, env: "motion" });
  t.outside();
  expect("outside close resumes eligible motion", t.state(), { playing: true, button: PAUSE });
  t.menu(); t.focusTo(new El());
  expect("focus-exit close resumes eligible motion", t.state(), { playing: true });
  t.menu(); t.hide(true); t.escape();
  expect("closing while the tab is hidden stays suspended", t.state(), { playing: false });
  t.hide(false);
  expect("tab visible again after close resumes", t.state(), { playing: true });
  t.click(); t.menu(); t.outside();
  expect("manual Pause before opening survives open/close", t.state(), { playing: false, button: RESUME, env: "poster" });
  t.menu(); t.setQuery(HOME_COMPACT, false);
  expect("compact-range close keeps the manual Pause", t.state(), { playing: false, button: RESUME });
  const r = setup({ reduce: true });
  r.menu(); r.escape();
  expect("reduced motion: open/close downloads no film and keeps Play", r.state(), { src: null, plays: 0, button: PLAY });
  const d = setup({ saveData: true });
  d.menu(); d.outside();
  expect("Save-Data: open/close downloads no film", d.state(), { src: null, plays: 0, button: PLAY });
  const b = setup({ mode: "NotAllowedError" });
  await flush();
  b.menu(); b.escape();
  expect("blocked autoplay: open/close does not retry", b.state(), { plays: 1, button: PLAY, env: "blocked" });
  const e = setup();
  e.filmError(); e.menu(); e.outside();
  expect("film error: open/close keeps the poster and hidden control", e.state(), { playing: false, button: "hidden", env: "error" });
  const p = setup();
  p.menu(); p.setQuery(QUERY, false);
  expect("orientation change while open swaps nothing in until closed", p.state(), { src: null, playing: false });
  p.escape();
  expect("closing after the orientation change attaches the portrait film", p.state(), { src: PORTRAIT, playing: true });
}

{ // Refinement v2: Back/Forward cache return with the menu left open (a menu link was followed)
  const CLOSED = { expanded: "false", label: "Menu", open: false, bodyOpen: false };
  const t = setup();
  t.menu(); t.window.fire("pageshow", { persisted: true });
  expect("bfcache return with the menu open: closed, eligible film resumes", { ...t.menuState(), playing: t.state().playing }, { ...CLOSED, playing: true });
  const p = setup();
  p.click(); p.menu(); p.window.fire("pageshow", { persisted: true });
  expect("bfcache return with the menu open keeps a manual Pause", { ...p.menuState(), ...p.state() }, { ...CLOSED, playing: false, button: RESUME });
  const n = setup();
  n.menu(); n.window.fire("pageshow", { persisted: false });
  expect("ordinary pageshow does not touch the menu", n.menuState(), { open: true });
}
{ // Refinement v2: the inline <head> scroll-state script, extracted from the built Home page
  const html = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "dist", "index.html"), "utf8");
  const head = html.match(/<head>[\s\S]*?<script>([\s\S]*?)<\/script>/)[1];
  const run = (initialY) => {
    const classes = new Set(["no-js"]);
    const root = { classList: {
      replace: (a, b) => classes.delete(a) && classes.add(b), contains: (c) => classes.has(c),
      toggle: (c, on) => (on ? classes.add(c) : classes.delete(c)),
    } };
    const window = Object.assign(new Target(), { scrollY: initialY });
    vm.runInNewContext(head, { window, document: { documentElement: root } });
    const at = (y) => { window.scrollY = y; window.fire("scroll"); return { js: classes.has("js"), noJs: classes.has("no-js"), scrolled: classes.has("is-scrolled") }; };
    return { at, now: () => ({ js: classes.has("js"), noJs: classes.has("no-js"), scrolled: classes.has("is-scrolled") }) };
  };
  const top = run(0);
  expect("head script: js class replaces no-js; at the top the arrival state stays", top.now(), { js: true, noJs: false, scrolled: false });
  expect("head script: 3px is still the arrival state", top.at(3), { scrolled: false });
  expect("head script: 5px is protected (well before 24px)", top.at(5), { scrolled: true });
  expect("head script: 24px protected", top.at(24), { scrolled: true });
  expect("head script: hysteresis keeps protection at 3px on the way up (no boundary flicker)", top.at(3), { scrolled: true });
  expect("head script: back at the top restores the arrival state", top.at(0), { scrolled: false });
  const restored = run(0);
  expect("head script: a later restore scroll event (reload/history) protects at once", restored.at(1480), { scrolled: true });
  expect("head script: a position already scrolled when it runs is protected at init", run(900).now(), { scrolled: true });
}

const failed = results.filter((r) => !r).length;
console.log(`\n${results.length - failed}/${results.length} simulated logic checks passed (stubbed DOM and video; not browser or film evidence)`);
process.exit(failed ? 1 : 0);
