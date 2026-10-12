"""Run the authorized bounded native interpretation trials with owned processes."""

import datetime as dt
import hashlib
import json
import os
from pathlib import Path
import signal
import subprocess
import time


ROOT = Path(__file__).resolve().parent
COMMANDS = {
    "codex": [
        "/opt/homebrew/bin/codex", "--ask-for-approval", "never", "exec",
        "--model", "gpt-6.1-sol", "--sandbox", "read-only", "--json",
        "--output-last-message", "evidence/response.json", "-",
    ],
    "claude": [
        "/Users/yapweijun/.local/bin/claude", "--print", "--model", "claude-opus-5-5",
        "--tools", "Read", "--permission-mode", "auto", "--permission-prompts", "none",
        "--output-format", "stream-json", "--verbose",
    ],
}


def now():
    return dt.datetime.now(dt.timezone.utc).isoformat()


def save(path, record):
    temporary = path.with_suffix(".tmp")
    with temporary.open("w") as stream:
        os.chmod(temporary, 0o600)
        json.dump(record, stream, indent=2)
        stream.write("\n")
    temporary.replace(path)


def stop_owned(process):
    if process.poll() is None:
        os.killpg(process.pid, signal.SIGTERM)
        try:
            process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            os.killpg(process.pid, signal.SIGKILL)
            process.wait()


def main():
    manifest = json.loads((ROOT / "input-manifest.json").read_text())
    for name in COMMANDS:
        for relative, expected in manifest.items():
            actual = hashlib.sha256((ROOT / name / "input" / relative).read_bytes()).hexdigest()
            if actual != expected:
                raise SystemExit(f"Shared input changed: {name}/{relative}")
        if (ROOT / name / "evidence/process-run.json").exists():
            raise SystemExit(f"Refusing to overwrite prior trial: {name}")

    active = {}
    failed = False
    try:
        for name, command in COMMANDS.items():
            workspace = ROOT / name
            evidence = workspace / "evidence"
            stdout = (evidence / "cli-events.jsonl").open("x")
            stderr = (evidence / "cli-stderr.log").open("x")
            os.chmod(stdout.name, 0o600)
            os.chmod(stderr.name, 0o600)
            with (ROOT / "PROMPT.txt").open("rb") as prompt:
                process = subprocess.Popen(command, cwd=workspace, stdin=prompt,
                                           stdout=stdout, stderr=stderr, start_new_session=True)
            record = {"status": "running", "started_at": now(), "pid": process.pid,
                      "command": command, "cwd": str(workspace), "timeout_seconds": 300,
                      "prompt_sha256": hashlib.sha256((ROOT / "PROMPT.txt").read_bytes()).hexdigest(),
                      "effort": "CLI default; no cross-provider equivalence assumed"}
            path = evidence / "process-run.json"
            save(path, record)
            active[name] = (process, stdout, stderr, time.monotonic(), record, path)
            print(json.dumps({"runner": name, "status": "launched", "pid": process.pid}), flush=True)
        while active:
            for name in list(active):
                process, stdout, stderr, start, record, path = active[name]
                timed_out = time.monotonic() - start > 300 and process.poll() is None
                if timed_out:
                    stop_owned(process)
                result = process.poll()
                if result is None:
                    continue
                stdout.close()
                stderr.close()
                record.update(status="timed_out" if timed_out else "process_finished", exit_code=result,
                              finished_at=now(), elapsed_seconds=round(time.monotonic() - start, 2))
                save(path, record)
                failed = failed or result != 0 or timed_out
                print(json.dumps({"runner": name, "status": record["status"], "exit_code": result}), flush=True)
                del active[name]
            if active:
                time.sleep(1)
    finally:
        for process, stdout, stderr, start, record, path in active.values():
            stop_owned(process)
            stdout.close()
            stderr.close()
            record.update(status="interrupted", exit_code=process.returncode,
                          finished_at=now(), elapsed_seconds=round(time.monotonic() - start, 2))
            save(path, record)
    raise SystemExit(1 if failed else 0)


if __name__ == "__main__":
    main()
