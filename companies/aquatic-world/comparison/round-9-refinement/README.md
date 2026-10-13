# Round 9 — Fusion Home Refinement

The user authorized both native CLIs to implement the [shared v2 brief](../../redesign/fusion-home-v2/BRIEF.md), independently verify the sites, and commit/merge/push a GitHub Pages demo. Current scope is the Home header reading surface and compact landscape arrival; all existing pages and local Contact behavior remain.

Each starts from its own final round-8 source at `0aa3f689834b8975596fe9a18d2a6c6e13116137`. [Preparation](prepare.py) freezes 23 byte-identical input files, four common root contracts and independent immutable own-code baselines. [Input guard](check_inputs.py) verifies current media and historical round-8 preservation. The shared screenshots are reference evidence; sibling product source is forbidden. No new media generation or external service is part of this round.

[Native runner](run_pair.py) requests Codex `gpt-6.1-sol` and Claude `claude-opus-5-5`, both high effort. Native image attachments on Codex and Read on Claude expose the same six JPEGs; both inspect the two posters. Per-process CLI modes differ: Codex workspace-write/ignored user configuration, Claude restricted/Read-Edit-Write-Bash/empty MCP/auto permissions with no prompts. Prompt restrictions are not equivalent OS containment. No other models, sibling source, browser automation, servers, Git or publication are permitted to workers. Coordinator owns actual CUA browser review and public delivery. Raw transcripts are private and Git-ignored.

The [common acceptance](../../redesign/fusion-home-v2/ACCEPTANCE.md) separates functional checks, visual judgment and human creative acceptance. [Viewer](preview.html) uses actual browser screenshots. [Actual-site results](RESULTS.md) and [publication record](PUBLICATION.md) distinguish rendered acceptance from worker self-checks and external delivery. The one common [motion-label correction](stage-2/BRIEF.txt) was independently verified.

Build and preview from repository root:

```sh
python3 -B companies/aquatic-world/round-9-refinement/codex/demo/build.py
AQUATIC_PREVIEW_PORT=4261 python3 -B companies/aquatic-world/round-9-refinement/codex/demo/serve.py
npm --prefix companies/aquatic-world/round-9-refinement/claude/demo run build
AQUATIC_PREVIEW_PORT=4262 npm --prefix companies/aquatic-world/round-9-refinement/claude/demo run serve
```

Coordinator publication uses `scripts/prepare_pages.py` and `scripts/serve_pages.py`. Contact creates a local preview only; no message is sent.
