# Shared Aquatic Image Assets v1

Nine standalone images provide eleven homepage image slots for the paired CLI comparison. They were generated with the built-in `image_gen` tool on 2026-10-10 using the supplied mockup as a visual reference. Both implementation workspaces receive identical copies under `input/assets/`.

These are illustrative creative assets for a fictional local demo. They are not documentary photographs of a company, verified products, confirmed species, or operating locations. The waterfront scene resembles the reference's city imagery but does not establish a real business location.

- [Offline image preview](preview.html)
- [Asset manifest: dimensions, hashes, provenance, and slot mapping](asset-manifest.json)
- [Complete final generation prompts](prompts.json)

## Slot mapping

| Slot | Fixed source image | Starting composition |
| --- | --- | --- |
| Hero | [hero-angelfish.png](hero-angelfish.png) | Quiet left side; main fish on right; `70% 50%` |
| Heritage | [heritage-waterfront.png](heritage-waterfront.png) | Waterfront panorama; `50% 50%` |
| Collection: fish | [collection-ornamental-fish.png](collection-ornamental-fish.png) | Blue/red fish; `40% 50%` |
| Collection: plants | [collection-aquatic-plants.png](collection-aquatic-plants.png) | Green aquascape; `35% 50%` |
| Collection: driftwood | [collection-driftwood.png](collection-driftwood.png) | Branching natural material; `35% 50%` |
| Highlight: red fish | [highlight-red-betta.png](highlight-red-betta.png) | Complete fish; prefer `contain` when a narrow card would clip fins |
| Highlight: striped fish | [highlight-angelfish.png](highlight-angelfish.png) | Complete fish; prefer `contain` when needed |
| Highlight: plants | [highlight-red-plants.png](highlight-red-plants.png) | Red/bronze foliage; `50% 50%` |
| Highlight: driftwood | [collection-driftwood.png](collection-driftwood.png) | Intentional reuse of the fixed category source |
| Highlights background | [enquiry-underwater-school.png](enquiry-underwater-school.png) | Dark panorama; `50% 50%` |
| Enquiry background | [enquiry-underwater-school.png](enquiry-underwater-school.png) | Quiet central area for HTML heading and CTA |

## Shared use rules

Use the manifest's fixed source for each slot. Copy it into the implementation's own `demo/` assets when needed; do not import the other runner or this canonical pack at runtime. No replacement images, screenshot-region extraction, extra image downloads, or further image generation are allowed in input baseline v2.

CSS cropping, responsive image positioning, overlays, and deterministic resizing or format encoding are allowed. Record derivatives and their original asset ID; preserve the frozen source bytes. The suggested fit and position are starting points, not a finished responsive design. All type and controls must remain HTML/CSS.

The source pack is approximately 21.3 MiB of PNG images. Choose appropriate derived sizes/encoding for actual webpage delivery rather than serving every full source at every viewport. Both builders start with the same source resolution and optimization opportunity.

## Visual verification and limitations

All nine returned images were visually inspected for the intended subject and independent composition. They have no visible reference typography, buttons, card frames, or browser chrome. Actual dimensions and SHA-256 values are in the manifest.

The images follow the reference direction; they are newly generated interpretations, not pixel-identical extractions. Website crop, text contrast over photographs, responsive behavior, and page loading performance remain implementation checks. No landing page or model evaluation has run yet.
