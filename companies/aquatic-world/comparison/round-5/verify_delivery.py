"""Record and verify initial deliveries without changing contestant output."""

import argparse
import datetime as dt
import hashlib
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent
IGNORED = {"node_modules", ".playwright-cli", "__pycache__", ".DS_Store"}


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def files(workspace):
    selected = [workspace / "README.md"]
    for folder in ("demo", "evidence"):
        selected.extend(p for p in (workspace / folder).rglob("*") if p.is_file())
    return sorted(p for p in selected if not IGNORED.intersection(p.relative_to(workspace).parts))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("mode", choices=["capture", "check"])
    parser.add_argument("runner", choices=["codex", "claude"])
    args = parser.parse_args()
    workspace = ROOT.parents[1] / "round-5" / args.runner
    manifest = ROOT / "deliveries" / (args.runner + ".json")
    if args.mode == "capture":
        process = json.loads((workspace / "evidence/process-run.json").read_text())
        if process["status"] != "process_finished":
            raise SystemExit("The native process has not finished.")
        record = {
            "captured_at": dt.datetime.now(dt.timezone.utc).isoformat(),
            "excluded_local_caches": sorted(IGNORED),
            "files": {str(p.relative_to(workspace)): {"bytes": p.stat().st_size, "sha256": digest(p)} for p in files(workspace)},
        }
        manifest.parent.mkdir(exist_ok=True)
        with manifest.open("x") as stream:
            json.dump(record, stream, indent=2)
            stream.write("\n")
        print(f"Captured {args.runner}: {len(record['files'])} round-5 delivery files.")
    else:
        record = json.loads(manifest.read_text())
        current = {str(p.relative_to(workspace)) for p in files(workspace)}
        failures = [name for name, item in record["files"].items() if not (workspace / name).is_file() or digest(workspace / name) != item["sha256"]]
        failures.extend(sorted(current - record["files"].keys()))
        if failures:
            raise SystemExit("Delivery changed: " + ", ".join(failures))
        print(f"PASS: {args.runner} round-5 delivery is unchanged ({len(current)} files).")


if __name__ == "__main__":
    main()
