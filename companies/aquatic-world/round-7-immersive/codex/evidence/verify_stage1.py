"""Source/build invariants only. This does not render a page or exercise a browser."""
import ast
import hashlib
from html import escape
from html.parser import HTMLParser
import json
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'demo/public'
checks = []


def checked(name, condition, detail):
    assert condition, name
    checks.append({'check': name, 'result': 'pass', 'detail': detail})


class Page(HTMLParser):
    def __init__(self, content):
        super().__init__()
        self.tags = []
        self.text = []
        self.feed(content)

    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))

    def handle_data(self, data):
        self.text.append(data)


# Execute only pure rendering definitions from the immutable baseline, in memory.
# Its normal build module is deliberately never imported or run.
baseline = ROOT / 'baseline/demo'
namespace = {'escape': escape, 'ASSETS': json.loads((baseline / 'assets/manifest.json').read_text()),
             'ARROW': '<span class="arrow" aria-hidden="true">↗</span>'}
exec(compile((baseline / 'site_data.py').read_text(), 'baseline-site-data', 'exec'), namespace)
tree = ast.parse((baseline / 'build.py').read_text())
definitions = [node for node in tree.body if isinstance(node, ast.FunctionDef)
               or isinstance(node, ast.Assign) and any(isinstance(t, ast.Name) and t.id == 'PAGES' for t in node.targets)]
exec(compile(ast.Module(body=definitions, type_ignores=[]), 'baseline-renderers', 'exec'), namespace)

route_paths = {}
for route, title, description, render in namespace['PAGES']:
    relative = '404.html' if route == '/404.html' else route.strip('/') + '/index.html' if route != '/' else 'index.html'
    path = PUBLIC / relative
    route_paths[route] = path
    checked('Built route ' + route, path.is_file(), relative)
    if route != '/':
        expected = namespace['document'](route, title, description, render)
        checked('Preserved baseline HTML ' + route, path.read_text() == expected,
                'Byte-identical rendered HTML from baseline definitions, evaluated without baseline writes.')
        checked('No Home resources ' + route, '/home-motion.' not in expected and '<video' not in expected,
                'Inner page does not load the Home controller, styles, or media.')
checked('Eight pages plus 404', len(list(PUBLIC.rglob('*.html'))) == 9, 'All independent static route entry points exist.')

for name in ['styles.css', 'script.js', 'home-motion.css', 'home-motion.js', 'favicon.svg']:
    checked('Built resource matches source ' + name,
            (PUBLIC / name).read_bytes() == (ROOT / 'demo' / name).read_bytes(),
            'Generated output contains the final source bytes.')

shared = ['styles.css', 'script.js', 'site_data.py', 'serve.py', 'favicon.svg', 'tools/prepare_assets.py']
for relative in shared:
    checked('Preserved shared source ' + relative,
            (ROOT / 'demo' / relative).read_bytes() == (baseline / relative).read_bytes(), 'Byte-identical to own baseline.')

home_content = (PUBLIC / 'index.html').read_text()
home = Page(home_content)
text = ' '.join(''.join(home.text).split())
copy = ['FISH · PLANTS · DRIFTWOOD', 'Discover ornamental fish, aquatic plants and natural driftwood.',
        'Explore the collections', 'Scroll to explore', 'Colour, form and gentle movement.',
        'Texture, depth and a living landscape.', 'Natural lines and structure.',
        'Explore the elements of an aquatic landscape, and the questions that shape it.', 'Discuss a project']
for phrase in copy:
    checked('Exact copy: ' + phrase, phrase in text, 'Live HTML text.')
for heading in ['A world beneath<br>the surface.', 'Three elements.<br>One aquatic world.', 'A closer connection<br>to nature.']:
    checked('Heading: ' + heading.replace('<br>', ' / '), heading in home_content, 'Intended line break in real HTML.')

videos = [attrs for tag, attrs in home.tags if tag == 'video']
checked('Single decorative deferred video', len(videos) == 1, 'One background persists behind all Home chapters.')
video = videos[0]
checked('No eager video source', 'src' not in video and video.get('preload') == 'none', 'Only literal deferred data attributes are present.')
checked('Inline silent looping contract', all(name in video for name in ['muted', 'loop', 'playsinline'])
        and video.get('tabindex') == '-1' and 'controls' not in video, 'Decorative, inline, silent media without player chrome.')
query = '(min-width: 900px) and (min-aspect-ratio: 6/5)'
checked('Shared responsive picture query', any(tag == 'source' and attrs.get('media') == query for tag, attrs in home.tags), query)
for mode in ['landscape', 'portrait']:
    checked('Deferred MP4 URL ' + mode, video[f'data-{mode}-src'] == f'/assets/immersive/{mode}.mp4', 'Literal HTML URL available for packaging.')
    name = f'{mode}-poster.webp'
    checked('Own poster URL ' + mode, video[f'data-{mode}-poster'] == '/assets/immersive/' + name, 'Literal HTML URL.')
    checked('Poster byte identity ' + mode,
            (PUBLIC / 'assets/immersive' / name).read_bytes() == (ROOT / 'input/media' / name).read_bytes(),
            hashlib.sha256((PUBLIC / 'assets/immersive' / name).read_bytes()).hexdigest())
    checked('Pending MP4 remains absent ' + mode, not (PUBLIC / 'assets/immersive' / f'{mode}.mp4').exists(), 'Not generated, substituted or motion-tested.')

checked('Three continuous foreground chapters', len([1 for tag, attrs in home.tags if tag == 'section']) == 3,
        'Arrival, collection and perspective; footer follows in same Home body.')
checked('No rejected runtime presentation', all(token not in home_content for token in [
    'home-motion-hero', 'home-motion-layout', 'home-scene', 'water-effects', 'particles',
    'scene-caption', '/hero-angelfish', '/input/', '/baseline/', '/reference/', '<figure']),
    'No framed scene, particles, concept screenshots, extra photos, or immutable runtime imports.')
checked('Native no-JS menu and hidden motion utility', any(tag == 'details' for tag, _ in home.tags)
        and any(tag == 'button' and 'data-motion-toggle' in attrs and 'hidden' in attrs for tag, attrs in home.tags),
        'Useful native disclosure navigation; controller shows the utility only with JS.')

expected_global = ['/', '/collections/', '/our-story/', '/quality/', '/contact/']
for label in ['Main navigation', 'Mobile navigation', 'Footer navigation']:
    start = home_content.index(f'aria-label="{label}"')
    fragment = home_content[start:home_content.index('</nav>', start)]
    parsed = Page('<nav ' + fragment)
    checked('Real global destinations: ' + label, [a['href'] for tag, a in parsed.tags if tag == 'a'] == expected_global,
            'Five independent page links; Home alone is current.')
checked('One arrival CTA and no header CTA', home_content.count('Explore the collections') == 1
        and 'header-cta' not in home_content, 'One gold collection action in arrival; Contact stays a page link.')

# Resolve actual static links/assets and fragment targets, permitting only the two absent MP4s.
pending = {'/assets/immersive/landscape.mp4', '/assets/immersive/portrait.mp4'}
resolved_count = 0
for path in route_paths.values():
    parsed = Page(path.read_text())
    for tag, attrs in parsed.tags:
        urls = [value for key, value in attrs.items() if key in ['href', 'src', 'poster',
                'data-landscape-src', 'data-portrait-src', 'data-landscape-poster', 'data-portrait-poster']]
        urls += [entry.strip().split()[0] for entry in attrs.get('srcset', '').split(',') if entry.strip()]
        for value in urls:
            if value in pending:
                continue
            url = urlsplit(value)
            assert not url.scheme and not url.netloc, f'External runtime URL: {value}'
            target = PUBLIC / url.path.lstrip('/') if url.path else path
            if url.path.endswith('/'):
                target /= 'index.html'
            assert target.is_file(), f'Missing static resource: {value}'
            if url.fragment:
                ids = {a['id'] for _, a in Page(target.read_text()).tags if 'id' in a}
                assert url.fragment in ids, f'Missing fragment: {value}'
            resolved_count += 1
checked('Static runtime references resolve', True, f'{resolved_count} link/asset/fragment references checked; two deliberate future MP4 exceptions.')

css = (ROOT / 'demo/home-motion.css').read_text()
js = (ROOT / 'demo/home-motion.js').read_text()
checked('Centered cover without media transforms', 'object-fit:cover;' in css and 'object-position:center;' in css,
        'Fixed environment and shared centered-cover treatment; subject crop still needs rendered review.')
checked('No replacement effects or root URLs in controller/theme', all(token not in css + js for token in [
    '@keyframes', 'setInterval(', 'fetch(', 'currentTime', 'url(', '/assets/', '/collections/', 'IntersectionObserver']),
    'No generated effects, seeking, scroll-linked playback, external fetches or JS/CSS asset root URLs.')
checked('Home typography scope', '--sans:Arial,Helvetica,sans-serif;' in css and '--serif:Georgia' in css
        and (ROOT / 'demo/styles.css').read_bytes() == (baseline / 'styles.css').read_bytes(), 'Shared inner-page typography untouched.')
checked('CSS block delimiters balanced', css.count('{') == css.count('}'), 'Basic syntax invariant, not a CSS rendering test.')

frozen = json.loads((ROOT / 'evidence/immutable-before.json').read_text())
for relative, digest in frozen.items():
    assert hashlib.sha256((ROOT / relative).read_bytes()).hexdigest() == digest, f'Immutable file changed: {relative}'
checked('Protected inputs/baseline/contracts intact', True, f'{len(frozen)} frozen file hashes match.')

report = {'scope': 'Source and generated-file invariants only; no browser, native media, motion or rendered acceptance claims.',
          'checks': checks, 'count': len(checks)}
(ROOT / 'evidence/source-checks.json').write_text(json.dumps(report, indent=2) + '\n')
print(f'PASS: {len(checks)} source/build invariants; {resolved_count} static runtime references. Browser and actual films not tested.')
