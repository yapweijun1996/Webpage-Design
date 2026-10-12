# Authorized Home integration self-review

Implementation and source/build self-review completed on 2026-10-12. Browser evaluation and user acceptance remain pending. TASK.md authorized native implementation for this run; historical pending-execution labels in frozen inputs were not edited.

## Inspected inputs and changes

Inspected original PNG, shared desktop/390px study captures, own Home desktop/mobile and Contact mobile baselines with the local image viewer. The original scene leaves quiet water to the left of a fully visible right-side angelfish. The shared study demonstrates separated copy, full landscape framing and an external playback action. The site's baseline uses its own teal/gold brand and an image-overlay desktop hero, with copy above media on phones. The implementation keeps that brand and copy while separating desktop copy from media. No new rendered capture of the implementation was made.

Plan: [design-plan.md](design-plan.md), recorded before implementation. Source: `demo/build.py`, `demo/home-motion.css`, `demo/home-motion.js`, `demo/assets/hero-angelfish.png`; build: `demo/public/`. An asset provenance note accompanies the source/build PNG. Home alone loads the new resources. Existing shared CSS/script/site data and all original assets are unchanged. The only preview-handler change is the explicit PNG MIME mapping. No other agent/model, browser driver, MCP, external service or Git operation was used.

## Source and build results

| Gate | Actual worker evidence | Remaining limit |
| --- | --- | --- |
| Build eight pages plus 404 | `python3 -B demo/build.py`, exit 0 | Browser routing/history not exercised |
| Canonical PNG | Source/owned/build hashes equal required SHA-256; bytes 2,205,920; IHDR 1882x836 | Actual decoded browser appearance pending |
| Full framing and readable composition | Intrinsic dimensions, frame aspect-ratio, contain fit, opaque copy, no image crop/transform; copy/CTA precede media in DOM | Actual viewport geometry/overflow/contrast pending |
| Exact ambient direction | One light layer; ten 2px points; geometry/delays/durations/keyframes compared to supplied CSS | Actual complete light cycle and rendered moving states pending |
| Native control | Native button; fixed 196px width, minimum 44px height, 16px label; inherited visible focus; label tracks computed running state | Actual measured rectangles/focus/click behavior pending |
| Motion eligibility and sticky intent | 38 Node state fixtures pass; one owner, no timer/random/request; CSS play-state preserves animation definitions | Real animation phase and native signal delivery pending |
| Native menu integration | Existing header/menu markup and shared script unchanged; Home listens to its native details `toggle`; fixture checks Escape focus callback and sticky Pause | Native keyboard/disclosure/background behavior pending |
| Policy fallback | Initial/live synthetic reduce/Save-Data stop and explicit opt-in covered; scoped important CSS overcomes inherited blanket animation suppression only for Home opt-in | Native signals and CSS cascade in rendered browser pending |
| No JS and image failure | Hidden HTML control, hidden decorations, ordinary copy/CTA/navigation; ready/error fixture tests; accessible fallback and fixed frame | Disabled-JS and error painting not rendered |
| Preserve inner pages/Contact | Seven inner pages plus 404 built HTML byte-identical; shared CSS/script/source data byte-identical; four field groups, disclosures and Edit/Clear retained | Visitor journeys/validation/history in browser pending |
| Frozen inputs | All 93 protected files retain recorded hashes; protected trees have no additions/deletions; reference hashes agree with frozen manifest | Worker cannot infer wider experiment containment beyond permitted files |
| Local preview | Attempt used supplied port 4231; sandbox rejected `socket.bind` before requests, retained failure JSON; no server remains | HTTP/direct-load response checks not run |
| Preview handler | Three offline MIME/custom-404 method checks pass | Offline methods do not prove HTTP responses |

Detailed results: [static-checks.json](static-checks.json), [motion-checks.json](motion-checks.json), [preview-handler-checks.json](preview-handler-checks.json), [http-checks.json](http-checks.json). Checks run only within allowed local tooling; no dependency was installed. Python syntax was parsed with stdlib AST; both JavaScript files passed `node --check`. Final source changes were reviewed against this worker's own baseline with `difflib`, without Git. No temporary cache/debug artifact was produced in `demo/`.

## State behavior

| Condition/event | Owned state and visible action |
| --- | --- |
| Loading image | Effects/control hidden; frame reserved |
| Ready, visible, document shown, menu closed, permitted | `playing`; effects on; Pause animation |
| User Pause | Sticky user stop; `paused`; effects stay frozen; Play animation |
| Explicit Play | Clears user/policy stop, marks opt-in; runs only through all eligibility gates |
| Fully offscreen, hidden document or native menu open | Temporary `paused`; Play animation; retain stop/opt-in and animation phase |
| Re-entry, document shown or menu close | Resume only with eligible image/user/policy state |
| Initial/new reduce or exposed Save-Data true | Sticky policy stop, opt-in cleared, effects hidden; Play animation |
| Preference returns to default | Policy stop retained until explicit Play |
| Image error | Effects/control hidden; visible fallback inside reserved scene |
| JavaScript unavailable | HTML image/copy/CTA/native navigation usable; no visible effects/playback control |

The connection object is feature-detected. Supported `change` events and normal lifecycle/intersection/menu events sample exposed values. A live native Save-Data mutation that emits no event is not immediately observable; no polling was added. Synthetic fixture events are explicitly synthetic, and none are presented as native browser acceptance. A newly true independent preference stops an earlier opt-in. An unchanged true preference does not repeatedly revoke explicit Play.

Pause changes animation-play-state, not animation names or nodes. Hidden effects use visibility, preserving the cycle. The reduced-motion override restores the same CSS animation definitions under the inherited `animation:none!important`, initially paused and only running for explicit eligible opt-in. This is supported by source review; rendered phase continuity is unverified.

## Layout review and unavailable checks

Source inference only: at 1280px, the existing wrapper gives 1168px before the browser scrollbar; a 40px gap and .9/1.6 columns yield approximately 406px copy and 722px media. Natural media height is about 321px plus its 88px caption/control row. Centered beside the bounded copy and 56px vertical padding, this is intended to show frame and control within 800px. These are arithmetic estimates, not measured browser rectangles. The intermediate breakpoint stacks the content; phone headings scale from 39px to 44px, and the caption/control stack below 480px. All full-image framing remains at 1882/836.

The worker is expressly prohibited from browser-driving scripts, terminal Playwright/CDP, AppleScript and OS automation. Therefore every requested viewport (1280x800, 768x1024, 390x844, 360x800, 320x800), top/middle/bottom capture, moving/paused frame, whole 18s cycle, native hidden/visible state, native Save-Data override, live reduced-motion delivery, keyboard/background/focus behavior, overflow, no-JS/error rendering, console, refresh/history and Contact journey is **not run here**. No screenshot, rectangle, visual score, accessibility/performance score or browser pass is fabricated.

Actual primary journey remains Home → Collections → category → Contact with category prefill → local preview → Edit/Clear, but only HTML destinations and unchanged source behavior were verified here. The coordinator must exercise that journey and the common actual-site matrix in its permitted CUA environment. Physical devices, other browsers, full accessibility/performance and genuine live network preference changes remain outside this worker's evidence. User acceptance is pending.

## Reproduction

```sh
python3 -B demo/build.py
node --check demo/home-motion.js
node --check demo/script.js
python3 -B evidence/check-static.py
node evidence/check-motion.cjs
```

When loopback binding is permitted, `python3 -B demo/serve.py --port 4231` serves `demo/public/`; `python3 -B evidence/check-http.py` runs the owned-process HTTP smoke check and stops that process. This run's HTTP attempt failed before requests and was not retried without a changed prerequisite.
