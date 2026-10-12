# Website Output — Config-Driven Aquatic Landing Page

Static HTML + CSS + a small vanilla script, generated from JSON content by a zero-dependency Node build.
All brand, copy, links, categories, images and SEO values live in `content/`; components in `src/components/` contain no customer data.

## Layout

```text
content/
  assets.json                    image registry: source asset id, sha256, intrinsic size, derivative widths
  tenants/aquatic-world/         default demo brand (3 collections)            -> dist/index.html
  tenants/tidewell/              second invented brand, own theme (5 collections) -> dist/fixtures/tidewell/
  tenants/minimal/               extends aquatic-world: 1 collection, optional sections hidden -> dist/fixtures/minimal/
    site.json | homepage.json | collections.json
src/components/                  render functions (header, hero, heritage, collections, quality, highlights, enquiry, footer, page)
src/styles/tokens.css            design tokens (from the handoff) — the only place visual values are defined
src/styles/site.css              brand-neutral component styles
src/client/site.js               progressive enhancement: header state, mobile menu, collection explorer (state follows the URL hash), enquiry preview
scripts/build.mjs                validation + claim-approval gate + HTML output
scripts/serve.mjs                local static server for dist/
scripts/build-images.sh          WebP derivatives from ../input/assets (already generated into assets/img/)
assets/derivatives.json          every derivative file with its source asset id, size and bytes
tests/verify.mjs                 Playwright browser checks -> ../evidence/revision-round-2/
```

## Commands

```sh
npm run build    # node scripts/build.mjs   -> dist/
npm run serve    # http://127.0.0.1:4173/ (default brand), /fixtures/tidewell/, /fixtures/minimal/
npm test         # build + browser verification (needs `npm install` and `npx playwright install chromium`)
npm run images   # regenerate WebP derivatives (needs cwebp); not needed for preview
```

Build and serve need only Node 18+; no packages. `playwright` is a dev dependency used by tests only.

## Content rules the build enforces

- `contentStatus` other than `PRODUCTION_APPROVED` → page gets `noindex`; canonical/OG URL only when `site.baseUrl` is a real `https://` value (null in all demos).
- Items with `"kind": "claim"` render only when `claim.status === "approved"`; the reference mockup's claims are stored as `proposed` and suppressed (logged at build and in `dist/build-report.json`).
- `href` must be `#id`, `/path`, `https://` or `mailto:`. In-page anchors whose section is not rendered are dropped (e.g. the minimal fixture's Heritage/Quality nav links).
- Images must reference a registered asset with existing derivatives; non-decorative images need alt text.
- Theme overrides (`site.theme.tokens`) must be known token names from `tokens.css` with safe values.
- `features.enableEnquiryForm: true` fails the build: there is no backend. The local preview form (`enableEnquiryPreview`) validates input and reports "nothing was sent"; it never shows success. A configured `contact.email` would replace it with a real `mailto:` link.

## Adding a brand

Create `content/tenants/<id>/` with the three JSON files (or `"extends": "<other-id>"` for partial overrides), add it to `PAGES` in `scripts/build.mjs`, and run the build. No component edits.
