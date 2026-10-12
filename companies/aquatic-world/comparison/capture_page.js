async (page) => {
  const url = new URL(page.url());
  const label = url.port === '4171' ? 'codex' : url.port === '4172' ? 'claude' : null;
  if (!label) throw new Error('Expected one of the two comparison preview ports.');
  const output = `__OUTPUT_ROOT__/${label}`;
  const errors = [];
  const failedRequests = [];
  const responses = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('requestfailed', request => failedRequests.push({ url: request.url(), error: request.failure() }));
  page.on('response', response => {
    if (response.status() >= 400) responses.push({ url: response.url(), status: response.status() });
  });
  const viewports = [
    [1440, 900, 'desktop'], [768, 1024, 'tablet'], [390, 844, 'mobile'],
    [320, 844, '320'], [360, 844, '360'], [430, 844, '430'],
    [1024, 900, '1024'], [1920, 1080, '1920'],
  ];
  const layouts = [];
  for (const [width, height, name] of viewports) {
    await page.setViewportSize({ width, height });
    await page.goto(url.href, { waitUntil: 'networkidle' });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].filter(img => img.getClientRects().length && (img.loading !== 'lazy' || img.getBoundingClientRect().top < innerHeight)).map(img => img.decode().catch(() => {})));
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    if (['desktop', 'tablet', 'mobile'].includes(name)) {
      await page.screenshot({ path: `${output}/${name}-first.png`, fullPage: false });
    }
    for (let top = 0; top < await page.evaluate(() => document.documentElement.scrollHeight); top += height) {
      await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), top);
      await page.waitForTimeout(60);
    }
    await page.waitForLoadState('networkidle');
    await page.evaluate(async () => {
      await Promise.all([...document.images].filter(img => img.getClientRects().length).map(img => img.decode().catch(() => {})));
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    await page.waitForTimeout(250);
    const measurements = await page.evaluate(() => ({
      title: document.title,
      viewport: { width: innerWidth, height: innerHeight, devicePixelRatio },
      scrollWidth: document.documentElement.scrollWidth,
      pageHeight: document.documentElement.scrollHeight,
      fontStatus: document.fonts.status,
      headings: [...document.querySelectorAll('h1,h2')].map(el => ({ level: el.tagName, text: el.textContent.trim(), font: getComputedStyle(el).fontFamily, fontSize: getComputedStyle(el).fontSize, fontWeight: getComputedStyle(el).fontWeight })),
      sections: [...document.querySelectorAll('header,main > section,footer')].map(el => ({ tag: el.tagName, id: el.id, class: el.className, top: el.getBoundingClientRect().top + scrollY, height: el.getBoundingClientRect().height })),
      images: [...document.images].map(img => ({ src: img.getAttribute('src'), complete: img.complete, width: img.naturalWidth, rendered: Boolean(img.getClientRects().length), alt: img.alt })),
      brokenAnchors: [...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href')).filter(href => href.length > 1 && !document.getElementById(decodeURIComponent(href.slice(1)))),
      unnamedButtons: [...document.querySelectorAll('button')].filter(b => !b.textContent.trim() && !b.getAttribute('aria-label') && !b.getAttribute('aria-labelledby')).length,
      offscreenElements: [...document.body.querySelectorAll('*')].filter(el => {
        const rect = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        return rect.width && rect.height && style.visibility !== 'hidden' && style.display !== 'none' && (rect.right > innerWidth + 1 || rect.left < -1);
      }).slice(0, 15).map(el => ({ tag: el.tagName, class: el.className, text: el.textContent.trim().slice(0, 70) })),
    }));
    layouts.push({ name, width, height, ...measurements });
    if (['desktop', 'tablet', 'mobile'].includes(name)) {
      await page.screenshot({ path: `${output}/${name}-full.png`, fullPage: true });
    }
  }
  const report = { capturedAt: new Date().toISOString(), url: url.href, browser: page.context().browser().version(), layouts, errors, failedRequests, errorResponses: responses };
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(url.href, { waitUntil: 'networkidle' });
  return { label, ...report, output };
}
