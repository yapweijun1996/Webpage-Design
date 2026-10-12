import { esc, attr } from './lib.mjs';
import { Wordmark } from './header.mjs';

export function SiteFooter({ site, nav, year }) {
  const social = site.features.showSocialLinks ? site.socialLinks : [];
  return `<footer class="site-footer">
  <div class="container site-footer__inner">
    ${Wordmark(site, 'p')}
    <nav class="site-footer__nav" aria-label="${attr(site.ui.footerNav)}">
      <ul>${nav.map((item) => `<li><a href="${attr(item.href)}">${esc(item.label)}</a></li>`).join('')}</ul>
    </nav>
    ${social.length ? `<ul class="site-footer__social">${social.map((s) => `<li><a href="${attr(s.href)}" rel="noopener">${esc(s.label)}</a></li>`).join('')}</ul>` : ''}
    ${site.legal.footerNote ? `<p class="site-footer__note">${esc(site.legal.footerNote)}</p>` : ''}
  </div>
  <div class="container site-footer__legal">
    <p>© ${year} ${esc(site.legal.legalName || site.brand.name)} · ${esc(site.legal.demoDisclaimer)}</p>
  </div>
</footer>`;
}
