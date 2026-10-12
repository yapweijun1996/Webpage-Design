# Stage 3 self-review

Date: 2026-10-12. Result: focused correction implemented, built and checked within the authorized source/output scope. Rendered re-review and visual acceptance remain open. No browser pass is claimed.

## Result and exact modifications

The shared Stage 3 brief reports that both candidates selected portrait at 844×390 because of a 900px width guard, clipping fins into the copy. Own HTML/controller/CSS inspection confirmed this guard. No sibling, coordinator report or evaluator script was read.

| Changed source | Exact change |
| --- | --- |
| demo/build.py | Home picture source media changes only from `(min-width: 900px) and (min-aspect-ratio: 6/5)` to `(min-aspect-ratio: 6/5)` |
| demo/home-motion.js | The same single matchMedia query changes; all other controller bytes remain the Stage 2 implementation |
| demo/home-motion.css | Landscape crop query loses its width guard; portrait branch becomes `(aspect-ratio < 6/5)`; narrow landscape composition rules follow narrow-width overrides; final near-square rule becomes exactly `(4/5 <= aspect-ratio < 6/5)` |
| demo/assets/immersive/README.md | Current selection/composition contract updated to Stage 3; supplied media hashes and generation facts unchanged |
| demo/public/index.html | Rebuilt Home HTML changes only the picture source query |
| demo/public/home-motion.js, home-motion.css, assets/immersive/README.md | Exact generated copies of the three changed runtime sources |

These are exactly eight changed demo files, with no additions or removals. root README.md and new evidence/stage-3/ files document the current result. Inputs, baseline, earlier evidence and other root contracts remain unchanged.

At every width, landscape is selected for aspect ratio at least 6/5; portrait is selected below 6/5. Picture, JS and CSS agree. Both img/video use cover without transforms; landscape remains 50% 50% and portrait 50% 30%. The supplied four MP4/WebP files are byte-identical to the Stage 2 manifest in both source and output.

At landscape widths below 900px, arrival/reading zones are limited to 46vw, starting 7vw from the left. The existing horizontal local wash and compact menu retain the water environment. Arrival starts at `clamp(112px,24svh,190px)`; heading is 32–50px, support copy stays 18px and CTA stays 16px with responsive inline padding/gap. Short windows can extend the arrival chapter and scroll normally: no content height, max-height or overflow clipping was added. A complete CTA in the initial narrow landscape screen is not asserted.

The exact near-square portrait range, 4/5 inclusive to 6/5 exclusive, receives 70svh top padding after every narrow-screen override. It has no width or height guard. All exact source selector/declaration groups evaluated for the four standard portrait phones match the reconstructed Stage 2 CSS, whose original pre-edit SHA-256 was independently verified. 430×932, 390×844 and 360×800 retain 56svh; 320×800 retains 53svh. This preserves source rules; actual first-screen fit remains untested.

Seven inner pages and 404 remain byte-identical to Stage 2 output and own baseline rendering. Shared styles.css, script.js, site_data.py, serve.py, favicon and asset-preparation source are unchanged. Contact keeps category context, four groups, validation/local preview/Edit/Clear and honest no-send behavior. Exact Home English copy, three chapters, footer, Georgia/Arial type and real destinations remain intact.

The controller's only edit is the query. Deferred literal HTML URLs and policy/manual pause intent are retained. Bounded stubs check eligible entry, both orientation switches, session Pause, reduced motion/Save-Data, explicit opt-in, menu/tab suspension, denied autoplay, errors, late promises and loading. Two added scenarios exercise narrow landscape entry/rotation and source-free restrictive/manual/menu/hidden entry. These are logic checks, not native browser or download observations.

## Executed checks

| Check | Observed result | Scope |
| --- | --- | --- |
| Existing Python build | Pass: eight independent pages plus 404 | Static output generated; no server |
| JS/Python syntax | Pass | Node syntax checks and Python AST parsing without bytecode writes |
| Source/output checks | Pass: 89 assertions; 351 local references resolve | source-checks.json; includes unchanged inner HTML/shared source and query-only builder/controller edits |
| Controller scenarios | Pass: 14 | controller-checks.json; DOM/event/video stubs only |
| Viewport geometry | Pass: 37 cases | geometry-checks.json; exact ratio boundaries, cover math and bounded CSS-source declarations |
| Media bytes | Pass: four files × source/output | Exact SHA-256 and byte-size matches against supplied Stage 2 manifest |
| Frozen content | Pass: all 88 protected file hashes | Includes all input stages, baseline, earlier evidence and other root files |
| Demo inventory / documentation links | Pass | final-checks.json; exactly eight intended file changes and existing local documentation targets |

Stage 2's offline full-film decoding evidence remains frozen. No media was altered, so no redundant decode or media repair was performed. Stage 1/2 verification scripts were not run because they write historical reports and encode the earlier contracts.

## Source geometry samples

These source rectangles precede browser rendering; they do not identify fish bounds or establish fin margins. Numerical top offsets assume svh equals the stated viewport height.

| Viewport | Selected source / position | Visible source rectangle (x, y, width, height) | Arrival top |
| --- | --- | --- | --- |
| 844×390 | Landscape / 50% 50% | 0, 64.265, 1280, 591.469 | 112px |
| 667×375 | Landscape / 50% 50% | 0, 0.18, 1280, 719.64 | 112px |
| 720×600 | Landscape / 50% 50% | 208, 0, 864, 720 | 144px |
| 719×600 | Portrait / 50% 30% | 0, 203.75, 720, 600.834 | 70svh ≈ 420px |
| 900×900 | Portrait / 50% 30% | 0, 168, 720, 720 | 70svh ≈ 630px |
| 390×844 | Portrait / 50% 30% | 64.265, 0, 591.469, 1280 | Existing 56svh ≈ 472.64px |
| 320×800 | Portrait / 50% 30% | 104, 0, 512, 1280 | Existing 53svh ≈ 424px |

The 37 cases include all eight original comparison viewports, both reported narrow landscape sizes, near-square portrait windows, former 900px transitions and exact/adjacent 4/5 and 6/5 boundaries down to narrow widths. Source checks confirm both visual layers agree and copy can remain in a growing section. They do not establish text wrapping, subject clearance or browser switching behavior.

## Unrun browser checks

All rendered gates remain not run by this worker. The coordinator must re-review 844×390 and 667×375 at scroll zero, with settled visible media and readable compact navigation, complete fish/fins across moving frames, copy/action separation and normal short-window scrolling. The four standard phones must retain their actual initial offer/action; near-square windows must be reviewed at 900×900, 900×800, 1000×900 and boundary sizes.

Continuous environment through later chapters/footer, real Menu/Close/Escape/focus, keyboard and no-JS navigation, contrast throughout playback, native autoplay/reduced-motion/Save-Data behavior, browser advancement and scroll stability, poster handoff and three observed loop joins per orientation remain untested. Physical iOS/Android and packaged Pages-base direct loading/refresh/history are also untested. No visual score, user acceptance or publication is claimed.

No browser/OS automation, server, external service/network/MCP, other model/agent, media generation/edit/repair, dependency/configuration/permission change, outside write including /tmp, Git, enquiry or publication was used. Only permitted own/input images were inspected. The routed instruction-modules directory is absent; core and explicit stage rules applied. No temporary debugging or extracted media artifacts were created.

## Reproduce current checks

```sh
python3 -B demo/build.py
node --check demo/home-motion.js
node --check demo/script.js
python3 -B evidence/stage-3/verify_stage3.py
node evidence/stage-3/controller-checks.cjs
python3 -B evidence/stage-3/geometry-checks.py
python3 -B evidence/stage-3/final-checks.py
```

Reports are confined to evidence/stage-3/. The root README owns the existing preview instructions for the coordinator; no preview command was executed here.
