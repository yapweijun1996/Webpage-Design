# Fusion Home — Layout and State Plan (Claude workspace)

Written 2026-10-12 before any source change. Authority: AGENTS.md/TASK.md → input/design/BRIEF.md → REVIEW.md → CONCEPT-NOTES.md → the three raster concepts. Own baseline only (`baseline/demo` = `demo` at start, verified with `diff -r`). Baseline build: 98/98 static checks and 40/40 simulated controller checks passed before editing.

## Inputs inspected

- **desktop-v1.png** (1586×992): cream serif wordmark top-left and five regular-weight links top-right with a gold underline under Home. Water shows through the bar. Eyebrow, two-line heading, two-line description and a sand-gold CTA with an arrow share one left edge in the dark water on the left. The fish and its fins fill the right half. A circular pause control sits bottom right and "Scroll to explore" bottom centre.
- **mobile-v1.png** (853×1844): 18px-class wordmark, an outlined `Menu ≡` control, the whole fish in the upper half, and the copy plus a natural-width gold CTA in the lower water. The scroll hint is centred and the circular pause control is bottom right, separate from the CTA.
- **mobile-menu-v1.png**: a solid dark-teal panel under the bar, `✕ Close` at the Menu position, five rows with hairline separators and a gold bar beside Home. The arrival copy is intact below and the motion control is absent. *Not copied:* its ≈46px row pitch, its ≈327px lower edge and the ≈15px drop of the lower copy compared with the closed concept (raster drift named in CONCEPT-NOTES/TASK).
- **landscape-poster.webp** (1280×720): angelfish at about x 56–80%, y 31–70%; dark, quiet water on the left third; driftwood and plants along the bottom.
- **portrait-poster.webp** (720×1280): fish at about y 21–46% (fins to about 46%); the lower half is dark plants and rock, which is quiet water for the copy.

## What changes (Home only)

| Area | Baseline | Fusion target and implementation |
| --- | --- | --- |
| Compact switch | Shared 1100px (CSS + JS) | Home: below **1120px** (`max-width: 1119.98px`), exposed to site.js through a `data-compact-query` attribute on the Home header. Inner pages keep 1100px. |
| Desktop wordmark | clamp → ≈23px | Georgia regular **32px** (2rem), tracking 0.14em; estimated width ≈330px at 1440 |
| Desktop links | 16px, weight 500 | Arial **16px regular**; last label's text aligns to the 4.5% inset; gold underline only for the current page, a separate fog underline for hover and an outline for focus |
| Phone wordmark | ≈16–17px | **18px**, tracking 0.12em; below 360px: 17px, tracking 0.1em, 16px insets (estimated ≈166px beside the 98px control at 320px) |
| Menu control | Uppercase 13.6px label, 104px min | Outlined, sentence case 16px regular, **fixed 98×44px**, icon anchored left so `Menu`/`Close` never move it |
| Heading | 72px max 80px, −0.01em | Desktop clamp(2.75rem, 5vw, **4.5rem**) → 72px at 1440, line-height 1.04, **−0.03em**. Portrait clamp(2.4375rem, 1.2rem + 5.2vw, 3.75rem) → **≈39.5px at 390**, line-height 1.06 |
| Eyebrow | 13px, weight 600, 0.24em | Arial regular: 12px desktop, 11px phone, 0.2em |
| Description | 17–18px | Desktop 18px/1.55, max 21em (≈38–40 characters per line); phone 16px/1.55 |
| CTA | 52px, 26px padding | Desktop **56px**, 16px semibold, 24px padding; phone **52px**, 17px semibold, natural width ≈275px; 24px gap between label and arrow; still the only gold element on Home |
| Copy column | min(38rem, 42vw), 6vw phone inset | Desktop min(33.75rem, 42vw) (≤540px) at 7vw; portrait inset = header inset max(20px, 4.5vw), so the brand, copy and CTA share one left edge |
| Arrival spacing | centred, 40/96 padding | Desktop: 40/120 padding puts the heading top at ≈314px and the CTA top at ≈568px at 1440×900. Phone: 100px bottom padding with flex-end |
| Open menu | Full-width panel, uppercase "Current page" text, body scroll lock | Solid ocean-teal header and panel; five **56px** rows (min-height, so text enlargement grows them), hairline separators, gold vertical marker plus `aria-current="page"`, no annotation text, 24px bottom padding. **No scroll lock on Home** |

### Phone arithmetic at 390×844 (a design target, not a measurement)

Header 0–64. Arrival block is 64–844 with 100px bottom padding → CTA 692–744. Lead (2 lines × 24.8) + 26px gap → lead top ≈616. Heading 2 × 39.5 × 1.06 ≈ 84 + 20px gap → heading top ≈512 (brief: 505–515), eyebrow ≈480. The open panel is 64 + 5 × 56 + 24 + 1px edge = **369px** (brief: 360–380), so it ends ≈110px above the eyebrow. 360×800 and 320×800 use the same bottom anchoring: CTA bottom 700, heading top ≈466. At 320px the CTA uses 20px padding/16px gap (≈264px wide in a 288px column).

## Interaction states (controller)

Keep the baseline's nonmodal disclosure (button with `aria-expanded`/`aria-controls`; no `role="dialog"`, `aria-modal`, `inert`, focus trap or scroll lock on Home). Close on Escape (focus returns to the toggle), on outside click, when focus leaves the header and when the viewport leaves the compact range. Links stay ordinary page destinations. Opening suspends the film through the existing single render gate and hides the motion utility. Closing re-renders, so a manual Pause, policy stop or failure persists and eligible motion resumes. Short windows: the panel's height is capped at the visible height below the header (`100dvh` with a `100vh` fallback) and it scrolls internally, while the sticky header keeps Close at the top. Without JavaScript, the baseline's always-visible link row stays.

## Preserved

All eight routes plus 404, inner-page markup/CSS and their 1100px header, category `?interest=` context, four-group Contact validation/preview/Edit/Clear (nothing is sent). The four supplied media files stay byte-identical, with orientation `(min-aspect-ratio: 6/5)` at every width, covers at 50% 50% and 50% 30%, the near-square 70svh rule as the last Home media rule, and the narrow/short-landscape blocks. Also unchanged: reduced-motion/data-saving poster defaults without film download, explicit opt-in, session Pause, hidden-tab suspension and missing-media fallbacks. Nothing new is added: no decoration, particles, playback effects, dependencies or business claims.

## Verification plan (no browser available to this worker)

Extend the existing browser-free checks: `check-motion.mjs` gets fusion source/output contracts plus the panel and phone arithmetic from CSS values. `check-motion-logic.mjs` gets vm-stubbed menu scenarios: Close label, outside click, focus exit, Escape focus return, compact-query change on the Home 1120 query, menu × Pause/policy/blocked states, and no scroll-lock class side effects. Rendered layout, actual fit of fonts, contrast over moving frames, real focus order, text enlargement and playback stay **unrun** and go to the coordinator's CUA review.
