import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const assets = JSON.parse(readFileSync(path.join(root, 'assets/manifest.json')));
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const lines = value => esc(value).split('\n').join('<br>');
const arrow = '<span class="arrow" aria-hidden="true">⟶</span>';
const icons = {
 leaf:'<path d="M9 28C6 13 21 5 34 6c0 16-9 26-25 22Z"/><path d="m5 35 24-22M17 23l-1-8M17 23l9 1"/>',
 globe:'<circle cx="20" cy="20" r="16"/><ellipse cx="20" cy="20" rx="7" ry="16"/><path d="M4 20h32M7 10h26M7 30h26"/>',
 diamond:'<path d="m4 13 7-8h18l7 8-16 23Z M4 13h32M11 5l9 31 9-31M13 13l7-8 7 8"/>',
 fish:'<path d="M4 20c9-13 20-13 27 0-7 13-18 13-27 0Z M31 20l6-7v14ZM14 10l6-5 3 5M14 30l6 5 3-5"/><circle cx="11" cy="19" r="1"/>',
 branch:'<path d="M20 36V19M20 28l-10-9M20 22l10-10M10 19V9M10 15 5 11M30 12V5M30 9l5-4M20 19l-2-11"/>',
 frame:'<rect x="6" y="6" width="28" height="28"/><path d="M6 14h28M14 14v20M24 22l6 6M24 28l6-6"/>',
 wave:'<path d="M3 13c6-9 11 9 17 0s11 9 17 0M3 21c6-9 11 9 17 0s11 9 17 0M3 29c6-9 11 9 17 0s11 9 17 0"/>'
};
function icon(id) { if (!icons[id]) throw new Error(`Unknown icon: ${id}`); return `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.25" aria-hidden="true">${icons[id]}</svg>`; }
export function validate(c) {
 if (c.contentStatus !== 'DEMO_ONLY_NOT_APPROVED') throw new Error('This builder is for fictional local demos only.');
 if (c.enquiry.contactState !== 'unavailable') throw new Error('No live contact integration is implemented.');
 for(const field of ['brand','seo','ui','hero','heritage','collections','quality','highlights','enquiry','footer']) if(!c[field]) throw new Error(`Missing ${field}`);
 if (!c.hero.enabled || !c.collections.enabled || !c.enquiry.enabled) throw new Error('Hero, collections and enquiry are required for this demo.');
 if (!c.brand.name.trim() || !c.hero.title.trim() || !c.collections.items.length) throw new Error('Required content is empty.');
 const ids = new Set(['hero', 'main', ...['heritage','collections','quality','highlights','enquiry'].filter(id => c[id].enabled && (!['quality','highlights'].includes(id) || c[id].items.length))]);
 for (const item of c.collections.items) {
  if(!/^[a-z][a-z0-9-]*$/.test(item.id) || ids.has(`collection-${item.id}`)) throw new Error('Invalid or duplicate category ID.');
  ids.add(`collection-${item.id}`);
  if(!item.title.trim() || !item.alt.trim()) throw new Error('Category title and alt are required.');
 }
 const walk = object => {if (object.enabled === false) return; for (const [key,value] of Object.entries(object)) {
  if (key === 'navigation') continue;
  if(typeof value==='object' && value) walk(value);
  else if (key==='href' || key==='homeHref' || key==='returnHref') {
   if(typeof value!=='string' || !/^#[a-z][a-z0-9-]*$/.test(value)) throw new Error(`Unsafe or unsupported local link: ${value}`);
   if (!ids.has(value.slice(1))) throw new Error(`Missing destination: ${value}`);
  } else if(key.endsWith('imageId') || key==='imageId' || key==='backgroundImageId') {
   if(!assets.assets[value]) throw new Error(`Missing asset ID: ${value}`);
  }
 }}; walk(c);
 for (const n of c.navigation) if (!/^#[a-z][a-z0-9-]*$/.test(n.href) || !n.label.trim()) throw new Error('Invalid navigation item.');
 for(const asset of Object.values(assets.assets)) for(const v of asset.variants) if(!existsSync(path.join(root,v.file))) throw new Error(`Missing asset: ${v.file}`);
 const fixed = {'hero.primary':c.hero.imageId,'heritage.photo':c.heritage.imageId,'highlights.background':c.highlights.backgroundImageId,'enquiry.background':c.enquiry.backgroundImageId};
 for(const [slot,id] of Object.entries(fixed)) if(assets.slots[slot].asset_id!==id) throw new Error(`Fixed asset slot mismatch: ${slot}`);
 for(const item of c.collections.items.slice(0,3)) {const slot=assets.slots[`collections.${item.id}`];if(slot && slot.asset_id!==item.imageId)throw new Error(`Fixed collection slot mismatch: ${item.id}`);}
 if(c.highlights.enabled && c.highlights.items.length) for(const [i,slot] of ['betta','angelfish','plants','driftwood'].entries()) if(c.highlights.items[i].imageId!==assets.slots[`highlights.${slot}`].asset_id)throw new Error(`Fixed highlight slot mismatch: ${slot}`);
 return ids;
}
function image(id, prefix, options={}) {
 const a=assets.assets[id], vars=a.variants;
 const src=vars[options.large ? vars.length-1 : 0];
 return `<img class="${esc(options.className||'')}" src="${prefix}${src.file}" srcset="${vars.map(v=>`${prefix}${v.file} ${v.width}w`).join(', ')}" sizes="${esc(options.sizes||'100vw')}" width="${src.width}" height="${src.height}" alt="${esc(options.alt||'')}" ${options.eager?'loading="eager" fetchpriority="high"':'loading="lazy"'} decoding="async">`;
}
export function build(c,prefix) {
 const ids=validate(c);
 const nav=c.navigation.filter(n=>ids.has(n.href.slice(1)));
 const wordmark=()=>`<a class="wordmark" href="${esc(c.brand.homeHref)}"><span>${esc(c.brand.name)}</span><small>${esc(c.brand.tagline)}</small></a>`;
 const links=()=>nav.map(n=>`<a href="${esc(n.href)}">${esc(n.label)}</a>`).join('');
 const action=(a,kind)=>`<a class="button ${kind}" href="${esc(a.href)}">${esc(a.label)}${kind==='primary'?arrow:''}</a>`;
 const s=c.hero, h=c.heritage, g=c.collections, q=c.quality, f=c.highlights, e=c.enquiry;
 return `<!doctype html>
<html lang="${esc(c.seo.lang)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(c.seo.title)}</title><meta name="description" content="${esc(c.seo.description)}"><meta name="robots" content="${esc(c.seo.robots)}"><meta name="theme-color" content="${esc(c.seo.themeColor)}"><meta property="og:title" content="${esc(c.seo.title)}"><meta property="og:description" content="${esc(c.seo.description)}"><link rel="icon" href="data:,"><link rel="stylesheet" href="${prefix}tokens.css"><link rel="stylesheet" href="${prefix}styles.css"><script defer src="${prefix}app.js"></script></head><body>
<a class="skip-link" href="#main">${esc(c.ui.skip)}</a>
<header id="site-header" class="site-header"><div class="header-inner">${wordmark()}<button type="button" class="menu-toggle" data-menu-toggle aria-controls="main-navigation" aria-expanded="false" hidden><span data-menu-label data-open-label="${esc(c.ui.menu)}" data-close-label="${esc(c.ui.closeMenu)}">${esc(c.ui.menu)}</span><span class="menu-icon" aria-hidden="true"></span></button><nav id="main-navigation" class="main-nav" aria-label="${esc(c.ui.navLabel)}">${links()}${action(c.cta.secondary,'outline')}</nav></div></header>
<main id="main" tabindex="-1">
<section id="hero" class="hero" aria-labelledby="hero-title">${image(s.imageId,prefix,{className:'hero-image',eager:true,large:true,sizes:'100vw'})}<div class="hero-shade"></div><div class="container hero-inner"><div class="hero-copy"><p class="eyebrow">${esc(s.eyebrow)}<span class="kicker">${esc(s.kicker)}</span></p><h1 id="hero-title">${lines(s.title)}<em>${esc(s.accent)}</em></h1><p class="hero-description">${esc(s.description)}</p><div class="hero-actions">${action(c.cta.primary,'primary')}${action(c.cta.secondary,'outline')}</div>${s.motifs.length?`<ul class="hero-motifs">${s.motifs.map(m=>`<li>${icon(m.icon)}<span>${esc(m.label)}</span></li>`).join('')}</ul>`:''}<p class="concept-label">${esc(c.ui.demoLabel)}</p></div><p class="vertical-note hero-note">${lines(s.sideNote)}</p><p class="hero-bottom-note eyebrow">${lines(s.bottomNote)}</p></div></section>
${h.enabled?`<section id="heritage" class="heritage light-panel" aria-labelledby="heritage-title"><figure class="heritage-photo">${image(h.imageId,prefix,{alt:h.imageAlt,sizes:'(min-width: 900px) 45vw, 100vw'})}<figcaption><span class="eyebrow">${esc(h.imageCaption)}</span><span class="eyebrow">${esc(c.location.label)}</span><i aria-hidden="true"></i></figcaption></figure><div class="heritage-editorial"><div class="heritage-copy"><p class="eyebrow">${esc(h.eyebrow)}</p><h2 id="heritage-title">${lines(h.heading)}</h2><p>${esc(h.body)}</p><details class="text-disclosure"><summary>${esc(h.storyLabel)}${arrow}</summary><p>${esc(h.storyBody)}</p></details></div>${h.aside?`<aside class="heritage-aside"><span class="aside-mark" aria-hidden="true">✧</span><p>${lines(h.aside)}</p><i aria-hidden="true"></i><small class="eyebrow">${esc(h.asideLabel)}</small></aside>`:''}</div></section>`:''}
${g.enabled?`<section id="collections" class="collections" aria-labelledby="collections-title"><div class="container"><div class="collections-heading"><div><p class="eyebrow">${esc(g.eyebrow)}</p><h2 id="collections-title">${lines(g.heading)}</h2></div><p>${esc(g.description)}</p><a class="text-link" href="${esc(g.items[0].href)}" data-open-detail>${esc(g.allLabel)}${arrow}</a></div><div class="collection-grid">${g.items.map(i=>`<a class="collection-card" href="${esc(i.href)}" data-open-detail>${image(i.imageId,prefix,{alt:i.alt,sizes:'(min-width: 1024px) 220px, (min-width: 600px) 36vw, 50vw'})}<div class="collection-card-copy"><h3>${esc(i.title)}</h3><p>${lines(i.description)}</p>${arrow}</div></a>`).join('')}</div><div class="collection-detail-group" data-details>${g.items.map(i=>`<details id="collection-${esc(i.id)}" class="collection-detail" data-detail><summary>${esc(i.title)}</summary><div class="detail-layout">${image(i.imageId,prefix,{alt:i.alt,sizes:'(min-width: 768px) 420px, 90vw'})}<div><p class="eyebrow">${esc(c.ui.detailEyebrow)}</p><h3 tabindex="-1" data-detail-title>${esc(i.title)}</h3><p>${esc(i.detail)}</p><h4>${esc(c.ui.paletteLabel)}</h4><p>${esc(i.palette)}</p><h4>${esc(c.ui.notesLabel)}</h4><p>${esc(i.notes)}</p><p class="detail-note">${esc(c.ui.detailNote)}</p><div class="detail-actions"><a class="button outline" href="${esc(c.cta.secondary.href)}">${esc(c.ui.detailCta)}${arrow}</a><button class="text-link" type="button" data-close-detail hidden>${esc(c.ui.closeDetail)} <span aria-hidden="true">×</span></button></div></div></div></details>`).join('')}</div></div></section>`:''}
${q.enabled&&q.items.length?`<section id="quality" class="quality light-panel" aria-labelledby="quality-title"><div class="container quality-inner"><div class="quality-copy"><p class="eyebrow">${esc(q.eyebrow)}</p><h2 id="quality-title">${esc(q.heading)}</h2><p>${esc(q.description)}</p><details class="text-disclosure"><summary>${esc(q.detailLabel)}${arrow}</summary><p>${esc(q.detailText)}</p></details></div><ul class="quality-list">${q.items.map(i=>`<li><span class="quality-icon">${icon(i.icon)}</span><span class="eyebrow">${esc(i.title)}</span></li>`).join('')}</ul></div></section>`:''}
${f.enabled&&f.items.length?`<section id="highlights" class="highlights" aria-labelledby="highlights-title">${image(f.backgroundImageId,prefix,{className:'section-background',sizes:'100vw'})}<div class="container highlights-inner"><div><p class="eyebrow">${esc(f.eyebrow)}</p><h2 id="highlights-title">${lines(f.heading)}</h2></div><ul class="highlight-grid" aria-label="${esc(c.ui.galleryLabel)}">${f.items.map(i=>`<li><a class="highlight-card ${esc(i.fit)}" href="${esc(i.href)}" data-open-detail>${image(i.imageId,prefix,{alt:i.alt,sizes:'(min-width: 1024px) 180px, (min-width: 600px) 30vw, 45vw'})}<span>${esc(i.title)}</span></a></li>`).join('')}</ul><p class="vertical-note">${lines(f.sideNote)}</p></div></section>`:''}
<section id="enquiry" class="enquiry" aria-labelledby="enquiry-title">${image(e.backgroundImageId,prefix,{className:'section-background',sizes:'100vw'})}<div class="container enquiry-inner"><p class="enquiry-side eyebrow">${lines(e.sideNote)}</p><div class="enquiry-copy"><p class="eyebrow">${esc(e.eyebrow)}</p><h2 id="enquiry-title">${esc(e.heading)}</h2><p>${lines(e.description)}</p><details class="enquiry-disclosure"><summary class="button primary">${esc(e.actionLabel)}${arrow}</summary><div class="enquiry-information"><h3>${esc(e.noteHeading)}</h3><p>${esc(e.note)}</p><a class="text-link" href="${esc(e.returnHref)}">${esc(e.returnLabel)}${arrow}</a></div></details></div><p class="enquiry-signature">${lines(e.signature)}<i aria-hidden="true"></i></p></div></section>
</main><footer id="site-footer" class="site-footer"><div class="container footer-inner">${wordmark()}<nav aria-label="${esc(c.ui.footerNavLabel)}">${links()}</nav><p class="eyebrow footer-closing">${esc(c.footer.closing)}</p></div><div class="container footer-meta"><p>${esc(c.ui.footerNote)}</p><p>${esc(c.ui.copyrightLabel)} · ${new Date().getFullYear()}</p></div></footer></body></html>\n`;
}
function main() {
const fixtures=['default','minimal','five','alternate'];
mkdirSync(path.join(root,'fixtures'),{recursive:true});
const reports=[];
for(const name of fixtures) {
 const config=JSON.parse(readFileSync(path.join(root,`content/${name}.json`)));
 const html=build(config,name==='default'?'':'../');
 const output=name==='default'?'index.html':`fixtures/${name}.html`;
 writeFileSync(path.join(root,output),html);
 reports.push({fixture:name,output,brand:config.brand.name,categories:config.collections.items.length,quality:config.quality.enabled,highlights:config.highlights.enabled,bytes:Buffer.byteLength(html)});
}
console.log(JSON.stringify({status:'passed',fixtures:reports},null,2));
}
if (process.argv[1] === fileURLToPath(import.meta.url)) main();
