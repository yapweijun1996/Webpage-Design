# Stage 2 — Self-review

Result: focused Home header refinement implemented and rebuilt. Eighteen source/integrity checks and seven controller scenario groups passed. Rendered acceptance is pending with the coordinator.

## Change and reason

Coordinator reported AQUA / TIC / WORL / D splits during a temporary text-resizing stress test: each HTML element's pre-captured computed font-size and numeric line-height doubled once, with viewport still 390x844. Reload restores the test-only changes. This is neither native zoom nor a physical-device result. Only own implementation was investigated; no sibling/coordinator source or evaluator was read.

The compact Home header now uses wrapping flex layout instead of two fixed grid columns. The wordmark uses normal word-boundary wrapping. The brand may take the available width; the nonshrinking Menu/Close item stays right-aligned and can use a second row when necessary. An 8px row gap separates wrapped rows. No new text-size preference, detection, shrinking, hiding, clipping or runtime QA style was introduced.

Normal fonts, minimum bar height, widths/insets, outlined summary and gaps between columns remain unchanged. At normal 390x844, one row is intended to retain the 64px bar and approximately 369px open panel edge. At 200%, whole AQUATIC / WORLD words are intended to occupy the available row width and Menu/Close may occupy the next row. These are layout intentions, not rendered measurements.

The existing nav is absolutely positioned at the header-inner bottom. It therefore follows a grown/wrapped header in both JavaScript and native details fallback. The unchanged controller measures that bottom on resize, ResizeObserver and menu toggle, and the unchanged scroller caps its height to the remaining 100svh budget. Open/closed control/header layout rules are identical; the open state adds opacity and removes only the lower header wash padding. Hero, page scroll, focus and playback controllers were not edited.

## Actual verification

| Check | Result | Scope |
| --- | --- | --- |
| python3 -B demo/build.py | PASS | Eight content pages plus 404 built; log: build.log |
| node --check demo/home-motion.js and demo/script.js | PASS | Both exit 0; no syntax diagnostics |
| python3 -B evidence/stage-2/check-source.py | PASS, 18 assertions | Source/output/hash inspection; source-checks.log and source-results.json |
| node evidence/stage-2/check-controllers.cjs | PASS, 7 scenario groups | Actual built scripts executed in bounded Node DOM/event/media doubles; controller-checks.log and controller-results.json |
| Final patch review | PASS | source-change.patch contains only compact Home header rules; reversing the patch reproduces the pre-edit stylesheet hash |

The integrity snapshot confirms original evidence, input/, baseline/ and captured root contracts remain byte-identical. Only demo/home-motion.css and demo/public/home-motion.css changed among captured implementation files. All HTML outputs, shared styles, controllers, build/content sources and assets remain identical. All four supplied runtime files match input bytes in both demo assets and built assets. No Home resource was added to an inner page. Unchanged output preserves routes, category context and four-group local-only Contact behavior; the unrelated full Contact suite was not rerun.

Controller coverage: measured header bottom updates for synthetic heights 64/166/196; resize/observer/open sync with no media reload or page movement; menu suspension and eligible resume; retained manual Pause; reduced-motion/data-saving defaults and explicit opt-in; all five link targets remain inside disclosure when programmatically focused; Tab/Shift+Tab are not intercepted; Escape returns focus; focus exit and outside/destination clicks dismiss; compact-to-desktop transition returns corresponding focus. The heights are supplied doubles, not actual 200% layout output. No native tab traversal, scrollability, details default action, decode/download or actual film playback is verified by these checks.

## Unrun coordinator acceptance

| State | Remaining rendered check |
| --- | --- |
| Normal 1440x900 | Preserve original desktop composition |
| Normal 390x844 | Preserve original header/hero composition and menu edge around 369px |
| 200% text resizing at 390x844 and 320px width | Complete readable brand with intentional word boundaries; visible Menu/Close label and usable target inside viewport; closed/open anchors match |
| Enlarged and short-height open menu | Opaque panel starts below actual grown header; scroller fits remaining visible height; every destination reachable by real keyboard and scrolling |
| Closing/dismissal | Actual focus and nonmodal behavior, no hero/scroll movement, correct utility and Pause/policy restoration |

No browser, UI automation, server, deployment, network service, dependency, Git operation, media editing/generation, outside write or additional model/agent was used. Original evidence remains historical and unchanged. Requested process model gpt-6.1-sol and high effort are recorded by the existing stage-2/process-run.json launch record; no replacement model was invoked. This worker cannot independently establish serving-backend identity from that launch record. Human/visual acceptance and publication remain pending.

## Preview

Build: python3 -B demo/build.py. Coordinator-authorized preview: python3 -B demo/serve.py --port 8765, then http://127.0.0.1:8765/ (demo/public/index.html). No server was started here. See root README.md for route and publication-path notes.
