# Aquatic World — Ecosystem Landscape Trial v3

Recorded **2026-10-15, Asia/Singapore**. The user approved this raw movie's visual effect and creative direction: **“i think good, the video”**. [Exact movie feedback](USER-FEEDBACK.json) binds that decision to the raw hash. The user authorized a new **US$1.50 maximum, one desktop request only, no retry and no automatic phone submission**. One Kling take completed at provider-reported **US$1.12**. Loop continuity and copy clearance remain unresolved for Home integration. No phone, retry, new image generation, website integration or publication followed.

[Review the raw film locally](http://127.0.0.1:4284/trial-v3/preview.html) or open the [untouched movie](landscape-raw.mp4). The review page identifies the failure, starts paused, plays at 1× on request, and provides the accepted copy overlay plus a full-source scrubber. [Request ledger](request-plan.json), [submission receipt](landscape-submit-receipt.json) and [completed download receipt](landscape-download-receipt.json) keep authorization, estimate and actual cost separate.

The user subsequently authorized [local desktop Home adaptation](../../../desktop-home-v1/README.md). It reuses these exact raw bytes and shields its new copy region in HTML/CSS. Its UI evidence is separate from the original source-frame checks below; the raw loop discontinuity and shot review history are preserved. No additional paid request or public release is involved.

## Result and evidence

- **Improved but not certified:** the accepted silver-black lead remains recognizable, multiple smaller fish move, and surface/refraction changes. Continuous anatomy/propulsion and a convincing lead depth turn are not fully established from sampled evidence. Plant movement is weaker and a continuous natural leaf/tip performance remains unestablished.
- **Copy clearance failed:** at approximately 4s, actual painted desktop output shows smaller fish crossing the first headline line and an approaching fish in the description area. Source samples through about 4–7.5s show fish travel into the protected left reading region.
- **Loop failed:** four complete raw forward plays at 1×, four wraps and three saved join pairs show a fish/community and surface-pattern reset. The independent reviewer directly compared final frame 240 (10.000s) with frame 0, confirming a discontinuity.
- **Technical integrity passed:** full decode, cost lineage and exact frozen result custody are verified. A technical pass does not establish cinematic quality or human approval.

Reports: [coordinator technical](technical-review.md), [coordinator visual](visual-review.md), [independent Codex CLI](independent-review.md). The independent CLI completed its report and exited 0; it decoded the complete raw file and inspected direct/dense source-frame samples. It did not independently watch continuous 1× playback or reproduce every viewport journey, and its earlier custody/telemetry gaps are retained. The user's subsequent approval is recorded separately in the [human review receipt](landscape-human-review-receipt.json). [Current reviewed context](landscape-human-reviewed-context.json) verifies `human_decision: approve` and `state: visual_revision_requested`: creative approval does not overwrite the measured loop/copy failures or unestablished composite checks. The [earlier reviewed context](landscape-reviewed-context.json) remains historical evidence.

The [4s desktop capture](desktop-midpoint.png), [half-second contact sheet](landscape-contact-sheet.jpg), [exact source-index timestamp map](landscape-contact-sheet-timestamps.json), [independent seam sheet](independent-seam-sheet.jpg), full-size frames and three `join-N-before/after.png` pairs show the sampled findings. [Browser observations](browser-observations.json) and [playback summary](playback-summary.json) record **965 callbacks in about 40.52s**; each of the first four plays covers mediaTime 0–10. Four corresponding landscape viewports (1440×900,1280×800,844×390,640×360) pass geometry/main-fin fit; that does not override semantic fish/copy intrusion. Portrait-specific movie checks were not run because no portrait exists.

## Actual file and preservation

Raw SHA-256: `4b1a18532b2a1eded1cbf004b6ed7a5d42f8bc8d33acc80e23bb9f7dc64925af`. Native H.264 is **1920×1080**, 24fps, 241 frames, 10.041667s, 43,340,361 bytes, with no audio. The provider returned 1080p despite requested 720p / intended 1280×720. [Metadata](landscape-metadata.json) preserves actual output facts. No resizing, retiming, reverse/boomerang, held-frame extension, crossfade or finishing changes were applied to the movie.

Artifact `7add213fb8f04d05be421460519fa4e0` has `provider_job` cost provenance. Result `bebd63e01e044f2b8f102de86660c096` binds its exact raw hash to `kling-landscape-ecosystem-v3`, revision 1. [Artifact receipt](landscape-artifact.json) and [result binding](landscape-result-binding.json) retain immutable custody. Technical/independent/coordinator review receipts remain separate. No asset approval or creative rule was activated.

The approved [ecosystem static direction](../ecosystem-v3/ACCEPTANCE.json) and [v3 preparation](../trial-preparation-v3/README.md) are preserved. The exact populated version-1 first frame alone conditioned this take; there is no last-frame pin. The previous rejected US$1.12 Kling movie and the original unknown Runway job remain unchanged. The latter still reserves US$1.50, with actual cost unknown; it was not retried. Current account/key settings were not changed.

## Preview repair and commands

The basic local HTTP server did not support byte ranges. For this larger movie, Chromium exposed seekable `[0,0]`, causing a paused midpoint seek to return to 0 and stall its frame callback. [serve-preview.py](serve-preview.py) serves the same untouched files with single byte ranges on loopback only. [Server checks](preview-server-verification.json) pass HEAD/length, prefix and suffix 206 responses matching source bytes, and out-of-range 416 rejection. The full browser playback/crop/control checks were then rerun successfully. Final full-source seeking reaches 4s with seekable `[0,10.041667]`; initial Home review playback remains paused at 0.

From the repository root:

```sh
python3 companies/aquatic-world/redesign/cinematic-home-v2/media/kling-loop-v1/trial-v3/serve-preview.py --port 4284
```

Open `http://127.0.0.1:4284/trial-v3/preview.html` or append `?focus=landscape`. The separate 4283 static server can remain available; no published site is changed. [Verification](verification.json) discloses harness corrections and scope limits.

## Unsubmitted next correction

[Correction proposal](CORRECTION-PROPOSAL.md) addresses loop re-anchoring, bounded school movement and deliberate plant performance. It is text only: no new reference image, new shot plan, quote or generation was made. The current authorization is exhausted by the single allowed request, regardless of its unused monetary headroom. Any further paid request requires a new concrete decision.
