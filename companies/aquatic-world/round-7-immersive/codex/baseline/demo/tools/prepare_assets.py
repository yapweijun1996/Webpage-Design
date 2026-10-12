"""Optional deterministic image preparation from the frozen shared PNG pack."""
import argparse
import hashlib
import json
from pathlib import Path
from PIL import Image

parser = argparse.ArgumentParser()
parser.add_argument("--source", type=Path, required=True)
parser.add_argument("--output", type=Path, required=True)
args = parser.parse_args()
args.output.mkdir(parents=True, exist_ok=True)
manifest = {}
for source in sorted(args.source.glob("*.png")):
    with Image.open(source) as image:
        image = image.convert("RGB")
        variants = []
        for limit in [640, 1600]:
            width = min(image.width, limit)
            height = round(image.height * width / image.width)
            resized = image.resize((width, height), Image.Resampling.LANCZOS)
            target = args.output / f"{source.stem}-{limit}.webp"
            resized.save(target, "WEBP", quality=85, method=6)
            variants.append({"file": target.name, "width": width, "height": height,
                             "bytes": target.stat().st_size,
                             "sha256": hashlib.sha256(target.read_bytes()).hexdigest()})
        manifest[source.stem] = {"source": source.name,
                                 "source_sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
                                 "width": image.width, "height": image.height,
                                 "variants": variants}
(args.output / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
print(f"Prepared {len(manifest)} source images and {sum(len(a['variants']) for a in manifest.values())} WebP derivatives.")
