// Dev helper: node tests/shot.mjs <url-path> <width> <height> <out.png> [full]
import { chromium } from 'playwright';
const [path = '/', w = '1440', h = '900', out = '/tmp/aw/shot.png', full = 'full'] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +w, height: +h } });
const errs = [];
page.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
page.on('pageerror', (e) => errs.push(String(e)));
await page.goto(`http://127.0.0.1:4173${path}`, { waitUntil: 'networkidle' });
await page.evaluate(async () => { for (const img of document.images) { img.loading = 'eager'; } await Promise.all([...document.images].map((i) => i.decode().catch(() => {}))); });
await page.screenshot({ path: out, fullPage: full === 'full' });
console.log('errors:', errs, 'scrollWidth', await page.evaluate(() => document.documentElement.scrollWidth));
await browser.close();
