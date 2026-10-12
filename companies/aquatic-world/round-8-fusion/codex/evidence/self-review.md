# Fusion Home self-review

Date: 2026-10-12. Implementation and bounded verification completed in this workspace. Rendered acceptance and publication remain pending with the coordinator. No browser result or visual score is claimed.

## Delivered changes

Only `demo/home-motion.css`, `demo/home-motion.js` and two Home-only guard lines plus a comment in `demo/script.js` differ from the own baseline source. Existing build output is refreshed in `demo/public/`. `build.py`, `styles.css`, all content, routes, assets and Contact implementation are unchanged.

Home uses a 32px Georgia desktop wordmark, regular 16px Arial links and a 72px arrival heading. At 390px it uses an 18px wordmark, an outlined Menu with a 98x44px normal-size target, a 39.78px heading, 16px description and one natural-width 52px gold arrival CTA with a 17px label. At 320px side insets are 16px and the brand is 16px. The secondary scroll hint is omitted below 821px phone height. Existing chapter rhythm, copy, focus treatments and media environment remain.

The menu is a native nonmodal `details` disclosure. Its summary remains in the same grid cell when open/closed. Navigation is absolutely anchored to the bottom of the fixed header's inner bar, with five minimum 56px Arial rows, an active Home marker and an opaque abyss-teal surface. No full-screen details positioning, modal role, inert page, focus trap or background scroll lock remains. Header branding can wrap when enlarged; summary width scales with its own font size. The controller measures the bar's bottom only to bound the link scroller, updating on resize, ResizeObserver and menu synchronization. It does not change arrival geometry or playback during those geometry updates.

Home now owns Escape/focus return, outside/link dismissal, focus leaving the header and compact-to-desktop focus return. Normal Tab/Shift+Tab and destination activation are not intercepted. Opening temporarily suspends motion and hides its button; closing respects manual Pause, retained policy stops, opt-in, hidden tabs and failed media.

## What actually ran

Tools: existing Python 3.14.3 and Node v23.10.0; no dependency installation. The image reader displayed all three supplied concept PNGs and both clean posters. No sibling code, agent, other model/advisor, MCP/API, network, browser, server, OS automation, Git operation, media generation/repair or outside write was used.

| Check | Actual result / retained evidence |
| --- | --- |
| `python3 -B demo/build.py` | Exit 0; eight independent pages plus 404; `build.log` |
| `node --check demo/home-motion.js` | Exit 0 |
| `node --check demo/script.js` | Exit 0 |
| `python3 -B evidence/check-contracts.py` | Exit 0; 42 assertions; `contract-checks.log`, `contract-results.json` |
| `node evidence/check-controllers.cjs` | Exit 0; 21 scenario groups; `controller-checks.log`, `controller-results.json` |
| Own-baseline source diff review | Three intended source files only; no inner-theme or content changes |

The source/output checks establish:

- Protected input, baseline and root contract paths and SHA-256 fingerprints remain unchanged; no protected files were added or removed.
- All nine generated HTML files equal the own baseline render functions byte-for-byte. Inner pages have no Home stylesheet/controller/video. Generated shared resources match current source.
- All four runtime films/posters match the supplied media manifest hashes and are byte-identical across input, baseline, demo and output.
- All 342 page, asset, srcset and deferred-media references resolve locally. They also resolve in a simulated coordinator HTML-attribute rebase under `/Webpage-Design/companies/aquatic-world/round-8-fusion/codex/demo/public`. This is a packaging contract check, not a deployed project-base test; the raw output uses root-relative URLs and needs coordinator rebasing before nested publication.
- HTML, CSS and controller preserve landscape at aspect ratio 6/5 at every width, portrait otherwise, exact cover positions, near-square 70svh spacing, native no-JS details navigation and initial deferred video sources.
- Shared inner navigation and the complete Contact implementation remain verbatim after removing the Home guard.

The Node harness executes the actual built scripts with bounded DOM/event/media doubles. It exercises menu suspension and utility restoration, manual Pause/session retention, reduced-motion/data-saving/retained-policy defaults with no source attachment, explicit opt-in, newly enabled restrictions, hidden tabs/pagehide/pageshow, Escape and ordinary Tab/Shift+Tab, focus exit, outside/destination activation, breakpoint focus return, enlarged-header resize/observer scroll-budget updates, late play completion/playing events, autoplay rejection/retry, unsupported/decode/buffering/poster fallbacks, exact rebased orientation sources, paused orientation changes, disabled storage and scroll without film reload. Contact scenarios cover all three category queries, unknown-query rejection, required fields, supplied email validity, project length boundaries, four-group text-only local preview, Edit, post-edit validation and Clear/reset context.

One early verifier run failed due to its baseline relative-path calculation. That verifier path was corrected and all final checks passed; no product assertion was relaxed. A final phone spacing adjustment and the enlarged-header scroller correction were rebuilt and rechecked.

## Source-based dimensional budgets — not rendered measurements

These are conservative arithmetic from stylesheet values at normal text size, assuming zero safe-area insets. Text wrapping and font metrics still need browser confirmation. The 320px budget deliberately allows three heading and description lines.

| Viewport | Content width | Heading top estimate | Heading/body line budget | CTA top–bottom estimate |
| --- | --- | --- | --- | --- |
| 390x844 | 350px | 506.2px | 2 / 2 | 685.2–737.2px |
| 360x800 | 320px | 481.6px | 2 / 2 | 658.9–710.9px |
| 320x800 | 288px | 457.6px | 3 / 3 | 701.0–753.0px |

At 390x844 the normal menu budget is 64px header + 1px top rule + five 56px rows + 24px bottom padding = 369px, above the unchanged estimated heading at 506.2px. Opening changes neither arrival source layout nor page scroll in the controller scenarios. These estimates do not prove CTA visibility, actual row heights, complete fish/fins, no overflow, identical rendered anchors or 200% text behavior.

## Unrun acceptance

No real browser, screenshot, computed-layout measurement, real video recording or physical/assistive-technology test ran. Native details keyboard/default behavior, real focus traversal/scroll, touch hit targets, short-window scroller accessibility, 200% text enlargement, no-JS rendering, poster/moving-frame contrast, fish crop safety, inline autoplay/decoding and multi-loop joins remain unverified. DOM doubles cannot establish those properties.

Coordinator review is still required at 1440x900, 1280x800, 1120x800, 1119x800, 1024x768, 768x1024, 390x844, 360x800, 320x800, 844x390, 667x375, 900x900 and 500x500, including closed/open/scrolled menus, 200% text, later chapters/footer and playback/policy states. Real direct loading, refresh, Back/Forward, route-to-category-to-Contact journey, built-in email validity, missing-media behavior and the final rebased publication must also be exercised. Creative/human acceptance remains open. No enquiry was sent and no preview server or publication was launched.
