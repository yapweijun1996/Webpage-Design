"""Verify own-code starting conditions before native launch."""
import hashlib
import json
from check_inputs import ROOT, WORKSPACES

def verify_start():
    data = json.loads((ROOT / "starting-conditions.json").read_text())
    for runner, record in data.items():
        for item in record["files"]:
            path = WORKSPACES / runner / item["path"]
            if path.is_symlink() or hashlib.sha256(path.read_bytes()).hexdigest() != item["sha256"]:
                raise ValueError(f"Starting condition changed: {runner}/{item['path']}")
    return {runner: len(record["files"]) for runner, record in data.items()}

if __name__ == "__main__":
    print("PASS: own-code starting conditions", verify_start())
