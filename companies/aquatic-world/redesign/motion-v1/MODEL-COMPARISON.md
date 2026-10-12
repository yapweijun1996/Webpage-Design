# Wan 3.0 vs Runway Gen-4.5 — Aquatic Hero Trial

Researched on 2026-10-11 (Asia/Singapore). The research and proposal below preceded execution. The user authorized the US$3 paired trial and tool support work, then prioritized one additional Runway sample on 2026-10-12. Its [current record](trial-v1/README.md) preserves the inspected shared image, both prompts, receipts and ledger. Two Runway samples completed at actual US$0.72 each, US$1.44 total. The [playable prompt comparison](trial-v1/preview-refinement.html) and [latest review](trial-v1/REFINEMENT.md) show improved fin framing/background stability but continuing motion and loop failures. The recommendation below remains the pre-trial workflow-fit judgment, not creative acceptance. Wan stays behind its unresolved billing pause; no empirical model winner can be named. No account funding or key limit was changed.

## Recommendation

Prioritize Runway Gen-4.5 for the first candidate intended for this homepage. The source already supplies the fish, aquascape, lighting and composition; the remaining creative task is restrained fin/environment motion with a locked camera. Runway's current [Gen-4.5 image-to-video guide](https://help.runwayml.com/hc/en-us/articles/48324313115155-Image-to-Video-Prompting-Guide) directly addresses motion-focused prompts, minimal subject motion and reducing camera movement. This is a workflow-fit judgment, not proof that Runway preserves fish anatomy or loops better than Wan.

Wan 3.0 is also compatible and slightly cheaper. Its longer clips, higher resolution and audio capabilities provide flexibility, but the current brief needs one silent six-second 720p shot. Use Wan as a low-cost reference candidate if the comparative trial is selected. Either model may win actual visual review.

## Verified OpenRouter capabilities

The [public video-model API](https://openrouter.ai/api/v1/videos/models) was retrieved without authentication and returned 30 models. Only the two requested entries are saved in [model-api-snapshot.json](model-api-snapshot.json). API exposure governs this OpenRouter trial; a provider's own website or application may expose additional controls.

| Property | Wan 3.0 | Runway Gen-4.5 |
| --- | --- | --- |
| Requested model ID | `alibaba/wan-3.0` | `runway/gen-4.5` |
| Canonical ID in snapshot | `alibaba/wan-3.0-20260824` | `runway/gen-4.5-20260729` |
| Six seconds, 720p, 16:9 | Supported | Supported |
| Duration range | Integer 2–30 seconds | Integer 2–10 seconds |
| Resolutions | 480p, 720p, 1080p | 720p |
| Frame-image control exposed | First frame only | First frame only |
| Audio-generation capability | Available; request off for this brief | Not available; silent video fits the brief |
| Seed parameter exposed | Yes | Yes |
| 720p base billing SKU | `duration_seconds_720p: 0.1` USD/second | `cents_per_second_output: 12` cents/second |
| One six-second clip, base estimate | US$0.60 | US$0.72 |

Both saved entries list only `first_frame`; neither lists last-frame control. A textual request for a similar final frame is a creative instruction, not a deterministic endpoint control or a seamless-loop guarantee. Identical numerical seeds across different model families do not imply comparable underlying randomness.

The [Wan model page](https://openrouter.ai/alibaba/wan-3.0) currently advertises a 15% provider promotion; the public model API reports base SKUs. Budget conservatively at US$0.10/second for 720p and verify the actual provider quote at request time. The page's lowest advertised starting rate refers to a lower resolution and is not the six-second 720p budget. The [Runway model page](https://openrouter.ai/runway/gen-4.5) lists US$0.12/second. No discount is assumed in the estimates.

## Proposed trial budget

Use one centrally prepared, visually checked 1280×720 first frame from the selected [hero image](../../comparison/assets-v1/hero-angelfish.png). Apply the same concise motion prompt to the first sample from each model. Avoid provider-specific extra controls in that initial comparison.

| Stage | Requests | Base estimated spend |
| --- | --- | --- |
| Initial comparative pair | One six-second Wan clip and one six-second Runway clip | US$1.32 |
| Optional refinements | Up to two further six-second clips of the visually preferred model | Up to US$1.44 if Runway; US$1.20 if Wan |
| Maximum proposed generation spend | Four requests total; stop earlier when a clip passes review | US$2.76 worst case |
| Recommended API generation cap | Includes headroom above the base estimate | US$3.00, proposed only |

If selecting a Runway-only trial instead, three six-second requests cost an estimated US$2.16; the same proposed US$3 cap leaves headroom. A balanced two-per-model comparison would cost US$2.64. These are alternative plans, not additive budgets.

The cap concerns generation usage from OpenRouter credits. It excludes credit-purchase fees, taxes/currency conversion where applicable, hosting/storage fees and later native CLI usage. [OpenRouter's FAQ](https://openrouter.ai/docs/faq#pricing-and-fees) confirms a fee on credit purchases; no exact recharge amount, fee rate or account balance was checked. If credits are already available, generation consumes that balance.

Before a paid run, confirm the chosen plan/cap and credential destination, refresh provider pricing/capabilities, submit serially and maintain a request/spend ledger. Count all submitted attempts against the request limit until their outcome and billing are known; an ambiguous submission must not trigger an automatic duplicate. Stop on a price increase beyond the remaining cap or after four attempted submissions. A refund is not assumed for an unsuccessful or aesthetically poor result.

## Prompt adaptation and visual decision

The existing generation prompt is an unexecuted design draft. For the first trial, propose simplifying it to motion-focused positive instructions; preserve the substantive visual constraints in the brief and review checklist. The [Runway Gen-4 guide](https://help.runwayml.com/hc/en-us/articles/39789879462419-Gen-4-Video-Prompting-Guide) recommends positive phrasing, and the current Gen-4.5 image-to-video guide favors clear descriptions of motion. Do not treat Gen-4-specific advice as an independently verified Gen-4.5 benchmark.

Candidate common trial text:

> Locked camera for one continuous shot. The fish hovers gently in the same position with small, natural fin movements. Its body, stripe pattern and extended fins remain stable and fully inside the frame. Leaves sway slightly and a few particles drift slowly through the water. Lighting and framing remain steady. Minimal motion throughout; the final composition stays close to the opening composition.

Use API settings for duration/resolution/audio and the supplied image for appearance. This proposed trial text has not replaced the prepared generation prompt or been sent to a provider.

Review the complete fish, fine fins, stripe continuity, gentle hovering, plant behavior, camera drift and end-to-start join at full and phone sizes. Watch at least three joins. Select the clip that passes the existing [media approval conditions](BRIEF.md), regardless of the preliminary model recommendation. Perform local compression/poster preparation after approval and give the exact same final video/poster to Codex and Claude. This media trial remains separate from their webpage integration comparison.

## Evidence limits

This is documentation/API-based research, not a side-by-side rendered video test. OpenRouter metadata and the model pages support capability/pricing; the motion-control rationale is a design inference informed by Runway's official guidance. Alibaba's Wan release/guide search excerpts were found, but their full pages could not be opened through the web tool; they are not used to assert additional OpenRouter controls or superior quality. No current latency promise or overall model ranking is made.
