// Simulated state-logic test: runs the built dist/assets/site.js in a Node vm with stub DOM objects
// and fires synthetic events. This exercises the motion state owner only; it is NOT browser evidence
// of rendering, real media-query/Save-Data delivery, visibility or IntersectionObserver behaviour.
// Usage: node scripts/check-motion-logic.mjs
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const code = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "dist", "assets", "site.js"), "utf8");

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
  querySelector(sel) { return this.children[sel] ?? null; }
  contains(el) { return el === this || Object.values(this.children).some((c) => c.contains?.(el)); }
  focus() { focused = this; }
  getBoundingClientRect() { return { top: 100, bottom: 300, left: 0, right: 390 }; }
}
let focused = null;

function setup({ reduce = false, saveData, imageComplete = false, naturalWidth = 0, io = true } = {}) {
  const menuText = new El();
  const toggle = new El({ ".menu-text": menuText });
  toggle.setAttribute("aria-expanded", "false");
  const header = new El({ toggle });
  const label = new El();
  const button = new El({ "[data-motion-label]": label });
  button.hidden = true;
  const image = new El();
  Object.assign(image, { complete: imageComplete, naturalWidth });
  const frame = new El({ img: image });
  const scene = new El({ ".home-scene-frame": frame, "[data-motion-toggle]": button });
  const body = new El();
  const document = new Target();
  Object.assign(document, {
    hidden: false, body,
    querySelector: (sel) => ({ "[data-header]": header, "[data-menu-toggle]": toggle, "[data-home-scene]": scene })[sel] ?? null,
  });
  const queries = {};
  const matchMedia = (q) => (queries[q] ||= Object.assign(new Target(), { matches: q.includes("reduce") ? reduce : false }));
  let ioCallback = null;
  const window = Object.assign(new Target(), { scrollY: 0, innerHeight: 800, innerWidth: 390, matchMedia });
  if (io) window.IntersectionObserver = class { constructor(cb) { ioCallback = cb; } observe() {} };
  const connection = saveData === undefined ? undefined : Object.assign(new Target(), { saveData });
  vm.runInNewContext(code, { window, document, navigator: { connection }, IntersectionObserver: window.IntersectionObserver, URLSearchParams, location: { search: "" } });
  const api = {
    scene, button, label, image, toggle, document, connection,
    reduceMQ: matchMedia("(prefers-reduced-motion: reduce)"),
    state: () => ({ motion: scene.dataset.motion, effects: scene.dataset.effects, button: button.hidden ? "hidden" : label.textContent }),
    load: () => { image.naturalWidth = 1882; image.fire("load"); },
    view: (on) => ioCallback([{ isIntersecting: on }]),
    hide: (h) => { document.hidden = h; document.fire("visibilitychange"); },
    menu: () => toggle.fire("click"),
    escape: () => document.fire("keydown", { key: "Escape" }),
    click: () => button.fire("click"),
    setReduce: (m) => { api.reduceMQ.matches = m; api.reduceMQ.fire("change"); },
    setSaveData: (v) => { connection.saveData = v; connection.fire("change"); },
  };
  return api;
}

const results = [];
const expect = (name, actual, want) => {
  const pass = Object.entries(want).every(([k, v]) => actual[k] === v);
  results.push(pass);
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${pass ? "" : `  got ${JSON.stringify(actual)} want ${JSON.stringify(want)}`}`);
};
const PLAY = "Play animation", PAUSE = "Pause animation";

{ // Normal load, image readiness, view gate, Pause/Play
  const t = setup();
  expect("before image ready: no effects, button hidden", t.state(), { motion: "paused", effects: "off", button: "hidden" });
  t.load();
  expect("image ready but not yet in view: paused, Play", t.state(), { motion: "paused", effects: "on", button: PLAY });
  t.view(true);
  expect("ready + in view: playing, Pause", t.state(), { motion: "playing", button: PAUSE });
  t.click();
  expect("user Pause freezes, label Play", t.state(), { motion: "paused", effects: "on", button: PLAY });
  t.view(false); t.view(true);
  expect("offscreen → back keeps user Pause", t.state(), { motion: "paused", button: PLAY });
  t.hide(true); t.hide(false);
  expect("hidden tab → back keeps user Pause", t.state(), { motion: "paused" });
  t.menu(); t.escape();
  expect("menu open/Escape keeps user Pause", t.state(), { motion: "paused" });
  expect("Escape returns focus to menu trigger", { f: focused === t.toggle }, { f: true });
  t.click();
  expect("explicit Play resumes", t.state(), { motion: "playing", button: PAUSE });
  t.view(false);
  expect("fully offscreen suspends", t.state(), { motion: "paused" });
  t.view(true);
  expect("re-entry resumes when not paused by user", t.state(), { motion: "playing" });
  t.hide(true);
  expect("hidden document suspends", t.state(), { motion: "paused" });
  t.hide(false);
  expect("visible again resumes", t.state(), { motion: "playing" });
  t.menu();
  expect("mobile menu open suspends", t.state(), { motion: "paused" });
  t.menu();
  expect("menu close resumes", t.state(), { motion: "playing" });
  t.menu(); t.click();
  expect("Play while menu open opts in but menu gate holds", t.state(), { motion: "paused" });
  t.menu();
  expect("…and runs once the menu closes", t.state(), { motion: "playing" });
}
{ // Live reduced motion
  const t = setup(); t.load(); t.view(true);
  t.setReduce(true);
  expect("live change to reduce stops and hides decorations", t.state(), { motion: "paused", effects: "off", button: PLAY });
  t.setReduce(false);
  expect("change back alone cannot resume", t.state(), { motion: "paused", effects: "off" });
  t.click();
  expect("explicit Play after policy stop runs", t.state(), { motion: "playing", effects: "on" });
}
{ // Initial reduced motion
  const t = setup({ reduce: true }); t.load(); t.view(true);
  expect("initial reduce: still image, Play offered", t.state(), { motion: "paused", effects: "off", button: PLAY });
  expect("opt-in flag false", { o: t.scene.dataset.optIn }, { o: "false" });
  t.click();
  expect("explicit opt-in under reduce runs", t.state(), { motion: "playing", effects: "on" });
  expect("opt-in flag true", { o: t.scene.dataset.optIn }, { o: "true" });
  t.hide(true);
  expect("opt-in still respects hidden gate", t.state(), { motion: "paused" });
}
{ // Save-Data
  const t = setup({ saveData: true }); t.load(); t.view(true);
  expect("initial Save-Data: still until opt-in", t.state(), { motion: "paused", effects: "off", button: PLAY });
  t.click();
  expect("Play opts in under Save-Data", t.state(), { motion: "playing" });
  const u = setup({ saveData: false }); u.load(); u.view(true);
  u.setSaveData(true);
  expect("Save-Data change event stops", u.state(), { motion: "paused", effects: "off" });
  u.setSaveData(false);
  expect("Save-Data off alone cannot resume", u.state(), { motion: "paused" });
}
{ // Image error, already-complete image, IO fallback
  const t = setup(); t.view(true); t.image.fire("error");
  expect("image error: no effects, no button", t.state(), { motion: "paused", effects: "off", button: "hidden" });
  expect("image error state exposed", { i: t.scene.dataset.image }, { i: "error" });
  const b = setup({ imageComplete: true, naturalWidth: 0 });
  expect("already-broken image at init: error", { i: b.scene.dataset.image, ...b.state() }, { i: "error", button: "hidden" });
  const c = setup({ imageComplete: true, naturalWidth: 1882 }); c.view(true);
  expect("already-loaded image at init: playing", c.state(), { motion: "playing" });
  const d = setup({ imageComplete: true, naturalWidth: 1882, io: false });
  expect("no IntersectionObserver: rect fallback runs without throwing", { m: typeof d.state().motion }, { m: "string" });
}

const failed = results.filter((r) => !r).length;
console.log(`\n${results.length - failed}/${results.length} simulated logic checks passed (stubbed DOM; not browser evidence)`);
process.exit(failed ? 1 : 0);
