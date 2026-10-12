"""Capture an evaluator report through the separate Playwright CLI session."""

import argparse
import json
from pathlib import Path
import subprocess


ROOT = Path(__file__).resolve().parent
CLI = Path.home() / ".codex/skills/playwright/scripts/playwright_cli.sh"


def run(*args):
    result = subprocess.run(
        [str(CLI), "-s=aquatic-review", *args], cwd=ROOT,
        text=True, capture_output=True,
    )
    if result.returncode:
        raise RuntimeError((result.stderr or result.stdout)[-1200:])
    return result.stdout


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("runner", choices=["codex", "claude"])
    parser.add_argument("url")
    args = parser.parse_args()
    output = ROOT / "output/playwright" / args.runner
    output.mkdir(parents=True, exist_ok=True)
    run("goto", args.url)
    source = (ROOT / "capture_page.js").read_text().replace("__OUTPUT_ROOT__", str(ROOT / "output/playwright"))
    response = run("run-code", source)
    result_line = response.split("### Result\n", 1)[1].splitlines()[0]
    report = json.loads(result_line)
    (output / "layout-checks.json").write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps({
        "runner": args.runner, "browser": report["browser"],
        "layouts": [{"width": x["width"], "overflow": x["scrollWidth"] > x["width"], "pageHeight": x["pageHeight"], "brokenAnchors": x["brokenAnchors"], "brokenImages": len([i for i in x["images"] if i["rendered"] and not i["width"]])} for x in report["layouts"]],
        "errors": report["errors"], "failedRequests": report["failedRequests"],
        "errorResponses": report["errorResponses"],
    }))


if __name__ == "__main__":
    main()
