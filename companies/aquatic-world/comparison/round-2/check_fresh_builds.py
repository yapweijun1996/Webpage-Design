"""Rebuild disposable copies and compare generated pages without editing deliveries."""
from pathlib import Path
import datetime as dt
import hashlib
import json
import shutil
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parent
CASE = ROOT.parents[1]
report = {"checked_at": dt.datetime.now(dt.timezone.utc).isoformat(), "checks": []}
for runner in ("codex", "claude"):
    original = CASE / "round-2" / runner / "demo"
    record = json.loads((original.parent / "evidence/process-run.json").read_text())
    if record["status"] != "process_finished":
        raise SystemExit(f"Wait for {runner} delivery before checking reproducibility.")
    with tempfile.TemporaryDirectory(prefix=f"aquatic-r2-{runner}-") as temporary:
        copied = Path(temporary) / "demo"
        shutil.copytree(original, copied, ignore=shutil.ignore_patterns("node_modules", ".playwright-cli", "__pycache__", ".DS_Store", "dist"))
        if runner == "codex":
            (copied / "index.html").unlink()
            shutil.rmtree(copied / "fixtures")
        result = subprocess.run(["npm", "run", "build"], cwd=copied, text=True, capture_output=True, timeout=60)
        generated = copied if runner == "codex" else copied / "dist"
        delivered = original if runner == "codex" else original / "dist"
        files = list(generated.rglob("*.html"))
        if runner == "claude":
            files += list((generated / "assets/css").glob("*.css")) + list((generated / "assets/js").glob("*.js"))
        comparisons = []
        for file in sorted(files):
            path = file.relative_to(generated)
            other = delivered / path
            comparisons.append({"path": str(path), "matches": other.is_file() and file.read_bytes() == other.read_bytes(), "sha256": hashlib.sha256(file.read_bytes()).hexdigest()})
        report["checks"].append({"runner": runner, "status": "pass" if result.returncode == 0 and comparisons and all(x["matches"] for x in comparisons) else "fail", "build_exit_code": result.returncode, "generated_file_comparisons": comparisons, "stdout": result.stdout[-1500:], "stderr": result.stderr[-1000:], "dependency_install": "No install required for the built-in Node static build; dev-only browser dependencies excluded.", "temporary_copy_removed": True})
(ROOT / "output").mkdir(exist_ok=True)
(ROOT / "output/fresh-build-checks.json").write_text(json.dumps(report, indent=2) + "\n")
for check in report["checks"]:
    print(json.dumps({"runner": check["runner"], "status": check["status"], "compared_files": len(check["generated_file_comparisons"])}))
if any(check["status"] != "pass" for check in report["checks"]):
    raise SystemExit(1)
