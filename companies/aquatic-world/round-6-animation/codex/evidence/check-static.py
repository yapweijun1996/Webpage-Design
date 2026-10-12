"""Source/build checks only. This script does not drive or render a browser."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
import hashlib
import json
import re

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'demo/public'
checks = []


def check(name, condition):
    assert condition, name
    checks.append(name)


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.elements = []
        self.ids = set()
        self.feed(path.read_text())

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.elements.append((tag, attrs))
        if 'id' in attrs:
            assert attrs['id'] not in self.ids, 'Duplicate ID: ' + attrs['id']
            self.ids.add(attrs['id'])


protected = json.loads((ROOT/'evidence/protected-before.json').read_text())
current_protected = {str(path.relative_to(ROOT)) for name in ('input', 'baseline') for path in (ROOT/name).rglob('*') if path.is_file()}
current_protected.update(name for name in ('AGENTS.md', 'CLAUDE.md', 'TASK.md', 'ACCEPTANCE.md', 'IMPLEMENTATION-PROMPT.txt') if (ROOT/name).is_file())
check('Protected trees have no added or removed files', current_protected == set(protected))
check('All 93 protected files retain recorded bytes', len(protected) == 93 and all(
    (ROOT/path).is_file() and digest(ROOT/path) == value for path, value in protected.items()))
expected_hash = '8e69f724fd29a138a438afa05739a77b81bc01e795eb115532fb8416efbeb3d1'
check('Source, owned and built original PNG hashes match', all(digest(ROOT/path) == expected_hash for path in (
    'input/animation/assets/hero-angelfish.png', 'demo/assets/hero-angelfish.png', 'demo/public/assets/hero-angelfish.png')))
check('PNG retains IHDR 1882x836 dimensions', (PUBLIC/'assets/hero-angelfish.png').read_bytes()[16:24] == (1882).to_bytes(4, 'big') + (836).to_bytes(4, 'big'))
manifest = json.loads((ROOT/'input/animation/input-manifest.json').read_text())
check('Canonical reference bytes agree with supplied frozen manifest', all(digest(ROOT/'input/animation'/entry['path']) == entry['sha256'] and (ROOT/'input/animation'/entry['path']).stat().st_size == entry['bytes'] for entry in manifest['frozen_reference_inputs']))

routes = ['/', '/collections/', '/collections/ornamental-fish/', '/collections/aquatic-plants/',
          '/collections/driftwood/', '/our-story/', '/quality/', '/contact/', '/404.html']


def route_file(route):
    return PUBLIC / (route.lstrip('/') if route.endswith('.html') else route.lstrip('/') + 'index.html')


pages = {route: Page(route_file(route)) for route in routes}
check('Eight distinct static routes plus 404', len(list(PUBLIC.rglob('*.html'))) == 9 and len({digest(route_file(r)) for r in routes}) == 9)
for route in routes[1:]:
    path = route_file(route)
    check('Inner output unchanged: ' + route, path.read_bytes() == (ROOT/'baseline/demo/public'/path.relative_to(PUBLIC)).read_bytes())

home = route_file('/').read_text()
baseline_home = (ROOT/'baseline/demo/public/index.html').read_text()
check('Home header remains byte-identical', re.search(r'<header.*?</header>', home, re.S).group() == re.search(r'<header.*?</header>', baseline_home, re.S).group())
check('Home content after the enhanced hero remains byte-identical', home[home.index('<section class="section home-collections"'):] == baseline_home[baseline_home.index('<section class="section home-collections"'):])
for filename in ['styles.css', 'script.js', 'site_data.py', 'favicon.svg']:
    check('Shared source unchanged: ' + filename, (ROOT/'demo'/filename).read_bytes() == (ROOT/'baseline/demo'/filename).read_bytes())
for filename in ['styles.css', 'script.js', 'home-motion.css', 'home-motion.js', 'favicon.svg']:
    check('Build equals source: ' + filename, (ROOT/'demo'/filename).read_bytes() == (PUBLIC/filename).read_bytes())

for route, page in pages.items():
    for tag, attrs in page.elements:
        for key in ('href', 'src'):
            if key not in attrs:
                continue
            url = urlsplit(attrs[key])
            assert not url.scheme and not url.netloc, 'Unexpected external runtime URL'
            assert all(part not in url.path.split('/') for part in ('input', 'baseline', 'comparison')), attrs[key]
            target_route = url.path or route
            target = route_file(target_route) if target_route.endswith('/') else PUBLIC/target_route.lstrip('/')
            assert target.is_file(), (route, attrs[key], str(target))
            if url.fragment:
                assert url.fragment in Page(target).ids, (route, attrs[key])
        if 'srcset' in attrs:
            for candidate in attrs['srcset'].split(','):
                assert (PUBLIC/candidate.strip().split()[0].lstrip('/')).is_file()
check('All HTML runtime links, fragments, sources and srcsets resolve locally', True)
check('Home-only enhancement resources', all('home-motion.' not in route_file(route).read_text() for route in routes[1:]))
check('Copy and primary CTA precede full source image', home.index('id="home-heading"') < home.index('Explore the collections') < home.index('src="/assets/hero-angelfish.png"'))
check('Full image has intrinsic dimensions and no srcset derivative', any(tag == 'img' and attrs.get('src') == '/assets/hero-angelfish.png' and attrs.get('width') == '1882' and attrs.get('height') == '836' and 'srcset' not in attrs for tag, attrs in pages['/'].elements))
check('Single light layer, ten deterministic decorations', home.count('class="water-light"') == 1 and '<div class="particles">' + '<i></i>' * 10 + '</div>' in home)
check('Decorations aria-hidden and native control hidden before enhancement', 'class="water-effects" aria-hidden="true"' in home and any(tag == 'button' and 'data-motion-toggle' in attrs and 'hidden' in attrs and attrs.get('type') == 'button' for tag, attrs in pages['/'].elements))
contact_fields = [(tag, attrs) for tag, attrs in pages['/contact/'].elements if tag in ('input', 'select', 'textarea')]
check('Contact has exactly Name, Email, Collection and Project groups', [attrs.get('name') for _, attrs in contact_fields] == ['name', 'email', 'category', 'project'])
check('Honest local preview and edit/clear controls remain', all(value in route_file('/contact/').read_text() for value in ('Nothing is sent or saved.', 'Preview created. Nothing was sent.', 'id="edit-brief"', 'id="clear-preview"')))

css = (ROOT/'demo/home-motion.css').read_text()
reference_css = (ROOT/'input/animation/styles.css').read_text()


def declarations(selector, source):
    match = re.search(re.escape(selector) + r'\s*\{([^}]+)\}', source)
    assert match, selector
    return dict((key.strip(), value.strip()) for key, value in (item.split(':', 1) for item in match[1].split(';') if ':' in item))


for selector, properties in [('.water-light', ['left', 'top', 'width', 'height', 'background', 'opacity']),
                             ('.particles', ['inset']), ('.particles i', ['width', 'height', 'border-radius', 'background', 'opacity'])]:
    actual = declarations('.home-scene ' + selector, css)
    expected = declarations(selector, reference_css)
    check('Canonical geometry: ' + selector, all(re.sub(r'\s', '', actual[key]) == re.sub(r'\s', '', expected[key]) for key in properties))
for number in range(1, 11):
    selector = '.particles i:nth-child(' + str(number) + ')'
    actual = declarations('.home-scene ' + selector, css)
    expected = declarations(selector, reference_css)
    check('Canonical particle ' + str(number), all(actual[key] == expected[key] for key in ('left', 'top')) and actual['--particle-delay'] == expected['animation-delay'] and actual.get('--particle-duration', '16s') == expected.get('animation-duration', '16s'))
for name in ('water-light', 'water-particle'):
    pattern = r'@keyframes ' + name + r'\s*\{\s*0%,\s*100%\s*\{[^}]+\}\s*50%\s*\{[^}]+\}\s*\}'
    check('Canonical matching cycle endpoints: ' + name, re.sub(r'\s', '', re.search(pattern, css)[0]) == re.sub(r'\s', '', re.search(pattern, reference_css)[0]))
check('Natural contain frame, without image transforms/crops', all(value in css for value in ('aspect-ratio:1882 / 836;', 'object-fit:contain;', 'overflow:hidden;', 'pointer-events:none;')) and all(value not in css for value in ('object-fit:cover', 'object-position:', 'scale(', 'perspective', 'filter:')))
check('Playback button dimensions, 16px text and explicit reduced-motion opt-in override', all(value in css for value in ('min-width:186px;', 'min-height:44px;', '16px/1.5', '[data-opt-in="true"]', 'animation-play-state:running!important;')))
check('No script polling, randomized motion or external requests', all(value not in (ROOT/'demo/home-motion.js').read_text() for value in ('setInterval', 'setTimeout', 'requestAnimationFrame', 'Math.random', 'fetch(', 'XMLHttpRequest', 'http:')))
result = {'kind':'static source/build checks; no browser rendering', 'passed':len(checks), 'checks':checks}
(ROOT/'evidence/static-checks.json').write_text(json.dumps(result, indent=2)+'\n')
print('PASS:', len(checks), 'static source/build checks; browser acceptance not inferred')
