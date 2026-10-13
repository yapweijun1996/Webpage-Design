// An in-memory controller check, without a browser, network or media decoder.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'demo/home-motion.js'), 'utf8');
const checks = [];

function node() {
  const events = new Map();
  return {
    dataset: {}, hidden: false, attrs: {}, properties: {},
    style: { setProperty(name, value) { this[name] = value; } },
    addEventListener(name, callback) {
      events.set(name, [...(events.get(name) || []), callback]);
    },
    emit(name, event = {}) { for (const callback of events.get(name) || []) callback(event); },
    setAttribute(name, value) { this.attrs[name] = value; },
    removeAttribute(name) { delete this.attrs[name]; },
    toggleAttribute(name, force) { if (force) this.attrs[name] = ''; else delete this.attrs[name]; },
    querySelector(selector) { return this.children?.[selector] || null; },
    contains(target) { return this === target || Object.values(this.children || {}).includes(target); },
    focus() { this.focused = true; },
  };
}

function setup({ scroll = 0, reduced = false, saveData = false, retained = null,
                 landscape = true } = {}) {
  const video = node();
  video.dataset = {
    landscapeSrc: '/assets/immersive/landscape.mp4', portraitSrc: '/assets/immersive/portrait.mp4',
    landscapePoster: '/assets/immersive/landscape-poster.webp',
    portraitPoster: '/assets/immersive/portrait-poster.webp',
  };
  video.paused = true;
  video.currentTime = 2.5;
  video.calls = { load: 0, play: 0, pause: 0 };
  video.load = () => { video.calls.load += 1; };
  video.play = () => { video.calls.play += 1; video.paused = false; };
  video.pause = () => { video.calls.pause += 1; video.paused = true; };
  const poster = node();
  poster.complete = true;
  poster.naturalWidth = 720;
  const environment = node();
  environment.children = { video, img: poster };
  const control = node();
  control.children = { '[data-pause-icon]': node(), '[data-play-icon]': node() };
  const menu = node();
  menu.open = false;
  const summary = node();
  menu.children = { summary };
  const headerInner = node();
  headerInner.bottom = 60;
  headerInner.getBoundingClientRect = () => ({ bottom: headerInner.bottom });
  const header = node();
  header.children = { '.header-inner': headerInner, '.mobile-menu': menu };
  const document = node();
  document.body = node();
  document.hidden = false;
  document.children = {
    '[data-home-environment]': environment, '[data-motion-toggle]': control,
    '[data-motion-label]': node(), '.mobile-menu': menu, '.site-header': header,
  };
  const queries = {
    '(min-aspect-ratio: 6/5)': Object.assign(node(), { matches: landscape }),
    '(prefers-reduced-motion: reduce)': Object.assign(node(), { matches: reduced }),
    '(max-width: 1119px)': Object.assign(node(), { matches: true }),
  };
  const storage = new Map(retained ? [['aquatic-world-background-stop', retained]] : []);
  const window = node();
  window.scrollY = scroll;
  window.matchMedia = query => queries[query];
  window.sessionStorage = {
    getItem: key => storage.get(key) || null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: key => storage.delete(key),
  };
  const frames = [];
  window.requestAnimationFrame = callback => frames.push(callback);
  const connection = Object.assign(node(), { saveData });
  vm.runInNewContext(source, { window, document, navigator: { connection } });
  return { window, document, video, control, menu, summary, header, headerInner,
    environment, queries, frames, connection };
}

function check(name, run) { run(); checks.push(name); }

check('Scroll changes only header state, including exactly 24px and return to top', () => {
  const app = setup();
  assert.equal(app.header.dataset.scrolled, 'false');
  const before = { ...app.video.calls };
  for (const scroll of [1, 23, 24, 25, 600, 24, 1, 0]) {
    app.window.scrollY = scroll;
    app.window.emit('scroll');
    assert.equal(app.header.dataset.scrolled, String(scroll > 0));
  }
  assert.deepEqual(app.video.calls, before);
  assert.equal(app.video.currentTime, 2.5);
});

check('Initial scrolled load is protected', () => {
  assert.equal(setup({ scroll: 420 }).header.dataset.scrolled, 'true');
});

check('History pageshow closes cached menu and rechecks restored scroll next frame', () => {
  const app = setup();
  app.menu.open = true;
  app.menu.emit('toggle');
  app.window.emit('pagehide');
  app.window.scrollY = 24;
  app.window.emit('pageshow');
  assert.equal(app.menu.open, false);
  assert.equal(app.summary.attrs['aria-expanded'], 'false');
  assert.equal(app.header.dataset.scrolled, 'true');
  const before = { ...app.video.calls };
  app.window.scrollY = 0;
  app.frames.shift()();
  assert.equal(app.header.dataset.scrolled, 'false');
  assert.deepEqual(app.video.calls, before);
});

check('Live wrapped header geometry remains available to menu and short offer', () => {
  const app = setup();
  app.headerInner.bottom = 168;
  app.window.emit('resize');
  assert.equal(app.header.style['--home-menu-top'], '168px');
  assert.equal(app.document.body.style['--home-bar-bottom'], '168px');
});

check('Playing menu open/close suspends/resumes without reloading source', () => {
  const app = setup({ scroll: 300 });
  app.menu.open = true;
  app.menu.emit('toggle');
  assert.equal(app.video.paused, true);
  assert.equal(app.control.hidden, true);
  app.menu.open = false;
  app.menu.emit('toggle');
  assert.equal(app.video.paused, false);
  assert.equal(app.control.hidden, false);
  assert.equal(app.video.calls.load, 1);
  assert.equal(app.header.dataset.scrolled, 'true');
});

check('Manual Pause survives menu, visibility and history restoration', () => {
  const app = setup();
  app.control.emit('click');
  app.menu.open = true;
  app.menu.emit('toggle');
  app.menu.open = false;
  app.menu.emit('toggle');
  app.document.hidden = true;
  app.document.emit('visibilitychange');
  app.document.hidden = false;
  app.document.emit('visibilitychange');
  app.window.emit('pagehide');
  app.window.emit('pageshow');
  assert.equal(app.video.paused, true);
  assert.equal(app.video.calls.play, 1);
  assert.equal(setup({ retained: 'paused' }).video.calls.load, 0);
});

check('Escape returns focus; focus leaving header and outside clicks dismiss', () => {
  const app = setup();
  app.menu.open = true;
  app.menu.emit('toggle');
  app.document.emit('keydown', { key: 'Escape' });
  assert.equal(app.menu.open, false);
  assert.equal(app.summary.focused, true);
  app.menu.open = true;
  app.document.activeElement = node();
  app.document.emit('focusin');
  assert.equal(app.menu.open, false);
  app.menu.open = true;
  app.document.emit('click', { target: { closest: () => null } });
  assert.equal(app.menu.open, false);
});

check('Reduced-motion and data-saving start without movie loading; opt-in works', () => {
  for (const options of [{ reduced: true }, { saveData: true }]) {
    const app = setup(options);
    assert.equal(app.video.calls.load, 0);
    assert.equal(app.control.attrs['aria-label'], 'Play background');
    app.control.emit('click');
    assert.equal(app.video.calls.load, 1);
    assert.equal(app.video.paused, false);
  }
});

check('Hidden tabs suspend playback without losing intent or loading again', () => {
  const app = setup();
  app.document.hidden = true;
  app.document.emit('visibilitychange');
  assert.equal(app.video.paused, true);
  app.document.hidden = false;
  app.document.emit('visibilitychange');
  assert.equal(app.video.paused, false);
  assert.equal(app.video.calls.load, 1);
});

check('Aspect-only orientation selects matching source; failed film retains poster', () => {
  const app = setup({ landscape: false });
  assert.equal(app.video.src, '/assets/immersive/portrait.mp4');
  const orientation = app.queries['(min-aspect-ratio: 6/5)'];
  orientation.matches = true;
  orientation.emit('change');
  assert.equal(app.video.src, '/assets/immersive/landscape.mp4');
  assert.equal(app.video.poster, '/assets/immersive/landscape-poster.webp');
  app.video.error = { code: 4 };
  app.video.emit('error');
  assert.equal(app.environment.dataset.frame, 'poster');
  assert.equal(app.environment.dataset.state, 'unavailable');
  assert.equal(app.control.hidden, true);
});

const result = { check_type: 'Node VM mocks; no browser or decoded film',
  passed_scenarios: checks, rendered_acceptance: 'not run; coordinator required' };
fs.writeFileSync(path.join(__dirname, 'controller-check-results.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result, null, 2));
