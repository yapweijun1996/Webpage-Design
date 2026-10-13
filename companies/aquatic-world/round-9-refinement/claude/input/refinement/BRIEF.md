# Shared Fusion Home Refinement Brief

Version 2, 2026-10-13. Design-only preparation. This document defines the same future revision for Codex CLI and Claude Code CLI; it does not authorize execution by itself.

## Outcome and scope

Home should retain one calm underwater environment while navigation stays readable at every scroll position. A visitor on a phone must be able to recognize the brand, open a real destination, read the offer and reach the primary action comfortably.

Aquatic World remains a fictional aquatics design case. The assumed audience is trade buyers, aquascapers and aquarium enthusiasts. The main journey remains Home → Collections → one category → Contact → local enquiry preview. No new company claims, inventory or services are introduced.

Revise only the Home header's visual states and compact landscape arrival layout. Align the open Home menu with the same abyss-teal surface. Use the candidate's own final round-8 source as the starting point. Retain the existing lower chapters, footer content and inner-page presentation.

## 1. Header: transparent arrival, protected reading after scroll

The actual defect is visible body lettering behind the brand/Menu row after scrolling. Increasing darkness slightly is insufficient: a background with remaining transparency still allows large headings to compete with the navigation.

| State | Required treatment |
| --- | --- |
| Home at scroll position zero; menu closed | Keep the existing shallow dark wash, with water visible behind the brand and navigation. Preserve the normal portrait/desktop placement. |
| Home scrolled; menu closed | By 24 CSS pixels of document scroll, cover the full navigation row with solid abyss teal `#041D25`. Underlying body glyphs must be completely masked throughout the brand and control area, including any extra row caused by enlarged text. |
| Home menu open | Use the same opaque `#041D25` across the header and disclosure. Covered film or body text must not show through. |
| Return to the top; menu closed | Restore the transparent arrival treatment without changing header dimensions, text position or document scroll. |
| Close a menu while scrolled | Return to the protected scrolled treatment, not the transparent arrival treatment. |
| Reload or browser history restores a scrolled position | Initialize the correct protected surface before presenting a settled readable page. |

A short feathered edge below the solid row is optional, but transparency must start below the actual control row. A full-screen overlay, a frosted-glass effect or extra shadows are unnecessary. The surface change must not resize the header, shift the hero, move focus, restart the film or change manual Pause intent. Avoid flicker when scrolling around the state boundary.

The protection covers the row's live rendered height, including safe-area padding and enlarged/wrapped brand text. It is not a fixed 64px mask over a potentially taller header. When JavaScript is unavailable, an always-protected header is an acceptable readable fallback.

This rule explicitly replaces the old requirement that a scrolled Home header remain translucent and avoid an opaque band. Opacity is limited to the navigation surface; the film continues behind the rest of Home.

## 2. Compact landscape: complete action with breathing room

At normal text size in **844×390 and 667×375 CSS-pixel viewports**, show the complete offer and primary CTA in the first viewport. Keep at least **16px below the CTA's clickable rectangle**, inside any reported bottom safe area. The motion utility must not overlap the CTA, its focus ring or its tap target.

Keep the landscape composition: quiet left-side copy and the fish on the right. Keep the common left alignment of eyebrow, heading, description and action; do not reposition or recrop the film to manufacture text space.

Use the following adaptation order:

1. Use a compact brand/control row, approximately 56–64px high before safe-area padding, with an 18–20px wordmark. Keep the Menu target at least 44×44px.
2. Start the offer closer to the header and reduce oversized top/bottom and inter-block gaps. Preserve a visible gap below the actual header.
3. Omit the optional scroll hint on short screens.
4. Adjust the display heading within roughly 30–40px with natural wrapping. Keep body and CTA text at least 16px and a readable body line height of at least 1.4.
5. Use a 44–48px minimum-height CTA where the short composition requires it. Let it grow for wrapped or enlarged text.

These are composition guides, not hard-coded element coordinates. Do not use text clipping, transform scaling, negative overlap, ellipses, hidden copy or document overflow suppression to pass a screenshot. Do not truncate the exact offer or CTA label.

At 200% text, a viewport shorter than the reference cases, or with larger safe-area constraints, preserve readability and allow natural vertical scrolling. First-screen fit does not override accessibility. All content and controls must remain reachable, with no horizontal document overflow.

## 3. Keep the established portrait and desktop composition

At 390×844, retain the full fish/fin composition above the two-line heading and lower-left copy. Keep the 20px left alignment, approximately 39–40px display heading, 16px description and 52px CTA. The current CTA ends around y737 in Codex and y744 in Claude; both already fit. There is no need to move this successful arrangement to match the other candidate pixel for pixel.

At 360×800 and 320×800 with normal text, keep the complete primary action in the initial viewport. Preserve natural wrapping and readable brand/Menu coexistence. Enlarged text may grow vertically.

At 1440×900 and 1280×800, retain the stronger wordmark, regular-weight navigation and left-copy/right-fish composition. Compact navigation still begins below 1120px. Check both 1119px and 1120px without coupling that switch to film selection.

## 4. Menu and motion behavior

Retain the nonmodal disclosure anchored immediately below the top bar. Brand and Menu/Close anchors stay in place. At normal 390×844, keep five readable rows around 56px high and a total header/panel extent around 360–380px. Do not compress the rows merely to make one menu appear smaller; both current normal phone menus have similar height.

Preserve visible Menu/Close labels, clear icons, restrained separators, current-page indication and visible keyboard focus. Icon placement may retain the candidate's existing pattern. The required color is shared abyss teal; there is no new icon redesign or animation requirement.

Open menu suspends the film and hides its motion utility. Close resumes only when previous playback intent and motion policy allow it. Manual Pause must survive open/close. Escape closes and returns focus to Menu; Tab follows ordinary order and the disclosure closes when focus leaves the header. Short/enlarged menus scroll internally while Close stays reachable. Preserve outside dismissal, no scroll lock, no focus trap and no-JS access to destinations.

## 5. Preserved copy, destinations and environment

Keep the exact arrival copy:

- Eyebrow: `FISH · PLANTS · DRIFTWOOD`
- Heading: `A world beneath the surface.`
- Description: `Discover ornamental fish, aquatic plants and natural driftwood.`
- Primary action: `Explore the collections`

| Action | Destination relative to the candidate's base |
| --- | --- |
| Brand / Home | `/` |
| Collections / arrival CTA | `/collections/` |
| Ornamental Fish | `/collections/ornamental-fish/` |
| Aquatic Plants | `/collections/aquatic-plants/` |
| Driftwood | `/collections/driftwood/` |
| Our Story | `/our-story/` |
| Quality | `/quality/` |
| Contact / final enquiry | `/contact/` / `/contact/#enquiry` |

Keep all eight content pages and the 404, direct loading, refresh, Back/Forward, current-page context, category enquiry context and the local-only four-group Contact preview/Edit/Clear journey. Global links open independent pages. Intentional section anchors remain valid for in-page utilities. Scope header changes to Home so inner presentation is not changed incidentally.

Retain the exact current landscape/portrait MP4 and poster bytes. They are existing six-second silent edited forward/return loops. No new generation, paid API, editing, encoding, timing changes or source replacement is part of this revision.

Film selection remains landscape at `(min-aspect-ratio: 6/5)` at every width, portrait otherwise. Retain cover with landscape position 50% 50% and portrait 50% 30%. Near-square windows with aspect ratios from 4/5 up to 6/5 retain the lower-copy composition and normal scrolling. Do not restore a width-based video-selection guard.

Keep film as the environment behind arrival, collection, perspective and footer. Preserve matching posters, silent inline playback, manual Pause, reduced-motion/data-saving defaults, explicit opt-in, hidden-tab suspension and useful no-JS fallback. Keep the modest motion utility; add no player frame, toolbar, central Play overlay, sound, parallax, particles, scroll-driven playback or entrance delay.

Use the [common acceptance scenarios](ACCEPTANCE.md) and [native references](references/README.md) to evaluate the result. Generated concepts, successful builds and self-scores alone do not establish visual acceptance.
