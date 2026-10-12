# Stage 2 design and state plan

Date: 2026-10-12. Written before implementation changes. Authority: the current Stage 2 request, AGENTS.md, input-stage2/BRIEF.md and input-stage2/media/manifest.json. Stage 2 supersedes missing films and centered portrait positioning in the historical Stage 1 contracts.

## Evidence and scope

Read the frozen design skill and its design-review reference, original shared brief/comparison/stage contracts, Stage 2 brief/manifest, own Stage 1 plan/self-review/checks, own demo source and own baseline renderers. Inspected supplied desktop/phone concepts and Stage 2 posters in the request, and both clean generation frames and the own baseline scene using the local image tool. The actual supplied posters have smaller subjects than the UI concepts; reference screenshots remain reference-only.

The routed instruction-modules directory is absent. Use the core and explicit stage rules. KB/MCP, another model or agent, network, generation, dependency/configuration changes, browser/OS automation, servers, outside writes (including /tmp), Git and publication are prohibited. Write only demo/, evidence/stage-2/ and root README.md. Preserve all Stage 1 evidence, input/, input-stage2/, baseline/ and other root contracts; capture hashes before edits and compare after completion.

## Planned implementation

Copy landscape.mp4, portrait.mp4 and their corresponding WebP posters byte-for-byte from input-stage2/media/ into demo/assets/immersive/. Rebuild demo/public/ with the existing Python builder. Update runtime asset notes with supplied hashes and provenance. Runway Gen-4.5 supplied the source films; the coordinator used source frames 1–36 in a cosine-eased forward/return sequence over 144 frames. These are disclosed six-second return loops, not untouched naturally looping provider outputs. Recorded new provider cost is US$1.44, with no worker spending or generation. Technical candidate selection is not human acceptance.

Retain the exact landscape selection query `(min-width: 900px) and (min-aspect-ratio: 6/5)` in HTML, JS and CSS. One shared CSS rule applies cover and portrait `object-position:50% 30%` to both poster img and video. The positive landscape media query changes both to `50% 50%`. CSS owns crop positions, including no-JS and paused/policy states; orientation changes cannot leave the two visual layers with different crops. No media transforms, stretching or asset edits.

For portrait windows with aspect ratio at least 4/5, set arrival top padding to 70svh. Express this as the intersection of the existing portrait condition and the near-square condition, after narrower overrides. Keep normal document flow and the existing min-height rather than impose a height or overflow clip. At 900×900, 900×800 and 1000×900 the arrival copy begins at 630px, 560px and 630px respectively and can extend the chapter. The ordinary 390×844 phone keeps 56svh (472.64px); 320×800 keeps its existing 53svh. These numbers are source geometry, not observed text or fish bounds.

Retain the fixed water environment beneath the transparent header, all three Home chapters and footer. Exact English copy, live Georgia/Arial text and gold collection CTA remain unchanged. No framed player, new particles, opaque split column or white Home section.

## Preserved routes and state ownership

| Visitor task | Destination and behavior |
| --- | --- |
| Arrival / collection action | Home → /collections/ |
| Collection selection | Three existing independent category pages |
| Project context | Category → /contact/?category=…#enquiry |
| Local brief | Existing Name, Email, Collection, Project groups; validation → local preview → Edit / Clear |
| Perspective | Existing /our-story/ and /quality/ |
| Navigation / recovery | Five global page links, /contact/#enquiry, footer and /404.html |

Do not change build.py, home-motion.js, shared styles/script/data or inner page HTML unless evidence establishes an in-scope failure. Literal HTML URL attributes already own every selected media/poster path for Pages rebasing; JS reads them after packaging.

| Existing state | Retained behavior |
| --- | --- |
| Eligible entry | Selected real MP4 only; muted, loop, playsinline; poster until a usable playing frame |
| Manual Pause / session return | Current frame retained during Pause; new Home entry attaches no film until Resume |
| Reduced motion / exposed Save-Data | Poster with no automatic film source/download; explicit opt-in available |
| Restrictive policy change | Revoke opt-in and retain stop; reversing policy alone cannot resume |
| Menu / hidden tab / page leaving | Temporary pause without erasing intent or attaching during initial suspension |
| Autoplay denial | Poster and discreet Play; no automatic retry loop |
| Loading / stall / media error | Last usable frame or poster; unusable motion control hidden on failure |
| Orientation / scrolling | Select matching media on orientation; never seek/restart because of scroll |
| No JavaScript | Responsive correctly cropped poster and native navigation; motion control hidden |

## Verification plan and acceptance limits

Use the existing stdlib build, Node syntax checks and bounded controller stub scenarios, with Stage 2 reports isolated from historical evidence. Adapt the own Stage 1 source verifier to require all four real media files and their manifest hashes; remove missing-film exceptions only because actual bytes now exist. Resolve every generated local link, asset and fragment. Compare seven inner pages plus 404 with own baseline renderers in memory and check unchanged Contact/shared sources.

Evaluate cover source rectangles and selected crop/arrival rules at all comparison sizes plus 900×900, 900×800, 1000×900, transition boundaries and short near-square phones. This models CSS source geometry only; it cannot prove rendered wrapping, visible subject margins or native CSS/media switching. Use existing ffprobe/ffmpeg for metadata and decode integrity, if available. Record source-frame variation separately from browser playback; source inspection cannot pass actual motion gate 5.

Rendered pages, actual inline autoplay, film advancement while scrolling, three observed loop joins per orientation, all moving-frame fish/fins, initial phone CTA fit, keyboard/menu behavior, contrast, physical devices and packaged Pages behavior remain not run. The coordinator owns the same CUA browser review and publication. Save completed results and those limits in evidence/stage-2/self-review.md, then update README.md with current assets, reproducible commands and readiness.
