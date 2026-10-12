# Aquatic World — Multi-page Implementation (Claude Code)

Status: round-5 focused revision (shorter Contact task, REVIEW.md) implemented and self-verified on 2026-10-11:
58/58 scripted checks passed in headless Chrome 154, plus inspection of real desktop/tablet/phone captures.
Built by Claude Code CLI with Claude Opus 5.5 (`claude-opus-5-5`) only; no delegates, advisors or extra models.
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
AQUATIC_PREVIEW_PORT=4212 npm run serve    # http://127.0.0.1:4212/ (port used in this run; default 4192), loopback only; unknown paths → 404.html with HTTP 404
AQUATIC_PREVIEW_PORT=4212 npm run verify   # ACCEPTANCE.md gates + REV-C (round-5 Contact) + REV-B (home hero) via CDP → evidence/verification.json + evidence/screenshots/check-*.png
AQUATIC_PREVIEW_PORT=4212 node scripts/shots.mjs --routes=contact --sizes=390x844,360x800,320x700,1440x900,768x1024 --viewport-only --out=../evidence/screenshots/after
AQUATIC_PREVIEW_PORT=4212 node scripts/shots.mjs --routes=contact,home,collections,fish,quality,not-found --sizes=1440x900,390x844 --out=../evidence/screenshots/after
```

`serve`, `verify` and `shots` reuse a running preview on the port, otherwise they start their own `serve.mjs` child and stop only that child (also when closing Chrome fails).
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
| `/contact/` | Contact — four-field enquiry brief preview (`?interest=ornamental-fish|aquatic-plants|driftwood|not-sure` prefills; unknown values ignored) |
| any other path | Not-found page (`404.html`, HTTP 404 from `serve.mjs`) |

## Source layout

- `demo/src/content.mjs` — brand, navigation, CTA, category data, page titles and image mapping (single data source).
- `demo/src/layout.mjs` — shared document shell, header, footer, breadcrumbs, responsive image helper.
- `demo/src/pages.mjs` — page-specific compositions and copy.
- `demo/src/site.css`, `demo/src/site.js` — one stylesheet; progressive-enhancement script (menu, form preview, prefill).
- `demo/scripts/` — `images.mjs`, `build.mjs`, `serve.mjs`, `verify.mjs`, `shots.mjs`, `cdp.mjs` (minimal CDP driver), `server-handle.mjs`.

## Header and Contact contract

- Header (round 4, unchanged): solid ocean-teal bar (`#0A3541`), brand │ five destinations │ divider │ "Discuss a project" CTA. 77px closed on desktop, 65px below 1100px, where an accessible Menu/Close panel takes over.
  Current page has a solid gold underline; category pages show Collections as the current section with a segmented underline plus a "(current section)" label.
- Contact (round 5): one h1 "Prepare an enquiry brief" + one purpose sentence. One local-only disclosure line at the top of the form panel; a no-JS notice replaces it, and the preview shows "Nothing was sent." instead.
  The form has exactly four groups: Name, Email, Collection(s) with Not sure yet, and Project. Category prefill context appears at the Collection(s) group. "Preview enquiry", Edit and Clear are available; Clear also resets context and query.
  Help ("What makes a brief useful") comes after the workspace. At 390×844 and 360×800 the Name input starts at ≈303px and Email is fully visible at scroll 0.
- Home hero: overlay ≥1200px, split copy/image 861–1199px, stacked ≤860px, so the copy never covers the fish.

## Evidence

- `evidence/design-plan.md` — focused round-5 plan (written before editing).
- `evidence/revision-review.md` — baseline defect → change → observed result, verification commands, model/tool metadata and remaining gaps.
- `evidence/verification.json` — latest scripted results (58 checks).
- `evidence/screenshots/before/`, `evidence/screenshots/after/`, `evidence/screenshots/check-*.png` — real captures from this run.
- `evidence/process-run.json`, `cli-events.jsonl`, `cli-stderr.log` — run harness records (not written by the builder).

All content is illustrative: no real contact details, stock, prices, certifications or history are claimed, and the enquiry form never sends anything.
