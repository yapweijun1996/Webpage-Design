# Stage 5 design plan — Home footer cascade

- Finding: `src/site.css:421` `.home-footer { background: transparent; padding: 64px var(--home-inset) 96px; color; }` (0,1,0) is overridden by the later generic `.site-footer` rule (`src/site.css:798`, 0,1,0) — opaque `--ocean-950` background, and also bottom padding 28px (loses motion-control clearance), fog colour and 0.95rem size.
- Fix: scope the Home base rule as `.site-footer.home-footer` (0,2,0) so it wins regardless of order. No change to the generic `.site-footer` rule, inner-page footer markup, media or JS.
- Wash: keep `.home-footer::before` — translucent `rgba(var(--wash), 0.8)` (desktop gradient 0.86→0.4) with a top mask fading from transparent, so no hard opaque edge.
