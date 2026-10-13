"""Freeze equal design inputs and independent own-code round-8 baselines."""
from pathlib import Path
import hashlib
import json
import shutil

ROOT = Path(__file__).resolve().parent
COMPANY = ROOT.parents[1]
WORKSPACES = COMPANY / "round-9-refinement"
DESIGN = COMPANY / "redesign/fusion-home-v2"
MEDIA = COMPANY / "redesign/immersive-home-v1/media/runtime"
CONTRACTS = ("AGENTS.md", "CLAUDE.md", "TASK.md", "IMPLEMENTATION-PROMPT.txt")

RULES = """# Independent Fusion Home Refinement Workspace

- The current user authorized implementation, comparison and coordinator publication. TASK.md supersedes historical design-only wording in frozen inputs.
- Write only demo/, evidence/ and this workspace README.md. Preserve input/, baseline/ and all root contracts unchanged.
- Read the identical v2 brief, acceptance, native reference notes and design skill. Inspect all six native JPEGs and both posters. Use only your own baseline source. Never inspect sibling implementation source or coordinator evaluator scripts.
- No additional model/agent, MCP, API, network, new dependencies, paid media generation, media editing, credential/configuration changes, Git, server, upload or publication. Coordinator owns browser testing and GitHub Pages delivery.
- Preserve all eight independent routes plus 404, inner-page presentation, category context and local-only Contact preview/Edit/Clear. All code and copy remain English.
- Preserve exact film/poster bytes, selection/crops, fallback and manual-pause policies. Scope visual refinement to Home.
- No browser automation is available to workers: no shell browser/CDP/Playwright, AppleScript or OS automation. Source checks are not rendered verification. Coordinator supplies equal CUA browser acceptance.
- Do not write outside this workspace, including /tmp, or stop any process. Use existing build tools.
- Write evidence/layout-plan.md before changes, then implement and run bounded meaningful checks in this run. Save evidence/self-review.md and actual build/preview instructions in README.md.
"""

TASK = """# Authorized Implementation — Fusion Home v2

Implement the supplied refinement now. The user explicitly requested both CLIs apply the same brief, commit/merge/push and deliver a polished GitHub Pages demo. Publication remains coordinator-owned. Prior design-only/future-authorization statements in input/refinement/ are historical and superseded by this task.

Authority: current workspace contracts and this task, then input/refinement/BRIEF.md and ACCEPTANCE.md, reference notes and native images. Each candidate starts from its OWN final round-8 source; immutable baseline/demo is supplied. Read all six reference JPEGs and both input/media/*-poster.webp images. Reference screenshots from both candidates are shared design evidence; sibling product source remains forbidden. Links out of frozen documents are provenance, not permission to read other workspaces.

Make the actual full Home header/control row opaque #041D25 by 24px scroll and while Menu is open; include enlarged/wrapped live header height. Preserve transparent arrival only at top with Menu closed. Correct reload/history restored state, no layout/focus/movie changes from scrolling. No-JS always-protected Home header is acceptable. Keep all nonmodal menu interactions, anchors, short-window internal scrolling and manual Pause intent.

At normal 844x390 and 667x375 show exact full offer and CTA with at least16px below its clickable rect inside the bottom safe area. Use compact header and spacing first, then natural heading30–40px, body/CTA>=16px and targets>=44px. Keep left-copy/right-fish and media crops. Allow readable vertical scrolling under text enlargement; no clipping, text suppression or overflow hiding.

Preserve successful portrait/desktop composition, exact copy, near-square behavior, aspect-only (min-aspect-ratio:6/5) selection, landscape50%50% and portrait50%30% cover, no automatic film on reduced-motion/data-saving, explicit opt-in, hidden-tab/menu suspension, manual Pause session intent and no-JS destinations. Eight routes, inner-page visuals and four-group local Contact journey must remain. Film remains the entire Home environment through footer, without player framing.

Use supplied acceptance for relevant available checks and be honest about browser/device gaps. Finish implementation and build in this run. Coordinator owns actual rendered acceptance and matched corrections if needed.
"""

PROMPT = """Implement the authorized Aquatic World Fusion Home v2 refinement now. Read AGENTS.md, TASK.md, input/refinement/BRIEF.md, ACCEPTANCE.md, references/README.md and input/skills/cli-web-design-director/SKILL.md plus references/design-review.md. Inspect all six input/refinement/references/*.jpg native images and both input/media/*-poster.webp images through image reading. Read only your own baseline/demo source.
Write evidence/layout-plan.md before edits, then complete the common scope: opaque #041D25 actual full header row by24px scroll and open menu, correct restore/top states; full normal short-landscape offer/CTA at844x390 and667x375 with16px lower clearance. Preserve live enlarged header/menu behavior, successful portrait and desktop, all exact media/policy and routes/inner presentation. No sibling source, additional agent/model, network, media generation, outside writes, browser shell automation, server or Git. Build with existing tools, run meaningful checks, record evidence/self-review.md and evidence/delivery.md with actual limits, and update README preview instructions. Coordinator independently reviews real rendered output and publishes. Complete the authorized implementation in this run.
"""


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def inventory(directory):
    return {p.relative_to(directory).as_posix(): {"bytes": p.stat().st_size, "sha256": sha(p)}
            for p in sorted(directory.rglob("*")) if p.is_file()
            and not any(part in {"node_modules", "__pycache__", ".git"} for part in p.parts)}


def main():
    if WORKSPACES.exists() or (ROOT / "input-manifest.json").exists():
        raise SystemExit("Prepared workspaces already exist; refusing replacement")
    history = inventory(COMPANY / "round-8-fusion")
    starting = {}
    for name in ("codex", "claude"):
        workspace = WORKSPACES / name
        workspace.mkdir(parents=True)
        (workspace / "evidence").mkdir()
        for destination in (workspace / "demo", workspace / "baseline/demo"):
            shutil.copytree(COMPANY / "round-8-fusion" / name / "demo", destination,
                            ignore=shutil.ignore_patterns("public", "dist", "node_modules", "__pycache__"))
        packet = workspace / "input"
        (packet / "media").mkdir(parents=True)
        shutil.copytree(DESIGN, packet / "refinement")
        for filename in ("landscape.mp4", "portrait.mp4", "landscape-poster.webp", "portrait-poster.webp", "manifest.json"):
            shutil.copyfile(MEDIA / filename, packet / "media" / filename)
        shutil.copytree(Path('/Users/yapweijun/.codex/skills/cli-web-design-director'),
                        packet / "skills/cli-web-design-director", ignore=shutil.ignore_patterns("__pycache__"))
        (packet / "mcp-empty.json").write_text('{"mcpServers":{}}\n')
        for filename, content in {"AGENTS.md": RULES, "CLAUDE.md": RULES, "TASK.md": TASK,
                                  "IMPLEMENTATION-PROMPT.txt": PROMPT}.items():
            (workspace / filename).write_text(content)
        (workspace / "README.md").write_text("# Aquatic World — Fusion Home\n\nStatus: own round-8 baseline prepared; implementation and browser review pending.\n")
        assert inventory(workspace / "demo") == inventory(workspace / "baseline/demo")
        starting[name] = {"source": f"round-8-fusion/{name}/demo",
                          "baseline_files": inventory(workspace / "baseline"),
                          "starting_demo_files": inventory(workspace / "demo")}
    shared = inventory(WORKSPACES / "codex/input")
    assert shared == inventory(WORKSPACES / "claude/input")
    contracts = {name: sha(WORKSPACES / "codex" / name) for name in CONTRACTS}
    assert all(sha(WORKSPACES / "claude" / name) == value for name, value in contracts.items())
    (ROOT / "input-manifest.json").write_text(json.dumps({"prepared_on": "2026-10-13",
        "shared_input_files": shared, "shared_root_contracts": contracts,
        "user_acceptance": "open", "media_generation": "none; current byte-identical media"}, indent=2) + "\n")
    (ROOT / "starting-conditions.json").write_text(json.dumps(starting, indent=2) + "\n")
    (ROOT / "preserved-history.json").write_text(json.dumps(history, indent=2) + "\n")
    print(json.dumps({"prepared": True, "equal_inputs": len(shared), "workspaces": 2}))


if __name__ == "__main__":
    main()
