/* Execute the delivered scripts in event/DOM doubles. This is not a browser. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
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
  await scenario('Menu suspends and hides utility; closing resumes existing source without changing scroll or timeline', async () => {
    const h = setup(); h.run(); await flush(); h.video.emit('playing');
    const loads = h.video.loads; h.video.currentTime = 2.4; h.win.scrollY = 310;
    h.open(); assert.equal(h.video.paused, true); assert.equal(h.control.hidden, true);
    assert.equal(h.environment.dataset.state, 'suspended'); assert.equal(h.summary.getAttribute('aria-expanded'), 'true');
    h.close(); await flush(); assert.equal(h.video.paused, false); assert.equal(h.control.hidden, false);
    assert.equal(h.video.loads, loads); assert.equal(h.video.currentTime, 2.4); assert.equal(h.win.scrollY, 310);
    assert.equal(h.menu.getAttribute('role'), null); assert.equal(h.menu.getAttribute('aria-modal'), null);
  });
  await scenario('Manual Pause survives menu, hidden tab and pageshow; session retention and explicit Resume work', async () => {
    const h = setup(); h.run(); await flush(); h.video.emit('playing'); h.control.emit('click');
    const plays = h.video.plays; h.open(); h.close(); h.doc.hidden = true; h.doc.emit('visibilitychange');
    h.doc.hidden = false; h.doc.emit('visibilitychange'); h.win.emit('pageshow');
    assert.equal(h.video.paused, true); assert.equal(h.video.plays, plays);
    assert.equal(h.control.getAttribute('aria-label'), 'Resume background');
    assert.equal(h.storage.get('aquatic-world-background-stop'), 'paused');
    const retained = setup({ retained: 'paused' }); retained.run(); assert.equal(retained.video.src, undefined);
    h.control.emit('click'); await flush(); assert.equal(h.video.paused, false); assert.equal(h.storage.size, 0);
  });
  for (const option of [{ reduced: true }, { saveData: true }, { retained: 'policy' }]) {
    await scenario(`Policy poster default without film download, explicit opt-in and menu intent: ${JSON.stringify(option)}`, async () => {
      const h = setup(option); h.run(); assert.equal(h.video.src, undefined); assert.equal(h.video.loads, 0);
      assert.equal(h.control.getAttribute('aria-label'), 'Play background'); h.open(); h.close();
      assert.equal(h.video.src, undefined); h.control.emit('click'); await flush(); assert.equal(h.video.paused, false);
      h.open(); h.close(); await flush(); assert.equal(h.video.paused, false);
    });
  }
  await scenario('Policy enabled during playback stops; disabling it or closing Menu never silently cancels stop', async () => {
    const h = setup(); h.run(); await flush(); h.preferences.get('(prefers-reduced-motion: reduce)').change(true);
    h.open(); h.preferences.get('(prefers-reduced-motion: reduce)').change(false); h.close();
    assert.equal(h.video.paused, true); assert.equal(h.storage.get('aquatic-world-background-stop'), 'policy');
    h.control.emit('click'); await flush(); assert.equal(h.video.paused, false);
    h.connection.saveData = true; h.connection.emit('change'); assert.equal(h.video.paused, true);
  });
  await scenario('Hidden tab/pagehide suspend, eligible visibility/pageshow resume; hidden initial tab attaches nothing', async () => {
    const h = setup({ hidden: true }); h.run(); assert.equal(h.video.src, undefined);
    h.doc.hidden = false; h.doc.emit('visibilitychange'); await flush(); assert.equal(h.video.paused, false);
    h.doc.hidden = true; h.doc.emit('visibilitychange'); assert.equal(h.video.paused, true);
    h.doc.hidden = false; h.doc.emit('visibilitychange'); await flush(); assert.equal(h.video.paused, false);
    h.win.emit('pagehide'); assert.equal(h.video.paused, true); h.win.emit('pageshow'); await flush(); assert.equal(h.video.paused, false);
  });
  await scenario('Escape returns focus, Tab/Shift+Tab are not intercepted, focus exit closes without stealing focus', async () => {
    const h = setup(); h.run(); h.open(); h.links[4].focus();
    assert.equal(h.doc.emit('keydown', { key: 'Tab' }).defaultPrevented, false);
    h.summary.focus(); assert.equal(h.doc.emit('keydown', { key: 'Tab', shiftKey: true }).defaultPrevented, false);
    h.brand.focus(); assert.equal(h.menu.open, true); h.cta.focus();
    assert.equal(h.menu.open, false); assert.equal(h.doc.activeElement, h.cta);
    h.open(); h.links[2].focus(); h.doc.emit('keydown', { key: 'Escape' });
    assert.equal(h.menu.open, false); assert.equal(h.doc.activeElement, h.summary);
  });
  await scenario('Disclosure top follows measured header growth on resize/observer/open with no movie or scroll change', async () => {
    const h = setup(); h.run(); await flush(); const loads = h.video.loads; const plays = h.video.plays;
    assert.equal(h.header.style['--home-menu-top'], '64px');
    h.headerInner.bottom = 108; h.win.emit('resize'); assert.equal(h.header.style['--home-menu-top'], '108px');
    h.headerInner.bottom = 132; h.observers[0].callback(); assert.equal(h.header.style['--home-menu-top'], '132px');
    assert.equal(h.observers[0].element, h.headerInner); assert.equal(h.video.loads, loads); assert.equal(h.video.plays, plays);
    h.win.scrollY = 200; h.open(); assert.equal(h.header.style['--home-menu-top'], '132px');
    assert.equal(h.win.scrollY, 200); assert.equal(h.video.loads, loads);
  });
  await scenario('Outside and destination clicks dismiss while preserving ordinary activation; desktop breakpoint returns matching focus', async () => {
    const h = setup(); h.run(); h.open(); const event = h.doc.emit('click', { target: h.cta });
    assert.equal(h.menu.open, false); assert.equal(event.defaultPrevented, false);
    h.open(); const destination = h.doc.emit('click', { target: h.links[1] });
    assert.equal(h.menu.open, false); assert.equal(destination.defaultPrevented, false);
    h.open(); h.links[3].focus(); h.preferences.get('(max-width: 1119px)').change(false);
    assert.equal(h.menu.open, false); assert.equal(h.doc.activeElement, h.desktops[3]);
  });
  await scenario('Late pending play completion cannot cancel menu suspension or manual Pause', async () => {
    for (const stop of ['menu', 'manual']) {
      const h = setup({ playMode: 'pending' }); h.run(); assert.equal(h.pending.length, 1);
      if (stop === 'menu') h.open(); else h.control.emit('click');
      // Model a delayed native play completion after the requested stop.
      h.video.paused = false; h.pending[0].resolve(); await flush(); assert.equal(h.video.paused, true);
      h.video.paused = false; h.video.emit('playing'); assert.equal(h.video.paused, true);
      assert.equal(h.environment.dataset.state, stop === 'menu' ? 'suspended' : 'paused');
    }
  });
  await scenario('Autoplay rejection yields explicit Play retry; unsupported source preserves matching poster and hides utility', async () => {
    const blocked = setup({ playMode: 'NotAllowedError' }); blocked.run(); await flush();
    assert.equal(blocked.environment.dataset.state, 'blocked'); assert.equal(blocked.control.getAttribute('aria-label'), 'Play background');
    blocked.open(); blocked.close(); assert.equal(blocked.video.plays, 1);
    blocked.video.play = () => { blocked.video.paused = false; return Promise.resolve(); };
    blocked.control.emit('click'); await flush(); assert.equal(blocked.video.paused, false);
    const failed = setup({ playMode: 'NotSupportedError' }); failed.run(); await flush();
    assert.equal(failed.environment.dataset.frame, 'poster'); assert.equal(failed.environment.dataset.state, 'unavailable');
    assert.equal(failed.control.hidden, true); failed.open(); failed.close(); assert.equal(failed.control.hidden, true);
  });
  await scenario('Decode/buffering/poster fallbacks and focus recovery do not introduce new playback intent', async () => {
    const h = setup(); h.run(); await flush(); h.video.emit('playing'); h.video.emit('waiting');
    assert.equal(h.environment.dataset.state, 'buffering'); assert.equal(h.environment.dataset.frame, 'video');
    h.video.emit('stalled'); assert.equal(h.environment.dataset.state, 'buffering');
    h.control.focus(); h.video.error = { code: 3 }; h.video.emit('error');
    assert.equal(h.control.hidden, true); assert.equal(h.environment.dataset.frame, 'poster');
    assert.equal(h.doc.activeElement, h.cta); h.poster.emit('error'); assert.equal(h.poster.hidden, true);
    h.poster.emit('load'); assert.equal(h.poster.hidden, false);
  });
  await scenario('Orientation selects exact HTML-owned rebased sources; changing while paused defers new film until opt-in', async () => {
    const h = setup({ prefix: '/project/demo' }); h.run(); await flush();
    assert.equal(h.video.src, '/project/demo/assets/immersive/portrait.mp4');
    h.preferences.get('(min-aspect-ratio: 6/5)').change(true); await flush();
    assert.equal(h.video.src, '/project/demo/assets/immersive/landscape.mp4');
    assert.equal(h.video.poster, '/project/demo/assets/immersive/landscape-poster.webp');
    h.control.emit('click'); h.preferences.get('(min-aspect-ratio: 6/5)').change(false);
    assert.equal(h.video.src, undefined); assert.equal(h.video.preload, 'none');
    h.open(); h.close(); assert.equal(h.video.src, undefined);
    h.control.emit('click'); await flush(); assert.equal(h.video.src, '/project/demo/assets/immersive/portrait.mp4');
  });
  await scenario('Disabled storage still respects manual Pause; scrolling does not reload or restart film', async () => {
    const h = setup({ noStorage: true }); h.run(); await flush(); const loads = h.video.loads;
    const plays = h.video.plays; h.win.scrollY = 600; h.win.emit('scroll');
    assert.equal(h.header.dataset.scrolled, 'true'); assert.equal(h.video.loads, loads); assert.equal(h.video.plays, plays);
    h.control.emit('click'); h.open(); h.close(); assert.equal(h.video.paused, true);
  });
  await scenario('Home bypasses shared modal-era menu wiring; inner menu still retains baseline Escape behavior', async () => {
    const home = setup(); vm.runInContext(shared, home.context); assert.equal(home.doc.events.size, 0);
    const inner = setup({ home: false }); inner.run(); inner.open(); inner.doc.emit('keydown', { key: 'Escape' });
    assert.equal(inner.menu.open, false); assert.equal(inner.doc.activeElement, inner.summary);
  });
  function contact(search) {
    const h = setup({ home: false }); h.win.location.search = search;
    const form = h.make('#enquiry-form', 'form'); form.elements = {};
    for (const name of ['name', 'email', 'project', 'category']) {
      const field = new Element(h.doc, name === 'category' ? 'select' : 'input');
      field.name = name; field.id = name; field.value = ''; field.validity = { typeMismatch: false };
      form.elements[name] = field;
    }
    const category = form.elements.category;
    category.options = ['general', 'ornamental-fish', 'aquatic-plants', 'driftwood'].map((value, index) => ({ value,
      textContent: ['Not sure yet', 'Ornamental Fish', 'Aquatic Plants', 'Driftwood'][index] }));
    category.value = 'general'; Object.defineProperty(category, 'selectedOptions', {
      get() { return category.options.filter(option => option.value === category.value); } });
    for (const selector of ['#category-context', '#error-summary', '#preview-result', '#preview-content',
      '#preview-button', '#form-status', '#local-disclosure', '#enquiry-fields', '#edit-brief', '#clear-preview',
      '#name-error', '#email-error', '#project-error']) h.make(selector);
    form.reset = () => form.emit('reset'); h.run(); return { ...h, form, fields: form.elements };
  }
  for (const slug of ['ornamental-fish', 'aquatic-plants', 'driftwood', 'invalid']) {
    await scenario(`Contact category query context retained and unknown value ignored: ${slug}`, async () => {
      const h = contact('?category=' + slug); assert.equal(h.fields.category.value, slug === 'invalid' ? 'general' : slug);
      assert.equal(h.doc.querySelector('#preview-button').disabled, false);
      assert.equal(h.doc.querySelector('#enquiry-fields').disabled, false);
    });
  }
  await scenario('Contact validates required fields, email validity and project limits; safe local preview/Edit/Clear retains four groups', async () => {
    const h = contact('?category=driftwood'); const { doc, fields, form } = h;
    assert.equal(form.emit('submit').defaultPrevented, true);
    assert.equal(doc.querySelector('#error-summary').hidden, false);
    assert.equal(doc.activeElement, doc.querySelector('#error-summary'));
    assert.equal(fields.name.getAttribute('aria-invalid'), 'true');
    fields.name.value = 'Sample'; fields.email.value = 'invalid'; fields.email.validity.typeMismatch = true;
    fields.project.value = 'An illustrative aquarium plan with branching wood.'; form.emit('submit');
    assert.equal(fields.email.getAttribute('aria-invalid'), 'true');
    fields.email.value = 'sample@example.com'; fields.email.validity.typeMismatch = false;
    fields.project.value = 'x'.repeat(2001); form.emit('submit'); assert.equal(fields.project.getAttribute('aria-invalid'), 'true');
    fields.project.value = '<script>illustrative aquarium only</script>'; form.emit('submit');
    assert.equal(form.hidden, true); assert.equal(doc.querySelector('#preview-result').hidden, false);
    const output = doc.querySelector('#preview-content'); assert.equal(output.children.length, 8);
    assert.deepEqual(output.children.filter(child => child.tag === 'dt').map(child => child.textContent), ['Name', 'Email', 'Collection', 'Project']);
    assert.equal(output.children[7].textContent, fields.project.value); // text, not HTML execution
    doc.querySelector('#edit-brief').emit('click'); assert.equal(form.hidden, false);
    assert.equal(doc.activeElement, fields.project); assert.equal(fields.category.value, 'driftwood');
    fields.name.value = ''; fields.name.emit('input'); assert.equal(doc.querySelector('#preview-result').hidden, true);
    assert.equal(fields.name.getAttribute('aria-invalid'), 'true');
    doc.querySelector('#clear-preview').emit('click'); assert.equal(fields.category.value, 'general');
    assert.equal(fields.project.value, ''); assert.equal(output.children.length, 0);
    assert.equal(doc.querySelector('#error-summary').hidden, true); assert.equal(doc.activeElement, fields.name);
    assert.match(doc.querySelector('#form-status').textContent, /Brief cleared/);
  });
  fs.writeFileSync(path.join(root, 'evidence/controller-results.json'), JSON.stringify({
    passed: results, environment: 'Node vm with bounded DOM/event/media doubles; no browser or network',
    limits: 'No native details default action, CSS layout, real focus traversal, download/decoder or rendering verified'
  }, null, 2) + '\n');
  console.log(`${results.length} controller scenarios passed; these are logic checks only.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
