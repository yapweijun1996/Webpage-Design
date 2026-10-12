import { esc, attr, lines, plain, image, arrow } from './lib.mjs';

export const collectionAnchor = (id) => `collection-${id}`;

function CollectionCard(item, ctx) {
  return `<li class="collection-card">
      <a class="collection-card__link" href="#${attr(collectionAnchor(item.id))}" data-collection-link="${attr(item.id)}">
        <span class="collection-card__media">${image(item.image, { ctx, sizes: '(min-width: 1024px) 220px, (min-width: 640px) 30vw, 55vw', className: 'collection-card__img' })}</span>
        <span class="collection-card__body">
          <h3 class="collection-card__title">${esc(item.title)}</h3>
          <span class="collection-card__desc">${lines(item.description)}</span>
          ${arrow()}
        </span>
      </a>
    </li>`;
}

function ExplorerPanel(item, explorer, enquiryHref, ctx) {
  const anchor = collectionAnchor(item.id);
  const label = explorer.enquiryLabel.replace('{title}', item.title);
  return `<article class="explorer__panel" id="${attr(anchor)}" aria-labelledby="${attr(anchor)}-title" data-collection-panel="${attr(item.id)}" tabindex="-1">
        <div class="explorer__media">${image(item.image, { ctx, sizes: '(min-width: 900px) 460px, 100vw', className: 'explorer__img' })}</div>
        <div class="explorer__copy">
          <h4 class="explorer__title" id="${attr(anchor)}-title">${esc(item.title)}</h4>
          <p class="explorer__tagline">${esc(plain(item.description))}</p>
          <p>${esc(item.details.summary)}</p>
          ${item.details.notes.length ? `<ul class="explorer__notes">${item.details.notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>` : ''}
          ${enquiryHref ? `<a class="btn btn--outline" href="${attr(enquiryHref)}" data-enquiry-topic="${attr(item.id)}">${esc(label)}</a>` : ''}
        </div>
      </article>`;
}

export function Collections({ site, home, collections, ctx, enquiryHref }) {
  const c = home.collections;
  const ex = c.explorer;
  return `<section class="collections" id="collections" aria-labelledby="collections-title">
  <div class="container">
    <div class="collections__head">
      <div>
        <p class="eyebrow eyebrow--gold">${esc(c.eyebrow)}</p>
        <h2 class="section-title" id="collections-title">${lines(c.heading)}</h2>
      </div>
      ${c.description ? `<p class="collections__intro">${esc(c.description)}</p>` : ''}
      ${c.viewAll ? `<a class="text-link text-link--gold" href="${attr(c.viewAll.href)}" data-explorer-open>${esc(c.viewAll.label)}${arrow()}</a>` : ''}
    </div>
    <ul class="collection-grid" data-count="${collections.length}">
    ${collections.map((item) => CollectionCard(item, ctx)).join('\n    ')}
    </ul>
    <div class="explorer" id="collection-explorer" role="region" data-explorer aria-labelledby="explorer-title" tabindex="-1">
      <div class="explorer__head">
        <div>
          <h3 class="explorer__heading" id="explorer-title">${esc(ex.heading)}</h3>
          <p class="explorer__intro">${esc(ex.intro)}</p>
        </div>
        <button class="btn btn--ghost explorer__close" type="button" data-explorer-close hidden>${esc(ex.closeLabel)}</button>
      </div>
      ${collections.length > 1 ? `<nav class="explorer__index" aria-label="${attr(ex.heading)}">
        <ul>${collections.map((item) => `<li><a href="#${attr(collectionAnchor(item.id))}" data-collection-link="${attr(item.id)}">${esc(item.title)}</a></li>`).join('')}</ul>
      </nav>` : ''}
      <div class="explorer__panels">
      ${collections.map((item) => ExplorerPanel(item, ex, enquiryHref, ctx)).join('\n      ')}
      </div>
    </div>
  </div>
</section>`;
}
