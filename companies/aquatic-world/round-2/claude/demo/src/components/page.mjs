import { esc, attr } from './lib.mjs';
import { SiteHeader } from './header.mjs';
import { Hero } from './hero.mjs';
import { Heritage } from './heritage.mjs';
import { Collections } from './collections.mjs';
import { Quality } from './quality.mjs';
import { Highlights } from './highlights.mjs';
import { Enquiry } from './enquiry.mjs';
import { SiteFooter } from './footer.mjs';

function themeStyle(tokens) {
  const entries = Object.entries(tokens || {});
  if (!entries.length) return '';
  return `<style>:root{${entries.map(([k, v]) => `${k}:${v}`).join(';')}}</style>`;
}

/** Full homepage. `model` is the validated, approval-filtered content from build.mjs. */
export function HomePage(model) {
  const { site, home, ctx, sections } = model;
  const seo = site.seo;
  const canonical = site.site.baseUrl ? `${site.site.baseUrl.replace(/\/$/, '')}/` : null;
  const enquiryHref = sections.has('enquiry') ? '#enquiry' : null;
  return `<!doctype html>
<html lang="${attr(site.site.defaultLocale)}" data-theme="${attr(site.site.themeId)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(seo.title)}</title>
<meta name="description" content="${attr(seo.description)}">
${site.contentStatus !== 'PRODUCTION_APPROVED' ? '<meta name="robots" content="noindex, nofollow">' : ''}
${canonical ? `<link rel="canonical" href="${attr(canonical)}">` : ''}
<meta property="og:type" content="website">
<meta property="og:title" content="${attr(seo.title)}">
<meta property="og:description" content="${attr(seo.description)}">
<meta name="theme-color" content="${attr(seo.themeColor)}">
<link rel="preload" as="image" href="${attr(model.heroPreload.href)}" imagesrcset="${attr(model.heroPreload.srcset)}" imagesizes="100vw" fetchpriority="high">
<link rel="stylesheet" href="${ctx.prefix}assets/css/site.css">
${themeStyle(site.theme.tokens)}
<script>document.documentElement.classList.add('js')</script>
<script src="${ctx.prefix}assets/js/site.js" defer></script>
</head>
<body>
<a class="skip-link" href="#main">${esc(site.ui.skipLink)}</a>
${SiteHeader({ site, nav: model.nav })}
<main id="main" tabindex="-1">
${Hero({ site, home, ctx })}
${sections.has('heritage') ? Heritage({ site, home, ctx }) : ''}
${sections.has('collections') ? Collections({ site, home, ctx, collections: model.collections, enquiryHref }) : ''}
${sections.has('quality') ? Quality({ home }) : ''}
${sections.has('highlights') ? Highlights({ home, ctx, collectionIds: new Set(model.collections.map((c) => c.id)) }) : ''}
${sections.has('enquiry') ? Enquiry({ site, home, ctx, collections: model.collections }) : ''}
</main>
${SiteFooter({ site, nav: model.footerNav, year: model.year })}
</body>
</html>
`;
}
