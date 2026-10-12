// Shared layout: document shell, header, footer, breadcrumbs and small HTML helpers.
import { brand, nav, cta, images, categories, pages } from "./content.mjs";

let base = "/";
export const setBase = (value) => {
  base = value.endsWith("/") ? value : `${value}/`;
};
// Resolve a site-root path ("/collections/") against the configured base.
export const url = (path) => base + path.replace(/^\//, "");

export const esc = (value) =>
  String(value).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);

export const arrow = `<svg class="icon-arrow" viewBox="0 0 20 12" aria-hidden="true" focusable="false"><path d="M0 6h18M13 1l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`;

const mark = `<svg class="brand-mark" viewBox="0 0 40 40" aria-hidden="true" focusable="false"><circle cx="20" cy="20" r="18.5" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M8 22c4-5 8-5 12 0s8 5 12 0M11 27c3-3.2 6-3.2 9 0s6 3.2 9 0" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M20 8.5c-2.8 2.6-2.8 6.4 0 9 2.8-2.6 2.8-6.4 0-9Z" fill="currentColor"/></svg>`;

// Responsive <img>. `sizes` describes the rendered width; `fit` adds a modifier class.
export function img(key, { sizes = "100vw", cls = "", eager = false, alt } = {}) {
  const image = images[key];
  const srcset = image.widths.map((w) => `${url(`/assets/img/${image.stem}-${w}.webp`)} ${w}w`).join(", ");
  const fallback = image.widths[Math.min(1, image.widths.length - 1)];
  const [w, h] = image.ratio;
  return `<img class="${cls}" src="${url(`/assets/img/${image.stem}-${fallback}.webp`)}" srcset="${srcset}" sizes="${sizes}" width="${w}" height="${h}" alt="${esc(alt ?? image.alt)}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async">`;
}

export const srcsetFor = (key) =>
  images[key].widths.map((w) => `${url(`/assets/img/${images[key].stem}-${w}.webp`)} ${w}w`).join(", ");

// Home omits the header enquiry button and divider: its single primary action lives in the hero.
function header(page, { home = false } = {}) {
  const links = nav
    .map((item) => {
      let current = "";
      let note = "";
      if (page.section === item.key) {
        current = page.category ? ' aria-current="location"' : ' aria-current="page"';
        // Category pages: Collections is the current section, not the current page.
        if (page.category) note = '<span class="visually-hidden"> (current section)</span>';
      }
      return `<li><a class="nav-link" href="${url(item.href)}"${current}><span class="nav-label">${item.label}</span>${note}</a></li>`;
    })
    .join("");
  return `<header class="site-header" data-header>
  <div class="wrap header-inner">
    <a class="brand" href="${url("/")}" aria-label="${brand.name} — Home">${mark}<span class="brand-name">${brand.name}</span></a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-menu" data-menu-toggle>
      <span class="menu-icon" aria-hidden="true"><span></span><span></span></span><span class="menu-text">Menu</span>
    </button>
    <div class="site-menu" id="site-menu" data-menu>
      <nav class="site-nav" aria-label="Main"><ul class="nav-list">${links}</ul></nav>${home ? "" : `
      <span class="header-divider" aria-hidden="true"></span>
      <a class="btn btn-gold header-cta" href="${url(cta.href)}">${cta.label} ${arrow}</a>`}
    </div>
  </div>
</header>`;
}

function footer({ home = false } = {}) {
  const explore = nav.map((n) => `<li><a href="${url(n.href)}">${n.label}</a></li>`).join("");
  const cats = categories.map((c) => `<li><a href="${url(`/collections/${c.slug}/`)}">${c.name}</a></li>`).join("");
  // Home: compact footer over the same water environment, with a single demo disclosure.
  if (home)
    return `<footer class="site-footer home-footer">
  <div class="home-footer-inner">
    <a class="brand" href="${url("/")}" aria-label="${brand.name} — Home"><span class="brand-name">${brand.name}</span></a>
    <nav class="home-footer-nav" aria-label="Footer: explore"><ul>${explore}</ul></nav>
    <nav class="home-footer-nav" aria-label="Footer: collections"><ul>${cats}</ul></nav>
    <div class="home-footer-base"><p>${brand.disclosure}</p><a href="#top" class="to-top">Back to top</a></div>
  </div>
</footer>`;
  return `<footer class="site-footer">
  <div class="wrap footer-grid">
    <div class="footer-brand">
      <a class="brand" href="${url("/")}" aria-label="${brand.name} — Home">${mark}<span class="brand-name">${brand.name}</span></a>
      <p class="footer-tagline">${brand.tagline}</p>
    </div>
    <nav class="footer-col" aria-label="Footer: explore"><h2 class="footer-heading">Explore</h2><ul>${explore}</ul></nav>
    <nav class="footer-col" aria-label="Footer: collections"><h2 class="footer-heading">Collections</h2><ul>${cats}</ul></nav>
    <div class="footer-col footer-note"><h2 class="footer-heading">About this site</h2><p>${brand.disclosure}</p></div>
  </div>
  <div class="wrap footer-base"><p>Design concept · Illustrative content only</p><a href="#top" class="to-top">Back to top</a></div>
</footer>`;
}

export function breadcrumbs(trail) {
  const items = trail
    .map((item, i) =>
      i === trail.length - 1
        ? `<li><span aria-current="page">${item.label}</span></li>`
        : `<li><a href="${url(item.href)}">${item.label}</a></li>`,
    )
    .join("");
  return `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${items}</ol></nav>`;
}

// `backdrop` renders before the header (Home environment); `utility` right after it, early in tab order.
export function document({ pageKey, body, bodyClass = "", backdrop = "", utility = "" }) {
  const page = pages[pageKey];
  const home = pageKey === "home";
  return `<!doctype html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
<meta name="theme-color" content="#061C26">
<link rel="icon" href="${url("/assets/favicon.svg")}" type="image/svg+xml">
<script>document.documentElement.classList.replace("no-js", "js");</script>
<link rel="stylesheet" href="${url("/assets/site.css")}">
<script src="${url("/assets/site.js")}" defer></script>
</head>
<body class="${bodyClass}" id="top">
<a class="skip-link" href="#main">Skip to content</a>
${backdrop}${header(page, { home })}
${utility}<main id="main" tabindex="-1">
${body}
</main>
${footer({ home })}
</body>
</html>
`;
}
