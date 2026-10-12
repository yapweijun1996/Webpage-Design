# Aquatic World — Focused Header and Contact Revision

Status: B then A implemented in the supplied own-code eight-page demo. Build, source/output, actual request-handler and enhancement-logic checks pass. **Browser acceptance is incomplete:** this environment denies loopback listening and browser file URLs; no after-revision browser screenshots were captured. Independent design assessment and user design acceptance remain pending.

This is an illustrative concept, not a verified business. All images and collection copy are demonstrative. Contact creates a local preview only; no message is sent, no entries are saved by this site and no enquiry service is connected.

## Focused changes

- Shared solid ocean-teal header: single-line brand, 15px desktop destinations, distinct aligned champagne CTA and stable underline/focus/current-section states. Authored closed height is 80px desktop/intermediate and 68px phone including the border; actual rendered sizes remain unverified. The slogan stays in the footer.
- Compact native Menu/Close disclosure at 1119px and below, with no-JavaScript navigation, Escape/focus return and visible focus transfer when resizing to desktop.
- Contact DOM and phone reading order: compact introduction → entire editable/preview workspace → secondary help, steps and photograph. A concise local-only disclosure is beside the form. The first name field is budgeted for the 390×844 first screen; actual geometry/hit testing is not_run.
- Short `Not sure yet` option with associated explanatory help; category prefill, validation, safe local preview and edit retained. Clear brief removes sample values/errors/output and restores incoming category context.
- At 768–1119px, Home copy and the fish photo occupy separate blocks. The wide cinematic overlay and existing phone direction are retained.

Details, source-review repairs and the complete verification limits are in [revision-review.md](evidence/revision-review.md). The [design plan](evidence/design-plan.md) was recorded before implementation.

## Build and preview

From this workspace, with Python 3.10+ standard library only:

```sh
python3 -B demo/build.py
python3 demo/serve.py --port 4201
```

Build was actually verified using Python 3.14.3. Two final builds produced identical bytes across all 31 output files. Runtime requires no Node, npm, framework, CDN or install step. Local WebP assets are included.

The preview command was attempted using `AQUATIC_PREVIEW_PORT=4201`, but binding failed with `PermissionError: [Errno 1] Operation not permitted`; no server remained running. In an environment that allows loopback serving, open `http://127.0.0.1:4201/`. If that port is occupied, omit `--port` and unset `AQUATIC_PREVIEW_PORT` to request an unused OS-assigned port; use the address printed by the owned process. Stop only your own preview terminal with Ctrl+C. Existing servers are preserved.

Serve `demo/public/` as the site root. The included loopback server supplies the actual `404.html` with HTTP 404 for unknown paths; it has no submission endpoint.

## Entry routes

| URL | Static entry | Purpose |
| --- | --- | --- |
| `/` | `demo/public/index.html` | Cinematic introduction and collection discovery |
| `/collections/` | `demo/public/collections/index.html` | Three families and composition planning |
| `/collections/ornamental-fish/` | `demo/public/collections/ornamental-fish/index.html` | Fish studies and selection questions |
| `/collections/aquatic-plants/` | `demo/public/collections/aquatic-plants/index.html` | Plant textures, palette and layers |
| `/collections/driftwood/` | `demo/public/collections/driftwood/index.html` | Material, branching lines, scale and space |
| `/our-story/` | `demo/public/our-story/index.html` | Nature/water/people narrative |
| `/quality/` | `demo/public/quality/index.html` | Proposed principles and practical questions |
| `/contact/` | `demo/public/contact/index.html` | Local editable enquiry and preview |
| Unknown path | `demo/public/404.html` | Honest recovery page |

Category enquiries use `/contact/?category=ornamental-fish#enquiry`, `aquatic-plants` or `driftwood`. Only these known values (and `general`) are accepted. All global links, cards, breadcrumbs, return and sibling links remain ordinary page anchors. Category pages identify Collections as the current section; exact global destinations identify the current page. Without JavaScript, native navigation works and the disabled preview has an honest offline explanation.

## Source and asset ownership

`demo/site_data.py` owns shared brand/navigation/category data. `demo/build.py` owns the shared HTML components and page content. `demo/styles.css` owns the visual system and responsive layouts. `demo/script.js` owns menu enhancements and local preview/validation/reset. `demo/serve.py` owns loopback preview behavior. Rebuild after editing sources; do not patch generated `demo/public/` independently.

The original nine-image pack and 18 existing local WebP derivatives are unchanged. Provenance and authored crop notes are in [asset-notes.md](evidence/asset-notes.md) and `demo/assets/manifest.json`. No new images, downloads or generations were used. The [contact sheet](evidence/input-pack-contact-sheet.jpg) documents input inspection and is not a browser screenshot.

## Checks and real-browser gap

Executed successfully:

```sh
python3 -B evidence/verify-static.py
node evidence/verify-interactions.cjs
node --check demo/script.js
node --check evidence/verify-interactions.cjs
node --check evidence/browser-qa.cjs
```

- [Static/output and actual handler report](evidence/static-results.json): 894 passes, zero failures. Includes all eight pages, local destinations/assets, labels/errors, Contact DOM order, custom 404/unsupported POST, preserved image hashes and all 66 frozen files.
- [Actual script logic report](evidence/interaction-results.json): 27 passes, zero failures using Node VM DOM doubles. This does not prove browser layout, native validity or real keyboard accessibility.
- [Reproducible build report](evidence/build-results.json): successful, byte-identical second build.

The actual request handler was executed in-process with only the listening server replaced. Live HTTP listening, direct navigation/history/reload/new tabs and real rendering remain not_run. A CUA Chrome extension was available, but file URLs were rejected by browser security policy; no workaround was used. The prepared browser runner also returned `not_run` because default Node resolution had no Playwright package. These results are not a functional acceptance score.

For real-browser checks in an environment that permits local preview, with an already installed Playwright module:

```sh
# Start the owned preview in one terminal, then:
AQUATIC_BASE_URL=http://127.0.0.1:4201 node evidence/browser-qa.cjs
# If needed, point AQUATIC_PLAYWRIGHT_MODULE to an existing package path.
```

The runner prepares all eight routes at 1440/1024/768/390/360/320px, matching first/full captures, extra width/breakpoint checks, old acceptance journeys, first-field geometry, menu/keyboard/no-JS, local form error/preview/edit/clear, reduced motion and console/network checks. It creates screenshots only when actual execution succeeds. Visually review those captures separately before claiming design acceptance. Real device, Safari/Firefox, screen reader, computed contrast, browser zoom and performance checks also remain unrun.

Actual exposed model: `gpt-6.1-sol`; reasoning effort: `xhigh`; Codex CLI launch/installed version: `0.162.1`; Node: `v23.10.0`. See [run metadata](evidence/run-metadata.json). No delegation, model substitution, commit, push, publication, deployment, external account, enquiry sending or global configuration change occurred.
