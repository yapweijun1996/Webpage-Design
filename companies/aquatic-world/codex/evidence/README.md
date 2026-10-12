# Initial Delivery Evidence

The implementation is complete as a local fictional static demo. **Browser acceptance remains unverified.** No rendered implementation screenshot was obtained in this environment.

## Executed checks

| Evidence | Actual result | Coverage |
| --- | --- | --- |
| [static-checks.json](static-checks.json) | 37 passed | Four generated fixtures; output/source consistency; landmarks; one H1; IDs; anchors; resources; data counts; honest enquiry/SEO; escaping; rejection cases; source and derivative hashes |
| [build-results.json](build-results.json) | Four pages generated | Default 3 categories, minimal 1, five 5, alternate brand 5 |
| [build-command.log](build-command.log) / [check-command.log](check-command.log) | `npm run build` and `npm run check` exited 0 | Reproducible commands from `demo/` |
| JavaScript syntax checks | Passed, exit 0 | `app.js`, `scripts/build.mjs`, `scripts/check.mjs`, `scripts/serve.mjs` |
| [image-audit.json](image-audit.json) | 20 variants decoded | Actual WebP dimensions and bytes |
| [solid-color-contrast.json](solid-color-contrast.json) | Seven pairs ≥4.5:1 | Solid colors only; photo composites not measured |
| [frozen-input-check.json](frozen-input-check.json) | 50 files unchanged | AGENTS, TASK, CLAUDE and all supplied inputs |

The self-review found that the alternate brand's neutral copy still contained the words “Aquatic World” twice. Both strings were replaced through its JSON configuration. The first failed check is retained in [self-review/static-checks-before-fix.json](self-review/static-checks-before-fix.json); the latest result passes. Empty optional sections were also checked to ensure their navigation disappears.

## Browser limits

[Browser attempt record](browser-checks.json) and [responsive matrix](responsive-test-matrix.csv) report **not_run** for the required screenshot sizes, overflow widths, interactive journeys, focus/Escape, console/network, accessibility, no-JavaScript behavior, zoom and performance. No claim of a passing browser result is made.

The terminal sandbox rejected listening on `127.0.0.1:4173` (`EPERM`). The local Playwright Chrome process aborted before a page was loaded. Computer Use rejected the `file://` protocol; no workaround to that policy was used. The supported HTTP local-project inspection tool required approval, but the environment's approval policy was `never`, so it did not run. See [preview-command.log](preview-command.log) and [preview-command-final.log](preview-command-final.log).

[assets-contact-sheet.jpg](assets-contact-sheet.jpg) is a visual inspection aid for the nine supplied standalone images. It is **not** a screenshot of the website. Both original reference images were actually viewed with `view_image` before implementation.

## Scope and runtime record

[run.json](run.json) records the observed CLI/tool versions, requested model, unexposed model/effort/usage fields, timing, interventions, asset decisions and limitations. `process-run.json` and CLI event logs were supplied by the run harness and were not edited. No implementation was delegated to another agent or model.

[acceptance-checklist.csv](acceptance-checklist.csv) separates static verified evidence from browser work that could not run. Brand, story, city imagery and quality labels are fictional/illustrative. The only supported contact state is unavailable; no contact endpoint, form, submission or success state is included. Production release criteria are outside this local-demo delivery.

To finish browser validation on a normal host, run the preview command in the workspace README and execute the recorded matrix. Required full-page captures are 1440×900, 768×1024 and 390×844; also check overflow at 320, 360, 430, 1024 and 1920 widths. Exercise all four fixture URLs, native disclosures, menu breakpoint transitions, keyboard and direct collection hashes.
