"""Verify shared inputs, own baselines and historical round-7 preservation."""
import json
from prepare import ROOT, COMPANY, WORKSPACES, inventory, sha


def verify(start=False):
    manifest = json.loads((ROOT / "input-manifest.json").read_text())
    initial = json.loads((ROOT / "starting-conditions.json").read_text())
    assert inventory(COMPANY / "round-7-immersive") == json.loads((ROOT / "preserved-history.json").read_text()), "Historical round-7 changed"
    for name in ("codex", "claude"):
        workspace = WORKSPACES / name
        assert inventory(workspace / "input") == manifest["shared_input_files"], f"{name}: input changed"
        assert inventory(workspace / "baseline") == initial[name]["baseline_files"], f"{name}: baseline changed"
        assert all(sha(workspace / file) == value for file, value in manifest["shared_root_contracts"].items()), f"{name}: contract changed"
        if start:
            assert inventory(workspace / "demo") == initial[name]["starting_demo_files"], f"{name}: premature demo change"
        for file in ("landscape.mp4", "portrait.mp4", "landscape-poster.webp", "portrait-poster.webp"):
            assert sha(workspace / "demo/assets/immersive" / file) == sha(workspace / "input/media" / file), f"{name}: media changed"
    return {"shared_inputs": "equal and unchanged", "own_baselines": "unchanged", "round7": "unchanged", "runtime_media": "unchanged", "initial_source_check": start}


if __name__ == "__main__":
    print(json.dumps(verify()))
