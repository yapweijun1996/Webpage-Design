"""Evaluate this theme's bounded CSS rules and cover math, without a browser."""
from fractions import Fraction
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[2]
CSS = (ROOT / 'demo/home-motion.css').read_text()
rules = []


def read_rules(content, conditions=()):
    cursor = 0
    while cursor < len(content):
        opening = content.find('{', cursor)
        if opening < 0:
            assert not content[cursor:].strip(), 'Unparsed CSS text'
            return
        prelude = content[cursor:opening].strip()
        depth = 1
        closing = opening + 1
        while depth:
            assert closing < len(content), 'Unbalanced CSS rule'
            depth += (content[closing] == '{') - (content[closing] == '}')
            closing += 1
        body = content[opening + 1:closing - 1]
        if prelude.startswith('@media'):
            read_rules(body, conditions + (prelude[len('@media'):].strip(),))
        else:
            assert not prelude.startswith('@'), 'Unsupported at-rule'
            declarations = [tuple(part.strip().split(':', 1))
                            for part in body.split(';') if part.strip()]
            assert all(len(item) == 2 for item in declarations)
            rules.append((prelude, conditions, declarations))
        cursor = closing


read_rules(re.sub(r'/\*.*?\*/', '', CSS, flags=re.S))


def matches(query, width, height):
    predicates = re.findall(r'\((min|max)-(width|aspect-ratio):\s*([\d./]+)(px)?\)', query)
    rest = re.sub(r'\((min|max)-(width|aspect-ratio):\s*([\d./]+)(px)?\)', '', query)
    assert re.sub(r'\b(not|all|and)\b|\s+', '', rest) == '', query
    assert predicates, query
    values = []
    for bound, feature, number, unit in predicates:
        actual = Fraction(width) if feature == 'width' else Fraction(width, height)
        target = Fraction(number)
        assert (unit == 'px') == (feature == 'width')
        values.append(actual >= target if bound == 'min' else actual <= target)
    result = all(values)
    return not result if query.startswith('not all') else result


def style(selector, width, height):
    result = {}
    for prelude, conditions, declarations in rules:
        if selector not in [item.strip() for item in prelude.split(',')]:
            continue
        if not all(matches(query, width, height) for query in conditions):
            continue
        for key, value in declarations:
            result[key] = value.strip()
            if key == 'padding':
                result['padding-top'] = value.split()[0]
    return result


def pixels(value, height):
    if value.endswith('svh'):
        return float(value[:-3]) * height / 100
    if value.endswith('px'):
        return float(value[:-2])
    match = re.fullmatch(r'clamp\(([^,]+),([^,]+),([^,]+)\)', value)
    assert match, value
    minimum, preferred, maximum = [pixels(part, height) for part in match.groups()]
    return min(maximum, max(minimum, preferred))


query = '(min-width: 900px) and (min-aspect-ratio: 6/5)'
viewports = [(1440, 900), (1280, 800), (1024, 768), (768, 1024),
             (430, 932), (390, 844), (360, 800), (320, 800),
             (900, 900), (900, 800), (1000, 900),
             (900, 750), (900, 751), (899, 749),
             (1000, 833), (1000, 834), (640, 800), (639, 800),
             (390, 390), (320, 320), (900, 600)]
rows = []
for width, height in viewports:
    landscape = matches(query, width, height)
    mode = 'landscape' if landscape else 'portrait'
    source_width, source_height = (1280, 720) if landscape else (720, 1280)
    expected_position = '50% 50%' if landscape else '50% 30%'
    poster = style('.home-environment img', width, height)
    video = style('.home-environment video', width, height)
    for media in [poster, video]:
        assert media['object-fit'] == 'cover'
        assert media['object-position'] == expected_position, (width, height, media)
        assert media['width'] == media['height'] == '100%'
        assert 'transform' not in media
    assert poster['object-position'] == video['object-position']
    environment = style('.home-environment', width, height)
    assert environment['position'] == 'fixed' and environment['inset'] == '0'
    arrival = style('.home-arrival', width, height)
    near_square = not landscape and Fraction(width, height) >= Fraction(4, 5)
    expected_top = ('70svh' if near_square else '53svh' if width <= 359
                    else '56svh') if not landscape else 'clamp(190px,30svh,340px)'
    assert arrival['padding-top'] == expected_top, (width, height, arrival)
    assert 'height' not in arrival and 'max-height' not in arrival
    assert 'overflow' not in arrival and 'overflow-y' not in arrival
    scale = max(width / source_width, height / source_height)
    position_x, position_y = [.01 * float(part[:-1]) for part in expected_position.split()]
    offset_x = (width - source_width * scale) * position_x
    offset_y = (height - source_height * scale) * position_y
    rows.append({
        'viewport': [width, height], 'media': mode, 'position': expected_position,
        'scale': round(scale, 6),
        'source_rectangle_xywh': [round(-offset_x / scale, 3), round(-offset_y / scale, 3),
                                  round(width / scale, 3), round(height / scale, 3)],
        'arrival_padding_top': expected_top,
        'arrival_top_px_if_svh_equals_viewport_height': round(pixels(expected_top, height), 3),
        'near_square_portrait': near_square,
        'chapter_may_expand': True
    })

report = {
    'scope': 'Source CSS evaluation and cover mathematics only. No browser, computed DOM layout, fish bounds, motion or visual acceptance.',
    'assumption': 'For numerical arrival offsets, svh equals the listed viewport height; actual browser chrome and text layout are untested.',
    'count': len(rows), 'checks': rows
}
(ROOT / 'evidence/stage-2/geometry-checks.json').write_text(json.dumps(report, indent=2) + '\n')
print(f'PASS: {len(rows)} CSS-source viewport cases; both layers match, near-square copy lowers, chapters can grow. Rendered crops not tested.')
