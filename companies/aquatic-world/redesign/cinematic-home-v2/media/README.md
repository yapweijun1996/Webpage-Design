# Cinematic v2 Film Preparation

Prepared on 2026-10-13. The user authorized implementation and subsequently explicitly approved **a new US$3.00 generation cap, at most two requests, no automatic retry**. One landscape request was submitted; its outcome and settled cost are unknown. Portrait has not been submitted.

## Scene inputs and provenance

- [Landscape scene](landscape-first-frame.png): new cinematic environmental composition; [exact image prompt](landscape-IMAGE-PROMPT.txt).
- [Portrait scene](portrait-first-frame.png): separately composed phone habitat using the landscape as a photographic reference; [exact image prompt](portrait-IMAGE-PROMPT.txt).
- Built-in image generation produced the clean scenes; serving model and monetary cost were not exposed. There is no UI baked into either input. Source outputs: `exec-07ec0f8a-84e0-4858-9b99-c56ff8b4dc31.png` and `exec-6b4e0fd9-78fb-429d-9431-c6d6ecd761a5.png`.
- [Native landscape input](landscape-generation-frame.png) and [native portrait input](portrait-generation-frame.png) preserve the complete canvases using proportional FFmpeg fit/pad to 1280×720 and 720×1280. This is technical normalization, not semantic retouching. Exact input hashes match their version-pinned Video Studio library references in the shot contexts.

## Exact prospective requests

Model: `runway/gen-4.5`. Mode: image-to-video, 720p, ten seconds per orientation, silent. [Landscape motion prompt](landscape-VIDEO-PROMPT.txt), [portrait motion prompt](portrait-VIDEO-PROMPT.txt), [storyboard](../STORYBOARD.md), two shot plans and their latest version-2 contexts precede any submission. Both contexts report ready preparation, intact reference hashes and no generated result. No applicable approved creative rules were returned for this project; current user instructions govern this preparation.

The read-only Video Studio quotes observed on 2026-10-13 use the [OpenRouter video model SKU source](https://openrouter.ai/api/v1/videos/models): 12 US cents per output second. Each ten-second take estimates US$1.20; two estimate US$2.40. Authorized new generation cap: US$3.00, at most two requests, US$1.50 reserved per request, no automatic retry. Start with landscape; a clear standalone failure or unresolved submission stops portrait submission. Previous paid scopes are completed and are not reused.

The [landscape quote](landscape-quote.json) and [portrait quote](portrait-quote.json) expire five minutes after observation. The landscape quote was refreshed before submission, with the same price and exact prompt/first-frame identity. Enforce quote digest and the authorized ceiling. Prices are estimates, not settled charges.

The [request ledger](request-plan.json) records `submission_unknown` for the single landscape attempt, no returned task ID, unknown settled cost and the untouched portrait request. The US$1.50 reservation remains unresolved; do not treat the request as free, retry it, release its reservation or issue portrait while its outcome is unknown. The [status receipt](landscape-status.json) and [submission result](landscape-submit-result.json) preserve the exact non-secret evidence.

## Acceptance and future delivery

The [storyboard](../STORYBOARD.md) prohibits reverse motion, held-frame stretching and forced pose returns. Watch raw normal-speed motion before a web derivative; review three actual loop joins. A failed film stays rejected and blocks its implementation, rather than being hidden behind a static effect. The coordinator may continue the already authorized implementation after standalone technical and visual gates pass; human creative acceptance is recorded separately and stays pending unless supplied.

The exact runtime film and poster manifest will be created only after review. Neither source model discovery, preparation readiness nor a static concept guarantees a seamless natural loop. The provider's supported take length is at most ten seconds; this package does not promise the earlier study's twelve-to-twenty-second target.
