# Stage 4 self-review: motion icon

## Finding
No SVG `.hidden` expando is used. `render()` sets the real `data-action` attribute on the button (`bgToggle.dataset.action = action`), and CSS picks the icon:
`.bg-toggle[data-action="pause"] .bg-icon--play, .bg-toggle:not([data-action="pause"]) .bg-icon--pause { display: none; }` (`demo/src/site.css:448`).
The label text and click behaviour come from the same `action` value, so the icon, accessible name and behaviour match: motion = Pause, after manual pause = Play/Resume, explicit Resume = Pause. The only `.hidden` write is on the HTML `<button>` itself, where `.hidden` does reflect the attribute.

**No source change was made.**

## Check (built output, `demo/dist`, after `npm run build`, 9 pages)
Static source/attribute check in Node over the built HTML/CSS/JS:
- 2 `bg-icon` SVGs, 0 with a `hidden` attribute
- both action-state CSS rules present
- JS sets `dataset.action`; no `.hidden` write on any icon element

## Not tested
Rendered SVG visibility in a browser. Browser self-review isn't available in this run, so the coordinator owns that check. Stage 1–3 evidence, media, layout, copy, Contact and other controller behaviour are unchanged.
