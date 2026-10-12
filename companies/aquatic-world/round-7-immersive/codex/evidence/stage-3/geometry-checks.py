"""Bounded CSS-source evaluation and cover mathematics; no browser rendering."""
from fractions import Fraction
import hashlib
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[2]
STAGE = ROOT / 'evidence/stage-3'
CSS = (ROOT / 'demo/home-motion.css').read_text()


def read_rules(content, conditions=()):
    rules = []
    cursor = 0
    while cursor < len(content):
        opening = content.find('{', cursor)
        if opening < 0:
            assert not content[cursor:].strip(), 'Unparsed CSS text'
            break
        prelude = content[cursor:opening].strip()
        closing, depth = opening + 1, 1
        while depth:
            assert closing < len(content), 'Unbalanced CSS rule'
            depth += (content[closing] == '{') - (content[closing] == '}')
            closing += 1
        body = content[opening + 1:closing - 1]
        if prelude.startswith('@media'):
            rules.extend(read_rules(body, conditions + (prelude[6:].strip(),)))
        else:
            assert not prelude.startswith('@'), 'Unsupported at-rule'
            declarations = [tuple(part.strip().split(':', 1)) for part in body.split(';') if part.strip()]
            assert all(len(item) == 2 for item in declarations)
            rules.append((prelude, conditions, declarations))
        cursor = closing
    return rules


def matches(query, width, height):
    ratio = Fraction(width, height)
    ranged = re.fullmatch(r'\(([\d/]+) <= aspect-ratio < ([\d/]+)\)', query)
    if ranged:
        low, high = map(Fraction, ranged.groups())
        return low <= ratio < high
    upper = re.fullmatch(r'\(aspect-ratio < ([\d/]+)\)', query)
    if upper:
        return ratio < Fraction(upper[1])
    predicates = re.findall(r'\((min|max)-(width|aspect-ratio):\s*([\d./]+)(px)?\)', query)
    rest = re.sub(r'\((min|max)-(width|aspect-ratio):\s*([\d./]+)(px)?\)', '', query)
    assert predicates and re.sub(r'\b(not|all|and)\b|\s+', '', rest) == '', query
    values = []
    for bound, feature, number, unit in predicates:
        actual = Fraction(width) if feature == 'width' else ratio
        target = Fraction(number)
        assert (unit == 'px') == (feature == 'width')
        values.append(actual >= target if bound == 'min' else actual <= target)
    result = all(values)
    return not result if query.startswith('not all') else result


def style(rules, selector, width, height):
    result = {}
    for prelude, conditions, declarations in rules:
        if selector not in [item.strip() for item in prelude.split(',')]:
            continue
        if not all(matches(query, width, height) for query in conditions):
            continue
        for key, value in declarations:
            result[key] = value.strip()
            if key == 'padding':
                parts = value.split()
                result['padding-top'] = parts[0]
                result['padding-left'] = parts[1] if len(parts) > 1 else parts[0]
            elif key == 'padding-inline':
                result['padding-left'] = value
    return result


def pixels(value, width, height):
    for unit, basis in [('svh', height / 100), ('vw', width / 100), ('px', 1)]:
        if value.endswith(unit):
            return float(value[:-len(unit)]) * basis
    match = re.fullmatch(r'clamp\(([^,]+),([^,]+),([^,]+)\)', value)
    assert match, value
    minimum, preferred, maximum = [pixels(part, width, height) for part in match.groups()]
    return min(maximum, max(minimum, preferred))


rules = read_rules(re.sub(r'/\*.*?\*/', '', CSS, flags=re.S))
# Reconstruct only the documented correction in memory to verify preserved phone styles.
# The original hash independently proves this is the actual Stage 2 source.
start = CSS.index('/* Short landscape windows keep')
old_css = CSS[:start].replace('@media (min-aspect-ratio:6/5)', '@media (min-width:900px) and (min-aspect-ratio:6/5)')
old_css = old_css.replace('@media (aspect-ratio < 6/5)', '@media not all and (min-width:900px) and (min-aspect-ratio:6/5)')
old_css += '''/* Wider portrait crops need more subject room; the chapter grows with its copy. */
@media not all and (min-width:900px) and (min-aspect-ratio:6/5) {
  @media (min-aspect-ratio:4/5) {
    .home-arrival {
      padding-top:70svh;
    }
  }
}
'''
before = json.loads((STAGE / 'demo-before.json').read_text())
assert hashlib.sha256(old_css.encode()).hexdigest() == before['demo/home-motion.css'], 'Undocumented CSS edit'
old_rules = read_rules(re.sub(r'/\*.*?\*/', '', old_css, flags=re.S))
query = '(min-aspect-ratio: 6/5)'
viewports = [(1440, 900), (1280, 800), (1024, 768), (768, 1024),
             (430, 932), (390, 844), (360, 800), (320, 800),
             (900, 900), (900, 800), (1000, 900), (900, 750), (900, 751),
             (899, 749), (899, 750), (1000, 833), (1000, 834),
             (640, 800), (639, 800), (390, 390), (320, 320), (900, 600),
             (844, 390), (667, 375), (720, 600), (719, 600),
             (360, 300), (359, 300), (320, 266), (320, 267),
             (400, 500), (399, 500), (320, 400), (319, 400),
             (1200, 1000), (1199, 1000), (320, 240)]
rows = []
for width, height in viewports:
    landscape = matches(query, width, height)
    assert landscape == (width * 5 >= height * 6)
    near_square = Fraction(4, 5) <= Fraction(width, height) < Fraction(6, 5)
    mode = 'landscape' if landscape else 'portrait'
    source_width, source_height = (1280, 720) if landscape else (720, 1280)
    expected_position = '50% 50%' if landscape else '50% 30%'
    layers = [style(rules, selector, width, height) for selector in ['.home-environment img', '.home-environment video']]
    for media in layers:
        assert media['object-fit'] == 'cover' and media['object-position'] == expected_position
        assert media['width'] == media['height'] == '100%' and 'transform' not in media
    environment = style(rules, '.home-environment', width, height)
    assert environment['position'] == 'fixed' and environment['inset'] == '0'
    arrival = style(rules, '.home-arrival', width, height)
    narrow_landscape = landscape and width <= 899
    expected_top = ('clamp(112px,24svh,190px)' if narrow_landscape else 'clamp(190px,30svh,340px)') if landscape else ('70svh' if near_square else '53svh' if width <= 359 else '56svh')
    assert arrival['padding-top'] == expected_top, (width, height, arrival)
    assert arrival['min-height'] == '100svh'
    assert not {'height', 'max-height', 'overflow', 'overflow-y'} & arrival.keys()
    copy = style(rules, '.home-arrival-copy', width, height)
    reading = style(rules, '.home-reading-zone', width, height)
    heading = style(rules, '.home-arrival h1', width, height)
    description = style(rules, '.home-description', width, height)
    cta = style(rules, '.home-primary', width, height)
    if narrow_landscape:
        assert copy['max-width'] == reading['max-width'] == '46vw'
        assert arrival['padding-left'] == '7vw'
        assert 'linear-gradient(90deg,' in arrival['background']
        assert pixels(heading['font-size'], width, height) >= 32
        assert description['font-size'] == '18px'
        assert cta.get('font-size', '16px') == '16px'
        assert style(rules, '.home-immersive .desktop-nav', width, height)['display'] == 'none'
        assert int(style(rules, '.home-immersive .mobile-menu > summary', width, height)['min-height'][:-2]) >= 44
    if not landscape and Fraction(width, height) < Fraction(4, 5):
        # Every exact selector/declaration group is equal, including header/CTA/menu.
        for prelude, _, _ in old_rules:
            for selector in prelude.split(','):
                assert style(rules, selector.strip(), width, height) == style(old_rules, selector.strip(), width, height), (width, height, selector)
    scale = max(width / source_width, height / source_height)
    position_x, position_y = [.01 * float(part[:-1]) for part in expected_position.split()]
    offset_x = (width - source_width * scale) * position_x
    offset_y = (height - source_height * scale) * position_y
    rows.append({
        'viewport': [width, height], 'media': mode, 'position': expected_position,
        'source_rectangle_xywh': [round(-offset_x / scale, 3), round(-offset_y / scale, 3), round(width / scale, 3), round(height / scale, 3)],
        'arrival_padding_top': expected_top,
        'arrival_top_px_if_svh_equals_viewport_height': round(pixels(expected_top, width, height), 3),
        'near_square_portrait': near_square, 'narrow_landscape': narrow_landscape,
        'copy_max_width': copy['max-width'],
        'heading_font_size_px_from_source': round(pixels(heading['font-size'], width, height), 3),
        'description_font_size': description['font-size'], 'chapter_may_expand': True
    })

report = {
    'scope': 'Bounded CSS source cascade and cover mathematics only; no browser, computed DOM layout, text wrapping, fish bounds, moving frames or visual acceptance.',
    'assumption': 'For numerical offsets, svh equals viewport height. Browser chrome, actual font metrics and subject safety are untested.',
    'stage_2_css_reconstruction_hash_matches': True, 'portrait_phone_declarations_preserved': True,
    'count': len(rows), 'checks': rows
}
(STAGE / 'geometry-checks.json').write_text(json.dumps(report, indent=2) + '\n')
print(f'PASS: {len(rows)} CSS-source viewport cases; narrow landscape selection/composition, exact near-square boundaries and existing phone declarations. Rendered checks not run.')
