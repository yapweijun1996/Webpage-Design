"""Launch the authorized native multi-page comparison with durable owned-process evidence."""

import datetime as dt
import hashlib
import json
import os
from pathlib import Path
import signal
import subprocess
import tempfile
import time

from check_inputs import ROOT, WORKSPACES, verify


COMMANDS = {
    "codex": [
        "/opt/homebrew/bin/codex", "--ask-for-approval", "never", "exec", "--model", "gpt-6.1-sol",
        "--sandbox", "workspace-write", "--json", "--image", "input/handoff/reference/selected-homepage-mockup.png",
        "--image", "input/additional-reference.png", "--output-last-message", "evidence/delivery.md", "-",
    ],
    "claude": [
        "/Users/yapweijun/.local/bin/claude", "--print", "--model", "claude-opus-5-5",
        "--permission-mode", "auto", "--permission-prompts", "none",
        "--output-format", "stream-json", "--verbose",
    ],
}


def now():
    return dt.datetime.now(dt.timezone.utc).isoformat()


def save(path, value):
    fd, temporary = tempfile.mkstemp(prefix=".run-", dir=path.parent)
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


def stop_owned(process):
    if process.poll() is None:
        os.killpg(process.pid, signal.SIGTERM)
        try:
            process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            os.killpg(process.pid, signal.SIGKILL)
            process.wait()


def main():
    count = verify()
    for name in COMMANDS:
        if any((WORKSPACES / name / "evidence" / filename).exists() for filename in ("process-run.json", "cli-events.jsonl", "cli-stderr.log")):
            raise SystemExit(f"Refusing to overwrite execution records: {name}")
    active = {}
    failed = False
    try:
        for name, command in COMMANDS.items():
            workspace = WORKSPACES / name
            evidence = workspace / "evidence"
            stdout = (evidence / "cli-events.jsonl").open("x")
            stderr = (evidence / "cli-stderr.log").open("x")
            os.chmod(stdout.name, 0o600)
            os.chmod(stderr.name, 0o600)
            environment = os.environ.copy()
            environment["AQUATIC_PREVIEW_PORT"] = "4191" if name == "codex" else "4192"
            with (workspace / "IMPLEMENTATION-PROMPT.txt").open("rb") as prompt:
                process = subprocess.Popen(command, cwd=workspace, env=environment, stdin=prompt,
                                           stdout=stdout, stderr=stderr, start_new_session=True)
            record = {"round": "multi_page_rebuild", "status": "running", "started_at": now(),
                      "pid": process.pid, "command": command, "cwd": str(workspace),
                      "frozen_file_count": count,
                      "prompt_sha256": hashlib.sha256((workspace / "IMPLEMENTATION-PROMPT.txt").read_bytes()).hexdigest(),
                      "input_manifest_sha256": hashlib.sha256((ROOT / "input-manifest.json").read_bytes()).hexdigest(),
                      "effort": "CLI default; actual exposed values recorded separately",
                      "operational_environment": {"AQUATIC_PREVIEW_PORT": environment["AQUATIC_PREVIEW_PORT"]},
                      "human_interventions": [{"kind": "identical_initial_brief", "submissions": 1}]}
            path = evidence / "process-run.json"
            save(path, record)
            active[name] = (process, stdout, stderr, time.monotonic(), record, path)
            print(json.dumps({"runner": name, "status": "launched", "pid": process.pid}), flush=True)
        while active:
            for name in list(active):
                process, stdout, stderr, start, record, path = active[name]
                result = process.poll()
                if result is None:
                    continue
                stdout.close()
                stderr.close()
                record.update(status="process_finished", exit_code=result, finished_at=now(),
                              elapsed_seconds=round(time.monotonic() - start, 2))
                save(path, record)
                failed = failed or result != 0
                print(json.dumps({"runner": name, "exit_code": result, "elapsed_seconds": record["elapsed_seconds"]}), flush=True)
                del active[name]
            if active:
                time.sleep(1)
    finally:
        for process, stdout, stderr, start, record, path in active.values():
            stop_owned(process)
            stdout.close()
            stderr.close()
            record.update(status="interrupted", exit_code=process.returncode, finished_at=now(),
                          elapsed_seconds=round(time.monotonic() - start, 2))
            save(path, record)
    raise SystemExit(1 if failed else 0)


if __name__ == "__main__":
    main()
