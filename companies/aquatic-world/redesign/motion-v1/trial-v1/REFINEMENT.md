# Runway Prompt Refinement — 2026-10-12

Outcome: the second sample completed at actual US$0.72, bringing the trial total to **US$1.44**. Fin framing and background stability improve relative to sample 01, but fish scale/orientation and the visible end-to-start jump still fail the homepage motion brief. [Watch both samples](preview-refinement.html). User creative acceptance remains pending.

The user selected A to adjust the prompt and try **one further Runway sample**, estimated US$0.72. The existing US$3 aggregate cap and key limit remain unchanged. The user prioritizes obtaining suitable homepage media over preserving the remaining key allowance for Wan. This does not authorize more paid attempts, a recharge, website CLI execution or final asset approval.

## Controlled change

Both requests use the exact same 1280×720 first-frame image, Runway Gen-4.5, six seconds, 720p, 16:9 and audio off. Request `aquatic_runway_20261012_02` uses [PROMPT-02.txt](PROMPT-02.txt); the original request and [PROMPT.txt](PROMPT.txt) remain preserved. The changed instruction explicitly holds fish position, orientation, scale and long-fin silhouette, limits motion to gentle pectoral-fin pulses and sparse particles, and keeps vegetation/wood fixed.

The first prompt's hovering and foliage-motion wording was consistent with the brief but did not produce the intended restraint. The revision is a design hypothesis. One new stochastic output cannot establish that prompt wording alone caused a change or that all future outputs will improve.

## Preflight and submission

The explicit `aquatic-world-motion` library contained only the rejected `runway-hero-trial-01` draft. Its exact version 1 integrity and raw hash were checked; it remains unsuitable because of recorded motion/loop failures. The first-frame exact version 1 was inspected and deliberately reused as a draft generation input. Applicable approved project/video/character/style rules were empty.

A fresh Video Studio MCP STDIO session exposed 32 tools. [Preflight](refinement-preflight.json), [input pin](refinement-input-pin.json) and [live quote](refinement-quote.json) preserve the checked evidence. The live rate remained 12 cents per output second: US$0.72 base, US$0.864 with the existing 20% margin. Key allowance before submission was US$1.2763175. The MCP independently repeats its global reservations, account/key budgets, capability and image-custody checks.

The [submission receipt](runway-02-submit.json) records accepted job `gen-vid-1791758499-C4OTRnu5utdjMJRdYPbe`. Status and actual reported cost remain in the [live ledger](request-plan.json). An attempt was recorded atomically before the paid tool call; an ambiguous outcome cannot trigger automatic resubmission.

## Completed output and review

The [completed status](runway-02-status.json) and [download receipt](runway-02-download.json) expose actual cost US$0.72. [Media metadata](media-check-02.json) retains hashes, probe results and encoding settings:

| Output | Verified properties | Bytes |
| --- | --- | --- |
| [Raw MP4](runway-02-raw.mp4) | 1280×720 H.264/yuv420p, 24 fps, 145 frames, 6.041667 seconds, no audio stream | 4,109,737 |
| [Draft review MP4](runway-02-preview.mp4) | Same dimensions, duration and frame count; silent, fast-start; below the 3 MiB ceiling | 2,199,814 |
| [Draft poster](runway-02-poster.webp) | 1280×720 WebP from decoded frame 0; below the 200 KiB ceiling | 78,880 |

Complete raw and review-file decoding passed. Compression preserves the timing; no crossfade, reversed sequence, interpolation or seam repair was applied. The exact raw output was [registered](runway-02-artifact.json) as artifact `f6ff8bedca7d4ad392376d64236a6506`, imported as draft version 1 of `aquatic-world-motion/runway-hero-trial-02`, then [pinned for project preview](runway-02-output-pin.json). Import and checkout do not imply approval.

The [five representative frames](contact-sheet-02.jpg) at 0, 1.5, 3, 4.5 and 6 seconds retain the full long-fin silhouette, improving on sample 01's upper-fin clipping. Background drift is less severe. The fish still changes apparent size, position and orientation; long fins flex beyond the intended small pectoral pulse. The ending composition does not match the opening. These are coordinator visual judgments about this pair, not proof that the revised wording caused the improvement or that the model always behaves this way. Sampled frames show recognizable stripes and no additional fish, text or logo; frame-by-frame anatomical fidelity is not established.

Native desktop playback was inspected in a full 1062×597.375 media panel and in two equal 521×293.0625 comparison panels at 1280×720. All three full-frame end-to-start joins were captured before and after the boundary; each repeats a visible composition/scale jump. [First join before](full-join-1-before-02.png), [after](full-join-1-after-02.png); [second before](full-join-2-before-02.png), [after](full-join-2-after-02.png); [third before](full-join-3-before-02.png), [after](full-join-3-after-02.png). Status text is read immediately before the screenshot and can advance slightly during capture.

At 390×844, the complete video occupies 356×200.25 with `object-fit: contain`; the phone counter executed three joins and paused after the third. Desktop/phone had no horizontal overflow or recorded console warning/error. Both independent views, paired playback, replay and pause during active playback were exercised. [Browser evidence](browser-review-02.json), [desktop proof](refinement-desktop.png) and [phone proof](refinement-phone.png) retain the observations. These checks cover the trial viewer; no future homepage integration, reduced-motion handling or either CLI's website was tested.

## Budget and delivery boundary

[Post-trial balance](budget-after-02.json) returned US$0.5563175 key allowance remaining. It is below both a new Runway request's US$0.864 safety requirement and Wan's US$0.60 base quote. Neither key limit nor account credit changed. Exactly two paid Runway attempts exist; no additional request was submitted, and Wan remains paused for its separately documented billing discrepancy.

The requested refinement and review are complete. A shared seamless homepage asset remains unavailable. Possible next directions require a deliberate product choice: accept a clip for a single-play experience with a replay control, use the still image with controlled webpage animation, or retain the static website while the video work remains open. No approved worker media, native CLI run, human score or confirmed creative rule was recorded.

## Inspect the retained request

From `/Users/yapweijun/Documents/GitHub/Open-Router-Video-MCP`:

```sh
uv run --locked python -B /Users/yapweijun/Documents/GitHub/Webpage-Design/companies/aquatic-world/redesign/motion-v1/trial-v1/run_refinement.py poll
uv run --locked python -B /Users/yapweijun/Documents/GitHub/Webpage-Design/companies/aquatic-world/redesign/motion-v1/trial-v1/run_refinement.py download
```

The controller's `submit` action refuses the already-recorded request. Final review must inspect actual playback, representative raw frames, full fin margins and at least three end-to-start joins at desktop and phone sizes. No new clip is accepted or integrated based on submission success.
