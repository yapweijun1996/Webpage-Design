// Browser verification suite. Starts its own server on dist/, runs checks with Playwright Chromium,
// and writes screenshots + results to ../evidence/revision-round-2/.
// Usage: npm test   (or: node tests/verify.mjs after a build)
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir, writeFile, readFile, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, '..', 'evidence', 'revision-round-2');
const shotDir = join(outDir, 'screenshots');
const PORT = 4321;
const BASE = `http://127.0.0.1:${PORT}`;
const PAGES = { default: '/', tidewell: '/fixtures/tidewell/', minimal: '/fixtures/minimal/' };
const OVERFLOW_WIDTHS = [320, 360, 390, 430, 768, 1024, 1280, 1440, 1920];

const results = [];
function record(id, pass, detail) {
  results.push({ id, status: pass ? 'pass' : 'fail', detail });
  console.log(`${pass ? 'PASS' : 'FAIL'} ${id}${detail ? ' — ' + (typeof detail === 'string' ? detail : JSON.stringify(detail)) : ''}`);
}

let server = null;

async function main() {
  await mkdir(shotDir, { recursive: true });
  server = spawn(process.execPath, [join(root, 'scripts/serve.mjs'), String(PORT)], { stdio: 'pipe' });
  await new Promise((r) => server.stdout.once('data', r));
  const browser = await chromium.launch();
  const env = { browser: `Chromium ${browser.version()} (Playwright headless)` };

  async function open(path, viewport, opts = {}) {
    const context = await browser.newContext({ viewport, ...opts });
    const page = await context.newPage();
    const issues = { console: [], pageErrors: [], badResponses: [], requests: [] };
    page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') issues.console.push(`${m.type()}: ${m.text()}`); });
    page.on('pageerror', (e) => issues.pageErrors.push(String(e)));
    page.on('response', (r) => { if (r.status() >= 400) issues.badResponses.push(`${r.status()} ${r.url()}`); });
    page.on('request', (r) => issues.requests.push({ url: r.url(), method: r.method(), type: r.resourceType() }));
    await page.goto(BASE + path, { waitUntil: 'networkidle' });
    return { page, context, issues };
  }
  async function loadAllImages(page) {
    await page.evaluate(async () => {
      for (const img of document.images) img.loading = 'eager';
      await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
    });
    await page.waitForLoadState('networkidle');
  }
  const inViewport = (page, sel) => page.evaluate((s) => {
    const r = document.querySelector(s).getBoundingClientRect();
    return r.top < innerHeight && r.bottom > 0;
  }, sel);
  // Waits for smooth scrolling to finish: scroll position unchanged across consecutive frames (max ~3s).
  const settle = (page) => page.evaluate(() => new Promise((resolve) => {
    let last = -1, still = 0, n = 0;
    (function tick() {
      still = scrollY === last ? still + 1 : 0; last = scrollY; n++;
      if (still >= 10 || n > 180) resolve(); else requestAnimationFrame(tick);
    })();
  }));

  // 1. Layout screenshots
  const shots = [
    ['default', 1440, 900], ['default', 1280, 800], ['default', 1024, 768], ['default', 768, 1024], ['default', 390, 844], ['default', 320, 640],
    ['tidewell', 768, 1024],
    ['tidewell', 1440, 900], ['tidewell', 390, 844], ['minimal', 1440, 900], ['minimal', 390, 844]
  ];
  for (const [name, w, h] of shots) {
    const { page, context, issues } = await open(PAGES[name], { width: w, height: h });
    await page.screenshot({ path: join(shotDir, `${name}-${w}x${h}-viewport.png`) });
    await loadAllImages(page);
    await page.screenshot({ path: join(shotDir, `${name}-${w}x${h}-full.png`), fullPage: true });
    record(`runtime-clean:${name}@${w}`, !issues.console.length && !issues.pageErrors.length && !issues.badResponses.length, issues.console.concat(issues.pageErrors, issues.badResponses).join('; ') || 'no console errors/warnings, page errors or 4xx/5xx');
    await context.close();
  }

  // 2. Horizontal overflow matrix
  for (const [name, path] of Object.entries(PAGES)) {
    const bad = [];
    for (const w of OVERFLOW_WIDTHS) {
      const { page, context } = await open(path, { width: w, height: 900 });
      const sw = await page.evaluate(() => document.documentElement.scrollWidth);
      if (sw > w) bad.push(`${w}px -> scrollWidth ${sw}`);
      // Also with the mobile menu open where it exists.
      const toggle = page.locator('[data-menu-toggle]');
      if (await toggle.isVisible()) {
        await toggle.click();
        const sw2 = await page.evaluate(() => document.documentElement.scrollWidth);
        if (sw2 > w) bad.push(`${w}px menu-open -> ${sw2}`);
      }
      await context.close();
    }
    record(`no-horizontal-overflow:${name}`, !bad.length, bad.length ? bad : `widths ${OVERFLOW_WIDTHS.join(', ')}`);
  }

  // 3. Images and links (default page, all images forced to load)
  for (const [name, path] of Object.entries(PAGES)) {
    const { page, context, issues } = await open(path, { width: 1440, height: 900 });
    await loadAllImages(page);
    const imgs = await page.evaluate(() => [...document.images].map((i) => ({ src: i.currentSrc, ok: i.complete && i.naturalWidth > 0, alt: i.getAttribute('alt') })));
    const broken = imgs.filter((i) => !i.ok);
    record(`images-resolve:${name}`, !broken.length && !issues.badResponses.length, broken.length ? broken : `${imgs.length} images decoded`);
    const links = await page.evaluate(() => [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')));
    const anchors = links.filter((h) => h.startsWith('#') && h.length > 1);
    const missing = await page.evaluate((hs) => hs.filter((h) => !document.getElementById(h.slice(1))), anchors);
    const external = links.filter((h) => !h.startsWith('#'));
    record(`in-page-links-resolve:${name}`, !missing.length && !external.length, missing.length ? { missing } : external.length ? { external } : `${links.length} links, all resolve to rendered ids`);
    const h1 = await page.locator('h1').count();
    const landmarks = await page.evaluate(() => ['header', 'nav', 'main', 'footer'].every((t) => document.querySelector(t)));
    record(`semantics:${name}`, h1 === 1 && landmarks, `h1 count ${h1}; header/nav/main/footer present ${landmarks}`);
    await context.close();
  }

  // 4. Main journey: hero CTAs and nav (desktop)
  {
    const { page, context } = await open('/', { width: 1440, height: 900 });
    await page.locator('.hero__actions a').nth(0).click(); await settle(page);
    record('cta-primary-reaches-collections', (await page.evaluate(() => location.hash)) === '#collections' && await inViewport(page, '#collections-title'));
    await page.locator('.hero__actions a').nth(1).click(); await settle(page);
    record('cta-secondary-reaches-enquiry', (await page.evaluate(() => location.hash)) === '#enquiry' && await inViewport(page, '#enquiry-title'));
    const header = await page.evaluate(() => document.querySelector('[data-header]').classList.contains('is-scrolled'));
    record('header-solid-on-scroll', header);
    const navResults = [];
    for (const a of await page.locator('.site-nav a').all()) {
      const href = await a.getAttribute('href');
      await a.click(); await settle(page);
      const target = await page.evaluate((h) => {
        const el = document.getElementById(h.slice(1));
        const r = el.getBoundingClientRect();
        const headerH = document.querySelector('[data-header]').getBoundingClientRect().height;
        return { top: Math.round(r.top), visible: r.top < innerHeight && r.bottom > headerH };
      }, href);
      navResults.push({ href, ...target });
    }
    record('header-nav-reaches-sections', navResults.every((n) => n.visible), navResults);
    const headerCta = page.locator('.site-header .btn');
    await headerCta.click(); await settle(page);
    record('header-cta-reaches-enquiry', await inViewport(page, '#enquiry-title'));
    await context.close();
  }

  // 5. Mobile menu keyboard/focus/Escape
  {
    const { page, context } = await open('/', { width: 390, height: 844 });
    const toggle = page.locator('[data-menu-toggle]');
    const menuHiddenInitially = !(await page.locator('#site-menu').isVisible());
    await toggle.focus(); await page.keyboard.press('Enter');
    const expanded = await toggle.getAttribute('aria-expanded');
    const focusFirst = await page.evaluate(() => document.activeElement.matches('.site-nav li:first-child a'));
    const label = await page.locator('[data-menu-label]').textContent();
    const scrollLocked = await page.evaluate(() => getComputedStyle(document.body).overflow === 'hidden');
    // Tab through to end, then confirm wrap back to toggle
    const count = await page.locator('#site-menu a').count();
    for (let i = 0; i < count; i++) await page.keyboard.press('Tab');
    const wrapped = await page.evaluate(() => document.activeElement.hasAttribute('data-menu-toggle'));
    await page.keyboard.press('Shift+Tab');
    const wrappedBack = await page.evaluate(() => document.activeElement.matches('#site-menu .btn'));
    await page.keyboard.press('Escape');
    const closed = (await toggle.getAttribute('aria-expanded')) === 'false' && !(await page.locator('#site-menu').isVisible());
    const focusReturned = await page.evaluate(() => document.activeElement.hasAttribute('data-menu-toggle'));
    await page.screenshot({ path: join(shotDir, 'default-390x844-menu-closed.png') });
    await toggle.click();
    await page.screenshot({ path: join(shotDir, 'default-390x844-menu-open.png') });
    await page.locator('.site-nav a', { hasText: 'Quality' }).click(); await settle(page);
    const linkClosed = (await toggle.getAttribute('aria-expanded')) === 'false';
    const reached = await inViewport(page, '#quality-title');
    record('mobile-menu', menuHiddenInitially && expanded === 'true' && focusFirst && label === 'Close' && scrollLocked && wrapped && wrappedBack && closed && focusReturned && linkClosed && reached,
      { menuHiddenInitially, expanded, focusFirst, label, scrollLocked, tabWrapsToToggle: wrapped, shiftTabWrapsToLast: wrappedBack, escapeCloses: closed, focusReturned, linkClickCloses: linkClosed, linkReachesQuality: reached });
    await context.close();
  }

  // 6. Skip link + keyboard focus visibility
  {
    const { page, context } = await open('/', { width: 1440, height: 900 });
    await page.keyboard.press('Tab');
    const skip = await page.evaluate(() => ({ isSkip: document.activeElement.classList.contains('skip-link'), visible: document.activeElement.getBoundingClientRect().top >= 0 }));
    await page.keyboard.press('Enter');
    const mainFocused = await page.evaluate(() => document.activeElement.id === 'main');
    await page.keyboard.press('Tab');
    const outline = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle + ' ' + getComputedStyle(document.activeElement).outlineWidth);
    record('skip-link-and-focus-ring', skip.isSkip && skip.visible && mainFocused && outline.startsWith('solid'), { ...skip, mainFocused, firstFocusOutline: outline });
    await context.close();
  }

  // 7. Collection explorer
  {
    const { page, context } = await open('/', { width: 1440, height: 900 });
    const hiddenInitially = !(await page.locator('#collection-explorer').isVisible());
    await page.locator('.collection-card__link').nth(1).click(); await settle(page);
    const state = await page.evaluate(() => ({
      hash: location.hash,
      open: getComputedStyle(document.getElementById('collection-explorer')).display !== 'none',
      visiblePanels: [...document.querySelectorAll('[data-collection-panel]')].filter((p) => !p.hidden).map((p) => p.id),
      focus: document.activeElement.id,
      current: document.querySelector('.collection-card__link[aria-current="true"]')?.dataset.collectionLink
    }));
    await page.screenshot({ path: join(shotDir, 'default-1440x900-collection-detail.png') });
    const panelInView = await inViewport(page, '#collection-aquatic-plants');
    // Switch via index
    await page.locator('.explorer__index a', { hasText: 'Driftwood' }).click(); await settle(page);
    const switched = await page.evaluate(() => [...document.querySelectorAll('[data-collection-panel]')].filter((p) => !p.hidden).map((p) => p.id));
    // Escape closes and returns focus to the originating card
    await page.keyboard.press('Escape');
    const afterEsc = await page.evaluate(() => ({ open: getComputedStyle(document.getElementById('collection-explorer')).display !== 'none', focus: document.activeElement.getAttribute('href') }));
    // View all
    await page.locator('[data-explorer-open]').click(); await settle(page);
    const viewAll = await page.evaluate(() => ({ open: getComputedStyle(document.getElementById('collection-explorer')).display !== 'none', focus: document.activeElement.id }));
    // Enquiry link from panel preselects topic
    await page.locator('#collection-ornamental-fish').evaluate(() => {});
    await page.locator('.explorer__index a', { hasText: 'Ornamental Fish' }).click(); await settle(page);
    await page.locator('#collection-ornamental-fish [data-enquiry-topic]').click(); await settle(page);
    const topic = await page.evaluate(() => ({ value: document.getElementById('enq-topic').value, formVisible: !document.getElementById('enquiry-form').hidden, hash: location.hash, explorerOpen: document.getElementById('collection-explorer').classList.contains('is-open') }));
    topic.enquiryInView = await inViewport(page, '#enquiry-title');
    record('collection-explorer',
      hiddenInitially && state.open && state.visiblePanels.join() === 'collection-aquatic-plants' && state.focus === 'collection-aquatic-plants' && state.current === 'aquatic-plants' && panelInView &&
      switched.join() === 'collection-driftwood' && !afterEsc.open && afterEsc.focus === '#collection-aquatic-plants' && viewAll.open && viewAll.focus === 'collection-explorer' &&
      topic.value === 'ornamental-fish' && topic.formVisible && topic.hash === '#enquiry' && !topic.explorerOpen && topic.enquiryInView,
      { hiddenInitially, afterCardClick: state, panelInView, afterIndexSwitch: switched, afterEscape: afterEsc, viewAll, askAboutCollection: topic });
    await context.close();
  }
  {
    // Highlight card opens related collection; deep link opens panel on load
    const { page, context } = await open('/', { width: 390, height: 844 });
    await page.locator('.highlight-card__link').nth(3).click(); await settle(page);
    const hl = await page.evaluate(() => [...document.querySelectorAll('[data-collection-panel]')].filter((p) => !p.hidden).map((p) => p.id).join());
    await page.goto(BASE + '/#collection-ornamental-fish', { waitUntil: 'networkidle' }); await settle(page);
    const deep = await page.evaluate(() => [...document.querySelectorAll('[data-collection-panel]')].filter((p) => !p.hidden).map((p) => p.id).join());
    const deepInView = await inViewport(page, '#collection-ornamental-fish-title');
    await page.screenshot({ path: join(shotDir, 'default-390x844-collection-deeplink.png') });
    record('highlight-and-deeplink-open-collection', hl === 'collection-driftwood' && deep === 'collection-ornamental-fish' && deepInView, { highlightOpens: hl, deepLinkOpens: deep, deepInView });
    await context.close();
  }

  // 7b. History synchronisation: URL and visible explorer must agree after Back/Forward.
  {
    const { page, context } = await open('/', { width: 1440, height: 900 });
    const st = () => page.evaluate(() => ({
      hash: location.hash,
      open: document.getElementById('collection-explorer').classList.contains('is-open'),
      panel: [...document.querySelectorAll('[data-collection-panel]')].filter((p) => !p.hidden && p.closest('.is-open')).map((p) => p.id).join() || null,
      current: document.querySelector('.collection-card__link[aria-current="true"]')?.dataset.collectionLink || null
    }));
    const steps = {};
    await page.locator('.collection-card__link').nth(0).click(); await settle(page);
    steps.openFish = await st();
    await page.locator('.explorer__index a', { hasText: 'Driftwood' }).click(); await settle(page);
    steps.switchDriftwood = await st();
    await page.goBack(); await settle(page);
    steps.backToFish = await st();
    await page.goBack(); await settle(page);
    steps.backToEmpty = await st();
    await page.goForward(); await settle(page);
    steps.forwardToFish = await st();
    steps.forwardFocus = await page.evaluate(() => document.activeElement.id);
    // Unrelated hash while a detail is open, then Back/Forward around it.
    await page.locator('.site-nav a[href="#quality"]').click(); await settle(page);
    steps.navToQuality = { ...(await st()), qualityInView: await inViewport(page, '#quality-title') };
    await page.goBack(); await settle(page);
    steps.backFromQuality = await st();
    // Navigate to enquiry while a detail is open (header CTA).
    await page.locator('.site-header .btn').click(); await settle(page);
    steps.enquiryWhileOpen = { ...(await st()), enquiryInView: await inViewport(page, '#enquiry-title') };
    await page.goBack(); await settle(page);
    steps.backFromEnquiry = await st();
    // Close button returns focus and leaves no stale state on Back.
    await page.locator('[data-explorer-close]').click(); await settle(page);
    steps.closed = { ...(await st()), focus: await page.evaluate(() => document.activeElement.getAttribute('href')) };
    const ok =
      steps.openFish.panel === 'collection-ornamental-fish' && steps.openFish.hash === '#collection-ornamental-fish' &&
      steps.switchDriftwood.panel === 'collection-driftwood' && steps.switchDriftwood.current === 'driftwood' &&
      steps.backToFish.panel === 'collection-ornamental-fish' && steps.backToFish.hash === '#collection-ornamental-fish' &&
      steps.backToEmpty.hash === '' && !steps.backToEmpty.open && !steps.backToEmpty.current &&
      steps.forwardToFish.panel === 'collection-ornamental-fish' && steps.forwardFocus === 'collection-ornamental-fish' &&
      steps.navToQuality.hash === '#quality' && !steps.navToQuality.open && steps.navToQuality.qualityInView &&
      steps.backFromQuality.panel === 'collection-ornamental-fish' &&
      steps.enquiryWhileOpen.hash === '#enquiry' && !steps.enquiryWhileOpen.open && steps.enquiryWhileOpen.enquiryInView &&
      steps.backFromEnquiry.panel === 'collection-ornamental-fish' &&
      !steps.closed.open && steps.closed.hash === '#collections' && steps.closed.focus === '#collection-ornamental-fish';
    record('history-back-forward-sync', ok, steps);
    await context.close();
  }
  {
    // Initial load with a category hash, then Back to an unrelated page state via a new hash.
    const { page, context } = await open('/#collection-driftwood', { width: 768, height: 1024 });
    await settle(page);
    const initial = await page.evaluate(() => [...document.querySelectorAll('[data-collection-panel]')].filter((p) => !p.hidden).map((p) => p.id).join());
    const tidewell = await open('/fixtures/tidewell/#collection-display-fish', { width: 390, height: 844 });
    await settle(tidewell.page);
    const fifth = await tidewell.page.evaluate(() => [...document.querySelectorAll('[data-collection-panel]')].filter((p) => !p.hidden).map((p) => p.id).join());
    await tidewell.page.locator('.explorer__index a', { hasText: 'Freshwater Fish' }).click(); await settle(tidewell.page);
    await tidewell.page.goBack(); await settle(tidewell.page);
    const back = await tidewell.page.evaluate(() => [...document.querySelectorAll('[data-collection-panel]')].filter((p) => !p.hidden).map((p) => p.id).join());
    record('history-initial-load-and-five-categories', initial === 'collection-driftwood' && fifth === 'collection-display-fish' && back === 'collection-display-fish', { defaultInitial: initial, tidewellInitial: fifth, tidewellBackAfterSwitch: back });
    await tidewell.context.close();
    await context.close();
  }

  // 7c. Text over photography: computed colour vs the measured pixels behind the text's own glyph box
  // (text hidden, area screenshotted, 95th-percentile background luminance). WCAG: 4.5:1, or 3:1 for large text.
  async function measureContrast(page, el) {
    await el.scrollIntoViewIfNeeded(); await settle(page);
    const info = await el.evaluate((node) => {
      const range = document.createRange(); range.selectNodeContents(node);
      const r = range.getBoundingClientRect(); const cs = getComputedStyle(node);
      const size = parseFloat(cs.fontSize); const bold = parseInt(cs.fontWeight, 10) >= 700; const color = cs.color;
      const nodes = [node, ...node.querySelectorAll('*')];
      nodes.forEach((n) => { n.dataset.prevStyle = n.getAttribute('style') || ''; n.style.setProperty('color', 'transparent', 'important'); n.style.setProperty('text-shadow', 'none', 'important'); });
      return { rect: { x: r.left, y: r.top, width: r.width, height: r.height }, color, large: size >= 24 || (bold && size >= 18.66) };
    });
    const vw = page.viewportSize();
    const clip = { x: Math.max(0, info.rect.x), y: Math.max(0, info.rect.y), width: Math.min(info.rect.width, vw.width - Math.max(0, info.rect.x)), height: Math.min(info.rect.height, vw.height - Math.max(0, info.rect.y)) };
    const png = await page.screenshot({ clip });
    await el.evaluate((node) => [node, ...node.querySelectorAll('*')].forEach((n) => { n.setAttribute('style', n.dataset.prevStyle); delete n.dataset.prevStyle; }));
    const bg = await page.evaluate(async (b64) => {
      const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
      const g = c.getContext('2d'); g.drawImage(img, 0, 0);
      const d = g.getImageData(0, 0, c.width, c.height).data; const lum = [];
      const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
      for (let i = 0; i < d.length; i += 4) lum.push(0.2126 * lin(d[i]) + 0.7152 * lin(d[i + 1]) + 0.0722 * lin(d[i + 2]));
      lum.sort((a, b) => a - b);
      return { p95: lum[Math.floor(lum.length * 0.95)], max: lum[lum.length - 1] };
    }, png.toString('base64'));
    const [r, g, b] = info.color.match(/[\d.]+/g).map(Number);
    const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    const fg = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
    const ratio = (Math.max(fg, bg.p95) + 0.05) / (Math.min(fg, bg.p95) + 0.05);
    return { ratio: +ratio.toFixed(2), min: info.large ? 3 : 4.5, color: info.color };
  }
  const PHOTO_TEXT = [
    '.heritage__caption span',
    '.hero__eyebrow', '.hero__title', '.hero__accent', '.hero__lead', '.hero__proof li', '.demo-note', '.side-note--top', '.side-note--bottom',
    '.highlights .eyebrow', '.highlights .section-title', '.highlights__note', '.highlight-card__title', '.side-note--highlights',
    '.enquiry .eyebrow', '.enquiry .section-title', '.enquiry__lead', '.enquiry__notice', '.side-note--enquiry', '.enquiry__signature'
  ];
  for (const [w, h] of [[1920, 1080], [1440, 900], [1280, 800], [1024, 768], [768, 1024], [390, 844]]) {
    for (const [name, path] of [['default', '/'], ['tidewell', '/fixtures/tidewell/']]) {
      const { page, context } = await open(path, { width: w, height: h });
      await loadAllImages(page);
      const out = {}; let ok = true;
      for (const sel of PHOTO_TEXT) {
        for (const [i, el] of (await page.locator(sel).all()).entries()) {
          if (!(await el.isVisible())) continue;
          const m = await measureContrast(page, el);
          out[`${sel}${i ? `[${i}]` : ''}`] = m.ratio;
          if (m.ratio < m.min) { ok = false; out[`${sel}${i ? `[${i}]` : ''}`] = `${m.ratio} < ${m.min} (${m.color})`; }
        }
      }
      const cap = await page.locator('.heritage__caption span').evaluate((e) => getComputedStyle(e).color);
      record(`photo-text-contrast:${name}@${w}`, ok && cap === 'rgb(255, 255, 255)', { headingCaptionColor: cap, ratios: out });
      await context.close();
    }
  }

  // 7d. Hero: copy must not overlap the fish. Fish box = measured region of the source image (x 54–92%, y 10–86%),
  // mapped through object-fit: cover and the computed object-position.
  for (const [name, path] of [['default', '/'], ['tidewell', '/fixtures/tidewell/']]) {
    const res = {};
    for (const [w, h] of [[1920, 1080], [1440, 900], [1280, 800], [1200, 800], [1024, 768], [768, 1024], [430, 932], [390, 844], [320, 640]]) {
      const { page, context } = await open(path, { width: w, height: h });
      res[w] = await page.evaluate(() => {
        const img = document.querySelector('.hero__img'); const r = img.getBoundingClientRect();
        const scale = Math.max(r.width / img.naturalWidth, r.height / img.naturalHeight);
        const sw = img.naturalWidth * scale, sh = img.naturalHeight * scale;
        const [px, py] = getComputedStyle(img).objectPosition.split(' ').map((v) => parseFloat(v) / 100);
        const ox = r.left + (r.width - sw) * px, oy = r.top + (r.height - sh) * py;
        const fish = { left: ox + 0.54 * sw, right: ox + 0.92 * sw, top: oy + 0.10 * sh, bottom: oy + 0.86 * sh };
        const vis = { left: Math.max(fish.left, r.left), right: Math.min(fish.right, r.right), top: Math.max(fish.top, r.top), bottom: Math.min(fish.bottom, r.bottom) };
        const visibleShare = Math.max(0, vis.right - vis.left) * Math.max(0, vis.bottom - vis.top) / ((fish.right - fish.left) * (fish.bottom - fish.top));
        const texts = [...document.querySelectorAll('.hero__eyebrow, .hero__title, .hero__lead, .hero__actions .btn, .hero__proof li, .demo-note')].map((e) => e.getBoundingClientRect());
        const overlap = texts.some((t) => t.right > vis.left + 4 && t.left < vis.right && t.bottom > vis.top && t.top < vis.bottom);
        const header = document.querySelector('[data-header]').getBoundingClientRect();
        const headerOverFish = header.bottom > vis.top + 4;
        return { textOverlapsFish: overlap, fishVisibleShare: +visibleShare.toFixed(3), headerOverFish };
      });
      await context.close();
    }
    record(`hero-copy-clear-of-fish:${name}`, Object.entries(res).every(([w, v]) => !v.textOverlapsFish && v.fishVisibleShare >= 0.9 && (+w >= 1200 || !v.headerOverFish)), { note: 'headerOverFish must be false below 1200px (stacked hero); the overlay at >=1200px is intended', ...res });
  }

  // 7e. Desktop band proportions vs the reference (reference measured at its 1045px page width, scaled to 1440).
  {
    const { page, context } = await open('/', { width: 1440, height: 900 });
    const heights = await page.evaluate(() => Object.fromEntries([...document.querySelectorAll('main > section, body > footer')].map((e) => [e.id || 'footer', Math.round(e.getBoundingClientRect().height)])));
    const reference = { top: 558, heritage: 296, collections: 288, quality: 212, highlights: 207, enquiry: 240, footer: 61 };
    const total = Object.values(heights).reduce((a, b) => a + b, 0);
    const ratios = Object.fromEntries(Object.entries(reference).map(([k, v]) => [k, +(heights[k] / v).toFixed(2)]));
    // Each band within ±25% of its scaled reference height (not a total-height target).
    record('desktop-band-proportions', Object.values(ratios).every((r) => r >= 0.75 && r <= 1.25), { measured1440: heights, referenceScaled1440: reference, ratioToReference: ratios, total, referenceTotal: 1862 });
    await context.close();
  }

  // 8. Enquiry preview form: validation, never a success, nothing sent
  {
    const { page, context, issues } = await open('/', { width: 1440, height: 900 });
    const notice = await page.locator('#enquiry-notice').textContent();
    await page.locator('[data-form-toggle]').click();
    const formOpen = await page.locator('#enquiry-form').isVisible();
    const before = issues.requests.length;
    await page.locator('#enquiry-form button[type=submit]').click();
    const invalid = await page.evaluate(() => ({
      summaryVisible: !document.querySelector('[data-error-summary]').hidden,
      summaryFocused: document.activeElement.hasAttribute('data-error-summary'),
      role: document.querySelector('[data-error-summary]').getAttribute('role'),
      invalidFields: [...document.querySelectorAll('#enquiry-form [aria-invalid="true"]')].map((e) => e.id),
      resultHidden: document.querySelector('[data-form-result]').hidden
    }));
    await page.screenshot({ path: join(shotDir, 'default-1440x900-enquiry-errors.png') });
    await page.fill('#enq-name', 'Test Visitor');
    await page.fill('#enq-email', 'not-an-email');
    await page.fill('#enq-message', 'Hello there, testing.');
    await page.locator('#enquiry-form button[type=submit]').click();
    const emailOnly = await page.evaluate(() => [...document.querySelectorAll('#enquiry-form [aria-invalid="true"]')].map((e) => e.id));
    await page.fill('#enq-email', 'visitor@example.com');
    await page.locator('#enquiry-form button[type=submit]').click();
    const valid = await page.evaluate(() => ({
      result: document.querySelector('[data-form-result]').hidden ? null : document.querySelector('[data-form-result]').textContent,
      summaryHidden: document.querySelector('[data-error-summary]').hidden,
      url: location.href
    }));
    await page.locator('[data-form-result]').scrollIntoViewIfNeeded();
    await page.screenshot({ path: join(shotDir, 'default-1440x900-enquiry-preview-result.png') });
    const sent = issues.requests.slice(before).filter((r) => r.method !== 'GET' || r.type === 'fetch' || r.type === 'xhr');
    const bodyText = (await page.locator('body').innerText()).toLowerCase();
    const successWords = ['thank you', 'successfully', 'has been sent', 'we will be in touch', 'submitted'].filter((w) => bodyText.includes(w));
    record('enquiry-no-false-success',
      /unavailable/i.test(notice) && formOpen && invalid.summaryVisible && invalid.summaryFocused && invalid.role === 'alert' && invalid.invalidFields.length === 3 && invalid.resultHidden &&
      emailOnly.join() === 'enq-email' && /nothing was sent/i.test(valid.result || '') && valid.summaryHidden && !sent.length && !successWords.length,
      { notice, formOpen, emptySubmit: invalid, badEmailSubmit: emailOnly, validSubmit: valid, networkRequestsAfterOpen: sent, successWordsFound: successWords });
    await context.close();
  }

  // 9. Brand swap, residual-brand grep, optional sections, category counts
  {
    const html = {};
    for (const [name, path] of Object.entries({ default: 'dist/index.html', tidewell: 'dist/fixtures/tidewell/index.html', minimal: 'dist/fixtures/minimal/index.html' })) html[name] = await readFile(join(root, path), 'utf8');
    const shared = (await readFile(join(root, 'dist/assets/css/site.css'), 'utf8')) + (await readFile(join(root, 'dist/assets/js/site.js'), 'utf8'));
    const componentSrc = (await Promise.all((await readdir(join(root, 'src/components'))).map((f) => readFile(join(root, 'src/components', f), 'utf8')))).join('\n');
    const demoTerms = [/aquatic world/i, /singapore/i, /aquaticworld\.com/i, /nature connects/i];
    const leaks = (text) => demoTerms.filter((re) => re.test(text)).map(String);
    record('brand-swap-no-residual-demo-brand', !leaks(html.tidewell).length && /TIDEWELL STUDIO/.test(html.tidewell), { tidewellLeaks: leaks(html.tidewell) });
    record('components-and-shared-assets-brand-free', !leaks(shared).length && !leaks(componentSrc).length && !/tidewell/i.test(shared + componentSrc), { sharedLeaks: leaks(shared), componentLeaks: leaks(componentSrc) });
    record('no-location-claim-rendered', !Object.values(html).some((h) => /singapore/i.test(h)), 'Singapore absent from all built pages');
    record('unapproved-claims-suppressed', !Object.values(html).some((h) => /trusted by|global partners|quality checks/i.test(h)), 'reference claims CLM-REF-001/002 not rendered');

    const counts = {};
    for (const [name, path] of Object.entries(PAGES)) {
      const { page, context } = await open(path, { width: 1440, height: 900 });
      counts[name] = await page.evaluate(() => ({
        cards: document.querySelectorAll('.collection-card').length,
        sections: [...document.querySelectorAll('main > section')].map((s) => s.id),
        nav: [...document.querySelectorAll('.site-nav a')].map((a) => a.textContent),
        proofPoints: document.querySelectorAll('.hero__proof li').length,
        quote: !!document.querySelector('.heritage__quote'),
        formPreview: !!document.querySelector('[data-enquiry-form]'),
        brand: document.querySelector('.wordmark__name').textContent,
        accent: getComputedStyle(document.documentElement).getPropertyValue('--color-gold-400').trim()
      }));
      await context.close();
    }
    record('category-count-3-default', counts.default.cards === 3 && counts.default.sections.length === 6, counts.default);
    record('category-count-5-second-brand', counts.tidewell.cards === 5 && counts.tidewell.brand === 'TIDEWELL STUDIO' && counts.tidewell.accent.toUpperCase() === '#E7B394' && !counts.tidewell.quote && !counts.tidewell.proofPoints, counts.tidewell);
    record('category-count-1-optional-sections-hidden',
      counts.minimal.cards === 1 && counts.minimal.sections.join() === 'top,collections,enquiry' && counts.minimal.nav.join() === 'Collections,Contact' && !counts.minimal.proofPoints && !counts.minimal.quote && !counts.minimal.formPreview,
      counts.minimal);
  }

  // 10. No-JS rendering and reduced motion
  {
    const { page, context } = await open('/', { width: 390, height: 844 }, { javaScriptEnabled: false });
    const nojs = await page.evaluate(() => ({
      sections: [...document.querySelectorAll('main > section')].filter((s) => s.getBoundingClientRect().height > 0).length,
      panelsVisible: [...document.querySelectorAll('[data-collection-panel]')].filter((p) => p.getBoundingClientRect().height > 0).length,
      navVisible: document.querySelector('.site-nav').getBoundingClientRect().height > 0,
      toggleHidden: document.querySelector('[data-menu-toggle]').hidden,
      formHidden: document.querySelector('[data-enquiry-form]').hidden,
      overflow: document.documentElement.scrollWidth
    }));
    await page.screenshot({ path: join(shotDir, 'default-390x844-no-js.png') });
    record('no-js-content-visible', nojs.sections === 6 && nojs.panelsVisible === 3 && nojs.navVisible && nojs.toggleHidden && nojs.formHidden && nojs.overflow <= 390, nojs);
    await context.close();
  }
  {
    const { page, context } = await open('/', { width: 1440, height: 900 }, { reducedMotion: 'reduce' });
    const rm = await page.evaluate(() => ({
      btnTransition: getComputedStyle(document.querySelector('.btn')).transitionDuration,
      scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
      cardsVisible: [...document.querySelectorAll('.collection-card')].every((c) => getComputedStyle(c).opacity === '1')
    }));
    record('reduced-motion-respected', rm.btnTransition.split(',').every((d) => parseFloat(d) === 0) && rm.scrollBehavior === 'auto' && rm.cardsVisible, rm);
    await context.close();
  }

  // 11. Image delivery weight on initial load
  const weights = {};
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const context = await browser.newContext({ viewport: { width: w, height: h } });
    const page = await context.newPage();
    let bytes = 0; const files = [];
    page.on('response', async (r) => {
      if (r.request().resourceType() === 'image') {
        const b = (await r.body().catch(() => Buffer.alloc(0))).length; bytes += b; files.push(r.url().split('/').pop());
      }
    });
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    weights[`${w}x${h}`] = { initialImageBytes: bytes, files };
    await context.close();
  }
  record('image-delivery-weight', Object.values(weights).every((v) => v.initialImageBytes < 1_000_000), weights);

  await browser.close();
  server.kill();
  const summary = { ranAt: new Date().toISOString(), environment: env, base: BASE, total: results.length, passed: results.filter((r) => r.status === 'pass').length, failed: results.filter((r) => r.status === 'fail').length, results };
  await writeFile(join(outDir, 'checks.json'), JSON.stringify(summary, null, 2) + '\n');
  console.log(`\n${summary.passed}/${summary.total} checks passed -> evidence/revision-round-2/checks.json`);
  if (summary.failed) process.exitCode = 1;
}

main().catch((e) => { console.error(e); if (server) server.kill(); process.exit(1); });
