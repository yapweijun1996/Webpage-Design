"""Verify the exact shared round-4 frozen input set without reading worker output."""

import hashlib
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent
WORKSPACES = ROOT.parents[1] / "round-4"
FROZEN_ROOT = {"AGENTS.md", "CLAUDE.md", "TASK.md", "BRIEF.md", "ACCEPTANCE.md", "IMPLEMENTATION-PROMPT.txt", "REVIEW.md"}


def verify():
    manifest = json.loads((ROOT / "input-manifest.json").read_text())
    expected = {item["path"]: item["sha256"] for item in manifest["files"]}
    if not expected:
        raise ValueError("Empty input manifest")
    for name in ("codex", "claude"):
        workspace = WORKSPACES / name
        actual = set(FROZEN_ROOT)
        actual.update(str(path.relative_to(workspace)) for path in (workspace / "input").rglob("*") if path.is_file())
        if actual != set(expected):
            raise ValueError(f"Input file set changed: {name}")
        for relative, digest in expected.items():
            path = workspace / relative
            if path.is_symlink() or hashlib.sha256(path.read_bytes()).hexdigest() != digest:
                raise ValueError(f"Frozen input changed: {name}/{relative}")
        baseline = [item for item in json.loads((ROOT / "starting-conditions.json").read_text())[name]["files"] if item["path"].startswith("baseline/")]
        actual_baseline = {str(path.relative_to(workspace)) for path in (workspace / "baseline").rglob("*") if path.is_file()}
        if not baseline or actual_baseline != {item["path"] for item in baseline}:
            raise ValueError(f"Own baseline file set changed: {name}")
        for item in baseline:
            path = workspace / item["path"]
            if path.is_symlink() or hashlib.sha256(path.read_bytes()).hexdigest() != item["sha256"]:
                raise ValueError(f"Own baseline changed: {name}/{item['path']}")
    return len(expected)


if __name__ == "__main__":
    print(f"PASS: {verify()} identical frozen files per round-4 workspace")
