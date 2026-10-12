# Aquatic World — Multi-page Implementation (Claude Code)

Status: implemented and self-verified on 2026-10-11 (39/39 scripted acceptance checks passed in headless Chrome 154).
Self-verification is worker evidence only; evaluator design assessment and user design acceptance remain pending.

A static eight-page website (plus a 404 page) for the illustrative Aquatic World brand. No framework and no npm dependencies.

## Prerequisites

- Node.js ≥ 22 (verified with v23.10.0); uses built-in `fetch`/`WebSocket`.
- `cwebp` (libwebp 1.6.0 verified) — only needed to regenerate image derivatives; the derivatives are already in `demo/assets/img/`.
- Google Chrome / Chromium — only for `npm run verify` and screenshots (set `CHROME_PATH` if not at the default macOS path).

## Build and preview (verified commands)

```sh
cd demo
npm run images     # optional: regenerate WebP derivatives from ../input/assets (deterministic; requires cwebp)
npm run build      # writes demo/dist/<route>/index.html, dist/404.html and assets
npm run serve      # http://127.0.0.1:$AQUATIC_PREVIEW_PORT/ (default 4192), loopback only; unknown paths → 404.html with HTTP 404
npm run verify     # acceptance checks via Chrome DevTools Protocol → evidence/verification.json + evidence/screenshots/check-*.png
node scripts/shots.mjs --sizes=1440x900,390x844   # full-page review screenshots → evidence/screenshots/
```

`serve`, `verify` and `shots` reuse a running preview on the port, otherwise they start their own `serve.mjs` child and stop only that child.
`node scripts/build.mjs --base=/prefix/` builds for a sub-path deployment (link output checked; not browser-tested under a prefix).
`dist/` is plain static output and can also be served by any static server that maps directories to `index.html`.

## Routes

| Route | Page |
| --- | --- |
| `/` | Home |
| `/collections/` | Collections index |
| `/collections/ornamental-fish/` | Ornamental Fish |
| `/collections/aquatic-plants/` | Aquatic Plants |
| `/collections/driftwood/` | Driftwood |
| `/our-story/` | Our Story |
| `/quality/` | Quality |
| `/contact/` | Contact — enquiry brief preview (`?interest=ornamental-fish|aquatic-plants|driftwood|not-sure` prefills) |
| any other path | Not-found page (`404.html`, HTTP 404 from `serve.mjs`) |

## Source layout

- `demo/src/content.mjs` — brand, navigation, CTA, category data, page titles and image mapping (single data source).
- `demo/src/layout.mjs` — shared document shell, header, footer, breadcrumbs, responsive image helper.
- `demo/src/pages.mjs` — page-specific compositions and copy.
- `demo/src/site.css`, `demo/src/site.js` — one stylesheet; progressive-enhancement script (menu, form preview, prefill).
- `demo/scripts/` — `images.mjs`, `build.mjs`, `serve.mjs`, `verify.mjs`, `shots.mjs`, `cdp.mjs` (minimal CDP driver), `server-handle.mjs`.

## Evidence

- `evidence/design-plan.md` — sitemap, page plans, header states, responsive crops (written before coding).
- `evidence/delivery.md` — design decisions, review findings and repairs, check results, gaps.
- `evidence/verification.json` — latest scripted acceptance results.
- `evidence/screenshots/` — full-page and viewport captures (1440, 1920, 1024, 768, 390, 320) plus interaction states.
- `evidence/run.json` — model/CLI/tool metadata and limitations.

All content is illustrative: no real contact details, stock, prices, certifications or history are claimed, and the enquiry form never sends anything.
