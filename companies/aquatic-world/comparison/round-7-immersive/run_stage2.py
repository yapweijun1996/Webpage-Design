"""Run only the two explicitly authorized exact-model native CLIs."""
import datetime as dt
import hashlib
import json
import os
import signal
import subprocess
import tempfile
import time
from check_inputs import ROOT, WORKSPACES, verify

COMMANDS = {
    "codex": ["/opt/homebrew/bin/codex", "--no-daemon", "--ask-for-approval", "never", "exec",
              "--ignore-user-config", "-c", 'model_reasoning_effort="xhigh"',
              "--model", "gpt-6.1-sol", "--sandbox", "workspace-write", "--ephemeral", "--json",
              "--image", "input/reference/desktop-v1.png", "--image", "input/reference/mobile-v1.png",
              "--image", "input-stage2/media/landscape-poster.webp", "--image", "input-stage2/media/portrait-poster.webp",
              "--output-last-message", "evidence/stage-2/delivery.md", "-"],
    "claude": ["/Users/yapweijun/.local/bin/claude", "--print", "--model", "claude-opus-5-5",
               "--restricted", "--tools", "Read,Edit,Write,Bash", "--strict-mcp-config",
               "--mcp-config", "input/mcp-empty.json", "--permission-mode", "auto",
               "--permission-prompts", "none", "--no-session-persistence",
               "--output-format", "stream-json", "--verbose"],
}

def now():
    return dt.datetime.now(dt.timezone.utc).isoformat()

def save(path, value):
    fd, tmp = tempfile.mkstemp(prefix=".owned-run-", dir=path.parent)
    try:
        with os.fdopen(fd, "w") as stream:
            json.dump(value, stream, indent=2)
            stream.write("\n")
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(tmp, path)
    finally:
        if os.path.exists(tmp):
            os.unlink(tmp)

def stop(process):
    if process.poll() is None:
        os.killpg(process.pid, signal.SIGTERM)
        try:
            process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            os.killpg(process.pid, signal.SIGKILL)
            process.wait()

def main():
    checks = verify()
    frozen = json.loads((ROOT / "stage-2-input-manifest.json").read_text())["shared_files"]
    from prepare import inventory
    assert all(inventory(WORKSPACES / name / "input-stage2") == frozen for name in COMMANDS)
    checks["stage2_inputs"] = "verified"
    active = {}
    failed = False
    for name in COMMANDS:
        assert not (WORKSPACES / name / "evidence/stage-2/process-run.json").exists(), "Prior execution exists"
    try:
        for name, command in COMMANDS.items():
            workspace = WORKSPACES / name
            evidence = workspace / "evidence/stage-2"
            stdout = (evidence / "cli-events.jsonl").open("x")
            stderr = (evidence / "cli-stderr.log").open("x")
            os.chmod(stdout.name, 0o600)
            os.chmod(stderr.name, 0o600)
            environment = os.environ.copy()
            environment["AQUATIC_PREVIEW_PORT"] = "4241" if name == "codex" else "4242"
            with (workspace / "input-stage2/PROMPT.txt").open("rb") as prompt:
                process = subprocess.Popen(command, cwd=workspace, env=environment, stdin=prompt,
                                           stdout=stdout, stderr=stderr, start_new_session=True)
            record = {"status": "running", "started_at": now(), "pid": process.pid,
                      "command": command, "cwd": str(workspace), "frozen_checks": checks,
                      "requested_model": "gpt-6.1-sol" if name == "codex" else "claude-opus-5-5",
                      "serving_evidence": "pending", "input_manifest_sha256": hashlib.sha256((ROOT / "stage-2-input-manifest.json").read_bytes()).hexdigest(),
                      "effort": "xhigh (preserved configured setting)" if name == "codex" else "native default; inspect exposed init",
                      "configuration_scope": "per-process only; global settings unchanged",
                      "browser": "worker not authorized; primary-agent CUA actual-site checks follow",
                      "explicit_other_models": False, "user_acceptance": "pending"}
            path = evidence / "process-run.json"
            save(path, record)
            active[name] = (process, stdout, stderr, time.monotonic(), record, path)
            print(json.dumps({"runner": name, "status": "launched", "pid": process.pid}), flush=True)
        while active:
            for name in list(active):
                process, stdout, stderr, start, record, path = active[name]
                if name == "claude" and record["serving_evidence"] == "pending":
                    for line in (path.parent / "cli-events.jsonl").read_text().splitlines():
                        try:
                            event = json.loads(line)
                        except ValueError:
                            continue
                        if event.get("type") == "system" and event.get("subtype") == "init":
                            actual = event.get("model")
                            record["serving_evidence"] = {"exposed_model": actual, "tools": event.get("tools"), "mcp_servers": event.get("mcp_servers"), "permissionMode": event.get("permissionMode")}
                            if actual != record["requested_model"] or event.get("mcp_servers"):
                                record["abort_reason"] = "Exact model mismatch or unexpected MCP access"
                                stop(process)
                            save(path, record)
                            print(json.dumps({"runner": name, "exposed_model": actual}), flush=True)
                            break
                result = process.poll()
                if result is None:
                    continue
                stdout.close()
                stderr.close()
                record.update(status="process_finished", exit_code=result, finished_at=now(), elapsed_seconds=round(time.monotonic() - start, 2))
                save(path, record)
                failed = failed or result != 0
                print(json.dumps({"runner": name, "exit_code": result, "elapsed_seconds": record["elapsed_seconds"]}), flush=True)
                del active[name]
            if active:
                time.sleep(1)
    finally:
        for process, stdout, stderr, start, record, path in active.values():
            stop(process)
            stdout.close()
            stderr.close()
            record.update(status="interrupted", exit_code=process.returncode, finished_at=now())
            save(path, record)
    raise SystemExit(1 if failed else 0)

if __name__ == "__main__":
    main()
