"""Run the authorized initial CLI pair and preserve process evidence."""

import datetime as dt
import json
import os
from pathlib import Path
import subprocess
import time


ROOT = Path(__file__).resolve().parent.parent
PROMPT = (
    "Read AGENTS.md and TASK.md. Inspect both reference images, then complete "
    "TASK.md in this workspace."
)
RUNNERS = {
    "codex": [
        "/opt/homebrew/bin/codex", "--ask-for-approval", "never", "exec",
        "--model", "gpt-6.1-sol", "--sandbox", "workspace-write", "--json",
        "--image", "input/handoff/reference/selected-homepage-mockup.png",
        "--output-last-message", "evidence/delivery.md", PROMPT,
    ],
    "claude": [
        "/Users/yapweijun/.local/bin/claude", "--print", "--model",
        "claude-opus-5-5", "--permission-mode", "auto",
        "--permission-prompts", "none", "--output-format", "stream-json",
        "--verbose", PROMPT,
    ],
}


def now():
    return dt.datetime.now(dt.timezone.utc).isoformat()


def save(path, data):
    temporary = path.with_suffix(path.suffix + ".tmp")
    with temporary.open("w") as stream:
        os.chmod(temporary, 0o600)
        json.dump(data, stream, indent=2)
        stream.write("\n")
    temporary.replace(path)


def main():
    check = subprocess.run(
        ["python3", str(ROOT / "comparison" / "check_inputs.py")],
        cwd=ROOT.parent.parent, check=False,
    )
    if check.returncode:
        raise SystemExit(check.returncode)
    active = {}
    for name, args in RUNNERS.items():
        workspace = ROOT / name
        evidence = workspace / "evidence"
        record_path = evidence / "process-run.json"
        if record_path.exists():
            raise SystemExit(f"Refusing to overwrite initial process record: {name}")
        stdout = (evidence / "cli-events.jsonl").open("x")
        stderr = (evidence / "cli-stderr.log").open("x")
        start = time.monotonic()
        record = {
            "round": "initial_delivery", "status": "running",
            "started_at": now(), "command": args, "cwd": str(workspace),
            "effort": "CLI default; inspect exposed session metadata",
            "human_interventions": [], "input_baseline_version": 2,
        }
        process = subprocess.Popen(args, cwd=workspace, stdout=stdout, stderr=stderr)
        record["pid"] = process.pid
        save(record_path, record)
        active[name] = (process, stdout, stderr, start, record, record_path)
        print(json.dumps({"runner": name, "status": "launched", "pid": process.pid}), flush=True)
    while active:
        for name in list(active):
            process, stdout, stderr, start, record, path = active[name]
            result = process.poll()
            if result is None:
                continue
            stdout.close()
            stderr.close()
            record.update(
                status="process_finished", exit_code=result,
                finished_at=now(), elapsed_seconds=round(time.monotonic() - start, 2),
            )
            save(path, record)
            print(json.dumps({"runner": name, "exit_code": result, "elapsed_seconds": record["elapsed_seconds"]}), flush=True)
            del active[name]
        if active:
            time.sleep(1)


if __name__ == "__main__":
    main()
