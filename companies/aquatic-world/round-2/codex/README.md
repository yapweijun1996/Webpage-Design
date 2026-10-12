# Premium Aquatic Landing Page — Round 2

Status: **single shared-feedback revision completed and verified in Chrome**. This is an independent fictional design concept. Real enquiries are unavailable; nothing is collected or sent.

## Build and preview

Requires Node.js 20 or newer. No installation or external service is needed. From this workspace:

```sh
cd demo
npm run build
npm run check
npm run dev -- --port 4186
```

Open **http://127.0.0.1:4186/**. The entry point is `demo/index.html`. The server defaults to port 4173; this run used 4186 because 4173 was occupied. Choose another available port with `--port` if necessary. The server binds only to loopback and serves an explicit demo-file allowlist.

## Revision

The eight reference regions remain in order: header, hero, heritage, collections, quality, highlights, enquiry and footer. Smaller secondary headings, shorter JSON copy, tighter spacing and thumbnails that no longer stretch their cards restore the compact desktop rhythm. No fixed total-page-height constraint was added.

| Desktop band at 1440px | Before | Revised |
| --- | ---: | ---: |
| Hero | 666px | 562px |
| Heritage | 369px | 290px |
| Collections | 360px | 294px |
| Quality | 248px | 205px |
| Highlights | 219px | 209px |
| Enquiry | 260px | 232px |
| Footer | 113px | 83px |

Photo captions retain cream text independently of the light editorial panels. The waterfront has a stronger lower wash on phones. Below 1024px the hero separates photo and copy; phone crops preserve the fish and fins. The scrolling header is opaque.

The explorer now synchronizes exact category hashes on both history events. Back to empty, unrelated or invalid hashes closes it; Forward and initial valid hashes open the correct category. Close/Escape returns focus to the originating control, including after Back/Forward. Enquiry navigation closes the explorer. A sticky close control is visible when a detail opens.

## Configurations and assets

All brand, location context, copy, images, categories, links, SEO and contact states remain in JSON. Edit a configuration and rebuild without changing presentation components.

| URL | Source | Demonstration |
| --- | --- | --- |
| `/` | `demo/content/default.json` | AQUATIC WORLD; three collections; all regions |
| `/fixtures/minimal.html` | `demo/content/minimal.json` | One collection; optional quality/highlights/motifs/aside omitted |
| `/fixtures/five.html` | `demo/content/five.json` | Five collections |
| `/fixtures/alternate.html` | `demo/content/alternate.json` | TIDAL ATELIER; different wording/location context; five collections |

Static semantic HTML and native disclosures remain useful without the application script. No form, false success, inactive language chooser, social account or privacy route was added. CSS and JavaScript retain reduced-motion branches.

All eleven fixed slots still use the nine supplied AI-generated sources. The 20 unchanged WebP variants total **1,377,298 bytes (1.31 MiB)**. [The asset manifest](demo/assets/manifest.json) records source IDs, derivatives, dimensions, sizes and hashes. No new imagery, font, framework or runtime dependency was added. Asset regeneration with Python/Pillow is optional and unnecessary for preview.

## Verification

- **37 static/build checks passed**, including section order, configuration counts, local resources, escaping, rejection paths and asset hashes.
- **31 Chrome journey checks passed**, including history, multiple categories, close/Escape/focus, keyboard menu, enquiry, resize and script-failure/restoration.
- **Ten widths passed overflow checks:** 320, 360, 390, 430, 768, 900, 1023, 1024, 1440 and 1920px.
- **Nine fixture checks passed** across phone/desktop and category exploration.
- **Six waterfront caption composite checks passed**, using browser-computed colors and geometry; minimum modeled contrast was **5.44:1**.
- All **20 WebP files decoded** and all **51 frozen input/control files retained their initial hashes**. No application warning/error was captured during the successful journey run. The missing-script request in the separate degradation check was intentional, and the script was restored exactly.

Full-page and viewport screenshots exist for 1440×900, 768×1024 and 390×844, plus open menu/detail and middle/bottom states. See [evidence](evidence/README.md), [change notes](evidence/changes.md) and [run metadata](evidence/run.json).

## Limits

This finite Chrome check set does not establish universal browser support or WCAG compliance. Firefox/WebKit, screen-reader use, actual 200% zoom, live reduced-motion emulation and Web Vitals were not run. The no-script check withheld `app.js`; global browser JavaScript was not disabled. The contrast model covers waterfront captions; other photographic layers were visually reviewed.

Terminal Chromium launch failed under the macOS sandbox; browser checks used connected Chrome. Raw CDP was denied and was not retried. Terminal HTTP probing was blocked by network permissions; local preview and interactions were observed through Chrome. Unknown effort, usage and cost are recorded as unknown.

Only this workspace's `demo/`, `evidence/` and root README changed. No other implementation or comparison report was read. No delegation, commit, push, deployment, account change or real enquiry occurred.
