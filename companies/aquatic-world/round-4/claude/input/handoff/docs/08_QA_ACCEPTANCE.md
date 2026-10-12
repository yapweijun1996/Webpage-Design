# 08 — Definition of Done & QA Acceptance Criteria

**An image mockup is not an implementation.** The entire homepage requires functional verification after coding; no tests in this package were run against a working implementation.

## Release-gate policy

- **G0 / Requirements:** branding generic and editable; business owner approved actual launch content.
- **G1 / Content:** every logo/photo licensed; all business claims approved; current contact routes confirmed; no placeholder domain or false product availability.
- **G2 / UX:** screenshot fidelity judged with desktop/mobile captures, but legibility and responsiveness outrank pixel imitation.
- **G3 / Function:** all navigation routes load; menu accessible; CTA works; form success is server-confirmed.
- **G4 / Quality:** supported browsers, keyboard + screenreader smoke, no console/page errors, no horizontal overflow, performance acceptable.
- **G5 / Release:** rollback, route redirects and canonical sitemap verified; deployment explicitly authorized.

## P0 critical acceptance checklist

| ID | Test | Passing evidence |
|---|---|---|
| BRAND-01 | Replace logo, name, tagline, country, domain, contact via data only | No source component change |
| BRAND-02 | Build has no residual demo brand/geo/URL text | Generated output grep/report clean |
| CONTENT-01 | All business/export/sustainability claims approved or hidden | Completed claim register |
| ASSET-01 | 100% shown photography has valid license + mapping | Asset manifest complete |
| NAV-01 | Header/footers and in-page anchors work | Browser interaction recording |
| NAV-02 | Mobile menu opens, closes on Escape, and focus behaves | Keyboard test video/report |
| CTA-01 | Primary CTA reaches collections; secondary reaches real contact | Valid destination or success evidence |
| FORM-01 | Form never gives false success when backend unavailable | Negative-path test |
| RESP-01 | No horizontal overflow in prescribed width matrix | Browser automation check |
| RESP-02 | Headline/buttons/gallery remain readable and tappable | Screenshots + interaction |
| A11Y-01 | Contrast, keyboard, labels, semantic heading audit | Axe or similar + manual test |
| SEO-01 | Per-page title/canonical/OG/sitemap use real approved brand | Output inspection |
| PERF-01 | RUM target or lab proxy measured, no hero block | Web Vitals report |
| QUALITY-01 | Zero runtime console/page errors and broken key requests | Browser/network report |

## Suggested test fixtures

- `default-aquatic`: 3 categories, full approved content, primary + secondary CTA.
- `different-brand`: entirely different wordmark/tagline/logo/country, 5 categories, long marketing headline.
- `minimal`: no optional proof points, quality section disabled, 1 collection card, no social links, mailto contact.
- `unapproved`: explicitly unapproved claim must be suppressed and logged at build.
- `broken-asset`: image missing; page remains readable, asset validator fails build.
- `unavailable-backend`: enquiry form disabled and fallback contact shown.

## Test commands (examples, not claims of completed runs)

```sh
# Adapt to actual chosen build stack:
npm run lint
npm run test
npm run build
npm run test:e2e
npm run test:a11y
```

## Status vocabulary

**Verified:** screenshot, logs and reproducible test evidence exist.  
**Failed:** test executed and did not meet its criterion.  
**Blocked:** required source asset, environment, authorization or backend unavailable.  
**Not run:** no test executed; never re-label as Verified.

Use `qa/acceptance-checklist.csv` and `qa/responsive-test-matrix.csv` to record actual execution and artifact paths.
