"""Verify both CLI workspaces against the frozen comparison input manifest."""

from hashlib import sha256
import json
from pathlib import Path
import sys


def main() -> int:
    comparison = Path(__file__).resolve().parent
    case = comparison.parents[1] / "round-2"
    manifest = json.loads((comparison / "input-manifest.json").read_text())
    expected = {entry["path"]: entry["sha256"] for entry in manifest["files"]}
    errors = []
    for runner in ("codex", "claude"):
        workspace = case / runner
        for relative, digest in expected.items():
            path = workspace / relative
            if not path.is_file() or path.is_symlink():
                errors.append(f"{runner}: missing or symlinked input {relative}")
            elif sha256(path.read_bytes()).hexdigest() != digest:
                errors.append(f"{runner}: changed input {relative}")
        actual_input = {
            path.relative_to(workspace).as_posix()
            for path in (workspace / "input").rglob("*")
            if path.is_file() and path.name != ".DS_Store"
        }
        expected_input = {path for path in expected if path.startswith("input/")}
        for relative in sorted(actual_input - expected_input):
            errors.append(f"{runner}: extra input {relative}")
    if errors:
        print("FAIL: frozen comparison inputs differ.")
        print("\n".join(errors))
        return 1
    print(f"PASS: {len(expected)} frozen files per workspace match the manifest.")
    print("Input byte equality does not prove equal CLI tools or completed webpage QA.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
