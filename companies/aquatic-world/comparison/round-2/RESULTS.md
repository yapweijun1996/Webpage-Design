# Shared Feedback Revision — Results

Evaluated on 2026-10-11, Asia/Singapore. **Codex remains slightly closer to the reference's compact composition; Claude has substantially closed the gap.** Both revised artifacts passed the independent checks below. The score difference is only one point and is an evaluator judgment under the unchanged rubric.

Open the [two-round visual comparison](../preview.html?round=2), [Codex second version](http://127.0.0.1:4181/), or [Claude second version](http://127.0.0.1:4182/). Local preview commands are in the [company README](../../README.md).

## Conditions and preservation

Each builder started from its own preserved first implementation, with old execution evidence and dependency caches excluded. Both received the byte-identical [REVIEW.md](REVIEW.md), the original 50 frozen files, and one native revision prompt. Autonomous self-review and repairs before delivery were allowed. There were no additional evaluator correction prompts or competitor hints.

The 51-file shared manifest still matches both workspaces. Feedback SHA-256: `2bd19130d1c0571ef2e9a11f9a72aa7f5adf6f8f83cce1025c2adb9203698d11`. Distinct starting code is recorded in [starting-deliveries.json](starting-deliveries.json). Original first deliveries remain unchanged: 62 Codex files and 109 Claude files. Second deliveries are separately preserved: [84 Codex files](deliveries/codex.json) and [118 Claude files](deliveries/claude.json). Evaluation did not edit contestant code or evidence.

Requested and observed CLI settings remain GPT-6.1 Sol / Codex `0.160.0`, and Opus 5.5 / Claude Code `2.1.289`. Codex's native context reports default `xhigh`, workspace-write and never approvals. Terminal Chromium remained unavailable, but connected Chrome through `cua_repl` enabled builder browser QA this time. A raw-CDP permission denial is recorded with an unknown actor; the builder continued using normal documented browser APIs. Claude used auto permissions, an unknown named default effort, headless Chromium, and one built-in advisor review whose serving model is redacted. Its numeric effort field is self-reported, not a verified named setting. These are CLI artifact comparisons, not isolated model benchmarks or independent provider routing audits. Review was not blind. Codex's builder browser availability changed between rounds, so score changes cannot isolate the effect of feedback alone.

## Execution process issue

Claude's native trace contains several broad `pkill -f scripts/serve.mjs` cleanup commands. That selector matches other preview servers with the same script name, including the preserved first-version servers. Both first-version services were unavailable at the final hosting probe; the evaluator restarted their unchanged Node servers and verified their HTML bytes. The exact process-exit timeline and any broader system impact were not independently audited. Delivered source/input files remain unchanged.

This operational issue is recorded separately from the landing-page artifact scores. The final Claude test harness now retains its own spawned server handle and closes that child on failure, avoiding orphaned test servers. Future paired runs should stop only processes started by that runner and use their recorded child PIDs rather than a broad process-name selector.

## Scores

| Dimension | Weight | Codex / 5 | Codex points | Claude / 5 | Claude points |
| --- | ---: | ---: | ---: | ---: | ---: |
| Visual fidelity | 45 | 4.72* | 42.5 | 4.50 | 40.5 |
| Responsive layout / accessibility | 20 | 4.5 | 18.0 | 4.5 | 18.0 |
| Functional correctness | 15 | 5.0 | 15.0 | 5.0 | 15.0 |
| Configuration / content | 10 | 5.0 | 10.0 | 5.0 | 10.0 |
| Maintainability | 10 | 4.0 | 8.0 | 4.5 | 9.0 |
| **Second-round total** | **100** | | **93.5** | | **92.5** |
| First-round total | 100 | | 87.5 | | 82.0 |
| Improvement | | | **+6.0** | | **+10.5** |

*Visual totals use the exact subweight points; the displayed average is rounded. Composition: Codex 5.0, Claude 4.5 (weight 20). Typography/spacing: both 4.5 (10); colors/panel rhythm: both 4.5 (5); imagery/crop/overlays: both 4.5 (10). These ratings describe this reviewed scope; a 5 does not imply universal perfection.*

Both now have readable photographic captions, separated tablet copy/subjects, improved phone crops, working history synchronization, and preserved configuration/enquiry behavior. Claude retains the maintainability advantage of separate section components and tenant content files; Codex retains a compact single renderer. These architectural approaches remain broadly unchanged from round 1.

## What changed and why the remaining difference exists

| Desktop band at 1440px | Codex first → second | Claude first → second |
| --- | ---: | ---: |
| Hero | 666 → 562px | 760 → 606px |
| Heritage | 369 → 290px | 508 → 319px |
| Collections | 360 → 294px | 490 → 327px |
| Quality | 248 → 205px | 406 → 239px |
| Highlights | 219 → 209px | 385 → 235px |
| Enquiry | 260 → 232px | 455 → 286px |
| Footer | 113 → 83px | 135 → 73px |
| **Whole page** | **2,234 → ~1,874px** | **3,138 → ~2,086px** |

Claude's page was about 40.5% taller than Codex's in round 1; it is now about 11.3% taller. Codex more closely preserves the compact band proportions of the supplied desktop reference. Claude keeps longer visible explanatory copy and slightly larger secondary regions. Both preserve the teal/gold/cream rhythm and documented serif direction. Required fictional-copy changes and source-image differences were not scored as factual builder defects; the presentation of those disclosures remains a design choice.

- **Density:** [Codex styles](../../round-2/codex/demo/styles.css) reduce heading size and band padding, shorten configured copy, and keep thumbnail intrinsic ratios from stretching collection cards. [Claude styles](../../round-2/claude/demo/src/styles/site.css) and [tokens](../../round-2/claude/demo/src/styles/tokens.css) reduce the scale and spacing across all bands. Measured geometry supports the explanation; the preference for compact composition follows the fidelity objective.
- **Caption:** Codex scopes light-panel eyebrow colors to editorial/quality content rather than the whole heritage section. Photo-caption spans are now cream, with a stronger phone scrim. Claude scopes photo-caption color and strengthens scrims. Independent screenshots and computed styles confirm the original dark caption problem is resolved. Builder contrast measurements are finite modeled/pixel-sampling checks, not full WCAG certification.
- **Responsive imagery:** Codex stacks below 1024px and uses the complete panorama at tablet widths; Claude stacks below 1200px and keeps a larger photo band. At 768px, their complete pages are ~2,793px and ~3,498px respectively. Both remove text over the subject. Both phone headers now sit above the image, and the revised crops preserve the fish clearly. Claude uses a ResizeObserver to publish the real header height; separate no-JavaScript checks confirm readable fallbacks at 320px for both brands.
- **History:** Both separate hiding a detail from changing history and synchronize visible state from the URL. [Codex syncLocation](../../round-2/codex/demo/app.js) and [Claude fromHash](../../round-2/claude/demo/src/client/site.js) handle empty/unrelated hashes and avoid duplicate handling. Independent Back/Forward, category switching, initial deep links and enquiry-navigation checks passed.

Compare [Codex desktop](output/playwright/codex/desktop-full.png) and [Claude desktop](output/playwright/claude/desktop-full.png), or use the viewer for full-page/first-screen captures at desktop, tablet and phone sizes. The first-round scores and screenshots remain available without overwriting their evidence.

## Independent verification

The same separate headed Google Chrome **154.0.8037.99**, default zoom and DPR 1 were used for both. The original capture and journey procedures were retained, with only ports, output paths and session name changed. Shared supplemental checks exercise the feedback's Forward/enquiry/category regressions. A further no-script check was justified by the new header-height logic.

- [Codex layout](output/playwright/codex/layout-checks.json) and [Claude layout](output/playwright/claude/layout-checks.json): 1440, 768, 390, 320, 360, 430, 1024 and 1920 widths; no overflow, unresolved anchors, broken rendered images, HTTP errors or blocking page errors. Responsive image requests were sometimes canceled during viewport changes (3 Codex / 2 Claude); all rendered images subsequently loaded correctly.
- Main journeys: [Codex 21/21](output/playwright/codex/interaction-checks.json), [Claude 20/20](output/playwright/claude/interaction-checks.json). Counts differ because the form and fixture sets differ; scores are not pass-count ratios. Keyboard menu/Escape/focus, collections, enquiry honesty, reduced motion, second brand, 1/3/5 categories and clean optional-section hiding passed. The local form made no network writes.
- [Codex 7/7 extra regressions](output/playwright/codex/regression-checks.json) and [Claude 7/7](output/playwright/claude/regression-checks.json): Back to empty closes; Forward opens the correct panel; second category selection works; enquiry closes; Back from enquiry restores; Forward closes; mobile fifth-category exploration works. Additional 1024px screenshots exist.
- [No-script 320px checks](output/no-script-320.json): both default and second-brand routes remain readable, with visible navigation, no overflow and header/photo separation. Original no-script phone checks also passed.
- [Comparison viewer checks](output/gallery-checks.json): all 12 round/viewport/extent combinations, historical round deep link and phone layout passed (14/14), with correct scores, screenshots, reports and actual-page URLs.
- [Fresh builds](output/fresh-build-checks.json): disposable source copies rebuilt with no installed packages, reproducing 4 Codex HTML pages and 5 Claude HTML/CSS/JS files byte-for-byte. Temporary copies were removed. [Live Node previews](output/preview-checks.json) serve the exact delivered HTML and second-brand routes successfully.
- Native builder evidence reports Codex 37 static checks plus 31 connected-Chrome journeys and additional fixtures/contrast checks; Claude 60 headless Chromium checks. These are distinct check sets. The evaluator results above independently cover both delivered versions.

Not run: Safari/Firefox, real devices, screen readers, full accessibility audit, 200% zoom or field Core Web Vitals. No claim of pixel-perfect reproduction, universal browser support, full WCAG compliance or production readiness is made. The latest fictional local-demo scope satisfies the repository's recorded readiness criteria; first drafts remain historical artifacts with their original issues.

## Execution evidence

| Measure | Codex | Claude |
| --- | --- | --- |
| Process elapsed | 1,770.58s / 29m 31s | 2,375.63s / 39m 36s |
| Native input / cached usage | 8,999,563 / 8,783,872 | Final `usage`: 144 input; 203,974 cache creation; 9,861,841 cache read |
| Native output usage | 64,363; reasoning output 33,292 | Final `usage`: 61,752; thinking 17,825; `modelUsage` separately reports 69,485 output |
| Exposed cost | Unknown | ~$5.63 native list-price basis; actual billing unknown |
| Additional evaluator correction prompts | 0 | 0 |
| Native extra review | None observed | One built-in advisor; serving model unknown |

See the sanitized [run summary](output/run-summary.json) and machine-readable [scores](output/scores.json). Token schemas/cache/advisor accounting differ, and native wall time includes different tooling/self-review paths. Cost and elapsed time do not establish model efficiency rankings. The fixed WebP derivative sets remain unchanged at 1,377,298 and 1,513,038 bytes.

For the original reference-fidelity objective, Codex's second artifact remains the slight preference. Claude's second artifact is now close and offers a larger photographic presentation on smaller screens. Both respond well to concrete shared feedback; equal assets still leave typography, geometry, crop, selector scope and browser-state decisions to the implementation.
