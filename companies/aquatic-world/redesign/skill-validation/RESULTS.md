# CLI Web Design Skill Interpretation Trials

Date: 2026-10-11. Outcome: both selected CLIs correctly identified the core scope and acceptance distinctions in four bounded scenarios. This is interpretation evidence, not a rebuilt website, a visual quality evaluation or proof of improved user satisfaction.

## Method and evidence

Each runner received the same [prompt](PROMPT.txt) and four byte-identical skill files recorded in [input-manifest.json](input-manifest.json). Codex used GPT-6.1 Sol with a read-only sandbox; Claude used Opus 5.5 with its built-in tools restricted to Read. Default effort was retained, without claiming equivalence. The [native launcher](run_trials.py) kept process handles, recorded both exit codes and refused to overwrite prior run evidence.

| Runner | Exposed model | Duration | Native exit | Observed source reads |
| --- | --- | --- | --- | --- |
| Codex | `gpt-6.1-sol` | 71.45s | 0 | SKILL.md and all three references, through command_execution |
| Claude | `claude-opus-5-5` | 47.30s | 0 | SKILL.md and all three references, through Read |

See the preserved [Codex response](codex/evidence/response.json), [Claude response](claude/evidence/response.json) and [structured result record](RESULTS.json). Requested/exposed models, input reads, native usage, limitations and current personal skill hashes are recorded there. No browser testing, site build or new page implementation was performed by either trial.

## Independent assessment

| Scenario | Result in both responses |
| --- | --- |
| A: user corrects a mockup-led landing page to a company website | Independent Collections, Quality and Contact destinations with useful page content; reference defines visual evidence; full-size header review and direct-load/history journeys required |
| B: another user explicitly wants one event campaign page | Intentional section anchors retained; no automatic multi-page expansion |
| C: two servers share a command name | Stop only the owned process/group and retain the real native exit code; no broad `pkill -f` cleanup |
| D: old fidelity score is high but user rejects the design | Historical score kept with old scope; new-scope acceptance remains open and `ready` is false |

Claude additionally stated that old deliveries could not be a starting base, which was not required by the skill. A preserved historical version can be copied into a new owned workspace and reused. The current skill now states that distinction explicitly. This targeted wording clarification was manually reviewed, not rerun in another native trial.

The trial also exposed that Claude's `--tools Read` restriction does not remove configured MCP tools. Observed calls used only Read, and no MCP mutation was observed; this was not enforced tool-level containment across all exposed integrations. The current skill warns about inspecting the inventory and selecting a verified strict MCP configuration when that containment is required. The original trial snapshot remains unchanged.

## Skill installation and validation

Canonical personal source: `/Users/yapweijun/.codex/skills/cli-web-design-director/`. Symlinked discovery entries in `~/.agents/skills/` and `~/.claude/skills/` point to that same source. The native Codex developer skill catalog and Claude init slash-command catalog both included `cli-web-design-director`; explicit shorthand invocation was not separately executed.

Use `$cli-web-design-director` in Codex or `/cli-web-design-director` in Claude Code, followed by the actual request. For a controlled paired implementation, copy the current skill as frozen shared input and explicitly instruct both workers to read it. Do not rely on unequal ambient skill libraries.

The skill-creator structural validator passed. The default and bundled Python environments lacked PyYAML; validation used a disposable venv with PyYAML 6.0.3, then removed it. No persistent package dependency was added to the skill. This check covers metadata/scaffold validity; it does not validate design judgment.

The current personal skill contains two clarifications added after the frozen trial. The new eight-page company brief has not been executed. Independent design review of an actual new site and explicit user feedback remain required.
