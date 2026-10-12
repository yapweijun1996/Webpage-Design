# Controlled Homepage Animation — Native CLI Comparison

The current request authorizes two native CLI implementations of the selected original-image, water-light and ten-particle enhancement. Each worker starts from an independent byte-identical copy of its own round-5 code. The historical video preparation at `../round-6/` remains separate and unchanged.

## Protocol

- Exact models: Codex `gpt-6.1-sol`; Claude `claude-opus-5-5`. No fallback or additional model/agent is authorized.
- Both receive the same frozen source image, reference implementation, desktop/phone captures, design skill and root task/acceptance/prompt files. Their own baselines intentionally differ.
- Workers may modify only their own `demo/`, `evidence/` and README. They may not inspect siblings or historical implementations.
- Native workers perform local code/build/static checks. The coordinator performs the same real-browser CUA evaluation on both actual sites. Historical standalone-study checks do not establish acceptance of these sites.
- Scope is Home only; preserve eight real pages, 404, header/navigation and four-group Contact with prefill, validation, preview, edit and clear.
- No dependencies, paid media generation, service/API integration, uploads, publication, credentials/global-permission changes or Git delivery.

## Recorded execution differences

Codex 0.162.1 receives five image attachments with the prompt, explicit `xhigh` reasoning (preserving the existing configured setting), a workspace-write sandbox and ephemeral mode. Its per-process user configuration is ignored to remove configured MCP services. This does not prove a filesystem boundary against every outside read; scope restrictions are also explicit instructions.

Claude Code 2.1.289 runs restricted with only Read/Edit/Write/Bash, an empty strict MCP configuration, auto permission review with unattended prompts denied, no session persistence, and its native default effort. Image inspection occurs through its local Read tool. Its actual initialization must expose `claude-opus-5-5` and no MCP services. No permission bypass is used. Vendor internal implementation details are not observable.

This compares each model with its recorded CLI environment; equal inputs do not isolate model capability. Builds, functional gates, evaluator visual judgment and user acceptance are recorded separately. User acceptance remains pending.

## Files and commands

`prepare.py` created the independent workspaces and manifests; it refuses to overwrite them. `check_inputs.py` verifies frozen inputs and baselines. `run_pair.py` owns the two process groups, private raw logs and atomic execution records. Do not run the launch script again over existing evidence.

From the repository root:

```sh
python3 -B companies/aquatic-world/comparison/round-6-animation/check_inputs.py
```

Codex build/preview:

```sh
cd companies/aquatic-world/round-6-animation/codex
python3 -B demo/build.py
AQUATIC_PREVIEW_PORT=4231 python3 -B demo/serve.py
```

Claude build/preview:

```sh
cd companies/aquatic-world/round-6-animation/claude/demo
npm run build
AQUATIC_PREVIEW_PORT=4232 npm run serve
```

Actual sites: [Codex](http://127.0.0.1:4231/) and [Claude](http://127.0.0.1:4232/). Both native runs completed. Open the [comparison viewer](preview.html), [results](RESULTS.md), [method/limits](METHODOLOGY.md), [independent delivery checks](evidence/delivery-checks.json) and [actual browser acceptance](evidence/browser-acceptance.json). User acceptance remains pending.

`verify_delivery.py` checks fresh builds, owned output/HTTP and pinned history. `verify_browser.py` validates the durable CUA observations and native screenshot dimensions; it does not automate a browser.
