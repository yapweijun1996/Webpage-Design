import { esc, attr, lines, image, icon, arrow } from './lib.mjs';

function SideNote(value, className) {
  if (!value || !value.length) return '';
  return `<p class="side-note ${className}" aria-hidden="true">${lines(value)}</p>`;
}

export function Hero({ site, home, ctx }) {
  const hero = home.hero;
  const actions = (hero.ctaIds || []).map((id) => ({ id, ...site.cta[id] })).filter((a) => a.href);
  const proof = site.features.showProofPoints ? hero.proofPoints : [];
  return `<section class="hero" id="top" aria-labelledby="hero-title">
  <div class="hero__media">
    ${image(hero.image, { ctx, eager: true, sizes: '100vw', className: 'hero__img' })}
  </div>
  <div class="hero__inner container">
    <div class="hero__content">
      ${hero.eyebrow ? `<p class="eyebrow eyebrow--gold hero__eyebrow">${lines(hero.eyebrow)}</p>` : ''}
      <h1 class="hero__title" id="hero-title">${esc(hero.title)}${hero.accent ? ` <em class="hero__accent">${esc(hero.accent)}</em>` : ''}</h1>
      <p class="hero__lead">${esc(hero.description)}</p>
      ${actions.length ? `<div class="hero__actions">
        ${actions.map((a, i) => `<a class="btn ${i === 0 ? 'btn--gold' : 'btn--outline'}" href="${attr(a.href)}">${esc(a.label)}${i === 0 ? arrow() : ''}</a>`).join('\n        ')}
      </div>` : ''}
      ${proof.length ? `<ul class="hero__proof">
        ${proof.map((p) => `<li>${icon(p.icon)}<span>${lines(p.lines)}</span></li>`).join('\n        ')}
      </ul>` : ''}
      <p class="demo-note">${esc(site.demoNotice)}</p>
    </div>
    ${hero.sideNotes ? `${SideNote(hero.sideNotes.top, 'side-note--top')}${SideNote(hero.sideNotes.bottom, 'side-note--bottom')}` : ''}
  </div>
</section>`;
}

export { SideNote };
