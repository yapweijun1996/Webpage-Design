# Round 4 — Header and Phone Enquiry Revision

Both original native deliveries pass the exercised independent page, layout, navigation, keyboard and local enquiry checks. The user's B-then-A request is implemented: clearer shared headers, then compact phone introductions followed by the form/preview workspace before secondary help. All eight independent routes remain useful and working. User visual acceptance is still pending.

Open the [before/after viewer](preview.html?stage=after&page=contact&viewport=mobile&extent=first). Actual pages: [Codex](http://127.0.0.1:4201/) and [Claude](http://127.0.0.1:4202/). Preserve the [round-3 baseline](../round-3/RESULTS.md) and all earlier deliveries.

## Observable improvement

Measurements use the same headed Chrome, settled fonts, matching viewport and scroll position zero. Field position means distance from the page top, not the amount of scrolling required to first glimpse it. Display values are rounded; [raw measurements](RESULTS.json) retain exact values.

| Measure | Codex before → after | Claude before → after |
| --- | --- | --- |
| Desktop closed header, 1440px | 97 → 80px | 77 → 77px |
| Phone closed header, 390px | 85 → 68px | 65 → 65px |
| First Name input top, 390×844 | 1,288 → 620px | 1,344 → 414px |
| First Name input bottom, 390×844 | 1,340 → 671px | 1,397 → 466px |
| Phone DOM/keyboard order | Secondary help preceded form → form/preview precedes help | Secondary help preceded form → form/preview precedes help |
| Desktop global label size | 14 → 15px | 15 → 16px |

The full first labeled field is visible in the first phone viewport in both. This also works without placing focus/reading order at odds with the visual layout. Supporting help remains after the entire workspace; desktop retains useful side-by-side composition.

## Design judgment and reasons

**Claude remains my preference for the phone Contact task.** Its introduction and form heading are compact, so Name, Organisation and Email appear in the first screen. Codex also meets the first-field requirement but uses two large, repeated invitation headings and more pre-field explanation; only Name and Email fit there. Claude's optional business fields make the full form longer, so the earlier start does not imply a shorter completion task.

**Codex made the larger header improvement from its own baseline.** Removing the header slogan, using a single-line wordmark, larger destinations, a separator and an aligned CTA makes its previously tall band coherent. It retains a serif disclosure menu and a static header. Claude kept its already compact dimensions and improved the teal surface, 16px labels, 44px brand target, action separation, and distinct solid/segmented current-page/current-section indicators. Its menu changes before the full row becomes crowded and the header remains sticky. These are intentional differences; equal header height would not establish equal quality.

Both preserve fish/copy separation at the inspected intermediate sizes. Codex stacks copy then the full photo at 768–1119px; Claude uses a side-by-side crop in the middle range and stacks the image above copy at narrower widths. [Codex tablet](output/playwright/codex/home-tablet-first.png), [Claude tablet](output/playwright/claude/home-tablet-first.png), and each runner's `home-extra-*.png` show the trade-offs. The checked 1120/1200px transitions keep the headline clear of the fish face; header rows do not collide.

This revision retains much of the original teal/gold aquarium reference and existing inner-page content. It improves hierarchy and task access; it does not establish that either design impresses the user. No new overall numerical score is assigned to this focused revision. Historical non-blind round-3 scores remain unchanged and are not substituted for acceptance.

## Independent verification

Original deliveries were hashed after native processes finished and before evaluator checks: [Codex, 76 files](deliveries/codex.json); [Claude, 215 files](deliveries/claude.json). There was no evaluator implementation repair or asymmetric worker coaching.

| Check | Codex | Claude |
| --- | --- | --- |
| Eight routes × eight layout widths; first/full captures at three widths | 64 views pass; 48 standard captures | 64 views pass; 48 standard captures |
| Focused header targets/fit, phone first field, DOM/no-JS order and keyboard approach | 54 pass | 54 pass |
| Actual header/footer page links and current context | 96 pass | 99 pass |
| Collection/category/contact, prefill, breadcrumb/sibling/logo, history, new tab and 404 journeys | 22 pass | 22 pass |
| Skip/menu/Escape/no-JS, validation, local preview/edit/clear, reduced motion and no outbound submission | 21 pass | 21 pass |
| Actual keyboard focus and invalid-summary links | 83 pass | 84 pass |
| Hover stability, current section and changed menu/hero transition boundaries | 13 pass | 13 pass |
| Served local URLs match delivered bytes; real 404; no external runtime URLs | 32 URLs pass | 44 URLs pass |
| Disposable fresh build, no dependency installation | All 31 output files exact | All 42 output files exact |

Layout widths: 1440×900, 390×844, 768×1024, plus 320/360/430/1024/1920px. Supplemental first-view checks cover 860/861, 1099/1100, 1119/1120 and 1199/1200px, plus 1024 and 320px. Closed-header target/label checks run on every page at the six requested widths. Menu, form error/preview and extra header/hero captures complement the standard 48 per builder.

Both have zero captured page errors, document overflow, broken rendered images or failed HTTP responses. Claude recorded one `net::ERR_ABORTED` request for a responsive fish-image variant during the layout sequence. All corresponding rendered images loaded and the delivered asset was independently served with matching bytes; this is retained in the raw report rather than described as zero failed requests.

Evidence: [Codex browser reports](output/playwright/codex/), [Claude browser reports](output/playwright/claude/), [fresh builds](output/fresh-build-checks.json), [source-image provenance](output/asset-provenance-checks.json), [preservation](output/preservation-checks.json), [preview health](output/preview-health-checks.json). No original or round-2/3 input/delivery bytes changed. All nine preview servers were reachable when checked.

## Execution and comparison limits

Both received the same 60 frozen files and one revision prompt. Each started from its own copied code/README and five own baseline PNGs, separately hashed in [starting-conditions.json](starting-conditions.json); these are intentionally different starting artifacts. Neither received competitor images or evaluator ratings. Current feedback explicitly superseded historical fresh-start wording.

| Runtime fact | Codex | Claude |
| --- | --- | --- |
| Requested and exposed model | `gpt-6.1-sol` | `claude-opus-5-5` |
| Launch/session CLI | 0.162.1 | 2.1.289 |
| Exposed effort | xhigh | Unknown |
| Native process result | Exit 0; 18m 42s | Exit 0; 20m 23s |
| Worker browser access | Loopback/file URLs denied; real browser checks not_run | Headless Chrome; 56 self-checks, 122 real PNGs including before/after/check views |
| Extra model/agent/advisor calls observed | None | None |

Codex independently recorded 894 source/output/request-handler checks and 27 event-logic checks using doubles; these are not rendering evidence. Its immutable README still correctly describes its worker-only browser gap. The evaluator supplied the later real-browser verification here. Claude used screenshots to repair intermediate crops and sticky-header feedback positioning during its authorized self-review. Native runtime capability is part of this comparison and is not normalized.

[Runtime/model metadata](output/environment.json) and [native usage](output/native-run-summary.json) retain the exposed facts. Claude reports a $3.8814 list-price estimate, not a verified invoice. Codex exposes usage without comparable USD cost. Token-accounting schemas differ; no cost-efficiency or isolated-model conclusion is made.

Only headed desktop Chrome with emulated viewport widths was independently used; no real mobile device, Safari/Firefox, screen-reader session, comprehensive contrast/zoom audit or performance benchmark was run. No production contact service, deployment or verified real-company profile is asserted.

## Evaluator method corrections

Two evaluator-only issues were corrected and recorded without editing worker code:

1. Initial baseline header measurements counted hidden closed-details descendants because Chrome still supplied nonzero rectangles. `checkVisibility()` now excludes them while retaining target/font/collision expectations. [Original reports and correction](output/baseline-method-correction.json).
2. A supplemental first-screen capture waited for offscreen lazy images that had not loaded. It now decodes only viewport-intersecting images; full-page capture continues to scroll/load all images before resetting to top. Only the owned evaluator session was restarted, then the same 13 scenarios passed for both. [Rejected script/captures and correction](output/header-method-correction.json).

The earlier round-3 method corrections remain preserved in that round. Current functional passes describe the exercised scenarios and remain separate from user design approval.
