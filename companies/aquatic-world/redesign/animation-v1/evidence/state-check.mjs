import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import vm from "node:vm";

// These contract fixtures simulate signals unavailable in the in-app browser.
// They are logic checks, not claims about real hidden tabs or Save-Data devices.
const source = readFileSync(new URL("../motion.js", import.meta.url), "utf8");
const checks = [];
function fixture({ reduced = false, saveData = false } = {}) {
  const element = () => Object.assign(new EventTarget(), { hidden: true, dataset: {}, textContent: "", setAttribute() {}, focus() {} });
  const scene = element(), frame = element(), image = element(), toggle = element();
  const label = element(), icon = element(), menu = element(), open = element(), close = element();
  const document = Object.assign(new EventTarget(), { hidden: false });
  const preference = Object.assign(new EventTarget(), { matches: reduced });
  const connection = Object.assign(new EventTarget(), { saveData });
  Object.assign(image, { complete: true, naturalWidth: 1882 });
  Object.assign(menu, { open: false, showModal() { this.open = true; }, close() { this.open = false; this.dispatchEvent(new Event("close")); } });
  scene.querySelector = selector => ({ ".scene-frame": frame, "img": image, "[data-motion-toggle]": toggle })[selector];
  toggle.querySelector = selector => ({ "[data-motion-label]": label, "[data-motion-icon]": icon })[selector];
  menu.querySelector = () => close;
  document.querySelector = selector => ({ "[data-aquatic-motion]": scene, "#review-menu": menu, "[data-menu-open]": open })[selector];
  let visibility;
  class Observer { constructor(callback) { visibility = callback; } observe() { visibility([{ isIntersecting: true, intersectionRatio: 1 }]); } }
  vm.runInNewContext(source, { document, navigator: { connection }, window: { matchMedia: () => preference, IntersectionObserver: Observer }, IntersectionObserver: Observer });
  const emit = (target, type) => target.dispatchEvent(new Event(type));
  return {
    scene, toggle, image, preference, connection,
    click: () => emit(toggle, "click"),
    hide(value) { document.hidden = value; emit(document, "visibilitychange"); },
    inView(value) { visibility([{ isIntersecting: value, intersectionRatio: value ? 1 : 0 }]); },
    reduce(value) { preference.matches = value; emit(preference, "change"); },
    data(value) { connection.saveData = value; emit(connection, "change"); },
    menu(value) { value ? emit(open, "click") : menu.close(); },
    fail() { emit(image, "error"); }
  };
}
function check(name, fn) { fn(); checks.push({ name, passed: true }); }
const normal = fixture();
check("Visible, ready scene starts", () => assert.equal(normal.scene.dataset.motion, "playing"));
normal.hide(true);
check("Hidden document suspends", () => assert.equal(normal.scene.dataset.motion, "paused"));
normal.hide(false);
check("Visible return resumes eligible motion", () => assert.equal(normal.scene.dataset.motion, "playing"));
normal.click(); normal.hide(true); normal.hide(false);
check("Hidden/visible never erases user pause", () => assert.equal(normal.scene.dataset.motion, "paused"));
normal.menu(true); normal.menu(false); normal.inView(false); normal.inView(true);
check("Menu/offscreen changes never erase user pause", () => assert.equal(normal.scene.dataset.motion, "paused"));
normal.click(); normal.menu(true);
check("Open menu suspends", () => assert.equal(normal.scene.dataset.motion, "paused"));
normal.menu(false);
check("Close menu resumes eligible motion", () => assert.equal(normal.scene.dataset.motion, "playing"));
normal.reduce(true); normal.reduce(false);
check("Preference stop persists after return", () => assert.equal(normal.scene.dataset.motion, "paused"));
const policy = fixture({ reduced: true, saveData: true });
check("Reduced-motion/Save-Data initial state is still", () => assert.equal(policy.scene.dataset.effects, "off"));
policy.click();
check("Explicit Play opts into motion", () => assert.equal(policy.scene.dataset.motion, "playing"));
policy.hide(true);
check("Opt-in cannot override hidden document", () => assert.equal(policy.scene.dataset.motion, "paused"));
policy.hide(false); policy.data(true);
check("Live Save-Data stops motion", () => assert.equal(policy.scene.dataset.motion, "paused"));
policy.reduce(false); policy.data(false);
check("Default policy return does not restart", () => assert.equal(policy.scene.dataset.motion, "paused"));
policy.click(); policy.fail();
check("Image error hides misleading controls", () => assert.equal(policy.toggle.hidden, true));
check("Image error removes decorations", () => assert.equal(policy.scene.dataset.effects, "off"));
writeFileSync(new URL("state-check.json", import.meta.url), JSON.stringify({ kind: "synthetic_contract_signals_not_browser_evidence", count: checks.length, checks }, null, 2) + "\n");
console.log(`${checks.length} signal-contract checks passed.`);
