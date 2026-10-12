"""Final Stage 3 file/document checks; no browser, server or Git operations."""
import hashlib
import json
from pathlib import Path
import re
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[2]
STAGE = ROOT / 'evidence/stage-3'


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


protected = json.loads((STAGE / 'immutable-before.json').read_text())
for relative, expected in protected.items():
    assert digest(ROOT / relative) == expected, f'Protected file changed: {relative}'
before = json.loads((STAGE / 'demo-before.json').read_text())
now = {str(p.relative_to(ROOT)): digest(p) for p in sorted((ROOT / 'demo').rglob('*')) if p.is_file()}
assert before.keys() == now.keys(), 'Demo files added or removed'
changed = sorted(name for name in before if before[name] != now[name])
expected_changes = sorted([
    'demo/build.py', 'demo/home-motion.js', 'demo/home-motion.css',
    'demo/assets/immersive/README.md', 'demo/public/index.html',
    'demo/public/home-motion.js', 'demo/public/home-motion.css',
    'demo/public/assets/immersive/README.md'
])
assert changed == expected_changes, changed

previous_query = '(min-width: 900px) and (min-aspect-ratio: 6/5)'
current_query = '(min-aspect-ratio: 6/5)'
home = (ROOT / 'demo/public/index.html').read_text()
assert home.count(current_query) == 1
assert hashlib.sha256(home.replace(current_query, previous_query).encode()).hexdigest() == before['demo/public/index.html'], 'Unexpected Home HTML change'
inner = [name for name in before if name.endswith('.html') and name != 'demo/public/index.html']
assert len(inner) == 8 and all(before[name] == now[name] for name in inner)

docs = [ROOT / 'README.md', ROOT / 'demo/assets/immersive/README.md', STAGE / 'design-plan.md', STAGE / 'self-review.md']
doc_links = 0
for document in docs:
    for href in re.findall(r'\[[^\]]*\]\(([^)]+)\)', document.read_text()):
        url = urlsplit(href)
        if url.scheme or url.netloc or not url.path:
            continue
        target = (document.parent / url.path).resolve()
        assert target.is_relative_to(ROOT), f'Outside documentation target: {href}'
        # This check creates its own linked report after the other assertions pass.
        if target != STAGE / 'final-checks.json':
            assert target.exists(), f'Missing documentation target: {href}'
        doc_links += 1
readme = (ROOT / 'README.md').read_text()
assert current_query in readme and previous_query not in readme
assert '(4/5 <= aspect-ratio < 6/5)' in readme
assert 'no browser pass is claimed' in readme

source = json.loads((STAGE / 'source-checks.json').read_text())
controller = json.loads((STAGE / 'controller-checks.json').read_text())
geometry = json.loads((STAGE / 'geometry-checks.json').read_text())
assert source['count'] == len(source['checks']) == 89
assert controller['count'] == len(controller['checks']) == 14
assert geometry['count'] == len(geometry['checks']) == 37
assert all(check.get('result') == 'pass' for check in source['checks'] + controller['checks'])

report = {
    'result': 'pass', 'scope': 'Final source/file/document integrity only; no browser acceptance or publication.',
    'protected_hashes': len(protected), 'all_historical_evidence_unchanged': True,
    'changed_demo_files': changed, 'new_demo_files': [], 'removed_demo_files': [],
    'preserved_inner_and_404_html_files': len(inner), 'home_html_query_only_change': True,
    'source_assertions': source['count'], 'controller_scenarios': controller['count'],
    'viewport_source_cases': geometry['count'], 'documentation_links_checked': doc_links,
    'supplied_media_bytes': 'unchanged in source/output; verified against frozen Stage 2 manifest by source checks',
    'rendered_browser_checks': 'not run; prohibited in this restricted worker stage'
}
(STAGE / 'final-checks.json').write_text(json.dumps(report, indent=2) + '\n')
assert (STAGE / 'final-checks.json').is_file()
print(f'PASS: {len(protected)} protected hashes; exactly {len(changed)} intended demo file changes; {len(inner)} inner/404 HTML files unchanged; {doc_links} documentation links resolve. Browser checks not run.')
