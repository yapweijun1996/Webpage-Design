/* Execute the delivered scripts in event/DOM doubles. This is not a browser. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../..');
const shared = fs.readFileSync(path.join(root, 'demo/public/script.js'), 'utf8');
const motion = fs.readFileSync(path.join(root, 'demo/public/home-motion.js'), 'utf8');
const results = [];
class Events {
  constructor() { this.events = new Map(); }
  addEventListener(type, listener) {
    if (!this.events.has(type)) this.events.set(type, []);
    this.events.get(type).push(listener);
  }
  emit(type, extra = {}) {
    const event = { type, target: this, defaultPrevented: false,
      preventDefault() { this.defaultPrevented = true; }, ...extra };
    for (const listener of this.events.get(type) || []) listener(event);
    return event;
  }
}
class Element extends Events {
  constructor(doc, tag = 'div') {
    super(); this.doc = doc; this.tag = tag; this.attributes = {}; this.dataset = {};
    this.children = []; this.selectors = {}; this.hidden = false; this.textContent = '';
    this.style = { setProperty: (key, value) => { this.style[key] = value; } };
  }
  append(...children) { children.forEach(child => { this.children.push(child); child.parent = this; }); }
  replaceChildren(...children) { this.children = []; this.append(...children); }
  contains(element) { return element === this || this.children.some(child => child.contains(element)); }
  querySelector(selector) { return this.selectors[selector] || null; }
  querySelectorAll(selector) { return this.selectors[selector] || []; }
  closest(selector) { return this.tag === selector ? this : this.parent?.closest(selector) || null; }
  setAttribute(key, value) { this.attributes[key] = String(value); }
  getAttribute(key) { return this.attributes[key] ?? null; }
  removeAttribute(key) { delete this.attributes[key]; }
  toggleAttribute(key, force) { if (force) this.setAttribute(key, ''); else this.removeAttribute(key); }
  focus() { this.doc.activeElement = this; this.doc.emit('focusin', { target: this }); }
}
function setup({ home = true, reduced = false, saveData = false, retained, landscape = false,
  prefix = '', playMode = 'resolve', noStorage = false, hidden = false } = {}) {
  const doc = new Events(); doc.selectors = {}; doc.hidden = hidden;
  doc.querySelector = selector => doc.selectors[selector] || null;
  doc.querySelectorAll = selector => doc.selectors[selector] || [];
  doc.createElement = tag => new Element(doc, tag);
  doc.documentElement = new Element(doc);
  const make = (selector, tag) => doc.selectors[selector] = new Element(doc, tag);
  const header = make('.site-header', 'header');
  const headerInner = new Element(doc); headerInner.bottom = 64;
  headerInner.getBoundingClientRect = () => ({ bottom: headerInner.bottom });
  header.selectors['.header-inner'] = headerInner;
  const menu = make('.mobile-menu', 'details'); menu.open = false;
  const summary = new Element(doc, 'summary'); menu.selectors.summary = summary;
  const brand = make('.site-header .brand', 'a'); header.selectors['.brand'] = brand;
  brand.setAttribute('href', '/');
  const links = ['/', '/collections/', '/our-story/', '/quality/', '/contact/'].map(href => {
    const anchor = new Element(doc, 'a'); anchor.setAttribute('href', href); return anchor;
  });
  menu.selectors['nav a'] = links; menu.append(summary, ...links); header.append(brand, menu);
  const desktops = links.map(link => { const a = new Element(doc, 'a'); a.setAttribute('href', link.getAttribute('href')); return a; });
  doc.selectors['.desktop-nav a'] = desktops;
  doc.selectors['.desktop-nav a, .header-cta'] = desktops;
  header.append(...desktops);
  const cta = make('.home-arrival .home-primary', 'a');
  const environment = new Element(doc); if (home) doc.selectors['[data-home-environment]'] = environment;
  const video = new Element(doc, 'video'); video.paused = true; video.loads = 0; video.plays = 0;
  video.dataset = Object.fromEntries(['landscape', 'portrait'].flatMap(orientation => [
    [orientation + 'Src', prefix + '/assets/immersive/' + orientation + '.mp4'],
    [orientation + 'Poster', prefix + '/assets/immersive/' + orientation + '-poster.webp']]));
  video.load = () => { video.loads++; };
  video.pause = () => { const changed = !video.paused; video.paused = true; if (changed) video.emit('pause'); };
  video.removeAttribute = key => { if (key === 'src') delete video.src; else Element.prototype.removeAttribute.call(video, key); };
  const pending = [];
  video.play = () => {
    video.plays++; video.paused = false;
    if (playMode === 'pending') return new Promise((resolve, reject) => pending.push({ resolve, reject }));
    if (playMode !== 'resolve') return Promise.reject({ name: playMode });
    return Promise.resolve();
  };
  const poster = new Element(doc, 'img'); poster.complete = true; poster.naturalWidth = 720;
  environment.selectors.video = video; environment.selectors.img = poster;
  const control = make('[data-motion-toggle]', 'button');
  const label = make('[data-motion-label]');
  const pauseIcon = new Element(doc, 'svg'); const playIcon = new Element(doc, 'svg');
  control.selectors['[data-pause-icon]'] = pauseIcon; control.selectors['[data-play-icon]'] = playIcon;
  const win = new Events(); win.scrollY = 0; win.location = { search: '' };
  const preferences = new Map();
  for (const [query, matches] of [ ['(min-aspect-ratio: 6/5)', landscape],
    ['(prefers-reduced-motion: reduce)', reduced], ['(max-width: 1119px)', true]]) {
    const item = new Events(); item.matches = matches;
    item.change = value => { item.matches = value; item.emit('change', { matches: value }); };
    preferences.set(query, item);
  }
  win.matchMedia = query => { assert.ok(preferences.has(query), query); return preferences.get(query); };
  const storage = new Map(retained ? [['aquatic-world-background-stop', retained]] : []);
  win.sessionStorage = {
    getItem(key) { if (noStorage) throw Error('storage disabled'); return storage.get(key) || null; },
    setItem(key, value) { if (noStorage) throw Error('storage disabled'); storage.set(key, value); },
    removeItem(key) { if (noStorage) throw Error('storage disabled'); storage.delete(key); }
  };
  const connection = new Events(); connection.saveData = saveData;
  const observers = [];
  class ResizeObserverDouble {
    constructor(callback) { this.callback = callback; observers.push(this); }
    observe(element) { this.element = element; }
  }
  const context = vm.createContext({ document: doc, window: win, navigator: { connection }, URLSearchParams,
    ResizeObserver: ResizeObserverDouble });
  const run = () => { vm.runInContext(shared, context); if (home) vm.runInContext(motion, context); };
  const open = () => { menu.open = true; menu.emit('toggle'); };
  const close = () => { menu.open = false; menu.emit('toggle'); };
  return { doc, win, menu, header, headerInner, observers, summary, brand, links, desktops, cta, environment, video, poster,
    control, label, preferences, storage, connection, context, pending, run, open, close, make };
}
const flush = async () => { await Promise.resolve(); await Promise.resolve(); };
async function scenario(name, action) {
  await action(); results.push(name); console.log('PASS:', name);
}
(async () => {
  await scenario('Header measurement follows synthetic reflow on resize/observer/open without media reload or page movement', async () => {
    const h = setup(); h.run(); await flush();
    const loads = h.video.loads; const plays = h.video.plays;
    h.video.currentTime = 2.4; h.win.scrollY = 310;
    assert.equal(h.header.style['--home-menu-top'], '64px');
    h.headerInner.bottom = 166; h.win.emit('resize');
    assert.equal(h.header.style['--home-menu-top'], '166px');
    h.headerInner.bottom = 196; h.observers[0].callback();
    assert.equal(h.header.style['--home-menu-top'], '196px');
    assert.equal(h.observers[0].element, h.headerInner);
    assert.equal(h.video.loads, loads); assert.equal(h.video.plays, plays);
    h.open(); assert.equal(h.header.style['--home-menu-top'], '196px');
    h.close(); assert.equal(h.header.style['--home-menu-top'], '196px');
    assert.equal(h.win.scrollY, 310); assert.equal(h.video.currentTime, 2.4);
    assert.equal(h.video.loads, loads);
  });
  await scenario('Menu suspends and hides utility; eligible close resumes existing source', async () => {
    const h = setup(); h.run(); await flush(); h.video.emit('playing');
    const loads = h.video.loads; h.open();
    assert.equal(h.video.paused, true); assert.equal(h.control.hidden, true);
    assert.equal(h.summary.getAttribute('aria-expanded'), 'true');
    h.close(); await flush(); assert.equal(h.video.paused, false);
    assert.equal(h.control.hidden, false); assert.equal(h.video.loads, loads);
    assert.equal(h.summary.getAttribute('aria-expanded'), 'false');
  });
  await scenario('Manual Pause remains retained after disclosure closes', async () => {
    const h = setup(); h.run(); await flush(); h.video.emit('playing');
    h.control.emit('click'); const plays = h.video.plays;
    h.open(); h.close(); await flush();
    assert.equal(h.video.paused, true); assert.equal(h.video.plays, plays);
    assert.equal(h.control.hidden, false);
    assert.equal(h.control.getAttribute('aria-label'), 'Resume background');
    assert.equal(h.storage.get('aquatic-world-background-stop'), 'paused');
  });
  for (const option of [{ reduced: true }, { saveData: true }]) {
    await scenario(`Policy poster default survives Menu without downloading film: ${JSON.stringify(option)}`, async () => {
      const h = setup(option); h.run(); h.open(); h.close(); await flush();
      assert.equal(h.video.src, undefined); assert.equal(h.video.loads, 0);
      assert.equal(h.video.plays, 0); assert.equal(h.control.hidden, false);
      h.control.emit('click'); await flush(); assert.equal(h.video.paused, false);
      h.open(); h.close(); await flush(); assert.equal(h.video.paused, false);
    });
  }
  await scenario('All five link focus targets stay in disclosure; ordinary Tab, Escape return and focus-exit dismissal remain', async () => {
    const h = setup(); h.run(); h.open();
    for (const link of h.links) { link.focus(); assert.equal(h.menu.open, true); }
    assert.equal(h.doc.emit('keydown', { key: 'Tab' }).defaultPrevented, false);
    assert.equal(h.doc.emit('keydown', { key: 'Tab', shiftKey: true }).defaultPrevented, false);
    h.doc.emit('keydown', { key: 'Escape' });
    assert.equal(h.menu.open, false); assert.equal(h.doc.activeElement, h.summary);
    h.open(); h.brand.focus(); assert.equal(h.menu.open, true);
    h.cta.focus(); assert.equal(h.menu.open, false); assert.equal(h.doc.activeElement, h.cta);
    assert.equal(h.menu.getAttribute('role'), null); assert.equal(h.menu.getAttribute('aria-modal'), null);
  });
  await scenario('Outside/destination clicks preserve activation and desktop breakpoint restores corresponding focus', async () => {
    const h = setup(); h.run(); h.open();
    const outside = h.doc.emit('click', { target: h.cta });
    assert.equal(h.menu.open, false); assert.equal(outside.defaultPrevented, false);
    h.open(); const destination = h.doc.emit('click', { target: h.links[1] });
    assert.equal(h.menu.open, false); assert.equal(destination.defaultPrevented, false);
    h.open(); h.links[3].focus(); h.preferences.get('(max-width: 1119px)').change(false);
    assert.equal(h.menu.open, false); assert.equal(h.doc.activeElement, h.desktops[3]);
  });
  fs.writeFileSync(path.join(__dirname, 'controller-results.json'), JSON.stringify({
    passed: results,
    environment: 'Node vm, actual built scripts, DOM/event/media doubles; helper reused from own original evidence',
    limits: 'Synthetic measurements only: no CSS rendering, native details default action, actual tab traversal, text enlargement, scroller reachability or playback verified.'
  }, null, 2) + '\n');
  console.log(`${results.length} focused controller scenario groups passed; logic only.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
