# Stage 1 design and state plan

Date: 2026-10-12. Authority: current user request, TASK.md and input/immersive-home/STAGE.md supersede the brief's historical design-only phase. Stage 1 prepares the implementation; approved films, rendered review and publication remain with the coordinator.

## Inspected evidence and boundaries

Read AGENTS.md, TASK.md, ACCEPTANCE.md, README.md, the three immersive-home contracts and the frozen cli-web-design-director skill with design-review, prompt-patterns and cli-operation references. The routed instruction-modules directory is absent; use the supplied core and specific Stage contracts. No KB/MCP retrieval is permitted in this workspace.

Visually inspected desktop-v1.png, mobile-v1.png, both clean generation frames and baseline/demo/assets/hero-angelfish.png with view_image. The desktop concept places cream type in quiet left water with fish at right; the phone concept separates fish above from copy below. The clean frames have smaller subjects and more habitat than the UI concepts. Keep the clean frames' actual composition without zoom, translation or transforms; never use the UI concept screenshots in the runtime.

Inspected the own baseline's build, styles and controller and the existing demo build, styles, Contact/menu script and route data. A recursive comparison showed baseline/demo and demo byte-identical before changes. The old Home is framed, captioned and particle-driven; its controller must be replaced. Preserve shared styles.css, script.js, site_data.py, all inner-page rendering and 404 output. Record immutable hashes before editing.

Writes are confined to demo/, evidence/ and README.md. Use Python's existing stdlib builder and available source syntax checks. No server, browser automation, dependency changes, media generation, outside writes, Git or publication.

## Design and content

Home alone uses Georgia display/wordmark and Arial body, abyss teal #041D25, cream #F3F0E7 and sand gold #D4BE89. Its wordmark is text, without the old graphic badge/tagline. Five global destinations remain genuine page links. A transparent fixed header has a shallow readability gradient and a slightly stronger gradient after scrolling; Home omits the header enquiry CTA. Compact navigation retains native details/summary for no-JS access, with an explicit Close state. JS adds focus containment, background inertness and temporary video suspension.

One fixed decorative picture and video layer sits beneath the entire Home, including footer. Both use centered cover with the exact shared query `(min-width: 900px) and (min-aspect-ratio: 6/5)`. The poster picture responds without JS. Video source/poster values are literal HTML URL attributes, read by JS after packaging/rebasing. Supplied WebPs are copied byte-for-byte into demo/assets/immersive/. Future landscape.mp4 and portrait.mp4 remain absent.

Three foreground chapters scroll normally: arrival, editorial collection entries with thin rules, and perspective/enquiry. Later chapters use feathered transparent washes, leaving water visible. No new particles, raster UI, media frame, split columns, player controls, captions or white Home bands. The arrival heading has the intended line break, exact supplied eyebrow/description and one gold CTA; scroll hint is plain text. Phone copy begins in the lower quiet region; short viewports and enlarged text can increase normal document height. The 44px-plus motion utility occupies the lower-right corner with an accessible action label and hover/focus explanation.

| Route | Content and action contract |
| --- | --- |
| / | New continuous arrival, collection and perspective composition; Explore the collections → /collections/ |
| /collections/ | Existing collection overview → three detail pages |
| /collections/ornamental-fish/ | Existing fish content → Contact with ornamental-fish context |
| /collections/aquatic-plants/ | Existing plant content → Contact with aquatic-plants context |
| /collections/driftwood/ | Existing driftwood content → Contact with driftwood context |
| /our-story/ | Existing story and proposed brand limitations |
| /quality/ | Existing principles and questions |
| /contact/ | Existing Name, Email, Collection, Project groups; validation, local preview, Edit and Clear |
| /404.html | Existing recovery page |

Primary journey: Home → Collections → category detail → contextual Contact → validated local preview → Edit/Clear. Global navigation never becomes Home section anchors. Final Home action is Discuss a project → /contact/#enquiry. Compact footer keeps useful navigation and a concise fictional-demo disclosure.

## Media intent and state ownership

The Home controller owns video intent independently from temporary suspension. A sessionStorage value records only background preferences, never enquiry values; storage failure falls back to current-document state.

| State | Planned behavior |
| --- | --- |
| Eligible initial entry | Start with visible poster; attach only selected MP4; muted, loop, playsinline; show video only when a usable frame plays |
| Loading / waiting / stalled | Retain poster or existing usable frame; foreground stays available |
| Manual Pause | Pause without seeking or replacing the current frame; save tab-session intent; expose Resume background |
| Retained manual stop | New Home visit uses poster without attaching MP4 until explicit Resume |
| Reduced motion / exposed Save-Data | Poster and no source/download by default; optional explicit Play; a new restrictive change revokes opt-in and retains a stop even when reversed |
| Explicit opt-in | Clear retained stop and try once; preserve opt-in until a new restrictive policy change |
| Autoplay blocked | Retain poster; small Play action; no automatic repeated retries |
| Missing / invalid selected video | Poster fallback; hide unusable control; changing orientation may try the other selected source |
| Both poster and video fail | Deep-teal foundation keeps content/navigation readable |
| Menu open / tab hidden / page leaving | Pause; resume only when prior intent permits; no automatic source attachment during suspension |
| Scrolling | Same background/video; no seek, source change or section-based playback |
| No JavaScript | Full-page responsive poster and native navigation; motion utility remains hidden |

Handle orientation changes with generation checks so old play promises do not reveal the wrong video or override a newer pause. Attach URL attributes only after policy/intention checks. Keep poster beneath video to avoid black loading frames. Close/Escape and compact-to-desktop transitions restore appropriate focus; menu state never changes stored motion intent.

## Verification and remaining acceptance

Build all eight pages plus 404 with python3 demo/build.py; verify JS syntax, exact copy/routes and URL attributes, poster hashes, no eager video src, no Home film resources on inner pages, and no forbidden runtime effects. Compare generated inner-page output to baseline rendering without writing to baseline; check Contact/shared source remains byte-identical. Use bounded source-level state scenarios if feasible, clearly separate from native browser/media checks. Verify the protected-input hash manifest after all work.

Rendered checks are unavailable under this run's restrictions. Do not create screenshots or motion pass claims. The coordinator must inspect all specified viewport crops, real keyboard/menu behavior, contrast, browser history, no-JS, Pages-base behavior and physical-phone policies. Centered cover of portrait masters at square/intermediate ratios may crop upper fins; this is a shared asset/crop risk requiring reviewed frames, not permission to alter the query or media. Actual video progression, three loop seams per orientation, inline playback, loading/error policies and matching clip-opening posters remain not run until Stage 2.
