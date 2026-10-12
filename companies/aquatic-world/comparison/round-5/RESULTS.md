# Round 5 — Contact Simplification

Both original native deliveries pass the exercised independent Contact, navigation, keyboard and local-preview checks. Both used the same focused requirements: one visible task heading, one concise editable-state disclosure and exactly four primary groups. Organisation, visitor role and Timing are removed where previously present, including their preview rows. All eight real pages and the existing header remain preserved. User visual acceptance is pending.

Open the [phone before/after viewer](preview.html?stage=after&page=contact&viewport=mobile&extent=first). Actual revised Contact pages: [Codex](http://127.0.0.1:4211/contact/) and [Claude](http://127.0.0.1:4212/contact/). The previous round remains available on 4201/4202 and its [unchanged report](../round-4/RESULTS.md).

## Measured result

The same headed Chrome 154 captured both previous and delivered versions after fonts/images settled, at scroll zero. Coordinates are distance from the page top, not the exact scroll required to glimpse a control. Full-page height includes help and footer; Preview-button position is a more focused measure of the editing path. Raw values are retained in [RESULTS.json](RESULTS.json).

| Measure | Codex before → after | Claude before → after |
| --- | --- | --- |
| First Name input top, 390×844 | 620 → 308px | 414 → 303px |
| First Name input top, 360×800 | 620 → 308px | 437 → 302px |
| Primary field groups | 4 → 4 | 7 → 4 |
| Preview button top, 390px | 1260 → 896px | 1575 → 1131px |
| Full page height, 390px | 2696 → 2006px | 3265 → 2498px |

Name and Email are fully visible at both required phone sizes, and the first input starts at or above 320px without shrinking the main labels/control text below 16px. At 390×844 Codex shows all four editable groups, including the complete Project textarea, in the first screen. Claude shows Name, Email and four explicit collection choices; Project follows below. At 320px Codex Name remains about 308px; Claude wraps the title/lead and Name begins about 381px. Both Name/Email still fit at 320×800; the ≤320px first-field target was specified only for 360/390.

## Visual judgment and remaining trade-offs

For this focused phone Contact task I now prefer Codex. Its single-select Collection defaults to Not sure yet, the single heading names the actual task, and supplementary guidance is a closed native disclosure after the workspace. This provides a shorter route to describing the project and previewing it. The first-field positions differ by only about 5px at 390px, so that difference alone is not a useful winner criterion.

Claude made a substantial reduction from seven to four groups and consolidates its earlier repeated notices. Its explicit multi-category checkbox choices remain useful for a project spanning fish, plants and driftwood, but occupy more vertical space. The full page also keeps a visible help checklist. That is a functionality/density trade-off, not a failed simplification requirement. Its desktop keeps the photographic introduction and a help column; Codex uses a centred form workspace.

Both retain the original teal/cream/serif brand direction. This scope improves task density, readable hierarchy and local-feedback clarity; it does not establish that either impresses the user or that one model is generally better. No new numerical overall score is assigned.

## Independent verification

Original code/README/evidence were frozen before evaluator checks: [Codex, 76 files](deliveries/codex.json), [Claude, 141 files](deliveries/claude.json). No evaluator implementation edit or asymmetric coaching was performed.

| Check | Codex | Claude |
| --- | --- | --- |
| Focused grouping, heading/disclosure, readable targets, DOM order, first screen, context, safe preview and no-JS | 40 pass | 40 pass |
| All eight pages at desktop/phone, current direct/reloadable routes | 16 layout views pass | 16 layout views pass |
| Actual global links from Home, Quality and Contact | 96 pass | 99 pass |
| Collection/context, breadcrumb/sibling/logo, history/new-tab and 404 journeys | 22 pass | 22 pass |
| Skip/menu/Escape/no-JS, blank/invalid, preview/edit/clear, reduced motion and no outbound submission | 21 pass | 21 pass |
| Actual keyboard focus and invalid-summary links | 83 pass | 84 pass |
| Additional 320/360 error links, preview/edit/clear and real contextual Clear | 15 pass | 17 pass |
| Served page/assets match frozen delivered bytes; real 404; local runtime URLs | 32 URLs pass | 44 URLs pass |
| Disposable fresh build without dependency install | All 31 files exact | All 42 files exact |

Contact first/full captures and geometry cover 1440×900, 768×1024, 390×844, 360×800, 320×800 and 430×932. The unchanged seven other pages plus 404 HTML and the header JS prefix match each own starting delivery exactly. All nine source images and existing image derivatives retain their hashes. Wider site/header checks from round 4 remain historical evidence; this revision checks changed Contact at six sizes and other pages at desktop/phone rather than claiming every prior check was repeated.

The viewer passes 26 filter/shareable-URL/responsive cases. Browser reports record no page errors or failed HTTP responses. Layout screenshots contain no document overflow or broken rendered image. Root reports are in [Codex browser evidence](output/playwright/codex/) and [Claude browser evidence](output/playwright/claude/). [Fresh builds](output/fresh-build-checks.json), [HTTP](output/claude-http-checks.json), [asset provenance](output/asset-provenance-checks.json), [unchanged pages](output/unchanged-pages-checks.json), [all five rounds preservation](output/preservation-checks.json) and [owned preview handles](output/preview-servers.json) provide reproducible evidence.

## Native execution and limits

Both received 60 identical frozen files, one common revision instruction and their own four baseline captures/code/README, tracked separately in [starting-conditions.json](starting-conditions.json). Neither received competitor implementation/screenshots or evaluator ratings. Old Contact complexity is explicitly superseded by current REVIEW.md.

| Runtime fact | Codex | Claude |
| --- | --- | --- |
| Requested/exposed model | gpt-6.1-sol | claude-opus-5-5 |
| Launch/session CLI | 0.162.1 | 2.1.289 |
| Exposed effort | xhigh | Unknown |
| Original native process | Exit 0; 17m 41s | Exit 0; 16m 19s |
| Native browser self-review | Loopback/file access denied; browser checks not_run | Headless Chrome; 58 checks plus actual screenshots |
| Additional model/delegate/advisor calls observed | None | None |

Codex records 939 source/handler and 48 JS-with-doubles checks; they are not rendered-browser evidence. Its frozen README correctly retains that original gap. The later independent real-browser reports here establish the exercised behavior. Claude used its self-review to fix no-JS spacing, preview-state duplicate disclosure and cleanup of an owned server; the delivered scripts now stop owned children even if Chrome cleanup fails. Native capability/permission/effort differences are not normalized.

[Runtime/model evidence](output/environment.json) and [native usage](output/native-run-summary.json) preserve exposed schemas. List-price estimates are not verified billing and unlike token counters do not establish efficiency. No direct cost winner is asserted.

Only desktop Chrome with emulated sizes was independently used. No real phone, Safari/Firefox, screen-reader session, comprehensive contrast/zoom or performance audit was run. No production enquiry backend, deployment or real company profile is claimed. User design acceptance remains pending.

## Evaluator-only corrections

The [rejected scripts/reports and explanations](output/evaluator-method-correction/README.md) preserve two method issues: an allowed desktop aside heading was misclassified as a second task introduction, and rapid viewer switching was inspected before cached PNG decoding finished. The corrected checks distinguish secondary help and await current image decoding while retaining the same task/layout/loaded-asset expectations. Both final procedures pass. No contestant code was changed.

The published comparison is shown in the existing in-app browser tab; [saved UI proof](output/comparison-contact-mobile.png). Documentation links pass (10 documents, 101 local targets); all eleven current/historical preview ports were reachable. The owned temporary evaluator Chrome session and snapshot cache were cleaned up; deliverable preview servers remain available.
