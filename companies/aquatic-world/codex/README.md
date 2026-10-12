# Premium Aquatic Landing Page

Status: **implemented; 37 static/build checks passed; browser verification not run because this execution environment blocked local preview and browser access**. This is an independent fictional design concept, not a real company's website. No commit, push, deployment or real enquiry was performed.

## Preview

Prerequisite: Node.js 20 or newer. No package installation is needed. From this workspace:

```sh
cd demo
npm run build
npm run check
npm run dev
```

Open **http://127.0.0.1:4173/**. To use a different local port:

```sh
npm run dev -- --port 4180
```

The generated HTML and compressed assets are included. The site does not use a framework, remote fonts, CDN resources, runtime content fetches or a backend. The preview server binds only to loopback and serves an explicit allowlist of website files.

The build and check commands were executed successfully in this run. The preview command was attempted, but the terminal sandbox refused the local port bind. Use the same command in a normal local terminal; a successful HTTP preview was **not** observed in this environment.

## Included configurations

| URL | Editable source | Demonstration |
| --- | --- | --- |
| `/` | `demo/content/default.json` | AQUATIC WORLD, three collections, all reference sections |
| `/fixtures/minimal.html` | `demo/content/minimal.json` | One collection; quality, highlights, hero motifs and heritage aside omitted |
| `/fixtures/five.html` | `demo/content/five.json` | Five collections, wrapping grid |
| `/fixtures/alternate.html` | `demo/content/alternate.json` | TIDAL ATELIER, different wording/location context/navigation and five collections |

Edit the relevant JSON and rerun `npm run build`. No presentation component changes are needed for these configurations. The renderer removes links to hidden optional sections, checks category IDs and assets, escapes configured text, and rejects unsupported URLs, real contact states and production-approved content. This builder deliberately produces local fictional demos only.

## Delivered scope

The header, hero, heritage, collections, quality study, selected highlights, enquiry and footer follow the reference order. The design uses dark ocean teal, champagne gold, cream editorial panels, serif headings, restrained line icons and the supplied standalone imagery. The illustrated browser frame was omitted.

Collection and highlight links open a matching inline image-and-text study. Escape or the close button dismisses it and restores the originating control's focus. Direct collection hashes and browser history are handled. The mobile navigation is a nonmodal disclosure with a labelled button, Escape handling and link-close behavior. The enquiry section openly states that real enquiries are unavailable; its disclosure explains that nothing is collected, stored or sent. There is no form or submission-success state.

Content is static semantic HTML. With JavaScript disabled, navigation remains visible and collection studies are available through native disclosures. Layout rules cover desktop, tablet and mobile, including a photo-first mobile hero; content does not depend on scroll animations. Reduced motion disables smooth scrolling and hover movement. These interaction and layout behaviors are implemented but **have not been verified in a real browser** during this run.

## Files and assets

- `demo/index.html` and `demo/fixtures/*.html`: generated, independently previewable pages.
- `demo/content/*.json`: brand, location context, all copy, categories, contact state, links and SEO.
- `demo/scripts/build.mjs`: dependency-free static renderer and configuration checks.
- `demo/scripts/check.mjs`: reproducible static, build and asset checks.
- `demo/scripts/serve.mjs`: dependency-free loopback preview server.
- `demo/tokens.css`, `demo/styles.css`, `demo/app.js`: shared theme, responsive presentation and small progressive enhancement.
- [Asset provenance and source mapping](demo/assets/manifest.json), [asset notes](demo/assets/README.md).
- [Run record](evidence/run.json), [verification report](evidence/README.md), [actual check results](evidence/static-checks.json).

All eleven fixed image slots map to the nine supplied AI-generated source assets. Twenty deterministic WebP variants total **1,377,298 bytes (1.31 MiB)** versus **22,350,783 bytes (21.32 MiB)** of source PNGs: a **93.84%** reduction across the complete variant set. Responsive `srcset`, intrinsic dimensions, a high-priority hero and lazy lower images limit delivery size. This is an encoding result, not a measured page-performance result.

To regenerate the included images, the optional asset preparation script requires Python and Pillow:

```sh
python3 demo/scripts/prepare-assets.py
```

Asset regeneration is unnecessary for preview or ordinary content changes. Its manifest records variant dimensions, byte sizes, SHA-256 hashes and source asset IDs. The frozen inputs were preserved.

## Verification and remaining limits

The latest check run passed 37 checks covering generated output, all four configurations, section order, unique IDs, anchor targets, local resources, category counts, honest contact/SEO content, escaping, rejection paths and source/derivative hashes. All 20 variants decoded successfully. Seven solid-color text pairs met 4.5:1 contrast; text composited over photographs was not measured.

The required 1440×900, 768×1024 and 390×844 screenshots were **not captured**. The 320/360/430/1024/1920 overflow matrix, keyboard/focus/Escape journeys, actual menu and CTA behavior, console/network inspection, no-JavaScript browser behavior, 200% zoom, cross-browser accessibility and Web Vitals remain **not_run**. Exact attempts and reasons are recorded in [browser-checks.json](evidence/browser-checks.json). The supplied-asset contact sheet is not an implementation screenshot.

The brand and story are fictional, the waterfront is illustrative, the gallery is not stock, and the quality band describes visual composition rather than business guarantees. No real contact, legal entity, public canonical domain, sitemap, privacy route or social account is invented. Metadata uses `noindex, nofollow`. Real business content, public image rights and a contact integration would require separate work before any release.
