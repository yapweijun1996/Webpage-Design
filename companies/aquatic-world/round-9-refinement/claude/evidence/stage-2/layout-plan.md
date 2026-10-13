# Stage 2 layout plan — enlarged background-motion label

Written before any change in this run.

## Defect and whether it applies here

The coordinator reported a clipped visible label during A1: at 320×375, with each element's computed
font size and numeric line height doubled once, Pause the film manually and then focus the motion button.
"Resume background" then runs off the left edge (outer x=-17.92..242, text x=-7.92..232, opacity 1).
`evidence/stage-2/reference.jpg` shows the same defect: the pill is cut at x=0 and its first letter is
partly lost.

My own source (`demo/src/site.css`, `.bg-toggle-label`) has the same defect:

- The button is fixed with `right: max(16px, 2.2vw)` (16px at 320), 44×44, so its left edge is x=260.
- The label is `position: absolute; right: calc(100% + 10px)` and `white-space: nowrap`. Its right edge
  is x=250, and it can only grow leftward.
- Normal text is 13px/1.3. At 200% it is 26px/33.8px, so "Resume background" is about 240px of text
  plus 20px of padding, about 260px wide. The left edge lands near x=-10, so the label is clipped.
- The label is vertically centred on the button (`top: 50%; translate: 0 -50%`). If it wrapped while
  still centred, a two-line label (≈80px high) would also reach past the 375px bottom edge (button centre
  y=337, so bottom ≈377).

So a correction is needed.

## Correction (scoped to `.bg-toggle-label`)

1. **Bounded wrapping instead of nowrap.** Use `white-space: normal; width: max-content` with a max-width
   equal to the space between the left inset and the button. The left inset mirrors the right inset:
   `100vw − 2 × max(16px, 2.2vw) − left/right safe-area insets − 44px button − 10px gap`.
   At 320 that is 234px. The label's left edge therefore can't pass x=16, and its text wraps between
   words, e.g. "Resume / background". Add `overflow-wrap: break-word` as a last resort for any single
   word wider than the bound. No overflow hiding, no font shrinking, and the copy stays the same.
2. **Grow upward, not downward.** Anchor the label's bottom instead of its centre, at
   `bottom: calc(16px − 0.5lh)` (with a `calc(16px − 0.65em)` fallback for engines without `lh`).
   For a single line this is exactly the old centred position, since (44 − (lh + 12)) / 2 = 16 − lh/2.
   So the normal-text appearance doesn't change. Extra lines grow upward, away from the bottom edge.
   At 200% (lh 33.8px) a single line sits 0.9px below the button's bottom edge (y≈360 at 375). Two
   lines span y≈280–360, inside the viewport.
3. **Unchanged:** the button (44×44 target, fixed position, gold `:focus-visible` outline with 3px
   offset), hover/focus-only reveal, `pointer-events: none`, label text, accessible name (the label
   span's text), Play/Pause/Resume logic, menu-open hiding, every other Home/inner-page rule, film and
   poster bytes, and Contact.

## Expected geometry (arithmetic, not rendering)

| Case | Label bound | Expected result |
|---|---|---|
| 320×375, normal 13px | 234px | "Resume background" ≈120+20px, one line, same place as before |
| 320×375, 200% 26px | 234px | wraps to two lines, x≈16..250, y≈280..360 |
| 844×390 / 667×375, 200% | ≥ 500px | one line ≈260px, left of the button, inside the viewport |
| 1440×900, normal | large | unchanged |

Play/Pause labels ("Play background" and "Pause background") are no longer than "Resume background", so
they are covered by the same bound.

## Checks

- Add static assertions to `scripts/check-motion.mjs` for the label: no `nowrap`, a bounded `max-width`
  derived from the inset, gap and button, bottom anchoring, and the hover/focus reveal kept. Also add an
  arithmetic model for 320×375 at 200% (Arial advance widths, an estimate) checking that the wrapped
  label stays inside 0..320 × 0..375. Existing assertions stay unchanged.
- Run `npm run build` and `npm run check`, and save the outputs under `evidence/stage-2/`.
- Not available here: real rendering, focus/hover screenshots or font metrics. The coordinator's browser
  acceptance remains the proof of rendered fit.
