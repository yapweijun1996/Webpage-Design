# Stage 3 — 200% Text, Rest of Home: Plan (Claude workspace)

Written 2026-10-12 before any source change. Inputs: REFINEMENT-PROMPT.txt, TASK.md, input/design/BRIEF.md ("At text enlargement or reduced height, content grows and scrolls naturally"; "Never reduce body text below 16px"). I inspected only this workspace's own code. Before editing I hashed the build, the source/scripts, the original and stage-2 evidence, and the frozen inputs/contracts (`pre-change-dist-sha256.txt`, `pre-change-src-sha256.txt`, `original-evidence-sha256.txt`, `stage-2-evidence-sha256.txt`, `frozen-contracts-sha256.txt`).

The stage-2 header and menu rules are not touched.

## Findings and causes in my code (`demo/src/site.css`)

The test doubles every element's computed font-size and numeric line-height. The viewport is 320×844 or 390×844, and the Home content width is 288px at 320 and 350px at 390. The glyph widths below are approximate Georgia/Arial advances, not measurements.

| # | What | Cause | Estimate at 320, 200% |
| --- | --- | --- | --- |
| 1 | **Discuss a project** (coordinator: x374) | `.btn { white-space: nowrap }`. The Home secondary action `.home-enquiry` never reset it, although `.home-cta` did | Arial 600 at 32px: label ≈276 + gap 10 + arrow 18 + padding 52 + border 2 ≈ 358px from x16, ending at ≈374 |
| 2 | **Footer brand** (coordinator: x349) | `.brand-name { white-space: nowrap }` in the Home footer. In the 1-column footer grid, the `1fr` track's minimum is the brand's min-content, so the nowrap brand stretches the grid | Georgia caps at 34px with 0.1em tracking ≈ 331px, ending at ≈347 |
| 3 | **Collection entry names** (not in the report, found on review) | `.home-entry` columns are `2.25rem minmax(0,1fr) auto`. The name track is ≈ content − 86px. A long word cannot wrap, so it overflows as ink, which element boxes do not show | "Ornamental" at 48px ≈ 256px in a ≈202px track (≈166px if rem also doubles), with ink reaching ≈x324–359 |
| 4 | **Closing heading word** (not in the report, my own estimate) | `.home-h2` has no word wrapping for a word wider than the column | "connection" at 64px ≈ 324px on a 288px line, so ink reaches ≈x340 |

The arrows are SVGs at a fixed 18×12px. They do not grow with text, so the Codex text-arrow finding has no counterpart here. The arrival heading, lead and gold CTA (already `white-space: normal`), quiet links, footer navigation (wrapping flex lists), disclosure and motion-control label are estimated to fit at 320/200%. I will not change them except through the safety net in fix D.

## Change (Home-only CSS; no markup, JS or content changes)

| Fix | Rule | Normal text | 200% text |
| --- | --- | --- | --- |
| A. Secondary enquiry action | `.page-home .home-enquiry { max-width: 100%; white-space: normal; }`, mirroring the existing `.home-cta` | ≈179px button fits on one line, so it is unchanged | The label wraps at word boundaries inside the outline ("Discuss a / project"). The arrow stays inside, and the button grows taller from its 52px minimum |
| B. Footer brand | `.home-footer .brand-name { white-space: normal; line-height: 1.15; }` | Still one line at every width (≈166px at 320). It is vertically centred in the unchanged 44px brand box, so it renders the same | Wraps only between AQUATIC and WORLD. No `overflow-wrap` or `word-break` is applied to the brand, so the word-boundary rule is kept, as in the stage-2 header. The `1fr` track minimum becomes the word "AQUATIC" (≈175px), so the grid no longer stretches. At ≥600px the `auto` brand track still reaches its one-line max-content whenever space allows |
| C. Collection entries reflow (content-sized) | `.home-entries { container-type: inline-size; }` plus `@container (max-width: 16em) { .home-entry { grid-template-columns: minmax(0,1fr) auto; grid-template-areas: "num arrow" "name name" "text text"; } }` | Container-query `em` uses the container's own font size. At 16px the condition means ≤256px, and the smallest ordinary Home content width is 284–288px (320 portrait, 568/667 landscape at 50vw), so ordinary compositions never switch | At 32px the condition means ≤512px, so at 390 and 320 each entry stacks: number and arrow on one row, then the name and note at the full row width (≈280px). "Ornamental" (≈256px) fits without splitting. A wide 200% window keeps the row layout with a wide name track |
| D. Word-wrapping safety net for narrow reading content | `.home-arrival-copy, .home-chapter-inner, .home-footer-base { overflow-wrap: break-word; }` | Has no effect when every word fits its line, which holds for all ordinary compositions | A single word wider than its whole line, such as "connection" at 64px in 288px, breaks inside the column instead of running past the viewport. This is the only remedy that neither shrinks nor clips. It also backs up fix C if `em` in container queries resolves differently. It is not applied to the header or footer brands |

Not changed: all type sizes and line-heights of ordinary text, the hero anchors and CTA, the stage-2 header and menu (including the brand's word-boundary rule), desktop, inner pages (every selector is Home-only: `.page-home`, `.home-*`), `site.js`, markup, media, films and policies, focus and nonmodal behavior, routes and Contact. I add no `overflow-x: hidden`, clipping, text-size preference, injection or QA hook.

## Checks planned

- Rebuild with `node demo/scripts/build.mjs`.
- Rerun `demo/scripts/check-motion.mjs`, because it reads site.css, and `evidence/stage-2/check-text-enlargement.mjs`, so the header/menu fix is still asserted.
- Add `evidence/stage-3/check-home-text-reflow.mjs`. It covers the rules and their Home scoping, no overflow-wrap on the brands, no shrinking, clipping, overflow-x or QA hooks, only `site.css` changed in `dist`, and media hashes. It also runs the arithmetic for the four cases at 320 and 390 with normal and 200% text, and the container threshold against ordinary content widths.
- Run a mutation check: revert fixes A/B/C in `dist`, expect FAILs, then rebuild clean.
- Confirm by hash that the original and stage-2 evidence and the frozen inputs/contracts are unchanged. `check-motion-logic.mjs` is not rerun if `site.js` is byte-identical.
- Coordinator browser acceptance remains open for all rendering: the 390/320 200% closed/open/scrolled Home with Range rects, and the ordinary compositions.
