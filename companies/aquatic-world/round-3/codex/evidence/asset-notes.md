# Asset provenance and delivery

Only the nine frozen input/assets/*.png images are used. Both reference PNGs and all nine sources were actually inspected with view_image. The reference is visual direction only; it is not embedded, extracted or used as a screenshot background.

Sources were generated with the built-in image_gen tool on 2026-10-10, as recorded in input/assets/asset-manifest.json (shared source authority). These are illustrative creative images, not evidence of products, confirmed species, company premises or operational capability. The waterfront is labeled an illustrative Singapore-inspired scene.

No asset was downloaded, replaced or newly generated. The favicon and simple ripple logo are authored SVG interface marks, not photographs or business credentials. Fonts are local Georgia and system sans fallbacks; no remote fonts or services are required.

## Deterministic derivatives

Actual command (exit 0):

```sh
python3 demo/tools/prepare_assets.py --source input/assets --output demo/assets
```

Python 3.14.3 / Pillow 12.2.0. Each source is converted to RGB, resized with LANCZOS preserving aspect ratio, and encoded to WebP at quality 85 / method 6. Widths are 640px and at most 1600px; the filename suffix is the requested width limit. Source hashes, actual output dimensions, bytes and derivative hashes are in demo/assets/manifest.json. The build copies these local derivatives to demo/public/assets. HTML provides dimensions, srcset/sizes, priority for the leading image and lazy loading below the fold.

Total source PNG bytes: 22350783. Total delivered derivative bytes across both widths: 2585658. Individual pages request responsive variants, not the entire pack. This is a byte comparison, not measured runtime performance.

Crop decisions are in design-plan.md. No rendered crop or visual-performance claim is verified: actual browser launch and local serving were blocked in this environment.
