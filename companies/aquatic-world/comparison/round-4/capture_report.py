"""Capture all multi-page views through an independent headed Playwright CLI session."""

import argparse
import json
from pathlib import Path
import subprocess


ROOT = Path(__file__).resolve().parent
CLI = Path.home() / ".codex/skills/playwright/scripts/playwright_cli.sh"


def run(*args):
    result = subprocess.run([str(CLI), "-s=aquatic-round-4", *args], cwd=ROOT,
                            text=True, capture_output=True)
    if result.returncode:
        raise RuntimeError((result.stderr or result.stdout)[-1500:])
    return result.stdout


def result(text):
    return json.loads(text.split("### Result\n", 1)[1].splitlines()[0])


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("runner", choices=["codex", "claude"])
    parser.add_argument("origin")
    args = parser.parse_args()
    output = ROOT / "output/playwright" / args.runner
    output.mkdir(parents=True, exist_ok=True)
    source = (ROOT / "capture_pages.js").read_text().replace("__RUNNER__", args.runner).replace("__ORIGIN__", args.origin.rstrip("/")).replace("__OUTPUT__", str(output))
    viewports = [
        {"name": "desktop", "width": 1440, "height": 900, "capture": True},
        {"name": "mobile", "width": 390, "height": 844, "capture": True},
        {"name": "tablet", "width": 768, "height": 1024, "capture": True},
        *({"name": f"overflow-{width}", "width": width, "height": 900, "capture": False}
          for width in [320, 360, 430, 1024, 1920]),
    ]
    report = {"runner": args.runner, "origin": args.origin, "layouts": [],
              "errors": [], "failedRequests": [], "errorResponses": []}
    for viewport in viewports:
        part = result(run("run-code", source.replace("__VIEWPORTS__", json.dumps([viewport]))))
        (output / f"layout-{viewport['name']}.json").write_text(json.dumps(part, indent=2) + "\n")
        report["browser"] = part["browser"]
        for key in ["layouts", "errors", "failedRequests", "errorResponses"]:
            report[key].extend(part[key])
        print(json.dumps({"runner": args.runner, "captured": viewport["name"],
                          "layouts": len(part["layouts"])}), flush=True)
    (output / "layout-checks.json").write_text(json.dumps(report, indent=2) + "\n")
    failed = [{"route": item["route"], "viewport": item["viewport"], "status": item["httpStatus"], "scrollY": item.get("scrollY"),
               "overflow": item["scrollWidth"] > item["width"], "brokenImages": len([img for img in item["images"] if img["rendered"] and not img["width"]]), "brokenAnchors": item["brokenAnchors"]}
              for item in report["layouts"] if item["httpStatus"] != 200 or item.get("scrollY") != 0 or item["scrollWidth"] > item["width"] or item["brokenAnchors"] or any(img["rendered"] and not img["width"] for img in item["images"])]
    print(json.dumps({"runner":args.runner,"layouts":len(report["layouts"]),"failed":failed,"pageErrors":report["errors"],"errorResponses":report["errorResponses"]}))
    raise SystemExit(1 if failed or report["errors"] or report["errorResponses"] else 0)


if __name__ == "__main__":
    main()
