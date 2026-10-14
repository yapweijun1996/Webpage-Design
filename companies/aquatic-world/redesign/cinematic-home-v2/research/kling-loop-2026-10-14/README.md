# Kling Endpoint Loop Study — Aquatic World

Studied on **2026-10-14, Asia/Singapore**. The user selected endpoint-loop research after the video-model study. This package is a proposed shot design, not a generated or accepted film. No new image/video generation, provider change, runtime edit or publication occurred.

## Decision

Test **one continuous, fixed-camera take with the fish concealed behind the same root-and-plant structure at the join**. Use a new clean habitat still as both endpoint inputs, subject to the gateway accepting identical inputs. A fish emerges, swims a modest forward arc, turns naturally into depth and disappears behind the structure. Plants and water continue moving across the join. This is a design hypothesis requiring an actual trial; it is not a proven Kling aquarium result.

Do not force the three exposed fish in the current reference images to return to exact positions. Visual inspection of [landscape](../../media/landscape-generation-frame.png) and [portrait](../../media/portrait-generation-frame.png) shows three visible fish in each. Matching every body position, fin phase and velocity would add competing endpoint constraints. The habitat composition is useful; the exposed-fish endpoint arrangement needs a separate variant. Existing inputs and the pending Runway request remain preserved.

## Verified controls and their limits

The [Kling 3.0 guide](https://kling.ai/quickstart/klingai-video-3-model-user-guide), accessed on 2026-10-14, lists start/end-frame generation and 3–15-second takes. Its native interface can disable Multi-Shot for a single shot. Do not assume that native UI switch is exposed by OpenRouter.

The [official endpoint guide](https://kling.ai/quickstart/ai-video-start-end-frames), accessed on 2026-10-14, advises keeping endpoint scenes similar; large differences can produce a shot change. It describes endpoint transitions, not a certified seamless-loop mode. Its older five-second examples do not override the current 3.0 catalog durations.

The [live OpenRouter catalog](https://openrouter.ai/api/v1/videos/models), accessed on 2026-10-14, exposes `first_frame` and `last_frame` for `kwaivgi/kling-v3.0-pro`. This route currently lists **720p**, including 1280×720 and 720×1280, and supports silent generation. The extra 1080p price keys do not make 1080p a supported route. [Selected catalog evidence](catalog.json) records public fields only. [OpenRouter's image guide](https://openrouter.ai/docs/guides/overview/multimodal/video-generation#using-images) describes `frame_images` with a `frame_type` for each endpoint. Identical-image acceptance and endpoint fidelity have not been tested here.

**Engineering inference:** equal endpoint pictures constrain appearance, not the motion on either side of the join. A tail can move left before the cut and right after it; water highlights can reset; the model can slow down to satisfy its final picture. Endpoint control reduces one source of mismatch but does not establish continuous velocity, anatomy or lighting.

| Approach | Benefit | Principal risk | Decision |
| --- | --- | --- | --- |
| Current visible fish at both endpoints | Reuses the exact stills | Forces multiple animals and fins back to reference poses | Avoid for the first loop trial |
| Fish concealed at both endpoints | Moves the difficult animal join into natural occlusion | Can become a fish-free pause, teleport or emerge with changed anatomy | Recommended hypothesis; inspect emergence and concealment |
| Different A/B endpoint pictures in one repeating clip | Controls a reveal or transition | B-to-A still jumps when playback repeats | Unsuitable as a direct single-clip loop |
| Forward A-to-B plus a separate forward B-to-A take | Could form a longer cycle | Two independently generated joins, identity drift and additional paid jobs | Defer; never substitute reverse playback |

## Proposed ten-second action

| Time | Required action | Failure to reject |
| --- | --- | --- |
| 0–1s | Lead fish remains behind the root; fine plant/current movement is already present | Held starting picture or whole-scene stillness |
| 1–3s | One modest angelfish emerges progressively through a real opening | Pop-in, fins appearing through solid wood |
| 3–7s | Fish swims a short smooth arc in open middle-distance water, with natural propulsion and a gradual turn into depth | Hovering cutout, backward slide, abrupt rotation, drifting anatomy |
| 7–9s | Fish swims behind the same root-and-leaf cluster and becomes fully concealed | Shrinking/fading animal, geometric intersection |
| 9–10s and next 0–1s | Fish continues its unseen route; water and leaves keep a compatible rhythm across the join | Freeze, conspicuous empty pause, plant/light reset |

The times express intent, not exact motion control. The hidden phase must read as a short passage behind habitat, not an excuse for a mostly motionless film. The central visible swim is essential. A small natural path is preferable to a spectacular camera move or fast lap. One lead fish simplifies this first trial; the habitat still supplies ecological detail and depth. Adding another visible animal requires its own continuity review.

[Endpoint-frame brief](FRAME-BRIEF.md) specifies independent desktop/phone composition. [Landscape motion prompt](landscape-VIDEO-PROMPT.txt) and [portrait motion prompt](portrait-VIDEO-PROMPT.txt) are drafts for these not-yet-created endpoint assets. They must not be submitted against the unchanged three-fish images. Prompt wording is a request to a generative model, not a guarantee of physics or timing.

## Trial parameters and output estimates

Use `kwaivgi/kling-v3.0-pro`, 10 seconds, 720p, `generate_audio: false`, first and last endpoint inputs, one landscape take first. Only consider the independent portrait take after the landscape passes standalone review. The current silent I2V SKU is **$0.112/second**: $1.12 landscape, or $2.24 for landscape plus portrait. Fifteen seconds would be $1.68 per orientation and gives more swimming time, but also increases drift exposure and cost. Ten seconds is the initial design choice, not evidence that it is optimal.

These are output estimates, not live bound quotes, settled bills or new spending authorization. Recheck capability, exact two-image pricing and a bounded quote before proposing a paid trial. The existing US$3 authorization applies to the original Runway scope and is not transferred to Kling. [Trial specification](trial-spec.json) explicitly records missing assets, unavailable tool support, zero new submissions and unknown prior Runway cost.

## Tool readiness at initial study

The current Video Studio `submit_video` schema exposes a single `first_frame_path`; it has no last-frame argument and does not allow Kling submission. The local implementation was inspected read-only. Model-native support, gateway support and local-tool support are different layers. No allowlist, billing validator or provider code was changed, and no direct POST bypass was used.

This plan therefore does not become execution-ready merely by selecting Kling. A later integration task must provide checked two-frame transport, model/SKU validation and a bounded quote. It must durably record the returned job ID, polling URL and actual cost; an unknown submission must remain reserved and must not be automatically retried. The original Runway outcome remains unresolved in the [existing ledger](../../media/request-plan.json).

The user's subsequent selected follow-up implemented the [Kling endpoint tool extension](tool-support-2026-10-14/README.md). Fresh MCP sessions now support the two inputs, checked quotes and optional tail asset pins; existing cached connections need reconnection. Read-only quotes using the old reference images estimate $1.12 per orientation. New production endpoint assets, provider acceptance and settled two-frame billing remain unverified. The original `trial-spec.json` records the proposal's pre-extension state, not current tool readiness.

The later user-requested [endpoint still package](../../media/kling-loop-v1/README.md) now provides separate concealed-fish landscape/portrait draft inputs and newly bound quotes. Both first/last roles use the same version-pinned image per orientation. Static composition and four viewport crops were reviewed, but provider motion/loop quality and actual billing remain untested; the original proposal JSON is preserved as historical evidence.

## Standalone acceptance before either CLI

1. Preserve raw output, original frame rate, job metadata and actual cost. Inspect the full take at normal speed before encoding or trimming.
2. Repeat it for at least four complete plays, giving **three consecutive end/start joins**. Watch at full landscape and portrait presentation sizes. Inspect the final and opening one-second windows, then adjacent frames around each join; a matching still pair alone is insufficient.
3. Require plausible forward propulsion, stable body/eyes/stripes/fins and correct gradual wood/plant occlusion. The visible swim must not collapse into a brief flicker between long hidden intervals.
4. Reject camera jumps, exposure flashes, resetting shadows, root deformation, abrupt leaf-velocity reversal at the join, held frames, fish pop-in, forced backward return and unnatural endpoint deceleration. Natural gradual leaf oscillation is allowed. Minor drifting particles may differ without a perceptible restart; attention and physical continuity determine acceptance.
5. Apply the existing live-copy masks: protected top bar, landscape left copy and portrait lower copy. Review desktop, 320px/390px narrow portrait, near-square and phone landscape crops. All fish must be fully inside the safe region while swimming visibly; concealment is allowed only behind real habitat, not through a crop edge.
6. Record technical checks separately from coordinator visual judgment and human creative acceptance. If any critical motion or join fails, retain the rejection; do not hide it with reverse playback, a fish-doubling crossfade or held-frame stretching.

Only an accepted raw take may produce web derivatives under the existing [film treatment](../../STORYBOARD.md) and [shared brief](../../BRIEF.md). Derive the poster from the accepted opening frame, then freeze identical film/poster bytes for both CLI implementations. Web encoding can worsen a seam; repeat the join review after encoding. This study does not replace the active storyboard, release gate or unresolved request ledger.

## Evidence status

- Verified: publisher endpoint capability; current public gateway dimensions, durations and SKUs; exposed local-tool limits; visible contents of the two source stills.
- Proposed: occlusion route, one-fish trial, same-picture endpoint pair, timing and copy-region choices.
- Unverified: identical endpoint acceptance, actual underwater motion, anatomical stability, loop quality, two-image settled price and mobile crop quality. No new still, film or live-site evidence exists for this strategy.

All external sources above were accessed on 2026-10-14, Asia/Singapore. This is a fictional-brand design experiment and supplies no verified real inventory or company claims.
