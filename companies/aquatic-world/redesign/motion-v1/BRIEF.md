# Homepage Video Brief v1

Prepared on 2026-10-11. Owner: Aquatic World design preparation. Generation status: not started. See [sources and provenance](SOURCES.md); the brand and imagery are illustrative, not a verified real company or documented animal-care practice.

## Purpose and visitor journey

Give the homepage a calm sense of aquatic life while keeping its offer and collection action easy to understand. Intended visitors are retailers, aquascapers and aquarium enthusiasts exploring fish, plants and natural driftwood. This audience is a design assumption from the current [multi-page brief](../BRIEF.md).

Primary journey: Home `/` → Collections `/collections/` → a meaningful category page → Contact `/contact/` → local enquiry preview. The clip supports the introduction; visitors can complete that journey with a still image or with animation paused.

## Selected source

| Property | Value |
| --- | --- |
| Asset | [hero-angelfish.png](../../comparison/assets-v1/hero-angelfish.png) |
| Source size | 1882 × 836; 2,205,920 bytes |
| SHA-256 | `8e69f724fd29a138a438afa05739a77b81bc01e795eb115532fb8416efbeb3d1` |
| Provenance | Built-in image_gen; 2026-10-10; source record in the [original manifest](../../comparison/assets-v1/asset-manifest.json) |
| Content status | AI-generated illustrative underwater scene; no verified species, inventory or premises claim |
| Composition | One striped fish on the right, quiet dark water on the left, planted lower edge and soft light above |

Visually inspected four existing candidates during this preparation. The selected hero has a clear focal subject, space for editorial composition and continuity with both current homepages. `enquiry-underwater-school.png` has a useful quiet center but its many small fish would create a more distributed motion task. `collection-aquatic-plants.png` emphasizes foliage rather than the fish-led brand introduction. `highlight-angelfish.png` has a close subject and less room around its fins. These are design judgments, not model-output comparisons.

## Shared generation target

| Parameter | Target / decision |
| --- | --- |
| Mode | Image-to-video; one continuous shot from a shared first-frame image |
| Duration | 6 seconds; verify that the chosen model supports it before submitting |
| Output | 16:9, 1280 × 720; native supported frame rate, preserve it in delivery |
| Camera | Locked camera; stable composition and focus |
| Fish | Gentle fin movement and near-stationary hovering; retain markings, body shape and full fin silhouette |
| Environment | Small plant sway, sparse drifting particles and soft water-light movement |
| Audio | Request `generate_audio: false` where supported; final webpage asset has no audio track |
| Typography | None inside the generated frames; titles, navigation and controls remain HTML |
| Loop | Seek similar start/end composition; verify the seam after generation |

The original image is wider than 16:9. Before paid generation, the coordinator prepares one common 16:9 first frame from this source. Starting crop hypothesis: a right-aligned 1486 × 836 window at x=396, y=0, then resize to 1280 × 720. Review the full fish and fin margins visually before freezing this derivative. Do not ask different workers or providers to choose their own first-frame crop. The crop is specified here but has not been produced or verified as a derivative.

Use [GENERATION-PROMPT.txt](GENERATION-PROMPT.txt) as the common prompt. Verify model slug, first-frame support, duration, resolution and billing SKU using the live video-model API. A matching last frame may be attempted only if the selected model supports it and the agreed budget covers that attempt; it is not a guarantee of a natural loop.

## Motion storyboard

| Time | Intended scene | Review condition |
| --- | --- | --- |
| 0–1 s | The approved composition holds; fin motion and soft water light begin naturally | No sudden reframing, black opening frame or large lighting change |
| 1–5 s | Fish hovers gently; fins and plants move slightly; small particles drift | No new fish, morphing stripes, duplicated fins, aggressive swimming or camera movement |
| 5–6 s | Movement settles toward the opening composition | Watch the end-to-start join repeatedly; no visible jump, flash or double fish |

A coordinator may trim or perform a restrained seam treatment on the approved master if it preserves the subject. Check for crossfade ghosting. If the loop cannot pass visual review, record the defect and change the shared asset/direction before starting either website worker. Do not hide a bad loop under heavy webpage effects.

## Webpage composition

- Retain ocean teal, cream, restrained champagne accents and each implementation's existing type family and homepage copy.
- At desktop, keep copy in the quiet left area or a solid left column and reserve the right area for the fish. A split composition is the default safe treatment. Overlay text only on a consistently readable quiet area throughout playback.
- At intermediate widths, switch to a solid copy panel and a separate landscape media panel before copy approaches the fish. Test 1024 and 768px; let actual content fit determine the breakpoint.
- On phones, put the headline, concise introduction and collection CTA before a separate 16:9 media panel in DOM and visual order. Show the full approved frame by default; do not turn it into a tall portrait background that cuts fins off.
- At 390×844 and 360×800, the complete primary collection CTA must be visible in the first viewport. Check 320 and 430px for readability and overflow. Do not compress text or controls to force this result.
- Reserve media dimensions before loading. Poster and video use the same framing. Keep the playback button on a solid, readable surface outside the fish silhouette and away from the header/CTA.
- Keep the header readable and independently operable while the clip moves, loads, pauses or fails. The next homepage section remains easy to discover; no giant empty fullscreen introduction.

The [static study](preview.html) illustrates placement with the original image. It is schematic and does not prove the future generated clip's composition or behavior.

## Media approval before integration

Watch the full clip at actual size and at phone panel size; inspect representative frames at 0%, 25%, 50%, 75% and near the end; watch at least three end-to-start joins. Confirm subject continuity, fin margins, stable light, absence of invented text/logos and a silent final file. Record generation model/provider, exact prompt, parameters, job ID, input/output hashes, billed or exposed cost, edits, encoder command and reviewer outcome.

Target delivery: one H.264 MP4 with broadly compatible pixel format and fast-start metadata, at most 3 MiB; one shared WebP poster, at most 200 KiB. These are local acceptance budgets, not measured results or model guarantees. If acceptable visual detail cannot fit them, revise and record the common budget before either worker runs. Use the identical final MP4 and poster on desktop and phone; a separate portrait generation is outside this experiment.
