import { esc, attr } from './lib.mjs';

export function Wordmark({ brand }, tag = 'a') {
  return `<${tag} class="wordmark"${tag === 'a' ? ' href="#top"' : ''}>
    <span class="wordmark__name">${esc(brand.name)}</span>
    ${brand.tagline ? `<span class="wordmark__tagline">${esc(brand.tagline)}</span>` : ''}
  </${tag}>`;
}

export function SiteHeader({ site, nav }) {
  const cta = site.cta.secondary;
  return `<header class="site-header" id="site-header" data-header>
  <div class="site-header__inner container">
    ${Wordmark(site)}
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-menu" data-menu-toggle data-label-open="${attr(site.ui.menuOpen)}" data-label-close="${attr(site.ui.menuClose)}" hidden>
      <span class="menu-toggle__bars" aria-hidden="true"></span>
      <span class="menu-toggle__label" data-menu-label>${esc(site.ui.menuOpen)}</span>
    </button>
    <div class="site-menu" id="site-menu" data-menu>
      <nav class="site-nav" aria-label="${attr(site.ui.primaryNav)}">
        <ul>
          ${nav.map((item) => `<li><a href="${attr(item.href)}">${esc(item.label)}</a></li>`).join('\n          ')}
        </ul>
      </nav>
      ${cta ? `<a class="btn btn--outline btn--small" href="${attr(cta.href)}">${esc(cta.label)}</a>` : ''}
    </div>
  </div>
</header>`;
}
