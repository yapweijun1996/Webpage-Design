# Fusion Home Static Concept Prompts

Prepared 2026-10-12. Built-in `image_gen.imagegen` mode; no fallback CLI/API. Each requested asset/state uses a separate tool call. The initial open-menu draft is superseded by one targeted navigation-geometry refinement below. Original outputs remain in the local Codex generated-images directory; selected files are copied without resizing or re-encoding. These prompts produce raster design references, not working websites or runtime posters.

## Desktop arrival

```text
Use case: ui-mockup. Create a high-fidelity STATIC WEBSITE DESIGN CONCEPT for Aquatic World's fusion Home. Render a single flat desktop first viewport in 16:10 proportions, targeting 1440 x 900. The website fills every edge; no browser chrome, device, presentation board or annotations.

Input 1 is the existing Codex desktop website: typography and composition reference. Input 2 is the clean current landscape poster: habitat and recognizable striped angelfish reference. Preserve this habitat, subject identity, left-facing pose, complete long fins, gold dorsal accents, scale, camera framing and quiet left water closely. This is a frozen moment of the existing underwater film, not a new cinematic scene.

Use one continuous realistic abyss-teal underwater environment behind all foreground UI. Fine plants/driftwood remain around the edges, soft aqua light from above, recognizable angelfish entirely in the right half with breathing room around every fin. Only feathered darkening behind copy/header, never a solid copy panel.

Desktop UI measured relative to a 1440 x 900 design:
- 80px header, wordmark at x65, vertically centered. Exact text "AQUATIC WORLD", warm cream #F3F0E7 Georgia-style regular serif, 32px, refined generous tracking around 0.14em.
- Right navigation in regular 16px Arial-style sans, one baseline: "Home", "Collections", "Our Story", "Quality", "Contact". Subtle gold underline for Home. No filled header CTA, opaque bar or navigation pill; water visible behind the header.
- Arrival content left edge x101; same alignment for eyebrow, headline, supporting sentence and CTA. Heading top around y310, width roughly 500px.
- Eyebrow "FISH · PLANTS · DRIFTWOOD" in regular 12px cream sans with modest spacing.
- Exact two-line cream heading, Georgia-style regular 72px, compact tracking around -0.03em and line height 1.04: first line "A world beneath", second line "the surface." Keep those two deliberate lines.
- Description exactly "Discover ornamental fish, aquatic plants and natural driftwood." in cream 18px sans, comfortable two-line wrapping, about 24px after heading.
- One sand-gold #D4BE89 rectangular CTA at x101, top approximately y565, about 280 x 56px. Exact dark-teal 16px semibold label "Explore the collections" plus a thin right arrow within the button; stable, elegant, not oversized.
- Subtle small bottom-center text "Scroll to explore" with a down chevron.
- Discreet circular pause utility bottom-right, approximately 44px target, thin gold border and pause mark; much quieter than the CTA.

All words must be exact, sharp and easily read. Preserve subject details and do not cover fish or fins with UI. No video player frame, big central Play button, timeline, volume, fullscreen chrome, white bands, rounded media cards, particles, extra fish, new slogans, watermark, mockup labels, code or extra buttons. This is a static visual concept only, not a browser screenshot or runtime asset.
```

## Phone arrival, closed Menu

```text
Use case: ui-mockup. Create a high-fidelity STATIC WEBSITE DESIGN CONCEPT of the Aquatic World fusion Home in a single flat portrait viewport, proportions 390 x 844 (approximately 9:19.5). Fill every edge with the website; no device, browser chrome, notch, outer margin, board or annotations.

Input 1 is the existing Codex phone website: reference for the exact underwater composition, compact typography and reachable action. Input 2 is the clean current portrait poster: habitat/subject reference. Input 3 is the existing Claude open-menu screenshot: reference only for outlined Menu/Close control styling, not the open state in this output. Make the CLOSED phone-menu state.

Preserve the current underwater habitat and recognizable left-facing silver/black striped angelfish with subtle gold dorsal color. Keep the full fish and all long fins in the upper/middle area, roughly y=18–48% and x=16–76%, with empty water around extremities. Do not center-crop a landscape design or invent a larger fish. Soft aqua light above, plant/driftwood habitat around the sides, quiet dark water for copy below. Texture remains visible beneath the text. No opaque reading panel or separate media rectangle.

Phone UI scaled to a practical 390 x 844 design:
- 64px top bar, 20px side insets. Wordmark exact "AQUATIC WORLD", warm cream Georgia-style regular serif about 18px with restrained tracking, centered vertically at upper-left.
- Upper-right a fine outlined rectangular Menu control, approximately 98 x 44px at x272 y10. Small two-line hamburger plus exact title-case "Menu" in cream regular/medium sans, around 13–14px. Same gentle understated look as the Claude reference, no oversized gold navigation pill. Water visible behind the CLOSED top bar.
- Arrival content left edge x20, width350. Eyebrow around y476: exact "FISH · PLANTS · DRIFTWOOD", regular 11px cream sans, restrained spacing and one line. This aligns with the headline and CTA.
- Heading top around y505, Georgia-style regular 39–40px, compact tracking -0.03em, line height1.06. Exact two lines: "A world beneath" then "the surface." Preserve readable generous separation from the fish.
- Description about 24px below headline, cream16px Arial-style regular, line height1.55. Exact text "Discover ornamental fish, aquatic plants and natural driftwood." Wrap naturally into two or three lines.
- One sand-gold #D4BE89 rectangular CTA, same x20 left edge, approximately 275 x 52px, top around y687–700. Exact dark-teal17px semibold label "Explore the collections" plus a restrained right arrow. Entire CTA visible within viewport with space below; no wide full-screen action banner.
- Very quiet "Scroll to explore" and down chevron near bottom-center.
- Small discreet circular pause utility, 44px target, lower-right with safe insets and no overlap with CTA, fins or scroll hint.

Keep all text exact and crisp. The impression is one continuous underwater scene carrying an elegant live-looking interface. Avoid opaque closed header, player controls, frame, central Play, timeline, video caption, white sections, glass copy card, large rounded media panel, extra fish, new slogans, watermark, code or annotations. This is a raster static visual concept; do not claim working interaction.
```

## Phone navigation, open Menu

```text
Use case: precise-object-edit / ui-mockup state study.
Image 1 is the selected Aquatic World fusion CLOSED phone static concept and is the EDIT TARGET. Image 2 is the existing Claude phone open-menu reference, showing the desired top-anchored disclosure topology ONLY.

Create ONE matching OPEN-MENU state of Image 1. Keep its portrait canvas dimensions and scale. Change only navigation state and hide the bottom-right pause utility. Preserve the underwater composition and all text/UI below the new navigation panel exactly: fish position and fins wherever visible, lighting, plants, driftwood, eyebrow, exact two-line headline, description, gold CTA, scroll hint, fonts, colors, alignments and sizes. Do not shift, zoom or shrink the underlying page. Below approximately 44% canvas height, the view remains the same as Image 1.

The new menu surface is an opaque solid deep abyss teal #041D25 anchored FLUSH TO THE TOP EDGE, covering the existing header and upper habitat down to approximately y360–380 in a 390x844 reference viewport (about43–45% canvas height). NO centered floating panel, no full-screen modal and no transparency that reveals ghosted fish or text.
- Keep exact cream serif wordmark "AQUATIC WORLD" at its original upper-left anchor and size.
- At the SAME upper-right anchor as the original Menu control, show a fine outlined Close control. Use an X icon plus exact title-case text "Close". Preserve its visual scale and horizontal anchor.
- Directly beneath the64px header, five generous regular Arial-style cream navigation rows around56px high at the390px reference scale. Exact labels in this order: "Home", "Collections", "Our Story", "Quality", "Contact". About20px side insets, left-aligned labels around18px, fine understated separators.
- Home has a short gold vertical marker at left and warm cream text. No extra "CURRENT PAGE" text, badges or duplicate CTA in the menu.
- A little bottom padding after Contact, then a clean opaque edge returning to the unchanged underwater page.
- The complete arrival eyebrow, both headline lines, full supporting sentence and entire gold CTA remain unobscured below the panel, in their exact original positions. Leave the bottom scroll hint intact. Remove the bottom-right pause circle/icon and fill that small area naturally with matching habitat, since the film is suspended during Menu.

All words must be sharp and exact. Show a single completed flat portrait website concept, no phone device, browser chrome, board, extra labels, annotations, player controls, watermark or code. This is a static state proposal, not proof of working interaction.
```
