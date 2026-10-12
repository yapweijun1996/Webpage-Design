# Stage 3 self-review: narrow landscape art direction

Worker: Claude Code CLI, `claude-opus-5-5`, Read/Edit/Write/Bash. No browser, server, network, Git, MCP,
agent or `/tmp` use in this stage. Plan written first: [design-plan.md](design-plan.md).

## Exact modifications

| File | Change |
| --- | --- |
| `demo/src/pages.mjs` | Home `<picture><source media>` changed from `(min-width: 900px) and (min-aspect-ratio: 6/5)` to `(min-aspect-ratio: 6/5)`. This is the only copy of the query in markup. `site.js` reads it via `querySelector("source").media`, so the controller follows with no JS edit. |
| `demo/src/site.css` | (1) The landscape composition/crop block now uses `@media (min-aspect-ratio: 6/5)` at every width. (2) A new compact block for `(min-aspect-ratio: 6/5) and (max-height: 560px), (min-aspect-ratio: 6/5) and (max-width: 899.98px)`: copy column `min(30rem, 44vw)`, title `clamp(2rem, 4.6vw, 2.75rem)`, lead kept at 1.0625rem, CTA at least 48px. (3) A new `(min-aspect-ratio: 6/5) and (max-height: 560px)` block: the arrival copy starts at the top with 20/32px padding. The min-height is unchanged, so the hero grows and the page scrolls. There is no fixed height and no overflow clip. (4) The near-square rule moved to `@media (4/5 <= aspect-ratio < 6/5)` with no width or height guard. It is now the last Home media rule, after every narrow-screen override. (5) Comments were updated. Crops are unchanged: landscape uses cover 50% 50% and portrait uses cover 50% 30%. |
| `demo/scripts/check-motion.mjs` | New `QUERY`/`SQUARE` constants. Near-square regex now targets the exact range. New checks: no width/height guard remains, near-square is the last Home media rule, the 900px guard is gone from CSS and HTML, the compact narrow/short landscape rules are present, the short landscape rule has no clip, and an aspect classification table for 12 brief viewports. One no-op `replace` was removed. |
| `demo/scripts/check-motion-logic.mjs` | `QUERY` constant only. |
| `evidence/stage-3/design-plan.md`, `self-review.md`, `stage2-dist-sha256.txt` | Plan, this review, and the Stage 2 `dist/` hash list captured before the rebuild. |
| `README.md` | Stage 3 section. |

Not touched: media, `site.js`, `layout.mjs`, `build.mjs`, `serve.mjs`, inputs, baseline, root contracts and earlier evidence.

## Checks actually run

| Check | Result |
| --- | --- |
| `npm run build` | 9 pages (8 routes + 404). |
| `node scripts/check-motion.mjs` | **98/98 pass** (was 82). Includes source and dist SHA-256/size of both MP4s and both posters against the Stage 2 manifest. |
| `node scripts/check-motion-logic.mjs` | **40/40 pass** with the new query string. This uses a stub DOM and is not browser evidence. |
| `cmp` source vs dist media | All four files are identical. |
| `dist/` hash diff vs Stage 2 build | Only `assets/site.css` and `index.html` differ. All 7 inner pages, 404, `site.js`, images and media are byte-identical. |
| Base-path build `--base=/pages-test/` | Source, poster and both `data-*-src` URLs are prefixed. Rebuilt with `/` afterwards and checks re-passed. |

## Geometric estimates (cover math from the supplied landscape frame, not rendered)

The fish with its fins sits at about x 56–81 % and y 31–69 % of the 1280×720 frame.

| Viewport | Query result | Fish (viewport) | Copy column ends |
| --- | --- | --- | --- |
| 844×390 | landscape, compact + short | x ≈ 473–684 px, y ≈ 27–73 %, no fin crop | ≈ 430 px (7vw + 44vw) |
| 667×375 | landscape, compact + short | x ≈ 373–540 px | ≈ 340 px |
| 900×900, 900×800, 1000×900 | near-square | portrait crop as in Stage 2 | copy from ≈ 70svh |
| 430×932, 390×844, 360×800, 320×800 | portrait (aspect < 0.8) | unchanged from Stage 2 | unchanged bottom-anchored offer/CTA |

Estimated short-landscape stack at 844×390: eyebrow, a 2-line title (≈ 39px), a 2–3-line lead and a 48px CTA. That is about 300px of content in a hero with a min-height of 326px. The CTA should be on or near the first screen, and anything below it scrolls. This is not measured.

## Not run (coordinator's CUA browser review)

* Every rendered view, especially 844×390, 667×375 and the phone/near-square/desktop sizes. Fish/copy separation, CTA visibility and the compact Menu header are all unverified.
* Range-syntax support for `(4/5 <= aspect-ratio < 6/5)`. Browsers without Media Queries Level 4 range syntax (for example, Safari before 16.4) ignore that block and fall back to the plain portrait composition.
* Live orientation changes between portrait and landscape film, inline autoplay, the poster→film fade, loop join, contrast over the moving film, Safari/iOS/Android, reduced motion, Save-Data and no-JS.

## Risks

* At 6/5 ≤ aspect ratios close to 1.2 with widths under 900 (e.g. 720×600), the landscape cover crops the frame's sides. The fish is then nearer the copy column. The left wash covers up to 54 %. This is estimated only.
* Landscape now also applies to small landscape windows below 600px wide, e.g. 568×320. The copy column there is about 250px wide.
