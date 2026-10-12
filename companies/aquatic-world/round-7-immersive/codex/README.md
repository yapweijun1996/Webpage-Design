# Aquatic World — Immersive Home

Status: focused Stage 5 Home footer cascade check complete; no implementation fix needed. Home uses `.home-footer`, so the opaque shared `.site-footer` rule does not match. Its background color is transparent with the existing translucent gradient wash. Build and focused source/output checks passed; all 127 existing demo/prior-evidence file hashes remained unchanged. Coordinator computed-style and rendered review at 390×844 and 1440×900, human acceptance and publication remain pending; no browser pass is claimed.

Stage 5 verification: `python3 -B evidence/stage-5/check.py` runs the existing build and checks the footer cascade, wash, source/output parity, links/disclosure and file integrity. Evidence: [plan](evidence/stage-5/design-plan.md), [focused check](evidence/stage-5/check.py), [results](evidence/stage-5/results.json), and [self-review](evidence/stage-5/self-review.md). No CSS, markup, behavior, media or inner-page footer changed.

Stage 4 motion-icon fix remains intact. SVG icon visibility updates real hidden attributes instead of JavaScript expandos.

Stage 4 verification: `python3 -B demo/build.py` and `node evidence/stage-4/attribute-check.cjs`. The focused check verifies eligible motion → Pause icon, manual Pause → Play icon/Resume action, and explicit Resume → Pause icon, using real attribute presence in both controller copies. It deliberately makes SVG `.hidden` expandos disagree with attributes. This proves render-state mapping, not real browser playback or rendered visibility. Only two controller statements and the generated controller copy changed; Stage 1–3 suites were not rerun.

Stage 4 evidence: [plan](evidence/stage-4/design-plan.md), [attribute check](evidence/stage-4/attribute-check.cjs), [results](evidence/stage-4/attribute-results.json), and [self-review](evidence/stage-4/self-review.md).

Home uses one continuous water environment from the transparent top bar through three scrolling chapters and the footer. Exact shared copy, Georgia display type, Arial body, real page links and the gold collection action are implemented. The background controller includes deferred orientation selection, session Pause/Resume, reduced-motion and Save-Data defaults, explicit opt-in, menu/tab suspension and poster/error fallback.

Seven inner pages and 404 retain byte-identical Stage 2 and baseline HTML. The only builder/controller edits are their landscape selection query; Home theme and generated Home output reflect the correction. Shared styles, Contact validation/local preview/Edit/Clear code, category context and the honest no-send behavior are unchanged. All copy and imagery remain fictional demonstration content.

## Build and verification

Run from this directory with existing tools; no installation is needed:

```sh
python3 -B demo/build.py
node --check demo/home-motion.js
node --check demo/script.js
python3 -B evidence/stage-3/verify_stage3.py
node evidence/stage-3/controller-checks.cjs
python3 -B evidence/stage-3/geometry-checks.py
python3 -B evidence/stage-3/final-checks.py
```

Executed Stage 3 results: build generated eight pages plus 404; JS/Python syntax checks passed; 89 source/build assertions passed, with 351 local link/asset/fragment references checked; 14 bounded controller scenarios passed using DOM/event/video stubs; 37 viewport source geometry cases passed. All four supplied assets match the frozen manifest in both source and output, and all 88 protected file hashes match. Stage 2's historical full-film decode checks remain available; decoding was not repeated because media bytes are unchanged. These checks do not prove rendered layout, native browser policies, actual browser advancement or visually seamless joins.

The commands above record Stage 3 verification. For the narrowly bounded Stage 4 repair, use the two Stage 4 commands near the top of this README. Stage 1/2 scripts and reports retain their historical media/query expectations and remain unchanged; running them now would overwrite historical evidence.

Output entry point: [demo/public/index.html](demo/public/index.html). Independent routes:

- `/`
- `/collections/`
- `/collections/ornamental-fish/`
- `/collections/aquatic-plants/`
- `/collections/driftwood/`
- `/our-story/`
- `/quality/`
- `/contact/` and `/contact/#enquiry`
- `/404.html`

## Coordinator preview

The existing loopback preview server supports this command, from the workspace root:

```sh
python3 -B demo/serve.py --port 8767
```

Then open `http://127.0.0.1:8767/`; direct category and Contact URLs work through their generated directories. Choose another available port if needed. This command is documented for the coordinator and was **not executed** by this worker. No server was started or stopped. Opening HTML directly with `file://` does not resolve root-relative runtime URLs.

All runtime paths, including deferred video sources/posters, are literal HTML URL attributes for the coordinator's Pages rebasing. JS reads those values; it contains no hard-coded asset root URLs. Actual packaged GitHub Pages-base behavior, refresh and Back/Forward still need coordinator verification.

## Media and readiness

[Runtime media provenance](demo/assets/immersive/README.md) records all four byte-identical supplied Stage 2 assets and their hashes. The runtime paths are:

- `/assets/immersive/landscape-poster.webp` — present.
- `/assets/immersive/portrait-poster.webp` — present.
- `/assets/immersive/landscape.mp4` — present, 1280×720.
- `/assets/immersive/portrait.mp4` — present, 720×1280.

Current landscape selection uses `(min-aspect-ratio: 6/5)` at every width; portrait is selected otherwise. HTML picture, controller and Home CSS agree. Both poster and video use cover without transforms, landscape at `50% 50%` and portrait at `50% 30%`. The exact unguarded near-square portrait range `(4/5 <= aspect-ratio < 6/5)` puts arrival copy at 70svh after narrow-screen overrides. Sections grow and scroll normally.

844×390 and 667×375 now select landscape in source/model checks, keep compact navigation and limit the left copy/reading zones to 46vw. Arrival starts at `clamp(112px,24svh,190px)` with a 32–50px heading, 18px supporting text and 16px CTA. Short windows can scroll without a fixed content height or clipping. Standard 430×932 / 390×844 / 360×800 retain their 56svh portrait spacing and all existing source declarations; 320×800 retains 53svh. Actual fish/fin clearance and CTA wrapping are awaiting coordinator browser checks.

The coordinator supplied Runway Gen-4.5 films with matching first-frame posters. Central processing traverses source frames 1–36 forward and back using an explicit cosine-eased sequence over 144 frames. These are disclosed six-second return loops, not untouched natural provider loops. Recorded new provider cost: US$1.44; no further generation. Technical candidate selection is not human creative approval. Decoded first/last frame hashes differ; no visible seam verdict is inferred from lossy encoded-frame hash comparisons.

No reference screenshot is a runtime image, and no worker film repair or substitute particles were used. All selected MP4 paths now resolve to supplied files. Restrictive preferences and retained manual stop still attach no MP4 by default; explicit opt-in and fallback behavior remain intact.

Rendered checks were unavailable and prohibited in this restricted worker run. The corrected 844×390 / 667×375 layouts, initial phone CTA fit, all moving-frame viewport subject margins, contrast, no-JS navigation, native autoplay policies, real menu/keyboard behavior, physical devices, browser film advancement, clip-opening poster handoff and three visually observed loop joins per orientation are **not tested**. The Stage 3 correction is implemented and source-checked; its actual visual outcome remains for the coordinator's same-browser review. The coordinator owns previews and publication.

## Design and evidence

- [Stage 3 design/state plan written before changes](evidence/stage-3/design-plan.md).
- [Stage 3 self-review, exact modifications and unrun browser checks](evidence/stage-3/self-review.md).
- [Current source/output results](evidence/stage-3/source-checks.json) and [verifier](evidence/stage-3/verify_stage3.py).
- [Current controller logic results](evidence/stage-3/controller-checks.json) and [scenarios](evidence/stage-3/controller-checks.cjs).
- [Current crop/composition source geometry](evidence/stage-3/geometry-checks.json) and [check](evidence/stage-3/geometry-checks.py).
- [Final file/document integrity results](evidence/stage-3/final-checks.json) and [check](evidence/stage-3/final-checks.py).
- [Stage 3 common correction brief](input-stage3/BRIEF.md).

Historical Stage 2 evidence (unchanged):

- [Stage 2 design/state plan written before changes](evidence/stage-2/design-plan.md).
- [Stage 2 self-review and acceptance limits](evidence/stage-2/self-review.md).
- [Stage 2 source/build results](evidence/stage-2/source-checks.json) and [verifier](evidence/stage-2/verify_stage2.py).
- [Stage 2 controller logic results](evidence/stage-2/controller-checks.json) and [scenarios](evidence/stage-2/controller-checks.cjs).
- [Stage 2 crop geometry](evidence/stage-2/geometry-checks.json) and [source geometry check](evidence/stage-2/geometry-checks.py).
- [Stage 2 offline media results](evidence/stage-2/media-checks.json) and [read-only media check](evidence/stage-2/media-checks.py).
- [Stage 2 brief](input-stage2/BRIEF.md) and [frozen media manifest](input-stage2/media/manifest.json).
- Historical Stage 1: [plan](evidence/design-plan.md), [self-review](evidence/self-review.md), [source results](evidence/source-checks.json) and [controller results](evidence/controller-checks.json), all unchanged.
- [Frozen design skill](input/skills/cli-web-design-director/SKILL.md), [stage contract](input/immersive-home/STAGE.md) and [comparison gates](input/immersive-home/COMPARISON.md).

Stage 3 changes exactly eight demo files: demo/build.py, demo/home-motion.js, demo/home-motion.css and demo/assets/immersive/README.md, plus demo/public/index.html and the three corresponding generated controller/theme/provenance copies. No demo files were added or removed. Documentation/evidence changes are confined to evidence/stage-3/ and this README. All four media bytes, input/, input-stage2/, input-stage3/, baseline/, Stage 1/2 evidence and other root contracts remain unchanged. No dependencies, configuration, permissions, other agents/models, MCP/API/service/network, browser or OS automation, server startup, outside writes, Git, enquiry or publication were used.
