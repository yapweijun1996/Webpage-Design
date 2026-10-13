# Video Model Study — Aquatic World

Studied on **2026-10-14, Asia/Singapore**. Scope: the user's pasted OpenRouter video list, the live public catalog, provider documentation, and relevant benchmark evidence. This is research only: no paid generation, retry, provider configuration change, website code change or deployment was performed.

## Recommendation

Prioritize **MiniMax H3 Max** as the economical natural-motion test candidate, **Seedance 2.5** as the candidate for richer reference-driven cinematic production, and **Kling 3.0 Pro** as an endpoint-control candidate. These are task-fit recommendations, not empirically established aquarium winners. The current source image still needs a controlled comparison of actual forward swimming, anatomy, habitat stability, readable composition and repeated joins.

The [live OpenRouter video catalog](https://openrouter.ai/api/v1/videos/models), accessed on 2026-10-14, contains 30 models. [Catalog snapshot](catalog.json) preserves public capability and SKU fields without account data or model-description prose. The pasted page is a useful shortlist, but advertised starting prices do not establish the cost of a silent 720p image-to-video request.

## Shortlist and output-cost estimates

These are **one-orientation, first-frame output-cost estimates**, in USD, derived from the current catalog. They are not live bound quotes or settled bills. Reference/video input fees, provider-specific behavior and promotions require verification before a paid request. Landscape 1280×720 and portrait 720×1280 have equal pixel counts for token-priced models.

| Candidate | OpenRouter capability | Illustrative take | Output estimate | Task-fit judgment |
| --- | --- | --- | --- | --- |
| MiniMax H3 Max (`minimax/hailuo-3-max`) | 480p/768p, 5–15s, first/last-frame capability advertised | 10s, 768p | $0.80 | First economical candidate for lifelike swimming and intact fine fins; its result must be judged independently of base H3 benchmark scores. |
| Seedance 2.5 (`bytedance/seedance-2.5`) | 480p/720p, 4–30s, first/last frames | 10s, 720p | $2.3112 | Stronger creative-workflow candidate when licensed motion/reference material and a longer continuous take are useful; higher cost and longer takes can still drift. |
| Kling 3.0 Pro (`kwaivgi/kling-v3.0-pro`) | Current gateway lists 720p, 3–15s, first/last frames | 10s, 720p, silent | $1.12 | Useful candidate for controlling opening/closing composition; endpoint control is not a seamless-loop guarantee. |
| Runway Gen-4.5 (`runway/gen-4.5`) | 720p, 2–10s, first frame | 10s, 720p, silent | $1.20 | Existing baseline candidate; the previous fixed-fish prompt and reverse editing do not establish the model's natural-swimming quality. |
| Wan 3.0 (`alibaba/wan-3.0`) | 480p/720p/1080p, 2–30s, first frame | 10s, 720p | $1.00 catalog only | Worth tracking for visual quality and longer takes; the local tool currently pauses new Wan requests for unresolved earlier billing. |
| FLUX.3 Video (`black-forest-labs/flux-3-video`) | 720p/1080p, 5–20s, first/last frames | 10s, 720p | $1.70 base SKU | Longer-take/continuation candidate; its I2V price and route are not approved by the current tool implementation. |
| Grok Imagine Video 1.5 Lite (`x-ai/grok-imagine-video-1.5-lite`) | 480p/720p/1080p, 1–15s, gateway first frame | 10s, 720p, one image | $0.31 | Low-cost composition/motion exploration; advertised 1080p is upscaled from 720p. |
| Veo 3.1 (`google/veo-3.1`) | 720p/1080p/4K, 4/6/8s, first/last frames | 8s, 720p, gateway silent SKU | $1.60 | Secondary candidate for photographic shots; the short native take and current local integration gap are tradeoffs. |

[Cost calculations](cost-estimates.json) retain exact SKUs and arithmetic, including Seedance 2.0 as a lower-cost reference candidate. Seedance 2.5 uses `(width × height × seconds × 24) / 1024` output video tokens at $0.0000107 per token: a ten-second 720p take is 216,000 tokens, about $2.31, rather than its approximately $1.03 ten-second 480p starting cost. Kling Pro's current silent I2V SKU is $0.112/second; $0.168/second is the separate audio SKU.

## Evidence and what it establishes

The [Artificial Analysis silent I2V board](https://artificialanalysis.ai/video/leaderboard/image-to-video/?audio-output=false) was opened in the actual browser and verified with No Audio selected, research previews hidden and derived models included. Wan 3.0 and base MiniMax H3 are relatively strong on this general preference board; their confidence ranges overlap. [Six selected observations](silent-benchmark-observations.json) preserve board identity, rank uncertainty and sample counts. H3 Max and Seedance 2.5 were absent from the inspected silent board. Their absence and the distinct H3 variants prevent transferring another configuration's score to them. This is not an aquarium or loop benchmark.

The [OpenRouter public example](https://openrouter.ai/benchmarks/media/videos/) inspected here is a traffic-light sequence task, sorted by correctness. Its displayed 5/5 values are task-specific correctness evidence, not a comprehensive motion-quality score or a provider success-rate guarantee. No public example video was downloaded or treated as the current aquarium's test output.

The [Seedance publisher](https://seed.bytedance.com/en/blog/one-take-creation-flexible-referencing-introducing-seedance-2-5), accessed on 2026-10-14, describes 30-second generation, multimodal references and editing, while acknowledging remaining complex-motion and multi-subject limitations. The recommendation to test it for a richer underwater world is an inference from those capabilities. [fal's H3 Max documentation](https://fal.ai/minimax-h3-max) describes a post-trained H3 variant with I2V/keyframe workflows. [Kling's own I2V reference](https://kling.ai/document-api/apiReference/model/imageToVideo) corroborates first/last-frame support.

[xAI's documentation](https://docs.x.ai/developers/model-capabilities/video/overview) confirms that Lite reaches 1080p by upscaling 720p, while the full 1.5 model has broader native capabilities. [Google's Veo documentation](https://ai.google.dev/gemini-api/docs/veo?hl=en) confirms first/last-frame control and 4/6/8s takes; its native Gemini audio behavior differs from the gateway's silent SKU. [Runway documentation](https://docs.dev.runwayml.com/guides/models/) offers multiple model families and routes. Model-native features and gateway/tool-exposed features must therefore be checked separately rather than assumed interchangeable.

## Fit exclusions and integration reality

- HeyGen Avatar IV is a talking-head/lip-sync product. It does not match an unoccupied underwater Home environment. The separate HeyGen Video model is a general generator; do not conflate it with Avatar IV.
- FLUX Video Edit and Runway Aleph 2.0 edit existing footage; FLUX Video Upscale enlarges a source clip. They do not supply a standalone new habitat from the current first frame. Upscaling cannot by itself repair animal anatomy or bad motion.
- At this model study's initial inspection, local Video Studio enabled first-frame I2V for Runway Gen-4.5 and MiniMax H3 Max, without last-frame input or Seedance/Kling/Grok/Veo submission. The user's later [Kling endpoint extension](../kling-loop-2026-10-14/tool-support-2026-10-14/README.md) adds silent Kling Pro 720p first/last-frame support and checked quotes. Seedance/Grok/Veo and full reference-video workflows remain unavailable; FLUX.3 is T2V and Wan stays paused. Tool availability does not establish model quality, and the original study itself did not expand permissions.
- The original `aquatic_cinematic_landscape_video_20261013_01` submission remains unresolved in the existing ledger. Its reserved ceiling and actual charge must be reconciled. The existing US$3 authorization specifically covers the planned Runway requests; it is not reused to fund a newly selected model or a duplicate submission.

## Proposed controlled trial, not executed

Use the same new landscape scene and common motion intent for an eight-second first-frame take from H3 Max and Seedance 2.5. Eight seconds is supported by both and reduces comparison cost; use 768p for H3 Max and 720p for Seedance and disclose that resolution difference. Current output estimates are $0.64 + $1.84896 = **$2.48896** for two landscape trials, before any unverified extras or margin. This is a future trial proposal, not new paid authorization or an automatic retry. A second trial would help uncertainty only if separately requested; one sample per model is not a reliable general ranking.

Observe complete raw 1× playback before editing: visible forward propulsion, complete changing fins/body, coherent occlusion/depth, stable wood/plants/light, quiet live-text regions and at least three actual repeated joins. Reject frozen subjects, anatomical morphs, boomerang motion, held-frame stretching and distracting restarts. First/last-frame controls may help endpoint composition but do not guarantee matching velocity, light continuity or a pleasant loop. Only a passing standalone result should advance to shared website integration.

The user selected further [Kling endpoint-loop research](../kling-loop-2026-10-14/README.md). That study proposes natural habitat occlusion at the join, independent endpoint-frame briefs and motion prompts. It does not generate films, replace the current inputs or transfer the original Runway spending authorization.
