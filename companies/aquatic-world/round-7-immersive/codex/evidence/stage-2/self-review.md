# Stage 2 self-review

Date: 2026-10-12. Result: Stage 2 implementation and permitted local checks complete. Coordinator browser review, visual acceptance, human approval and publication remain open. This report does not claim a rendered site or seamless-loop pass.

## Implemented result

All four frozen input-stage2/media/ files are present in demo/assets/immersive/ and demo/public/assets/immersive/ with manifest-identical SHA-256 hashes and byte sizes. Matching Stage 2 posters replace the Stage 1 runtime posters. landscape.mp4 is 1,325,946 bytes; portrait.mp4 is 1,536,090 bytes. Runtime provenance documents Runway Gen-4.5 and the coordinator's explicit cosine-eased source-frame 1–36 forward/return sequence over 144 frames. It discloses six-second return motion and US$1.44 in new provider cost; it does not describe untouched natural loops or human approval. No worker asset edit, generation, repair or replacement occurred.

The common landscape query remains `(min-width: 900px) and (min-aspect-ratio: 6/5)`. CSS applies cover and portrait `50% 30%` to both img and video; the exact positive landscape query switches both to `50% 50%`. The same CSS applies in no-JS, default-poster, loading, paused and playing states. No transforms or stretch were introduced. The near-square portrait intersection (aspect ratio at least 4/5 and landscape query false) follows narrow-screen overrides and uses `padding-top:70svh`. Arrival has min-height and normal flow, with no fixed height/max-height/overflow that clips the copy or CTA. Standard 390×844 stays at 56svh and 320×800 stays at 53svh.

The implementation change is confined to demo/home-motion.css and immersive assets/provenance, plus their generated copies. build.py, home-motion.js, shared styles.css/script.js/site_data.py and every generated HTML page remain byte-identical to Stage 1. Seven inner pages and 404 also match own baseline renderers byte-for-byte. The fixed environment still belongs to the full Home, through the transparent header, three chapters and footer. Exact English copy, live Georgia/Arial typography and gold CTA are preserved. No new particles, framed player, timeline, opaque split column, white Home band or raster interface was introduced.

Literal HTML URL attributes still own both deferred film URLs and matching posters for Pages rebasing. Eligible controller states attach only the selected source; reduced motion, exposed Save-Data, retained manual Pause, initially open menu and hidden entry attach no film automatically. Manual/session stop, explicit opt-in, menu/tab suspension, loading/error/autoplay/no-JS fallbacks and scroll stability remain the existing implementation. The small accessible Pause/Resume control remains distinct from the primary CTA. These are source/stub findings, not observed native browser behavior.

The four-group Contact validation/local preview/Edit/Clear code and category context are unchanged. The demo still states that copy/imagery are fictional and enquiries are local previews only. No enquiry transmission or submission service was introduced.

## Executed local checks

| Check | Observed result | Evidence / limit |
| --- | --- | --- |
| Existing stdlib build | Pass: eight independent pages plus 404 | demo/public/ rebuilt; no server started |
| Runtime JS / Python syntax | Pass | Node checks for both runtime scripts; Python AST parsing for build/data/server/verifier |
| Source and final output invariants | Pass: 84 assertions | source-checks.json; source evidence only |
| Local destinations/resources/fragments | Pass: 351 references resolve | Both actual MP4s checked; no missing-film exceptions |
| Four assets in source and output | Pass: all sizes/hashes match frozen manifest | Four files × two runtime directories |
| Stage 1 implementation preservation | Pass | build.py and home-motion.js retain pre-edit hashes; no HTML files changed |
| Inner pages, 404 and shared Contact sources | Pass | Own baseline evaluated in memory; no baseline writes |
| Controller logic | Pass: 12 bounded scenarios | DOM/event/video stubs; no actual browser, download, decode or layout |
| Crop/arrival CSS source geometry | Pass: 21 viewport cases | geometry-checks.json; mathematical cover model, not rendered crops |
| Offline real-film metadata/decode | Pass: each film decodes 144 frames | H.264, yuv420p, 24fps, six seconds, correct dimensions, single video stream and no audio |
| Poster encoding/dimensions | Pass | WebP, 1280×720 / 720×1280; manifest-identical bytes |
| Frozen inputs/contracts/Stage 1 evidence | Pass: 69 SHA-256 entries unchanged | immutable-before.json includes input-stage2/ and all historical evidence |

The media checks found 144 distinct decoded-frame MD5 values per encoded film. First and last decoded-frame hashes differ, despite the manifest's disclosed reuse of the same source-frame index at both ends. These are lossy encoded outputs; hash inequality alone neither proves nor disproves a visible seam. No visually observed loop-join result is inferred. Source variation and successful offline decoding do not establish browser advancement, natural motion or perceptual continuity.

The 12 controller scenarios include selected rebased URLs; eligible portrait entry and both orientation switches with matching video/poster paths; scroll timeline stability; manual Pause/session return; reduced-motion opt-in/revocation; Save-Data; menu isolation/Tab boundaries; hidden entry/lifecycle; denied autoplay without retries; invalid source/orientation recovery; orientation while paused; late promise protection; buffering and unavailable storage/connection APIs. These exercise logic only. CSS layer agreement is covered separately by the source geometry check.

## Requested crop geometry

The table reports the visible rectangle in source coordinates after cover positioning, before any browser rendering. For top-padding pixel values only, assume svh equals the listed viewport height. It does not identify fish bounds, compute text wrapping or establish subject margins.

| Viewport | Selected source / position | Visible source rectangle (x, y, width, height) | Arrival top |
| --- | --- | --- | --- |
| 900×900 | Portrait / 50% 30% | 0, 168, 720, 720 | 70svh ≈ 630px |
| 900×800 | Portrait / 50% 30% | 0, 192, 720, 640 | 70svh ≈ 560px |
| 1000×900 | Portrait / 50% 30% | 0, 189.6, 720, 648 | 70svh ≈ 630px |
| 390×844 | Portrait / 50% 30% | 64.265, 0, 591.469, 1280 | Existing 56svh ≈ 472.64px |
| 320×800 | Portrait / 50% 30% | 104, 0, 512, 1280 | Existing 53svh ≈ 424px |

All eight comparison viewport cases are included, along with 900×750/751, 899×749, 1000×833/834 transition boundaries, the 4/5 boundary at 640×800 versus 639×800, short square phones and 900×600. Poster/video crop positions match in every modeled case. Short square phones receive 70svh even below the narrower 359px override. The first chapter can expand beyond the initial viewport, keeping the CTA in document flow. Actual viewport switching, fish/fin clearance and CTA visibility require coordinator observation.

## Acceptance still open

All eight COMPARISON.md rendered gates remain not run in this worker. Gates 1–4 and 6–8 have source/output or stub evidence; gate 5 now has real supplied files and offline decode evidence. None is recorded as a browser pass. No visual score or human acceptance is claimed.

Coordinator checks must cover the continuous environment at each chapter/footer; standard-phone initial CTA fit and control separation; enlarged text/short windows; fish and full fins throughout moving frames at all requested crops; header/text/focus contrast; real Menu/Close/Escape/focus and no-JS behavior; native reduced-motion/Save-Data/autoplay policies; tab/session return; actual advancement without scroll resets; opening-poster handoff and at least three visually observed loop joins per orientation. Physical iOS Safari/Android Chrome and packaged Pages URLs, direct load/refresh/history are also not tested here. Source cover geometry cannot replace those checks.

No browser/OS automation, screenshots, server, other model/agent/advisor, MCP/provider/service/network, outside write (including /tmp), dependency/configuration/permission change, Git operation, publication, upload or enquiry occurred. The local image tool inspected only permitted own/input images. The routed instruction-modules directory was unavailable; the core and explicit stage contracts supplied the working rules. Launch/process metadata and coordinator reports were not inspected or edited. No temporary debugging or extracted media files were created.

## Reproducible Stage 2 checks

Run from the workspace root using existing installed tools:

```sh
python3 -B demo/build.py
node --check demo/home-motion.js
node --check demo/script.js
python3 -B evidence/stage-2/verify_stage2.py
node evidence/stage-2/controller-checks.cjs
python3 -B evidence/stage-2/geometry-checks.py
python3 -B evidence/stage-2/media-checks.py
```

Reports live only in evidence/stage-2/. The old Stage 1 checks/reports remain historical, including their then-absent-film expectations, and must not be run against Stage 2 to overwrite historical evidence. Preview instructions in root README.md are for the coordinator; this worker did not execute them.
