# Initial Landing Page Comparison

Evaluation completed on 2026-10-11, Asia/Singapore. **Codex is closer to the supplied reference composition in this pair. Claude provides a more spacious layout and a stronger builder-side browser verification record.** Neither first delivery is flawless.

Open the [visual comparison](preview.html?round=1), [Codex preview instructions](../codex/README.md), or [Claude preview instructions](../claude/README.md). Current local previews: [Codex](http://127.0.0.1:4171/), [Claude](http://127.0.0.1:4172/).

## Conditions and preservation

- One fresh initial task submission per CLI; autonomous self-review permitted. No evaluator feedback or comparative hints were given to either builder. This report covers the original deliveries before feedback. The later [shared-feedback revision](round-2/RESULTS.md) is recorded separately.
- Input baseline v2: 50 frozen files per workspace still match SHA-256 manifest `5bb6a7497bca8252f6fb365f1d6cf0219735d59e318d2805b4c3b613af22ab95`.
- Session contexts identify `gpt-6.1-sol` / Codex CLI `0.160.0`, and `claude-opus-5-5` / Claude Code `2.1.289`. These are observed CLI model settings, not an independent provider routing audit.
- Codex used its default `xhigh` effort, `workspace-write`, and approval policy `never`. Its sandbox blocked loopback binding and browser launch; HTTP inspection required unavailable approval. Claude used native `auto` permissions, default effort of unknown named level, and one built-in `advisor` review call. The advisor result is redacted and does not expose its serving model. These differences prevent a model-only conclusion.
- Both viewed both reference images and used the supplied nine-image kit. The kit matches the direction, rather than the original mockup's exact photographic pixels. Source-level image differences and mandatory fictional-copy changes were not treated as builder defects.
- Review was **not blind**: workspace names were visible. Scores are an evaluator judgment under the published rubric, not an objective model benchmark.
- Initial deliveries are preserved in place and indexed by [Codex hashes](initial-deliveries/codex.json) and [Claude hashes](initial-deliveries/claude.json). Evaluation did not edit either implementation.

See [run-summary.json](output/run-summary.json) for exposed environment, usage, timing and permission evidence.

## Scores

| Dimension | Weight | Codex / 5 | Codex points | Claude / 5 | Claude points |
| --- | ---: | ---: | ---: | ---: | ---: |
| Visual fidelity | 45 | 4.28* | 38.5 | 3.50 | 31.5 |
| Responsive layout and accessibility | 20 | 4.0 | 16.0 | 4.5 | 18.0 |
| Functional correctness | 15 | 5.0 | 15.0 | 4.5 | 13.5 |
| Configuration and content | 10 | 5.0 | 10.0 | 5.0 | 10.0 |
| Maintainability | 10 | 4.0 | 8.0 | 4.5 | 9.0 |
| **Weighted total** | **100** | | **87.5** | | **82.0** |

*Visual scores derive from the subweights below; the displayed overall score is rounded. Totals use the subweight points directly. Passing checks only supports the behavior exercised; a 5 does not mean all possible scenarios were tested.*

| Visual subdimension | Weight | Codex / 5 | Claude / 5 | Reason |
| --- | ---: | ---: | ---: | --- |
| Composition and section proportions | 20 | 4.5 | 3.0 | Codex preserves compact horizontal bands more closely. Claude enlarges secondary bands substantially. |
| Typography and spacing | 10 | 4.0 | 3.5 | Both use the documented serif direction. Claude's larger secondary headings, wraps and padding depart further from the compact mockup. |
| Colors and panel rhythm | 5 | 4.5 | 4.5 | Both preserve dark teal, gold and alternating cream panels. |
| Imagery, crop and overlays | 10 | 4.0 | 4.0 | Both integrate the fixed sources well; Codex overlaps the fish at tablet width, while Claude crops more of the fish at phone width. |

No listed essential failure was observed: both previews run, use semantic text rather than a screenshot page, support configuration changes, provide a usable mobile journey, and honestly describe unavailable real enquiries. Both remain **first drafts with known issues**, rather than issue-free releases. These historical deliveries retain their original issues. The later shared-feedback revision is evaluated separately; the company catalog now describes that latest scope.

## Observable differences and their causes

| Observation | Evidence | Implementation cause / confidence |
| --- | --- | --- |
| At 1440px, Codex is 2,234px tall and Claude is 3,138px tall: Claude is about 40.5% longer. Its quality band is about 406px versus 248px; highlights 385px versus 219px; enquiry 455px versus 260px. Codex's density is closer to the reference. | [Codex desktop](output/playwright/codex/desktop-full.png), [Claude desktop](output/playwright/claude/desktop-full.png), both layout reports below | [Codex styles](../codex/demo/styles.css) use small band padding and a 260px enquiry minimum. [Claude styles](../claude/demo/src/styles/site.css) use a 760px hero cap, larger band padding, larger secondary headings and longer disclosures. Measured geometry and code support this explanation; the scoring preference follows the fidelity objective. |
| At 768px, Codex keeps copy over the fish; Claude stacks the picture above the copy, preserving text/subject separation at the cost of a longer first section. At 390px, Codex shows more of the fish and places the header on a solid band; Claude's header overlays the image and its crop loses more of the right fin. | [Codex tablet](output/playwright/codex/tablet-first.png), [Claude tablet](output/playwright/claude/tablet-first.png), [Codex phone](output/playwright/codex/mobile-first.png), [Claude phone](output/playwright/claude/mobile-first.png) | Codex switches to a photo-first stack below 600px and uses phone `object-position: 85% center`. Claude stacks through 899px and sets `mobilePosition: 66% 50%` in [homepage configuration](../claude/demo/content/tenants/aquatic-world/homepage.json). Observable breakpoint/crop decisions, not hidden reasoning claims. |
| **Codex issue:** the waterfront caption is dark on the shaded image and difficult to read, including at tablet width. | Desktop/tablet images above; computed caption color in [supplemental checks](output/supplemental-checks.json). | [styles.css, line 64](../codex/demo/styles.css): `.light-panel .eyebrow` has higher specificity than the cream-color caption rule at line 70. The entire heritage section carries `light-panel`, so the caption inherits the editorial panel's ink treatment. Confirmed cascade cause; no pixel contrast ratio was calculated. |
| **Claude issue:** opening a category and using browser Back returns to the base URL but leaves the explorer open. Codex restores the closed state. | [Codex journeys](output/playwright/codex/interaction-checks.json), [Claude journeys](output/playwright/claude/interaction-checks.json) | [Claude fromHash](../claude/demo/src/client/site.js) opens matching hashes but returns on an empty/noncollection hash without clearing the open state. [Codex hashchange](../codex/demo/app.js) closes active details for a noncollection hash. Confirmed state synchronization omission. |
| Both support a second brand, 1/3/5 collections, hidden optional sections, valid local links, keyboard menu/collection Escape and focus return. Claude additionally includes a validated local preview form; Codex uses an information disclosure. Both avoid fake enquiry success. | Both journey reports; [preview server checks](output/preview-checks.json) | Content is generated from JSON in both. Codex has one compact renderer; Claude splits section components and tenant files. The optional form is additional scope, not a requirement missing from Codex. |

## Verification

The evaluator used the same separate headed Google Chrome `154.0.8037.99` session, default zoom, DPR 1 and capture procedure for both. First-screen and full-page screenshots exist at 1440×900, 768×1024 and 390×844; widths 320, 360, 430, 1024 and 1920 were also inspected. All eight widths had no horizontal overflow, unresolved in-page anchors or broken rendered images. No blocking page runtime errors were observed. Hidden lazy images are checked when their detail panel is opened, rather than mistaken for failed loading.

- [Codex layout measurements](output/playwright/codex/layout-checks.json): eight widths, six standard screenshots.
- [Claude layout measurements](output/playwright/claude/layout-checks.json): same widths and screenshots.
- Independent journey checks: Codex 21/21 passed; Claude 19/20 passed, with the Back-state issue above. Counts differ because the form and fixture sets differ; scores are not pass-count ratios.
- Both documented Node preview servers returned HTTP 200 and the exact delivered HTML bytes. Second-brand routes also returned 200. Temporary server probes were stopped.
- Brand/collection fixtures were rendered at desktop and phone widths; optional quality/highlight sections and their navigation were absent in minimal fixtures. Main content and navigation were also checked with page JavaScript disabled. Reduced-motion scrolling was checked.
- Builder evidence: Codex reports 37 static/build checks and no browser checks; Claude reports 40 automated checks in its own headless Chromium `156.0.8078.4`. These checks were not presented as equivalent verification coverage. The evaluator's checks independently cover both pages.
- Not run: Safari/Firefox, real devices, screen readers, full automated accessibility audit, 200% browser zoom and field Core Web Vitals. Photo-caption readability was reviewed visually; comprehensive photographic contrast was not measured.

The capture harness was corrected to avoid waiting for images inside hidden lazy detail panels and to let sticky-header scroll state settle before full-page captures. Final evidence uses the corrected procedure for both; contestant code was unaffected.

## Time and exposed usage

| Measure | Codex | Claude |
| --- | --- | --- |
| Process elapsed time | 1,722.42s / 28m 42s | 1,410.32s / 23m 30s |
| Native input usage | 3,310,992 input tokens; 3,120,384 cached | Native final result: 128 input, 217,994 cache creation, 9,121,655 cache read; `modelUsage` separately reports 191,636 input |
| Native output usage | 40,701 output; 17,211 reasoning output | Final `usage`: 97,450 output, including 21,621 thinking; `modelUsage`: 102,648 output |
| Exposed cost | Unknown | $6.384226, native `list` price basis; actual billing unknown |
| Evaluator correction prompts before delivery | 0 | 0 |
| Extra native review | None reported | One built-in advisor call |

Token schemas and inclusion of cache/advisor accounting differ; these totals should not be treated as directly comparable efficiency measurements. Asset variants total 1,377,298 bytes for Codex and 1,513,038 bytes for Claude; these are complete derivative sets, not identical transfer measurements or measured Web Vitals.

## Conclusion

Prefer **Codex's initial artifact for this design-fidelity objective**, especially the compact desktop composition. Prefer **Claude's layout approach when stronger separation at tablet widths and a more spacious presentation matter more**. Its builder-side browser verification was broader and its run was about five minutes faster under these different environments.

The supplied design and identical pictures constrain the task, but they do not determine CSS selector scope, breakpoints, crop positions, padding or browser-history state. Those implementation choices explain the observed differences. The next useful round would preserve these first drafts and give both the same evaluation criteria and one revision opportunity. One pair does not establish a general model ranking.
