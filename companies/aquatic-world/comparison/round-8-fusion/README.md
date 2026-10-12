# Round 8 — Fusion Home Comparison

Prepared 2026-10-12. The user authorized both native CLIs to implement the common fusion brief and then compare actual desktop/phone results. Both implementations and equal actual-site review are complete; human creative acceptance remains open.

## Shared direction and ownership

[Design package](../../redesign/fusion-home-v1/README.md), [brief](../../redesign/fusion-home-v1/BRIEF.md), [three selected static concepts](../../redesign/fusion-home-v1/visuals/README.md) and [review requirements](../../redesign/fusion-home-v1/REVIEW.md). The generated open-menu concept has approximate geometry; the brief owns accurate menu dimensions and unchanged hero anchors on opening.

Each candidate starts from a source-only copy of its own round-7 demo. Its own immutable baseline is retained locally in `baseline/demo/`; public/dist output is rebuilt. [Preparation](prepare.py), [frozen input manifest](input-manifest.json), [starting conditions](starting-conditions.json) and [input guard](check_inputs.py) record equal common inputs, independent baselines and historical preservation.

Seventeen common input files include the brief, review requirements, concept notes, three PNGs, four byte-identical runtime media assets and their historical manifest, a design-skill snapshot and an empty MCP configuration. Four root worker contracts are also identical. The current aspect-ratio-only selection supersedes the older manifest's width guard. No new image/video generation occurs in this implementation round.

The [native runner](run_pair.py) uses exact requested models: Codex `gpt-6.1-sol` and Claude `claude-opus-5-5`, with explicit high effort on both. Installed preflight versions were Codex CLI 0.162.1 and Claude Code 2.1.289; launch versions are recorded separately in each worker's process record. Codex receives the three images as native attachments; Claude must inspect the same bytes through Read. Exposed tool/image-read evidence and serving-model information will be reviewed separately from requested settings.

Codex uses workspace-write, no approvals, ignored user configuration and an ephemeral run. Claude uses restricted mode, Read/Edit/Write/Bash, strict empty MCP configuration and auto permissions with no prompts. Neither may use another model/agent, sibling source, browser automation, network service, paid generation, Git or publication. These tool modes differ and Bash/prompt restrictions are not equivalent OS filesystem/network containment. The experiment compares these recorded CLI workflows and different own-code baselines, not isolated model capability.

Raw CLI transcripts remain private and Git-ignored. Worker source/stub checks do not establish browser behavior. The coordinator owns equal actual-browser review, corrections, documentation and the user's previously authorized commit/merge/push delivery.

## Acceptance

Review common desktop/phone composition, closed and open menus, narrow landscape, enlarged text, visible focus, retained manual Pause, scene continuity and the existing eight-page/local Contact journey. Preserve current film/poster bytes, crop policy and inner-page presentation. Fix confirmed in-scope failures and recheck their affected scenarios before publication.

[Actual-site results](RESULTS.md), [side-by-side still viewer](preview.html), [reviewed native execution metadata](evidence/cli-audit.json), [stage2 common feedback](stage-2/BRIEF.txt), [stage3 common feedback](stage-3/BRIEF.txt) and [publication record](PUBLICATION.md) separate functional evidence, visual judgement, delivery and human acceptance. No worker product source was edited by the coordinator.

Current local previews from the repository root:

```sh
python3 -B companies/aquatic-world/round-8-fusion/codex/demo/build.py
```

Use the actual root commands in the [company README](../../README.md): Codex port4251, Claude4252. To reproduce the Pages project path, run `python3 -B scripts/prepare_pages.py --base=/Webpage-Design/` and `python3 -B scripts/serve_pages.py --port=4250` from the repository root. The comparison appears at `/Webpage-Design/comparison/`. Build/worker completion alone does not mark this case ready.
