"""Freeze equal design inputs and independent own-code round-7 baselines."""
from pathlib import Path
import hashlib
import json
import shutil

ROOT = Path(__file__).resolve().parent
COMPANY = ROOT.parents[1]
WORKSPACES = COMPANY / "round-8-fusion"
DESIGN = COMPANY / "redesign/fusion-home-v1"
MEDIA = COMPANY / "redesign/immersive-home-v1/media/runtime"
CONTRACTS = ("AGENTS.md", "CLAUDE.md", "TASK.md", "IMPLEMENTATION-PROMPT.txt")

RULES = """# Independent Fusion Home Workspace

- TASK.md authorizes implementing the supplied fusion Home now. Earlier design-only notes are historical; no paid media generation is authorized.
- Write only demo/, evidence/ and this workspace's root README.md. Preserve input/, baseline/ and all other root contracts byte-for-byte.
- Read the common frozen brief, review requirements, concept notes and design skill. Inspect all three supplied PNG concepts and the two clean posters. Raster geometry is illustrative; the brief owns precise dimensions and behavior.
- Use only your own baseline code. Do not read another implementation, prior workspace, coordinator report or evaluator script. Shared reference images are allowed; sibling source is not. No other agent/model/advisor, MCP, API, network service, media generation or media repair.
- No new dependency, credential, configuration, permission or Git changes. No commit, push, PR, server, deployment, upload or enquiry. Coordinator owns browser verification and publication.
- Code and copy stay English. Preserve eight real content routes plus 404, unchanged inner-page content/styles, category context and four-group local-only Contact behavior.
- Scope the fusion typography and navigation presentation to Home. Retain existing video selection/crops and all fallback/manual-pause policies. Inner pages do not load Home film.
- Browser self-review is unavailable in this restricted run. No shell browser/CDP/Playwright, AppleScript or OS automation. Do not claim rendered checks from source stubs; the coordinator uses the same real CUA browser for both.
- Do not write outside this workspace, including /tmp. Never stop unrelated processes. Use existing build tools.
- Write evidence/design-plan.md before changes, then implement, build and run meaningful bounded checks in this same run. Save evidence/self-review.md and actual preview instructions in README.md.
"""

TASK = """# Current Implementation Task

The user selected implementation: both native CLIs use the same fusion brief and static concepts, then compare actual desktop and phone behavior. Implement now; design-only and future-authorization wording in the frozen design documents describes the prior phase and is superseded by this task.

Authority order: these workspace contracts and current task; input/design/BRIEF.md; input/design/REVIEW.md; concept notes; raster images. Preserve the own-code baseline and exact common runtime media. The generated open-menu concept's shorter panel and approximately 15px copy drift are not implementation targets. At 390x844 use the brief's 360–380px panel target, approximately 56px rows and unchanged hero anchors when opening. Make a nonmodal top disclosure, not a centered modal.

Current orientation is `(min-aspect-ratio: 6/5)` at every width. Landscape cover 50% 50%, portrait cover 50% 30%. Near-square range `(4/5 <= aspect-ratio < 6/5)` places copy below roughly 70svh with normal scrolling. The older media manifest's 900px width guard is historical. Compact navigation starts below1120px and must fit its actual brand/labels.

Preserve silent full-Home film through chapters/footer; manual pause session retention, reduced-motion/data-saving poster defaults without automatic film download, explicit opt-in, menu/tab suspension and useful no-JS navigation. Opening Menu hides the motion utility and closing restores the correct prior state. The hero, CTA and page scroll position never move just because Menu opens. On short windows retain a visible Close control and scrollable links. No modal semantics, focus trap or background scroll lock; close on Escape with focus return, outside interaction and focus leaving the header. Global links remain page destinations.

Frozen document links refer to original provenance locations; use the named local input files instead of following links outside this workspace. Real interface text and controls must be implemented; raster concepts are never runtime media. All exact supplied media bytes stay unchanged. No publication or new generation by workers. Coordinator will build equivalent previews, review and perform authorized Git delivery.
"""

PROMPT = """Implement the authorized Aquatic World fusion Home revision in this independent workspace now.
Read AGENTS.md, TASK.md, input/design/BRIEF.md, REVIEW.md and CONCEPT-NOTES.md, and input/skills/cli-web-design-director/SKILL.md plus references/design-review.md. Inspect all three input/reference PNGs and both input/media posters through available image reading; do not merely name the paths. Inspect your own baseline/demo source only.
Write evidence/design-plan.md, then revise demo/ to the common brief. Use stronger32px desktop brand, regular16px navigation and compact72px heading; on390px use readable18px brand, outlined Menu,39–40px heading and one52px gold CTA. Keep the initial offer/action visible on320/360/390px phones. Adopt a top-anchored nonmodal disclosure with five roughly56px rows and fixed Menu/Close anchor; no ghosted copy, centered fixed panel, modal roles, focus trap or scroll lock. Opening at390x844 ends above the unchanged arrival copy. Retain short-window link scrolling, Escape/focus return and proper movie intent. Do not copy generated raster geometry drift.
Preserve eight independent pages plus404, inner-page content/theme, category enquiry context and Contact validation/local preview/Edit/Clear. No enquiry sends. Preserve supplied films/posters byte-for-byte, exact orientation/crop policy and all current fallback/manual-stop behavior. Change only relevant Home source/controller wiring and build outputs; no new decoration, particles, playback effects, dependencies or business claims.
Build using existing tools. Verify source/output contracts and meaningful interaction/controller scenarios without a real browser, record what actually ran and unrun checks, and finish README.md with preview commands and current limits. Use no sibling code, other agent/model, MCP/API, network, browser shell scripts, outside writes, server or Git. Coordinator owns rendered acceptance and publication. Finish implementation in this run.
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
    history = inventory(COMPANY / "round-7-immersive")
    starting = {}
    for name in ("codex", "claude"):
        workspace = WORKSPACES / name
        workspace.mkdir(parents=True)
        (workspace / "evidence").mkdir()
        for destination in (workspace / "demo", workspace / "baseline/demo"):
            shutil.copytree(COMPANY / "round-7-immersive" / name / "demo", destination,
                            ignore=shutil.ignore_patterns("public", "dist", "node_modules", "__pycache__"))
        packet = workspace / "input"
        for directory in ("design", "reference", "media"):
            (packet / directory).mkdir(parents=True)
        for filename in ("BRIEF.md", "REVIEW.md"):
            shutil.copyfile(DESIGN / filename, packet / "design" / filename)
        shutil.copyfile(DESIGN / "visuals/README.md", packet / "design/CONCEPT-NOTES.md")
        for filename in ("desktop-v1.png", "mobile-v1.png", "mobile-menu-v1.png"):
            shutil.copyfile(DESIGN / "visuals" / filename, packet / "reference" / filename)
        for filename in ("landscape.mp4", "portrait.mp4", "landscape-poster.webp", "portrait-poster.webp", "manifest.json"):
            shutil.copyfile(MEDIA / filename, packet / "media" / filename)
        shutil.copytree(Path('/Users/yapweijun/.codex/skills/cli-web-design-director'),
                        packet / "skills/cli-web-design-director", ignore=shutil.ignore_patterns("__pycache__"))
        (packet / "mcp-empty.json").write_text('{"mcpServers":{}}\n')
        for filename, content in {"AGENTS.md": RULES, "CLAUDE.md": RULES, "TASK.md": TASK,
                                  "IMPLEMENTATION-PROMPT.txt": PROMPT}.items():
            (workspace / filename).write_text(content)
        (workspace / "README.md").write_text("# Aquatic World — Fusion Home\n\nStatus: own round-7 baseline prepared; implementation and browser review pending.\n")
        assert inventory(workspace / "demo") == inventory(workspace / "baseline/demo")
        starting[name] = {"source": f"round-7-immersive/{name}/demo",
                          "baseline_files": inventory(workspace / "baseline"),
                          "starting_demo_files": inventory(workspace / "demo")}
    shared = inventory(WORKSPACES / "codex/input")
    assert shared == inventory(WORKSPACES / "claude/input")
    contracts = {name: sha(WORKSPACES / "codex" / name) for name in CONTRACTS}
    assert all(sha(WORKSPACES / "claude" / name) == value for name, value in contracts.items())
    (ROOT / "input-manifest.json").write_text(json.dumps({"prepared_on": "2026-10-12",
        "shared_input_files": shared, "shared_root_contracts": contracts,
        "user_acceptance": "open", "media_generation": "none; current byte-identical media"}, indent=2) + "\n")
    (ROOT / "starting-conditions.json").write_text(json.dumps(starting, indent=2) + "\n")
    (ROOT / "preserved-history.json").write_text(json.dumps(history, indent=2) + "\n")
    print(json.dumps({"prepared": True, "equal_inputs": len(shared), "workspaces": 2}))


if __name__ == "__main__":
    main()
