# Stage 5 self-review — Home footer cascade

- Changed one selector only: `demo/src/site.css:421` `.home-footer` → `.site-footer.home-footer` (specificity 0,2,0 > generic `.site-footer` 0,1,0 at line 798). Home footer now resolves to `background: transparent`, 96px bottom padding (motion-control clearance), its own colour, and no 0.95rem override.
- Generic `.site-footer` rule and inner-page footers untouched; only `dist/index.html` carries `home-footer` (collections, contact, our-story, quality use plain `site-footer`).
- Wash `.home-footer::before` unchanged: translucent 0.8 (≥1024px gradient 0.86→0.4), top mask fades from transparent — no hard opaque boundary. Links, disclosure, Back to top unchanged.
- Build: `npm run build` built 9 pages; `dist/assets/site.css` byte-identical to `src/site.css`. No media, JS, markup or dependency changes.
- Not tested: rendered/computed-style check at 390×844 and 1440×900 (browser unavailable in this run; coordinator owns it).
