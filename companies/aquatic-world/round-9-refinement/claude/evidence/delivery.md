# Delivery record — Fusion Home v2 refinement (Claude)

- Date: 2026-10-13. Worker: Claude Code, model `claude-opus-5-5`, tools Read/Edit/Write/Bash only, no
  MCP. No other model or agent was used.
- Starting source: this workspace's own round-8 `baseline/demo` (identical to `demo/` at start).
- Status: **implementation and build complete. Rendered acceptance and publication are pending with
  the coordinator.**

## Changed files (all inside this workspace)

- `demo/src/layout.mjs`: the inline head script now also tracks `html.is-scrolled`.
- `demo/src/site.js`: the scroll handler is removed (moved to the head), and a bfcache `pageshow`
  closes the menu.
- `demo/src/site.css`: Home header opaque `#041D25` layer and feather states, open panel `#041D25`,
  safe-area term in the short-landscape bottom padding, and the inner-page shadow selector.
- `demo/scripts/check-motion.mjs`, `demo/scripts/check-motion-logic.mjs`: v2 assertions, L1 model and
  the vm cases.
- `demo/dist/`: regenerated build output (default base `/`).
- `evidence/layout-plan.md` (written before edits), `evidence/self-review.md`, this file, and the saved
  outputs of the build and both checks.
- `README.md`: build and preview instructions.

Unchanged: `input/`, `baseline/`, AGENTS.md, CLAUDE.md, TASK.md, IMPLEMENTATION-PROMPT.txt, all media
and image assets (`diff -rq` identical), `package.json` (still no dependencies).

## Commands actually run

| Command (from `demo/`) | Result |
| --- | --- |
| `node scripts/build.mjs` (baseline, before edits) | 9 pages. The baseline checks gave 126/126 static and 68/68 logic. |
| `node scripts/build.mjs --base=/Webpage-Design/aquatic-world/claude/` | Built. 0 HTML references left unprefixed. Then rebuilt with the default base. |
| `node scripts/build.mjs` | Exit 0, 9 pages. |
| `node scripts/check-motion.mjs` | Exit 0, 138/138. |
| `node scripts/check-motion-logic.mjs` | Exit 0, 79/79. |

## Actual limits

- No browser, server, CDP/Playwright, OS automation, network, Git, media generation or editing was
  used. I did not start `serve.mjs` or `preview`.
- No rendered pixels were seen. Header masking (H2), the real CTA rects (L1), the 200% text layout,
  reload/history timing, playback and keyboard focus visibility are therefore all unverified by me.
  Physical iOS/Android, assistive technology and native device data-saving policies are also
  untested.
- Static checks and the arithmetic model are source evidence. The vm checks simulate the controllers
  with stubs. None of them is a substitute for the coordinator's CUA review.
- Publication to GitHub Pages and any commit/merge belong to the coordinator.
