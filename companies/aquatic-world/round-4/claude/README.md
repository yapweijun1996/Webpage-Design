# Aquatic World — Multi-page Implementation (Claude Code)

Status: round-4 focused revision (shared header + phone-first Contact form) implemented and self-verified on 2026-10-11:
56/56 scripted checks passed in headless Chrome 154, plus inspection of real desktop/intermediate/phone captures.
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
npm run serve      # http://127.0.0.1:$AQUATIC_PREVIEW_PORT/ (4202 in this run; default 4192), loopback only; unknown paths → 404.html with HTTP 404
npm run verify     # ACCEPTANCE.md gates + REVIEW.md checks (REV-A contact, REV-B hero) via CDP → evidence/verification.json + evidence/screenshots/check-*.png
node scripts/shots.mjs --sizes=1440x900,390x844 --out=../evidence/screenshots/after   # full-page review screenshots
node scripts/shots.mjs --sizes=1440x900,1180x820,1024x768,900x1000,768x1024,390x844,360x780,320x700 --viewport-only --out=../evidence/screenshots/after
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

## Header and Contact contract (round 4)

- Header: solid ocean-teal bar (`#0A3541`), brand │ five destinations │ divider │ "Discuss a project" CTA. 77px closed on desktop, 65px below 1100px, where an accessible Menu/Close panel takes over.
  Current page has a solid gold underline; category pages show Collections as the current section with a segmented underline plus a "(current section)" label.
- Contact: compact introduction → enquiry form/preview → secondary help, in DOM, keyboard and visual order. At 390×844 the Name field is fully visible at scroll 0.
- Home hero: overlay ≥1200px, split copy/image 861–1199px, stacked ≤860px, so the copy never covers the fish.

## Evidence

- `evidence/design-plan.md` — focused round-4 plan (written before editing).
- `evidence/revision-review.md` — baseline defect → change → observed result, verification commands, model/tool metadata and remaining gaps.
- `evidence/verification.json` — latest scripted results (56 checks).
- `evidence/screenshots/before/`, `evidence/screenshots/after/`, `evidence/screenshots/check-*.png` — real captures from this run.
- `evidence/process-run.json`, `cli-events.jsonl`, `cli-stderr.log` — run harness records (not written by the builder).

All content is illustrative: no real contact details, stock, prices, certifications or history are claimed, and the enquiry form never sends anything.
