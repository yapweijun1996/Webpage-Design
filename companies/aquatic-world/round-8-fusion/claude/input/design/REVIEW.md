# Fusion Home — Baseline Findings and Future Review

Prepared 2026-10-12. Baseline observations come from the prior actual public-page review. **All fusion implementation checks below are pending.** This document adds a later design finding without rewriting the original round-7 report or frozen inputs.

## Observed baseline

Reviewed public Home at 1440×900 and 390×844, including playback, later Home content and both phone menus. The two implementations use identical films; differences in navigation and typography should not be attributed to video-generation quality.

| Area | Observed behavior | Design implication |
| --- | --- | --- |
| Desktop brand | Codex wordmark about 32.4px; Claude about 25.6px | Prefer Codex's stronger brand presence |
| Desktop navigation | Both 16px; Codex regular, Claude medium weight | Prefer the lighter Codex treatment against the scene |
| Heading | Both 72px on desktop; Codex has closer tracking. Phone approximately 39.8px versus 37.4px | Retain a compact, balanced display hierarchy with readable body copy |
| Phone Menu control | Claude has a visible outline and label; Codex relies on text/icon | Prefer Claude's clearer affordance |
| Phone open menu | Claude starts at the top and retains a complete arrival offer beneath it. Codex's panel starts around y=195 and ends around y=650, with underlying text ghosting through and a description line cut at the boundary | Adopt a top-anchored opaque disclosure and explicit restoration states |
| Primary action | Both fit the initial 390×844 viewport. Codex starts around y=687; Claude around y=700 | Keep that reachable action range and unify its alignment |

The Codex open panel measured approximately 390×455px in a 390×844 viewport despite fixed insets. Source/computed layout showed the fixed menu retaining `align-self: center` in its grid context. This supports the centered placement diagnosis. Its keyboard/modal mechanics worked in exercised checks; that functional success did not remove the rendered layout defect. The fusion design chooses Claude's nonmodal disclosure behavior, so presentation and focus semantics must be changed together in a later implementation.

[Reference captures](references/README.md) distinguish actual baseline images from an unbuilt proposal. The current quiet, edited return motion limits the cinematic impact of both versions; foreground refinement cannot establish that a stronger shot has been produced.

## Future comparison gates

Use the same input bytes, exact copy and captured viewport dimensions for both candidates. Compare each with its own round-7 baseline. Review full-size screenshots and actual moving pages, not only thumbnails. Record visual judgment separately from functional results and human acceptance; no numerical winner is predetermined.

| Check | Required observation |
| --- | --- |
| Arrival hierarchy | Recognizable brand, complete subject, readable offer and one strongest CTA; copy/action share one left edge |
| Standard phone | Full CTA target fits at 390×844, 360×800 and 320×800 with ordinary text sizing; no horizontal overflow |
| Closed top bar | Water visible beneath navigation; readable controls through bright/dark frames and later chapters |
| Open menu | Anchored to the top; Close stays at the Menu anchor; no transparent ghost text, centered panel or clipped destination |
| 390×844 opening at scroll zero | Panel ends above the arrival heading; complete heading, description and CTA remain below it |
| Short windows / text enlargement | Close and all links remain reachable; scrollable link area if necessary; no text shrinking or offscreen trapped controls |
| Focus and dismissal | Ordinary disclosure tab order, Escape/focus return, close on focus exit, visible focus unobscured by the panel; no modal semantics or background scroll lock |
| Motion intent | Opening suspends, eligible closing resumes; manual Pause and policy stop persist; small utility returns in the correct state |
| Scene continuity | Same full-viewport environment behind all chapters/footer; no frame reset on scrolling, black flash or hard white band |
| Routing and Contact | All eight independent pages, direct refresh and Back/Forward; three category contexts; validation/local preview/Edit/Clear preserved, without an enquiry send |
| Fallback and delivery paths | Reduced-motion/data-saving poster defaults, useful no-JS navigation, missing media fallback; all paths work under the GitHub Pages base |

Viewport set: 1440×900, 1280×800, 1120×800, 1119×800, 1024×768, 768×1024, 390×844, 360×800, 320×800, 844×390, 667×375, 900×900 and 500×500. Review open navigation at standard phone, narrow landscape and 200% text enlargement. Near-square and short windows may scroll naturally; ordinary portrait-phone first-screen requirements remain distinct.

Minimum retained evidence for each future candidate: desktop arrival, phone arrival, phone open menu, one later chapter/footer capture, a real playback recording spanning multiple joins, menu/manual-Pause state observations and a route/Contact check record. Record capture dimensions, state and time; matching composition matters more than pretending independent clips are frame-synchronized. Report physical devices and assistive-technology checks as unrun unless actually exercised.

## Design-package verification

This phase can verify document links, copied-reference integrity, current-media identity and the absence of website edits. It cannot verify fusion rendering, responsiveness or interaction behavior because no fusion implementation exists. Do not reuse old passing browser results as passes for this proposal.
