/* Bounded controller logic checks with event/DOM stubs. No browser or film playback. */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../..');
const source = fs.readFileSync(path.join(root, 'demo/home-motion.js'), 'utf8');
const results = [];

class Events {
  constructor() { this.listeners = new Map(); }
  addEventListener(type, fn) {
    if (!this.listeners.has(type)) this.listeners.set(type, []);
    this.listeners.get(type).push(fn);
  }
  emit(type, extra = {}) {
    const event = { target: this, type, preventDefault() { this.prevented = true; }, ...extra };
    for (const fn of this.listeners.get(type) || []) fn(event);
    return event;
  }
}

function fixture(options = {}) {
  const storage = options.storage || new Map();
  const doc = new Events();
  doc.hidden = Boolean(options.hidden);
  const nodes = {};
  const element = name => {
    const node = new Events();
    node.dataset = {};
    node.attributes = {};
    node.hidden = false;
    node.inert = false;
    node.setAttribute = (key, value) => { node.attributes[key] = value; };
    node.removeAttribute = key => { delete node.attributes[key]; };
    node.focus = () => { doc.activeElement = node; };
    node.querySelector = selector => nodes[selector];
    nodes[name] = node;
    return node;
  };
  const environment = element('[data-home-environment]');
  const video = element('video');
  const poster = element('img');
  const control = element('[data-motion-toggle]');
  element('[data-motion-label]');
  element('[data-pause-icon]');
  element('[data-play-icon]');
  const menu = element('.mobile-menu');
  menu.open = Boolean(options.menuOpen);
  const summary = element('summary');
  const links = Array.from({ length: 5 }, (_, i) => element('menu-link-' + i));
  menu.contains = node => node === menu || node === summary || links.includes(node);
  menu.querySelectorAll = () => links;
  const header = element('.site-header');
  for (const selector of ['.skip-link', '.site-header .brand', '.desktop-nav', '#main', '.home-footer', '.home-motion-control', '.home-arrival .home-primary']) element(selector);
  doc.querySelector = selector => nodes[selector] || null;
  const classes = new Set();
  doc.documentElement = { classList: { toggle(name, enabled) { enabled ? classes.add(name) : classes.delete(name); } } };
  doc.activeElement = nodes['.site-header .brand'];
  poster.complete = true;
  poster.naturalWidth = 720;
  video.dataset = {
    landscapeSrc: '/project/candidate/assets/immersive/landscape.mp4',
    portraitSrc: '/project/candidate/assets/immersive/portrait.mp4',
    landscapePoster: '/project/candidate/assets/immersive/landscape-poster.webp',
    portraitPoster: '/project/candidate/assets/immersive/portrait-poster.webp'
  };
  video.paused = true;
  video.playCalls = 0;
  video.loadCalls = 0;
  video.pauseCalls = 0;
  video.currentTime = 3.2;
  video.playMode = options.playMode || 'resolve';
  video.deferred = [];
  video.error = null;
  const attached = [];
  Object.defineProperty(video, 'src', {
    get: () => video.attributes.src,
    set(value) { video.attributes.src = value; attached.push(value); }
  });
  video.load = () => { video.loadCalls++; video.paused = true; video.error = null; };
  video.pause = () => {
    video.pauseCalls++;
    if (!video.paused) { video.paused = true; video.emit('pause'); }
  };
  video.play = () => {
    video.playCalls++;
    if (video.playMode === 'defer') return new Promise(resolve => video.deferred.push(resolve));
    if (video.playMode !== 'resolve') {
      const error = new Error(video.playMode);
      error.name = video.playMode;
      return Promise.reject(error);
    }
    video.paused = false;
    video.emit('playing');
    return Promise.resolve();
  };
  const win = new Events();
  win.scrollY = 0;
  const landscape = new Events();
  landscape.matches = options.landscape !== false;
  const reduced = new Events();
  reduced.matches = Boolean(options.reduced);
  const compact = new Events();
  compact.matches = options.landscape === false;
  const queries = {
    '(min-width: 900px) and (min-aspect-ratio: 6/5)': landscape,
    '(prefers-reduced-motion: reduce)': reduced,
    '(max-width: 1119px)': compact
  };
  win.matchMedia = query => { assert(queries[query], query); return queries[query]; };
  win.sessionStorage = {
    getItem: key => { if (options.storageDenied) throw new Error('denied'); return storage.get(key) || null; },
    setItem: (key, value) => { if (options.storageDenied) throw new Error('denied'); storage.set(key, value); },
    removeItem: key => { if (options.storageDenied) throw new Error('denied'); storage.delete(key); }
  };
  const connection = new Events();
  connection.saveData = Boolean(options.saveData);
  vm.runInNewContext(source, { document: doc, window: win, navigator: options.noConnection ? {} : { connection } }, { filename: 'home-motion.js' });
  return { doc, win, nodes, environment, video, poster, control, menu, summary, links, header, landscape, reduced, connection, storage, attached, classes };
}
const flush = async () => { await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); };
const state = f => f.environment.dataset.state;
const click = f => f.control.emit('click');
const menuState = (f, value) => { f.menu.open = value; f.menu.emit('toggle'); };
const visibility = (f, hidden) => { f.doc.hidden = hidden; f.doc.emit('visibilitychange'); };
const preference = (query, value) => { query.matches = value; query.emit('change'); };

async function check(name, run) {
  try { await run(); results.push({ name, result: 'pass' }); }
  catch (error) { results.push({ name, result: 'fail', error: error.message }); throw error; }
}

(async () => {
  await check('Eligible entry uses only the rebased landscape URL, reveals a playing frame and leaves scroll timeline unchanged', async () => {
    const f = fixture(); await flush();
    assert.deepEqual(f.attached, ['/project/candidate/assets/immersive/landscape.mp4']);
    assert.equal(f.video.poster, '/project/candidate/assets/immersive/landscape-poster.webp');
    assert.equal(f.video.muted, true);
    assert.equal(state(f), 'playing');
    assert.equal(f.environment.dataset.frame, 'video');
    const plays = f.video.playCalls;
    f.win.scrollY = 1000; f.win.emit('scroll');
    assert.equal(f.header.dataset.scrolled, 'true');
    assert.equal(f.video.playCalls, plays);
    assert.equal(f.video.currentTime, 3.2);
    assert.equal(f.video.loadCalls, 1);
  });
  await check('Eligible portrait entry and both orientation changes pair the selected real-film path with its matching poster', async () => {
    const f = fixture({ landscape: false }); await flush();
    assert.equal(f.video.src, '/project/candidate/assets/immersive/portrait.mp4');
    assert.equal(f.video.poster, '/project/candidate/assets/immersive/portrait-poster.webp');
    assert.equal(f.environment.dataset.orientation, 'portrait');
    preference(f.landscape, true); await flush();
    assert.equal(f.video.src, '/project/candidate/assets/immersive/landscape.mp4');
    assert.equal(f.video.poster, '/project/candidate/assets/immersive/landscape-poster.webp');
    assert.equal(f.environment.dataset.orientation, 'landscape');
    preference(f.landscape, false); await flush();
    assert.equal(f.video.src, '/project/candidate/assets/immersive/portrait.mp4');
    assert.equal(f.video.poster, '/project/candidate/assets/immersive/portrait-poster.webp');
    assert.equal(f.environment.dataset.orientation, 'portrait');
    assert.equal(f.video.loadCalls, 5);
    assert.equal(state(f), 'playing');
  });
  await check('Manual Pause freezes frame, survives menu/tab/page events and remains a source-free poster on another Home document', async () => {
    const f = fixture(); await flush(); click(f);
    assert.equal(f.video.paused, true);
    assert.equal(f.environment.dataset.frame, 'video');
    assert.equal(f.control.attributes['aria-label'], 'Resume background');
    const plays = f.video.playCalls;
    menuState(f, true); menuState(f, false);
    visibility(f, true); visibility(f, false);
    f.win.emit('pagehide'); f.win.emit('pageshow'); await flush();
    assert.equal(f.video.playCalls, plays);
    assert.equal(f.video.currentTime, 3.2);
    const returned = fixture({ storage: f.storage }); await flush();
    assert.equal(returned.attached.length, 0);
    assert.equal(returned.video.playCalls, 0);
    assert.equal(returned.control.attributes['aria-label'], 'Resume background');
    click(returned); await flush();
    assert.equal(state(returned), 'playing');
  });
  await check('Reduced motion starts with zero source/load/play; reversal alone preserves stop and explicit opt-in is revocable', async () => {
    const f = fixture({ reduced: true }); await flush();
    assert.equal(f.attached.length, 0); assert.equal(f.video.loadCalls, 0); assert.equal(f.video.playCalls, 0);
    preference(f.reduced, false); await flush(); assert.equal(f.attached.length, 0);
    preference(f.reduced, true); click(f); await flush(); assert.equal(state(f), 'playing');
    preference(f.reduced, false); preference(f.reduced, true); await flush();
    assert.equal(f.video.paused, true);
    preference(f.reduced, false); await flush(); assert.equal(state(f), 'paused');
    const returned = fixture({ storage: f.storage }); await flush(); assert.equal(returned.attached.length, 0);
  });
  await check('Exposed Save-Data prevents initial attachment and does not resume on reversal; explicit Play can opt in', async () => {
    const f = fixture({ saveData: true }); await flush();
    assert.equal(f.attached.length, 0);
    f.connection.saveData = false; f.connection.emit('change'); assert.equal(f.attached.length, 0);
    click(f); await flush(); assert.equal(state(f), 'playing');
    f.connection.saveData = true; f.connection.emit('change'); assert.equal(f.video.paused, true);
  });
  await check('Menu suspension isolates/restores background, contains Tab focus and never attaches while initially open', async () => {
    const f = fixture({ menuOpen: true }); await flush();
    assert.equal(f.attached.length, 0);
    assert.equal(f.menu.attributes['aria-modal'], 'true');
    assert.equal(f.nodes['#main'].inert, true);
    assert.equal(f.doc.activeElement, f.summary);
    f.links[4].focus();
    assert.equal(f.doc.emit('keydown', { key: 'Tab', shiftKey: false }).prevented, true);
    assert.equal(f.doc.activeElement, f.summary);
    f.doc.emit('keydown', { key: 'Tab', shiftKey: true }); assert.equal(f.doc.activeElement, f.links[4]);
    menuState(f, false); await flush();
    assert.equal(f.nodes['#main'].inert, false);
    assert.equal(f.menu.attributes['aria-modal'], undefined);
    assert.equal(state(f), 'playing');
    const loads = f.video.loadCalls;
    menuState(f, true); assert.equal(f.video.paused, true);
    menuState(f, false); await flush(); assert.equal(f.video.loadCalls, loads);
  });
  await check('Hidden entry avoids loading; visibility and page suspension resume eligible intent without reloading', async () => {
    const f = fixture({ hidden: true }); await flush(); assert.equal(f.attached.length, 0);
    visibility(f, false); await flush(); assert.equal(state(f), 'playing');
    visibility(f, true); assert.equal(f.video.paused, true);
    visibility(f, false); await flush(); assert.equal(state(f), 'playing');
    f.win.emit('pagehide'); assert.equal(f.video.paused, true);
    f.win.emit('pageshow'); await flush(); assert.equal(state(f), 'playing');
    assert.equal(f.video.loadCalls, 1);
  });
  await check('Autoplay denial retains poster and explicit Play; lifecycle events do not retry either denied attempt', async () => {
    const f = fixture({ playMode: 'NotAllowedError' }); await flush();
    assert.equal(state(f), 'blocked'); assert.equal(f.environment.dataset.frame, 'poster');
    assert.equal(f.control.attributes['aria-label'], 'Play background');
    visibility(f, true); visibility(f, false); menuState(f, true); menuState(f, false); await flush();
    assert.equal(f.video.playCalls, 1);
    click(f); await flush(); assert.equal(f.video.playCalls, 2);
    f.win.emit('pageshow'); visibility(f, true); visibility(f, false); await flush();
    assert.equal(f.video.playCalls, 2); assert.equal(state(f), 'blocked');
  });
  await check('Missing/invalid video hides utility, retains poster, avoids same-source retries and can try the other orientation', async () => {
    const f = fixture(); await flush(); f.video.error = { code: 4 }; f.video.emit('error');
    assert.equal(state(f), 'unavailable'); assert.equal(f.control.hidden, true);
    assert.equal(f.environment.dataset.frame, 'poster');
    const plays = f.video.playCalls;
    f.win.emit('pageshow'); f.win.emit('scroll'); await flush(); assert.equal(f.video.playCalls, plays);
    preference(f.landscape, false); await flush();
    assert.equal(f.attached.at(-1), '/project/candidate/assets/immersive/portrait.mp4');
    assert.equal(f.video.poster, '/project/candidate/assets/immersive/portrait-poster.webp');
    assert.equal(state(f), 'playing'); assert.equal(f.control.hidden, false);
    f.poster.emit('error'); assert.equal(f.poster.hidden, true);
    f.poster.emit('load'); assert.equal(f.poster.hidden, false);
    const unsupported = fixture({ playMode: 'NotSupportedError' }); await flush();
    assert.equal(unsupported.control.hidden, true); assert.equal(state(unsupported), 'unavailable');
  });
  await check('Orientation change during retained pause switches to matching poster without attaching another MP4', async () => {
    const f = fixture(); await flush(); click(f);
    preference(f.landscape, false); await flush();
    assert.equal(f.attached.length, 1); assert.equal(f.video.src, undefined);
    assert.equal(f.environment.dataset.frame, 'poster');
    assert.equal(f.control.attributes['aria-label'], 'Resume background');
    click(f); await flush();
    assert.equal(f.attached.at(-1), '/project/candidate/assets/immersive/portrait.mp4');
    assert.equal(f.video.poster, '/project/candidate/assets/immersive/portrait-poster.webp');
  });
  await check('Late play promise and playing event cannot override a newer manual or policy stop', async () => {
    const f = fixture({ playMode: 'defer' });
    click(f); f.video.deferred[0](); await flush();
    f.video.paused = false; f.video.emit('playing');
    assert.equal(f.video.paused, true); assert.equal(f.environment.dataset.frame, 'poster');
    const policy = fixture({ playMode: 'defer' });
    preference(policy.reduced, true); policy.video.deferred[0](); await flush();
    assert.equal(policy.video.paused, true); assert.equal(state(policy), 'paused');
  });
  await check('Loading/stall preserves usable frame and unavailable storage/connection does not break control', async () => {
    const f = fixture({ storageDenied: true, noConnection: true }); await flush();
    f.video.emit('waiting'); assert.equal(state(f), 'buffering'); assert.equal(f.environment.dataset.frame, 'video');
    f.video.emit('stalled'); assert.equal(f.environment.dataset.frame, 'video');
    click(f); assert.equal(state(f), 'paused'); click(f); await flush(); assert.equal(state(f), 'playing');
  });
  const report = { scope: 'Controller logic with DOM/event/video stubs only. No native browser, real media, network or rendered behavior tested.', count: results.length, checks: results };
  fs.writeFileSync(path.join(__dirname, 'controller-checks.json'), JSON.stringify(report, null, 2) + '\n');
  process.stdout.write(`PASS: ${results.length} bounded controller scenarios; actual films/native browser checks not run.\n`);
})().catch(error => { process.stderr.write(error.stack + '\n'); process.exitCode = 1; });
