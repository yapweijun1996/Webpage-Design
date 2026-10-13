# Kling Endpoint Tool Support and Read-only Quote

Completed **2026-10-14, Asia/Singapore**. Scope: the user's selected follow-up to implement Kling two-frame support in the local **Video Studio MCP** and prepare checked quotes. No paid film request, image generation, website edit or deployment was performed.

## Implemented behavior

The local `Open-Router-Video-MCP` source now supports `kwaivgi/kling-v3.0-pro` for **silent 720p image-to-video**, with an optional local PNG `last_frame_path` on both `prepare_video_quote` and `submit_video`. The last frame requires a first frame. Other models retain their existing first-frame-only policy; Wan remains paused.

Both images use the same bounded local-file checks. Kling additionally requires at least 300 pixels per side, matching endpoint dimensions and the requested image ratio. The live catalog must advertise each requested frame role and the exact silent I2V price SKU. Native 1080p/audio features and similarly named SKUs do not expand this route.

Endpoint quotes use version 2, with first and last image hashes. A changed image, prompt, capability or price invalidates the bound quote. Kling submission requires a quote digest and an explicit cost ceiling; neither grants spending authority. Job replay checks both image hashes, keeps unknown outcomes non-retryable and records a canonical polling URL when a valid job ID is returned. Legacy first-frame version-1 quote bytes were checked against a digest captured from the original implementation.

The optional shot-plan contract now accepts at most one exact `last_frame` PNG reference. One asset version may occupy both endpoint roles. Other duplicate-reference combinations remain invalid. Both roles retain project checkout, draft/status and integrity checks; corrupted tail bytes block preparation. Existing shot plans were not revised by this task.

Budget preflight now accounts for declared reservation ceilings as well as estimates. The current request must be covered by the larger of its ceiling and estimate plus 20%; outstanding jobs retain the larger of their estimate and ceiling. This corrects a gap in the earlier preflight without changing historical job bytes or their unknown cost state.

## Observed quote

A fresh STDIO session discovered the new parameter and returned the following version-2 quotes through the actual MCP adapter:

| Orientation | Controls | Catalog SKU | Estimated output cost |
| --- | --- | --- | ---: |
| Landscape | 10s, 720p, 16:9, silent, first + last | `image_to_video_duration_seconds_720p`, $0.112/s | $1.12 |
| Portrait | 10s, 720p, 9:16, silent, first + last | Same SKU/rate | $1.12 |
| Both proposed takes | One of each | $0.112 × 20 output seconds | **$2.24** |

[Landscape quote](landscape-quote.json), [portrait quote](portrait-quote.json) and [read-only probe](quote-probe.json) preserve exact hashes and observation/expiry times. These are **catalog-backed estimates, not settled charges**. The live catalog advertised no separate image-input fee SKU; actual billing with two images remains unverified. A proposed future ceiling of $1.50 per take / $3.00 aggregate would provide margin, but no new Kling spending was authorized or reserved here.

Each orientation used its existing version-1 clean reference asset in both endpoint roles to validate transport and cost preparation. These exposed-fish pictures are **not** the new concealed-fish production endpoint frames. The draft motion prompt and both exact input hashes were checked. Selecting or changing the production frames requires a new quote; these five-minute snapshots are historical evidence after expiry.

The probe enforced an explicit GET-only transport guard and observed exactly **two GETs to `/api/v1/videos/models`, zero POSTs and zero new jobs**. The entire local job-file inventory stayed byte-identical. The original Runway request therefore remains unknown, with no retry or cost reconciliation performed.

## Verification and custody

- All **117 Python tests** passed after the implementation, including endpoint transport, quote/input changes, model/SKU/audio restrictions, file custody, reservation ceilings and unknown-outcome replay.
- The actual STDIO endpoint-pin scenario passed separately: a plan/context retained one version in both frame roles. The adapter also discovered `last_frame_path` and rejected last-only requests before network use.
- Catalog UI tests and `uv lock --check` passed; dependencies and UI files did not change.
- A reversible patch was applied and reversed in a disposable directory; every affected file matched its expected before/after bytes. [Verification and source fingerprints](verification.json) identify the changes.
- One asyncio slow-callback diagnostic (~0.24s) appeared in the full run's existing production-roundtrip test; all assertions passed. This is not a video-quality or performance measurement.

The Video Studio repository originally tracked only `.gitattributes`; its source tree was already untracked. Its changed source and tests are preserved in place. A scoped patch and rollback evidence are retained under its ignored `outputs/studio/kling-endpoint-extension-20261014/`; this task did not stage or publish the pre-existing untracked repository contents. The Webpage-Design repository owns this integration report and the quote evidence.

Fresh sessions load the new schema. **The current chat's older cached MCP connection has not been reconnected** and still advertises the prior arguments. Reconnect it before invoking the new optional input there. The verified fresh session has already closed normally; no additional service or provider job was left running.

## Remaining production gates

Prepare and inspect the new orientation-specific endpoint images, then pin their exact versions in new shot plans and prepare new quotes. Resolve the original Runway outcome independently. Obtain a concrete new Kling spending scope before any paid test. Gateway acceptance of identical endpoints, actual two-image billing, fish anatomy, natural swimming, full-size crops and three consecutive loop joins remain untested. This tool delivery does not establish a production-ready homepage or change the shared CLI/publication gate.

Public references accessed on 2026-10-14: [OpenRouter video generation](https://openrouter.ai/docs/guides/overview/multimodal/video-generation), [live capability/SKU catalog](https://openrouter.ai/api/v1/videos/models), and [Kling native I2V contract](https://kling.ai/document-api/apiReference/model/imageToVideo). Gateway and local-tool limits remain separate from native model capabilities.
