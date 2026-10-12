"""Verify actual frozen inputs, worker baselines and the preserved prior delivery."""
import json
from prepare import ROOT, COMPANY, WORKSPACES, inventory, sha


def verify(start=False):
    manifest = json.loads((ROOT / 'input-manifest.json').read_text())
    starting = json.loads((ROOT / 'starting-conditions.json').read_text())
    assert inventory(COMPANY / 'round-6-animation') == json.loads((ROOT / 'preserved-history.json').read_text()), 'Historical delivery changed'
    for model in ['codex', 'claude']:
        workspace = WORKSPACES / model
        assert inventory(workspace / 'input') == manifest['shared_input_files'], f'{model} input changed'
        assert inventory(workspace / 'baseline') == starting[model]['baseline_files'], f'{model} baseline changed'
        assert all(sha(workspace / n) == h for n, h in manifest['shared_root_contracts'].items()), f'{model} root contract changed'
        if start:
            assert inventory(workspace / 'demo') == starting[model]['starting_demo_files'], f'{model} demo changed before run'
    return {'frozen_inputs': 'verified', 'historical_delivery': 'unchanged', 'initial_sources': start}


if __name__ == '__main__':
    print(json.dumps(verify()))
