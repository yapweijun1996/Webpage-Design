# Asset Notes

All delivered imagery is derived from the fixed source pack under `input/assets/`, accessed on 2026-10-10 (UTC). The sources were supplied for this local fictional comparison and generated with the built-in `image_gen` tool. No image was downloaded, generated anew, replaced, or extracted from a reference screenshot during implementation.

The [manifest](manifest.json) preserves each source asset ID, source filename, original SHA-256, generation record, creative-use notes and all eleven fixed slot assignments. Every derivative has its dimensions, byte count and SHA-256. The nine originals remain in the frozen input directory; only compressed derivatives are served by this demo.

Derivatives use Pillow 12.2.0, LANCZOS resizing, WebP quality 84 and method 6, with no changes to image content. Hero and underwater panorama variants are 640/1280/full-width; heritage variants are 480/960; card/highlight variants are 320/640. CSS adjusts positioning and gradients at different viewport widths. Fish highlights use `contain` to retain their silhouettes. Driftwood is intentionally reused for its collection and highlight, and the underwater panorama is intentionally shared by highlights and enquiry.

These images are illustrations, not documentary company photographs, operating locations, confirmed species, or stock. The local-demo permission context is the supplied task and asset pack; this manifest does not claim approval or licensing for a real company's public release.
