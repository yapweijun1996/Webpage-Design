# Multi-page Website Rebuild — Round 3

The user authorized Codex GPT-6.1 Sol (`gpt-6.1-sol`) and Claude Code Opus 5.5 (`claude-opus-5-5`) to independently rebuild the same multi-page website on 2026-10-11. This is a new product scope, not a direct numerical continuation of the previous single-page experiment.

## Starting conditions

Both `../../round-3/<runner>/` workspaces begin without implementation code. They receive identical workspace instructions, task, brief, acceptance, launch prompt, original handoff/reference files, nine source images and a snapshot of the same CLI web-design skill. Neither may read old implementations, siblings or evaluator reports. The [input manifest](input-manifest.json) records exact bytes; `check_inputs.py` verifies them.

Native settings continue the established pair: Codex CLI 0.160.0, workspace-write/never approvals, requested `gpt-6.1-sol`; Claude Code 2.1.289, auto permissions/no prompt recipient, requested `claude-opus-5-5`. Default effort remains unnormalized. Browser, tools, global instructions and effective permissions may differ. This evaluates resulting CLI artifacts; it does not isolate model capability. Actual exposed metadata and additional model assistance will be reported, including unknown values.

Builders receive one autonomous implementation opportunity with self-review/repairs before delivery. The evaluator provides no asymmetric coaching. If independent acceptance reveals failures, record the original delivered result before any separate, explicitly documented repair stage. No silent editing of contestant code or rewriting historical evidence.

Builder preview-port suggestions are separate environment values: `AQUATIC_PREVIEW_PORT=4191` for Codex and `4192` for Claude. These operational differences are recorded. Servers must bind to loopback and use retained process handles; broad process-name cleanup is prohibited. Existing ports 4170, 4171, 4172, 4181 and 4182 belong to preserved previews.

## Product gates and rubric

The task is eight useful content pages, real page navigation, polished shared header, distinct inner-page compositions, responsive/keyboard behavior and an honest enquiry preview. The homepage reference defines visual continuity, not a one-page contract. [Shared acceptance](../../round-3/codex/ACCEPTANCE.md) owns the specific scenarios.

All structural/function gates must pass for overall functional completion, irrespective of score. Numerical design assessment is non-blind evaluator judgment with full-size screenshots and reasons. User acceptance remains pending until explicit feedback. Do not use a fidelity score to assert satisfaction.

| Criterion | Weight | Evidence |
| --- | --- | --- |
| Information architecture and usefulness | 25 | Distinct useful pages, understandable hierarchy and main journey |
| Visual craft | 35 | Header 10, composition/type/rhythm 15, imagery/detail/reference continuity 10 |
| Responsive layout and accessibility | 20 | Phone/intermediate/desktop layout, focus/menu/form semantics, no-JS and reduced motion |
| Interaction completeness | 15 | Real navigation/direct loading/history, enquiry validation/feedback and not-found recovery |
| Reproducibility and ownership | 5 | Build/preview accuracy, local assets/code and documented data/content ownership |

Use a 0–5 assessment for each weighted criterion/subcriterion, with a supported reason. Scores are weighted points out of 100. These weights differ from rounds 1–2; do not report direct score deltas across the scope change.

## Independent verification

Use the same headed Google Chrome environment and capture conditions for both. Test all routes at 1440×900 and 390×844; capture Home, collection index, fish detail, Quality and Contact at both widths, plus the phone menu. Inspect key layouts at 768×1024 and check overflow at 320, 360, 430, 1024 and 1920. Run cross-page header/footer links, direct URLs/refresh, Back/Forward, category context, breadcrumbs, new-tab links, not-found recovery, keyboard menu/focus and honest form journeys. Record browser errors and broken rendered assets. Fresh builds must reproduce intended output; note any missing platform/a11y/performance checks honestly.

## Execution

The [launcher](run_pair.py) starts native processes with argument arrays and identical prompt bytes, records owned PIDs and atomic private run records, propagates nonzero exits and refuses to overwrite previous runs. It is not a repeatable overwrite command. Final deliveries are hashed after processes finish; source/evidence input custody stays separate from evaluator outputs.

Status: both native processes completed with exit 0; original deliveries are frozen and the exercised independent structural/interaction gates pass. The [results](RESULTS.md) record design ratings, remaining weaknesses, evaluator method corrections and environment differences. [The viewer](preview.html) compares all eight pages at three viewport sizes. User design acceptance remains pending; no evaluator implementation repair stage was performed.
