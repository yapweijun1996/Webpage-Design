# Stage 1 self-review

Date: 2026-10-12. Result: bounded Stage 1 implementation complete; final immersive-video acceptance remains open. This is source/build review, not a rendered website or film review.

## Delivered result

Home now has one fixed, full-viewport poster/video environment beneath its header, three normally scrolling foreground chapters and compact footer. The exact shared copy, Georgia/Arial fonts, cream/gold hierarchy, page destinations and one gold arrival CTA are implemented. The old framed hero, scene caption, particles, split presentation and opaque white Home sections are absent from generated Home HTML. Later chapters use feathered dark washes and editorial collection rules. Landscape reading width is limited to preserve water beside the copy; portrait copy starts below the subject region.

The Home-only header omits the duplicate enquiry CTA and uses a transparent readability gradient, with a darker scrolled state. Native details/summary navigation remains usable without JS. The controller adds menu isolation, focus containment and background suspension, while unchanged shared script.js retains Escape/outside dismissal and breakpoint focus return.

The single video element is muted, looping, inline, unfocusable and without player controls. It starts without src and preload is none. JS reads only the selected literal HTML URL attributes after packaging. Reduced motion, exposed Save-Data, retained manual Pause, initial menu-open and hidden-tab states attach no MP4. Manual Pause retains the current usable frame and tab-session stop intent. Policy changes revoke opt-in and retain a stop; reversal alone cannot resume. Temporary menu/tab/page suspension does not erase intent. Blocking, buffering and failed-media branches preserve usable content and poster/last frame. Missing/invalid video hides the unusable utility. Scroll only changes header readability and never seeks, reloads or replaces video.

Supplied landscape and portrait posters were copied byte-for-byte and inspected as actual WebPs, in addition to the required concept and generation PNG inspections. Both pending MP4s remain absent. The WebPs have no rasterized interface text. Media provenance and hashes are in demo/assets/immersive/README.md. No replacement motion or generation was used.

## Executed verification

| Check | Observed result | Limit |
| --- | --- | --- |
| Existing Python stdlib build | Pass: eight static pages plus 404 generated in demo/public/ | Does not establish rendered behavior |
| Python source parsing | Pass: build.py, site_data.py and serve.py | Syntax only |
| Node syntax checks | Pass: home-motion.js and unchanged script.js | Syntax only |
| Source/generated-output assertions | Pass: 74 assertions, including 349 local link/asset/fragment references | Both future MP4s explicitly excepted |
| Own baseline inner output comparison | Pass: seven inner-page HTML files and 404 byte-identical to in-memory baseline rendering | No browser journey exercised |
| Shared/Contact source preservation | Pass: styles.css, script.js, site_data.py, serve.py, favicon.svg and asset-preparation tool byte-identical | Contact interaction not re-run in browser |
| Controller logic scenarios | Pass: 11 scenarios using DOM/event/video stubs | No actual media, browser policy, network, decode, or layout exercised |
| Frozen inputs/baseline/root contracts | Pass: 49 immutable SHA-256 entries match | Hash check covers the owned frozen inputs and contracts |
| Actual website screenshots, CUA or other browser review | Not run | Prohibited in this independent worker stage |
| Actual clip advancement and three loop joins per orientation | Not run | Approved common MP4s intentionally absent |
| Physical iOS Safari / Android Chrome | Not run | No permitted device/browser review |
| Public GitHub Pages base, refresh and browser history | Not run | Coordinator owns packaging/publication; literal attributes and rebased stub URLs checked only |

Controller scenarios cover eligible rebased source selection; scroll stability; manual stop/session return; reduced-motion opt-in and revocation; Save-Data; menu isolation and Tab boundaries; hidden entry and lifecycle suspension; two denied autoplay attempts without automatic retries; missing/unsupported sources and orientation recovery; orientation switching while paused; late play completion after stop; buffering and absent storage/connection APIs. They are logic evidence only. They do not simulate a native policy pass or prove actual playback.

All nine generated entry points have real local page links. Category Contact query strings and /contact/#enquiry targets resolve. The four Name/Email/Collection/Project groups, validation/error summary, local preview, Edit and Clear HTML and script remain unchanged. There is no submission service; Home also discloses the fictional demo and local-only enquiry limitation.

## Source review corrections

Limited later landscape reading zones to 46vw instead of a flat 600px at intermediate landscape widths. This leaves quiet space before the fish in the supplied landscape frame. Removed the fade-out transition when returning to poster: source reset/error should expose the underlying poster immediately rather than transition over an emptied video surface. Neither correction is described as a rendered defect reproduction; both follow source inspection.

## Acceptance status and remaining risks

The eight COMPARISON.md hard gates remain open for the coordinator's actual browser review. Gates 1–4 and 6–8 have relevant source evidence but no observed rendered pass. Gate 5, actual background motion, is not run. No visual score or human acceptance is claimed.

The selected master is landscape at 1440×900, 1280×800 and 1024×768; portrait at 768×1024 and the listed phone sizes, according to the shared query. This is query/source evaluation, not an observed crop result. Both clean masters contain a smaller fish than the UI concept images, so final fidelity must be judged against the actual supplied media. Centered portrait cover can crop upper fins around square/intermediate viewports; the plan records this common media risk. Do not change query, transform/crop the masters or invent safe-moving-frame evidence. The coordinator must check full fish/fins across moving frames and viewports, initial phone CTA fit, header/text contrast, control separation, menu focus/Close/Escape, enlarged text and short screens.

An eligible Stage 1 browser entry may request the intentionally absent selected MP4 and receive an expected media 404 before the poster fallback takes over. These pending-media requests are not a clean network-error pass. Policy/default-poster states do not attach the video URL. Review final media readiness, opening-frame match, native autoplay denial and physical-phone inline behavior after Stage 2 supply.

Only demo/, evidence/ and README.md were written. No server, browser script, other model/agent, MCP, external service, media generation, dependency/configuration/permission change, Git operation, enquiry or publication occurred. The routed instruction-modules directory was missing; task/core rules and the frozen skill were used. Existing evidence/process-run.json was not inspected or edited.

The comparison contract names Codex CLI with requested model gpt-6.1-sol. Serving model, launch CLI version, effort, timing, token usage and cost were not independently inspected by this worker; the coordinator owns launch metadata. No later version check, paid authentication test or model invocation was substituted for that evidence.

## Reproducible checks

Run from this independent workspace root:

```sh
python3 -B demo/build.py
node --check demo/home-motion.js
node --check demo/script.js
python3 -B evidence/verify_stage1.py
node evidence/controller-checks.cjs
```

Reports: source-checks.json and controller-checks.json. The verifier evaluates baseline pure renderers in memory and never runs/imports the baseline builder or writes to baseline. No task-created temporary debugging files remain. Browser preview commands and explicit execution limits are in README.md.
