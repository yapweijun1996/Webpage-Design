"""Package the current demos for Pages without changing either implementation."""
import argparse
import hashlib
from html.parser import HTMLParser
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
from urllib.parse import unquote, urljoin, urlsplit

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "companies/aquatic-world/round-7-immersive"
OUTPUT = ROOT / "_site"
ROUTES = ("", "collections/", "collections/ornamental-fish/",
          "collections/aquatic-plants/", "collections/driftwood/",
          "our-story/", "quality/", "contact/")
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--base", default="/Webpage-Design/")
args = parser.parse_args()
base = args.base.rstrip("/") + "/"
if not re.fullmatch(r"/(?:[A-Za-z0-9_-]+/)*", base):
    parser.error("--base must be an absolute directory path, such as /Webpage-Design/")


def rebase(html, prefix):
    def attribute(match):
        name, quote, value = match.groups()
        if name == "srcset":
            value = re.sub(r"(^|,\s*)(/[^/])", lambda m: m[1] + prefix + m[2][1:], value)
        elif value.startswith("/") and not value.startswith("//"):
            value = prefix + value[1:]
        return name + "=" + quote + value + quote
    return re.sub(r"\b(href|src|srcset|action|poster)=([\"'])(.*?)\2", attribute, html)


class References(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []

    def handle_starttag(self, tag, attrs):
        for name, value in attrs:
            if value and (name in {"href", "src", "action", "poster"}
                          or name.endswith("-src") or name.endswith("-poster")):
                self.urls.append(value)
            elif value and name == "srcset":
                self.urls.extend(part.strip().split()[0] for part in value.split(","))


with tempfile.TemporaryDirectory(prefix="webpage-pages-") as temp:
    temp = Path(temp)
    package = temp / "site"
    package.mkdir()
    manifest = {"base": base, "commit": os.environ.get("GITHUB_SHA"), "demos": {}}
    for model in ("codex", "claude"):
        demo = temp / model
        shutil.copytree(SOURCE / model / "demo", demo,
                        ignore=shutil.ignore_patterns("public", "dist", "node_modules", "__pycache__"))
        command = ["python3", "-B", "build.py"] if model == "codex" else ["node", "scripts/build.mjs"]
        subprocess.run(command, cwd=demo, check=True)
        built = demo / ("public" if model == "codex" else "dist")
        destination = package / "aquatic-world" / model
        shutil.copytree(built, destination)
        prefix = base + "aquatic-world/" + model + "/"
        for page in destination.rglob("*.html"):
            original = page.read_text()
            adapted = rebase(original, prefix)
            # Only root URL attributes may differ from the independent delivery.
            assert adapted.replace(prefix, "/") == original, f"Unexpected markup change: {page}"
            page.write_text(adapted)
        hashes = {}
        for file in sorted(destination.rglob("*")):
            if not file.is_file():
                continue
            relative = file.relative_to(destination).as_posix()
            if file.suffix != ".html":
                assert file.read_bytes() == (built / relative).read_bytes(), f"Changed runtime file: {relative}"
            hashes[relative] = hashlib.sha256(file.read_bytes()).hexdigest()
        assert all((destination / route / "index.html").is_file() for route in ROUTES)
        assert (destination / "404.html").is_file()
        manifest["demos"][model] = {"url": prefix, "routes": [prefix + route for route in ROUTES], "sha256": hashes}

    (package / "index.html").write_text(f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Webpage Design — demos</title></head><body>
<main><h1>Webpage Design</h1><h2>Aquatic World</h2>
<p>Current comparison demos: eight independent pages per website.</p>
<ul><li><a href="{base}aquatic-world/codex/">Codex · GPT-6.1 Sol</a></li>
<li><a href="{base}aquatic-world/claude/">Claude · Opus 5.5</a></li></ul>
<p>Immersive underwater Home: silent background film across the whole page, with live navigation, headings and actions. Desktop and mobile use individually composed scenes. Both implementations receive the same media and design brief.</p>
<p>Use the small background-motion control to pause. Reduced motion or unavailable playback keeps a still underwater environment. Creative acceptance remains open for testing.</p>
<p>Fictional design case. Contact only creates a local preview; no enquiry is sent.</p>
</main></body></html>''')
    (package / "404.html").write_text(f'''<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found</title></head>
<body><h1>Page not found</h1><p><a href="{base}">Return to the demo catalog</a></p></body></html>''')
    (package / ".nojekyll").touch()

    references = 0
    for page in package.rglob("*.html"):
        document = References()
        document.feed(page.read_text())
        for reference in document.urls:
            resolved = urlsplit(urljoin("https://pages.example" + base + page.relative_to(package).as_posix(), reference))
            if resolved.netloc != "pages.example":
                continue
            assert resolved.path.startswith(base), f"URL escapes Pages base: {page}: {reference}"
            target = package / unquote(resolved.path[len(base):])
            if target.is_dir():
                target /= "index.html"
            assert target.is_file(), f"Missing publication target: {page}: {reference}"
            references += 1
    manifest["verified_local_references"] = references
    (package / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    if OUTPUT.exists():
        shutil.rmtree(OUTPUT)
    shutil.copytree(package, OUTPUT)
    print(f"Pages package: {OUTPUT}; 16 content pages; {references} local references verified")
