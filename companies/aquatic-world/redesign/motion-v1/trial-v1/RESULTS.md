# Aquatic Hero — Trial v1 Review

Reviewed on 2026-10-11. One Runway Gen-4.5 sample completed, with provider-reported actual cost **US$0.72**. It passes the checked technical delivery conditions but **fails the homepage motion brief**. Wan was not submitted because its historical billing discrepancy remains unresolved. This is a partial trial, not an empirical comparison or a model ranking.

## Output and custody

Request `aquatic_runway_20261011_01` used the frozen [first frame](first-frame.png) and exact [common prompt](PROMPT.txt). The [input pin](input-pin.json), [submission receipt](runway-submit.json), [completed status](runway-status.json), [download receipt](runway-download.json) and [spend ledger](request-plan.json) retain their hashes and provider job ID. Only one paid request has been submitted in this trial. The US$3 cap, maximum four attempts and existing key limit remain unchanged.

The raw output is registered in Video Studio MCP as artifact `3a723aefe0994db6b248b9315e8e3e62` and imported into `aquatic-world-motion/runway-hero-trial-01`, exact version 1, **draft**. Its asset ID is `b481edf23b744ac8850481d166a37f99`. This records reusable custody, not creative approval or human feedback. No approved worker media or round-6 implementation exists.

| Asset | Checked properties | Size |
| --- | --- | --- |
| [Raw provider MP4](runway-01-raw.mp4) | H.264, 1280×720, yuv420p, 24 fps, 145 frames, 6.041667 seconds, no audio stream | 4,582,076 bytes |
| [Draft review MP4](runway-01-preview.mp4) | Same dimensions, timing and frame count; H.264, silent, fast-start; full decode passes | 2,509,265 bytes, below the 3 MiB delivery ceiling |
| [Draft review poster](runway-01-poster.webp) | 1280×720 WebP from decoded frame 0 | 78,338 bytes, below the 200 KiB ceiling |

[Media metadata](media-check.json) records hashes and encoder settings. Compression changes encoding only; it does not repair motion or add a crossfade, reversed sequence or altered timing. Final delivery approval remains pending.

## Creative review

The [motion brief](../BRIEF.md) requires a stable camera, nearly stationary fish, complete fine fins and a gentle repeat suitable for a homepage background. The actual result misses those conditions:

- The fish travels and turns appreciably rather than holding its opening position and orientation.
- The background composition drifts; bright vegetation enters from the left in later frames.
- The upper dorsal fin reaches and crosses the top edge near 4.5–6 seconds. This appears in decoded raw frames, before webpage rendering.
- The ending composition differs substantially from the opening; native playback visibly jumps at the end-to-start join.

The [five-frame contact sheet](contact-sheet.jpg) samples 0, 1.5, 3, 4.5 and 6 seconds. The stripe pattern remains recognizable and these sampled frames show no extra fish, text or logo. This does not establish frame-by-frame anatomical correctness.

## Playback and layout verification

The [review viewer](preview.html) played the actual encoded MP4 in the Codex in-app browser at 1280×720. Its end-to-start counter executed three joins and paused after the third. The first join was captured on both sides; the visible jump and decoded endpoints support the failed loop judgment. The evidence does not claim continuous human observation of every frame across all three repeats.

At 390×844, the entire video uses `object-fit: contain` in a 356×200.25 area and plays to its 6.04-second end. No horizontal overflow or console warning/error was recorded. The fin loss is already present in the source movie. [Browser measurements](browser-review.json), [desktop proof](desktop-review.png) and [phone proof](phone-review.png) retain the observed output. These checks cover the review viewer, not a future homepage integration, reduced-motion behavior or either CLI's implementation.

## Budget and remaining work

The initial key preflight had US$2 remaining. A read-only refresh at 2026-10-11T13:43:39Z returned **US$1.2763175 key allowance remaining**. The trial's provider-reported cost is US$0.72; separate account/key usage may also include other activity. A further Runway sample is estimated at US$0.72 before the existing 20% safety margin; a Wan six-second 720p base quote is US$0.60, still unusable while paused. The remaining key allowance cannot fund both samples with the current safeguards. No credit purchase or limit change was authorized.

The paired comparison remains incomplete. Preserve the remaining allowance for Wan unless the user chooses to prioritize a Runway refinement. Resolve Wan's billable-duration/rate explanation before submitting it. Then review any new clip against the same creative conditions before freezing approved media and starting the separate website integration comparison. User video acceptance remains pending.

A final read-only metadata check of the existing historical Wan output found exactly two seconds of video (60 frames at 30 fps), plus a 2.02-second audio stream despite its stored silent request. The US$0.2125 charge is not explained by an extended delivered video. An audio stream alone does not establish an audio billing rate. Wan's pause therefore remains in place; the [tool investigation](/Users/yapweijun/Documents/GitHub/Open-Router-Video-MCP/docs/video-model-support-2026-10-11.md) records this additional evidence.
