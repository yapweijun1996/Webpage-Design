"""Bounded source/output checks; no rendering, server or baseline writes."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
import hashlib
import json
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.dont_write_bytecode = True
sys.path.insert(0, str(ROOT / 'demo'))
results = []

def check(name, condition):
    if not condition:
        raise AssertionError(name)
    results.append(name)
    print('PASS:', name)

before = json.loads((ROOT / 'evidence/protected-before.json').read_text())
protected_now = {str(p.relative_to(ROOT)) for p in ROOT.rglob('*') if p.is_file()
                 and p.relative_to(ROOT).parts[0] not in ('demo', 'evidence') and p != ROOT / 'README.md'}
check('No new or removed files in protected input/baseline/root scope', protected_now == set(before))
check('All recorded frozen input, baseline and root contracts unchanged', all(
    (ROOT / name).is_file() and hashlib.sha256((ROOT / name).read_bytes()).hexdigest() == value
    for name, value in before.items()))
changed = [str(p.relative_to(ROOT / 'baseline/demo')) for p in (ROOT / 'baseline/demo').rglob('*')
           if p.is_file() and (ROOT / 'demo' / p.relative_to(ROOT / 'baseline/demo')).read_bytes() != p.read_bytes()]
check('Only three Home presentation/controller source files differ from baseline',
      sorted(changed) == ['home-motion.css', 'home-motion.js', 'script.js'])
base_script = (ROOT / 'baseline/demo/script.js').read_text()
script = (ROOT / 'demo/script.js').read_text()
check('Shared inner navigation and complete Contact implementation preserved verbatim',
      script.replace("  // Home owns its nonmodal navigation and movie suspension together.\n  if (document.querySelector('[data-home-environment]')) return;\n", '') == base_script)

# Load baseline render functions but omit the output-writing build footer.
namespace = {'__file__': str(ROOT / 'baseline/demo/build.py'), '__name__': 'baseline_contract'}
source = (ROOT / 'baseline/demo/build.py').read_text().split('OUT.mkdir(exist_ok=True)')[0]
exec(compile(source, namespace['__file__'], 'exec'), namespace)
public = ROOT / 'demo/public'
check('Exactly eight content HTML pages plus 404', len(list(public.rglob('*.html'))) == 9)
for route, title, description, render in namespace['PAGES']:
    target = public / ('404.html' if route == '/404.html' else route.strip('/') + '/index.html' if route != '/' else 'index.html')
    expected = namespace['document'](route, title, description, render)
    check(f'Unchanged generated markup/content: {route}', target.read_text() == expected)
    if route != '/':
        check(f'No Home film or Home theme loaded: {route}', 'home-motion' not in target.read_text() and '<video' not in target.read_text())

manifest = json.loads((ROOT / 'input/media/manifest.json').read_text())
for name in ('landscape.mp4', 'portrait.mp4', 'landscape-poster.webp', 'portrait-poster.webp'):
    supplied = (ROOT / 'input/media' / name).read_bytes()
    check(f'Media identity across frozen source, baseline, demo and output: {name}',
          hashlib.sha256(supplied).hexdigest() == manifest['assets'][name]['sha256'] and all(
              (ROOT / folder / name).read_bytes() == supplied
              for folder in ('baseline/demo/assets/immersive', 'demo/assets/immersive', 'demo/public/assets/immersive')))
for name in ('styles.css', 'script.js', 'home-motion.css', 'home-motion.js', 'favicon.svg'):
    check(f'Built resource matches source: {name}', (public / name).read_bytes() == (ROOT / 'demo' / name).read_bytes())

class References(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []
    def handle_starttag(self, tag, attributes):
        for key, value in attributes:
            if not value:
                continue
            if key in ('href', 'src', 'poster') or key in ('data-landscape-src', 'data-portrait-src', 'data-landscape-poster', 'data-portrait-poster'):
                self.urls.append(value)
            elif key == 'srcset':
                self.urls.extend(part.strip().split()[0] for part in value.split(','))

for base in ('', '/Webpage-Design/companies/aquatic-world/round-8-fusion/codex/demo/public'):
    count = 0
    for html in public.rglob('*.html'):
        parser = References()
        parser.feed(html.read_text())
        for url in parser.urls:
            if not url.startswith('/'):
                continue
            # Model the coordinator's HTML-attribute rebasing, including deferred media.
            rebased = base + url
            parsed = urlsplit(rebased)
            local_path = parsed.path[len(base):].lstrip('/')
            target = public / local_path
            if parsed.path.endswith('/'):
                target /= 'index.html'
            if not target.is_file():
                raise AssertionError(f'Unresolved URL {rebased} in {html}')
            count += 1
    check(f'All {count} asset/page/deferred references resolve with coordinator base {base or "/"}', True)

home = (public / 'index.html').read_text()
css = (ROOT / 'demo/home-motion.css').read_text()
motion = (ROOT / 'demo/home-motion.js').read_text()
check('Landscape policy exact and independent of width in HTML/CSS/controller',
      'media="(min-aspect-ratio: 6/5)"' in home and "matchMedia('(min-aspect-ratio: 6/5)')" in motion
      and '@media (min-aspect-ratio:6/5)' in css and 'min-width:900' not in css and 'min-width: 900' not in motion)
check('Cover/crop and near-square policy retained', all(token in css for token in
      ('object-fit:cover;', 'object-position:50% 30%;', 'object-position:50% 50%;', '@media (4/5 <= aspect-ratio < 6/5)', 'padding-top:70svh;')))
check('No modal semantics, inert isolation, Home scroll lock or Tab interception',
      all(token not in motion + css + home for token in ('aria-modal', "'dialog'", '.inert', 'home-menu-open', "event.key !== 'Tab'")))
check('Opaque top disclosure and bounded scrolling source contracts', all(token in css for token in
      ('inset:100% calc(0px - var(--home-header-inset)) auto;',
       'max-height:calc(100svh - var(--home-menu-top,calc(var(--home-header-height) + env(safe-area-inset-top))) - env(safe-area-inset-bottom));',
       'overflow-y:auto;', 'min-height:56px;', 'background:var(--ocean);')))
check('No-JS Home retains native details/summary, five destinations and no eager video src',
      '<details class="mobile-menu">' in home and '<summary aria-controls="home-menu-links">' in home
      and '<video id="home-background" muted loop playsinline preload="none"' in home
      and ' src=' not in home.split('<video', 1)[1].split('>', 1)[0])

# This is a conservative arithmetic budget, NOT rendered typography or geometry.
budgets = []
for width, height in ((390,844),(360,800),(320,800)):
    inset = 16 if width < 359 else 20
    copy_top = height * (.53 if width < 359 else .56)
    heading_size = max(39, min(width * .102, 40))
    heading_top = copy_top + 11 * 1.6 + 16
    # Allow three heading and body lines at 320; the wider phones budget two each.
    heading_lines = 3 if width == 320 else 2
    body_lines = 3 if width == 320 else 2
    cta_top = heading_top + heading_lines * heading_size * 1.06 + 21 + body_lines * 16 * 1.55 + 24
    cta_bottom = cta_top + 52
    check(f'Conservative unrendered first-action budget fits {width}x{height}', cta_bottom < height - 24)
    budgets.append({'viewport': f'{width}x{height}', 'content_width': width - 2*inset,
                    'heading_top_estimate': round(heading_top,1), 'heading_lines_budget': heading_lines,
                    'body_lines_budget': body_lines, 'cta_top_estimate': round(cta_top,1),
                    'cta_bottom_estimate': round(cta_bottom,1)})
check('Unrendered 390x844 disclosure budget ends in 360-380 above unchanged heading',
      360 <= 64 + 1 + 5*56 + 24 <= 380 and 64 + 1 + 5*56 + 24 < budgets[0]['heading_top_estimate'])
(ROOT / 'evidence/contract-results.json').write_text(json.dumps({'passed': results, 'phone_arithmetic_only': budgets,
    'menu_end_arithmetic_only': 369, 'rendered_checks': 'Not run; coordinator required'}, indent=2)+'\n')
print(f'{len(results)} source/output checks passed. Phone/menu numbers are arithmetic estimates only.')
