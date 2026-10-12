# Stage 3 design plan: narrow landscape art direction

Written before any Stage 3 change. Scope: the common poster/film/composition selection query and the Home
CSS that depends on it. No media, markup structure, controller behaviour, inner page or Contact change.

## Problem (coordinator browser review, shared feedback)

At 844×390 the Stage 2 query `(min-width: 900px) and (min-aspect-ratio: 6/5)` is false because of the
900px width guard, so the portrait poster/film is selected. Its cover crop at a 2.16:1 window clips the
fins and puts the fish into the copy.

## Selection contract (Stage 3)

| State | Query | Media | Crop | Composition |
| --- | --- | --- | --- | --- |
| Landscape | `(min-aspect-ratio: 6/5)` at every width | landscape poster + film | cover, 50% 50% | copy left, fish right |
| Narrow/short landscape | landscape **and** `(max-height: 560px)` | same | same | same left/right, compact sizing, hero grows |
| Near-square portrait | `(4/5 <= aspect-ratio < 6/5)`, no width/height guard | portrait | cover, 50% 30% | copy from ≈70svh, hero grows |
| Portrait | default | portrait | cover, 50% 30% | copy bottom-anchored (unchanged) |

One query string, written once in `src/pages.mjs` as the `<picture><source media>`. `site.js` already
reads `querySelector("source").media`, so the controller follows automatically (no JS edit). The CSS
landscape block uses the identical string.

## Geometry used for the narrow landscape layout (cover math from the supplied frame, not rendered)

Landscape frame: fish (with fins) x ≈ 56–81 %, y ≈ 31–69 % of 1280×720.

* 844×390 (2.16:1): width-limited cover, 844×475, 42 px cropped top and bottom. Fish x ≈ 473–684 px,
  y ≈ 27–73 %. Nothing of the fish is cropped.
* 667×375 (1.78:1): almost exact fit. Fish x ≈ 373–540 px.
* Copy column: inset 7vw + max-width min(30rem, 44vw) ends at ≈ 430 px (844) and ≈ 340 px (667), so it
  stays left of the fish with a 30–40 px gap and inside the left wash.

## CSS changes (`src/site.css`, Home scope only)

1. Landscape block query: drop `(min-width: 900px) and`.
2. New block `@media (min-aspect-ratio: 6/5) and (max-height: 560px)` right after the generic short-window
   rule: arrival `justify-content: flex-start`, `padding-block: 20px 32px` (min-height stays
   `100svh - header`, never a fixed height, so it grows and the page scrolls); copy max-width
   `min(30rem, 44vw)`; title `clamp(2rem, 4.6vw, 2.75rem)`; lead stays 1.0625rem (not shrunk); CTA keeps
   48 px minimum target height. Compact header: the existing <1100px Menu header (64 px) already applies to
   these widths; nothing new.
3. Near-square block: replace the Stage 2 two-branch query with `@media (4/5 <= aspect-ratio < 6/5)`
   (exact range, no height or width guard) and move it after every narrow-screen override (including the
   short-window rules) so its 70svh offset and padding win.
4. Comments and the env crop comment updated to the new contract.

Range syntax note: `(4/5 <= aspect-ratio < 6/5)` is Media Queries Level 4. Browsers without range
syntax ignore that block and fall back to the plain portrait composition, which is still usable.

## Unchanged

MP4/WebP bytes (verified by hash), `<video>` deferred `data-*-src`, controller states, Pause storage,
reduced motion/Save-Data, error/no-JS fallbacks, the seven inner pages, 404, Contact.
Phones 430×932 / 390×844 / 360×800 / 320×800 are aspect < 4/5, so they keep the portrait default.

## Checks to update / run

* `scripts/check-motion.mjs`: new QUERY; assert no `min-width` in the environment query; the
  short-landscape block exists after the landscape block; near-square uses the exact range and comes
  after all other Home media rules; aspect classification table for the brief's viewports.
* `scripts/check-motion-logic.mjs`: new QUERY constant only.
* `npm run build`, both checks, media hash comparison against the Stage 2 manifest, inner-page diff
  against the Stage 2 build output where available.
* Not runnable here: every rendered/browser check (recorded in self-review.md).
