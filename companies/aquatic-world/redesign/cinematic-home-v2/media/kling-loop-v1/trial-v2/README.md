# Aquatic World — Rejected Kling Trial v2

Recorded **2026-10-14, Asia/Singapore**. One landscape request completed at an actual provider-reported cost of **US$1.12**. The raw movie failed coordinator visual inspection and the user's direct review: artificial fish appearance, only one moving inhabitant, and almost static water/plants. **Portrait and retries were not submitted.** The unused request allowance is not automatically reassigned to another attempt.

[Scene correction](SCENE-REVISION.md) replaces the isolated-fish brief with a living aquarium: a believable lead and smaller background fish, continuous surface/refraction movement, and plant tips responding to water flow. It is an unsubmitted draft; no corrected movie or additional image generation is claimed.

The follow-up [ecosystem v3 stills](../ecosystem-v3/README.md), prepared 2026-10-15, implement the revised direction as two independently composed static scenes with retained UI and motion-intent overlays. Human creative acceptance is pending; no new video request occurred. This failed movie and its review records remain unchanged.

## Authorization and execution

The user authorized **US$3 new Kling spending, at most two requests, landscape first; portrait only after landscape technical and visual acceptance**, with no automatic retry. [Request ledger](request-plan.json) separates this scope from the earlier Runway request, whose submission outcome and actual cost remain unknown and whose US$1.50 reservation remains intact.

The initial per-key budget blocker was resolved by a separate explicit authorization to raise the existing key limit to **US$5**, retaining its daily reset cycle. The saved browser setting and a live API response both confirmed the change. The key was not replaced. Private account metadata and configuration proof remain in the Video Studio repository's ignored outputs.

The [submission quote](landscape-submit-quote.json) and [submission receipt](landscape-submit-receipt.json) bind the exact prompt and two identical version-pinned endpoint images. The landscape was submitted once, downloaded, and [bound to the raw result](landscape-result-binding.json). Actual cost is US$1.12, distinct from the US$1.12 estimate and US$1.50 request ceiling.

## Actual output and review

[Raw movie](landscape-raw.mp4): SHA-256 `8a0af796d2e8effe53626948901c33138aad9abde99c28520a81b28b57b37723`, H.264, **1920×1080**, 24fps, 241 frames, 10.041667 seconds, no audio. The provider returned 1080p despite the requested 720p / intended 1280×720. Original bytes are preserved without retiming, resizing or loop repair.

- [Technical inspection](technical-review.md): full decode passed; cost and source provenance are recorded. A decode pass does not establish visual acceptance.
- [Visual inspection](visual-review.md): fish appearance, motion, scale/route and environmental continuity failed. Landscape copy/header placement passed within the tested viewports.
- [Direct user feedback](USER-FEEDBACK.json): human decision `revise`, bound to this raw movie.
- [Independent partial inspection](independent-review.md): dense sampled evidence was retained; the CLI was stopped after confirmed failure and direct human rejection. It did not produce a completed independent final review.

[Browser observations](browser-observations.json) record about 40.27 seconds at 1×, three wrap events, and four plays; the fourth was observed through 9.82 seconds of the 10.04-second take. Four corresponding landscape viewports were checked: 1440×900, 1280×800, 844×390 and 640×360. No captured page/console/HTTP errors, horizontal overflow or clipped action occurred. Portrait-specific movie acceptance remains untested because no portrait was generated.

The [contact sheet](landscape-contact-sheet.jpg), [ordered timestamp map](landscape-contact-sheet-timestamps.json), full-size frames and three saved join pairs preserve sampled visual evidence. [Verification](verification.json) states coverage and limitations. The result remains failed; no native website implementation, runtime media replacement or publication followed.

## Local review

From the repository root:

```sh
python3 -m http.server 4282 --bind 127.0.0.1 --directory companies/aquatic-world/redesign/cinematic-home-v2/media/kling-loop-v1
```

Open `http://127.0.0.1:4282/trial-v2/preview.html`. The page identifies the rejection, starts paused and provides explicit playback controls. It is a review specimen, not a released Home.
