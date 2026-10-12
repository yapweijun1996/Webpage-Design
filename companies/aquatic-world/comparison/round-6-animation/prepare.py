"""Freeze the authorized equal-input homepage animation experiment."""
from pathlib import Path
import hashlib
import json
import shutil
import socket

ROOT = Path(__file__).resolve().parent
COMPANY = ROOT.parents[1]
WORKSPACES = COMPANY / "round-6-animation"
SOURCE = COMPANY / "redesign/animation-v1"
SKILL = Path("/Users/yapweijun/.codex/skills/cli-web-design-director")

RULES = """# Independent Homepage Animation Workspace

- The current TASK.md and ACCEPTANCE.md own this authorized homepage enhancement. Preparation notes saying native execution is pending are historical; this run is authorized. Preserve all other site behavior.
- Start from your own baseline/demo copy. Write only demo/, evidence/ and root README.md. Preserve AGENTS.md, CLAUDE.md, TASK.md, ACCEPTANCE.md, IMPLEMENTATION-PROMPT.txt, input/ and baseline/ byte-for-byte.
- Read input/animation/INTEGRATION.md, the supplied reference implementation and frozen skill snapshot in input/skills/cli-web-design-director/. Inspect the source image, common reference captures and your own baseline captures before editing.
- Read no sibling implementation, old workspace, parent report or evaluator script. Use no other agent, delegate, advisor or model. Do not use MCP tools, external APIs/services, network downloads or generation.
- Keep code and copy in English. Preserve the fictional/demo limitations and honest local Contact preview; never claim sending or a real business fact.
- No new dependency, credential/configuration/permission change, git operation, commit, push, PR, deployment, upload, publication or external enquiry.
- Browser self-review is unavailable inside these restricted CLI runs. Do not run browser-driving scripts, terminal Playwright/CDP, AppleScript or OS automation. Do not fabricate rendered verification. The coordinator will evaluate both actual sites through the same CUA environment.
- Build locally with existing tooling, use the supplied unused AQUATIC_PREVIEW_PORT if serving is permitted, preserve unrelated processes, and stop only demonstrably owned children.
- Record a short design plan before edits, source/build paths, states, actual checks and unavailable checks in evidence/. Update README.md and complete build/self-review in this run.
"""

TASK = """# Authorized Homepage Controlled Animation Integration

Integrate the selected original-image water-light/ten-particle enhancement into Home only, in your independent copy of your own round-5 website. Native execution is authorized for this stage. Keep your current brand wording, typography, useful collection destination and the other seven pages/404.

Read input/animation/INTEGRATION.md and ACCEPTANCE.md. The same canonical reference bytes, input/animation/input-manifest.json, source image, shared captures and skill are supplied to both CLIs. Copy the PNG into your own code/build asset directory; never reference input/, baseline/, canonical study or another implementation at runtime. Do not regenerate or re-encode it.

The image is complete at 1882/836 on every viewport; no cropped cover image, portrait derivative, image transform, fish/fin/plant/wood/camera movement or random particles. The only motion is the specified low-opacity light and exactly ten deterministic 2px particles. Match the provided geometry, timing, delays and continuous endpoints. Use your own site composition with readable opaque copy and working CTA before media on phones. Desktop 1280x800 must show full media and playback control together.

The original reference preview markup is a visual/code input, not a website to install. Its historical review/navigation links must not be carried into the actual site. Use common capture files for that study's rendered composition. Source navigation links within copied reference files are historical labels, not permission to inspect old/sibling workspaces.

Use one state owner and actual Play/Pause labels. Handle image readiness/error, no JavaScript, initial/live reduced motion, exposed Save-Data, fully offscreen hero, hidden document and your actual mobile menu. Preserve user/policy stops through automatic state changes. Explicit Play is the only opt-in. Do not add polling, APIs or external media requests. A native Save-Data test override may not emit connection.change; record environment limits honestly rather than manually dispatching events to claim browser acceptance.

Preserve all eight distinct routes, direct load/refresh/history, current navigation/header/current-page indicators, page-specific content and the four-group Contact/prefill/preview/edit/clear workflow. Scope homepage styling/behavior so inner pages retain their existing layouts. Document any necessary preview-server PNG MIME mapping.

Write your plan first, inspect permitted image inputs, implement, build and perform meaningful static/script checks. Browser checks are performed separately by the coordinator; mark your own unavailable browser checks not run. Record actual CLI/model information only where exposed, and leave user acceptance pending.
"""

ACCEPTANCE = """# Common Actual-site Acceptance

## Functional gates

- Source PNG hash equals 8e69f724fd29a138a438afa05739a77b81bc01e795eb115532fb8416efbeb3d1; built asset is implementation-owned and no runtime URL/import escapes into input, baseline, another worker or canonical study.
- Home media keeps natural 1882/836 ratio, contain/full frame, no image transforms/crops; all fish/fins stay present. Copy/primary collection action precede landscape media on phones and remain ordinary HTML. Desktop 1280x800 shows the media/control together.
- Exactly one specified water-light layer and ten deterministic 2px particles use the canonical positions/delays/timing. Decorations stay left of the fish, inside frame, aria-hidden and noninteractive. All cycle endpoints match; inspect a complete 18s light cycle and actual moving phone/desktop states.
- A visible, stable 44x44-or-larger native button with readable 16px label/focus controls actual running state. Pause freezes animation phase, and Play resumes only when eligible.
- Fully offscreen, real document hidden and actual mobile menu open pause. Re-entry/menu close/tab return preserve manual Pause. Native menu keyboard/close/trigger focus and background behavior remain correct.
- Initial/live prefers-reduced-motion and available Save-Data states honor static/opt-in policy; returning preferences cannot auto-resume a policy stop. Real browser signal evidence is distinct from simulated-event tests. Document unsupported live signal delivery instead of forging acceptance.
- No JavaScript leaves image/copy/CTA/navigation usable with decorations and dead playback controls hidden. An image error hides animation/control and retains accessible fallback/stable reserved frame geometry.
- Eight required routes plus 404 load directly, refresh and have distinct content; header links from inner pages, current state, Back/Forward and collection/category-to-Contact journeys work. Contact preserves exactly four groups, prefill, validation, local preview, Edit, Clear and honest no-send feedback.
- Existing builds pass with no new package/dependency, asset generation, provider, API, keys, browser shell runner or outside writes. Links/assets resolve; actual visitor journeys produce no blocking errors.

## Actual browser matrix

1280x800 desktop; 768x1024 intermediate; 390x844, 360x800 and 320x800 phones. Inspect top/middle/bottom, menu open/closed, keyboard focus, playing/paused and static policies. Capture comparable Home/Contact screens and measure overflow, image/control rectangles and motion states. Inspect a whole light cycle. Verify genuine hidden/visible using a browser that can expose those states; native CDP Save-Data override counts as native signal emulation, not a physical-network test.

## Evaluation boundaries

Worker source/build checks, evaluator browser checks, visual judgment and user acceptance are separate evidence. A build, fidelity score or standalone study's results cannot replace actual-site checks. User acceptance stays pending. Other browsers, physical phones, full accessibility/performance and genuine live network preference changes are not automatically proven by this matrix.
"""

PROMPT = """Complete the authorized Aquatic World controlled-animation homepage integration in this workspace.
Read AGENTS.md, TASK.md, ACCEPTANCE.md, input/animation/INTEGRATION.md and input/animation/IMPLEMENTATION-PROMPT.txt. The earlier preparation's pending-execution language is superseded by TASK.md for this run only.
Read the shared frozen input/skills/cli-web-design-director skill and relevant operation/prompt references. Inspect input/animation/assets/hero-angelfish.png, input/reference/desktop.png, input/reference/phone-390.png and your own baseline Home/Contact captures.
Write a short design plan in evidence/design-plan.md, implement within demo/, build with existing tools and document meaningful checks plus unavailable browser checks. Use the exact source bytes and deterministic motion contract; preserve all eight pages, current header and four-group Contact. No other model/agent/MCP/API/service/browser shell automation, new dependency, credential/config change, git/publication/upload or outside writes.
Both CLIs receive this identical prompt and input contract. Do not inspect another implementation. Update README.md with actual build/preview commands, source/build paths and evidence. Finish this bounded implementation and self-review now; keep user acceptance pending.
"""


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def inventory(directory):
    return {str(p.relative_to(directory)): {"bytes": p.stat().st_size, "sha256": sha(p)}
            for p in sorted(directory.rglob("*")) if p.is_file() and not any(part in {"__pycache__", "node_modules", ".git"} for part in p.parts)}


def main():
    if WORKSPACES.exists() or (ROOT / "input-manifest.json").exists():
        raise SystemExit("Refusing to overwrite prepared workspaces or input manifest")
    canonical = json.loads((SOURCE / "input-manifest.json").read_text())
    for item in canonical["frozen_reference_inputs"]:
        if sha(SOURCE / item["path"]) != item["sha256"]:
            raise SystemExit(f"Canonical input changed: {item['path']}")
    for port in [4231, 4232]:
        with socket.socket() as sock:
            sock.bind(("127.0.0.1", port))
    snapshots = {}
    for name in ["codex", "claude"]:
        previous = COMPANY / "round-5" / name
        workspace = WORKSPACES / name
        workspace.mkdir(parents=True)
        (workspace / "evidence").mkdir()
        shutil.copytree(previous / "demo", workspace / "demo", ignore=shutil.ignore_patterns("__pycache__", "node_modules"))
        shutil.copytree(previous / "demo", workspace / "baseline/demo", ignore=shutil.ignore_patterns("__pycache__", "node_modules"))
        for filename in ["home-desktop-first.png", "home-mobile-first.png", "contact-mobile-first.png"]:
            capture = COMPANY / "comparison/round-5/output/playwright" / name / filename
            if not capture.exists():
                raise SystemExit(f"Missing own current baseline capture: {capture}")
            shutil.copy2(capture, workspace / "baseline" / filename)
        input_dir = workspace / "input"
        input_dir.mkdir()
        for item in canonical["frozen_reference_inputs"]:
            target = input_dir / "animation" / item["path"]
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(SOURCE / item["path"], target)
        shutil.copy2(SOURCE / "input-manifest.json", input_dir / "animation/input-manifest.json")
        shutil.copytree(SKILL, input_dir / "skills/cli-web-design-director", ignore=shutil.ignore_patterns("__pycache__"))
        (input_dir / "reference").mkdir()
        for capture in ["desktop.png", "phone-390.png"]:
            shutil.copy2(SOURCE / "evidence" / capture, input_dir / "reference" / capture)
        shutil.copytree(COMPANY / "comparison/assets-v1", input_dir / "assets")
        (input_dir / "mcp-empty.json").write_text('{"mcpServers":{}}\n')
        for filename, text in [("AGENTS.md", RULES), ("CLAUDE.md", RULES), ("TASK.md", TASK), ("ACCEPTANCE.md", ACCEPTANCE), ("IMPLEMENTATION-PROMPT.txt", PROMPT)]:
            (workspace / filename).write_text(text)
        (workspace / "README.md").write_text("# Aquatic World — Homepage Animation Integration\n\nStatus: independent own-round-5 copy prepared; native implementation not yet run. User acceptance pending.\n")
        snapshots[name] = {"source": str(previous.relative_to(COMPANY)), "source_files": inventory(previous / "demo"), "own_baseline_files": inventory(workspace / "baseline"), "starting_demo_files": inventory(workspace / "demo")}
    shared = inventory(WORKSPACES / "codex" / "input")
    if shared != inventory(WORKSPACES / "claude" / "input"):
        raise SystemExit("Common copied inputs differ")
    common_roots = {f: {"bytes": (WORKSPACES / "codex" / f).stat().st_size, "sha256": sha(WORKSPACES / "codex" / f)} for f in ["AGENTS.md", "CLAUDE.md", "TASK.md", "ACCEPTANCE.md", "IMPLEMENTATION-PROMPT.txt"]}
    for name in snapshots:
        if any(sha(WORKSPACES / name / f) != entry["sha256"] for f, entry in common_roots.items()):
            raise SystemExit("Root contracts differ")
        if snapshots[name]["source_files"] != snapshots[name]["starting_demo_files"]:
            raise SystemExit("Own-code copy differs before execution")
    (ROOT / "input-manifest.json").write_text(json.dumps({"prepared_on": "2026-10-12", "experiment": "own_round5_homepage_controlled_animation", "native_execution": "authorized_by_current_request", "shared_input_files": shared, "shared_root_contracts": common_roots, "canonical_manifest_sha256": sha(SOURCE / "input-manifest.json"), "runtime_cross_imports": "prohibited", "user_acceptance": "pending"}, indent=2) + "\n")
    (ROOT / "starting-conditions.json").write_text(json.dumps(snapshots, indent=2) + "\n")
    shutil.copy2(SOURCE / "evidence/preserved-baseline.json", ROOT / "preserved-history.json")
    print(json.dumps({"prepared": True, "common_input_files": len(shared), "common_contracts": len(common_roots), "workspaces": str(WORKSPACES)}))


if __name__ == "__main__":
    main()
