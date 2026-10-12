# Focused revision self-review

2026-10-11. Scope: B shared header first, A earlier phone Contact workspace next, plus the related intermediate Home collision. Authority: REVIEW.md → BRIEF.md → ACCEPTANCE.md. The supplied eight-page implementation was retained and edited at its authoritative sources.

Implementation and available checks are complete. **Real-browser acceptance remains incomplete.** No after-revision browser screenshots exist in this run. Design assessment below is based on inspected own baseline images and reviewed source/output, not a claim about rendered after screens or user acceptance.

## Before, decision and verifiable result

| Area / exact starting evidence | Decision implemented | Observed result and limit |
| --- | --- | --- |
| Header, Home 1440×900: approximately 97px band, two-line branding, 14px nav | `brand(show_tagline)` removes the header slogan while retaining the footer slogan. Solid `--teal` surface. Named brand/navigation/enquiry grid areas; 28px gaps; a rule separates the nav and CTA. 15px nav, 44px header targets, 14px CTA | Generated headers on all eight routes omit the slogan and preserve every destination. Authored closed sizes are 80px wide/intermediate and 68px phone including border. These are CSS targets; actual rendered sizes are **not measured** |
| Navigation states across inner/category pages | Stable pseudo-element underline for hover/focus/current, underlined compact active links and CTA hover, 3px visible focus. Category Collections uses `aria-current="location"`; exact destinations use `page` | All generated headers have the correct context. Script logic confirms Escape/focus return and transfer from an open compact link to its equivalent desktop destination when resizing. Actual focus visibility/hit areas remain not_run |
| Compact header 1024/768/390/360/320 | Keep native `<details>/<summary>` at ≤1119px; Menu becomes Close with crossed icon. Teal disclosure expands in normal document flow. Brand is top-aligned when expanded. Phone wordmark 18px at ≤430px; omit icon at ≤359px, preserving the readable name and 80px Menu target | Native semantic markup and CSS states inspected. Source review found and repaired the open-grid vertical-centering issue before delivery. No sticky/fixed header was introduced. Pointer/keyboard/no-JS behavior in a real browser remains not_run |
| Home 768×1024 baseline: italic heading crosses fish face/body | Extend the existing phone copy/photo separation to ≤1119px. Image is a separate full-width block at its source aspect ratio, with no text overlay; copy above, caption below. Wide cinematic composition remains | Source establishes disjoint copy/photo regions at 768 and 1024. Actual crop and first-screen rhythm remain not_run. This intentionally sacrifices the intermediate overlay to preserve the subject; no other page composition was redesigned |
| Contact 390×844 first screen contains no field; 390×2666 full baseline has intro → disclaimer → photo → help → form | Actual DOM is now compact intro → whole form/preview panel → secondary aside. Phone grid follows this order; desktop places intro/help left and the entire workspace right | Parsed generated DOM confirms all editable controls and preview precede every secondary-help/photo node. No positive tabindex exists. The first name label/input is budgeted well within 390×844, but its actual visible rectangle/usability cannot be claimed without rendering |
| Long general select option in baseline | Closed option `Not sure yet`; adjacent associated help explains a complete aquascape/open idea. General preview text preserves both meanings | Option values and three category choices remain unchanged; all prefill and unknown-context logic checks pass. Browser text clipping remains not_run |
| Supplied local enquiry preview and missing explicit clear control | Preserve labels/errors, summary links/focus, literal textContent output and edit; add native Clear brief reset. Cancel JS reset defaults, clear entries/errors/output, restore incoming allowlisted category, announce no save/send and focus name | 27 actual-script event-logic checks pass with DOM doubles. They cover blank/invalid correction, safe literal preview, stale-preview invalidation, editing, clear and category preservation. Browser native validity, DOM event defaults and actual focus behavior remain not_run |

The form retains its honest disabled-without-JavaScript preview and offline explanation. Secondary guidance now includes all original useful help, collection link and photograph, plus a concise three-step outline. The footer still identifies the illustrative concept; no business facts/contact channel or sent-enquiry result was invented.

## Verification actually performed

Run from this workspace:

```sh
python3 -B demo/build.py
python3 -B evidence/verify-static.py
node evidence/verify-interactions.cjs
node --check demo/script.js
node --check evidence/verify-interactions.cjs
node --check evidence/browser-qa.cjs
node evidence/browser-qa.cjs
```

- **Build:** exit 0. Eight independent content pages plus 404. Two final builds produced byte-identical output across all 31 generated files; [build-results.json](build-results.json).
- **Static/output/actual request handler:** 894 passes, zero failures; [static-results.json](static-results.json). Includes distinct titles/headings, meaningful page depth, all global/local anchors, current page/section semantics, unique IDs, label/error references, real Contact DOM order, all local assets, source/derivative hashes and frozen-file preservation.
- **Request handler was really executed**, using BytesIO connection doubles and the actual `Handler` from `demo/serve.py`, with only the listening server replaced. GET/HEAD for all eight pages, all runtime assets, unknown-path HTTP 404 and unsupported POST HTTP 501 pass. This is not a live socket test.
- **Enhancement logic:** 27 passes, zero failures; [interaction-results.json](interaction-results.json). The actual `demo/script.js` runs in a Node VM with bounded DOM/event doubles. No browser layout, native email validity, real accessibility tree or physical keyboard is simulated as proof.
- **Syntax:** Python sources compiled without writing bytecode; Node syntax checks pass. CSS brace balance is 600 paired blocks; this is not a complete browser CSS parser check.
- **Ownership:** all 66 files captured in [frozen-before.json](frozen-before.json), including instructions, inputs and all five baseline PNGs, match their original SHA-256 values. Nine source images and 18 local WebP derivatives retain their supplied hashes. No global settings, siblings, old workspaces or evaluator reports were read/changed.
- **Source review repairs:** top-align brand in expanded grid; prevent native reset from overwriting restored incoming category; replace ineffective first-of-type field spacing with `.error-summary + .field`, keeping the first field compact despite the preceding summary. Rebuilt and re-ran checks after these changes.

## Browser attempts and unavailable checks

1. `python3 demo/serve.py` used `AQUATIC_PREVIEW_PORT=4201`. Exit 1 before listening: `PermissionError: [Errno 1] Operation not permitted` while binding `127.0.0.1:4201`. No owned server survived.
2. A Node loopback capability probe also returned `EPERM`; it created no listening server.
3. The native CUA Chrome extension was available. An owned blank tab was created. Direct navigation to this demo's `file://` entry was rejected by its browser URL security policy, which permits only HTTP/HTTPS and explicitly forbids circumvention. No injection, alternative browser surface or raw CDP workaround was used. Only that owned blank tab was closed.
4. `node evidence/browser-qa.cjs` returned exit 2 and `not_run`: Playwright was unavailable in default Node resolution. [browser-results.json](browser-results.json) records this preflight result. No package was installed and no headless browser was launched.

Consequently, every actual-render screenshot check on all eight pages at **1440×900, 1024×900, 768×1024, 390×844, 360×844 and 320×844 is not_run**. Also not_run: 430/1920 overflow; first name field fully visible/hit-testable at scroll zero; actual Home copy/fish separation; open/closed/scrolled menu; pointer dismissal; keyboard and skip link; no-JS navigation; native form error/preview/edit/clear screens; direct-load/reload/history/new-tab live journeys; console/network observations; computed contrast; 200% browser zoom; screen reader, real device, Firefox and Safari; performance measurements. No captured after screen or browser pass is implied by source tests.

The [prepared browser runner](browser-qa.cjs) covers the old IA/NAV/FORM/UI gates plus REVIEW.md: all eight routes at the six required widths, first/full screenshots, 430/1119/1120/1920 fit, header size/labels/targets/context, first-field geometry and hit testing, intermediate copy/photo split, actual links/category/history/new tabs/404, menu Escape/resize, skip/tab order, 320/390/1440 form states, no-JS, reduced motion, scrolled Contact, console and outbound-request checks. It writes screenshots only after actual browser execution. Review those real captures visually as a separate acceptance step; the prepared code itself is syntax-checked but browser-unexecuted.

For an environment that permits local serving and already has Playwright:

```sh
python3 -B demo/build.py
python3 demo/serve.py --port 4201
# In another terminal; preserve the server's own terminal/PID.
AQUATIC_BASE_URL=http://127.0.0.1:4201 node evidence/browser-qa.cjs
# If needed, set AQUATIC_PLAYWRIGHT_MODULE to an existing module's absolute path.
# Stop only this owned preview with Ctrl+C.
```

## Old acceptance gates and focused requirements

| Gate | Current evidence | Actual browser status |
| --- | --- | --- |
| IA-01, BUILD-01 | All eight generated pages, distinct content, reproducible build, actual handler/assets checked | Direct live load/reload not_run |
| IA-02–05 | Local ordinary anchors, breadcrumbs/returns/siblings/context checked; native page architecture preserved | Traversal/history/new tabs not_run |
| IA-06 | Actual handler returns custom 404 and real recovery anchors | Browser recovery not_run |
| NAV-01–04, B | Shared component, 80/68px authored targets, legible source sizes, explicit states, native no-JS disclosure; menu event logic checked | All rendered menu/layout/keyboard cases not_run |
| FORM-01, A | Real DOM task order, concise local disclosure, labels/errors, prefill and script event logic checked | First-field rectangle and native form screens not_run |
| UI-01–03 | Intermediate split, responsive source, reduced-motion rules retained; baseline inspected | After screenshots/crops/overflow/zoom not_run |
| FACT-01 | English illustrative copy, local-only action, no fabricated contact/service claims; original asset provenance retained | Content/source review complete; user acceptance pending |

Functional verification is partial (available source/handler/logic checks pass); independent design assessment and user design acceptance remain pending. No numerical design score or overall browser acceptance is claimed.

## Actual model/tool metadata

- Selected model in launch record: `gpt-6.1-sol`; exposed serving-model field: `gpt-6.1-sol`.
- Exposed reasoning effort: `xhigh`, from native Node tool request metadata. Launch record calls the effort CLI default; the exposed value is recorded separately without rewriting that record.
- Launch and installed CLI version: `0.162.1`. Python `3.14.3`; Node `v23.10.0`. Actual tools used: native `functions.exec` orchestration, `exec_command`, `apply_patch`, `view_image`, `mcp__node_repl__js` and `mcp__cua_repl.js`. No subagent, advisor, additional native model run or model substitution.
- Permissions: workspace-write, approval never; network restricted; writes limited to demo/, evidence/ and root README.md. CUA Chrome extension inventory was available, but permitted local browser navigation was unusable for this demo.
- No completed serving-browser version or actual token/cache/cost total is exposed for these checks. They are unknown, not estimated.
- Runtime owns no listening server at delivery. Other servers/processes were preserved. No commit, push, deployment, publishing, account creation or enquiry sending.

Reusable lesson stays local: Contact task priority needs actual DOM ownership, and a viewport overflow pass cannot establish copy/subject separation. Global skills/configuration were left untouched as required.
