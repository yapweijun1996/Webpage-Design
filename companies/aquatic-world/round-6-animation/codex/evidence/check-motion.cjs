// Pure Node fixtures: no browser, CDP, DOM library, network or real policy signal.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'demo/home-motion.js'), 'utf8');
const shared = fs.readFileSync(path.join(root, 'demo/script.js'), 'utf8');
const checks = [];

class Target {
  constructor(values = {}) { Object.assign(this, values); this.listeners = {}; }
  addEventListener(type, callback) { (this.listeners[type] ||= []).push(callback); }
  emit(type, event = {}) { for (const callback of this.listeners[type] || []) callback(event); }
  focus() { this.document.activeElement = this; }
}

function fixture(options = {}) {
  const label = new Target(), icon = new Target();
  const toggle = new Target({ hidden:true, querySelector:s => s.includes('label') ? label : icon });
  const image = new Target({ complete:options.complete ?? true, naturalWidth:options.broken ? 0 : 1882, hidden:false });
  const fallback = new Target({ hidden:true });
  let rect = options.offscreen ? {top:900,bottom:1100,left:0,right:800} : {top:180,bottom:500,left:450,right:1200};
  const frame = new Target({ querySelector:s => s === 'img' ? image : fallback, getBoundingClientRect:() => rect });
  const scene = new Target({ dataset:{motion:'static',optIn:'false',effects:'off'}, querySelector:s => s === '.scene-frame' ? frame : toggle });
  const control = new Target();
  const menu = new Target({ open:options.menuOpen ?? false, querySelector:() => control, contains:item => item === control });
  const reduced = new Target({ matches:options.reduced ?? false });
  const compact = new Target({ matches:true });
  const connection = options.noConnection ? undefined : new Target({ saveData:options.saveData ?? false });
  if (options.noConnectionEvents && connection) connection.addEventListener = undefined;
  const document = new Target({ hidden:options.hidden ?? false, activeElement:null, querySelector:s => s === '.mobile-menu' ? menu : s === '[data-aquatic-motion]' ? scene : null });
  control.document = document;
  const window = new Target({ innerWidth:1280, innerHeight:800, matchMedia:s => s.includes('reduced-motion') ? reduced : compact });
  let intersection;
  class Observer { constructor(callback) { intersection = callback; } observe(target) { assert.equal(target, frame); } }
  if (!options.noObserver) window.IntersectionObserver = Observer;
  const context = vm.createContext({document,window,navigator:{connection},IntersectionObserver:Observer});
  // The existing native disclosure script is included to test integration/escape.
  vm.runInContext(shared, context);
  vm.runInContext(source, context);
  const expect = (name, motion, effects = undefined) => {
    assert.equal(scene.dataset.motion, motion, name);
    assert.equal(label.textContent, motion === 'playing' ? 'Pause animation' : 'Play animation', name + ' label');
    if (effects) assert.equal(scene.dataset.effects, effects, name + ' effects');
    checks.push(name);
  };
  const view = visible => {
    rect = visible ? {top:180,bottom:500,left:450,right:1200} : {top:900,bottom:1100,left:0,right:800};
    if (options.noObserver) window.emit('scroll');
    else intersection([{isIntersecting:visible,intersectionRatio:visible ? 1 : 0}]);
  };
  const menuState = open => { menu.open = open; menu.emit('toggle'); };
  const visibility = hidden => { document.hidden = hidden; document.emit('visibilitychange'); };
  const preference = matches => { reduced.matches = matches; reduced.emit('change'); };
  const dataPolicy = saveData => { connection.saveData = saveData; connection.emit('change'); };
  return {scene, image, fallback, toggle, document, menu, control, connection, window, expect, view, menuState, visibility, preference, dataPolicy};
}

let f = fixture();
f.expect('Ready visible initial load plays', 'playing', 'on');
assert.equal(f.toggle.hidden, false);
f.toggle.emit('click');
f.expect('User Pause freezes rather than hides effects', 'paused', 'on');
f.view(false); f.view(true); f.visibility(true); f.visibility(false); f.menuState(true); f.menuState(false);
f.expect('Manual Pause survives all automatic suspensions', 'paused', 'on');
f.toggle.emit('click');
f.expect('Explicit Play resumes after manual Pause', 'playing', 'on');
f.view(false); f.expect('Fully offscreen suspends', 'paused');
f.view(true); f.expect('Eligible re-entry resumes', 'playing');
f.visibility(true); f.expect('Hidden document suspends', 'paused');
f.visibility(false); f.expect('Eligible tab return resumes', 'playing');
f.menuState(true); f.expect('Actual menu state suspends', 'paused');
f.toggle.emit('click'); f.expect('Play cannot override open menu gate', 'paused');
f.document.emit('keydown', {key:'Escape'}); f.menu.emit('toggle');
assert.equal(f.document.activeElement, f.control);
f.expect('Existing Escape closes menu and restores trigger focus', 'playing');
f.toggle.emit('click'); f.menuState(true);
f.document.emit('keydown', {key:'Escape'}); f.menu.emit('toggle');
f.expect('Existing Escape keeps explicit Pause', 'paused');

f = fixture({reduced:true});
f.expect('Initial reduced motion is static', 'paused', 'off');
f.preference(false); f.view(false); f.view(true); f.menuState(true); f.menuState(false);
f.expect('Returning preferences and lifecycle cannot clear policy stop', 'paused', 'off');
f.toggle.emit('click'); f.expect('Only explicit Play clears policy stop', 'playing', 'on');
f.preference(true); f.expect('New reduce signal immediately stops and hides effects', 'paused', 'off');
assert.equal(f.scene.dataset.optIn, 'false');
f.toggle.emit('click'); f.expect('Explicit opt-in works while reduce remains true', 'playing', 'on');
assert.equal(f.scene.dataset.optIn, 'true');
f.menuState(true); f.visibility(true); f.menuState(false);
f.expect('Policy opt-in cannot override hidden document', 'paused', 'on');
f.visibility(false); f.expect('Eligible opt-in resumes', 'playing', 'on');
f.preference(false); f.preference(true); f.preference(false);
f.expect('New policy stop stays latched after returning to default', 'paused', 'off');

f = fixture({saveData:true});
f.expect('Exposed initial Save-Data is static', 'paused', 'off');
f.dataPolicy(false); f.expect('Save-Data returning false does not auto-resume', 'paused', 'off');
f.toggle.emit('click'); f.dataPolicy(true);
f.expect('New Save-Data signal stops prior opt-in', 'paused', 'off');
f.toggle.emit('click'); f.expect('Explicit Save-Data opt-in works', 'playing', 'on');
f.preference(true); f.expect('Independent new reduce policy stops Save-Data opt-in', 'paused', 'off');
f = fixture({noConnectionEvents:true});
f.connection.saveData = true;
f.window.emit('pageshow');
f.expect('Silent exposed Save-Data change is sampled on a lifecycle event', 'paused', 'off');
f = fixture({noConnection:true}); f.expect('Unsupported connection API is safe', 'playing');

f = fixture({complete:false});
f.expect('Image loading has no effects', 'paused', 'off');
assert.equal(f.toggle.hidden, true);
f.image.emit('load'); f.expect('Valid image load enables motion', 'playing', 'on');
f.image.emit('error'); f.expect('Image error removes effects and playback', 'paused', 'off');
assert.equal(f.toggle.hidden, true); assert.equal(f.fallback.hidden, false); assert.equal(f.image.hidden, true);
f.image.emit('load'); f.expect('Recovered image reuses eligibility gates', 'playing', 'on');
f = fixture({broken:true}); f.expect('Initial failed image has fallback', 'paused', 'off');
assert.equal(f.fallback.hidden, false);
f = fixture({hidden:true}); f.expect('Initial hidden document cannot start', 'paused');
f = fixture({menuOpen:true}); f.expect('Initial open menu cannot start', 'paused');
f = fixture({noObserver:true,offscreen:true}); f.expect('Event-based visibility fallback starts suspended', 'paused');
f.view(true); f.expect('Fallback scroll can resume eligible motion', 'playing');
f.toggle.emit('click'); f.view(false); f.view(true);
f.expect('Fallback visibility preserves manual Pause', 'paused');
vm.runInNewContext(source, {document:{querySelector:() => null}});
checks.push('Absent Home scene is a safe no-op');

fs.writeFileSync(path.join(__dirname, 'motion-checks.json'), JSON.stringify({
  kind:'Synthetic JavaScript state fixtures in Node; no rendered or native browser evidence',
  passed:checks.length, checks,
  unavailable:['Real animation phase/cycle', 'Rendered responsive layout', 'Native policy signals', 'Native menu keyboard/background behavior']
}, null, 2) + '\n');
console.log(`PASS: ${checks.length} state fixture scenarios; no browser/native-signal acceptance inferred`);
