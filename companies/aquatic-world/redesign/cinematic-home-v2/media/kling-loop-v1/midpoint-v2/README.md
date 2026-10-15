# Aquatic World — Midpoint Composition v2

Prepared **2026-10-14, Asia/Singapore**. The user requested Top bar and phone-copy refinement, then one desktop and one phone still with the fish visible in the middle of the proposed swim. The user subsequently selected A, accepting current static subject scale, route and UI placement; [scoped acceptance](ACCEPTANCE.json) records exact scene hashes. The later US$3 / at most two Kling requests authorization is recorded in [trial execution v2](../trial-v2/README.md), which completed one landscape take at US$1.12. That movie failed visual and human review; portrait and retries are stopped. Static approval does not approve the actual movie.

The later [ecosystem v3 review](../ecosystem-v3/README.md) supersedes the single-fish composition direction with fish groups and complete habitat cues. This package and its scoped static acceptance remain historical evidence; the new scenes await human review and do not authorize another movie.

## Selected compositions

| View | Final layout still | Proposed full fin span | Proposed route |
| --- | --- | --- | --- |
| Desktop, 1440×900 | [Desktop midpoint](desktop-midpoint.png) | About 25% of source-frame height | Right root pocket → leftward arc in right water → turn into depth → same pocket |
| Phone, 390×844 | [Phone midpoint](phone-midpoint.png) | About 18% of source-frame height | Upper arch pocket → central upper water → gradual turn → same arch pocket |

Clean scene images: [landscape](landscape-midpoint.png), 1280×720, and [portrait](portrait-midpoint.png), 720×1280. Portrait art is independently composed. Each has one silver-and-black freshwater angelfish with visible fins and a left-facing posture. These are AI-created fictional aquarium scenes, not verified stock photographs.

The Top bar now has a shared baseline, intentional spacing, a restrained top gradient, an inset divider and a gold active underline. Phone wordmark/Menu align on one row. At 390×844 the reading block is about 34px higher than the previous [phone capture](../portrait-390.jpg), with 101px below the action and about 88px between copy and the proposed visible-fin corridor.

[Interactive static board](preview.html) switches between the original concealed endpoint and the midpoint, and shows/hides route annotations. Saved browser output: [combined board](composition-board.png), [desktop route](landscape-route.png), [phone route](portrait-route.png), [refined desktop endpoint](landscape-endpoint-refined.png), [refined phone endpoint](portrait-endpoint-refined.png). Navigation, Menu and collection action are decorative specimens; only the review controls work.

## Proposed ten-second route

1. **0–1s:** concealed behind the same root-and-leaf pocket.
2. **1–4s:** progressively emerge and swim forward to the selected midpoint.
3. **4–7s:** follow a short arc and turn into depth, without reversing/sliding.
4. **7–9s:** swim behind the pocket with progressive physical occlusion.
5. **9–10s:** fully concealed; gentle leaf/water motion continues.

[preview.js](preview.js) owns diagram coordinates. SVG and photo share the same source dimensions and centered cover crop. Gold arrows are a schematic body-center path. Green boxes are the intended fully visible fin corridors: landscape x=55–88%, y=25–64%; portrait x=22–80%, y=22–50%. The phone pocket at x=74%, y=19% is inside the upper arch; partial/hidden emergence and return occur outside the fully visible corridor. Dashed white boxes are conservative manual visual bounds, not automated fish detection. Speed, moving anatomy, occlusion and seamlessness remain film checks.

## Provenance

Built-in **imagegen**, four calls: one insertion and one scale correction per orientation. Desktop initially overshot the intended size and was reduced; phone initially undershot and was enlarged. Native outputs and original generated-image library files remain preserved. Exact prompts: [landscape insertion](landscape-IMAGE-PROMPT.txt), [landscape correction](landscape-CORRECTION-PROMPT.txt), [portrait insertion](portrait-IMAGE-PROMPT.txt), [portrait correction](portrait-CORRECTION-PROMPT.txt).

Edit targets were the original [landscape endpoint](../landscape-endpoint.png) and [portrait endpoint](../portrait-endpoint.png). Corrected landscape art supplied the phone fish species/anatomy reference. Habitat continuity was visually inspected; generated studies are not pixel-identical intermediate frames. Do not interpolate them into a film or substitute them for pinned first/last endpoints.

FFmpeg only proportionally fitted/padded output to exact 16:9/9:16 dimensions. All semantic edits used imagegen. [Asset manifest](asset-manifest.json) records paths, dimensions, hashes and provenance. Image model/fee are unexposed. No Video Studio/provider call, asset import, shot-plan revision, quote or video submission occurred.

## Preview

From the repository root:

```sh
python3 -m http.server 4281 --bind 127.0.0.1 --directory companies/aquatic-world/redesign/cinematic-home-v2/media/kling-loop-v1
```

Open [the static board](http://127.0.0.1:4281/midpoint-v2/preview.html), [desktop focus](http://127.0.0.1:4281/midpoint-v2/preview.html?focus=landscape) or [phone focus](http://127.0.0.1:4281/midpoint-v2/preview.html?focus=portrait). Append `&route=1` for the route or `&scene=endpoint` for the concealed endpoint under the refined typography. Serve the parent directory so endpoint references resolve.

## Verification

Real Chromium checks through Playwright CLI passed at **1440×900, 1280×800, 844×390, 390×844, 390×667, 320×800 and 320×568**:

- Images load; no horizontal overflow, clipped fish bounds, wordmark/Menu collision or copy/header collision.
- Focus-view action is at least 48px high, stays inside the viewport and retains bottom clearance.
- Projected visible-fin corridor clears copy by at least 20px. This uses reviewed static coordinates, not detection of a future fish trajectory.
- Both review toggles, keyboard focus and phone board top/middle/bottom scrolling pass.
- Zero captured page errors, console warnings/errors or HTTP failures in final checks.
- Actual desktop/phone, narrow/short-phone, landscape and route captures were visually inspected.

[Browser geometry](browser-observations.json) and [verification record](verification.json) record evidence and file hashes. Expanded Menu/dismissal, inputs/forms, movie playback, 200% text/zoom, physical phones, other browsers and functional-site acceptance are outside this static scope and were not tested. Natural swimming and repeated-loop joins remain untested.

The static generation/verification manifests retain their preparation-time pending-acceptance state; the later [acceptance record](ACCEPTANCE.json) owns the user's current scoped decision. Original endpoint bytes, library pins, v1 Kling plans/quotes, unknown Runway record, published demos and the earlier board remain unchanged. Trial preparation creates separate v2 plans. This package is not a website release and does not grant paid-film authorization.
