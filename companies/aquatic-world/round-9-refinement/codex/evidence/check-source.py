"""Bounded build/preservation checks; this is not rendered acceptance."""
from hashlib import sha256
from html.parser import HTMLParser
from pathlib import Path
import json
import sys
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "demo/public"
sys.path.insert(0, str(ROOT / "baseline/demo"))


class Page(HTMLParser):
    def __init__(self, content):
        super().__init__()
        self.ids = set()
        self.references = []
        self.feed(content)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            assert attrs["id"] not in self.ids, f"Duplicate ID: {attrs['id']}"
            self.ids.add(attrs["id"])
        for name in ("href", "src", "data-landscape-src", "data-portrait-src",
                     "data-landscape-poster", "data-portrait-poster"):
            if attrs.get(name):
                self.references.append(attrs[name])


def route_file(route):
    return PUBLIC / ("index.html" if route == "/" else
                     route.lstrip("/") + "index.html" if route.endswith("/") else
                     route.lstrip("/"))


# Load only definitions; never execute the immutable baseline's build/writes.
baseline_path = ROOT / "baseline/demo/build.py"
definitions = baseline_path.read_text().split("\nOUT.mkdir(exist_ok=True)", 1)[0]
baseline = {"__file__": str(baseline_path)}
exec(compile(definitions, str(baseline_path), "exec"), baseline)
pages = {}
unchanged_pages = []
for route, title, description, render in baseline["PAGES"]:
    actual = route_file(route).read_text()
    pages[route_file(route)] = Page(actual)
    if route != "/":
        expected = baseline["document"](route, title, description, render)
        assert actual == expected, f"Inner-page output changed: {route}"
        assert "home-motion" not in actual and "<video" not in actual
        unchanged_pages.append(route)

assert len(pages) == 9
link_count = 0
for current, page in pages.items():
    for reference in page.references:
        parts = urlsplit(reference)
        assert not parts.scheme and not parts.netloc, f"External runtime link: {reference}"
        target = route_file(parts.path) if parts.path else current
        assert target.is_file(), f"Missing target: {current.name}: {reference}"
        if parts.fragment:
            assert target in pages and parts.fragment in pages[target].ids, reference
        link_count += 1

home = route_file("/").read_text()
assert "FISH · PLANTS · DRIFTWOOD" in home
assert "A world beneath <br>the surface." in home
assert "Discover ornamental fish, aquatic plants and natural driftwood." in home
assert '<a class="home-primary" href="/collections/">Explore the collections' in home
assert '<source media="(min-aspect-ratio: 6/5)"' in home
assert '<video id="home-background" muted loop playsinline preload="none"' in home
assert not any(name in home.split("<video", 1)[1].split(">", 1)[0]
               for name in (' src="', "autoplay"))

contact = route_file("/contact/").read_text()
for field in ("name", "email", "category", "project"):
    assert f'name="{field}"' in contact
for control in ("preview-button", "edit-brief", "clear-preview", "clear-brief"):
    assert control in pages[route_file("/contact/")].ids
for slug in ("ornamental-fish", "aquatic-plants", "driftwood"):
    assert f'/contact/?category={slug}#enquiry' in route_file(f"/collections/{slug}/").read_text()

media = {}
for name in ("landscape.mp4", "portrait.mp4", "landscape-poster.webp", "portrait-poster.webp"):
    supplied = (ROOT / "input/media" / name).read_bytes()
    for directory in ("baseline/demo/assets/immersive", "demo/assets/immersive",
                      "demo/public/assets/immersive"):
        assert supplied == (ROOT / directory / name).read_bytes(), f"Media changed: {name}"
    media[name] = {"bytes": len(supplied), "sha256": sha256(supplied).hexdigest()}

changed = []
for original in (ROOT / "baseline/demo").rglob("*"):
    if original.is_file():
        relative = original.relative_to(ROOT / "baseline/demo")
        if original.read_bytes() != (ROOT / "demo" / relative).read_bytes():
            changed.append(str(relative))
assert sorted(changed) == ["build.py", "home-motion.css", "home-motion.js"], changed

result = {
    "check_type": "source and static build preservation; no browser",
    "route_outputs": len(pages),
    "resolved_local_references": link_count,
    "byte_identical_inner_and_404_outputs": unchanged_pages,
    "changed_baseline_source_files": sorted(changed),
    "exact_media": media,
    "arrival_copy_category_context_and_four_contact_groups": "passed",
    "rendered_acceptance": "not run; coordinator required",
}
(ROOT / "evidence/source-check-results.json").write_text(json.dumps(result, indent=2) + "\n")
print(json.dumps(result, indent=2))
