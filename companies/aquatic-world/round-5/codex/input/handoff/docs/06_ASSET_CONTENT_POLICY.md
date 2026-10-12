# 06 — Photography, Content Rights, Asset Manifest

## Critical separation

`reference/selected-homepage-mockup.png` = an **AI-generated design reference**, not a source of verified company facts. It can be used for design review, but it must not be decomposed into fake real company evidence. The screenshot contains realistic fish, Singapore skyline, visual badges, product descriptions, and a fictitious sample brand. Production assets must be supplied/licensed/created and approved independently.

## Asset plan by section

| Slot | Expected visual | Suggested source size / safe crop | Approval |
|---|---|---|---|
| `hero.primary` | Premium angelfish / striking aquarium macro with subject on right | 2000×1200+ or responsive source set; text-safe left | Mandatory |
| `heritage.photo` | Real company facility/team or permitted region scene | 1400×1000+; meaningful license | Mandatory |
| `collections[n].image` | One accurately labeled collection example | >=900px long edge for cards | Mandatory |
| `highlights[n].image` | Correct species/product photo with traceable source | >=750px long edge | Mandatory |
| `enquiry.background` | Cinematic fish school / aquascape | >=1600px wide, dark-friendly crop | Optional |
| `brand.logo` | Licensed logo or text wordmark | SVG/approved raster, transparent where relevant | Mandatory |
| `social[n].icon` | Recognizable platform symbol | Platform-compliant icon | Optional |

Sizes are creative guidance, not strict image resolution QA requirements. Compression and art direction take priority over shipping massive files.

## Asset manifest requirements

For each image: `asset_id`, local filename, source URL or owner, photographer/creator, rights/license, permission evidence, original context, subject/species, alt text, dimensions, crop/position, output variants, reviewer, approval. Template: `qa/asset-manifest-template.csv`.

## Rights & factual fidelity

- Do not use photographs found by web search merely because they appear publicly accessible.
- Preserve original creator rights and attribution/usage limits.
- If an asset is AI-generated, mark it as illustrative and do not imply it is a genuine company farm, facility, employee, product offering or actual fish stock.
- Product captions must not invent species based on visual resemblance. When ambiguous, use approved category-level labels.
- Images must not imply shipping countries, health outcomes, certifications, or export practices not verified.

## Implementation guidance

- Render real image elements for collection cards for accessible alt text.
- Hero can be a CSS background if decorative, but ensure appropriate LCP strategy; text remains in semantic DOM.
- Convert and resize approved images to AVIF/WebP with fallbacks as needed.
- Write valid intrinsic dimensions to reduce CLS; use `object-fit: cover` for cinematic panoramas and `contain` where anatomical specimen visibility matters.
- On mobile, choose different art-directed crop or alternate approved image so the primary fish is not cut off.

## Reference file usage

The provided screenshot may be included in design documentation and private implementation QA. Do **not** claim it is a working website. The browser address in the screenshot is a **visual placeholder**, not an owned/verified production domain.
