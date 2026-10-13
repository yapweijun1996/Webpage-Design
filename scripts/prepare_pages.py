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
SOURCE = ROOT / "companies/aquatic-world/round-9-refinement"
COMPARISON = ROOT / "companies/aquatic-world/comparison/round-9-refinement"
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

    comparison = package / 'comparison'
    (comparison / 'evidence').mkdir(parents=True)
    viewer = (COMPARISON / 'preview.html').read_text().replace(
        'href="RESULTS.md"',
        'href="https://github.com/yapweijun1996/Webpage-Design/blob/main/companies/aquatic-world/comparison/round-9-refinement/RESULTS.md"')
    (comparison / 'index.html').write_text(viewer)
    for candidate in ('codex', 'claude'):
        for state in ('390x844-final', 'mobile-menu-final', '1440x900-final',
                      '390x844-text200-menu-final', 'mobile-footer-final',
                      'mobile-heading-1-final', '844x390-final', '667x375-final'):
            filename = f'{candidate}-{state}.jpg'
            shutil.copyfile(COMPARISON / 'evidence' / filename, comparison / 'evidence' / filename)
    manifest['comparison'] = {'url': base + 'comparison/', 'sha256': {
        file.relative_to(comparison).as_posix(): hashlib.sha256(file.read_bytes()).hexdigest()
        for file in sorted(comparison.rglob('*')) if file.is_file()}}

    (package / "index.html").write_text(f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="Explore two independent Aquatic World website demos, built from the same design brief and underwater films.">
<meta name="theme-color" content="#041d25"><title>Webpage Design — Aquatic World</title>
<style>
*{{box-sizing:border-box}}body{{margin:0;background:#041d25;color:#f1f0e7;font:16px/1.6 Arial,sans-serif}}
a{{color:inherit}}a:focus-visible{{outline:3px solid #d1c18b;outline-offset:5px}}
.shell{{width:min(1320px,100% - 48px);margin:auto}}header{{display:flex;justify-content:space-between;gap:24px;align-items:center;padding:28px 0;border-bottom:1px solid #ffffff24}}
.label{{font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#c5d4d1}}header a{{text-underline-offset:6px}}
.intro{{padding:64px 0 40px;max-width:780px}}h1{{font:clamp(40px,6vw,76px)/1.08 Georgia,serif;margin:14px 0 24px}}p{{color:#c5d4d1;max-width:690px}}.intro p{{font-size:18px}}
.versions{{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:28px}}article{{min-width:0;border:1px solid #ffffff24;background:#08252d}}
.preview{{display:block;overflow:hidden}}.preview img{{display:block;width:100%;height:auto;aspect-ratio:16/10}}
.details{{padding:24px}}h2{{font:30px/1.2 Georgia,serif;margin:0 0 8px}}.details p{{margin:0 0 24px}}
.action{{display:inline-flex;align-items:center;gap:24px;min-height:48px;padding:12px 20px;background:#d1c18b;color:#102a2c;text-decoration:none;font-weight:700}}
.compare{{margin:40px 0 0;padding:30px 0;border-top:1px solid #ffffff24;border-bottom:1px solid #ffffff24;display:flex;align-items:center;justify-content:space-between;gap:24px}}.compare p{{margin:6px 0 0}}.compare a{{text-underline-offset:6px}}
footer{{padding:24px 0 36px;font-size:14px;color:#a3b8b8}}footer p{{margin:0}}
@media(max-width:720px){{.shell{{width:calc(100% - 32px)}}header{{padding:20px 0;align-items:flex-start;flex-wrap:wrap}}.intro{{padding:40px 0 28px}}.versions{{grid-template-columns:1fr;gap:24px}}.details{{padding:20px}}.compare{{align-items:flex-start;flex-direction:column}}}}
</style></head><body><div class="shell">
<header><span class="label">Webpage Design / Case 01</span><a href="{base}comparison/">Compare the designs</a></header>
<main><div class="intro"><span class="label">Aquatics · Website design study</span><h1>Aquatic World</h1>
<p>One underwater world. Two independent interpretations. Explore a complete eight-page website in each version, with film woven into the whole Home experience.</p></div>
<section class="versions" aria-label="Website versions">
<article><a class="preview" href="{base}aquatic-world/codex/" aria-label="Explore the Codex website"><img src="{base}comparison/evidence/codex-1440x900-final.jpg" width="1440" height="900" alt="Codex Home: a cinematic aquarium scene with a left-aligned title and gold collection action."></a><div class="details"><h2>Codex</h2><p>GPT-6.1 Sol</p><a class="action" href="{base}aquatic-world/codex/">Explore website <span aria-hidden="true">↗</span></a></div></article>
<article><a class="preview" href="{base}aquatic-world/claude/" aria-label="Explore the Claude website"><img src="{base}comparison/evidence/claude-1440x900-final.jpg" width="1440" height="900" alt="Claude Home: an immersive aquarium scene with integrated navigation, heading and gold collection action."></a><div class="details"><h2>Claude</h2><p>Opus 5.5</p><a class="action" href="{base}aquatic-world/claude/">Explore website <span aria-hidden="true">↗</span></a></div></article>
</section>
<aside class="compare"><div><strong>The same brief. The same films.</strong><p>Compare desktop, phone, Menu and scrolling details side by side.</p></div><a href="{base}comparison/">View the comparison →</a></aside>
</main><footer><p>Fictional design case. Contact creates a local preview; no enquiry is sent. Both sites include a background-motion control and a reduced-motion still-image experience.</p></footer>
</div></body></html>''')
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
