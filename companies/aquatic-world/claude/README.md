# Landing Page Implementation Workspace

Status: **initial delivery implemented and browser-verified** (40/40 automated checks passed; see `evidence/initial-delivery/checks.json`).

Read `AGENTS.md` and `TASK.md`. The design package is in `input/handoff/`; both reference images are under `input/`. Shared imagery: [input/assets/README.md](input/assets/README.md).

## Preview

Prerequisite: Node.js 18+ (tested with v23.10.0). No packages are needed to build or preview.

```sh
cd demo
npm run build        # generates demo/dist/ from demo/content/
npm run serve        # serves demo/dist/
```

Open:

- http://127.0.0.1:4173/ — default demo brand (AQUATIC WORLD, 3 collections)
- http://127.0.0.1:4173/fixtures/tidewell/ — second invented brand, own theme, 5 collections
- http://127.0.0.1:4173/fixtures/minimal/ — 1 collection; heritage, quality, highlights, proof points and form preview hidden

To re-run verification: `cd demo && npm install && npx playwright install chromium && npm test`.

## Implementation scope

- Sections in reference order: header, hero, heritage, collections, quality, highlights, enquiry, footer. All text and controls are semantic HTML; images are `<img>` with `srcset` (decorative backgrounds use `alt=""`). No browser chrome or picture frame.
- Static build (`demo/scripts/build.mjs`, zero dependencies) chosen so pages are complete without JavaScript and crawlable; it also validates content, gates claims and checks links/assets. Justification: the handoff asks for JSON-driven, server-rendered/static output with no-JS first paint.
- All brand, copy, categories, links, images, labels and SEO come from `demo/content/tenants/*`. Theme colours/fonts are CSS tokens, overridable per brand.
- Interactions: sticky header that turns solid on scroll; mobile menu (labelled button, Escape, focus return, focus kept inside while open, scroll lock, closes on link); collection explorer (cards, highlight cards, "View All Collections" and deep links `#collection-<id>` open an accessible detail panel; Escape/Close returns focus; "Ask about …" preselects the enquiry topic); enquiry preview form with field errors and an announced error summary.
- Enquiry: every enquiry CTA goes to `#enquiry`, which states that real enquiries are unavailable. The preview form says "Preview only — nothing was sent" on valid input; no network request is made and no success state exists.
- Images: nine supplied sources → 20 WebP derivatives (22.35 MB PNG → 1.51 MB total). Initial image transfer measured at 0.55 MB (1440×900) and 0.30 MB (390×844). Mapping in `demo/content/assets.json` and `demo/assets/derivatives.json`.

## Delivery and limitations

- Fictional demo: AQUATIC WORLD and Tidewell Studio are sample brands, marked as demo in the hero, enquiry and footer, and pages are `noindex`. Images are AI-generated illustrations; no premises, stock or species are claimed. Highlight labels describe what the image shows rather than naming species.
- Changed from the reference on purpose: "Curated from Singapore" / "with Singapore at Heart" → location-free copy; "Trusted by global partners" and process claims (quality checks, secure packaging, global delivery) are suppressed as unapproved claims; the quality band shows illustrative selection notes instead. "Our Story"/"Our Quality Process" links, the EN language chooser and social icons are omitted (no routes or accounts exist).
- No real contact route, backend, privacy page, canonical URL or OG image. Those need real business data.
- Verified in headless Chromium only (Playwright 1.64). Safari/Firefox, real devices, screen readers, 200% zoom and field Core Web Vitals were not run.
