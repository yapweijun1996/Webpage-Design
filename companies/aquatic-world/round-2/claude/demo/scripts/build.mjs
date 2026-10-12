// Static build: content JSON -> validation + approval gate -> semantic HTML pages in dist/.
// Zero dependencies (Node >= 18). Usage: node scripts/build.mjs
import { readFile, writeFile, mkdir, rm, cp, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { HomePage } from '../src/components/page.mjs';
import { ICON_NAMES } from '../src/components/lib.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

// Tenant id -> output directory (relative to dist). The first entry is the default page.
const PAGES = [
  { tenant: 'aquatic-world', out: '' },
  { tenant: 'tidewell', out: 'fixtures/tidewell' },
  { tenant: 'minimal', out: 'fixtures/minimal' }
];

const SECTION_IDS = ['top', 'main', 'heritage', 'collections', 'collection-explorer', 'quality', 'highlights', 'enquiry'];
const HREF = /^(#[a-z0-9][a-z0-9-]*|\/[^\s"'<>]*|https:\/\/[^\s"'<>]+|mailto:[^\s"'<>]+)$/i;
const POSITION = /^\d{1,3}% \d{1,3}%$/;
const TOKEN_VALUE = /^[#\w\s,."'%()-]+$/;
const UI_KEYS = ['skipLink', 'menuOpen', 'menuClose', 'primaryNav', 'footerNav', 'demoLabel'];

const readJson = async (p) => JSON.parse(await readFile(p, 'utf8'));
const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);

/** Objects merge recursively; arrays, strings and null replace. */
function merge(base, over) {
  if (!isObj(base) || !isObj(over)) return over === undefined ? base : over;
  const out = { ...base };
  for (const [k, v] of Object.entries(over)) out[k] = merge(base[k], v);
  return out;
}

async function loadTenantFile(tenant, file, seen = new Set()) {
  if (seen.has(tenant)) throw new Error(`extends cycle at ${tenant}`);
  seen.add(tenant);
  const data = await readJson(join(root, 'content/tenants', tenant, file));
  if (!data.extends) return data;
  const { extends: parent, ...rest } = data;
  return merge(await loadTenantFile(parent, file, seen), rest);
}

async function allowedTokens() {
  const css = await readFile(join(root, 'src/styles/tokens.css'), 'utf8');
  return new Set([...css.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]));
}

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function buildModel(tenant, assets, tokens) {
  const errors = [];
  const warnings = [];
  const suppressed = [];
  const site = await loadTenantFile(tenant, 'site.json');
  const home = await loadTenantFile(tenant, 'homepage.json');
  const collectionsFile = await loadTenantFile(tenant, 'collections.json');
  const need = (cond, msg) => { if (!cond) errors.push(msg); };

  for (const [name, doc] of [['site', site], ['homepage', home], ['collections', collectionsFile]]) {
    need(['DEMO_ONLY_NOT_APPROVED', 'PRODUCTION_APPROVED'].includes(doc.contentStatus), `${name}.contentStatus invalid`);
  }
  need(site.brand?.name?.trim(), 'site.brand.name required');
  need(site.seo?.title && site.seo?.description, 'site.seo.title/description required');
  for (const k of UI_KEYS) need(site.ui?.[k], `site.ui.${k} required`);
  need(site.features.enableEnquiryForm !== true, 'features.enableEnquiryForm=true needs a server backend, which this build does not provide');
  need(site.site.baseUrl === null || /^https:\/\//.test(site.site.baseUrl), 'site.baseUrl must be null or https://');
  if (site.contentStatus !== 'PRODUCTION_APPROVED') warnings.push('content is DEMO_ONLY_NOT_APPROVED: page marked noindex');
  if (site.contact.email && !/^[^\s@<>"]+@[^\s@<>"]+\.[a-z]{2,}$/i.test(site.contact.email)) errors.push('contact.email invalid');

  for (const [k, v] of Object.entries(site.theme?.tokens || {})) {
    need(tokens.has(k), `theme token ${k} is not a known design token`);
    need(TOKEN_VALUE.test(v), `theme token ${k} has an unsafe value`);
  }

  const checkImage = async (img, where, { decorative = false } = {}) => {
    const asset = assets.assets[img?.asset];
    if (!asset) return errors.push(`${where}: unknown asset "${img?.asset}"`);
    if (!decorative && !img.alt?.trim()) errors.push(`${where}: alt text required`);
    if (img.position && !POSITION.test(img.position)) errors.push(`${where}: bad position`);
    if (img.mobilePosition && !POSITION.test(img.mobilePosition)) errors.push(`${where}: bad mobilePosition`);
    if (img.tabletPosition && !POSITION.test(img.tabletPosition)) errors.push(`${where}: bad tabletPosition`);
    if (img.fit && !['cover', 'contain'].includes(img.fit)) errors.push(`${where}: bad fit`);
    for (const w of asset.widths) {
      const file = join(root, assets.basePath, `${img.asset}-${w}.${assets.format}`);
      if (!(await exists(file))) errors.push(`${where}: missing derivative ${file}`);
    }
  };

  // Approval gate: anything typed as a claim renders only when approved.
  const gate = (items, where) => (items || []).filter((item, i) => {
    if (item.icon && !ICON_NAMES.includes(item.icon)) errors.push(`${where}[${i}]: unknown icon ${item.icon}`);
    if (item.kind !== 'claim') return true;
    if (item.claim?.status === 'approved') return true;
    suppressed.push({ where: `${where}[${i}]`, claimId: item.claim?.id ?? null, status: item.claim?.status ?? 'missing' });
    return false;
  });

  // Collections: enabled, sorted, unique ids.
  const collections = collectionsFile.items.filter((c) => c.enabled !== false).sort((a, b) => a.sortOrder - b.sortOrder);
  const ids = new Set();
  for (const c of collections) {
    need(/^[a-z0-9-]+$/.test(c.id), `collection id "${c.id}" invalid`);
    need(!ids.has(c.id), `duplicate collection id ${c.id}`);
    need(c.title?.trim(), `collection ${c.id}: title required`);
    ids.add(c.id);
    await checkImage(c.image, `collections.${c.id}.image`);
  }

  home.hero.proofPoints = gate(home.hero.proofPoints, 'hero.proofPoints');
  home.quality.items = gate(home.quality.items, 'quality.items');
  await checkImage(home.hero.image, 'hero.image', { decorative: true });

  const sections = new Set(['top', 'main']);
  if (home.heritage.enabled) { sections.add('heritage'); await checkImage(home.heritage.image, 'heritage.image'); }
  if (home.collections.enabled && collections.length) { sections.add('collections'); sections.add('collection-explorer'); }
  if (home.quality.enabled && site.features.showQualitySection && home.quality.items.length) sections.add('quality');
  if (home.highlights.enabled && home.highlights.items.length) {
    sections.add('highlights');
    await checkImage(home.highlights.background, 'highlights.background', { decorative: true });
    for (const h of home.highlights.items) {
      await checkImage(h.image, `highlights.${h.id}.image`);
      if (!ids.has(h.collectionId)) warnings.push(`highlight ${h.id}: collection "${h.collectionId}" not rendered; shown without link`);
    }
  }
  if (home.enquiry.enabled) { sections.add('enquiry'); await checkImage(home.enquiry.background, 'enquiry.background', { decorative: true }); }
  for (const id of ids) sections.add(`collection-${id}`);

  // Links: valid protocol, and in-page anchors must reach a rendered section.
  const resolves = (href) => !href.startsWith('#') || sections.has(href.slice(1));
  const linkOk = (href, where) => {
    if (!HREF.test(href || '')) { errors.push(`${where}: unsafe or invalid href "${href}"`); return false; }
    if (!resolves(href)) { warnings.push(`${where}: target ${href} not rendered; link hidden`); return false; }
    return true;
  };
  const nav = site.navigation.filter((n, i) => linkOk(n.href, `navigation[${i}]`));
  for (const id of Object.keys(site.cta)) if (!linkOk(site.cta[id].href, `cta.${id}`)) delete site.cta[id];
  if (home.heritage.link && !linkOk(home.heritage.link.href, 'heritage.link')) home.heritage.link = null;
  if (home.collections.viewAll && !linkOk(home.collections.viewAll.href, 'collections.viewAll')) home.collections.viewAll = null;
  const footerNav = (home.footer?.navigationIds || []).map((id) => nav.find((n) => n.id === id)).filter(Boolean);

  const heroAsset = assets.assets[home.hero.image.asset];
  return {
    errors, warnings, suppressed,
    model: {
      site, home, collections, nav, footerNav, sections,
      year: new Date().getFullYear(),
      heroAsset, heroImage: home.hero.image
    }
  };
}

async function main() {
  const assets = await readJson(join(root, 'content/assets.json'));
  const tokens = await allowedTokens();
  await rm(dist, { recursive: true, force: true });
  await mkdir(join(dist, 'assets/css'), { recursive: true });
  await mkdir(join(dist, 'assets/js'), { recursive: true });

  const report = { builtAt: new Date().toISOString(), pages: [] };
  let failed = false;
  for (const page of PAGES) {
    const { errors, warnings, suppressed, model } = await buildModel(page.tenant, assets, tokens);
    const depth = page.out ? page.out.split('/').length : 0;
    const prefix = '../'.repeat(depth);
    const imgUrl = (w) => `${prefix}${assets.basePath}/${model.heroImage.asset}-${w}.${assets.format}`;
    const widths = model.heroAsset.widths;
    model.ctx = { assets, prefix };
    model.heroPreload = {
      href: imgUrl(widths[Math.min(1, widths.length - 1)]),
      srcset: widths.map((w) => `${imgUrl(w)} ${w}w`).join(', ')
    };
    report.pages.push({
      tenant: page.tenant,
      path: `${page.out ? page.out + '/' : ''}index.html`,
      sections: [...model.sections].filter((s) => SECTION_IDS.includes(s)),
      collections: model.collections.map((c) => c.id),
      errors, warnings, suppressedClaims: suppressed
    });
    for (const w of warnings) console.log(`[${page.tenant}] warn: ${w}`);
    for (const s of suppressed) console.log(`[${page.tenant}] suppressed unapproved claim ${s.claimId} at ${s.where}`);
    if (errors.length) {
      failed = true;
      for (const e of errors) console.error(`[${page.tenant}] ERROR: ${e}`);
      continue;
    }
    const outDir = join(dist, page.out);
    await mkdir(outDir, { recursive: true });
    await writeFile(join(outDir, 'index.html'), HomePage(model));
    console.log(`[${page.tenant}] wrote ${join('dist', page.out, 'index.html')}`);
  }

  const css = (await readFile(join(root, 'src/styles/tokens.css'), 'utf8')) + '\n' + (await readFile(join(root, 'src/styles/site.css'), 'utf8'));
  await writeFile(join(dist, 'assets/css/site.css'), css);
  await cp(join(root, 'src/client/site.js'), join(dist, 'assets/js/site.js'));
  await cp(join(root, assets.basePath), join(dist, assets.basePath), { recursive: true });
  await writeFile(join(dist, 'build-report.json'), JSON.stringify(report, null, 2) + '\n');
  if (failed) {
    console.error('Build failed: content validation errors above.');
    process.exit(1);
  }
  console.log('Build complete -> dist/');
}

main().catch((err) => { console.error(err); process.exit(1); });
