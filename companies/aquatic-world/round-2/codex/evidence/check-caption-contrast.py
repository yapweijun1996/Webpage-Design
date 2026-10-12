"""Conservative source-image composite check using measured browser rectangles.

Ignores text shadow and tests the entire caption box, including spaces between
letters. This is a background model, not a screenshot or accessibility audit.
"""
from pathlib import Path
import json
import math
import re
from PIL import Image

root = Path(__file__).resolve().parent
measurements = json.loads((root / 'photo-caption-measurements.json').read_text())


def luminance(rgb):
    values = [v / 255 for v in rgb]
    linear = [v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4 for v in values]
    return sum(v * w for v, w in zip(linear, (0.2126, 0.7152, 0.0722)))


results = []
for m in measurements:
    desktop = 'linear-gradient(rgba(0, 0, 0, 0) 10%, rgba(2, 21, 28, 0.85))'
    mobile = 'linear-gradient(rgba(0, 0, 0, 0) 35%, rgba(2, 21, 28, 0.7) 65%, rgba(2, 21, 28, 0.9))'
    assert m['overlay'] in (desktop, mobile), 'Reconcile this model after an overlay change.'
    image = Image.open(root.parent / 'demo/assets' / m['src']).convert('RGB')
    scale = max(m['width'] / image.width, m['height'] / image.height)
    positions = [float(v) / 100 for v in re.findall(r'([\d.]+)%', m['position'])]
    ox = (image.width * scale - m['width']) * positions[0]
    oy = (image.height * scale - m['height']) * positions[1]
    for caption in m['captions']:
        foreground = [int(v) for v in re.findall(r'\d+', caption['color'])[:3]]
        lf = luminance(foreground)
        ratios = []
        for y in range(math.floor(caption['y']), math.ceil(caption['y'] + caption['height'])):
            t = y / m['height']
            if m['overlay'] == desktop:
                # ::after starts at 25%; its first 10% is transparent.
                alpha = (217 / 255) * max(0, min(1, (t - 0.325) / 0.675))
            elif t < 0.65:
                alpha = (179 / 255) * max(0, (t - 0.35) / 0.30)
            else:
                alpha = (179 + 51 * min(1, (t - 0.65) / 0.35)) / 255
            sy = min(image.height - 1, max(0, int((y + oy) / scale)))
            for x in range(math.floor(caption['x']), math.ceil(caption['x'] + caption['width'])):
                sx = min(image.width - 1, max(0, int((x + ox) / scale)))
                pixel = image.getpixel((sx, sy))
                background = [c * (1 - alpha) + wash * alpha for c, wash in zip(pixel, (2, 21, 28))]
                lb = luminance(background)
                ratios.append((max(lf, lb) + 0.05) / (min(lf, lb) + 0.05))
        minimum = min(ratios)
        results.append({'viewport': m['viewport'], 'caption': caption['text'], 'computed_color': caption['color'], 'minimum_modeled_ratio': round(minimum, 2), 'status': 'passed' if minimum >= 4.5 else 'failed'})

report = {'method': __doc__.strip(), 'results': results, 'status': 'passed' if all(r['status'] == 'passed' for r in results) else 'failed'}
(root / 'photo-caption-contrast.json').write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps(report, indent=2))
if report['status'] != 'passed':
    raise SystemExit(1)
