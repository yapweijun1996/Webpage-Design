"""Bounded source/integrity checks; no rendering or browser behavior implied."""
from pathlib import Path
import hashlib
import json
import re

ROOT = Path(__file__).resolve().parents[2]
STAGE = ROOT / 'evidence/stage-2'
passed = []


def check(label, condition):
    if not condition:
        raise AssertionError(label)
    passed.append(label)
    print('PASS:', label)


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


before = json.loads((STAGE / 'before-sha256.json').read_text())
allowed = {'demo/home-motion.css', 'demo/public/home-motion.css'}
changed = {name for name, old in before.items() if not (ROOT / name).is_file() or digest(ROOT / name) != old}
check('Only Home source and built stylesheet changed among captured files', changed == allowed)
new = {str(p.relative_to(ROOT)) for p in ROOT.rglob('*') if p.is_file()} - before.keys()
check('New files stay in stage-2 or the permitted root README', all(name.startswith('evidence/stage-2/') or name == 'README.md' for name in new))
check('Frozen inputs, baseline, root contracts and original evidence remain byte-identical', all(digest(ROOT / name) == old for name, old in before.items() if not name.startswith('demo/')))
css = (ROOT / 'demo/home-motion.css').read_text()
check('Source and built Home stylesheet match', css == (ROOT / 'demo/public/home-motion.css').read_text())
compact = css.split('@media(max-width:1119px) {', 1)[1].split('/* This is the same orientation rule', 1)[0]
header = compact.split('.home-immersive .header-inner {', 1)[1].split('}', 1)[0]
brand = compact.split('.home-immersive .site-header .brand {', 1)[1].split('}', 1)[0]
wordmark = compact.split('.home-immersive .site-header .wordmark {', 1)[1].split('}', 1)[0]
menu = compact.split('.home-immersive .mobile-menu {', 1)[1].split('}', 1)[0]
check('Compact header wraps naturally with existing column gap and 8px row gap', all(x in header for x in ('display:flex;', 'flex-wrap:wrap;', 'column-gap:20px;', 'row-gap:8px;')))
check('Brand may use available row width and wraps only at ordinary word boundaries', 'flex:0 1 auto;' in brand and 'max-width:100%;' in brand and 'white-space:normal;' in wordmark and 'overflow-wrap:normal;' in wordmark and 'anywhere' not in wordmark)
check('Menu/Close reserve their content width and align to the right in either row', 'flex:none;' in menu and 'margin-inline-start:auto;' in menu)
check('Panel remains absolute at header-inner bottom and scrollable within measured visible budget', all(x in compact for x in ('position:absolute;', 'inset:100% calc(0px - var(--home-header-inset)) auto;', '100svh - var(--home-menu-top', 'overflow-y:auto;', 'background:var(--ocean);')))
check('Opaque open state changes neither header minimum nor control layout', '.home-immersive .site-header:has(.mobile-menu[open]) {\n    background:var(--ocean);\n    padding-bottom:0;' in compact and '.home-immersive .mobile-menu[open] {\n    position:static;' in compact)
# Reverse the intended CSS patch and require identity with the pre-edit hash. This
# verifies every unrelated rule, including normal font sizes/insets and hero/media.
original = css.replace('    display:flex;\n    flex-wrap:wrap;\n    column-gap:20px;\n    row-gap:8px;', "    grid-template-columns:minmax(0,1fr) max-content;\n    grid-template-areas:'brand menu';\n    column-gap:20px;", 1)
original = original.replace('    flex:0 1 auto;\n    min-width:0;\n    max-width:100%;', '    min-width:0;\n    max-width:100%;', 1)
original = original.replace('    white-space:normal;\n    overflow-wrap:normal;', '    white-space:normal;\n    overflow-wrap:anywhere;', 1)
original = original.replace('    display:block;\n    flex:none;\n    margin-inline-start:auto;\n    grid-column:2;', '    display:block;\n    grid-column:2;', 1)
check('Exact patch reversal matches pre-edit stylesheet; typography, scene and all other CSS unchanged', hashlib.sha256(original.encode()).hexdigest() == before['demo/home-motion.css'])
home = (ROOT / 'demo/public/index.html').read_text()
nav = re.search(r'<nav id="home-menu-links".*?</nav>', home).group()
check('Five independent Home destinations and current-page state remain', re.findall(r'href="([^"]+)"', nav) == ['/', '/collections/', '/our-story/', '/quality/', '/contact/'] and 'aria-current="page"' in nav)
check('Complete live wordmark and Menu/Close labels remain', '<span class="wordmark">AQUATIC WORLD</span>' in home and '<span class="menu-closed">Menu</span><span class="menu-open">Close</span>' in home)
check('Native details fallback and nonmodal semantics remain', '<details class="mobile-menu">' in home and 'aria-modal' not in home and 'role="dialog"' not in home)
routes = ['index.html', 'collections/index.html', 'collections/ornamental-fish/index.html', 'collections/aquatic-plants/index.html', 'collections/driftwood/index.html', 'our-story/index.html', 'quality/index.html', 'contact/index.html', '404.html']
check('Eight content routes plus 404 remain built', all((ROOT / 'demo/public' / route).is_file() for route in routes))
check('Inner outputs remain byte-identical and load no Home film resources', all(digest(ROOT / 'demo/public' / route) == before['demo/public/' + route] and '/home-motion' not in (ROOT / 'demo/public' / route).read_text() for route in routes[1:]))
check('Shared styles, both controllers and build/content sources are byte-identical', all(digest(ROOT / 'demo' / name) == before['demo/' + name] for name in ('styles.css', 'script.js', 'home-motion.js', 'build.py', 'site_data.py')))
media = ['landscape.mp4', 'portrait.mp4', 'landscape-poster.webp', 'portrait-poster.webp']
check('All four runtime media match frozen bytes in source and built output', all(digest(ROOT / 'input/media' / name) == digest(ROOT / 'demo/assets/immersive' / name) == digest(ROOT / 'demo/public/assets/immersive' / name) for name in media))
controller = (ROOT / 'demo/public/home-motion.js').read_text()
check('Existing resize/observer/open measurement still owns remaining-height variable', all(x in controller for x in ('headerInner.getBoundingClientRect().bottom', "window.addEventListener('resize', updateMenuGeometry)", 'new ResizeObserver(updateMenuGeometry).observe(headerInner)', 'function syncMenu() {\n    updateMenuGeometry();')))
(STAGE / 'source-results.json').write_text(json.dumps({'passed': passed, 'captured_files': len(before), 'changed': sorted(changed), 'limits': 'Source/output/hash assertions only. Normal and enlarged rendered fit, scrolling and actual keyboard reachability remain unrun.'}, indent=2) + '\n')
print(f'{len(passed)} focused source/integrity checks passed.')
