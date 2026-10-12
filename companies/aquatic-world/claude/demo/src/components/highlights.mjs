import { esc, attr, lines, plain, image } from './lib.mjs';
import { collectionAnchor } from './collections.mjs';
import { SideNote } from './hero.mjs';

export function Highlights({ home, ctx, collectionIds }) {
  const h = home.highlights;
  return `<section class="highlights" id="highlights" aria-labelledby="highlights-title">
  <div class="section-bg" aria-hidden="true">${image({ ...h.background, alt: '' }, { ctx, sizes: '100vw', className: 'section-bg__img' })}</div>
  <div class="container highlights__inner">
    <div class="highlights__text">
      <p class="eyebrow eyebrow--gold">${esc(h.eyebrow)}</p>
      <h2 class="section-title" id="highlights-title">${lines(h.heading)}</h2>
      ${h.note ? `<p class="highlights__note">${esc(h.note)}</p>` : ''}
    </div>
    <ul class="highlight-grid" data-count="${h.items.length}">
      ${h.items.map((item) => {
        const linked = collectionIds.has(item.collectionId);
        const body = `<span class="highlight-card__media">${image(item.image, { ctx, sizes: '(min-width: 1024px) 180px, (min-width: 640px) 45vw, 90vw', className: 'highlight-card__img' })}</span>
          <span class="highlight-card__title">${lines(item.title)}</span>`;
        return `<li class="highlight-card">
        ${linked
          ? `<a class="highlight-card__link" href="#${attr(collectionAnchor(item.collectionId))}" data-collection-link="${attr(item.collectionId)}" aria-label="${attr(plain(item.title))}">${body}</a>`
          : `<figure class="highlight-card__link">${body}</figure>`}
      </li>`;
      }).join('\n      ')}
    </ul>
    ${SideNote(h.sideNote, 'side-note--highlights')}
  </div>
</section>`;
}
