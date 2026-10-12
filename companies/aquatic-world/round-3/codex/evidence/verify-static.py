"""Reproducible non-browser checks. These do not prove browser acceptance."""
import hashlib
import importlib.util
import io
import json
from pathlib import Path
import re
from urllib.parse import unquote, urlsplit
from html.parser import HTMLParser

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "demo/public"
ROUTES = ["/", "/collections/", "/collections/ornamental-fish/",
          "/collections/aquatic-plants/", "/collections/driftwood/",
          "/our-story/", "/quality/", "/contact/"]
GLOBAL = ["/", "/collections/", "/our-story/", "/quality/", "/contact/"]
checks = []


def check(name, condition, detail=None):
    checks.append({"check": name, "result": "pass" if condition else "fail", "detail": detail})


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.tags = []
        self.ids = []
        self.links = []
        self.images = []
        self.titles = []
        self.headings = []
        self.stack = []
        self.voids = {"img", "input", "meta", "link", "br", "hr", "source", "wbr"}
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        entry = {"tag": tag, "attrs": attrs, "text": "", "ancestors": list(self.stack)}
        self.tags.append(entry)
        if "id" in attrs:
            self.ids.append(attrs["id"])
        if tag == "a":
            self.links.append(entry)
        if tag == "img":
            self.images.append(entry)
        if tag == "title":
            self.titles.append(entry)
        if re.fullmatch(r"h[1-6]", tag):
            self.headings.append(entry)
        if tag not in self.voids:
            self.stack.append(entry)

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i]["tag"] == tag:
                del self.stack[i:]
                break

    def handle_data(self, data):
        for entry in self.stack:
            entry["text"] += data


def file_for(path):
    return PUBLIC / (path.lstrip("/") + "index.html" if path.endswith("/") else path.lstrip("/"))


pages = {route: Page(file_for(route).read_text()) for route in ROUTES}
titles = []
main_texts = []
for route, page in pages.items():
    h1 = [heading for heading in page.headings if heading["tag"] == "h1"]
    check(f"{route}: one meaningful H1", len(h1) == 1 and len(h1[0]["text"].strip()) > 6,
          h1[0]["text"].strip() if h1 else None)
    check(f"{route}: unique IDs", len(page.ids) == len(set(page.ids)))
    check(f"{route}: title and description", len(page.titles) == 1 and any(t["tag"] == "meta" and t["attrs"].get("name") == "description" for t in page.tags))
    titles.append(page.titles[0]["text"])
    main_texts.append(next(t["text"] for t in page.tags if t["tag"] == "main"))
    check(f"{route}: semantic landmarks", all(any(t["tag"] == tag for t in page.tags) for tag in ["header", "nav", "main", "footer"]))
    for landmark in ["header", "footer"]:
        destinations = [a["attrs"].get("href") for a in page.links if any(p["tag"] == landmark for p in a["ancestors"])]
        check(f"{route}: {landmark} global destinations", all(url in destinations for url in GLOBAL))
    main_nav = [t for t in page.tags if t["tag"] == "nav" and t["attrs"].get("aria-label") == "Main navigation"][0]
    current = [a for a in page.links if main_nav in a["ancestors"] and a["attrs"].get("aria-current")]
    expected = "/collections/" if route.startswith("/collections/") and route != "/collections/" else route
    check(f"{route}: current global context", len(current) == 1 and current[0]["attrs"]["href"] == expected and current[0]["attrs"]["aria-current"] == ("location" if expected != route else "page"))
    check(f"{route}: first link skips to main", page.links[0]["attrs"].get("href") == "#main" and "main" in page.ids)
    check(f"{route}: native no-JS menu", any(t["tag"] == "details" and "mobile-menu" in t["attrs"].get("class", "") for t in page.tags))
    for anchor in page.links:
        href = anchor["attrs"].get("href", "")
        parts = urlsplit(href)
        path = parts.path or route
        target = file_for(path)
        check(f"{route}: link resolves {href}", not parts.scheme and target.is_file())
        if parts.fragment:
            destination = pages.get(path) or Page(target.read_text())
            check(f"{route}: anchor resolves {href}", unquote(parts.fragment) in destination.ids)
    for img in page.images:
        attrs = img["attrs"]
        check(f"{route}: dimensioned local image {attrs.get('src')}", file_for(attrs["src"]).is_file() and "alt" in attrs and int(attrs.get("width", 0)) > 0 and int(attrs.get("height", 0)) > 0)
        for source in attrs.get("srcset", "").split(","):
            check(f"{route}: responsive source {source.strip()}", file_for(source.strip().split()[0]).is_file())
    for tag in page.tags:
        if tag["tag"] in ["script", "link"]:
            url = tag["attrs"].get("src") or tag["attrs"].get("href")
            if url:
                check(f"{route}: local dependency {url}", not urlsplit(url).scheme and file_for(url).is_file())
    if route.count("/") == 3 and route.startswith("/collections/"):
        crumbs = [a["attrs"]["href"] for a in page.links if any(t["tag"] == "nav" and t["attrs"].get("aria-label") == "Breadcrumb" for t in a["ancestors"])]
        check(f"{route}: breadcrumb hierarchy", crumbs == ["/", "/collections/"])
        slug = route.split("/")[2]
        check(f"{route}: enquiry preserves category", any(a["attrs"]["href"] == f"/contact/?category={slug}#enquiry" for a in page.links))
        siblings = [r for r in ROUTES if r.startswith("/collections/") and r.count("/") == 3 and r != route]
        check(f"{route}: both sibling links", all(any(a["attrs"].get("href") == r for a in page.links) for r in siblings))

check("All page titles distinct", len(set(titles)) == 8)
check("All main content distinct", len(set(main_texts)) == 8)
contact = pages["/contact/"]
labels = {t["attrs"].get("for") for t in contact.tags if t["tag"] == "label"}
for field in [t for t in contact.tags if t["tag"] in ["input", "select", "textarea"]]:
    attrs = field["attrs"]
    check(f"Contact: labeled field {attrs['id']}", attrs["id"] in labels)
    check(f"Contact: described-by IDs {attrs['id']}", all(i in contact.ids for i in attrs.get("aria-describedby", "").split()))
check("Contact: disabled initial submit and no-JS alternative", any(t["tag"] == "button" and t["attrs"].get("id") == "preview-button" and "disabled" in t["attrs"] for t in contact.tags) and any(t["tag"] == "noscript" for t in contact.tags))
check("Contact: explicit nothing-sent feedback", any("Nothing was sent" in t["text"] for t in contact.headings))
js = (ROOT / "demo/script.js").read_text()
check("JS source: no external submission or storage API", not re.search(r"\b(fetch|XMLHttpRequest|sendBeacon|localStorage|sessionStorage)\b", js))
check("JS source: user input assigned as text", "description.textContent = value" in js and "innerHTML" not in js)
check("CSS source: reduced motion rule", "prefers-reduced-motion:reduce" in (ROOT / "demo/styles.css").read_text())
check("CSS source: intermediate navigation breakpoint", "@media(max-width:1119px)" in (ROOT / "demo/styles.css").read_text())
manifest = json.loads((ROOT / "demo/assets/manifest.json").read_text())
check("Exactly nine frozen image source IDs", len(manifest) == 9)
for asset, data in manifest.items():
    source = ROOT / "input/assets" / data["source"]
    check(f"Asset provenance: {asset}", hashlib.sha256(source.read_bytes()).hexdigest() == data["source_sha256"])
    for variant in data["variants"]:
        binary = (ROOT / "demo/assets" / variant["file"]).read_bytes()
        served = (PUBLIC / "assets" / variant["file"]).read_bytes()
        check(f"Asset derivative: {variant['file']}", hashlib.sha256(binary).hexdigest() == variant["sha256"] and binary == served)

# Exercise the real request handler without binding a prohibited socket.
import sys
sys.argv = ["serve.py", "--port", "4191"]
server_source = (ROOT / "demo/serve.py").read_text().split('server = ThreadingHTTPServer')[0]
namespace = {"__file__": str(ROOT / "demo/serve.py")}
exec(compile(server_source, "serve-handler-under-test", "exec"), namespace)


class FakeConnection:
    def __init__(self, request):
        self.request = io.BytesIO(request)
        self.response = bytearray()

    def makefile(self, *args, **kwargs):
        return self.request

    def sendall(self, value):
        self.response.extend(value)


def request_handler(method, path):
    connection = FakeConnection(f"{method} {path} HTTP/1.0\r\nHost: 127.0.0.1\r\n\r\n".encode())
    namespace["Handler"](connection, ("127.0.0.1", 0), object())
    return bytes(connection.response)


for route in ROUTES:
    response = request_handler("GET", route)
    expected = pages[route].titles[0]["text"]
    check(f"Handler in-process: GET {route} distinct content", response.startswith(b"HTTP/1.0 200") and expected.encode() in response)
    head = request_handler("HEAD", route)
    check(f"Handler in-process: HEAD {route}", head.startswith(b"HTTP/1.0 200") and head.endswith(b"\r\n\r\n"))
response = request_handler("GET", "/unknown-aquatic-page/")
check("Handler in-process: genuine 404 with recovery", response.startswith(b"HTTP/1.0 404") and b"Uncharted waters" in response and b"Back to Home" in response)
check("Handler in-process: no POST service", request_handler("POST", "/contact/").startswith(b"HTTP/1.0 501"))
for file in PUBLIC.rglob("*"):
    if file.is_file() and file.suffix in [".webp", ".css", ".js", ".svg"]:
        path = "/" + file.relative_to(PUBLIC).as_posix()
        check(f"Handler in-process: asset {path}", request_handler("GET", path).startswith(b"HTTP/1.0 200"))
before = json.loads((ROOT / "evidence/frozen-inputs-before.json").read_text())
check("All 59 frozen files preserved byte-for-byte", all((ROOT / path).is_file() and hashlib.sha256((ROOT / path).read_bytes()).hexdigest() == digest for path, digest in before.items()))
result = {"scope": "Static source/output and real HTTP handler in-process. No browser, no actual listening socket, no screenshot or visual acceptance is implied.",
          "pass": sum(x["result"] == "pass" for x in checks),
          "fail": sum(x["result"] == "fail" for x in checks), "checks": checks}
(ROOT / "evidence/static-results.json").write_text(json.dumps(result, indent=2) + "\n")
print(json.dumps({k: result[k] for k in ["scope", "pass", "fail"]}, indent=2))
for failure in [x for x in checks if x["result"] == "fail"]:
    print(failure)
raise SystemExit(bool(result["fail"]))
