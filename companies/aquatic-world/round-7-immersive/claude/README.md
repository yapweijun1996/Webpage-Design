# Aquatic World — Immersive Home

Status: **Stage 3 correction complete. Awaiting the coordinator's browser review and publication.** The common selection query is now `(min-aspect-ratio: 6/5)` at every width, so 844×390 and 667×375 get the landscape film and composition. Build and static/simulated checks pass. **No rendered, playback, loop-join or contrast check has been run by the worker.**

Worker: Claude Code CLI, model `claude-opus-5-5`, tools Read/Edit/Write/Bash, no browser, no MCP. Plans: [Stage 1](evidence/design-plan.md), [Stage 2](evidence/stage-2/design-plan.md), [Stage 3](evidence/stage-3/design-plan.md) (each written before its changes). Reviews: [Stage 2](evidence/stage-2/self-review.md), [Stage 3](evidence/stage-3/self-review.md).

## Stage 3: narrow landscape art direction

* **Selection contract.** One query, `(min-aspect-ratio: 6/5)`, with no width guard. It is written once as the `<picture><source media>` in `src/pages.mjs`. `site.js` reads it from there, and the CSS landscape block uses the same string. Landscape uses cover `50% 50%`; portrait uses cover `50% 30%`. Both are unchanged.
* **Narrow or short landscape** (`max-height: 560px` or `max-width: 899.98px` within landscape): the left copy / right fish composition with a compact Menu header. The copy column is `min(30rem, 44vw)` and ends left of the fish (estimated x ≈ 56–81 %). The title is `clamp(2rem, 4.6vw, 2.75rem)`, the lead keeps its size, and the CTA is at least 48px tall. In short windows the copy starts at the top and the hero grows, so the page scrolls instead of clipping.
* **Near-square portrait** is exactly `(4/5 <= aspect-ratio < 6/5)`, with no width or height guard. The copy starts at about 70svh. It is the last Home media rule.
* **Unchanged:** media bytes (verified by hash), `site.js`, markup apart from the query, the controller, the seven inner pages, 404 and Contact. In the `dist/` diff against Stage 2, only `index.html` and `assets/site.css` differ.
* **Checks run:** build OK, `check-motion` 98/98, `check-motion-logic` 40/40 (simulated), base-path build OK. Every rendered check is listed as not run in the Stage 3 self-review.

Statements below about the `(min-width: 900px) and (min-aspect-ratio: 6/5)` query and the Stage 2 near-square guard are superseded by Stage 3.

## Stage 2: real films and crop correction

* **Media** (`demo/assets/immersive/`): `landscape.mp4` (1280×720) and `portrait.mp4` (720×1280). Both are silent H.264, 24 fps, 144 frames, 6 s, with `moov` before `mdat`. The matching `landscape-poster.webp` and `portrait-poster.webp` replace the Stage 1 posters. SHA-256 and byte sizes equal `input-stage2/media/manifest.json`.
* **Provenance.** The films came from Runway Gen-4.5 and were then centrally edited: source frames 1–36 run out and back on cosine-eased indices over 144 frames. This is a disclosed return motion, not an untouched natural loop, with no dissolve or generated frames. The new paid total was US$1.44, and no further generation is allowed. The coordinator's selection is a technical preview candidate, not human creative approval.
* **Crop.** Poster and film always share one crop. Portrait (default): `cover`, `50% 30%`. Inside `(min-width: 900px) and (min-aspect-ratio: 6/5)`: `cover`, `50% 50%`. The `<picture>` source, the CSS and `site.js` use the same query, and an orientation change detaches the old film before the next paint. No transforms.
* **Near-square portrait** (min-aspect-ratio 4/5 while the landscape query is false, height ≥ 561 px). The arrival copy starts at 70svh and the hero grows, so the CTA and first chapter scroll naturally. Ordinary phones and portrait tablets keep the bottom-anchored copy.
* **Unchanged:** markup, the playback controller (deferred `data-*-src`, session Pause, reduced-motion/Save-Data poster with opt-in, menu/tab suspension, autoplay/error/no-JS fallbacks), the seven inner pages, 404 and the local-only Contact flow.

The table below is the Stage 1 change log. It is still accurate except where Stage 2 is noted above.

## What changed (all in `demo/`)

| File | Change |
| --- | --- |
| `assets/immersive/landscape-poster.webp`, `portrait-poster.webp` | Stage 1: generation-frame posters. **Stage 2: replaced by the supplied first-frame posters, plus the two films.** |
| `assets/motion/` | Removed. It held the old framed-scene PNG, which is no longer used. |
| `src/pages.mjs` | New Home: fixed environment (`<picture>` poster with the common query plus a `<video>` that has no `src`, only literal `data-landscape-src`/`data-portrait-src`), motion button, Arrival / Collection / Perspective chapters with the exact brief copy. The framed figure, particles, image cards, cream Story and paper Quality bands and photo enquiry band are gone. |
| `src/layout.mjs` | `document()` accepts `backdrop`/`utility` slots. Home header drops the header CTA and divider. Home gets a compact footer with a single disclosure. Inner pages render byte-identically to the baseline. |
| `src/site.css` | Home-scoped block (`body.page-home`): Georgia/Arial, `#041D25` / `#F3F0E7` / `#D4BE89`, transparent-to-translucent header, feathered readability washes, portrait-default composition with the landscape composition under `(min-width: 900px) and (min-aspect-ratio: 6/5)`, and a 44 px round motion control at bottom right. Old Home, particle and keyframe rules are deleted; shared rules are kept. |
| `src/site.js` | The Home controller replaces the particle controller (state table in the plan). The header/menu and Contact code is unchanged; the Contact section diff against the baseline is empty. |
| `scripts/build.mjs` | Accepts `{ body, backdrop, utility }` from a renderer. Copies `assets/immersive/` (Stage 2 films go there) instead of `assets/motion/`. |
| `scripts/serve.mjs` | Adds the `video/mp4` type and single byte-range (206) responses. Safari/iOS will not play local films without them. |
| `scripts/check-motion.mjs`, `check-motion-logic.mjs` | Rewritten for this contract. Both run without a browser. |
| `scripts/verify.mjs` | Inherited round-6 Chrome-DevTools harness. It is marked **stale** in place because its Home checks target the removed scene. Not run. |

## Preview commands (for the coordinator; the worker did not start a server)

```sh
cd demo
npm run build                    # root base → demo/dist
npm run serve                    # http://127.0.0.1:4192/  (or --port=N / AQUATIC_PREVIEW_PORT)
node scripts/build.mjs --base=/<project>/   # GitHub Pages project-base build
npm run check                    # static invariants + simulated controller logic
```

Rebuild the root base (`npm run build`) after any base-path test build. The `dist/` left by this run is the root build.

## Self-review: actually run (Stage 2)

| Check | Result |
| --- | --- |
| `npm run build` | 9 pages built (8 routes + 404). Films and posters copied unchanged. |
| `node scripts/check-motion.mjs` | **82/82 pass.** Adds the Stage 2 media bytes/hashes (source and dist), MP4 box order with no audio track, per-query crops for poster and film, no transform/stretch, and the near-square 70svh rule. All Stage 1 invariants still pass. |
| `node scripts/check-motion-logic.mjs` | **40/40 pass**, simulated with a stub DOM/video. Not browser evidence. |
| Base-path build (`--base=/pages-test/`) | All four Home media URL attributes are base-prefixed. I rebuilt with `/` afterwards. |
| `ffprobe` and frame contact sheets | Encoding matches the manifest. Frames 0/36/72 were inspected (`evidence/stage-2/inspection/`). |

## Not run (coordinator's CUA browser review)

* Every rendered view at the COMPARISON viewports and at the 900×900, 900×800 and 1000×900 near-square sizes, plus menu, focus and zoom.
* Real inline autoplay, the poster→film fade, the loop join of the return motion, live orientation changes, Safari/iOS/Android, Save-Data, reduced motion and no-JS rendering.
* Contrast over the moving film. The byte-range path of `serve.mjs` with the real MP4s; no server was started.

## Geometric estimates (cover math, not rendered)

| Viewport | Media / crop | Estimated fish | Copy |
| --- | --- | --- | --- |
| 1440×900, 1280×800, 1024×768 | landscape 50% 50% | x ≈ 56–82 %, y ≈ 31–70 % | left, from 7 vw |
| 900×900, 1024×1024 | portrait 50% 30% | y ≈ 12–58 % | starts ≈ 70svh |
| 900×800, 1000×900 | portrait 50% 30% | y ≈ 10–62 % | starts ≈ 70svh |
| 768×1024 | portrait 50% 30% | y ≈ 17–51 % | bottom of the hero |
| 430×932, 390×844, 360×800 | portrait (no vertical overflow) | y ≈ 20–46 % | bottom of the hero, not lowered |

## Risks and limitations for review

* **Short windows** (`max-height: 560px`): *Stage 2 text superseded.* Since Stage 3, short landscape windows such as 844×390 use the landscape film with left copy (see the Stage 3 section). Short near-square windows keep the copy from about 70svh, so the heading may sit below the first screen and is reached by scrolling.
* **Near-square CTA** is usually just below the first screen because the copy starts at 70svh. It is reachable by scrolling and never clipped.
* **Fixed scene behind chapters.** On portrait layouts the chapter text passes over the fish while scrolling, on a ≈ 0.72 wash. Not measured.
* **Chapter 3 enquiry action.** "Discuss a project" is an outlined button so the hero keeps the only gold CTA.
* **Unused image files.** The `hero-angelfish` WebP derivatives in `assets/img` still ship unused (the image pipeline was left untouched).
* **Process notes.** Stage 1 wrote one temporary scratch file to `/tmp` (deleted at once). Stage 2 made no outside writes. In Stage 2 I ran `git status`/`git diff --stat` once, read-only, which AGENTS.md disallows; nothing was staged or committed. No server, browser, network, agent or MCP use in either stage. `input/`, `input-stage2/`, `baseline/`, root contracts and Stage 1 evidence are unmodified.

## Stage 4: motion icon state
I checked the playback icon and no change was needed. The icons are switched by CSS keyed on the button's real `data-action` attribute, not by an SVG `.hidden` expando. See `evidence/stage-4/design-plan.md` and `evidence/stage-4/self-review.md`. Rendered verification is left to the coordinator.

## Stage 5: Home footer cascade

The Home footer base rule is now scoped as `.site-footer.home-footer`, so the later generic `.site-footer` rule no longer makes it opaque or removes the motion-control clearance. The aquarium shows through the existing soft translucent wash. Inner-page footers are unchanged. Plan and self-review: `evidence/stage-5/`. I couldn't check the rendered footer in a browser here; the coordinator owns that.
