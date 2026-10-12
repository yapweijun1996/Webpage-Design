# Stage 2 immersive media

Source: this workspace's frozen input-stage2/media/manifest.json, prepared and accessed 2026-10-12. The four runtime files were copied byte-for-byte from input-stage2/media/. The two WebPs replace the Stage 1 runtime posters and match the supplied films' first-frame compositions. Historical posters and Stage 1 evidence remain frozen in input/ and evidence/.

| File | Bytes | SHA-256 |
| --- | --- | --- |
| landscape.mp4 | 1325946 | e2ae169d0d91e28d8f6a9b0a6ca76227312b691d8a53c00c7127abd4e66cc38b |
| portrait.mp4 | 1536090 | df27628aeb8e3bbeb005a74eaac46af038033a752a13b20cfc2a8baa2775ac3a |
| landscape-poster.webp | 121156 | 9f2be6ac3c0beadfe2ed0c05076ac17389e94b85253f8eed21c0494061a7757e |
| portrait-poster.webp | 93462 | 40d48c199a1c3aede8a4b6c42697f1b1a007392ad90c75f8c5f5d5c06e0df6f6 |

Films are silent H.264, yuv420p, 24fps, exactly 144 frames / six seconds; landscape is 1280×720 and portrait 720×1280. Posters use the same orientation dimensions. The manifest records Runway Gen-4.5 generation and central editing: source frames 1–36 move forward then return with an explicit cosine-eased sequence over 144 output frames. No dissolve, generated replacement pixels, crop or recoloring. This is a disclosed return loop, not an untouched naturally looping provider output. The coordinator recorded US$1.44 in new provider cost. No worker generation, media repair, further paid call or asset substitution occurred.

Current selection (Stage 3): landscape when `(min-aspect-ratio: 6/5)` is true at every width, portrait otherwise. Both poster and video use cover without transforms, with landscape at `50% 50%` and portrait at `50% 30%`. The exact near-square portrait range `(4/5 <= aspect-ratio < 6/5)` puts arrival copy at 70svh with ordinary growing/scrolling sections. Narrow landscape windows retain left copy/right subject composition and compact navigation. Every runtime URL, including deferred sources, is owned by literal HTML attributes for coordinator Pages rebasing. This revises only the runtime selection/composition contract; all four supplied media files and the frozen Stage 2 manifest remain byte-identical.

Technical candidate selection is not human creative approval. Historical source/encoding/hash checks are documented in evidence/stage-2/; current correction checks are in evidence/stage-3/. Actual browser progression, inline autoplay, sampled moving-frame subject safety and three visually observed loop joins per orientation require coordinator review. No UI concept or verification image is a runtime asset; visitors see no technical media caption.
