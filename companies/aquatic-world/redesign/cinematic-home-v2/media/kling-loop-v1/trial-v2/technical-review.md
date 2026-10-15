# Landscape Trial v2 — Technical Inspection

Subject: raw provider movie SHA-256 `8a0af796d2e8effe53626948901c33138aad9abde99c28520a81b28b57b37723`.

- **decode — pass:** complete raw FFmpeg decode succeeded with no decoder diagnostics. FFprobe reports one H.264 video stream, 1920×1080, 24fps, 241 frames, 10.041667s, no audio stream. Requested 720p / intended plan 1280×720 differs from actual 1080p; original bytes are preserved without normalization or retiming. Duration is within the plan's 9.8–10.2s range.
- **acceptance-record — pass:** local completed provider job reports US$1.12, separate from its US$1.12 estimate and US$1.50 ceiling. The artifact uses provider_job cost provenance and is bound to the exact raw hash in shot revision 1. Technical inspection, coordinator visual findings and direct human rejection are separate records. No human approval is claimed.

Browser observation ran about 40.27 seconds at playbackRate=1, with 958 decoded-frame callbacks and three observed wrap events across four plays. Actual scene sources were ready at four corresponding landscape viewports (1440×900, 1280×800, 844×390 and 640×360); no horizontal overflow, clipped action or captured page/console/HTTP errors occurred. The fourth play was observed through 9.82s, near the 10.04s endpoint. These runtime facts do not establish cinematic quality or every-frame anatomy.

Initial post-seek screenshots were stale compositor frames. They were replaced after requestVideoFrameCallback confirmed mediaTime=3.958333 and two animation-frame paint boundaries. The first contact-sheet command encountered an unavailable drawtext filter; an unretouched tile sheet with a separate ordered timestamp map was generated instead. These evidence-harness issues did not alter source media or weaken acceptance.

Public evidence: trial-v2/landscape-metadata.json, browser-observations.json, landscape-download-receipt.json, landscape-result-binding.json, landscape-contact-sheet.jpg and timestamp-named full-size frames. Original bytes remain under Video Studio outputs. The rejected landscape does not authorize portrait or an automatic retry.
