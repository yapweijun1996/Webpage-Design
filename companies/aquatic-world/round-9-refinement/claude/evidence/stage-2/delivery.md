# Delivery record — Stage 2 motion-label correction (Claude)

- Date: 2026-10-13. Worker: Claude Code, model `claude-opus-5-5`, tools Read/Edit/Write/Bash only, no
  MCP. No other model or agent was used.
- Starting source: this workspace's own v2 `demo/` (the state recorded in `evidence/delivery.md`).
- Status: **correction implemented and built. Rendered acceptance and publication are pending with the
  coordinator.**

## Changed files (all inside this workspace)

- `demo/src/site.css`: only the `.bg-toggle-label` rule and its comment. The label now wraps within a
  width bounded by the inset, button and gap, and is bottom-anchored so it grows upward.
- `demo/scripts/check-motion.mjs`: 12 new label assertions and an arithmetic geometry model. No existing
  assertion was changed.
- `demo/dist/`: regenerated build output (default base `/`).
- `evidence/stage-2/layout-plan.md` (written before edits), `self-review.md`, this file, and the saved
  outputs of the build and both checks.
- `README.md`: current status.

Unchanged: `input/`, `baseline/`, root contracts (AGENTS.md, CLAUDE.md, TASK.md, IMPLEMENTATION-PROMPT.txt,
REFINEMENT-PROMPT.txt), the original `evidence/*` files, `evidence/stage-2/reference.jpg`, media and
image assets, `site.js`, page markup and `package.json`. A modification-time listing confirms that only
the two demo files above, plus the new stage-2 evidence, were written in this run.

## Commands actually run

| Command (from `demo/`) | Result |
| --- | --- |
| `npm run build` | Exit 0, 9 pages |
| `node scripts/check-motion.mjs` | Exit 0, 150/150 |
| `node scripts/check-motion-logic.mjs` | Exit 0, 79/79 |

## Actual limits

- No browser, server, CDP/Playwright, OS automation, network, Git or media work was used.
- No rendered pixels were seen. The source checks and the model do not prove rendered fit; the
  coordinator's 320×375 / 200% focus and hover review does.
- Commit, merge and GitHub Pages publication belong to the coordinator.
