# Controlled Animation Study — Verification

Reviewed on 2026-10-12 in the Codex in-app Chromium browser, using actual viewport overrides and native/browser controls. This report applies to the independent study only. No contestant implementation was revised or scored.

## Observed browser results

- The original 1882×836 image decodes and uses `object-fit: contain`, with no transform. Full fish/fins are visible in inspected desktop and phone frames.
- 1280×800 desktop shows the full 785.81×349.06 image and the 44px-high playback button together in the first viewport. At 390×844, the image is 350×155.47 and the button ends at y=566.77. The copy and comparison link precede the image.
- Viewports 320×800, 360×800, 390×844, 768×1024, 1059×800, 1060×800 and 1280×800 have no document horizontal overflow. Both sides of the wide-layout breakpoint were measured. The final intermediate spacing also retains the button in the first viewport at 1059×800.
- Eleven CSS animations actually run: one light and ten particles. A desktop observation spans more than one complete 18-second light cycle; a phone sample spans 93.32 seconds, covering the longest 22-second particle cycle. Image geometry remains identical in both. All animation endpoints match in transform/opacity. No fish/video frame is replaced at the loop seam.
- Pause freezes every recorded animation time across a 1.2-second sample. Enter and Space operate the button; the visible focus ring is 3px solid `rgb(133,101,56)`.
- Phone top, middle and bottom states were inspected. A partially visible frame keeps moving; a fully offscreen frame pauses, including stable animation times. Returning resumes eligible motion. Explicit Pause survives scrolling away and back.
- Menu opening suspends motion. Button, Escape and backdrop dismissal restore trigger focus. Explicit Pause survives menu changes. The open dialog remains modal across 390→768→1280px. Forward/backward keyboard navigation cycles between the first and last controls without reaching background links.
- CDP reduced-motion emulation was used for initial and live preference checks. Reduce stops motion and hides decorations. Explicit keyboard Play opts in; a later Reduce stops again. Returning to no-preference leaves motion stopped.
- With JavaScript disabled, the source remains visible, decorations and unavailable buttons stay hidden, and native clicking the comparison link reaches its real HTML destination. No hidden element leaks through authored display styles.
- A deliberately blocked image request produces no motion/decorations/playback button and retains reserved geometry. Alternative text uses a light foreground on the dark frame. Restoring the request returns to a valid image and normal motion.
- Normal warning/error logs are empty. The final page requests only its local PNG, stylesheet and script; no API, video, external font or paid resource is requested.

Evidence: [browser measurements](evidence/browser-review.json), [desktop](evidence/desktop.png), [phone](evidence/phone-390.png), [phone menu](evidence/phone-menu.png), [reduced motion](evidence/phone-reduced-motion.png), [no JavaScript](evidence/phone-no-javascript.png), [image failure](evidence/phone-image-failure.png), [first cycle sample](evidence/cycle-start.png) and [later cycle sample](evidence/cycle-after.png). Other viewport and scroll screenshots are retained in `evidence/`.

## Corrected findings

The initial full-width desktop study placed the image bottom at y=890.75 and playback control bottom at y=947.25 in an 800px viewport. The revised wide composition places copy on the left and full landscape media on the right. [Initial evidence](evidence/desktop-initial-fold.png) is preserved.

At an intermediate width, excessive intro spacing initially put the control just below the first viewport; narrower intro spacing corrected it. Native dialog behavior initially allowed Shift+Tab to leave the page focus at the first control; explicit first/last focus cycling now retains dialog focus and was retested. The image-failure foreground was set to the light paper token for readable fallback text.

## Signal logic checks and material limits

The initial in-app review reported documents as `visible` even when another tab was created, and the exposed Save-Data signal was false. Those initial checks did not establish hidden-tab or Save-Data=true browser acceptance. The bounded native-signal follow-up below closes the hidden-state and initial Save-Data gaps without replacing the original evidence.

### Native-signal follow-up · 2026-10-12

Used real Chrome tabs through the installed browser interface; the reported engine is Chrome/154.0.0.0 on macOS. Only temporary localhost test tabs were created. [Native measurements](evidence/native-signal-review.json) retain both the unsuccessful preliminary attempts and passing native states.

The testing interface's focused/active-page emulation initially kept an inactive tab `visible`. Disabling that emulation with `Emulation.setFocusEmulationEnabled(false)` allowed the browser to expose its real `document.hidden=true`. Native Chrome tab clicks then produced actual hidden/visible transitions. Returning the test window to the foreground used its native Raise action. No visibility getter was patched, no application event was manually dispatched, and no system permission, networking or authentication configuration was changed.

- Actual hidden tab: `visibilityState=hidden`, `hidden=true`, all eleven animations paused and unchanged across a 1.3-second sample.
- Actual visible return: `visibilityState=visible`, eligible motion resumed and its animation time advanced.
- User Pause followed by hidden/visible: motion remained paused with Play animation still offered. A return did not overwrite user intent.
- Save-Data initial load: the browser's native `navigator.connection.saveData` getter returned true after `Emulation.setDataSaverOverride`. A reload showed the ready original image, no moving decorations and eleven paused animations with unchanged times.
- Explicit Play under Save-Data=true: motion ran only after opt-in, suspended in a real hidden tab and resumed when visible. User Pause remained preserved when the native Save-Data value changed back to false.
- A separate initial policy stop remained stopped when Save-Data returned to false without a user Play.

Save-Data was tested through Chrome's native CDP override, not an injected property/mock or a physical device/carrier preference. The [official protocol schema](https://raw.githubusercontent.com/ChromeDevTools/devtools-protocol/master/json/browser_protocol.json), accessed 2026-10-12, defines both focus emulation and the native Save-Data override. The getter remained native code in the recorded browser evidence.

**Remaining live-signal limit:** changing the native Save-Data override on an already running page changed the getter but did not stop motion. A temporary observation-only connection listener recorded zero `change` events during a bounded 1.6-second false→true override sample. No event was dispatched to force a pass. This interface establishes the initial-policy and explicit-opt-in results above; it does not establish delivery or handling of a real live network preference change. The earlier synthetic connection-change fixtures remain logic evidence only. The temporary listener was removed by reload and its absence verified. No confirmed preview defect required a code change.

Save-Data overrides were removed, default false/normal playback was verified, and all temporary Chrome test/proof tabs were closed. The [Save-Data static proof](evidence/chrome-save-data-static.png) shows the complete frame at scroll position zero; the first scrolled capture is retained separately. The original in-app preview remains available. No contestant workspace, historical media, frozen input, API funding or native CLI execution was changed.

[15 contract fixtures](evidence/state-check.json) exercise simulated hidden/visible, Save-Data, preference, user-pause, menu, offscreen and image-error signals against the actual script. These prove logic under supplied signals, not real tab lifecycle or a Save-Data device. The fixture is [state-check.mjs](evidence/state-check.mjs).

No active-input/form state applies: this study contains no form or composer. Physical phone, Safari/Firefox, real browser zoom, connection throttling, performance profiling and complete accessibility conformance were not tested. The existing eight-page sites were not re-tested for this isolated, dependency-free study; their bytes are preserved. The original PNG remains 2.21MB, and no network/performance improvement is claimed. Visual subtlety and user acceptance remain judgment/pending.

All CDP preference, JavaScript, request-blocking and cache overrides are restored. Temporary viewport overrides are reset at completion.

## Repeatable checks

From the repository root:

```sh
node --check companies/aquatic-world/redesign/animation-v1/motion.js
node companies/aquatic-world/redesign/animation-v1/evidence/state-check.mjs
python3 companies/aquatic-world/redesign/animation-v1/evidence/verify.py
```

[Package checks](evidence/package-check.json) include the original study checks and native-signal follow-up. The report owns current assertion/served-target totals. All 1,758 historical implementation/trial files remain byte-identical and eight historical prepared contracts retain their hashes. The assertions cover source/reference hashes, links, CSS cycle endpoints and recorded browser states. These checks are local verification, not native execution, generated-media approval or a model comparison result.
