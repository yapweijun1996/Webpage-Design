# Common Homepage Video Integration Contract v1

Prepared on 2026-10-11. Applies equally to both proposed native CLI revisions. This contract defines observable behavior rather than requiring a particular JavaScript component. References are in [SOURCES.md](SOURCES.md); experiment gates live in [ACCEPTANCE.md](../../comparison/round-6/ACCEPTANCE.md).

## Ownership and product scope

Enhance Home `/` only, in a new independent copy of each worker's own round-5 code. Copy approved media into that implementation's own assets and include them in its real build output. Runtime imports from the canonical asset pack, another runner or an older workspace are prohibited. Preserve all eight distinct page routes, the current header/navigation and the four-group Contact workflow. Shared stylesheet edits must be scoped so inner pages retain their behavior and layout.

The webpage plays a pre-generated local asset. No generation request, key, provider credential, job polling, paid API call, analytics or external media service belongs in the visitor runtime. The generation tool is separate and uses approved environment/secret storage. No visitor triggers new paid generation.

## Loading and basic markup

Use a native `<video>` enhancement with `muted`, `playsinline`, looping after approval, explicit dimensions/aspect ratio and a shared static poster. Keep a real image/picture fallback visible in the base HTML. All meaningful copy and collection links are ordinary HTML and work immediately.

The poster is first-view content and must not be lazy-loaded. Load an appropriately sized poster promptly. Keep the video source unset or in `data-src` until policy and visibility checks allow loading; `preload="none"` alone is not a guarantee of zero network traffic once a source/autoplay is present. Avoid simultaneous unnecessary full PNG, poster and video downloads. Reveal the video only after an actual rendered first frame is available; use supported readiness signals and a fallback if `requestVideoFrameCallback` is unavailable. Never reveal a black media box or hide content while waiting for video.

Normal autoplay is best effort, silent and inline. Handle the `play()` promise and actual media events; controls describe the actual playback state, not a hoped-for state. If autoplay is blocked, retain the poster and offer an explicit Play animation button. Do not retry in a polling loop or claim every browser will autoplay.

## Playback states

| State / event | Required result |
| --- | --- |
| Initial HTML / JavaScript disabled | Static image, readable heading, usable CTA and navigation; no video download or dead playback control |
| Default motion policy, visible foreground hero | Begin one silent inline clip when ready; offer Pause animation while actually playing |
| Loading or buffering | Keep poster or last usable frame and stable layout; copy/links remain usable |
| Autoplay denied | Keep poster; explicit Play animation can request playback through the user's gesture |
| User pauses | Stop playback; offer Play animation; remember this intent for the document's lifetime, including scroll, menu and tab changes |
| Hero fully offscreen | Pause playback; do not keep drawing an unseen clip |
| Tab/document hidden | Pause; resume only when eligible and not explicitly user-paused |
| Hero re-enters foreground | Resume only if prior policy/intent allow it; do not override a user pause |
| Mobile menu opens | Suspend video while the menu is open; menu state and focus behavior remain correct |
| `prefers-reduced-motion: reduce` initially | Poster only; zero video-byte requests until explicit user opt-in; offer Play animation if enhancement is available |
| Reduced-motion preference changes to reduce | Pause active motion immediately; do not auto-resume it when the preference changes back |
| Save-Data signal exposed and enabled | Poster only until explicit user opt-in; record unsupported signal APIs as unavailable rather than inferring connection quality |
| Video missing, corrupt, unsupported or errors | Static poster and main journey remain usable; remove misleading playback controls, handle errors without unhandled exceptions |

A user-initiated Play may opt into motion under reduced-motion/Save-Data. It still pauses when the hero is fully offscreen, the document is hidden or the mobile menu is open. A failed explicit play returns to a usable poster state. A fresh page load may reevaluate policy; cross-visit storage is not required. Race conditions between pending play promises, menu changes and visibility must not restart forbidden playback.

## Accessibility and interaction

Provide one real keyboard-operable playback button with a visible label describing its action: Pause animation or Play animation. Use a stable minimum 44×44px target, visible focus, a readable solid background and a clear relationship to the video. Keep the button outside any `aria-hidden` media wrapper. Its order must make sense after the homepage's primary action.

Treat the silent clip as decorative enhancement and keep it out of the accessibility reading order. The image fallback may have concise descriptive alternative text if it conveys the only visual subject; avoid announcing duplicated image/video descriptions. This clip conveys no spoken, instructional or essential information. Any future informative video would need its own accessibility/content contract.

Body/control text stays at least 16px. Require at least 4.5:1 text contrast, or 3:1 for qualifying large text. A dynamic backdrop must remain readable across sampled frames and playback, not just the first poster. Prefer a stable opaque copy/control panel when contrast over moving imagery is uncertain. No essential content depends on animated reveal, hover or video playback. The hero cannot intercept scrolling, keyboard navigation or clicks intended for the primary CTA/header.

## Delivery and evidence

Use the supplied final MP4/poster unchanged and verify their SHA-256 against the future frozen manifest. Do not independently regenerate, trim, recolor, re-encode or replace them. CSS framing may vary within the brief and must retain the full fish. All common asset changes happen centrally before both workers start or in a declared shared revision.

Record the page plan, layout breakpoints, playback state logic, built asset paths, actual build/serve commands, browser capability and performed checks. Capture desktop, intermediate and phone poster/playing/paused/menu states. Disclose unavailable real-device/browser/performance checks honestly. A source inspection, synthetic event test or exit code is not proof of rendered video behavior.
