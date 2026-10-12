# Aquatic World — Shared Fusion Home Brief v1

Prepared 2026-10-12 for a later Codex CLI and Claude Code CLI comparison. **Current scope is design documentation only.** Numerical values below are design targets, not measurements or passed checks of a new implementation.

## 1. Experience and design decision

Entering Home should feel like entering one calm underwater environment. The scene fills the visible area behind the top bar, arrival copy, subsequent chapters and footer. The visitor sees the fish, reads the offer and can open Collections immediately. Text and navigation remain live foreground content.

Use Codex's larger desktop wordmark, regular-weight navigation and compact two-line heading as the typographic starting point. Use Claude's outlined phone Menu control and top-anchored disclosure as the navigation starting point. Establish one shared alignment and spacing system instead of combining unrelated component styles.

The selected [desktop, phone and open-menu static concepts](visuals/README.md) now illustrate this direction. They are generated composition references with rasterized UI and recorded geometry approximations; this brief owns exact dimensions and menu behavior for a later implementation.

The intended audience remains trade buyers, aquascapers and aquarium enthusiasts, an assumption from the [company context](../../research.md). Aquatic World is a fictional design case. Add no invented company history, guarantees, inventory, shipping or contact service.

Primary journey: Home → Collections → one category → Contact → local enquiry preview. Video is the environment for that journey; access to the journey never waits for playback.

| Area | Chosen treatment | Reason |
| --- | --- | --- |
| Desktop top bar | Codex-scale wordmark; regular 16px links over the water | Stronger brand recognition with less visual weight in the navigation |
| Phone top bar | Readable 18px wordmark and Claude-style outlined Menu control | Keep the brand present while making navigation easy to discover |
| Headline | Codex-style close tracking, two deliberate lines where space allows | A composed editorial hierarchy without another decorative layer |
| Primary CTA | One sand-gold rectangular link, aligned with the copy | Clearly distinguish the next step from quiet page navigation |
| Open phone menu | Solid, top-anchored disclosure with Close in the same position as Menu | Readable destinations without the observed centered panel and ghosted copy |
| Environment | Existing identical landscape/portrait films through the whole Home | Preserve the approved comparison inputs and scene continuity |

## 2. Desktop composition

At the reference size of **1440×900**, keep the fish in the right half and the arrival content in quiet water on the left. Avoid placing the heading or action over the fins.

| Element | Proposed target |
| --- | --- |
| Top bar | About 80px high; side inset 4.5% (about 65px at 1440px) |
| Wordmark | Georgia regular, about 32px, tracking about 0.14em |
| Navigation | Arial regular, 16px; Home, Collections, Our Story, Quality, Contact |
| Copy column | Left edge 7% (about 101px); content width about 480–540px |
| Eyebrow | Arial regular 12px with restrained letter spacing |
| Heading | Georgia regular 72px, line height about 1.04, tracking about -0.03em |
| Heading placement | Top around 305–320px at this reference size |
| Description | Arial 18px, line height about 1.55; about 38 characters per line |
| CTA | About 56px high, 16px semibold label; 24px side padding |

The heading, description and CTA share one left edge. Use approximately 24px between heading and description, then 28px before the CTA. The first-screen action should sit near the current Codex position, around 565px at this size, leaving the habitat visible below it. These coordinates establish the reference composition; they must not become fixed coordinates across all screens.

The closed top bar has a shallow feathered dark wash. Water remains visible through it. Scrolling strengthens that wash slightly without creating an opaque horizontal band or restarting the film. Active Home has a quiet gold underline; hover and keyboard focus remain distinct and do not shift labels. Keep one dominant gold action in the arrival copy; the header Contact destination stays a text link.

## 3. Phone composition

At **390×844**, keep the full fish and fins above the copy. Keep the offer and entire CTA in the initial viewport with ordinary text sizing.

| Element | Proposed target |
| --- | --- |
| Top bar | About 64px high; 20px side insets |
| Wordmark | Georgia regular, about 18px; modest tracking, centered vertically |
| Menu button | Outline and icon plus visible `Menu` label; about 98×44px |
| Copy column | 20px side insets; all copy and CTA share the same left edge |
| Eyebrow | Arial regular 11px; one readable line at 390px |
| Heading | Georgia regular, about 39–40px, line height about 1.06; tracking about -0.03em |
| Heading placement | Top around 505–515px at this reference size, below the subject |
| Description | Arial 16px, line height about 1.55; allow natural wrapping |
| CTA | 52px high, 17px semibold label; natural width around 275px, bounded by the content width |
| CTA placement | Prefer a top around 685–700px and its full target within the first viewport |

Keep the arrow inside the CTA, separated from its label, with no movement that changes the target. Do not stretch the button into an oversized banner. The small scroll hint is secondary and may be omitted on short screens before sacrificing readable copy or the action. The motion utility stays separate from the CTA, with a target of at least 44×44px and device-safe insets.

At 320px, use approximately 16px side insets and a 16–17px wordmark if required for the complete brand and Menu button to coexist. Allow additional heading lines when necessary. Never reduce body text below 16px to force a screenshot match. At text enlargement or reduced height, content grows and scrolls naturally.

## 4. Menu and interaction states

The Home compact navigation is a **nonmodal disclosure anchored to the top bar**, following Claude's topology. It is not a centered dialog. The brand and Menu/Close control remain in their original positions. Normal phone opening exposes a solid deep-teal panel directly below the header, with five rows about 56px high and modest bottom padding. At 390×844, the complete header/panel should end around 360–380px; the arrival heading below it remains intact at scroll position zero.

Use 18px regular Arial destination labels, restrained separators, and a gold vertical marker for the current page. Expose the current-page state to assistive technology. An additional uppercase `CURRENT PAGE` annotation is unnecessary when selection is already clear. The open panel is opaque enough that covered fish or copy cannot ghost through it. Its straight lower edge belongs to navigation, not a decorative frame around the film.

| State or action | Required experience |
| --- | --- |
| Closed | Water behind the brand and outlined Menu control; no opaque menu surface |
| Open | Same header anchors, `Close` label and close icon; readable page links below; suspend motion and hide its utility while navigation is open |
| Short viewport or enlarged text | Close stays visible at the top; the link area can scroll within the available visible height; every destination remains reachable |
| Escape | Close the disclosure and return focus to Menu |
| Tab and Shift+Tab | Follow ordinary navigation order without a modal focus trap; close when focus leaves the header so the panel cannot cover the newly focused content |
| Outside interaction | Close the disclosure; ordinary link/button activation remains usable |
| Destination chosen | Navigate to its independent page; no Home section scrolling or extra confirmation |
| Close without navigation | Restore the prior scroll position and scene composition; resume only if prior playback intent and current motion policy allow it |
| Manual Pause before opening | Remain paused after closing; Menu never cancels the visitor's stop |
| JavaScript unavailable | Navigation and destinations remain operable without relying on enhancements |

The pattern must remain nonmodal in behavior and accessibility semantics: no dialog announcement, background isolation or scroll lock inherited from a different modal pattern. On short windows the panel may temporarily cover more of the arrival content. Do not shift or shrink the whole Home to make it fit; ensure opaque coverage, accessible links and restoration on close. On a scrolled Home, temporary coverage is acceptable, ghosted or cut-through text is not.

Start compact navigation below **1120px**, then validate actual label/brand fit at transition widths. Media selection is independent of this navigation breakpoint.

## 5. Exact copy and full-Home rhythm

| Element | Shared English copy |
| --- | --- |
| Eyebrow | FISH · PLANTS · DRIFTWOOD |
| Heading line 1 | A world beneath |
| Heading line 2 | the surface. |
| Description | Discover ornamental fish, aquatic plants and natural driftwood. |
| Arrival action | Explore the collections |
| Quiet scroll hint | Scroll to explore |
| Collection chapter heading | Three elements. One aquatic world. |
| Fish description | Colour, form and gentle movement. |
| Plants description | Texture, depth and a living landscape. |
| Driftwood description | Natural lines and structure. |
| Perspective heading | A closer connection to nature. |
| Perspective sentence | Explore the elements of an aquatic landscape, and the questions that shape it. |
| Final action | Discuss a project |

Continue the existing three chapters: arrival, collection entries, then perspective/enquiry. Lower chapters use spacious editorial rows and restrained rules over the same water. Each chapter has useful content and a clear next step; avoid repeated slogans, empty full-height interludes or heavy cards. Local reading washes protect text without hiding the entire habitat. Finish with the existing useful navigation and concise fictional-demo disclosure over the environment.

Use Georgia display type and Arial supporting type. Color roles remain abyss teal `#041D25`, warm cream `#F3F0E7` and sand gold `#D4BE89`. Controls have visible focus, stable hover/pressed states and at least 44px touch targets. Check readability against bright and dark moving frames, not only the dark poster. These are requirements, not a claim of completed accessibility verification.

## 6. Routes and preserved behavior

| Action | Independent destination |
| --- | --- |
| Brand / Home | `/` |
| Collections / arrival CTA | `/collections/` |
| Ornamental Fish | `/collections/ornamental-fish/` |
| Aquatic Plants | `/collections/aquatic-plants/` |
| Driftwood | `/collections/driftwood/` |
| Our Story | `/our-story/` |
| Quality | `/quality/` |
| Contact / final enquiry action | `/contact/` / `/contact/#enquiry` |

Preserve all eight content pages and the 404, direct URLs, refresh, Back/Forward, category enquiry context and the four-group Contact preview/Edit/Clear journey. Contact sends nothing. Home retains one primary CTA; inner-page content and presentation remain the respective implementation's current baseline. Inner pages do not load Home film. Links and deferred asset paths must work beneath the GitHub Pages project base as well as a local preview.

## 7. Frozen media and responsive composition

Retain byte-identical files from the [current runtime media package](../immersive-home-v1/media/runtime/): `landscape.mp4`, `portrait.mp4`, `landscape-poster.webp` and `portrait-poster.webp`. Both films are six-second silent edited forward/return loops; [provenance](../immersive-home-v1/media/README.md) explains the processing. This proposal makes no new generation request and changes no crop, grading, playback timing or encoding.

The current [Stage 3 composition contract](../../comparison/round-7-immersive/stage-3/BRIEF.md) governs orientation, superseding the older manifest's width guard: landscape at `(min-aspect-ratio: 6/5)` at **every width**; portrait otherwise. Both use cover; landscape position 50% 50%, portrait 50% 30%. Near-square windows `(4/5 <= aspect-ratio < 6/5)` keep copy below roughly 70svh and allow scrolling. Narrow landscape windows use landscape left-copy/right-fish composition with compact navigation. Do not restore a 900px media-selection width guard.

Keep the existing silent inline playback, matching-poster fallback, manual Pause retained within the tab session, reduced-motion/data-saving defaults without automatic film download, explicit opt-in, hidden-tab suspension and useful no-JS experience. Preserve the film behind all Home content and footer. No video frame, player toolbar, central Play button, sound, particles, parallax, scroll-controlled film or introductory delay.

## 8. Common future CLI handoff

This document, [review requirements](REVIEW.md), shared references and exact common media form one input package for both CLIs. **Do not launch either CLI or implement this proposal until the user requests implementation.** A later authorized round uses fresh copies of each builder's own round-7 baseline, preserving the current public sources and historical evidence.

Both receive identical design instructions and media bytes. Each owns its own code; neither reads or imports the other's implementation. Shared reference screenshots communicate design qualities, not permission to copy sibling source. Preserve requested models: Codex `gpt-6.1-sol`, Claude `claude-opus-5-5`; verify availability at that future run and do not silently substitute. Record actual exposed model, tooling, effort and deviations. The comparison evaluates these CLI workflows and their different own-code baselines, not isolated model capability.

The future delivery includes a short layout/state plan, independent implementation, actual desktop/phone captures, an open-menu capture, playback/state evidence and unresolved limits. Builds alone cannot satisfy creative acceptance. Publication remains a separate delivery action; writing this brief leaves the current GitHub Pages sites unchanged.
