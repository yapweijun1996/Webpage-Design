# Run Evidence

## Initial delivery (`initial-delivery/`)

No human interventions. Produced by `cd demo && npm test` (build + `tests/verify.mjs`, Playwright headless Chromium).

- `checks.json` — 40 checks with observed values: all passed. Covers runtime errors, overflow at 320/360/390/430/768/1024/1440/1920 (all three pages, also with the mobile menu open), image and link resolution, semantics, CTA/nav journeys, mobile menu keyboard/focus/Escape, skip link, collection explorer (card, index, Escape, View All, highlight cards, deep link, "Ask about" topic), enquiry negative path (no network request, no success wording), brand-swap grep, claim suppression, 1/3/5 categories, optional-section hiding, no-JS rendering, reduced motion, image weight.
- `screenshots/` — full-page and first-viewport captures at 1440×900, 1024×768, 768×1024, 390×844 (default), 1440×900 and 390×844 (tidewell, minimal), plus states: mobile menu closed/open, collection detail, deep link, enquiry errors, enquiry preview result, no-JS.
- `../demo/dist/build-report.json` (after a build) — sections rendered, warnings, suppressed claims for each page.

Not run: other browsers, real devices, screen readers, axe audit, 200% zoom, field Core Web Vitals. See `run.json` → `limitations`.

`process-run.json`, `cli-events.jsonl` and `cli-stderr.log` are written by the harness. They were not edited.
