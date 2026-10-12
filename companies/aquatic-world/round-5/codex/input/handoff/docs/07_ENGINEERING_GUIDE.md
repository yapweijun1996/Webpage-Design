# 07 — Implementation Architecture & Engineering Checklist

## Suggested v1 implementation

For the original goal of a light and maintainable site: **static generated HTML + accessible CSS + minimal vanilla JavaScript** driven by JSON content/configuration. Framework is optional; only adopt one if the actual application scope requires it. Keep build pipeline deterministic and page output server-rendered/static for SEO.

### Modules

```text
configuration -> schema validation -> content approval gate -> page builder
       |                     |                         |
  brand/settings       stable IDs, links        evidence + licensing
       |                     v                         |
       +------------> semantic HTML components <-------+
                              |
                    tokens/CSS and assets
                              |
                     static production build
                              |
                  browser/SEO/accessibility QA
```

## Proposed repository structure (not included as implementation)

```text
project/
  public/assets/
  src/components/{SiteHeader,Hero,Heritage,Collections,Quality,Highlights,Enquiry,Footer}/
  src/templates/{Home,Collections,About,Contact}/
  src/styles/{tokens,base,layout,components}.css
  content/site.json
  content/homepage.json
  content/collections.json
  content/assets.json
  content/claims.json
  scripts/{validate-content,build-site,validate-output}
  tests/{unit,browser,accessibility}
  docs/                                      # this handoff
```

## Development sequence

1. Set up component library and design tokens. Integrate an approved/placeholder brand config.
2. Build semantic page regions with real HTML text. Add no images until text layout is acceptable at 390px and desktop.
3. Add image manifest/source-mapped photos and photo overlays. Compare at 1440×900 + 390×844 using reference composition.
4. Implement card dataset and responsive spacing; test 1/3/5 categories and long translated labels.
5. Add accessible sticky header/mobile menu; test with mouse, touch and keyboard.
6. Wire real collection navigation and enquiry CTA. Only enable a form after backend is operational.
7. Run lint/build, content validation, routing test, browser QA, accessibility and Core Web Vitals measurement.
8. Present before/after screenshot with review notes. Do not push, merge or deploy without requested permission.

## Enquiry security contract

If using a form, its POST endpoint should handle server-side validation, bounded payload size, spam controls/rate limiting, CSRF mitigation as applicable, output encoding, secret management, PII retention policy, and minimal logging. Success UI must be shown only after authenticated/authorized backend acknowledgement of accepted delivery. Do not place third-party mail API secrets in client JavaScript. For v1 without backend, prefer an approved mailto or contact page and label the limitation.

## Versioning & undo

User-friendly iteration principle: cosmetic design changes can be applied without repeatedly seeking approval, but every change should be reviewable and revertible via source control / snapshots. Use a dedicated branch, small logical commits and annotated before/after screenshots. Production publish, external-system writes or irreversible operations require explicit authorization.

## Visual fidelity checkpoints

- Hero headline uses text and gold italic accent; avoid rasterizing the typographic block.
- Navy/teal photo depth stays legible; gold highlights do not become neon yellow.
- Heritage cream panel and photo align cleanly at desktop, stack without awkward crop on mobile.
- Collection cards appear editorial, photo-led, with dark overlay and gold arrow.
- Quality section uses off-white background, small line icons, simple dividers.
- Highlights row and enquiry band retain spacing in narrow screens.

## Build review deliverables

- Link to running preview or reproducible localhost commands.
- `git diff` and changed-file list.
- Desktop/tablet/mobile screenshots vs this reference.
- Unit/component test results, Playwright/browser logs, accessibility output, content audit, missing-asset audit.
- Explicit status: Verified / Failed / Blocked; no unsupported 'all good' claims.
