/* Runnable browser acceptance matrix. Not executed successfully in this sandbox. */
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const base = `http://127.0.0.1:${process.env.AQUATIC_PREVIEW_PORT || 4191}`;
const routes = ['/', '/collections/', '/collections/ornamental-fish/',
  '/collections/aquatic-plants/', '/collections/driftwood/', '/our-story/', '/quality/', '/contact/'];
const globalRoutes = ['/', '/collections/', '/our-story/', '/quality/', '/contact/'];
const checks = [];
const errors = [];
const screenshots = [];
const check = (name, pass, detail = '') => checks.push({ name, result: pass ? 'pass' : 'fail', detail });
const slug = route => route === '/' ? 'home' : route.split('/').filter(Boolean).join('-');
let browser;

async function run() {
  const { chromium } = require(process.env.AQUATIC_PLAYWRIGHT_MODULE || 'playwright');
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  const requests = [];
  page.on('request', request => requests.push({ url: request.url(), method: request.method() }));
  const expected = {};
  for (const route of routes) {
    await page.goto(base + route);
    expected[route] = { heading: await page.locator('h1').innerText(), title: await page.title() };
  }
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 },
    { width: 768, height: 1024 }, { width: 1024, height: 900 }]) {
    await page.setViewportSize(viewport);
    for (const route of routes) {
      const response = await page.goto(base + route);
      await page.reload();
      await page.locator('h1').waitFor();
      for (const image of await page.locator('img').all()) {
        await image.scrollIntoViewIfNeeded();
        await image.evaluate(element => new Promise(resolve => {
          if (element.complete) return resolve();
          element.addEventListener('load', resolve, { once: true });
          element.addEventListener('error', resolve, { once: true });
        }));
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      const broken = await page.locator('img').evaluateAll(images => images.filter(image => !image.complete || image.naturalWidth === 0).map(image => image.src));
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      check(`IA-01 direct/reload ${route} ${viewport.width}`, response.status() === 200 && await page.locator('h1').innerText() === expected[route].heading && await page.title() === expected[route].title);
      check(`UI-01 assets/overflow ${route} ${viewport.width}`, broken.length === 0 && !overflow, JSON.stringify(broken));
      const headerGeometry = await page.evaluate(() => {
        const selectors = ['.site-header .brand', '.desktop-nav', '.header-cta', '.mobile-menu summary'];
        const boxes = selectors.map(selector => document.querySelector(selector))
          .filter(element => element.getClientRects().length > 0)
          .map(element => { const box = element.getBoundingClientRect(); return { left: box.left, right: box.right, top: box.top, bottom: box.bottom }; });
        return boxes.every(box => box.left >= 0 && box.right <= window.innerWidth) && boxes.every((box, i) => boxes.slice(i + 1).every(other => box.right <= other.left || other.right <= box.left || box.bottom <= other.top || other.bottom <= box.top));
      });
      check(`NAV-01 header boxes ${route} ${viewport.width}`, headerGeometry, 'Box checks require screenshot review for wordmark text and visual quality.');
      const file = `screenshots/${slug(route)}-${viewport.width}.png`;
      await page.screenshot({ path: path.join(__dirname, file), fullPage: true });
      screenshots.push(file);
    }
  }
  for (const width of [320, 360, 430, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(base + route);
      check(`UI-02 overflow ${route} ${width}`, await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
    }
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const origin of ['/', '/quality/', '/contact/']) {
    for (const landmark of ['.desktop-nav', '.footer-nav[aria-label="Footer navigation"]']) {
      for (const destination of globalRoutes) {
        await page.goto(base + origin);
        await page.locator(`${landmark} a[href="${destination}"]`).click();
        check(`IA-02 ${origin} ${landmark} → ${destination}`, new URL(page.url()).pathname === destination && await page.locator('h1').innerText() === expected[destination].heading);
      }
    }
  }
  for (const category of routes.slice(2, 5)) {
    await page.goto(base);
    await page.locator('.hero-copy a').click();
    await page.locator(`.category-card[href="${category}"]`).click();
    check(`IA-03 journey ${category}`, new URL(page.url()).pathname === category);
    await page.goBack();
    check(`IA-04 Back ${category}`, new URL(page.url()).pathname === '/collections/');
    await page.goForward();
    check(`IA-04 Forward ${category}`, new URL(page.url()).pathname === category);
    await page.locator('a[href*="/contact/?category="]').first().click();
    check(`IA-03 enquiry context ${category}`, await page.locator('#category').inputValue() === category.split('/')[2]);
    await page.goto(base + category);
    await page.locator('.breadcrumb a[href="/collections/"]').click();
    check(`IA-05 breadcrumb ${category}`, new URL(page.url()).pathname === '/collections/');
    await page.goto(base + category);
    await page.locator('.sibling-section a[href="/collections/"]').click();
    check(`IA-05 index return ${category}`, new URL(page.url()).pathname === '/collections/');
    await page.goto(base + category);
    const siblings = await page.locator('.sibling-card').evaluateAll(elements => elements.map(element => element.getAttribute('href')));
    for (const sibling of siblings) {
      await page.goto(base + category);
      await page.locator(`.sibling-card[href="${sibling}"]`).click();
      check(`IA-05 sibling ${category} → ${sibling}`, new URL(page.url()).pathname === sibling);
    }
    await page.goto(base + category);
    await page.locator('.site-header .brand').click();
    check(`IA-05 logo ${category}`, new URL(page.url()).pathname === '/');
  }
  await page.goto(base + '/collections/');
  const newPagePromise = context.waitForEvent('page');
  await page.locator('.category-card').first().click({ modifiers: ['Meta'] });
  const newPage = await newPagePromise;
  await newPage.waitForLoadState();
  check('IA-04 native new tab', new URL(newPage.url()).pathname === routes[2]);
  await newPage.close();
  const unknown = await page.goto(base + '/unknown-aquatic-page/');
  check('IA-06 honest 404', unknown.status() === 404 && (await page.locator('h1').innerText()).includes('out of the picture'));
  await page.locator('.not-found a[href="/collections/"]').click();
  check('IA-06 recovery', new URL(page.url()).pathname === '/collections/');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base + '/quality/');
  await page.locator('.mobile-menu summary').click();
  check('NAV-02 pointer open', await page.locator('.mobile-menu').evaluate(menu => menu.open));
  await page.screenshot({ path: path.join(__dirname, 'screenshots/phone-menu-open.png') });
  screenshots.push('screenshots/phone-menu-open.png');
  await page.keyboard.press('Escape');
  check('NAV-02 Escape/focus', await page.locator('.mobile-menu').evaluate(menu => !menu.open && document.activeElement === menu.querySelector('summary')));
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  check('NAV-02 keyboard destination', await page.evaluate(() => document.activeElement.getAttribute('href') === '/'));
  await page.locator('.mobile-menu summary').click();
  check('NAV-02 pointer dismiss', await page.locator('.mobile-menu').evaluate(menu => !menu.open));
  await page.goto(base);
  await page.keyboard.press('Tab');
  check('NAV-03 skip focus', await page.locator('.skip-link').evaluate(link => document.activeElement === link && link.getBoundingClientRect().top >= 0));
  await page.keyboard.press('Enter');
  check('NAV-03 skip destination', await page.evaluate(() => document.activeElement.id === 'main'));
  const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const noJsPage = await noJs.newPage();
  for (const route of routes.slice(1)) {
    await noJsPage.goto(base + route);
    await noJsPage.locator('.mobile-menu summary').click();
    await noJsPage.locator('.mobile-menu a[href="/collections/"]').click();
    check(`NAV-04 no-JS destination from ${route}`, new URL(noJsPage.url()).pathname === '/collections/' && await noJsPage.locator('h1').count() === 1);
  }
  await noJsPage.goto(base + '/contact/');
  check('NAV-04 no-JS limitation', await noJsPage.locator('noscript').isVisible() && await noJsPage.locator('#preview-button').isDisabled());
  await noJs.close();
  await page.goto(base + '/contact/?category=ornamental-fish#enquiry');
  const beforeRequests = requests.length;
  await page.locator('#preview-button').click();
  check('FORM-01 blank errors', await page.locator('[aria-invalid="true"]').count() === 3 && await page.locator('#error-summary').isVisible());
  await page.locator('#name').fill('Sample Visitor');
  await page.locator('#email').fill('invalid');
  await page.locator('#project').fill('Short');
  await page.locator('#preview-button').click();
  check('FORM-01 invalid/recovery', await page.locator('[aria-invalid="true"]').count() === 2);
  await page.locator('#email').fill('visitor@example.com');
  await page.locator('#project').fill('An illustrative planted aquarium with a red visual accent. What suitability questions should I discuss?');
  await page.locator('#preview-button').click();
  check('FORM-01 honest preview', await page.locator('#preview-result').isVisible() && (await page.locator('#preview-title').innerText()).includes('Nothing was sent') && await page.locator('[aria-invalid="true"]').count() === 0);
  check('FORM-01 no request on preview', requests.length === beforeRequests);
  await page.locator('#edit-brief').click();
  check('FORM-01 return to edit', await page.evaluate(() => document.activeElement.id === 'project') && await page.locator('#project').inputValue() !== '');
  await page.locator('#project').fill('Long illustrative project description. '.repeat(45));
  await page.locator('#preview-button').click();
  check('UI-03 long input', await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(base);
  check('UI-03 reduced motion', await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior === 'auto'));
  check('BUILD-01 no browser errors', errors.length === 0, JSON.stringify(errors));
  check('BUILD-01 local requests only', requests.every(request => request.url.startsWith(base) && request.method === 'GET'));
  await context.close();
}

(async () => {
  fs.mkdirSync(path.join(__dirname, 'screenshots'), { recursive: true });
  let failure;
  try { await run(); } catch (error) { failure = error.message; }
  finally { if (browser) await browser.close(); }
  const report = { browser: browser ? browser.version() : null, checks, screenshots, errors,
    interrupted: failure || null, status: failure ? 'incomplete' : checks.some(check => check.result === 'fail') ? 'fail' : 'pass',
    note: 'Screenshots still require full-size human/model inspection; this script does not establish visual acceptance.' };
  fs.writeFileSync(path.join(__dirname, 'browser-results.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ status: report.status, checks: checks.length, screenshots: screenshots.length, interrupted: report.interrupted }, null, 2));
  process.exitCode = report.status === 'pass' ? 0 : 1;
})();
