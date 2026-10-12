"""Audit served page/assets/anchor destinations against delivered static bytes."""
import argparse
import datetime as dt
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import urljoin, urlsplit, unquote
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parent
ROUTES = ["/", "/collections/", "/collections/ornamental-fish/", "/collections/aquatic-plants/", "/collections/driftwood/", "/our-story/", "/quality/", "/contact/"]

class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = set()

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        for attr in ["href", "src"]:
            if attrs.get(attr):
                self.urls.add(attrs[attr])
        for part in attrs.get("srcset", "").split(","):
            if part.strip():
                self.urls.add(part.split()[0])

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("runner", choices=["codex", "claude"])
    parser.add_argument("origin")
    args = parser.parse_args()
    output = ROOT.parents[1] / "round-3" / args.runner / "demo" / ("public" if args.runner == "codex" else "dist")
    urls, external = set(), set()
    for route in ROUTES:
        document = output / route.strip("/") / "index.html"
        links = Links()
        links.feed(document.read_text())
        urls.add(args.origin + route)
        for value in links.urls:
            if value.startswith(("#", "data:")):
                continue
            target = urljoin(args.origin + route, value)
            parsed = urlsplit(target)
            if f"{parsed.scheme}://{parsed.netloc}" == args.origin:
                urls.add(target.split("#")[0])
            else:
                external.add(value)
    checks = []
    for url in sorted(urls):
        with urlopen(url, timeout=5) as response:
            data = response.read()
            path = unquote(urlsplit(url).path).lstrip("/")
            if not path or path.endswith("/"):
                path += "index.html"
            file = output / path
            checks.append({"url": url, "status": response.status, "path": path,
                           "matches_delivery": file.is_file() and data == file.read_bytes(),
                           "sha256": hashlib.sha256(data).hexdigest()})
    try:
        with urlopen(args.origin + "/missing-round-3-page/", timeout=5) as response:
            status, body = response.status, response.read()
    except HTTPError as error:
        status, body = error.code, error.read()
    not_found = {"status": status, "matches_delivery": body == (output / "404.html").read_bytes()}
    passed = all(c["status"] == 200 and c["matches_delivery"] for c in checks) and not_found["status"] == 404 and not_found["matches_delivery"] and not external
    report = {"runner": args.runner, "checked_at": dt.datetime.now(dt.timezone.utc).isoformat(),
              "checks": checks, "not_found": not_found, "external_links_or_assets": sorted(external), "pass": passed}
    (ROOT / "output").mkdir(exist_ok=True)
    (ROOT / f"output/{args.runner}-http-checks.json").write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps({"runner": args.runner, "urls": len(checks), "not_found": not_found, "external": sorted(external), "pass": passed}))
    raise SystemExit(0 if passed else 1)

if __name__ == "__main__":
    main()
