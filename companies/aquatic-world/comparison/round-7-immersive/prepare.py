"""Prepare independent, equal-input immersive Home workspaces without launching."""
from pathlib import Path
import hashlib
import json
import shutil

ROOT = Path(__file__).resolve().parent
COMPANY = ROOT.parents[1]
WORKSPACES = COMPANY / 'round-7-immersive'
DESIGN = COMPANY / 'redesign/immersive-home-v1'
SKILL = Path('/Users/yapweijun/.codex/skills/cli-web-design-director')
CONTRACTS = ['AGENTS.md', 'CLAUDE.md', 'TASK.md', 'ACCEPTANCE.md', 'IMPLEMENTATION-PROMPT.txt']

RULES = '''# Independent Immersive Home Workspace

- Current TASK.md authorizes this staged implementation. Historical design-only language is superseded for the website implementation, not for paid generation.
- Write only demo/, evidence/ and root README.md. Preserve input/, baseline/ and all other root contracts byte-for-byte.
- Read input/immersive-home/ and the frozen input/skills/cli-web-design-director/ skill. Inspect the supplied UI concepts, clean frames and your own baseline before editing.
- Read no sibling implementation, prior workspace, coordinator report or evaluator script. Use no other model, agent, delegate or advisor. No MCP, provider, external service, network download or media generation.
- No dependency, credential, configuration or permission changes. No Git, commit, push, PR, deployment, upload or enquiry. The coordinator owns publication.
- Code and copy stay English. Preserve the fictional-demo limitations and honest local Contact preview.
- Browser self-review is unavailable in this restricted run. No terminal browser automation, Playwright/CDP, AppleScript or OS automation. Record unavailable rendered checks honestly; the coordinator uses the same CUA browser for both sites.
- Use existing build tools. Do not start a server; the coordinator owns previews. Never stop unrelated processes.
- Write a design/state plan before changes, then implement, build and self-review now. Missing videos remain not tested, never replaced by static particles or a generated still film.
'''

PROMPT = '''Complete Stage 1 of the authorized Aquatic World immersive Home website implementation in this independent workspace.
Read AGENTS.md, TASK.md, ACCEPTANCE.md, input/immersive-home/STAGE.md, BRIEF.md and COMPARISON.md. The latest user goal authorizes completing and publishing the website; earlier design-only notes are historical. Video spending remains pending and is not part of your task.
Read the frozen input/skills/cli-web-design-director skill and relevant design/prompt references. Inspect input/reference/desktop-v1.png, mobile-v1.png and input/media/landscape-generation-frame.png, portrait-generation-frame.png with available image-reading tools; do not merely read their paths. Inspect your own baseline/demo.
Write evidence/design-plan.md, then implement the full continuous Home composition and video/fallback controller within demo/ using exact copy, shared fonts, safe media choice and own supplied posters. Future MP4 filenames are fixed by STAGE.md and are intentionally missing. Preserve all eight independent routes, the seven inner pages/404, existing category context and four-group Contact validation/local preview/Edit/Clear. Scope typography/header changes to Home.
No framed media, split opaque columns, rasterized UI, giant Play overlay, timeline, new particles or white Home bands. Top bar, title and one gold CTA belong inside the full-page water environment. Use real page links, no Home section anchors for global navigation.
Build with existing tools, inspect meaningful source/output invariants, save self-review and actual preview commands in README.md. No other agent/model/MCP/API/service/browser shell scripts, new dependency/configuration/permission, Git/publication or outside writes. Do not claim motion passes without the pending clips. Both workers receive identical inputs; the coordinator will supply the same reviewed films in Stage 2 and verify rendered behavior. Finish the bounded Stage 1 implementation now.
'''


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def inventory(directory):
    return {p.relative_to(directory).as_posix(): {'bytes': p.stat().st_size, 'sha256': sha(p)}
            for p in sorted(directory.rglob('*')) if p.is_file()
            and not any(x in {'node_modules', '__pycache__', '.git'} for x in p.parts)}


def main():
    if WORKSPACES.exists() or (ROOT / 'input-manifest.json').exists():
        raise SystemExit('Prepared workspaces already exist; refusing replacement')
    baseline = COMPANY / 'round-6-animation'
    history = inventory(baseline)
    starting = {}
    for model in ['codex', 'claude']:
        workspace = WORKSPACES / model
        workspace.mkdir(parents=True)
        (workspace / 'evidence').mkdir()
        shutil.copytree(baseline / model / 'demo', workspace / 'demo',
                        ignore=shutil.ignore_patterns('node_modules', '__pycache__', 'public', 'dist'))
        shutil.copytree(baseline / model / 'demo', workspace / 'baseline/demo',
                        ignore=shutil.ignore_patterns('node_modules', '__pycache__', 'public', 'dist'))
        shared = workspace / 'input'
        (shared / 'immersive-home').mkdir(parents=True)
        (shared / 'reference').mkdir()
        (shared / 'media').mkdir()
        for name in ['BRIEF.md', 'COMPARISON.md']:
            shutil.copyfile(DESIGN / name, shared / 'immersive-home' / name)
        shutil.copyfile(ROOT / 'STAGE.md', shared / 'immersive-home/STAGE.md')
        for name in ['desktop-v1.png', 'mobile-v1.png']:
            shutil.copyfile(DESIGN / 'visuals' / name, shared / 'reference' / name)
        for name in ['landscape-generation-frame.png', 'portrait-generation-frame.png',
                     'landscape-poster.webp', 'portrait-poster.webp', 'poster-manifest.json']:
            shutil.copyfile(DESIGN / 'media' / name, shared / 'media' / name)
        shutil.copytree(SKILL, shared / 'skills/cli-web-design-director',
                        ignore=shutil.ignore_patterns('__pycache__'))
        (shared / 'mcp-empty.json').write_text('{"mcpServers":{}}\n')
        (workspace / 'AGENTS.md').write_text(RULES)
        (workspace / 'CLAUDE.md').write_text(RULES)
        (workspace / 'TASK.md').write_text((ROOT / 'STAGE.md').read_text())
        (workspace / 'ACCEPTANCE.md').write_text('Stage 1: source/build and posterior layout only. Actual film checks remain not run. Final acceptance is input/immersive-home/COMPARISON.md; input/immersive-home/STAGE.md owns the current execution phase.\n')
        (workspace / 'IMPLEMENTATION-PROMPT.txt').write_text(PROMPT)
        (workspace / 'README.md').write_text('# Aquatic World — Immersive Home\n\nStatus: own baseline copy prepared for Stage 1; films and public delivery pending.\n')
        assert inventory(workspace / 'demo') == inventory(workspace / 'baseline/demo')
        starting[model] = {'source': f'round-6-animation/{model}/demo',
                           'baseline_files': inventory(workspace / 'baseline'),
                           'starting_demo_files': inventory(workspace / 'demo')}
    common = inventory(WORKSPACES / 'codex/input')
    assert common == inventory(WORKSPACES / 'claude/input')
    contracts = {n: sha(WORKSPACES / 'codex' / n) for n in CONTRACTS}
    assert all(sha(WORKSPACES / 'claude' / n) == h for n, h in contracts.items())
    (ROOT / 'input-manifest.json').write_text(json.dumps({'stage': 1, 'prepared_on': '2026-10-12',
        'shared_input_files': common, 'shared_root_contracts': contracts,
        'video_readiness': 'pending paid authorization; no final video comparison',
        'user_acceptance': 'open'}, indent=2) + '\n')
    (ROOT / 'starting-conditions.json').write_text(json.dumps(starting, indent=2) + '\n')
    (ROOT / 'preserved-history.json').write_text(json.dumps(history, indent=2) + '\n')
    print(json.dumps({'prepared': True, 'stage': 1, 'common_inputs': len(common)}))


if __name__ == '__main__':
    main()
