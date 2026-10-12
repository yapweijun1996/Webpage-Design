# Stage 2 design and state plan — real immersive Home films (Claude Code worker)

Written before any Stage 2 change to `demo/`. Sources: `AGENTS.md`, `input-stage2/BRIEF.md`, `input-stage2/PROMPT.txt`, `input-stage2/media/manifest.json`, my Stage 1 plan (`evidence/design-plan.md`), README and the current `demo/` source. Stage 1 evidence, `input/`, `input-stage2/`, `baseline/` and root contracts stay unchanged.

## Supplied media (verified read-only)

| File | SHA-256 (matches manifest) | Probe |
| --- | --- | --- |
| `landscape.mp4` | `e2ae169d…cc38b` | H.264 High, yuv420p, 1280×720, 24/1 fps, 144 frames, 6.000 s, no audio stream |
| `portrait.mp4` | `df27628a…ac3a` | H.264 High, yuv420p, 720×1280, 24/1 fps, 144 frames, 6.000 s, no audio stream |
| `landscape-poster.webp` | `9f2be6ac…757e` | 1280×720 first frame |
| `portrait-poster.webp` | `40d48c19…f6f6` | 720×1280 first frame |

Disclosure carried into README: Runway Gen-4.5 output, centrally edited so source frames 1–36 run out and back on cosine-eased indices over 144 frames. It is a return motion, not an untouched natural loop. No dissolve and no generated replacement frames. The new paid total was US$1.44, and no further generation is allowed. The coordinator selected these films as a technical preview candidate. That is not human creative approval.

Frame inspection: I used `ffmpeg` to write two read-only JPEG contact sheets of output frames 0, 36 and 72 (72 is the outermost source frame 36) to `evidence/stage-2/inspection/`. These sheets are evidence only and are never used at runtime. The fish's travel is small. Portrait: fish plus trailing fins span about x 14–70 % and y 20–46 % of the source across the loop. Landscape: about x 56–82 %, y 31–70 %. The camera drifts slightly.

## Changes

1. **Bytes.** Copy the four files byte-for-byte into `demo/assets/immersive/`, replacing the Stage 1 posters. Markup paths stay unchanged: `<source srcset>`, `<img src>`, `data-landscape-src`, `data-portrait-src` are literal HTML URL attributes. The build already copies the folder.
2. **Common crop correction (CSS only).**
   * The default (portrait) applies to poster `img` **and** video: `object-fit: cover; object-position: 50% 30%`.
   * Inside the shared `(min-width: 900px) and (min-aspect-ratio: 6/5)` query, both poster and video use `50% 50%`.
   * The `<picture>` source, the CSS composition and the JS `sourceFor()` all use this one query, so the selected poster file, its crop, the attached film and the film's crop switch together. On a `change` event the controller drops the old film before the next paint (`detach()` → `data-video="none"`, opacity 0). The matching poster then shows until the new orientation's film plays. No transforms, no `scale` and no stretching.
3. **Near-square portrait arrival.** This applies under `(min-aspect-ratio: 4/5)` where the landscape query is false. In CSS that is `(min-aspect-ratio: 4/5) and (not ((min-width: 900px) and (min-aspect-ratio: 6/5)))`, written as two ranges to avoid relying on `not (…)` support: `(max-width: 899.98px) and (min-aspect-ratio: 4/5)` and `(min-aspect-ratio: 4/5) and (max-aspect-ratio: 6/5)`. Changes:
   * The arrival copy flows from the top with `padding-top: calc(70svh - header)` (70vh fallback), so the eyebrow starts at about 70 % of the small viewport.
   * The hero keeps `min-height: 100svh - header` with no fixed height. The copy plus bottom padding exceeds it, so the section grows and the CTA is reached by normal scrolling, not clipped. Chapter 2 follows naturally.
   * The scroll hint is hidden there because the copy itself continues below the fold. The wash starts lower so the fish stays clear.
   * Exception: at `max-height: 560px` (phone landscape, tiny windows), the fish covers most of the window at any crop. There the copy stays in the existing top flow so the H1 remains on the first screen. Recorded as a deliberate trade-off.
   * Ordinary phones (390×844, aspect 0.46) and portrait tablets (768×1024, 0.75) are below 4/5 and keep the bottom-anchored Stage 1 composition.
4. **Controller.** No state change is needed: deferred sources, session Pause, reduced-motion/Save-Data poster with explicit opt-in, menu/tab suspension, autoplay-blocked/denied, error, poster error, pagehide/pageshow and no-JS are already implemented. The Stage 1 expected "error fallback" state now becomes real playback for eligible visitors.
5. **Checks.** Update `scripts/check-motion.mjs`. Films are now required, hash and size checked against the manifest. It also checks the crop rules per query for poster and video, the near-square rule and the absence of transforms. Then run `npm run build`, `npm run check` and a base-path build.

## Cover geometry (portrait master 720×1280, `50% 30%`; fish source y ≈ 20–46 %)

| Viewport | Scale → rendered | Top offset | Fish y on screen | Copy start |
| --- | --- | --- | --- | --- |
| 900×900 | 1.25 → 900×1600 | −210 | ≈ 110–526 px (12–58 %) | 630 px (70 %) |
| 900×800 | 1.25 → 900×1600 | −240 | ≈ 80–496 px (10–62 %) | 560 px (70 %) |
| 1000×900 | 1.389 → 1000×1778 | −263 | ≈ 92–556 px (10–62 %) | 630 px (70 %) |
| 768×1024 | 1.067 → 768×1365 | −102 | ≈ 171–526 px (17–51 %) | bottom-anchored, ≈ 60 %+ |
| 390×844 | 0.659 → 475×844 | 0 (no vertical overflow; y position has no effect) | 20–46 % | unchanged |

Under the old `50% 50%` crop at 900×900, the offset was −350 and the fish top fell at about −30 px. The dorsal fin was clipped, which is the Stage 1 risk this stage corrects.

## Not changing

Copy, the seven inner pages, 404, category context, the Contact four-group local preview/Edit/Clear flow (no transmission), header/footer structure, fonts, the single gold CTA and the motion control. Browser rendering, playback, loop joins and contrast remain coordinator checks.
