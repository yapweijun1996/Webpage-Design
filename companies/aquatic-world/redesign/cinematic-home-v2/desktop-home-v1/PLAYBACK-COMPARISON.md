# Single play and continuous loop

Prepared **2026-10-15, Asia/Kuala_Lumpur**. The user selected the free local comparison after the desktop adaptation. No new media generation, source editing or publication is authorized by this study.

The subsequent [final delivery](DELIVERY.md) closes this local study at the user's request, retaining the loop default. The observations and undecided creative preference below remain the original review record.

## Review

Open [the comparison](http://127.0.0.1:4285/playback-comparison/) and select **Play both from the start**. Both previews use the same 1440x900 Home, exact raw movie, copy, crop and 1x forward speed. They are scaled for this review page. Loading is independent; frame-locked synchronization is not claimed.

- [Single play full Home](http://127.0.0.1:4285/?playback=once): ends naturally after approximately 10 seconds, retaining the browser's final decoded frame. Every fish, surface and plant stops together. The motion button becomes **Replay background**. Menu dismissal or visibility changes do not automatically replay an ended take.
- [Continuous full Home](http://127.0.0.1:4285/?playback=loop): keeps moving and retains the original scene reset at each join.

The shared controls start/restart, pause and resume both previews. Resume leaves a completed single play at its end; restart deliberately starts both again. The preview frames are read-only; the full Home links expose normal navigation and motion controls.

The review initially attaches no movie source. Explicit shared playback opts into the movie. Review preferences are isolated by mode and from the normal Home's existing pause preference. Portrait full Home remains a still; the comparison frames keep desktop dimensions even in a narrow review window.

## Decision boundary

The existing Home still defaults to looping. This comparison does not choose a preferred mode on the user's behalf or make the raw join seamless. Single play is a playback policy, not an encoded hold or a repaired loop. The video bytes and prior creative review remain unchanged. New media cost is US$0.00.

The [initial desktop verification](evidence/desktop-baseline-runtime/verification.json) and three changed baseline source files are preserved in the adjacent archive. [Current verification](verification.json) records 24 targeted comparison checks plus a fresh 43-check regression of the existing journey. Human playback preference remains pending.

## Observed result

- The single play reaches native `ended` at 10.041667 seconds, with 241 browser-reported frames, zero drops and zero corruption. It remains at its end while the loop completes four wraps.
- Shared Resume leaves the completed take stopped. Shared Restart and the full Home's Replay button explicitly restart it. Closing Menu after completion does not replay it. Manual pause persists per mode.
- The loop completes four natural wraps at 1x. The original scene reset remains visible.
- Five review-window sizes (1440x1000, 1280x900, 900x900, 390x844 and 320x568) fit without horizontal overflow; embedded views retain 1440x900 desktop geometry.
- The comparison initially attaches no video source. Both modes use the identical raw movie URL; review controls preserve the normal Home's own pause preference.
- Normal comparison and regression journeys have no runtime errors. The regression suite's intentional unknown-route 404 remains an expected negative test.

[The four-wrap comparison capture](evidence/playback-comparison/after-four-loops.png), [natural single-play ending](evidence/playback-comparison/single-ended.png) and the [structured checks](evidence/playback-comparison/comparison.json) retain observable evidence.

The scaled iframe callback observer reported fewer callbacks than the native frame counter. It is not used as proof of missing decoded frames: the completed single play reported all 241 native frames with zero drops. Loading is independent, so this is a same-content comparison rather than a frame-locked transport. No full creative-acceptance claim follows from technical passes.
