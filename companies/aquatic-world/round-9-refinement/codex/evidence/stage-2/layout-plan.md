# Stage 2 — Motion action label reflow

Date: 2026-10-13. Scope: the visible Home motion-utility label only.

## Evidence and cause

Inspected this candidate's `demo/home-motion.css`, controller and generated markup, the shared native references, both supplied posters and `reference.jpg`. The coordinator measured the visible Resume background tooltip at x=-17.92..242, with text x=-7.92..232, after manual Pause and keyboard focus at 320×375. Its opacity was 1. The source uses an unbounded `white-space:nowrap` label 60px left of the fixed 48px button. The defect is actual visible text clipping.

## Planned correction

- Keep the button, icons, accessible names, full Play/Pause/Resume background strings and hover/focus visibility rules unchanged.
- Limit the label's border-box width to the viewport minus the existing utility offset, 60px label/button separation and a conservative left gutter. Account for the right safe-area inset. Allow ordinary word wrapping and emergency long-word wrapping, without changing font size or concealing text.
- Preserve the normal single-line centered position. Anchor taller wrapped labels to the bottom of the button so enlarged line height cannot push the label below a short viewport. Let label height grow naturally.
- Change only `.home-motion-explanation` in the Home stylesheet; rebuild its public copy. Preserve successful v2 header/menu rules, all other layout rules, HTML, controller, inner routes, Contact behavior and exact media bytes.

## Checks and acceptance boundary

Capture pre-change workspace hashes. Build with `python3 -B demo/build.py`; run JavaScript syntax checks and the existing static preservation/controller checks with their result writes redirected into stage-2 evidence so original evidence remains unchanged. Add bounded source/geometry checks for full action strings, existing 48px target/focus styles, bounded width, natural wrapping, normal centering and wrapped bottom anchoring. Compare before/after hashes and the actual stylesheet diff.

Source and arithmetic checks do not prove rendered fit. Coordinator must test all three labels on keyboard focus and hover, particularly manual Pause → Resume at fixed 320×375. Pre-capture each HTML element's computed font size and numeric line height and double each exactly once; do not use native zoom, cumulative multiplication or a changed viewport. Measure visible label/text rectangles and inspect the screenshot, bottom containment, focus ring and document overflow. Also check the normal portrait/desktop labels and unchanged v2 states.

## Constraints and gaps

No browser, server, network, MCP, extra agent/model, Git, new dependency or outside write will be used. The routed `instruction-modules/` files are absent from this workspace; the supplied core and local evidence govern this bounded correction. Real browser verification and publication remain coordinator-owned.
