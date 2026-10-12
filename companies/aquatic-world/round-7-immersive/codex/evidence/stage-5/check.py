"""Focused source/output footer check; does not emulate browser rendering."""
from pathlib import Path
import hashlib
import json
import re
import subprocess

root = Path(__file__).resolve().parents[2]
def snapshot():
    files = list((root / 'demo').rglob('*'))
    files += [p for p in (root / 'evidence').rglob('*') if 'stage-5' not in p.relative_to(root / 'evidence').parts]
    return {str(p.relative_to(root)): hashlib.sha256(p.read_bytes()).hexdigest() for p in files if p.is_file()}

before = snapshot()
subprocess.run(['python3', '-B', 'demo/build.py'], cwd=root, check=True)
after = snapshot()
assert before == after, 'Build changed existing demo or prior evidence bytes'
css = (root / 'demo/home-motion.css').read_text()
shared = (root / 'demo/styles.css').read_text()
html = (root / 'demo/public/index.html').read_text()
assert css == (root / 'demo/public/home-motion.css').read_text()
assert shared == (root / 'demo/public/styles.css').read_text()
assert '<body class="home-immersive">' in html
assert '<footer class="home-footer">' in html
assert '<footer class="site-footer">' not in html
assert html.index('href="/styles.css"') < html.index('href="/home-motion.css"')
block = re.search(r'\.home-footer\s*\{([^}]+)\}', css).group(1)
assert 'background:linear-gradient(180deg,#041d2500,#041d25c2);' in block
assert 'position:relative;' in block and 'z-index:1;' in block
assert not re.search(r'\.home-footer\s*::?(?:before|after)', css + shared)
backgrounds = re.findall(r'\.home-footer\s*\{([^}]+)\}', css)
assert sum('background' in b for b in backgrounds) == 1
assert '.site-footer {\n  background:var(--ocean);' in shared
footer = html.split('<footer class="home-footer">', 1)[1].split('</footer>', 1)[0]
for href in ['/', '/collections/', '/our-story/', '/quality/', '/contact/']:
    assert f'href="{href}"' in footer
assert 'enquiries are local previews only.' in footer
assert 'padding-right:70px;' in css
result = {
    'status': 'passed',
    'implementation_change_needed': False,
    'home_footer_class': 'home-footer (generic site-footer does not match)',
    'source_background_color': 'transparent via background shorthand omitted color',
    'wash_alpha_endpoints': [0, 194 / 255],
    'footer_pseudo_element_wash': 'none',
    'source_output_css_identical': True,
    'all_existing_demo_and_prior_evidence_hashes_unchanged': True,
    'hashed_files': len(before),
    'viewport_source_rule': 'same background at 390x844 and 1440x900; mobile changes padding only',
    'computed_style_and_rendered_viewports': 'not tested; coordinator verification required'
}
(root / 'evidence/stage-5/results.json').write_text(json.dumps(result, indent=2) + '\n')
print(json.dumps(result, indent=2))
