"""Build disposable source copies, then compare every output byte with delivery."""
import datetime as dt
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parent
report = {"checked_at": dt.datetime.now(dt.timezone.utc).isoformat(), "checks": []}
for runner, generated_dir, command in [
    ("codex", "public", ["python3", "build.py"]),
    ("claude", "dist", ["npm", "run", "build"]),
]:
    workspace = ROOT.parents[1] / "round-5" / runner
    process = json.loads((workspace / "evidence/process-run.json").read_text())
    if process["status"] != "process_finished":
        raise SystemExit(f"Wait for {runner} native delivery.")
    original = workspace / "demo"
    with tempfile.TemporaryDirectory(prefix=f"aquatic-r5-{runner}-") as temporary:
        copied = Path(temporary) / "demo"
        shutil.copytree(original, copied, ignore=shutil.ignore_patterns(
            "node_modules", ".playwright-cli", "__pycache__", ".DS_Store", generated_dir))
        result = subprocess.run(command, cwd=copied, text=True, capture_output=True, timeout=60)
        generated, delivered = copied / generated_dir, original / generated_dir
        files = sorted(p for p in generated.rglob("*") if p.is_file())
        comparisons = [{"path": str(p.relative_to(generated)),
                        "matches": (delivered / p.relative_to(generated)).is_file() and
                          p.read_bytes() == (delivered / p.relative_to(generated)).read_bytes(),
                        "sha256": hashlib.sha256(p.read_bytes()).hexdigest()} for p in files]
        generated_names = {p.relative_to(generated) for p in files}
        delivered_names = {p.relative_to(delivered) for p in delivered.rglob("*") if p.is_file()}
        passed = result.returncode == 0 and comparisons and generated_names == delivered_names and all(c["matches"] for c in comparisons)
        report["checks"].append({"runner": runner, "status": "pass" if passed else "fail",
            "command": command, "build_exit_code": result.returncode,
            "compared_files": comparisons, "stdout": result.stdout[-1500:], "stderr": result.stderr[-1000:],
            "dependency_install": "None; delivered local image derivatives retained.",
            "image_regeneration": "Not part of the default build; optional encoder workflow not rerun.",
            "temporary_copy_removed": True})
(ROOT / "output").mkdir(exist_ok=True)
(ROOT / "output/fresh-build-checks.json").write_text(json.dumps(report, indent=2) + "\n")
for item in report["checks"]:
    print(json.dumps({"runner": item["runner"], "status": item["status"], "files": len(item["compared_files"])}))
raise SystemExit(1 if any(item["status"] != "pass" for item in report["checks"]) else 0)
