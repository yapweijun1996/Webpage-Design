# 01 — Visual Design System

## Approved visual signature

**Direction:** Cinematic aquatic elegance / Luxury Nature Storytelling. Dark underwater environments with large angelfish imagery; warm champagne-gold emphasis; editorial off-white narrative panels; high-density black-water gallery sections. The site should feel curated, sophisticated and business-focused—not childish, game-like or a crowded online shop.

> The supplied mockup has an outer browser chrome frame; **do not implement the browser bar as part of the website**.

## Color palette (proposed implementation tokens)

| Token | Hex | Role |
|---|---|---|
| `--color-ocean-950` | `#061C26` | Navigation/hero/footer base |
| `--color-ocean-900` | `#0A3541` | Secondary dark sections |
| `--color-ocean-800` | `#0C4450` | Gradients, interactive backgrounds |
| `--color-gold-400` | `#DFC087` | Primary actions, italic emphasis, dividing accents |
| `--color-gold-500` | `#C6A466` | Hover/secondary accent |
| `--color-cream-50` | `#F6F4F0` | Heritage and quality panels |
| `--color-ink-900` | `#10242D` | Text on light panels; button text on gold |
| `--color-slate-700` | `#43565B` | Secondary text on cream |
| `--color-fog-200` | `#C2D1D2` | Muted supporting text on dark surfaces |
| `--color-white` | `#FFFFFF` | Primary body text on dark surfaces |

Verified static pair contrast ratios (calculated from proposed solid hex values, not the photo layer): cream/ocean-950 ≈15.91:1; gold/ocean-950 ≈10.01:1; ink/cream ≈14.57:1; ink/gold ≈9.17:1; slate/cream ≈7.03:1. **Re-test composites and text overlays on the actual photographs.**

## Typography

- Editorial display: `Georgia`, optional licensed/approved serif family via CSS tokens. Main H1 approx `clamp(2.5rem, 5vw, 5rem)`, responsive line-height `1.05–1.14`, controlled line-wrap.
- Body/navigation: `system-ui`, optionally `Inter` after approving font delivery strategy. Body `1rem–1.125rem`, line-height `1.55–1.7`.
- Eyebrow labels: uppercase sans-serif, `0.7–0.8rem`, `letter-spacing: 0.14em–0.22em`.
- Hero accent line: gold italic serif, not an image or font screenshot.
- Maintain typographic hierarchy and text scaling at 200% browser zoom.
- Don't bundle commercial font files; use licensed fonts or system fallbacks.

## Layout and spacing

- Desktop content max width 1,200–1,280px; fluid gutters 24–40px.
- Header height ~76–88px; navigation inside hero on desktop, switch to solid high-contrast state while scrolling.
- Hero min-block-size ~620–720px at desktop, but adapt to short viewports and content without cropping text.
- Hero text ~45%; background photographic focal subject on right ~55%; dark gradient left ensures readable foreground text.
- Grid: 12-column desktop, 8-column tablet or CSS auto-grid, 4-column mobile; major split panels become one column on mobile.
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96px. Section padding desktop 64–104px, tablet 48–72px, mobile 40–56px.
- Cards: subtle borders and image overlays; radius 0–8px for polished editorial shape; no bubbly UI.
- Gold primary button: background gold, dark ink text, min 44px height, moderate horizontal padding, hover darker gold and strong focus ring.
- Outline button: transparent dark surface, gold outline, cream/gold text, 44px min touch height.

## Imagery and composition

**Hero:** dominant angelfish-like fish to the right with dark dramatic green aquarium plants; subject must remain visible across breakpoints, not hidden by overlaid text. **Heritage:** business-approved city/facility/company image on left, not fabricated proof of premises. **Categories:** one authentic photo per category. **Highlights:** product thumbnails with confirmed species labels. **Enquiry:** underwater panorama with dark wash that leaves readable copy.

## Motion

- Hover/focus transitions 150–250ms (opacity, border, slight translate); avoid continuous autoplay parallax or distracting bubbles.
- Card transform maximum about `translateY(-3px)` under hover-capable devices only.
- Respect `prefers-reduced-motion: reduce`: remove scrolling animations and transforms where appropriate.
- **No reliance on scroll animation for content visibility**; all main content visible without JS.

## Avoid

- Gold text laid directly over a bright region of photography without a gradient.
- Generated pseudo-labels that imply verified exports, countries, quality certifications or years of experience.
- Excessively decorative paragraphs or handwritten slogans replacing useful factual content.
- Stretching low-resolution product thumbnails to hero sizes.
- Direct image export of the reference as the website itself (non-semantic, non-interactive, inaccessible).
