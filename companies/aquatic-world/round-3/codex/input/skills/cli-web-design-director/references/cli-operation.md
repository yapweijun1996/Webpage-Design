# Native CLI operation

Check installed help before execution. Example flags were verified with local Codex CLI 0.160.0 and Claude Code 2.1.289 on 2026-10-11; they are not promises about future versions. Use the user's exact model and actual paths, not a "latest" alias.

## Preflight and invocation

Inspect repository state and instructions. Establish an owned workspace, prompt file, permitted tools/writes and separate evidence directory. Check executable/version/help without printing secrets. Read-only documentation does not require a paid authentication smoke test.

For an authorized isolated implementation, these locally used forms illustrate execution:

```sh
codex --ask-for-approval never exec --model MODEL_ID \
  --sandbox workspace-write --json \
  --image input/reference.png --output-last-message evidence/delivery.md - \
  < IMPLEMENTATION-PROMPT.txt > evidence/cli-events.jsonl 2> evidence/cli-stderr.log

claude --print --model MODEL_ID --permission-mode auto \
  --permission-prompts none --output-format stream-json --verbose \
  < IMPLEMENTATION-PROMPT.txt > evidence/cli-events.jsonl 2> evidence/cli-stderr.log
```

Permission modes differ. Choose them according to current authorization; this skill does not authorize access expansion. For interpretation only, use a read-only Codex sandbox or limit Claude's tools to relevant reads. Restricting Claude's built-in tools does not remove configured MCP tools; inspect the exposed tool inventory and use a verified strict MCP configuration when containment requires it. `--permission-prompts none` denies actions requiring a prompt; it is not a bypass. Check exit status immediately. The `>` examples require new output paths and must not overwrite evidence.

An image path in prose does not prove inspection. Attach it through supported input or require a permitted image-read tool, then confirm the read in exposed evidence. A real browser/capture capability is needed to inspect rendered UI; do not infer it from a tool name.

## Ownership and process handling

Programmatic orchestration should use argument arrays with `subprocess.Popen`, an explicit working directory and file handles. Send prompt bytes through stdin; do not interpolate user text into shell code. Keep raw execution logs private and local. Use fresh paths and atomic run records.

Retain worker/server process handles and exit codes. Stop only owned processes or groups whose ownership is established. Never use broad `pkill -f` against a shared server command: it may stop another implementation or the user's preview. Report a failed worker even if another succeeds. A `grep` pipeline must not mask a native command's exit status.

## Evidence and comparison limits

Record requested and exposed serving model, CLI version, effort (unknown if unexposed), tools/permissions, browser availability, timing, exit status, prompts/revisions and exposed usage/cost. Preserve native token/cache schemas; unlike counters do not establish comparable efficiency or actual billing.

Freeze task/asset/skill bytes before a paired run. Separate writable code/evidence and preserve old versions. Reusing a worker's own earlier code in a new owned copy is allowed unless the experiment explicitly requires a fresh start; preserving a historical delivery does not prohibit such reuse. Tool restrictions and prompts may not enforce filesystem isolation: record actual containment and residual access. Record built-in advisors or other-model assistance. Independently verify artifacts in equivalent browser conditions. Two CLI outputs do not establish a general model ranking.

## Discovery and shared instructions

Codex accepts `$cli-web-design-director` skill mentions; Claude Code uses `/cli-web-design-director`. For a controlled experiment, freeze a shared instruction snapshot and explicitly ask both workers to read it, rather than relying on different ambient skills. See [Codex skills](https://learn.chatgpt.com/docs/build-skills) and [Claude Code skills](https://code.claude.com/docs/en/skills), accessed 2026-10-11.

[OpenAI best practices](https://learn.chatgpt.com/guides/best-practices) and [Claude Code best practices](https://code.claude.com/docs/en/best-practices), accessed 2026-10-11, support task context and explicit verification. These sources support the operating approach; the design procedure still requires output review.
