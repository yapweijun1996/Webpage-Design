# Contact revision and self-review

Date: 2026-10-11. Outcome: source implementation complete; non-browser checks pass. Real rendered acceptance remains incomplete because the necessary browser/loopback prerequisites are unavailable. This is a worker self-review, not an independent evaluation or user design acceptance.

## Authority and inspected evidence

Read AGENTS.md, REVIEW.md, BRIEF.md and ACCEPTANCE.md, then the frozen input/skills/cli-web-design-director/SKILL.md and design-review, prompt-patterns and cli-operation references. REVIEW.md supersedes only historical Contact complexity. Read the supplied own sources, input asset/reference notes, asset manifests and baseline README.

Inspected both supplied homepage reference images and own Contact first-screen captures (1440×900 and 390×844), own Contact full capture (390×2697), own Home first capture (1440×900), and the existing underwater help illustration. The own phone baseline reaches the Name input at about 620px. It stacks task eyebrow/heading/purpose, another form eyebrow/heading, disclosure and category introduction before the first field, then repeats local-only explanations below it. The own baseline already has four groups; there were no extra Organisation/role/Timing controls to remove.

The requested routed instruction-modules directory is absent. This gap does not prevent the bounded source change or honest verification under the supplied core/current contract. No sibling, older workspace, parent comparison report or evaluator script was read. No additional model, delegate or advisor was used. The [design plan](design-plan.md) was recorded before editing.

## Implemented decisions

1. **One task heading.** Replaced the separate introductory column and duplicate form heading with h1#contact-title, “Your project brief”. The form is named by that h1. The planned short purpose sentence was omitted during source self-review because the heading already identifies the task; retaining it would spend another wrapped line before Name. No normal pre-form eyebrow or second task heading remains.
2. **One concise disclosure.** The editable state displays “Local preview only. Nothing is sent or saved.” Removed the email privacy hint, action-area privacy paragraph and repeated nothing-sent note. Successful preview hides the editable form/disclosure and explicitly displays “Preview created. Nothing was sent.” The site's global fictional-demo footer remains unchanged.
3. **Four groups.** Name, Email, Collection, Project; no hidden advanced step or additional data control. Name/email/project requirements and length constraints remain. Preview outputs exactly these four rows through textContent, including long literal strings. The original single-select model and Not sure yet are preserved.
4. **Compact field-local context.** Category context is one associated hint immediately below Collection. Known query slugs prefill; absent/unknown values use general. Quality's existing Contact destination remains the general enquiry. Updating the select updates that hint without duplicating a pre-form panel.
5. **Edit and Clear.** Successful preview replaces the form and focuses the result. Return to edit restores the same values and focuses Project. Clear is available from both states; it empties values/errors/output, sets Collection to Not sure yet, restores the editable disclosure and focuses Name. Incoming query context is dropped for the current brief; refreshing the original URL naturally applies its query again. The reset status explicitly reports the category reset.
6. **Guidance after the workspace.** A closed native “Help with your brief” disclosure follows the entire form and preview in DOM/keyboard/visual order. It preserves setting, colour/material, practical-question and optional dimensions/timing guidance, plus review/edit/clear advice and the Collections link. The existing photograph remains secondary, after the disclosure.
7. **No-JS honesty.** One noscript paragraph replaces the normal disclosure, which stays hidden until enhancement initializes. The fieldset and submit button are disabled in the static output and enabled by the script; this prevents an implicit native enquiry submission. Native page links, menu disclosure and guidance remain in the static HTML. Real no-JS interactions are not browser-verified.
8. **Responsive intent.** Removed obsolete Contact responsive rules, keeping other page/header rules. Centred an 840px maximum workspace; Name/Email share a row above 767px and stack below it. Phone panel padding is 20px (16px inline below 360px). Primary labels/body/hints/control text are 16px, secondary required text 14px, controls at least 50px and field gaps 20px. No type or target was reduced to meet the screen budget.

Authored phone top budget at 360/390px is approximately 308px for Name if the 32px heading occupies one line and the disclosure two lines: unchanged 68px header + 24px section inset + approximately 28px breadcrumb + 20px breadcrumb gap + 21px panel border/padding + 36.8px heading + 10px disclosure gap + 48px disclosure + 20px form gap + 24px label + 8px label gap. Email is then approximately 410–460px. **These are source-based estimates, not measured coordinates or a pass claim.** Real wrapping, actual viewport zero and hit testing remain necessary.

## Source/output ownership and preservation

Changed only authoritative demo/build.py, demo/styles.css, demo/script.js, rebuilt generated demo/public/contact/index.html/styles.css/script.js, and wrote evidence/root README. The seven other content pages and 404 HTML remain byte-identical to the starting copies. Shared brand/navigation/category data, server and all images remain unchanged.

All 65 frozen files snapshotted before edits are hash-identical, including AGENTS.md, CLAUDE.md, TASK.md, BRIEF.md, ACCEPTANCE.md, REVIEW.md, IMPLEMENTATION-PROMPT.txt, input/ and baseline/. No global catalog/configuration, commit/push, deployment/publication, external account or enquiry was used.

## Executed checks

| Check | Actual result | What it proves / limit |
| --- | --- | --- |
| Python build | Pass | Eight static content pages plus 404 generated from sources |
| Repeated final build | Pass, 31 identical files | Deterministic final output, no stale generated source copies |
| Static and actual handler | 939 pass, 0 fail | Correct route-specific HTML/titles/h1, destination/assets, form grouping/associations/DOM order, category links, hashes, real handler responses |
| Actual JS in Node VM | 48 pass, 0 fail | Script branches/state/focus calls/text rendering using DOM doubles; not native browser behavior |
| JS syntax | Pass | Shipped script and both JS evidence runners parse |
| CSS brace balance/source review | Pass | No mismatched braces; no rendered layout/contrast claim |
| Image/source provenance hashes | Pass | Nine PNG source hashes, 18 variants and 18 generated copies match existing manifest |
| Optional browser runner | not_run | Existing Playwright module cannot be resolved; no install attempted |

Script checks cover three category prefills, general/Quality-equivalent state, unknown/HTML-like/case-mismatched query values, blank/invalid correction, all summary links/focus calls, four preview rows, preview/edit/clear from both states, dropping incoming context, 19/20/2000/2001-character boundaries, long HTML-like text, no network/storage operations, and shared menu Escape/outside-click/desktop-resize logic on Contact and a non-Contact document.

The actual serve.py request handler is executed in-process with only the listening server replaced. All eight GET routes return the exact intended bytes, Contact HEAD/query requests work, an unknown path returns the actual custom 404 with HTTP 404, POST remains unsupported (501), and CSS/JS requests succeed. This does not establish live loopback HTTP, browser navigation, reload or history acceptance.

Reports: [static-results.json](static-results.json), [interaction-results.json](interaction-results.json), [build-results.json](build-results.json), [environment-results.json](environment-results.json), [browser-results.json](browser-results.json), [run-metadata.json](run-metadata.json). Reproduction commands are in root README.

## Real rendering, interaction and screenshot gaps

The AQUATIC_PREVIEW_PORT=4211 preflight bind fails with PermissionError: [Errno 1] Operation not permitted. No server handle was created and no other preview process was altered. Available CUA Chrome rejected the local file:// entry because browser security policy allows only http/https. No workaround, alternate surface, raw CDP injection or permission expansion was attempted. The optional browser runner returns MODULE_NOT_FOUND for an existing Playwright package. No after screenshot exists.

| Required real-browser scenario | Status |
| --- | --- |
| Fresh /contact/ 390×844, scroll zero: input <=320 and Name/Email fully visible | not_run |
| Fresh /contact/ 360×800, scroll zero: input <=320 and Name/Email fully visible | not_run |
| Contact 320px, 768×1024 and 1440×900 actual composition/overflow | not_run |
| Matching own-baseline/after first/full screenshots and visual comparison | not_run |
| Rendered contextual, invalid/errors, valid preview, edit, clear and long-text states | not_run |
| Actual keyboard order/error links/focus visibility/topmost hit testing | not_run |
| Native no-JS menu, help, disabled form and disclosure state | not_run |
| All routes/header/footer actual navigation, refresh/history/new-tab journey | not_run |
| Browser runtime console/network and real reduced-motion behavior | not_run |
| Real device, Safari/Firefox, screen reader, zoom, computed contrast | not_run |

The optional evidence/browser-qa.cjs is prepared for loopback HTTP in an environment with an already installed Playwright package. It does not install packages, start/stop a server, use file URLs or access external services. It writes real captures only after actual browser execution. Its prepared assertions/capture paths are not executed evidence.

## Self-review outcome

Source/logic review meets the focused four-group, single-heading/disclosure, post-workspace guidance, honest local-preview and preservation requirements. No in-scope failure was found in the executed checks. The important remaining gap is the rendered phone first-viewport requirement and the associated real-browser accessibility/navigation/visual regression checks. Functional browser acceptance, independent design assessment and user design acceptance remain open; this workspace is not marked ready on the strength of non-browser checks.
