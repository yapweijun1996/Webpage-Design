# Homepage Video Acceptance and Comparison v1

Declared on 2026-10-11 before any video-generation sample or sixth-round worker run. All implementation outcomes currently remain not run. [BRIEF.md](../../redesign/motion-v1/BRIEF.md) owns visual intent; [INTEGRATION.md](../../redesign/motion-v1/INTEGRATION.md) owns state behavior; [protocol](README.md) owns experiment setup.

## Shared asset prerequisite

Before either worker starts, verify the common first frame, complete clip, anatomy/markings, fin margins, subtle motion, silent file and at least three loop joins at actual size. Check actual 1280×720 / six-second output, compatible encoding, MP4 ≤3 MiB, poster ≤200 KiB and provenance/hashes. Media generation is not a contestant task. A bad shared clip requires shared preparation repair rather than scoring one worker for generator quality.

## Functional and regression gates

| ID | Scenario | Required observation |
| --- | --- | --- |
| VID-01 | Build and serve a fresh own-code copy; request built media | Real media load from that worker's assets; bytes match the frozen approved manifest; no external generation or cross-workspace import |
| VID-02 | Cold Home load with normal motion policy | Heading/CTA/poster appear without waiting for video; stable reserved geometry; one silent inline clip becomes visible after a real frame is ready |
| VID-03 | Play/pause by pointer and keyboard | Label reflects actual state; target ≥44×44px; focus visible; user pause survives scroll out/in, tab hide/show and menu open/close |
| VID-04 | Autoplay rejection, followed by explicit Play | Usable poster; no repeated play loop or uncaught rejection; gesture can start playback when browser allows it; failure remains usable |
| VID-05 | Fully offscreen hero, hidden tab, open phone menu | Actual playback pauses; eligible return resumes without overriding user pause or reduced-motion policy; pending play races cannot restart motion |
| VID-06 | Initial reduced-motion, then explicit Play; toggle preference while playing | Initially static with zero video-byte requests; user may opt in; newly enabled reduce pauses immediately; no automatic resume afterward |
| VID-07 | Save-Data signal enabled, where supported | Static and zero video bytes until explicit opt-in; record signal injection/emulation and unsupported APIs honestly |
| VID-08 | Disable JavaScript before loading Home | Real still image/copy/CTA/nav; no video-byte fetch and no dead play/pause control |
| VID-09 | Block media URL; simulate corrupt/unsupported media | Poster and navigation/CTA remain usable, no unhandled page error or black/empty layout; no misleading enabled playback control |
| VID-10 | Inspect sampled frames and full live playback | Full fish silhouette/margins; no copy/control over fish; readable contrast across frames; no flashing or essential animated reveal |
| VID-11 | Desktop, intermediate and phone layouts | No clipping/overflow; phone DOM and visual order copy→CTA→media; complete primary CTA visible at 390×844 and 360×800; header/menu remain readable and operable |
| VID-12 | Cold network/performance matrix in protocol | Local budgets, no unnecessary duplicate image/video requests; measured LCP/CLS/bytes/readiness delay with baseline; failed or unavailable target remains explicit |
| REG-01 | Direct load/reload all eight pages and an unknown path | Distinct meaningful content and titles; honest HTTP 404 recovery; no homepage-anchor substitution |
| REG-02 | Home→Collections→each category→Contact; Back/Forward; keyboard/no-JS menu | Original destinations/context/focus/skip/menu behavior remain useful and correct |
| REG-03 | Contact at 390×844 and 360×800 | Four groups, one task heading/notice, Name/Email visible with first input top ≤320px; errors→preview→edit→clear and contextual prefill still work; nothing sent |
| REG-04 | All inner pages at desktop/phone; fresh build and asset audit | Preserve previous layouts/content; no broken rendered assets, blocking errors or external visitor requests; own reproducible preview instructions |

Exercise core media states at 1440×900 and 390×844. Inspect Home at 1920×1080, 1024×768, 768×1024, 430×932, 360×800 and 320×800; inspect every inner page at 1440×900 and 390×844. Include keyboard, open menu, poster-only, playing and paused captures. Test available Chromium and Safari/WebKit; record engine/device versions and missing engines. Emulated phones/WebKit are not real iPhone evidence.

Use observable media progression and real request logs for playback/network claims. Mocked state tests may supplement browser checks, but cannot replace them. Record each gate as pass, fail or not run with an evidence path and a reason. A failed gate blocks functional acceptance; an unexecuted required gate leaves verification incomplete.

## Focused design assessment — 100 points

Score each criterion 0–5, then multiply by weight/5. Anchors: 0 absent/broken; 1 severe friction; 2 frequent weakness; 3 adequate with visible trade-offs; 4 polished with a small weakness; 5 consistently clear and well resolved. Scores require specific screenshot/live-observation reasons. The highest score is not an automatic user acceptance.

| Criterion | Weight | Inspect |
| --- | --- | --- |
| Composition and first-view clarity | 35 | Subject, headline, collection action, header separation, quiet visual hierarchy and discovery of next content |
| Motion integration and brand fit | 15 | How the same clip joins the page, restrained treatment, poster/video continuity and absence of competing effects |
| Responsive craft | 20 | Phone task priority, complete fish framing, readable wrapping and intermediate-width transition |
| Playback controls and feedback | 15 | Discoverable keyboard/pointer control, actual-state labels, graceful blocked/paused/error/policy states |
| Loading and implementation care | 15 | Measured delivery, stable layout, shared-asset integrity, reproducible build and clear evidence limits |

Assign a separate functional result and an evaluator preference with concrete strengths/weaknesses. Unmeasured performance limits the final criterion and must not be replaced by an invented score. User visual acceptance stays pending until explicit review.

The result table should include: implementation, baseline→after hero/CTA geometry, shared bytes/duration, default/reduced-motion video request bytes, cold LCP/CLS median and range, first-frame delay, state/regression gates, focused design reasons and user acceptance. Keep native time/usage in their original schemas; do not equate unlike token counters with cost or efficiency.

Show still baselines, after poster-only, after playing at comparable media times, paused and phone menu states. Review live loops in addition to screenshots. This assessment concerns one focused integration experiment, not a universal CLI/model ranking or a numerical continuation of older rubrics.
