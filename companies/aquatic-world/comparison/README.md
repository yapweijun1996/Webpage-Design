# Codex CLI vs Claude Code — Comparison Protocol v2

Status: both rounds and their independent evaluations completed on 2026-10-11, Asia/Singapore. See the [first-round results](RESULTS.md), [shared-feedback revision](round-2/RESULTS.md) and [two-round viewer](preview.html). Original drafts and separate revised deliveries remain preserved.

## Fixed inputs and scope

Each workspace starts with the same `AGENTS.md`, `CLAUDE.md`, `TASK.md`, handoff, selected mockup, additional reference image, and nine-image standalone asset pack. `input-manifest.json` records frozen input baseline v2 and its hashes. The initial demo and evidence README files are also identical; run records differ only to identify the intended runner.

The requester chose to supply identical independent imagery before implementation. Baseline v1, its task, and its protocol are preserved under `history/`; neither runner had started when baseline v2 was prepared. The supplied handoff is unchanged. Both builders must use the same fixed image-slot mapping.

The task is a local, fictional aquatic landing page. The requester authorized launching both CLIs, comparing the initial deliveries, and then giving both identical feedback for one separately labelled revision. No production deployment or actual business enquiry integration is part of this comparison.

Verify both workspaces before either run and after both runs, from the repository root:

```sh
python3 companies/aquatic-world/comparison/check_inputs.py
```

## Startup commands

The actual initial pair uses [run_pair.py](run_pair.py) with the same prompt in both processes. It launches fresh noninteractive sessions, records process times and arguments in each workspace's `evidence/process-run.json`, and captures native event streams. Codex uses `exec`, `workspace-write`, and approval policy `never`; Claude uses print mode, permission mode `auto`, and no interactive permission prompts. These are different native permission mechanisms and are part of the recorded CLI environment. Effort uses each CLI's default, with exposed actual settings recorded separately. Do not rerun this script over existing initial records.

The following interactive commands are historical setup examples, not the commands used for the first run. The original directories are now preserved: use fresh workspaces for future implementation work. The actual revision launcher and its copied-code starting points are documented in [round-2/README.md](round-2/README.md).

Installed versions observed on 2026-10-10: Codex CLI `0.160.0`; Claude Code `2.1.289`. Both native sessions subsequently started model work. The Codex session context confirms `gpt-6.1-sol` with default `xhigh` effort; Claude's initialization confirms `claude-opus-5-5`. Startup and tool failures are recorded as environment limitations, separately from webpage runtime failures.

For a future fresh case, open two terminal windows and use fresh sessions rather than resumed conversations. Do not execute these historical examples inside preserved deliveries.

### Codex CLI

```sh
cd "/Users/yapweijun/Documents/GitHub/Webpage-Design/companies/aquatic-world/codex"
codex --model gpt-6.1-sol --sandbox workspace-write --ask-for-approval on-request --image input/handoff/reference/selected-homepage-mockup.png "Read AGENTS.md and TASK.md. Inspect both reference images, then complete TASK.md in this workspace."
```

### Claude Code CLI

```sh
cd "/Users/yapweijun/Documents/GitHub/Webpage-Design/companies/aquatic-world/claude"
claude --model claude-opus-5-5 "Read AGENTS.md and TASK.md. Inspect both reference images, then complete TASK.md in this workspace."
```

The Claude task explicitly asks the agent to read the same image files using its local image-reading tool. Confirm that both sessions actually inspect the references before implementation. In each CLI, verify the active model and record it in `evidence/run.json`. Stop a run that cannot use the requested model; do not silently substitute another model.

Codex flags were checked against local `codex --help` and the [official CLI reference](https://developers.openai.com/codex/cli/reference). Claude's model flag was checked against local `claude --help` and [model configuration](https://code.claude.com/docs/en/model-config); the explicit model ID is documented in the [Opus 5.5 overview](https://platform.claude.com/docs/en/models/opus-5-5/overview). Official model documentation does not prove access through this local account.

## Fair comparison conditions

1. Keep the frozen inputs unchanged. Builders may edit only their own demo, evidence, and implementation README.
2. Use one initial task submission per runner. Both may inspect, test, and fix their own work before declaring their initial delivery complete.
3. Do not share the other implementation, its findings, or model-specific improvement advice with either runner before the first comparison.
4. Record actual model, effort setting, CLI version, enabled tools/plugins, instruction sources, browser access, asset acquisition, session times, human interventions, and exposed usage/cost. Use `unknown` for unavailable values.
5. CLI defaults and tools can differ. Record those differences; do not claim this is a controlled model-only benchmark. The identical local task does not erase different global instructions, built-in prompts, memories, or permissions.
6. Human-assisted revision is a separate round. If used, give both the same review criteria and number of opportunities, preserve the first-round evidence, and label the round.
7. Do not rerun only the weaker result until it wins. One paired run supports a conclusion about these artifacts, not a general model ranking.

The workspace boundaries are instructions, not an OS security boundary. Review changed paths after each run. A runner that reads the competitor's output or edits frozen inputs invalidates that run's comparison.

## Fixed independent imagery

The [shared image pack](assets-v1/README.md) provides nine standalone images for the hero, heritage, collections, highlights, and enquiry. Each workspace has the same pack in `input/assets/`, including a slot map, provenance, dimensions, final generation prompts, and source hashes.

Both builders must use the mapped image for each slot. They may choose CSS crops, gradients, object positions, and deterministic optimized encodings; they may not download, regenerate, substitute, or extract different image content. Attribute visual differences to their treatment of the same sources. For additional categories in configuration fixtures, reuse an appropriate supplied asset.

The source pictures are AI-generated illustrations that match the visual direction. They are not pixel-identical original photographs from the mockup. Grade cropping, composition, overlays, and integration against the reference without penalizing both builders for the same source-level difference.

## Rubric — 100 points

| Dimension | Weight | Evaluate |
| --- | ---: | --- |
| Visual fidelity | 45 | Composition and section proportions (20), typography and spacing (10), colors and panel rhythm (5), imagery/crop/overlays (10). Compare against the selected mockup. |
| Responsive layout and accessibility | 20 | Mobile/tablet behavior, crop, no overflow/overlap, readable content, keyboard/focus/menu behavior, contrast, and reduced motion. |
| Functional correctness | 15 | Navigation, collection exploration, CTA destinations, honest enquiry state, links/assets, and absence of blocking runtime errors. |
| Configuration and content | 10 | Brand/content swap without component edits, optional sections, 1/3/5 categories, neutral facts, and asset provenance. |
| Maintainability | 10 | Clear structure, appropriate dependency size, semantic DOM, reproducible preview, understandable code, and recorded verification. |

For each dimension, score from 0 to 5, then calculate `weight × score / 5`. Visual subweights should explain the visual score. `Not run` is unscored, not zero; publish a total only after every dimension has evidence. Record elapsed time, token usage, cost, and human correction count separately; do not fold unknown values into a quality score.

## Essential acceptance checks

A result remains incomplete if it has no runnable preview, uses the screenshot as the webpage, presents a false enquiry-success state, hardcodes client data in components, or leaves the main mobile journey unusable. Record the raw score and incomplete status separately; attractive visuals do not erase these failures.

Check both pages using the same browser, zoom, viewport, scroll position, font-loading state, and capture method. Capture full-page and first-screen images at `1440×900`, `768×1024`, and `390×844`; inspect overflow at widths `320`, `360`, `430`, `1024`, and `1920` as well. Compare the webpage area of the reference; its illustrated browser bar and outer frame are not website UI.

Test the main journey with pointer and keyboard, menu Escape/focus, image/link failures, optional section visibility, brand swap, and category counts. Record actual checks and limitations. Do not report unexecuted checks as passed.

## Explain the differences

Record findings in a separately labelled report, following the evidence structure in the published results. Every significant conclusion needs:

- An observed difference at a specific viewport or interaction, under input baseline v2.
- Screenshot or runtime evidence from both pages.
- A relevant code/config/asset location explaining the implementation choice, when available.
- A distinction between observed cause and inference. Do not invent hidden reasoning or training explanations.

Prefer blind review labels A/B before revealing the builder. Keep the mapping private to the evaluator until scoring; the visible workspace names themselves are not blinded.

## Reproduce the evaluator checks

The completed evaluation used a separate headed Playwright CLI session and Google Chrome 154.0.8037.99. Start the preserved first demos on ports 4171 and 4172 from `../codex/demo/` (`npm run dev -- --port 4171`) and `../claude/demo/` (`npm run serve -- 4172`), then open the named session with the installed Playwright skill wrapper:

```sh
/Users/yapweijun/.codex/skills/playwright/scripts/playwright_cli.sh -s=aquatic-review open about:blank --headed
python3 capture_report.py codex http://127.0.0.1:4171/
python3 check_interactions.py codex
python3 capture_report.py claude http://127.0.0.1:4172/
python3 check_interactions.py claude
```

Run these commands from this comparison directory. They overwrite evaluator evidence under `output/playwright/`; preserve it before a separately labeled rerun. They do not edit contestant implementation files. The CLI wrapper is an evaluator dependency, not a demo runtime dependency.

`verify_delivery.py check codex` and `verify_delivery.py check claude` verify the preserved local first deliveries. Their manifests include original local process logs; keep those logs when using this local preservation check. `run_pair.py` refuses to overwrite an initial process record. Native trace files remain local run evidence; review their contents before any future external publication.

The latest [company preview commands](../README.md) use the second-version workspaces on ports 4181/4182. The round-2 protocol documents its separately named evaluator session and outputs.

## Process ownership in future paired runs

The second-run trace exposed broad process-name cleanup affecting preview hosting. Each runner must stop only its own recorded child process/PID, including failure cleanup. Avoid `pkill -f` against shared script names. See the round-2 report for the observed impact and restoration; source deliveries remain preserved.
