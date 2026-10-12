"""Verify frozen common inputs, own baselines and preserved historical files."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
COMPANY = ROOT.parents[1]
WORKSPACES = COMPANY / "round-6-animation"

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def verify(start=False):
    manifest = json.loads((ROOT / "input-manifest.json").read_text())
    conditions = json.loads((ROOT / "starting-conditions.json").read_text())
    checked = 0
    for name in ["codex", "claude"]:
        workspace = WORKSPACES / name
        groups = [(workspace / "input", manifest["shared_input_files"]),
                  (workspace, manifest["shared_root_contracts"]),
                  (workspace / "baseline", conditions[name]["own_baseline_files"]),
                  (COMPANY / conditions[name]["source"] / "demo", conditions[name]["source_files"])]
        if start:
            groups.append((workspace / "demo", conditions[name]["starting_demo_files"]))
        for base, files in groups:
            for path, item in files.items():
                assert sha(base / path) == item["sha256"], f"Changed: {base / path}"
                checked += 1
    canonical = COMPANY / "redesign/animation-v1"
    assert sha(canonical / "input-manifest.json") == manifest["canonical_manifest_sha256"]
    for item in json.loads((canonical / "input-manifest.json").read_text())["frozen_reference_inputs"]:
        assert sha(canonical / item["path"]) == item["sha256"], item["path"]
        checked += 1
    return checked

if __name__ == "__main__":
    print(json.dumps({"frozen_input_checks": verify()}))
