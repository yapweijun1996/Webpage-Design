async (page) => {
  const label = new URL(page.url()).port === '4181' ? 'codex' : 'claude';
  const base = `http://127.0.0.1:${label === 'codex' ? '4181' : '4182'}/`;
  const checks = [];
  const errors = [];
  const requests = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => requests.push({ method: request.method(), url: request.url() }));
  const record = (id, passed, observed) => checks.push({ id, status: passed ? 'pass' : 'fail', observed });
  const cardSelector = label === 'codex' ? '.collection-card' : '.collection-card__link';
  const detailSelector = label === 'codex' ? '[data-detail][open]' : '[data-explorer].is-open';
  const output = `__OUTPUT_ROOT__/${label}`;
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.keyboard.press('Tab');
  let focus = await page.evaluate(() => ({ text: document.activeElement.textContent.trim(), outline: getComputedStyle(document.activeElement).outlineWidth, style: getComputedStyle(document.activeElement).outlineStyle }));
  record('keyboard-skip-focus', focus.text === 'Skip to content' && parseFloat(focus.outline) > 0 && focus.style !== 'none', focus);
  const menu = page.getByRole('button', { name: 'Menu', exact: true });
  await menu.click();
  let state = await page.evaluate(() => ({ expanded: document.querySelector('[data-menu-toggle]').getAttribute('aria-expanded'), focused: document.activeElement.textContent.trim() }));
  record('menu-open-focus', state.expanded === 'true' && state.focused === 'Collections', state);
  await page.keyboard.press('Escape');
  state = await page.evaluate(() => ({ expanded: document.querySelector('[data-menu-toggle]').getAttribute('aria-expanded'), focused: document.activeElement.textContent.trim() }));
  record('menu-escape-focus-return', state.expanded === 'false' && state.focused === 'Menu', state);
  await menu.click();
  await page.locator('header a[href="#collections"]').click();
  state = await page.evaluate(() => ({ hash: location.hash, expanded: document.querySelector('[data-menu-toggle]').getAttribute('aria-expanded') }));
  record('menu-link-closes-and-navigates', state.hash === '#collections' && state.expanded === 'false', state);
  const card = page.locator(cardSelector).first();
  const destination = await card.getAttribute('href');
  await card.click();
  await page.waitForTimeout(300);
  state = await page.evaluate(selector => ({ hash: location.hash, detailsOpen: Boolean(document.querySelector(selector)), focusedTag: document.activeElement.tagName, focusedId: document.activeElement.id, overflow: document.documentElement.scrollWidth > innerWidth }), detailSelector);
  record('collection-opens-focus-and-no-overflow', state.hash === destination && state.detailsOpen && !state.overflow && state.focusedTag !== 'BODY', state);
  await page.screenshot({ path: `${output}/collection-open-mobile.png`, fullPage: false });
  await page.keyboard.press('Escape');
  state = await page.evaluate(selector => ({ detailsOpen: Boolean(document.querySelector(selector)), focusedHref: document.activeElement.getAttribute('href') }), detailSelector);
  record('collection-escape-focus-return', !state.detailsOpen && state.focusedHref === destination, state);
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.locator(cardSelector).first().click();
  await page.goBack({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(200);
  state = await page.evaluate(selector => ({ hash: location.hash, detailsOpen: Boolean(document.querySelector(selector)) }), detailSelector);
  record('browser-back-restores-closed-details', !state.detailsOpen && !state.hash, state);
  await page.goto(base + destination, { waitUntil: 'networkidle' });
  state = await page.evaluate(selector => ({ hash: location.hash, detailsOpen: Boolean(document.querySelector(selector)) }), detailSelector);
  record('collection-direct-link', state.detailsOpen && state.hash === destination, state);
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.locator('main a[href="#enquiry"]').first().click();
  state = await page.evaluate(() => ({ hash: location.hash, text: document.querySelector('#enquiry').textContent.trim() }));
  record('enquiry-cta-and-unavailable-state', state.hash === '#enquiry' && /real enquiries are unavailable/i.test(state.text), state);
  if (label === 'codex') {
    await page.locator('#enquiry summary').click();
    state = await page.locator('#enquiry details').evaluate(el => ({ open: el.open, text: el.textContent.trim() }));
    record('enquiry-information-disclosure', state.open && /nothing|not|no /i.test(state.text), state);
  } else {
    await page.getByRole('button', { name: 'Get in Touch', exact: true }).click();
    await page.locator('[data-enquiry-form] button[type="submit"]').click();
    state = await page.evaluate(() => ({ errorsVisible: !document.querySelector('[data-error-summary]').hidden, invalidFields: document.querySelectorAll('[aria-invalid="true"]').length, focused: document.activeElement.hasAttribute('data-error-summary') }));
    record('preview-form-invalid-input', state.errorsVisible && state.invalidFields === 3 && state.focused, state);
    await page.locator('#enq-name').fill('Local Test');
    await page.locator('#enq-email').fill('test@example.invalid');
    await page.locator('#enq-message').fill('This is an evaluator-only local preview.');
    const before = requests.length;
    await page.locator('[data-enquiry-form] button[type="submit"]').click();
    state = await page.locator('[data-form-result]').evaluate(el => ({ visible: !el.hidden, text: el.textContent.trim() }));
    state.newRequests = requests.slice(before);
    record('preview-form-honest-and-no-network', state.visible && /nothing was sent/i.test(state.text) && state.newRequests.length === 0, state);
  }
  const fixtures = label === 'codex'
    ? [['', 3, 'AQUATIC WORLD'], ['fixtures/minimal.html', 1, 'AQUATIC WORLD'], ['fixtures/five.html', 5, 'AQUATIC WORLD'], ['fixtures/alternate.html', 5, 'TIDAL ATELIER']]
    : [['', 3, 'AQUATIC WORLD'], ['fixtures/minimal/', 1, 'AQUATIC WORLD'], ['fixtures/tidewell/', 5, 'Tidewell Studio']];
  for (const [route, expectedCount, expectedBrand] of fixtures) {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: width === 1440 ? 900 : 844 });
      await page.goto(base + route, { waitUntil: 'networkidle' });
      state = await page.evaluate(selector => ({ count: document.querySelectorAll(selector).length, text: document.body.innerText, title: document.title, overflow: document.documentElement.scrollWidth > innerWidth, optionalSections: ['quality', 'highlights'].map(id => Boolean(document.getElementById(id))), brokenAnchors: [...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href')).filter(href => href.length > 1 && !document.getElementById(href.slice(1))) }), cardSelector);
      const observed = { count: state.count, title: state.title, overflow: state.overflow, optionalSections: state.optionalSections, brokenAnchors: state.brokenAnchors, oldBrandPresent: route.includes('alternate') || route.includes('tidewell') ? /AQUATIC WORLD/i.test(state.text) : null };
      record(`fixture:${route || 'default'}@${width}`, state.count === expectedCount && state.text.toUpperCase().includes(expectedBrand.toUpperCase()) && !state.overflow && !state.brokenAnchors.length && (!route.includes('minimal') || state.optionalSections.every(v => !v)) && observed.oldBrandPresent !== true, observed);
    }
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(base, { waitUntil: 'networkidle' });
  state = await page.evaluate(() => ({ matched: matchMedia('(prefers-reduced-motion: reduce)').matches, scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior }));
  record('reduced-motion-scroll', state.matched && state.scrollBehavior !== 'smooth', state);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const context = await page.context().browser().newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  try {
    const withoutJS = await context.newPage();
    await withoutJS.goto(base, { waitUntil: 'networkidle' });
    state = await withoutJS.evaluate(() => ({ h1: document.querySelector('h1').textContent.trim(), mainTextLength: document.querySelector('main').innerText.length, overflow: document.documentElement.scrollWidth > innerWidth, visibleHeaderLinks: [...document.querySelectorAll('header a')].filter(a => a.getClientRects().length).length }));
    record('no-javascript-readable-layout', state.mainTextLength > 500 && !state.overflow && state.visibleHeaderLinks > 1, state);
  } finally { await context.close(); }
  record('blocking-runtime-errors', errors.length === 0, errors);
  return { runner: label, capturedAt: new Date().toISOString(), browser: page.context().browser().version(), checks, errors, unexpectedWrites: requests.filter(r => !['GET', 'HEAD'].includes(r.method)) };
}
