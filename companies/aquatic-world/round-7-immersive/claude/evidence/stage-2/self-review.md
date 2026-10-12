# Stage 2 self-review — real immersive Home films (Claude Code worker)

Plan: [design-plan.md](design-plan.md), written before the Stage 2 edits. This review covers source and build output only. **No browser rendering, playback or contrast check was run.** Those belong to the coordinator and are not claimed as passed.

## What changed

| File | Change |
| --- | --- |
| `demo/assets/immersive/landscape.mp4`, `portrait.mp4` | Added. Byte-for-byte copies of `input-stage2/media/`. |
| `demo/assets/immersive/landscape-poster.webp`, `portrait-poster.webp` | Replaced the Stage 1 posters with the supplied first-frame posters, byte-for-byte. |
| `demo/src/site.css` | Portrait default crop for poster **and** film is now `object-fit: cover; object-position: 50% 30%`. Inside `@media (min-width: 900px) and (min-aspect-ratio: 6/5)`, both use `50% 50%`. A new near-square portrait rule follows the landscape block (details below). |
| `demo/scripts/check-motion.mjs` | Stage 2 contract: film and poster bytes, sizes and hashes (source and dist), exact folder contents, MP4 box order and tracks, per-query crop rules, no transform/stretch, and the near-square rule. |
| `demo/scripts/build.mjs`, `check-motion-logic.mjs` | Comment updates only. They no longer describe the films as absent. |

There are no markup or controller changes. `src/pages.mjs`, `src/layout.mjs`, `src/site.js` and `src/content.mjs` are untouched since Stage 1, so the seven inner pages, 404, category context and Contact's four-group local preview/Edit/Clear flow are unchanged. No enquiry transmission was added.

### Crop consistency on orientation change

The `<picture>` `<source media>`, the CSS crop and composition, and `site.js` `sourceFor()` all evaluate the same query string. In JS the query is read from the `<source>` attribute, not hard-coded. When the query flips:

* The browser swaps the poster file.
* CSS swaps the poster and film crops together.
* The `matchMedia` `change` handler detaches the old film (`data-video="none"`, opacity 0) and, if playback is wanted, attaches the other orientation's `data-*-src`.

So a film is never shown with the other orientation's crop, and no transforms are involved.

### Near-square portrait arrival

```
@media (max-width: 899.98px) and (min-aspect-ratio: 4/5) and (min-height: 561px),
  (min-aspect-ratio: 4/5) and (max-aspect-ratio: 119999/100000) and (min-height: 561px)
```

These two ranges are exactly "min-aspect-ratio 4/5 while the landscape query is false". The second range stops just below 6/5, so at exactly 6/5 the landscape block wins. In this range:

* The arrival copy flows from `padding-top: calc(70svh - header)` (70vh fallback).
* The hero keeps `min-height: calc(100svh - header)` with no fixed height. The copy grows the section, so the CTA and chapter 2 follow by normal scrolling, never clipped.
* The readability wash starts about 96 px above the copy, in svh units.
* The scroll hint is hidden because the copy already continues past the fold.

Ordinary phones (390×844, 430×932, 360×800) and portrait tablets (768×1024, 820×1180) are narrower than 4/5. They keep the Stage 1 bottom-anchored copy.

## Checks actually run

| Command | Result |
| --- | --- |
| `ffprobe` (read-only) on both supplied films | H.264 High, yuv420p, 1280×720 / 720×1280, 24/1 fps, 144 frames, 6.000 s, single video stream, no audio. Matches the manifest. |
| `shasum -a 256` input vs `demo/assets/immersive/` | All four hashes equal the manifest. |
| `npm run build` | 9 pages (8 routes + 404). |
| `npm run check` → `check-motion.mjs` | **82/82 pass.** New checks: the four media files match manifest bytes and SHA-256 in source and dist; the folder holds exactly those four; each MP4 has `ftyp`, then `moov` before `mdat`, an `avc1` video track and no `soun` handler; portrait crop is 50% 30% and the landscape-query crop is 50% 50% for both poster and film; no other environment `object-position` rule exists; no transform or non-cover fit; near-square 70svh rule present with no fixed height; rule order. The Stage 1 checks still pass: deferred `data-*-src`, no eager `src`, `preload="none"`, muted/playsinline/loop, one gold CTA, exact copy, real links, routes, Contact. |
| `npm run check` → `check-motion-logic.mjs` | **40/40 pass**, simulated in `vm` with a stub DOM/video. Covers session Pause, reduced motion/Save-Data with opt-in, menu/tab suspension, orientation swap, blocked/denied/error, poster error, pagehide. |
| `node scripts/build.mjs --base=/pages-test/` | Home `srcset`, `src`, `data-landscape-src` and `data-portrait-src` are all prefixed `/pages-test/assets/immersive/…`. No unprefixed root URL. I then rebuilt with `/`, and the final `dist/` is the root build. |
| Frame inspection (`ffmpeg`, read-only input) | Contact sheets of output frames 0/36/72 are in `inspection/` (evidence only, not shipped). The fish's travel is small. Portrait fins stay within about y 20–46 % of the source. Landscape stays within about x 56–82 %, y 31–70 %. |

## Cover geometry (calculated, not rendered)

| Viewport | Media / crop | Fish on screen (approx.) | Arrival copy |
| --- | --- | --- | --- |
| 1440×900, 1280×800, 1024×768 | landscape 50% 50% | right, x ≈ 56–82 % | left, vertically centred (unchanged) |
| 900×900 | portrait 50% 30% | y ≈ 12–58 % (was −3 % top at 50% 50%: fin clipped) | starts ≈ 70 % |
| 900×800 | portrait 50% 30% | y ≈ 10–62 % | starts ≈ 70 % |
| 1000×900 | portrait 50% 30% | y ≈ 10–62 % | starts ≈ 70 % |
| 1024×1024 | portrait 50% 30% | y ≈ 12–58 % | starts ≈ 70 % |
| 768×1024 | portrait 50% 30% | y ≈ 17–51 % | bottom-anchored (unchanged) |
| 390×844, 430×932 | portrait (no vertical overflow, so Y position is moot) | y ≈ 20–46 % | bottom-anchored, unchanged (not lowered) |

## Not run (coordinator's browser review)

* All rendered layouts, including the near-square 900×900 / 900×800 / 1000×900 checks, phones and tablets, zoom and text enlargement.
* Real inline autoplay, the poster→film fade, the loop join of the return motion, orientation changes in a live browser, Safari/iOS/Android behaviour, real Save-Data/reduced-motion, and no-JS rendering.
* Contrast of the copy over the moving film, plus focus and keyboard order.
* The `serve.mjs` byte-range path with the real MP4s. No server was started.

## Limitations and judgement calls

* **Very short windows.** At `max-height: 560px` (for example, phone landscape 844×390, which uses the portrait film because it is narrower than 900 px), the near-square rule is not applied. At that crop the fish fills most of the window, so no copy position avoids it. I kept the H1 on the first screen in the existing top flow. Over the fish the text depends on the wash.
* At near-square sizes the CTA is usually just below the first screen (copy starts at 70svh by contract). It is reached by scrolling and is never clipped.
* The `119999/100000` upper bound leaves a theoretical gap below 6/5 (aspect 1.19999–1.2). In that gap the default portrait composition applies.
* The films are a disclosed return motion (out and back over source frames 1–36), not a natural loop. Coordinator selection is a technical preview candidate, not human creative approval.

## Process disclosure

* Writes: `demo/` (source, scripts, assets, `dist/`), `evidence/stage-2/design-plan.md`, `self-review.md`, `inspection/*.jpg` and root `README.md`. Nothing was written to `/tmp` or outside the workspace.
* `input/`, `input-stage2/`, `baseline/`, root contracts and Stage 1 `evidence/` files were not modified. I checked this with `find -newer input-stage2/PROMPT.txt`, which lists only the files above plus the harness's own `evidence/stage-2` logs.
* I ran `git status --short` and `git diff --stat` once, read-only, while verifying protected files. AGENTS.md forbids Git, so this was a slip. Nothing was staged, committed or pushed.
* No server, browser, network, MCP, other model or agent was used. No media generation, repair or substitution.
