"""Bounded source/output/integrity assertions; never browser/rendered evidence."""
from pathlib import Path
import difflib
import hashlib
import json
import re

ROOT = Path(__file__).resolve().parents[2]
STAGE = ROOT / 'evidence/stage-3'
passed = []


def check(label, condition):
    if not condition:
        raise AssertionError(label)
    passed.append(label)
    print('PASS:', label)


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def bodies(css, selector):
    # Inspect leaf declarations, including the same selector in media blocks.
    return re.findall(re.escape(selector) + r'\s*\{([^{}]*)\}', css)


before = json.loads((STAGE / 'before-sha256.json').read_text())
allowed = {'README.md', 'demo/home-motion.css', 'demo/public/home-motion.css'}
changed = {name for name, old in before.items() if not (ROOT / name).is_file() or digest(ROOT / name) != old}
check('Only root README and Home source/built CSS changed among all captured files', changed == allowed)
current_files = {str(p.relative_to(ROOT)) for p in ROOT.rglob('*') if p.is_file()}
check('All new files stay within stage-3 evidence', all(name.startswith('evidence/stage-3/') for name in current_files - before.keys()))
protected = {name: old for name, old in before.items() if not name.startswith('demo/') and name != 'README.md'}
check('Frozen inputs, own baseline, root contracts and original plus stage-2 evidence unchanged', all(digest(ROOT / name) == old for name, old in protected.items()))
old = (STAGE / 'before-home-motion.css').read_text()
css = (ROOT / 'demo/home-motion.css').read_text()
check('Recorded pre-edit Home CSS matches initial integrity hash', hashlib.sha256(old.encode()).hexdigest() == before['demo/home-motion.css'])
check('Home source and rebuilt stylesheet match byte-for-byte', digest(ROOT / 'demo/home-motion.css') == digest(ROOT / 'demo/public/home-motion.css'))
patch = ''.join(difflib.unified_diff(old.splitlines(keepends=True), css.splitlines(keepends=True), fromfile='demo/home-motion.css (stage-2)', tofile='demo/home-motion.css (stage-3)'))
check('Saved patch describes the exact current stylesheet delta', patch == (STAGE / 'source-change.patch').read_text())
compact_start = '@media(max-width:1119px) {'
compact_end = '/* This is the same orientation rule'
check('Entire stage-2 compact header/menu block remains byte-identical', old.split(compact_start, 1)[1].split(compact_end, 1)[0] == css.split(compact_start, 1)[1].split(compact_end, 1)[0])
check('All existing typography declarations remain unchanged', re.findall(r'(?:font(?:-[\w-]+)?|line-height|letter-spacing):[^;]+;', old) == re.findall(r'(?:font(?:-[\w-]+)?|line-height|letter-spacing):[^;]+;', css))
untouched = ['.home-immersive', '.home-arrival', '.home-arrival-copy', '.home-arrival h1', '.home-description', '.home-primary', '.home-primary > span', '.home-scroll-hint', '.home-environment', '.home-environment video', '.home-immersive .site-header', '.home-immersive .header-inner', '.home-immersive .site-header .wordmark', '.home-motion-control', '.home-motion-control button']
# The combined .home-primary/.home-text-link rule adds wrapping constraints only.
check('Hero/header/media/motion anchor and primary sizing declarations retained', all(bodies(old, selector) == bodies(css, selector) for selector in untouched))
entries = bodies(css, '.home-collection-entry')
check('Both collection grids reserve content-sized outer tracks and a shrinkable middle', len(entries) == 2 and 'minmax(28px,max-content) minmax(0,1fr) minmax(24px,max-content)' in entries[0] and 'minmax(20px,max-content) minmax(0,1fr) minmax(20px,max-content)' in entries[1])
check('Lower Home reading content can break overlong words', 'overflow-wrap:anywhere;' in bodies(css, '.home-reading-zone')[0])
controls = re.search(r'\.home-primary,\s*\.home-text-link\s*\{([^{}]*)\}', css).group(1)
check('Home action labels have bounded widths and natural wrapping', all(x in controls for x in ['min-width:0;', 'max-width:100%;', 'white-space:normal;', 'overflow-wrap:anywhere;']) and 'flex:none;' in bodies(css, '.home-text-link > span')[0])
footer_brand = bodies(css, '.home-footer-brand')[0]
check('Footer brand is bounded and retains whole-word wrapping', all(x in footer_brand for x in ['min-width:0;', 'max-width:100%;', 'white-space:normal;', 'overflow-wrap:normal;']) and 'anywhere' not in footer_brand)
check('Footer navigation can shrink and wrap within its parent', all(x in bodies(css, '.home-footer nav')[0] for x in ['flex-wrap:wrap;', 'min-width:0;', 'max-width:100%;']) and all(x in bodies(css, '.home-footer nav a')[0] for x in ['min-width:0;', 'max-width:100%;', 'white-space:normal;', 'overflow-wrap:anywhere;']))
added = [line[1:] for line in patch.splitlines() if line.startswith('+') and not line.startswith('+++')]
check('Patch adds no font shrinking, hiding, clipping, runtime hooks or global overflow mask', not any(re.search(r'font(?:-size)?\s*:|line-height\s*:|overflow(?:-[xy])?\s*:|display\s*:|visibility\s*:|text-overflow\s*:|@media|body|html', line) for line in added))
routes = ['index.html', 'collections/index.html', 'collections/ornamental-fish/index.html', 'collections/aquatic-plants/index.html', 'collections/driftwood/index.html', 'our-story/index.html', 'quality/index.html', 'contact/index.html', '404.html']
check('All eight content routes plus 404 retain exact HTML bytes after rebuilding', all(digest(ROOT / 'demo/public' / route) == before['demo/public/' + route] for route in routes))
check('Inner pages retain shared presentation and do not load Home resources', all('/home-motion' not in (ROOT / 'demo/public' / route).read_text() and 'home-environment' not in (ROOT / 'demo/public' / route).read_text() for route in routes[1:]))
check('Shared styles, controllers, route/content sources, serve/build tools and assets unchanged', all(digest(ROOT / name) == old_hash for name, old_hash in before.items() if name.startswith('demo/') and name not in allowed))
home = (ROOT / 'demo/public/index.html').read_text()
nav = re.search(r'<nav id="home-menu-links".*?</nav>', home).group()
check('Five disclosure destinations, current page, native details and nonmodal semantics retained', re.findall(r'href="([^"]+)"', nav) == ['/', '/collections/', '/our-story/', '/quality/', '/contact/'] and 'aria-current="page"' in nav and '<details class="mobile-menu">' in home and 'aria-modal' not in home and 'role="dialog"' not in home)
check('Category links and secondary local enquiry destination retained', all(f'href="/collections/{slug}/"' in home for slug in ['ornamental-fish', 'aquatic-plants', 'driftwood']) and 'href="/contact/#enquiry">Discuss a project' in home)
media = ['landscape.mp4', 'portrait.mp4', 'landscape-poster.webp', 'portrait-poster.webp']
check('Four runtime films/posters match frozen input bytes in source and built output', all(digest(ROOT / 'input/media' / name) == digest(ROOT / 'demo/assets/immersive' / name) == digest(ROOT / 'demo/public/assets/immersive' / name) for name in media))
(STAGE / 'source-results.json').write_text(json.dumps({'passed': passed, 'captured_files': len(before), 'protected_files': len(protected), 'changed': sorted(changed), 'limits': 'Source, built-output and hash inspection only. Text-node ink fit, rendering, focus, scrolling and ordinary/enlarged composition remain unverified pending coordinator browser review.'}, indent=2) + '\n')
print(f'{len(passed)} bounded source/integrity assertions passed.')
