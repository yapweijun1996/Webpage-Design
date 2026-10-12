# Aquatic World — Contact Simplification

Status: Contact implemented and self-reviewed against REVIEW.md. Build, static/source, in-process request-handler and script-logic checks pass. **Rendered acceptance is incomplete:** loopback binding is denied, browser file URLs are blocked, and an existing Playwright module is unavailable. No after screenshots or measured phone coordinates are claimed. Independent visual assessment and user acceptance remain pending.

This is a fictional design demo. Imagery and collection copy do not establish a real company, inventory or business service. Contact creates a local preview; nothing is sent or saved by this site.

## Revised Contact

- One task heading, “Your project brief”, followed by one concise editable-state local-only disclosure. The duplicate task introduction, purpose copy, pre-form category panel, repeated privacy hints and action-area disclosures are removed.
- Exactly four groups: Name, Email, Collection and Project. Labels, body hints and controls use 16px text; inputs/select are at least 50px high. Name/Email share a row on wider screens and stack on phones. The shared header/menu and other page compositions are preserved.
- Category context sits under Collection. All three category links still prefill the single select; Quality opens the general brief. Unknown query values fall back to Not sure yet.
- Preview replaces the editable form and shows four rows plus “Nothing was sent.” Return to edit preserves values. Clear from edit or preview empties values/errors/output and resets Collection to Not sure yet, including incoming contextual enquiries. Reloading the original category URL intentionally prefills again.
- Useful guidance is consolidated into a closed native disclosure after the complete workspace, followed by the existing secondary image. Without JavaScript, one short explanation replaces the normal disclosure, controls remain disabled, and navigation/help stay available.

Read the [pre-edit plan](evidence/design-plan.md) and [implementation/self-review](evidence/revision-review.md) for decisions, checks and limits.

## Build and preview

Run from this workspace with Python 3.10+; no package installation is required:

```sh
python3 -B demo/build.py
AQUATIC_PREVIEW_PORT=4211 python3 -B demo/serve.py
```

Open `http://127.0.0.1:4211/`, or the focused page at `http://127.0.0.1:4211/contact/`. The build was executed with Python 3.14.3. The server command is the supported preview entry point; live startup was blocked by this environment's socket policy during preflight (`PermissionError: [Errno 1] Operation not permitted`). No listening server was started here and no other process was stopped.

If 4211 is already occupied, leave that process alone and let the OS select an unused port:

```sh
python3 -B demo/serve.py --port 0
```

Use the printed loopback address. Keep the preview terminal/process handle, and stop only that owned terminal with Ctrl+C. Serve `demo/public/` at the site root. The included server supplies custom HTTP 404 recovery and has no enquiry-submission endpoint.

## Eight real pages

| Route | Generated entry | Purpose |
| --- | --- | --- |
| `/` | `demo/public/index.html` | Brand concept and collection discovery |
| `/collections/` | `demo/public/collections/index.html` | Three collection families |
| `/collections/ornamental-fish/` | `demo/public/collections/ornamental-fish/index.html` | Fish studies and selection questions |
| `/collections/aquatic-plants/` | `demo/public/collections/aquatic-plants/index.html` | Plant palette, textures and layers |
| `/collections/driftwood/` | `demo/public/collections/driftwood/index.html` | Branching lines, material and scale |
| `/our-story/` | `demo/public/our-story/index.html` | Nature, water and people narrative |
| `/quality/` | `demo/public/quality/index.html` | Proposed principles and useful questions |
| `/contact/` | `demo/public/contact/index.html` | Editable local enquiry preview |
| Unknown route | `demo/public/404.html` | Honest recovery with HTTP 404 |

Category actions use `/contact/?category=ornamental-fish#enquiry`, `aquatic-plants` or `driftwood`. `general` is also accepted. Ordinary page anchors remain the navigation mechanism, including logo, breadcrumbs, sibling links and footer destinations.

## Source ownership and assets

Edit `demo/build.py` for HTML, `demo/styles.css` for layouts and `demo/script.js` for menu/form behavior, then rebuild. `demo/site_data.py` retains the shared brand/navigation/category data. Do not patch generated HTML separately.

The nine supplied illustrations and 18 existing WebP variants retain their manifest hashes. See [asset notes](evidence/asset-notes.md). No new image, framework, dependency, download or external service was added. All 65 snapshotted frozen files remain byte-identical. The seven other content-page HTML files and 404 remain byte-identical to their starting copies.

## Executed checks and limits

```sh
python3 -B evidence/verify-static.py
node evidence/verify-interactions.cjs
node --check demo/script.js
node --check evidence/browser-qa.cjs
node evidence/browser-qa.cjs
```

- [Static/handler results](evidence/static-results.json): 939 passes, zero failures. Includes route-specific HTML, local links/assets, form structure/order/associations, frozen hashes and actual request-handler responses without a listening socket.
- [Script logic results](evidence/interaction-results.json): 48 passes, zero failures. Executes the shipped script in a Node VM with DOM doubles. Covers contextual/general/unknown prefill, errors/summary links/focus, preview/edit/clear, length boundaries, literal HTML-like text and menu logic. These checks do not prove native browser validation or keyboard behavior.
- [Build results](evidence/build-results.json): successful rebuild; all 31 output files byte-identical on the second final build. Node used: v23.10.0.
- [Browser results](evidence/browser-results.json): `not_run`, missing Playwright module. [Environment results](evidence/environment-results.json): socket binding denied and CUA Chrome file URL rejected. No workaround, server kill or fabricated capture was used.

Real layout/overflow, 390×844 and 360×800 first-input <=320px and Name/Email visibility, 320px/desktop/tablet screenshots, actual keyboard/focus hit testing, native no-JS interactions, live HTTP journeys/history/reload/new tabs and browser console/network checks remain **not_run**. Screen reader, real device, Safari/Firefox, zoom and contrast measurement are also unrun.

The optional browser runner is for a separate environment that allows the owned loopback preview and already has Playwright:

```sh
AQUATIC_BASE_URL=http://127.0.0.1:4211 node evidence/browser-qa.cjs
# Optional: AQUATIC_PLAYWRIGHT_MODULE=/absolute/path/to/an/existing/playwright/package
```

It captures actual screens only after successful HTTP/browser execution. Inspect any resulting screenshots before declaring visual acceptance. The frozen baseline contains Contact 1440×900, Contact 390×844 first/full and Home 1440×900; it is not after-revision evidence.

The supplied launch record requests `gpt-6.1-sol`, Codex CLI 0.162.1, default CLI effort. Serving identity and reasoning effort are not independently exposed by these checks; see [run metadata](evidence/run-metadata.json). No delegate, advisor, extra model, commit, push, deployment, publication, enquiry, external account or global configuration change was used.
