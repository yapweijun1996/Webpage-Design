# Round-2 execution evidence

These files were produced while inspecting and revising this workspace's own starting implementation. No prior execution evidence or another implementation was used.

| Evidence | Establishes |
| --- | --- |
| [run.json](run.json) | Actual model, CLI, tooling, timing, feedback and unknown usage/cost |
| [changes.md](changes.md) | Causes, repairs and limits |
| [static-checks.json](static-checks.json) | 37 executed static/build checks |
| [browser-checks.json](browser-checks.json) | 31 guided Chrome checks with observed URL, panel and focus state |
| [overflow-checks.json](overflow-checks.json) | Document/body widths at ten sizes |
| [fixture-checks.json](fixture-checks.json) | Category counts, second brand, optional hiding and exploration |
| [baseline-layout.json](baseline-layout.json), [revised-layout.json](revised-layout.json) | Measured region heights |
| [photo-caption-measurements.json](photo-caption-measurements.json), [photo-caption-contrast.json](photo-caption-contrast.json) | Actual computed styles/geometry and conservative background models |
| [runtime-console.json](runtime-console.json) | Empty warning/error observations during successful journeys |
| [image-decode-checks.json](image-decode-checks.json) | Decoding of all 20 variants |
| [frozen-inputs-check.json](frozen-inputs-check.json) | SHA-256 checks against the pre-edit snapshot |
| [http-checks.json](http-checks.json) | Terminal HTTP probe marked `not_run` after EPERM |
| [final-capture-states.json](final-capture-states.json) | Final capture viewports, scrollY=0 and top-positioned header |

## Screenshots

| Viewport | Full page | Viewport |
| --- | --- | --- |
| 1440×900 | [Desktop](after-1440.jpg) | [Top](desktop-1440x900.jpg) |
| 768×1024 | [Tablet](after-768.jpg) | [Top](tablet-768x1024.jpg) |
| 390×844 | [Phone](after-390.jpg) | [Top](mobile-390x844.jpg) |

`before-1440.jpg`, `before-768.jpg` and `before-390.jpg` capture this round's starting page. Additional `mobile-*` and `tablet-*` files show open menu/detail, heritage, collections, quality/highlights, enquiry and bottom states. `no-app-script-collection.jpg` shows a working native disclosure without the app script. The resized additional reference is an input-inspection image, not an implementation screenshot.

## Reproduction and limits

Use the root README commands. In Chrome: open a card from an empty hash; Back/Forward; close; open another category; navigate to enquiry; visit valid/unknown category hashes; use Enter/Escape in the phone menu; resize across 1023/1024px; inspect each fixture URL.

Browser evidence came from the available Chrome connector rather than a portable test suite. Cached Playwright 1.63.0 could not launch Chromium under the sandbox. The `@playwright/cli` wrapper did not become available and its wait was interrupted. Raw CDP was denied and no raw commands were retried. Temporary viewport overrides were reset; no browser preferences were changed.

The no-script test temporarily renamed `demo/app.js`, then restored its exact bytes and confirmed progressive enhancement loaded again. The before/after SHA-256 was `2a8f978dd8d70b20eef2a69b8600995ba035170e6856db5377ee6999837f0432`. This tests application-script absence, not global engine disabling. An alternative QA-server bind failed with EPERM; its temporary file was removed.

Recompute the caption model with Pillow:

```sh
python3 evidence/check-caption-contrast.py
```

The model checks the measured overlay signature, maps delivered images through CSS cropping, composites the wash and tests every pixel of each caption box against its computed foreground. It ignores text shadows/antialiasing and does not establish a full accessibility audit.

Firefox/WebKit, screen reader, actual zoom, live reduced-motion and performance checks remain `not_run`. Reduced-motion CSS/JavaScript was reviewed. Routed global investigation/verification files were absent in this workspace; the supplied current contracts and handoff provided the acceptance requirements.
