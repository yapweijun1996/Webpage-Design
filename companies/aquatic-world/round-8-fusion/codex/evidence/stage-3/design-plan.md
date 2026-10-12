# Stage 3 — Bounded Home text-resizing correction

## Contract and evidence

Read TASK.md and the frozen input/design/BRIEF.md; input/BRIEF.md is absent. Also read the review, concept notes and supplied cli-web-design-director skill/review guidance; inspected the three attached concepts and both clean posters. Local investigation/verification instruction modules are absent. Follow the supplied core and current restricted task. Inspect only own implementation, not sibling sources or coordinator evaluators. The existing process-run.json records the requested gpt-6.1-sol native CLI with high effort; do not launch another model or process, or alter that launcher-owned record.

Write only demo/, root README.md and evidence/stage-3/. Snapshot all other files before implementation; preserve frozen inputs, own baseline, root contracts, original evidence and stage-2 evidence. Use existing Python standard-library build and bounded source/hash checks only. No browser/server, OS automation, network/MCP, dependency, Git, media edits or generation, outside writes or additional agents/models.

## Findings and smallest complete change

The coordinator temporarily doubles each element's pre-captured computed font-size and numeric line-height once at unchanged 390x844/320x844 viewports. Reload restores it. This is injected text resizing, not native zoom or physical-device evidence. Own collection grid reserves fixed 24px desktop / 20px phone arrow tracks even when arrow glyphs grow to 52px; bounding boxes can miss ink overflow. Own narrow perspective heading also has an overlong word. The shared feedback on another implementation is not evidence about this implementation.

1. Replace collection number/arrow fixed tracks with content-sized minmax tracks retaining their existing minimums and the flexible middle track. Enlarged numbers and arrows reserve their intrinsic width; the middle labels/descriptions wrap. Normal typography, gaps, alignment and row minimums stay untouched. Intrinsic track sizing may use a few more pixels even at normal size; ordinary composition must be reviewed by the coordinator.
2. Add overflow-wrap:anywhere only to the lower Home reading zone, allowing an otherwise overlong heading/collection word to break within its available width. Prefer ordinary word boundaries until a whole word cannot fit. No new font size, line-height, truncation or clipping.
3. Constrain Home action links and footer flex children to their container width and allow natural label wrapping. Keep action arrows content-sized. Preserve footer brand word-boundary wrapping explicitly; do not apply arbitrary-word wrapping to any wordmark. Footer navigation may wrap labels and reflow existing flex rows. No copy or DOM changes.

Do not touch the stage-2 header/menu blocks, hero sizing/anchors, controllers, media, routes, shared styles or inner-page presentation. Keep the measured-header short scroll panel, nonmodal focus/dismissal, pause/policy behavior and local-only Contact unchanged. No overflow-x hiding, QA hooks or enlarged-text detection.

## Verification and remaining acceptance

Rebuild with python3 -B demo/build.py. Retain bounded check code/output under this stage: exact patch review, source/built CSS identity, intended responsive tracks/wrapping constraints, byte-identical stage-2 header/hero/media/controller rules, all HTML/shared assets/inner pages/controllers/build sources unchanged, eight content routes plus 404 and all four exact film/poster bytes. Do not rerun unrelated historical suites or mutate their result files. Preserve the original and stage-2 evidence as historical.

Source assertions establish code/contracts and integrity only. No source arithmetic or element-box stub can prove text-ink containment, wrapping, focus or scrolling. Coordinator must repeat 390/320 at 200% text resizing with closed/open/scrolled full Home; inspect text-node Range rects as well as element boxes, secondary actions, collection labels/arrows, perspective heading and footer brand/navigation. Retest all 13 ordinary viewport compositions and preserve stage-2 menu reachability, equal open/closed anchors, focus exit and film/policy restoration before publication. Record these as pending browser acceptance, not passed checks.
