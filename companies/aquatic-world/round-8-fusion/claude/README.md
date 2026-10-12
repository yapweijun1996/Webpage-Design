# Aquatic World — Fusion Home

Status: fusion Home implemented on the own round-7 baseline (2026-10-12). Source/output and simulated-controller checks pass. **Rendered browser review, creative acceptance and publication are pending with the coordinator.**

- Plan: [evidence/design-plan.md](evidence/design-plan.md)
- What ran and what did not: [evidence/self-review.md](evidence/self-review.md), raw output [evidence/check-output.txt](evidence/check-output.txt)
- Stage 2 (200% text header refinement): plan [evidence/stage-2/design-plan.md](evidence/stage-2/design-plan.md), self-review [evidence/stage-2/self-review.md](evidence/stage-2/self-review.md)
- Stage 3 (200% text, rest of Home): plan [evidence/stage-3/design-plan.md](evidence/stage-3/design-plan.md), self-review [evidence/stage-3/self-review.md](evidence/stage-3/self-review.md)

## Preview

Node ≥ 22, no dependencies. From this workspace:

```sh
cd demo
npm run build          # node scripts/build.mjs → demo/dist (8 routes + 404, media copied byte-for-byte)
npm run serve          # node scripts/serve.mjs → http://127.0.0.1:4192 (loopback; --port=N or AQUATIC_PREVIEW_PORT)
# or: npm run preview  (build, then serve)
```

GitHub Pages project base: `node scripts/build.mjs --base=/<repo>/`, then publish `demo/dist`. Rebuild without `--base` before running the checks, because they expect root paths.

Browser-free checks (run after a root build):

```sh
node scripts/check-motion.mjs        # 126 static source/output contracts + layout arithmetic model
node scripts/check-motion-logic.mjs  # 68 stubbed-DOM controller scenarios (film + menu disclosure)
```

`npm run verify` / `scripts/shots.mjs` drive Chrome over CDP. They were not run in this restricted worker, and `verify.mjs` is stale for the immersive Home.

## What changed

Home only. Desktop has a 32px Georgia wordmark, 16px regular links, a 72px two-line heading and a 56px sand-gold CTA on one left edge. The 390px phone has an 18px wordmark, an outlined fixed-size Menu/Close control, a ≈39.5px heading and one 52px CTA inside the first screen. Below 1120px the Home menu is a nonmodal, opaque disclosure under the bar, with five 56px rows. It has no dialog role, focus trap or scroll lock. It closes on Escape (focus returns to Menu), outside click, focus leaving the header or leaving the compact range. Opening it suspends the film and hides the motion control. Closing restores the earlier state, and a manual Pause or policy stop persists.

Kept unchanged: inner pages and their 1100px header, routes, category enquiry context, Contact validation/local preview/Edit/Clear (nothing is sent), the four supplied media files, the `(min-aspect-ratio: 6/5)` orientation with 50% 50% / 50% 30% covers, near-square 70svh layout, reduced-motion/data-saving poster defaults and all fallbacks.

## Stage 2 refinement (enlarged text)

Home compact header only (`demo/src/site.css`). At normal text sizes the bar stays 64px with a 98×44 Menu ending at 370px and a panel ending at ≈369px at 390×844. With enlarged text the bar grows instead of overflowing. The wordmark wraps only between AQUATIC and WORLD. Menu/Close grows to fit its label and keeps one size in both states. It moves to a second row only when it cannot share one (estimated at 320px and 200%). The panel starts under the actual bar, and its scroller is capped at the viewport height minus that bar. No text is shrunk or hidden.

Focused check (after a root build):

```sh
node evidence/stage-2/check-text-enlargement.mjs   # 18 source/output + arithmetic checks; not rendered
```

Rendered 200% text at 390 and 320 has not been checked by this worker.

## Stage 3 refinement (enlarged text, rest of Home)

Home only, in `demo/src/site.css`. The stage-2 header and menu are untouched. All four rules are inert at normal text.

- **Discuss a project** may wrap inside its outline (`white-space: normal; max-width: 100%`).
- **Footer brand** wraps only between AQUATIC and WORLD, so it no longer stretches the footer grid.
- **Collection entries** stack when the list is narrow for its own type size (`@container (max-width: 16em)`, i.e. ≤256px at 16px, which no ordinary width reaches). The number and arrow share a row, then the name and note take the full width.
- **Reading content** in the arrival, chapters and footer disclosure uses `overflow-wrap: break-word`, so a single word wider than its line breaks inside the column.

No text is shrunk, clipped or hidden, and there is no `overflow-x: hidden`.

- Plan: [evidence/stage-3/design-plan.md](evidence/stage-3/design-plan.md)
- Self-review: [evidence/stage-3/self-review.md](evidence/stage-3/self-review.md)

Focused check (after a root build):

```sh
node evidence/stage-3/check-home-text-reflow.mjs   # 25 source/output + arithmetic checks; not rendered
```

Rendered doubled text at 390/320 (Range rects, open/closed/scrolled) and the ordinary compositions remain for coordinator review.

## Current limits

- No page has been rendered by this worker. Layout positions (for example, the menu ending at ≈369px and the heading at ≈513px at 390×844) come from arithmetic on CSS values with estimated line counts, not from measurement.
- Font fit at the 1119/1120 transition and at 320px is estimated from approximate Georgia glyph widths and needs a browser check.
- Contrast over moving frames, real focus order, rendered 200% text, playback and loop joins, devices and assistive technology are unverified.
- On short phones (e.g. 375×667) the open menu temporarily covers the arrival heading; it is restored on close.
