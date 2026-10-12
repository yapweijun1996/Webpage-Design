// Shared render helpers. Components receive validated content and return HTML strings.
// Every configured string passes through esc()/attr(); no raw HTML is accepted from content.

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ESCAPES[c]);
}

export const attr = esc;

/** Render an array of lines (or a single string) joined by <br>. */
export function lines(value) {
  const list = Array.isArray(value) ? value : [value];
  return list.map(esc).join('<br>');
}

/** Plain-text version of a lines value, for accessible names and metadata. */
export function plain(value) {
  return (Array.isArray(value) ? value : [value]).join(' ');
}

export function html(strings, ...values) {
  return strings.reduce((out, s, i) => out + s + (i < values.length ? (values[i] ?? '') : ''), '');
}

/**
 * Responsive image from the asset registry.
 * opts: { sizes, eager, className, ctx }
 */
export function image(img, opts) {
  const { ctx, sizes = '100vw', eager = false, className = '' } = opts;
  const asset = ctx.assets.assets[img.asset];
  const src = (w) => `${ctx.prefix}${ctx.assets.basePath}/${img.asset}-${w}.${ctx.assets.format}`;
  const widths = asset.widths;
  const largest = widths[widths.length - 1];
  const srcset = widths.map((w) => `${src(w)} ${w}w`).join(', ');
  const style = [
    img.position ? `--pos:${img.position}` : '',
    img.mobilePosition ? `--pos-mobile:${img.mobilePosition}` : '',
    img.tabletPosition ? `--pos-tablet:${img.tabletPosition}` : '',
    img.fit ? `--fit:${img.fit}` : ''
  ].filter(Boolean).join(';');
  return `<img class="${attr(className)}" src="${attr(src(widths[Math.min(1, widths.length - 1)]))}" srcset="${attr(srcset)}" sizes="${attr(sizes)}" width="${asset.width}" height="${asset.height}" alt="${attr(img.alt ?? '')}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async"${style ? ` style="${attr(style)}"` : ''} data-asset="${attr(img.asset)}" data-largest="${largest}">`;
}

const ICONS = {
  fish: '<path d="M4 16c4-6 10-8 16-6 3 1 5 3 7 6-2 3-4 5-7 6-6 2-12 0-16-6Z"/><path d="M4 16 1 11v10l3-5Z"/><circle cx="22" cy="14.5" r="1.2"/><path d="M14 11c1 3 1 7 0 10"/>',
  leaf: '<path d="M16 29V14"/><path d="M16 18c-5 0-9-4-9-10 5 0 9 4 9 10Z"/><path d="M16 22c5 0 9-4 9-10-5 0-9 4-9 10Z"/>',
  branch: '<path d="M5 27c5-3 8-7 10-13l2-8"/><path d="M15 14c3 0 6-2 8-5"/><path d="M12 20c-3-1-5-4-6-7"/><path d="M17 6l3-3"/><path d="M23 9l4 1"/>',
  globe: '<circle cx="16" cy="16" r="12"/><path d="M4 16h24"/><path d="M16 4c4 4 5 8 5 12s-1 8-5 12c-4-4-5-8-5-12s1-8 5-12Z"/>',
  layers: '<path d="m16 5 12 6-12 6-12-6 12-6Z"/><path d="m4 16 12 6 12-6"/><path d="m4 21 12 6 12-6"/>',
  compass: '<circle cx="16" cy="16" r="12"/><path d="m20.5 11.5-2.8 6.2-6.2 2.8 2.8-6.2 6.2-2.8Z"/>',
  shield: '<path d="M16 4 26 8v7c0 6-4 11-10 13C10 26 6 21 6 15V8l10-4Z"/>'
};

export function icon(name) {
  const body = ICONS[name];
  if (!body) return '';
  return `<svg class="icon" viewBox="0 0 32 32" width="32" height="32" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}

export const ICON_NAMES = Object.keys(ICONS);

export function arrow() {
  return '<svg class="arrow" viewBox="0 0 24 12" width="22" height="11" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1 6h21"/><path d="m17 1 5 5-5 5"/></svg>';
}

/** Resolve a configured action id ("primary"/"secondary") to its link data. */
export function action(site, id) {
  return site.cta[id];
}
