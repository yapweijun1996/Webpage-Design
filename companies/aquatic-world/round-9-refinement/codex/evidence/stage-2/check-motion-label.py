"""Source and positioning arithmetic only; never rendered-fit evidence."""
from pathlib import Path
import difflib
import json
import re

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
before = json.loads((HERE / 'before-state.json').read_text())['home_css']
after = (ROOT / 'demo/home-motion.css').read_text()
pattern = r'\.home-motion-explanation \{[^}]+\}'
old = re.search(pattern, before).group()
new = re.search(pattern, after).group()
assert before.replace(old, '') == after.replace(new, ''), 'Unrelated CSS changed'
assert after == (ROOT / 'demo/public/home-motion.css').read_text()
for rule in (
    'right:60px;', 'bottom:0;',
    'transform:translateY(min(0px,calc(50% - 24px)));',
    'width:max-content;',
    'max-width:calc(100vw - 108px - env(safe-area-inset-right));',
    'white-space:normal;', 'overflow-wrap:anywhere;', 'font-size:13px;',
):
    assert rule in new, rule
assert not any(rule in new for rule in ('nowrap', 'overflow:hidden', 'ellipsis', 'scale('))
assert 'width:48px;' in after and 'height:48px;' in after
assert 'outline:2px solid var(--gold);' in after
assert 'outline-offset:6px;' in after
assert ':has(button:not([hidden]):is(:hover,:focus-visible))' in after

# Independent algebra for the authored box constraints, not browser measurements.
# Numeric line height 20.8 is the expected 13px × inherited 1.6 at normal text.
cases = []
for viewport in (320, 390, 667, 844, 1280, 1440):
    for safe_right in (0, 20):
        offset = 18 + safe_right if viewport <= 767 else max(24, safe_right)
        bound = viewport - 108 - safe_right
        right = viewport - offset - 60
        left = right - bound
        assert left >= 24
        assert right <= viewport
        cases.append({'viewport_width': viewport, 'right_safe_area': safe_right,
                      'maximum_label_border_box_width': bound,
                      'left_at_maximum_width': left, 'label_right': right})

vertical = []
for height in (32.8, 53.6, 95.2, 136.8):
    button_bottom = 375 - 18
    shift = min(0, height / 2 - 24)
    bottom = button_bottom + shift
    top = button_bottom - height + shift
    assert 0 <= top < bottom <= 375
    if height <= 48:
        assert abs((top + bottom) / 2 - (button_bottom - 24)) < 0.001
    else:
        assert bottom == button_bottom
    vertical.append({'assumed_label_height': height, 'top': top, 'bottom': bottom})

result = {
    'check_type': 'source constraints and algebra; no DOM, glyphs or browser',
    'only_motion_explanation_rule_changed': True,
    'public_stylesheet_matches_source': True,
    'wrapping_focus_visibility_and_48px_target_rules_preserved': True,
    'width_constraint_cases': cases,
    '320x375_bottom_anchoring_cases': vertical,
    'rendered_fit': 'NOT VERIFIED; coordinator must double pre-captured computed font sizes and numeric line heights exactly once at fixed viewport',
}
(HERE / 'motion-label-check-results.json').write_text(json.dumps(result, indent=2) + '\n')
(HERE / 'implementation-diff.patch').write_text(''.join(difflib.unified_diff(
    before.splitlines(True), after.splitlines(True),
    fromfile='stage-1/demo/home-motion.css', tofile='stage-2/demo/home-motion.css')))
print('PASS: tooltip-only CSS diff, public copy, wrapping/focus/target source constraints, 12 width and 4 vertical algebra cases. Rendered fit is unverified.')
