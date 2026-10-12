# Actual-site evidence and evaluator corrections

All live website interaction used CUA. No terminal Playwright, browser/CDP runner, AppleScript or OS automation was used by the evaluator or authorized to workers. The Python evidence verifier reads saved observations and media metadata; it does not launch or drive a browser.

## Inputs and acceptance boundaries

The canonical six animation inputs remain frozen. An implementation-owned exact PNG is required in each built site. A copy of the standalone study does not satisfy site integration; native workers adapt Home within their own eight-page structure and preserve their existing header/Contact. Fresh disposable builds and HTTP checks are independent of worker self-checks. Actual browser observations are independent of the earlier study. Visual judgment and pending human acceptance remain separate.

## Browser method

- Native CDP Runtime.evaluate through CUA reads DOM rectangles, image readiness, native media-query/connection/visibility values and actual CSSAnimation timing/keyframes. It does not dispatch synthetic lifecycle events or manipulate app state to claim acceptance.
- Resizing uses the supported viewport helper while unambiguous, then tab-scoped native device metrics for the two-tab workflow. Every final capture verifies native innerWidth/innerHeight, loaded fonts and a stable zero scroll position. Native Home plus read-only frame observations waits for smooth scrolling to settle; no CSS is patched for screenshots.
- Native app tab selection with `Emulation.setFocusEmulationEnabled(false)` exposes genuine Chrome hidden/visible states. Background snapshots are read without taking a source-tab screenshot or performing a Playwright action that could reactivate focus emulation.
- Save-Data uses the supported native override, not a JavaScript getter replacement. A temporary observation-only `connection.change` listener records zero events over 1.3 seconds. Reload removes that observer and an omitted override restores the original getter. The signal interface limit is not disguised by event dispatch.
- No-JS disables script execution in the test tab. Asynchronous locator internals cannot run in that state; native coordinate clicks, grounded in observed source/screenshot/rectangles, operate the genuine links and disclosure instead.
- Image failure enables the Network test domain, disables the test-tab cache and blocks the actual hero URL. Native loadingFailed (`blockedReason=inspector`), zero natural dimensions, real fallback and hidden control establish that the error occurred. URL blocking/cache/script/media/device-metric overrides are removed after testing, and temporary tabs close.

## Preserved corrections

Raw browser observations are retained in each `evidence/<runner>/browser.json`, including early noncanonical samples. Final comparison/acceptance uses `final-home-top-*` and `final-contact-top-*` records.

1. A browser screenshot request returned JPEG bytes even when initially saved with a .png name. A PNG-only dimension assertion failed. All 34 created screenshot files were renamed .jpg without re-encoding; a standard JPEG header reader verifies the final captures' dimensions. Frozen input PNGs were not changed.
2. `scene.getAnimations({subtree:true})` includes Claude's brief 200ms control hover/focus transitions as well as the eleven ambient CSSAnimations. An unscoped length assertion failed. Acceptance now scopes to actual named decorative CSSAnimations; no implementation or paused-scene requirement changed.
3. A translated particle's DOMRect width was 1.999996185px rather than exactly 2px due to floating-point bounds. The verifier uses a 0.001px tolerance, far below a visible pixel, while retaining exact source counts/timing and the left-of-fish bound.
4. An initial Codex desktop tab used the native window size rather than the requested size; it was not accepted as the 1280×800 cycle. A complete cycle was re-observed at the measured exact size. Later the browser-level viewport helper changed only the selected tab; per-tab native metrics corrected the two-tab workflow.
5. Early captures preserved 56px scroll position from locator auto-scroll; wheel overscroll can also briefly offset the painted canvas. Those samples remain recorded. Final captures use the native Home key and stable zero-scroll observations.
6. A helper closure retained the old form-group selector after a function reassignment. Direct DOM inspection showed four actual groups. A fresh helper with the observed selectors rechecked all five sizes; final Contact records contain four groups for both.
7. A first image-block attempt had not enabled Network and did not cause an error. That observation is retained as ready/playing, not called a passed error test. The enabled native failure test supplied the accepted evidence.
8. An initial selector treated Codex's native summary as a role button, while the DOM snapshot exposed a generic/disclosure. The actual summary/native disclosure was used instead; no markup or accessibility role was altered to satisfy the locator.
9. An attempted dynamic helper constructor was rejected by the REPL; a normal function declaration replaced it. A malformed quoted read-only selector returned no rectangle; it was corrected and native navigation then completed. Neither event changed site code or acceptance requirements.

The later Mac lock prevented only the documented extra native follow-up; no unlock, permission or security setting was changed. Three extension-origin module-loading errors per site are retained in console.json and excluded from site-origin error claims with their source stated explicitly.

## Reusable design/operation observations

Full landscape imagery preserves the supplied subject, but copy and caption length determine whether playback fits a narrow first viewport. Measure the actual control bottom at the smallest width instead of assuming a large-phone screenshot proves it. One state owner plus phase-preserving CSS pause makes temporary menu/visibility gates compatible with persistent user/policy stops. Exact prompts and assets improve comparability; baseline code, effort, permissions and image delivery still prevent isolated model conclusions.
