# Sources and Provenance

Access/review date: 2026-10-11 (Asia/Singapore). Technical sources support API and browser behavior; composition, file budgets and experiment weights are project design decisions. No new company facts are introduced.

| Source | Supported use / limits |
| --- | --- |
| [OpenRouter video generation](https://openrouter.ai/docs/guides/overview/multimodal/video-generation) | Dedicated asynchronous API: POST `/api/v1/videos`, poll job, download content; `frame_images` supplies first/last frames. Validate capabilities before a request. General docs do not guarantee every model supports every field. |
| [OpenRouter video-model discovery](https://openrouter.ai/api/v1/videos/models) | Endpoint identified by the official docs; live model parameters/SKUs must be retrieved in generation preflight. The endpoint payload was not fetched during this preparation. |
| [Wan 3.0 model page](https://openrouter.ai/alibaba/wan-3.0) | Candidate supports image-to-video, 480p–1080p and 2–30 seconds. No sample from this model was generated or quality-ranked. Pricing/availability are mutable and must be rechecked. |
| [Runway Gen-4.5 model page](https://openrouter.ai/runway/gen-4.5) | Candidate supports first-frame image-to-video, 720p and 2–10 seconds. No sample was generated or quality-ranked. Selection remains open. |
| [MDN video element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video) | Native video, poster, muted, inline playback and media-loading attributes. Browser support/policy still needs testing. |
| [MDN autoplay guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay) | Silent playback considerations, browser restrictions and handling rejected `play()` promises. |
| [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) | Detect the user's preference for less nonessential movement; CSS visibility alone does not pause video or suppress requests. |
| [web.dev video loading](https://web.dev/articles/lazy-loading-video) | Poster-first delivery and loading strategy; above-the-fold LCP media should not be lazy-loaded. Preload behavior alone does not establish a byte budget. |
| [W3C pause, stop, hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) | Controls for automatically moving content displayed alongside other content. This loop requires a user pause control. |
| [W3C minimum contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) | 4.5:1 ordinary text; 3:1 qualifying large text. This package does not assert full WCAG compliance. |
| [Original image manifest](../../comparison/assets-v1/asset-manifest.json) and [asset notes](../../comparison/assets-v1/README.md) | Source generation date, dimensions, SHA-256, provenance and illustrative-content limits. Selected source hash rechecked locally. |
| [Current design brief](../BRIEF.md) and [round-5 results](../../comparison/round-5/RESULTS.md) | Existing multi-page contract and verified Contact revision. The earlier checks do not cover video. |

The selected image was generated through the built-in image_gen tool on 2026-10-10 using the supplied design mockup as a visual reference. It is a creative asset for the requester-controlled local demo; it is not a licensed documentary product photograph. Future generated video will require its own provider/model provenance, applicable usage terms and actual generation record before it is treated as a deliverable.

No API credentials, private account details or source image have been sent to a video-generation provider in this preparation. No paid generation, key setup or native CLI launch was performed. The routed investigation/verification module files listed in the supplied global instructions are absent in this repository; preparation uses the available repository core and design-director skill.
