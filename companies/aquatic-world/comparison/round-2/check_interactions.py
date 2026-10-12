"""Run the same user journeys and each delivered configuration fixture."""

import argparse
import json
from pathlib import Path
from capture_report import ROOT, run


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("runner", choices=["codex", "claude"])
    args = parser.parse_args()
    port = 4181 if args.runner == "codex" else 4182
    run("goto", f"http://127.0.0.1:{port}/")
    run("snapshot")
    source = (ROOT / "interaction_page.js").read_text().replace("__OUTPUT_ROOT__", str(ROOT / "output/playwright"))
    response = run("run-code", source)
    report = json.loads(response.split("### Result\n", 1)[1].splitlines()[0])
    (ROOT / "output/playwright" / args.runner / "interaction-checks.json").write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps({"runner": args.runner, "checks": len(report["checks"]), "failed": [c for c in report["checks"] if c["status"] == "fail"], "unexpectedWrites": report["unexpectedWrites"]}))


if __name__ == "__main__":
    main()
