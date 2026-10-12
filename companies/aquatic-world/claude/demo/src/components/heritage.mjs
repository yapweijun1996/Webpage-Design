import { esc, attr, lines, image, arrow } from './lib.mjs';

export function Heritage({ site, home, ctx }) {
  const h = home.heritage;
  const quote = site.features.showHeritageQuote ? h.quote : null;
  return `<section class="heritage" id="heritage" aria-labelledby="heritage-title">
  <figure class="heritage__media">
    ${image(h.image, { ctx, sizes: '(min-width: 900px) 50vw, 100vw', className: 'heritage__img' })}
    ${h.imageCaption ? `<figcaption class="heritage__caption"><span>${lines(h.imageCaption)}</span></figcaption>` : ''}
  </figure>
  <div class="heritage__panel${quote ? ' heritage__panel--quote' : ''}">
    <div class="heritage__text">
      <p class="eyebrow">${esc(h.eyebrow)}</p>
      <h2 class="section-title" id="heritage-title">${lines(h.heading)}</h2>
      ${h.body.map((p) => `<p>${esc(p)}</p>`).join('\n      ')}
      ${h.link ? `<a class="text-link" href="${attr(h.link.href)}">${esc(h.link.label)}${arrow()}</a>` : ''}
    </div>
    ${quote ? `<figure class="heritage__quote">
      <blockquote><p>${esc(quote.text)}</p></blockquote>
      <figcaption>${esc(quote.attribution)}</figcaption>
    </figure>` : ''}
  </div>
</section>`;
}
