"""Exercise the explicit round-2 history and five-category regressions."""
import argparse
import json
from capture_report import ROOT, run

parser = argparse.ArgumentParser()
parser.add_argument("runner", choices=["codex", "claude"])
args = parser.parse_args()
port = 4181 if args.runner == "codex" else 4182
run("goto", f"http://127.0.0.1:{port}/")
run("snapshot")
response = run("run-code", (ROOT / "regression_page.js").read_text().replace("__OUTPUT_ROOT__", str(ROOT / "output/playwright")))
report = json.loads(response.split("### Result\n", 1)[1].splitlines()[0])
(ROOT / "output/playwright" / args.runner / "regression-checks.json").write_text(json.dumps(report, indent=2) + "\n")
print(json.dumps({"runner": args.runner, "checks": len(report["checks"]), "failed": [c for c in report["checks"] if c["status"] == "fail"]}))
