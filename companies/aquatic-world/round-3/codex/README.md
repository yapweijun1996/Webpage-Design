# Aquatic World — Multi-page Implementation

Status: eight independent pages implemented; static and in-process request checks pass. Browser acceptance is incomplete because this run could not listen on loopback or launch Chrome, and browser security policy rejected local file URLs. No desktop/phone screenshots were captured. User design acceptance is pending.

This is an illustrative Aquatic World concept, not a verified business. All images and collection copy are demonstrative. The contact form creates a local preview only; no enquiry, storage service or contact route is connected.

## Build and preview

Run from this workspace. Runtime and build require Python 3.10+ with its standard library; the actual verified build used Python 3.14.3. No Node, npm, framework, CDN or install step is required to use the site. The WebP assets are included locally.

```sh
python3 -B demo/build.py
python3 demo/serve.py --port 4191
```

Build was actually run successfully and reproduced identical output. The preview command was attempted but denied by this environment's socket permissions (`PermissionError: [Errno 1] Operation not permitted`). Its actual request handler was checked in-process, including all pages, assets, HEAD requests and HTTP 404; a live listening preview was not verified. In an environment that allows local serving, open `http://127.0.0.1:4191/`. Stop only this command with Ctrl+C.

Without `--port`, the server uses `AQUATIC_PREVIEW_PORT` if present, or asks the OS for an unused loopback port and prints the actual address. It binds only `127.0.0.1`. Existing servers must not be stopped. Serve `demo/public/` as the site root, not under an unconfigured URL prefix. The included server supplies `404.html` with HTTP 404 for unknown paths.

## Entry routes

| URL path | Static entry | Purpose |
| --- | --- | --- |
| `/` | `demo/public/index.html` | Cinematic introduction and collection discovery |
| `/collections/` | `demo/public/collections/index.html` | Three collection families and composition planning |
| `/collections/ornamental-fish/` | `demo/public/collections/ornamental-fish/index.html` | Fish visual studies and selection questions |
| `/collections/aquatic-plants/` | `demo/public/collections/aquatic-plants/index.html` | Plant textures, palette and layered planning |
| `/collections/driftwood/` | `demo/public/collections/driftwood/index.html` | Material, branching lines, scale and space |
| `/our-story/` | `demo/public/our-story/index.html` | Editorial nature/water/people narrative |
| `/quality/` | `demo/public/quality/index.html` | Proposed principles and practical questions |
| `/contact/` | `demo/public/contact/index.html` | Local enquiry preview with category context |
| Unknown path | `demo/public/404.html` | Honest recovery page |

Category enquiry links use `/contact/?category=ornamental-fish#enquiry`, `aquatic-plants` or `driftwood`. These are allowlisted local context parameters. Header/footer links, collection cards, breadcrumbs and sibling links are ordinary page anchors. Core navigation and content are generated HTML. The native compact Menu disclosure works without JavaScript; the form explains its no-JS limitation and offers an offline brief outline.

## Source ownership and assets

`demo/site_data.py` owns shared brand, navigation and category data. `demo/build.py` owns page content and shared HTML components. `demo/styles.css` owns the visual system and responsive compositions. `demo/script.js` adds menu dismissal and local form validation/preview. `demo/serve.py` owns the loopback preview. Build output and all runtime assets are in `demo/public/`.

The nine images were deterministically encoded from the frozen input pack, preserving original inputs. Optional derivative regeneration requires Pillow; the actual run used Pillow 12.2.0:

```sh
python3 demo/tools/prepare_assets.py --source input/assets --output demo/assets
python3 -B demo/build.py
```

Provenance, sizes and hashes are recorded in [asset notes](evidence/asset-notes.md) and `demo/assets/manifest.json`. No image downloads, new generations or previous implementations were used.

## Verification and remaining gaps

```sh
python3 -B evidence/verify-static.py
node --check demo/script.js
node --check evidence/browser-qa.cjs
```

These checks were actually run. The static/request-handler report has 537 passing checks, zero failures; the number is neither a design score nor evidence of browser acceptance. [Acceptance results](evidence/acceptance-results.md) distinguish supporting source checks from unrun browser gates.

The prepared browser matrix can run where a local server and Chrome automation are allowed. It requires Node and a local Playwright package, independently of the website runtime:

```sh
# First start the owned preview in another terminal.
# Set AQUATIC_PLAYWRIGHT_MODULE to an already installed Playwright module if needed.
node evidence/browser-qa.cjs
```

The matrix covers every route at 1440/1024/768/390px, overflow widths, real cross-page journeys, direct/reload/history/new tabs, menu/keyboard/no-JS and form scenarios. It writes actual captures under `evidence/screenshots/` only when execution succeeds. No captures exist from this run. Full-size screenshot review, real-device/Safari/Firefox checks, screen-reader checks, computed contrast, zoom and performance measurements remain unrun. Do not mark this site functionally verified or design accepted until the browser gates and visual review are completed.

The [pre-code design plan](evidence/design-plan.md), [run metadata](evidence/run.json), [command record](evidence/commands.md) and [delivery](evidence/delivery.md) record the decisions and limits. All 59 frozen instruction/input files remain byte-identical. No deployment, publication, push, external enquiry or global configuration change was performed.
