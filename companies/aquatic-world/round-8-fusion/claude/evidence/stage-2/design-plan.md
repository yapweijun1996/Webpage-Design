# Stage 2 — 200% Text Header Refinement Plan (Claude workspace)

Written 2026-10-12 before any source change. Inputs: REFINEMENT-PROMPT.txt, TASK.md, input/design/BRIEF.md §3–4 ("At text enlargement or reduced height, content grows and scrolls naturally"; "Short viewport or enlarged text: Close stays visible at the top; the link area can scroll within the available visible height"). I inspected only this workspace's own code. Pre-change hashes are in `pre-change-dist-sha256.txt`, `pre-change-src-sha256.txt` and `original-evidence-sha256.txt`.

## Coordinator finding and cause in my code

At 390×844 with every element's computed font-size and line-height doubled, the Home wordmark stayed one 362px line, Menu sat at x398 and the document was 504px wide.

The cause is in `demo/src/site.css`:

1. `.brand { flex: none }` and `.brand-name { white-space: nowrap }`. The wordmark can neither shrink nor wrap, so it pushes the Menu control out of the viewport.
2. `.header-inner { height: var(--header-h) }` is a fixed 64px height. A header that needs to grow cannot.
3. `.page-home .menu-toggle { width: 98px; height: 44px }` is a fixed box. At 32px the label overflows the outline.
4. The panel uses `max-height: calc(100dvh - var(--header-h))`, which assumes a 64px bar. If the bar grows, the scroller would extend below the visible viewport.

## Change (Home compact header only, CSS only)

| Area | Change | Normal text (unchanged result) | 200% text |
| --- | --- | --- | --- |
| Wordmark | Inside `.site-header` below 1120px: `flex: 1 1 0; max-width: max-content`, `white-space: normal`, line-height 1.15 | Grows to its one-line max-content width (≈181px at 390). The rest of the free space still goes to Menu's `margin-left: auto`, so the hit area and position do not change | Line breaking uses its min-content size (the word `AQUATIC`), so it wraps only between `AQUATIC` and `WORLD`. No `overflow-wrap: anywhere`, so it never breaks inside a word |
| Header row | `.js .page-home .header-inner`: `flex-wrap: wrap; height: auto; min-height: var(--header-h); padding-block: 8px; row-gap: 8px` | 64px bar: the 44px controls stay centred at y = 10 | The bar grows. If the wordmark and Menu cannot share a row (≈320px), Menu moves to a second row and stays right-aligned |
| Menu/Close | `min-width: 98px; min-height: 44px` instead of a fixed width/height, with 10px right padding. Two hidden zero-height pseudo-elements reserve the wider of `Menu` and `Close` | Still 98×44 with the same right edge (370 at 390px), because the content (≈95px) fits within the minimum width | Grows to fit its 32px label, and has the same size whether it shows Menu or Close, so the header anchors do not move on open |
| Panel scroller | `max-height: calc(100vh - 100%)` / `calc(100dvh - 100%)`. For an absolutely positioned box, `100%` is the height of its containing block, the sticky header, so the cap tracks the header's actual height | 844 − 64: identical to before | The viewport height minus the grown header, so the last row can scroll into view |

Unchanged: `top: 100%` already places the panel directly under the header's actual bottom edge. Also unchanged are the type sizes (no shrinking of enlarged text), desktop ≥1120px, inner pages (all new selectors are `.page-home`-scoped), `site.js`, markup, media, routes, nonmodal focus/dismissal and Pause/policy behavior. I am adding no text-size preference, runtime injection or QA-only stylesheet.

## Expected geometry (estimates from approximate Georgia/Arial advances, not measurements)

- **390×844 normal:** bar 64px, Menu 272–370, panel ends at 369px. These are the same as the stage-1 model.
- **390×844 at 200%:** `AQUATIC` at 36px ≈ 191px. Menu/Close ≈ 134px (15 + 18 icon + 8 gap + ≈83 label + 10). 191 + 16 + 134 ≤ 350, so the wordmark wraps to two lines beside Menu. The bar is ≈ 8 + 2 × 41.4 + 8 ≈ 99px. Menu/Close stays inside x ≤ 370. The panel starts at ≈99, and the scroller cap is ≈745px.
- **320 at 200%:** 175 + 12 + 134 > 288, so Menu wraps to a second row, right-aligned at x ≤ 304. The wordmark wraps to two lines across the row. The bar is ≈ 146px.

## Checks planned

- Rebuild with the existing build script.
- Rerun `check-motion.mjs`, because its CSS inputs changed. Update its two checks that asserted the old fixed 98×44 box and the `--header-h` panel cap.
- Add a focused verifier, `evidence/stage-2/check-text-enlargement.mjs`. It covers the new rules, normal-size invariants, the 200% arithmetic at 390 and 320, Home-only scoping, no font shrinking, no injection or QA hooks, `site.js`/markup/inner-page HTML identical to the pre-change build, and media hashes.
- `check-motion-logic.mjs` exercises only `site.js`, which does not change. I will confirm that by hash instead of rerunning it.
- Rendered 200% text, real wrapping and font metrics remain the coordinator's browser acceptance.
