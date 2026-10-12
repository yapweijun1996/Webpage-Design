import { esc, lines, icon } from './lib.mjs';

export function Quality({ home }) {
  const q = home.quality;
  return `<section class="quality" id="quality" aria-labelledby="quality-title">
  <div class="container quality__inner">
    <div class="quality__text">
      <p class="eyebrow">${esc(q.eyebrow)}</p>
      <h2 class="section-title" id="quality-title">${esc(q.heading)}</h2>
      ${q.description ? `<p>${esc(q.description)}</p>` : ''}
      ${q.note ? `<p class="quality__note">${esc(q.note)}</p>` : ''}
    </div>
    <ol class="quality__steps" data-count="${q.items.length}">
      ${q.items.map((item) => `<li class="quality__step">
        <span class="quality__icon">${icon(item.icon)}</span>
        <span class="quality__label">${lines(item.title)}</span>
      </li>`).join('\n      ')}
    </ol>
  </div>
</section>`;
}
