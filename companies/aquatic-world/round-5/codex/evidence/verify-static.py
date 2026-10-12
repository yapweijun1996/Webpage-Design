"""Check this owned output without a network listener or third-party packages."""
import contextlib
import hashlib
from html.parser import HTMLParser
import io
import json
from pathlib import Path
import runpy
import sys
from unittest.mock import patch
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "demo/public"
checks = []


def check(name, condition):
    checks.append({"check": name, "status": "pass" if condition else "fail"})


class Node:
    def __init__(self, tag, attrs=(), parent=None):
        self.tag, self.attrs, self.parent = tag, dict(attrs), parent
        self.children, self.text = [], ""

    def content(self):
        return self.text + "".join(n.content() for n in self.children)


class Document(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.root = Node("document")
        self.stack, self.nodes = [self.root], []
        self.feed(text)
        self.ids = {n.attrs["id"]: n for n in self.nodes if "id" in n.attrs}

    def handle_starttag(self, tag, attrs):
        n = Node(tag, attrs, self.stack[-1])
        self.stack[-1].children.append(n)
        self.nodes.append(n)
        if tag not in {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}:
            self.stack.append(n)

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                break

    def handle_data(self, text):
        self.stack[-1].text += text


routes = ["/", "/collections/", "/collections/ornamental-fish/", "/collections/aquatic-plants/", "/collections/driftwood/", "/our-story/", "/quality/", "/contact/"]
documents = {}
for route in routes + ["/404.html"]:
    path = PUBLIC / (route.lstrip("/") + "index.html" if route.endswith("/") else route.lstrip("/"))
    documents[route] = Document(path.read_text())
    d = documents[route]
    check(f"{route}: one page heading", len([n for n in d.nodes if n.tag == "h1"]) == 1)
    check(f"{route}: unique IDs", len(d.ids) == len([n for n in d.nodes if "id" in n.attrs]))
    check(f"{route}: real title and core content", any(n.tag == "title" and n.content().strip() for n in d.nodes) and "main" in d.ids)

for route, d in documents.items():
    for n in d.nodes:
        for attr in ("href", "src"):
            if attr not in n.attrs:
                continue
            u = urlsplit(n.attrs[attr])
            check(f"{route}: local {attr} {n.attrs[attr]}", not u.scheme and not u.netloc)
            dest = u.path or route
            p = PUBLIC / (unquote(dest).lstrip("/") + "index.html" if dest.endswith("/") else unquote(dest).lstrip("/"))
            check(f"{route}: target exists {n.attrs[attr]}", p.is_file())
            if u.fragment and dest in documents:
                check(f"{route}: anchor {n.attrs[attr]}", u.fragment in documents[dest].ids)
        if n.tag == "img":
            check(f"{route}: image sizing and alt", all(k in n.attrs for k in ("width", "height", "alt")))
            for candidate in n.attrs.get("srcset", "").split(","):
                if candidate.strip():
                    check(f"{route}: responsive asset {candidate.strip()}", (PUBLIC / candidate.split()[0].lstrip("/")).is_file())

d = documents["/contact/"]
controls = [n for n in d.nodes if n.tag in ("input", "select", "textarea")]
check("Contact: exactly four primary controls", [n.attrs.get("name") for n in controls] == ["name", "email", "category", "project"])
check("Contact: exactly four field groups", len([n for n in d.nodes if "field" in n.attrs.get("class", "").split()]) == 4)
check("Contact: form named by task heading", d.ids["enquiry-form"].attrs.get("aria-labelledby") == "contact-title")
check("Contact: single normal disclosure", len([n for n in d.nodes if n.attrs.get("id") == "local-disclosure"]) == 1)
check("Contact: normal disclosure hidden before enhancement", "hidden" in d.ids["local-disclosure"].attrs)
check("Contact: no-JS cannot submit controls", "disabled" in d.ids["enquiry-fields"].attrs and "disabled" in d.ids["preview-button"].attrs)
check("Contact: one concise no-JS paragraph", len([n for n in d.nodes if n.tag == "noscript"]) == 1 and len(next(n for n in d.nodes if n.tag == "noscript").content().split()) < 35)
check("Contact: help after complete workspace", d.nodes.index(next(n for n in d.nodes if n.tag == "aside")) > d.nodes.index(d.ids["clear-preview"]))
help_node = next(n for n in d.nodes if n.attrs.get("class") == "contact-help")
check("Contact: help is a closed native disclosure", help_node.tag == "details" and "open" not in help_node.attrs)
check("Contact: context belongs to Collection", d.ids["category-context"].parent is d.ids["category"].parent and d.ids["category"].attrs.get("aria-describedby") == "category-context")
check("Contact: success explicitly says nothing sent", "Nothing was sent." in d.ids["preview-title"].content())
for c in controls:
    check(f"Contact: {c.attrs['id']} labeled", any(n.tag == "label" and n.attrs.get("for") == c.attrs["id"] for n in d.nodes))
    for associated in c.attrs.get("aria-describedby", "").split():
        check(f"Contact: {c.attrs['id']} associated with {associated}", associated in d.ids)
for slug in ("ornamental-fish", "aquatic-plants", "driftwood"):
    category_doc = documents[f"/collections/{slug}/"]
    check(f"{slug}: incoming Contact context preserved", any(n.tag == "a" and n.attrs.get("href") == f"/contact/?category={slug}#enquiry" for n in category_doc.nodes))
    check(f"{slug}: Collections current section preserved", any(n.tag == "a" and n.attrs.get("href") == "/collections/" and n.attrs.get("aria-current") == "location" for n in category_doc.nodes))
check("Quality: general Contact destination preserved", any(n.tag == "a" and n.attrs.get("href") == "/contact/#enquiry" for n in documents["/quality/"].nodes))

for filename in ("frozen-file-hashes-before.json", "unchanged-page-hashes-before.json"):
    for rel, expected in json.loads((ROOT / "evidence" / filename).read_text()).items():
        check(f"Byte preservation: {rel}", hashlib.sha256((ROOT / rel).read_bytes()).hexdigest() == expected)
for rel in ("styles.css", "script.js", "favicon.svg"):
    check(f"Generated {rel} matches authoritative source", (PUBLIC / rel).read_bytes() == (ROOT / "demo" / rel).read_bytes())
for asset, metadata in json.loads((ROOT / "demo/assets/manifest.json").read_text()).items():
    check(f"Asset provenance: {asset}", hashlib.sha256((ROOT / "input/assets" / metadata["source"]).read_bytes()).hexdigest() == metadata["source_sha256"])
    for variant in metadata["variants"]:
        for location in ("demo/assets", "demo/public/assets"):
            check(f"Existing asset hash: {location}/{variant['file']}", hashlib.sha256((ROOT / location / variant["file"]).read_bytes()).hexdigest() == variant["sha256"])

# Run the actual stdlib handler. Replace only the unavailable listening server.
class NonListeningServer:
    server_address = ("127.0.0.1", 4211)
    def __init__(self, *_):
        pass
    def serve_forever(self):
        pass
    def server_close(self):
        pass


class Request:
    def __init__(self, method, path):
        self.input = io.BytesIO(f"{method} {path} HTTP/1.1\r\nHost: 127.0.0.1\r\nConnection: close\r\n\r\n".encode())
        self.output = bytearray()
    def makefile(self, *_):
        return self.input
    def sendall(self, data):
        self.output.extend(data)


with patch("http.server.ThreadingHTTPServer", NonListeningServer), patch.object(sys, "argv", ["serve.py", "--port", "4211"]), contextlib.redirect_stdout(io.StringIO()):
    handler = runpy.run_path(str(ROOT / "demo/serve.py"))["Handler"]
for method, path, expected in [("GET", r, 200) for r in routes] + [("HEAD", "/contact/", 200), ("GET", "/contact/?category=driftwood", 200), ("GET", "/unknown/", 404), ("POST", "/contact/", 501), ("GET", "/styles.css", 200), ("GET", "/script.js", 200)]:
    req = Request(method, path)
    handler(req, ("127.0.0.1", 10000), NonListeningServer())
    response = bytes(req.output)
    check(f"Actual in-process handler: {method} {path} -> {expected}", response.splitlines()[0].split()[1] == str(expected).encode())
    if expected == 200 and method == "GET" and path.split("?")[0] in documents:
        check(f"Handler delivers exact intended page: {path}", response.split(b"\r\n\r\n", 1)[1] == (PUBLIC / (path.split("?")[0].lstrip("/") + "index.html")).read_bytes())
    if expected == 404:
        check("Handler delivers custom recovery page", response.split(b"\r\n\r\n", 1)[1] == (PUBLIC / "404.html").read_bytes())

result = {"method": "HTML/source/hash checks and actual in-process HTTP handler; no listening server or browser", "passes": sum(c["status"] == "pass" for c in checks), "failures": sum(c["status"] == "fail" for c in checks), "checks": checks}
(ROOT / "evidence/static-results.json").write_text(json.dumps(result, indent=2) + "\n")
print(f"Static/handler checks: {result['passes']} pass, {result['failures']} fail")
for c in checks:
    if c["status"] == "fail":
        print(c["check"])
raise SystemExit(bool(result["failures"]))
