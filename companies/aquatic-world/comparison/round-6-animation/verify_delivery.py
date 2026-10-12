"""Independent delivery/frozen-history/build/HTTP checks; no browser automation."""
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import urllib.error
import urllib.request
from check_inputs import ROOT, COMPANY, WORKSPACES, verify, sha

ROUTES = ["/", "/collections/", "/collections/ornamental-fish/", "/collections/aquatic-plants/",
          "/collections/driftwood/", "/our-story/", "/quality/", "/contact/"]

class References(HTMLParser):
    def __init__(self):
        super().__init__()
        self.assets = []
        self.links = []
        self.h1 = []
        self.heading = False
    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if tag == "h1": self.heading = True
        if tag == "a" and attrs.get("href"): self.links.append(attrs["href"])
        if tag in ["script", "img", "source"] and attrs.get("src"): self.assets.append(attrs["src"])
        if tag == "link" and attrs.get("rel") in ["stylesheet", "icon"]: self.assets.append(attrs.get("href", ""))
    def handle_endtag(self, tag):
        if tag == "h1": self.heading = False
    def handle_data(self, data):
        if self.heading: self.h1.append(data)

def files(base):
    return {str(p.relative_to(base)): sha(p) for p in base.rglob("*") if p.is_file() and "__pycache__" not in p.parts}

def main():
    result = {"checked_on": "2026-10-12", "frozen_input_checks": verify(), "workers": {},
              "browser_checks": "Separate actual-site CUA evidence; this script does not automate a browser",
              "user_acceptance": "pending"}
    history = json.loads((ROOT / "preserved-history.json").read_text())
    for path, expected in history.items():
        assert sha(COMPANY / path) == expected, f"History changed: {path}"
    result["preserved_history_files"] = len(history)
    for name, port, output in [("codex", 4231, "public"), ("claude", 4232, "dist")]:
        workspace = WORKSPACES / name
        demo = workspace / "demo"
        built = demo / output
        old = workspace / "baseline/demo" / output
        source_hash = json.loads((ROOT / "input-manifest.json").read_text())["shared_input_files"]["animation/assets/hero-angelfish.png"]["sha256"]
        matching = [p for p in built.rglob("*.png") if sha(p) == source_hash]
        assert len(matching) == 1, f"Expected one exact owned source image: {name}"
        image = "/" + str(matching[0].relative_to(built))
        route_records = []
        assets = set()
        for route in ROUTES:
            relative = route.lstrip("/") + "index.html"
            html = (built / relative).read_text()
            parser = References(); parser.feed(html)
            assert parser.h1, f"Missing page heading: {name}:{route}"
            assert not re.search(r'(?:src|href)=[\"\'][^\"\']*(?:input/|baseline/|redesign/animation-v1|round-5|round-6-animation/(?:codex|claude))', html), route
            assert not any(src.startswith(("http:", "https:", "//")) for src in parser.assets), f"External runtime asset: {route}"
            assets.update(parser.assets)
            with urllib.request.urlopen(f"http://127.0.0.1:{port}{route}") as response:
                assert response.status == 200 and response.read() == (built / relative).read_bytes(), route
            body = lambda text: re.search(r'<body\b[^>]*>(.*)</body>', text, re.S).group(1)
            preserved = route == "/" or body(html) == body((old / relative).read_text())
            assert preserved, f"Unexpected inner-page body change: {name}:{route}"
            route_records.append({"route": route, "h1": "".join(parser.h1), "http": 200,
                                  "inner_body_preserved": None if route == "/" else preserved})
        try:
            urllib.request.urlopen(f"http://127.0.0.1:{port}/missing-page/")
            raise AssertionError("404 returned success")
        except urllib.error.HTTPError as error:
            assert error.code == 404
            assert error.read() == (built / "404.html").read_bytes()
        for asset in assets:
            if asset.startswith("/"):
                with urllib.request.urlopen(f"http://127.0.0.1:{port}{asset}") as response:
                    assert response.status == 200 and response.read() == (built / asset.lstrip("/")).read_bytes(), asset
        with urllib.request.urlopen(f"http://127.0.0.1:{port}{image}") as response:
            assert response.headers.get_content_type() == "image/png"
            assert hashlib.sha256(response.read()).hexdigest() == source_hash
        with tempfile.TemporaryDirectory(prefix=f"aquatic-{name}-fresh-") as directory:
            copy = Path(directory) / "demo"
            shutil.copytree(demo, copy, ignore=shutil.ignore_patterns("__pycache__", "node_modules"))
            shutil.rmtree(copy / output)
            command = ["python3", "-B", "build.py"] if name == "codex" else ["npm", "run", "build"]
            build = subprocess.run(command, cwd=copy, text=True, capture_output=True)
            assert build.returncode == 0, f"Fresh build failed: {name}"
            assert files(copy / output) == files(built), f"Fresh build differs: {name}"
        result["workers"][name] = {"source_image": image, "source_sha256": source_hash,
                                    "routes": route_records, "not_found_http": 404,
                                    "local_runtime_asset_count": len(assets), "fresh_build_reproduced": True,
                                    "delivered_files": files(built)}
    (ROOT / "evidence/delivery-checks.json").write_text(json.dumps(result, indent=2) + "\n")
    print(json.dumps({"frozen_checks": result["frozen_input_checks"], "preserved_history_files": len(history),
                      "workers": {name: {"fresh_build": True, "routes": len(item["routes"]), "assets": item["local_runtime_asset_count"]} for name, item in result["workers"].items()}}))

if __name__ == "__main__":
    main()
