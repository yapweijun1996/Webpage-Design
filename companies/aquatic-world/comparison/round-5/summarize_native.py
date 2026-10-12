"""Extract whitelisted runtime/model evidence from completed native executions."""
from collections import Counter
import datetime as dt
import json
import os
from pathlib import Path
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parent
WORKSPACES = ROOT.parents[1] / "round-5"


def save(path, value):
    fd, temporary = tempfile.mkstemp(prefix=".metadata-", dir=path.parent)
    try:
        with os.fdopen(fd, "w") as stream:
            json.dump(value, stream, indent=2)
            stream.write("\n")
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(temporary, path)
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)


def records(path):
    result = []
    for line in path.read_text().splitlines():
        try:
            result.append(json.loads(line))
        except ValueError:
            continue
    return result


def main():
    report = {"recorded_at": dt.datetime.now(dt.timezone.utc).isoformat(), "runners": {}}
    environment = {"native_models": {}, "effort_normalization": "None; native defaults retained",
                   "evaluator_browser": {"product": "Google Chrome", "version": "154.0.8037.99", "mode": "headed", "session": "aquatic-round-5"}}
    for runner in ("codex", "claude"):
        evidence = WORKSPACES / runner / "evidence"
        process = json.loads((evidence / "process-run.json").read_text())
        if process["status"] != "process_finished":
            raise SystemExit(f"Wait for the original native {runner} delivery")
        events = records(evidence / "cli-events.jsonl")
        tools, models, seen = Counter(), set(), set()
        final = None
        for event in events:
            if event.get("type") == "item.completed":
                item = event.get("item", {})
                if item.get("type") == "command_execution":
                    tools["command_execution"] += 1
                if item.get("type") == "mcp_tool_call":
                    tools[f"{item.get('server')}.{item.get('tool')}"] += 1
            if event.get("type") == "assistant":
                message = event.get("message", {})
                if message.get("model"):
                    models.add(message["model"])
                for item in message.get("content", []):
                    if item.get("type") == "tool_use" and item.get("id") not in seen:
                        tools[item["name"]] += 1
                        seen.add(item.get("id"))
            if event.get("type") in ("turn.completed", "result"):
                final = {key: event[key] for key in ("type", "subtype", "is_error", "usage", "modelUsage", "total_cost_usd", "duration_ms", "duration_api_ms") if key in event}
        report["runners"][runner] = {key: process.get(key) for key in ("exit_code", "elapsed_seconds", "started_at", "finished_at", "launch_cli_version", "prompt_sha256", "input_manifest_sha256", "starting_conditions_sha256")}
        report["runners"][runner].update(tool_calls=dict(tools), exposed_assistant_models=sorted(models), native_final=final,
                                         primary_revision_interventions=1, evaluator_implementation_repairs=0)
        if runner == "codex":
            thread = next((event.get("thread_id") for event in events if event.get("type") == "thread.started"), None)
            paths = list((Path.home() / ".codex/sessions").rglob(f"*{thread}*.jsonl")) if thread else []
            meta, turns = {}, []
            if len(paths) == 1:
                for event in records(paths[0]):
                    if event.get("type") == "session_meta":
                        meta = event.get("payload", {})
                    if event.get("type") == "turn_context":
                        turns.append(event.get("payload", {}))
            environment["native_models"][runner] = {"requested": "gpt-6.1-sol", "exposed_turn_context_models": sorted({turn["model"] for turn in turns if turn.get("model")}),
                                                      "exposed_efforts": sorted({turn["effort"] for turn in turns if turn.get("effort")}),
                                                      "session_cli_version": meta.get("cli_version"), "launch_cli_version": process["launch_cli_version"],
                                                      "session_metadata_found": len(paths) == 1}
        else:
            init = next((event for event in events if event.get("type") == "system" and event.get("subtype") == "init"), {})
            environment["native_models"][runner] = {"requested": "claude-opus-5-5", "exposed_init_model": init.get("model"),
                                                      "exposed_assistant_models": sorted(models), "exposed_effort": None,
                                                      "launch_cli_version": process["launch_cli_version"], "permission_mode": init.get("permissionMode")}
    report["cost_interpretation"] = "Claude reports a list-price USD estimate, not a verified invoice. Codex exposes token usage but no comparable USD cost. No direct cost winner is asserted."
    environment["runtime_versions"] = {}
    for key, command in [("python", ["python3", "--version"]), ("node", ["node", "--version"]),
                         ("codex_installed_at_inspection", ["/opt/homebrew/bin/codex", "--version"]),
                         ("claude_installed_at_inspection", ["/Users/yapweijun/.local/bin/claude", "--version"]), ("macos", ["sw_vers", "-productVersion"])]:
        environment["runtime_versions"][key] = subprocess.run(command, capture_output=True, text=True, check=True).stdout.strip()
    output = ROOT / "output"
    output.mkdir(exist_ok=True)
    save(output / "native-run-summary.json", report)
    save(output / "environment.json", environment)
    print(json.dumps({"runners": {name: {"exit_code": item["exit_code"], "seconds": item["elapsed_seconds"], "tools": item["tool_calls"]} for name, item in report["runners"].items()}, "models": environment["native_models"]}))


if __name__ == "__main__":
    main()
