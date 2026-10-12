# Stage 4 design/state plan: motion icon

- Scope: the Home background playback control only (`demo/src/pages.mjs` markup, `demo/src/site.css` icon rules, `render()` in `demo/src/site.js`).
- Required state map: eligible motion → `data-action="pause"` → Pause icon + "Pause background"; manual Pause → `resume` → Play icon + "Resume background"; explicit Resume → back to `pause`.
- Approach: icon visibility must come from real attributes. If the code already toggles icons through `data-action` CSS and never sets `.hidden` on an SVG, leave the source alone and only verify it.
