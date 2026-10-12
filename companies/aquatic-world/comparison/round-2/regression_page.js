async (page) => {
  const runner = new URL(page.url()).port === '4181' ? 'codex' : 'claude';
  const base = `http://127.0.0.1:${runner === 'codex' ? '4181' : '4182'}/`;
  const card = runner === 'codex' ? '.collection-card' : '.collection-card__link';
  const detail = runner === 'codex' ? '[data-detail][open]' : '[data-explorer].is-open';
  const checks = [];
  const record = (id, passed, observed) => checks.push({id, status: passed ? 'pass' : 'fail', observed});
  const state = () => page.evaluate(selector => {
    const active = document.querySelector(selector);
    const panel = active && (active.matches('[data-detail]') ? active : active.querySelector('[data-collection-panel]:not([hidden])'));
    return {hash: location.hash, open: Boolean(active), panelHash: panel ? '#' + panel.id : null, overflow: document.documentElement.scrollWidth > innerWidth};
  }, detail);
  await page.setViewportSize({width: 390, height: 844});
  await page.goto(base, {waitUntil: 'networkidle'});
  const firstHash = await page.locator(card).first().getAttribute('href');
  await page.locator(card).first().click();
  await page.goBack(); await page.waitForTimeout(200);
  let observed = await state();
  record('back-to-empty-hash-closes', !observed.hash && !observed.open, observed);
  await page.goForward(); await page.waitForTimeout(200);
  observed = await state();
  record('forward-restores-collection', observed.hash === firstHash && observed.panelHash === firstHash && observed.open && !observed.overflow, observed);
  const secondHash = await page.locator(card).nth(1).getAttribute('href');
  await page.locator(card).nth(1).click();
  await page.waitForTimeout(100); observed = await state();
  record('switch-to-second-collection', observed.hash === secondHash && observed.panelHash === secondHash && observed.open && !observed.overflow, observed);
  await page.locator('main a[href="#enquiry"]').first().click();
  await page.waitForTimeout(100); observed = await state();
  record('unrelated-enquiry-hash-closes', observed.hash === '#enquiry' && !observed.open, observed);
  await page.goBack(); await page.waitForTimeout(200); observed = await state();
  record('back-from-enquiry-restores-collection', observed.hash === secondHash && observed.panelHash === secondHash && observed.open, observed);
  await page.goForward(); await page.waitForTimeout(200); observed = await state();
  record('forward-to-enquiry-closes', observed.hash === '#enquiry' && !observed.open, observed);
  const fixture = runner === 'codex' ? 'fixtures/five.html' : 'fixtures/tidewell/';
  await page.goto(base + fixture, {waitUntil: 'networkidle'});
  const lastHash = await page.locator(card).last().getAttribute('href');
  const count = await page.locator(card).count();
  await page.locator(card).last().click(); await page.waitForTimeout(100);
  observed = await state();
  record('fifth-category-mobile-exploration', count === 5 && observed.hash === lastHash && observed.panelHash === lastHash && observed.open && !observed.overflow, {count, ...observed});
  const photoText = [];
  for (const width of [1440, 1024, 768, 390]) {
    await page.setViewportSize({width, height: width >= 1024 ? 900 : width === 768 ? 1024 : 844});
    await page.goto(base, {waitUntil: 'networkidle'});
    const result = await page.evaluate(() => ({
      width: innerWidth,
      captions: [...document.querySelectorAll('#heritage figcaption, #heritage figcaption *')].map(el => ({text: el.textContent.trim(), color: getComputedStyle(el).color, background: getComputedStyle(el).backgroundColor, fontSize: getComputedStyle(el).fontSize, rendered: Boolean(el.getClientRects().length)})),
      hero: [...document.querySelectorAll('#hero img, .hero img')].map(el => ({objectPosition: getComputedStyle(el).objectPosition, objectFit: getComputedStyle(el).objectFit, image: {width: el.naturalWidth, height: el.naturalHeight}, rectangle: {width: el.getBoundingClientRect().width, height: el.getBoundingClientRect().height}})),
      sectionHeights: [...document.querySelectorAll('main > section')].map(el => ({id: el.id, height: el.getBoundingClientRect().height})),
    }));
    photoText.push(result);
    if (width === 1024) await page.screenshot({path: `__OUTPUT_ROOT__/${runner}/1024-first.png`, fullPage: false});
  }
  return {runner, capturedAt: new Date().toISOString(), browser: page.context().browser().version(), checks, photoText, visualAssessment: 'Computed geometry and colors support the separate human/evaluator screenshot review; they do not prove photographic contrast or crop quality.'};
}
