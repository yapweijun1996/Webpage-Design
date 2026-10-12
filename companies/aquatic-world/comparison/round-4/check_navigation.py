"""Traverse actual header/footer anchors from three distinct pages in Chrome."""
import argparse
import json
from capture_report import ROOT, run, result

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("runner", choices=["codex", "claude"])
    parser.add_argument("origin")
    args = parser.parse_args()
    output = ROOT / "output/playwright" / args.runner
    output.mkdir(parents=True, exist_ok=True)
    source = (ROOT / "check_navigation.js").read_text().replace("__ORIGIN__", args.origin)
    report = {"runner": args.runner, "checks": []}
    for path in ["/", "/quality/", "/contact/"]:
        run("goto", args.origin + path)
        run("snapshot")
        part = result(run("run-code", source.replace("__SOURCE__", path)))
        report["checks"].extend(part["checks"])
        print(json.dumps({"runner": args.runner, "source": path, "checks": len(part["checks"])}), flush=True)
    (output / "navigation-checks.json").write_text(json.dumps(report, indent=2) + "\n")
    failed = [item for item in report["checks"] if not item["pass"]]
    print(json.dumps({"runner": args.runner, "checks": len(report["checks"]), "failed": failed}))
    raise SystemExit(1 if failed else 0)

if __name__ == "__main__":
    main()
