# Stage 2 self-review — enlarged background-motion label (Claude)

2026-10-13. This is a source review only. I had no browser, so every result below is a source/output
assertion or an arithmetic model, not rendered verification. The coordinator's browser acceptance
decides whether this passes.

## Finding

The reported defect applied to my implementation as well. `.bg-toggle-label` was
`white-space: nowrap`, sat 10px to the left of the fixed 44px button, and could only grow leftward.
At 320×375 with 200% text (26px/33.8px), "Resume background" needs about 260px (240px of text plus 20px
of padding). Only about 251px is free to the left of the button, so the label ran to x≈-9 and was
clipped, which matches `reference.jpg`. "Pause background" and "Play background" are shorter but shared
the same unbounded layout.

## Change (one rule in `demo/src/site.css`)

```css
.bg-toggle-label {
  position: absolute; right: calc(100% + 10px); bottom: calc(15px - 0.65em); bottom: calc(15px - 0.5lh);
  width: max-content;
  max-width: calc(100vw - 2 * max(16px, 2.2vw) - env(safe-area-inset-left, 0px) - env(safe-area-inset-right, 0px) - 54px);
  padding: 6px 10px; border-radius: 2px; white-space: normal; overflow-wrap: break-word;
  /* background, colour, font 0.8125rem/1.3, opacity 0 and pointer-events none: unchanged */
}
```

- **Bounded wrapping.** The label is as wide as its text up to the space between a left inset (mirroring
  the button's right inset and safe area) and the button. Beyond that it wraps between words. At 320
  the bound is 234px, so "Resume / background" sits on two lines. `overflow-wrap: break-word` is only a
  last resort for a single word wider than the bound; none of the three labels needs it at 200%.
- **Upward growth.** The old `top: 50%; translate: 0 -50%` centring would push a two-line label about
  2px past the bottom of a 375px viewport. The label is now anchored by its bottom at
  `15px − 0.5lh` inside the button's 42px padding box (the 44px box minus its 1px border). For one
  line, that is exactly where the old centring put it: (42 − (lh + 12)) / 2 = 15 − lh/2. So normal-text
  geometry is unchanged, and extra lines grow upward. Engines without `lh` use the `0.65em` fallback,
  which is the same value at line-height 1.3.
- **Not changed:** label copy, Play/Pause/Resume logic in `site.js`, accessible name (the label span's
  text inside the native button), the 44×44 button, the 2px gold `:focus-visible` outline with 3px
  offset, hover/focus-only reveal, `pointer-events: none`, menu-open hiding, and font size or colour.
  No overflow is hidden, no text shrinks and nothing is truncated or suppressed.

No other source file changed. Header states, layouts, disclosure, film and poster bytes, inner pages and
Contact are untouched. Their existing assertions all still pass unmodified.

## Checks run (from `demo/`)

| Command | Result | Saved output |
| --- | --- | --- |
| `npm run build` | Exit 0, 9 pages; `dist/assets/site.css` is byte-identical to `src/site.css` | `build-output.txt` |
| `node scripts/check-motion.mjs` | Exit 0, **150/150** (138 existing + 12 new) | `check-static-output.txt` |
| `node scripts/check-motion-logic.mjs` | Exit 0, 79/79 (unchanged) | `check-logic-output.txt` |

The 12 new static checks are:

- **Label rule.** `white-space: normal`, `width: max-content`, the exact bounded `max-width`,
  `overflow-wrap: break-word`, and no `nowrap`, `overflow: hidden`, `text-overflow` or `clamp()`. The
  font is still 0.8125rem/1.3.
- **Anchoring.** The label is bottom-anchored at `15px − 0.5lh` with no centring translate.
- **Button.** The 44×44 button, the focus outline and the hover/focus reveal are unchanged.
- **Copy.** `site.js` still carries the full "Play/Pause/Resume background" copy.
- **Geometry model (8 checks).** 320×375, 844×390, 667×375 and 1440×900, each at 100% and 200%. All
  three labels must stay within 0..w × 0..h, every single word must fit the bound, and the single-line
  label must stay centred on the button. Text widths use Arial advance widths. That estimate gives
  239.9px for "Resume background" at 26px, against the 240px of text the coordinator measured.

| Case | "Resume background" (model) |
| --- | --- |
| 320×375, 100% | 1 line, x111–251, y323–351 (same place as before) |
| 320×375, 200% | 2 lines, x17–251, y280–360 |
| 844×390, 200% | 1 line, x513–772, y327–372 |
| 667×375, 200% | 1 line, x338–598, y314–360 |
| 1440×900, 200% | 1 line, x1095–1355, y823–869 |

With the old `nowrap` rule, the same model puts the 320×375 200% label at x≈-9. That is consistent with
the reported clipping.

## Limits and what remains open for the coordinator

- No rendering, focus/hover screenshot, real font metrics, real 200% computed-style substitution or
  device safe-area values were observed. The geometry model uses constants that mirror the CSS, and
  Arial widths are an estimate. The real system-ui face may differ.
- `100vw` includes a classic (non-overlay) scrollbar. In a narrow desktop window with one, the bound is
  up to about 15px more generous than the visible area, so the label's left edge could sit as close as
  about 2px from the edge instead of 17px. It is still not clipped.
- When the label wraps, its box spans the full bound. Its lines are centred by the button's inherited
  `text-align: center`. This is a visual choice, not a fit issue.
- Re-test in the browser: Pause the film manually, then focus or hover the button at 320×375 with 200%
  text. Check that each label (Play, Pause, Resume) lies fully inside the viewport, that the focus ring
  stays visible, and that normal-text placement is unchanged at 390×844, 844×390 and 1440×900.
