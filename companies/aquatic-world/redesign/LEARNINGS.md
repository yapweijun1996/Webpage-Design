# CLI Website Design Lessons and Research

Recorded 2026-10-11. This file owns case-specific evidence; the reusable procedure is the personal `cli-web-design-director` skill. Local source inspection, historical evaluator evidence and current explicit user feedback have different roles.

## Verified failure and scope correction

| Evidence | Finding | Consequence |
| --- | --- | --- |
| User feedback in this conversation, 2026-10-11 | The user expects standalone pages for menu destinations and rejects the top bar and overall design detail | Multi-page structure and design acceptance must be part of the next brief |
| `../round-2/codex/TASK.md`, shared task clause using `#enquiry`; original eight-section sequence | The earlier task explicitly required a landing page and normalized section-anchor navigation | The builders followed an inadequate product contract; this mismatch is not evidence that neither can build a multi-page site |
| `../round-2/codex/demo/content/default.json`, navigation; `../round-2/claude/demo/content/tenants/aquatic-world/site.json`, navigation | Both delivered global navigation uses homepage hashes | Existing builds do not meet the newly clarified standalone-page requirement |
| `../comparison/round-2/RESULTS.md` and old rubric | Codex 93.5 / Claude 92.5 measured the earlier single-page scope, with reference fidelity weighted 45% | Preserve scores as history; do not present them as professional-site or user-acceptance scores |
| Round-2 evaluator first-screen comparison, inspected at full image size | Both outputs continue the supplied cinematic teal/gold homepage structure | Visual continuity exists; a header/detail improvement must be assessed at actual viewport size and against the current goal |
| Round-2 native/evaluator records of broad `pkill -f scripts/serve.mjs`, documented in RESULTS.md | Cleanup commands can match concurrent preview servers; historical previews were later restored unchanged | Reusable CLI operations must retain owned process handles instead of broad process-name cleanup |

Source paths above are relative to this folder. Historical delivery manifests remain the preservation authority.

## Prompting and skill research

Sources were accessed 2026-10-11. Summaries below are guidance, not controlled evidence that a specific prompt will improve either selected model.

- [OpenAI best practices](https://learn.chatgpt.com/guides/best-practices): describe the goal, relevant context, constraints and completion conditions; repeated correction workflows are candidates for skills. Applied here as a brief plus observable acceptance rather than "make it impressive".
- [OpenAI frontend prompt guidance](https://developers.openai.com/api/docs/guides/frontend-prompt): audience/domain relevance, usable views/workflows and checking rendered output are useful principles. The page explicitly targets GPT-5.5; its full preset is not treated as a validated GPT-6.1 Sol instruction or imported over this project's visual direction.
- [Claude Code best practices](https://code.claude.com/docs/en/best-practices): supply specific context, separate exploration from implementation when useful and provide verifiable output. Applied as route/content plans followed by actual browser journeys and screenshots.
- [Codex skill documentation](https://learn.chatgpt.com/docs/build-skills) and [Claude Code skill documentation](https://code.claude.com/docs/en/skills): both support reusable SKILL.md packages with supporting resources and explicit invocation. Personal discovery uses the installed tool's directories; a controlled paired run should read the same frozen skill snapshot.
- Local `codex exec --help` (0.160.0) and `claude --help` (2.1.289): verified model selection, structured output and permission flags. Native runs still need exposed serving-model/tool records; CLI help does not prove model access or effective containment.

The personal skill contains generic procedure and prompt patterns, not this brand's facts or a guarantee of better taste. It does not alter model weights. Structural lint and small interpretation trials cannot establish the quality of a rebuilt website.

## Industry information architecture study

- [ADA / Aqua Design Amano official website](https://www.adana.co.jp/en/), accessed 2026-10-11: the extracted homepage presents distinct product information, aquarium/gallery education, distributor and support/contact destinations, including separate driftwood/product category links. Design inference: collection discovery and explanatory/support content deserve distinct destination contexts. Do not copy its brand identity or claim its business facts for Aquatic World.
- [Tropica official website](https://tropica.com/en/), accessed 2026-10-11: the initial page was retrieved but a follow-up request timed out. It is an investigation lead; no specific visual or navigation conclusion is relied on from that incomplete read.

This was a bounded content/navigation study through fetched pages, not a visual audit of those sites. No remote images were downloaded. Their existence does not verify any Aquatic World company claim.

## Current outcome and limits

The revised [brief](BRIEF.md), [acceptance scenarios](ACCEPTANCE.md) and [prompt](IMPLEMENTATION-PROMPT.txt) were supplied identically to both native builders. Both delivered eight distinct pages and pass the exercised independent structural/interaction gates. The [round-3 evaluation](../comparison/round-3/RESULTS.md) prefers Claude's compact header and explanatory inner pages (90.2 versus Codex 85.0) while recording weaknesses. User acceptance remains pending. These new weights differ from historical landing-page scores.

The [skill interpretation trials](skill-validation/RESULTS.md) document both native models, four scenarios, local discovery and two targeted clarifications. Those trials validate limited interpretation behavior. The full rebuild supplies actual browser evidence for the current scope, but scope, tools and prompts changed together; it cannot isolate the skill's effect on quality or prove a general model ranking.

## Verified round-3 lessons

| Evidence | Finding | Reusable consequence |
| --- | --- | --- |
| Independent navigation/journey reports for both builders | Eight distinct direct/reloadable routes, real global links, native history/new tabs and category enquiry context work | A route/content/action contract makes the intended website observable; a homepage screenshot alone cannot specify it |
| `../comparison/round-3/output/playwright/codex/home-tablet-first.png` | At 768px, copy crosses the fish face/upper body despite no horizontal overflow | Inspect subject/copy composition at intermediate widths; overflow checks cannot establish visual quality |
| Both phone Contact full-page captures | Secondary help precedes the form and produces a long approach to the primary task | Order responsive content by the visitor's task, not simply by desktop DOM columns |
| Worker run metadata and original deliveries | Claude could screenshot/self-repair; Codex's sandbox denied serving/Chrome and it reported not-run honestly | Record actual capability and use a common independent evaluator; equal input bytes do not imply equal working environments |
| `../comparison/round-3/output/journeys-method-correction.json` | A deferred prefill script can be read before completion; controlled delay reproduced the race | Await document/enhancement readiness before asserting state; preserve the same product expectation |
| Other round-3 evaluator correction records | Intentional utility anchors, described checkbox fieldsets and high-layer skip links were initially misclassified | Test destination purpose and browser semantics, including hit testing, rather than enforcing one markup pattern |
| `../comparison/round-3/deliveries/` and rechecks | Original implementation/evidence bytes remain unchanged throughout evaluator QA | Correct the evaluator separately; preserve native deliveries and label any later code repair as a new stage |

Five rejected evaluator-method reports remain traceable in the round-3 output. The final common checks were rerun for both. Only general evidence-quality and metadata procedures were added to the personal skill after the experiment; frozen worker skill snapshots remain unchanged. Company-specific scores, routes, images and assumptions stay here.

## Verified round-4 lessons

The user selected header improvement followed by earlier phone form access. Both native CLIs revised their own code once from the same 60 frozen files and five own baseline captures. The [results](../comparison/round-4/RESULTS.md) and [before/after viewer](../comparison/round-4/preview.html) distinguish measurement, evaluator judgment and pending user acceptance.

| Evidence | Finding | Reusable consequence |
| --- | --- | --- |
| Both independent revision/keyboard reports | Actual phone DOM order is intro → form/preview → secondary help, with the first labeled field visible at 390×844 | Specify the primary task's reading and keyboard order, not just a CSS column swap |
| Matching top-zero first-field measurements | Codex Name top 1,288→620px; Claude 1,344→414px | Measure task access against a declared viewport; field coordinates are not the exact scroll distance needed to glimpse a field |
| Header captures and boundary/hover checks | Codex became 80/68px desktop/phone; Claude retained 77/65px with stronger labels and current states | Improvement can come from hierarchy/state detail as well as smaller height; inspect both sides of changed breakpoints |
| Native exposed metadata, preserved deliveries and evaluator QA | Both requested models are corroborated; Codex browser access remained unavailable while Claude self-reviewed real screenshots | Keep worker evidence separate from later evaluator evidence and explain capability differences before general model claims |
| Supplemental capture interruption and rerun, header-method-correction.json | Awaiting decode for offscreen lazy images stalled a first-screen-only capture | Decode viewport-intersecting images for first screens; scroll/load all content for full pages, then reset instantly to zero |

No new numerical overall score was assigned. Both exercised independent gates pass; visual satisfaction remains pending. Only the generic lazy-image capture procedure was added to the existing personal skill after verification. All company facts, metrics, model/runtime records and rejected evaluator artifacts stay in this case. Frozen inputs and original deliveries remain unchanged.

## Verified round-5 Contact lessons

The user requested the same simplification in both original CLIs. Both received 60 identical shared files and four own baseline captures, revised only their own round-4 code and passed the scoped independent checks. See [results](../comparison/round-5/RESULTS.md) and [phone before/after viewer](../comparison/round-5/preview.html).

| Evidence | Finding | Reusable consequence |
| --- | --- | --- |
| Matching 390×844 Contact captures/geometry | Name now starts at 308px (Codex) and 303px (Claude); their Preview buttons start at 896px and 1,131px | An earlier first field is only one part of task access; inspect the complete editing path and required interactions |
| Four-group forms and preview rows, independent errors/edit/clear/no-JS checks | Claude removed Organisation/role/Timing; both removed duplicated task headings and editable-state disclosures while keeping honest preview confirmation | Simplify copy/data collection together; update dependent validation, preview rows, context and degraded states |
| Codex first-screen capture versus Claude's explicit collection choices | Codex fits four editable groups at 390px, while Claude retains multiple category selection and a larger vertical footprint | State the functionality/density trade-off rather than judging only first-field Y or raw field-group count |
| Native metadata and frozen deliveries | Codex's worker could not render locally; independent Chrome later confirmed its estimated 308px layout | Keep a source estimate distinct from measured acceptance; a common evaluator closes verification gaps without rewriting worker history |
| Desktop-aside and cached-image rejected evaluator reports | Geometric height alone misclassified secondary help; networkidle preceded some cached PNG decoding | Match checks to content role and await the actual displayed image, preserving rejected evidence and product expectations |

The evaluator now prefers Codex for the focused phone Contact task, while the prior round's judgment remains preserved. This is not a general model ranking, isolated skill effect or user approval. No overall numerical score, evaluator implementation repair or extra native run was used. Case metrics and runtime facts stay here; frozen skill/input/delivery snapshots are unchanged.
