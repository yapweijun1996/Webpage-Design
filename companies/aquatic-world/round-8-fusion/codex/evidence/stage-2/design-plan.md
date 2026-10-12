# Stage 2 — Home header text-resizing refinement

## Authority and scope

Read TASK.md and the local frozen input/design/BRIEF.md (input/BRIEF.md does not exist), REVIEW.md, CONCEPT-NOTES.md and supplied cli-web-design-director skill/review guidance. Inspected all three supplied PNG concepts and both clean posters. The requested native process owns this workspace only; no additional model, agent, CLI run, browser automation, network, dependency, Git operation or media processing is used. Missing local instruction-modules/investigation.md and verification.md are handled with the supplied core rules and local source evidence.

Only demo/, root README.md and evidence/stage-2/ may change. Original evidence, frozen input, baseline and other root contracts remain intact. Stage 2 process-run.json belongs to the launching process and will not be overwritten.

## Finding and intended change

Coordinator feedback describes a temporary 200% computed font-size and numeric line-height stress test at an unchanged 390x844 viewport, not native browser zoom or a device test. Own source uses a compact two-column grid and overflow-wrap:anywhere on the wordmark, allowing arbitrary splits when the enlarged summary consumes the other column.

Replace only Home compact header layout with a wrapping flex row. Keep existing width/insets, minimum bar height, typography, outlined summary sizing and column gaps. Give the brand normal word-boundary wrapping and keep the Menu/Close item at the right edge with auto inline-start margin. When enlarged content cannot share one row, the brand and control may occupy separate rows; an 8px row gap separates them. No enlarged-text detection, font shrinking, clipping, runtime test injection or product preference.

The nav remains absolutely anchored to the positioned header-inner bottom, so reflow is identical when closed/open and does not move the hero or page scroll. Existing ResizeObserver/resize/open measurement updates --home-menu-top for the remaining-height scroller. Keep opaque panel, native details fallback, ordinary tab order, Escape/focus return, focus-exit/outside dismissal and Pause/policy state untouched.

## Acceptance and bounded verification

- Normal 1440x900 composition stays unchanged; normal 390x844 keeps the header row and approximately 369px panel edge. This is an intended layout outcome pending rendered retest.
- At 200% text size and widths 390/320, retain the complete AQUATIC WORLD at word boundaries, visible Menu/Close label/target, equal closed/open anchors and a panel below the grown header. All five links must remain reachable with keyboard and scrolling.
- Build with existing python3 -B demo/build.py; check unchanged JS syntax.
- Focused source/output checks: changed CSS declarations, five Home destinations, grown-header anchoring and scroll cap, no modal semantics, source/built stylesheet identity, protected files, all media hashes, eight content routes plus 404 and unchanged inner-page outputs/styles/controllers.
- Focused Node controller scenarios using actual built scripts and bounded DOM/event/media doubles: header resize/observer/open measurement; nonmodal focus/dismissal; menu suspension/resumption and retained manual/policy stops. No unrelated Contact test rerun because its files/dependencies are unchanged.
- Record actual checks and remaining rendered acceptance in self-review.md; coordinator owns real browser review, including normal geometry and enlarged/short-window scrolling. No DOM double or source arithmetic is reported as rendered evidence.
