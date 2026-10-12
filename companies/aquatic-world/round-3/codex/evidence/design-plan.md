# Design plan — Aquatic World

Recorded before implementation on 2026-10-11. Authority: BRIEF.md and ACCEPTANCE.md; TASK.md and the frozen director skill. This is an illustrative website, not a verified company. Only this builder's tools and shared inputs are used. No other agent, advisor, external research or previous implementation is consulted.

## Sitemap and visitor journey

All destinations are real static directory/index.html pages. Primary journey: Home → Collections → a category → category-prefilled Contact preview. Native anchors provide refresh, history, new tabs and no-JS navigation. Unknown URLs receive a distinct 404 page and HTTP 404 from the included server.

| Route | Content plan and composition | Next action |
| --- | --- | --- |
| / | Cinematic angelfish introduction; three image-led collection previews; a small cream story editorial; a restrained quality introduction | Browse Collections |
| /collections/ | Cream editorial heading; three generous photographic category cards with different summaries; a simple composition guide linking the three ingredients | Open a category |
| /collections/ornamental-fish/ | Teal split introduction using blue/red fish; two complete-fin visual studies in a gallery; color, silhouette and movement considerations; questions about setting and specialist guidance | Prepare a fish enquiry |
| /collections/aquatic-plants/ | Cream asymmetric leafy introduction; green and bronze plant studies; foreground/middle/background planning rows and visual palette discussion | Prepare a plant enquiry |
| /collections/driftwood/ | Teal material study with panoramic branching form; cream editorial discussion of line, space and scale; measured project checklist | Prepare a hardscape enquiry |
| /our-story/ | Cream editorial introduction; large waterfront illustration with honest caption; narrative about nature, water and people; proposed values as typography rather than marketing cards | Explore Collections |
| /quality/ | Cream concise process introduction; numbered teal/cream principles covering fit, observation, specialist questions and preparation; practical open questions in native details elements | Discuss requirements |
| /contact/ | Compact two-column cream enquiry workspace: context/help on left, labeled local preview form on right; validation summary, field errors and plain-text preview with explicit nothing-sent feedback | Preview enquiry |
| unknown | Compact 404, explanatory text and Home/Collections recovery | Return to discovery |

Category pages contain Home → Collections → category breadcrumbs, an All collections return and two siblings. Contact displays selected category from an allowlisted query parameter. No stock, prices, care parameters, location claims, certificates or contact routes are invented.

## Shared header and states

Solid ocean background independent of imagery; 96px desktop row with readable 24px serif wordmark, small spaced tagline, 15px navigation and one champagne Discuss a project CTA. Content max width 1280px with shared edges. Logo has a small original geometric ripple mark drawn in SVG, not a trust badge. Desktop links use an underline reserved in advance for hover/current, with a clear outlined focus ring. Exact pages use aria-current=page; categories mark Collections aria-current=location. Footer repeats all global destinations and category links with the same current context.

At widths below 1120px, switch to compact header before navigation can collide. A native details/summary disclosure provides Menu/Close and all destinations without JavaScript. It expands in normal document flow, so it never hides page content or needs a focus trap. JS adds Escape and outside-click dismissal, restores summary focus on Escape and closes on a return to desktop. Tab travels through open links then into content. Header is not sticky, avoiding obscured focused elements. Skip to content is first and reveals on focus.

## Visual system and responsive compositions

Ocean #061c26 / #0a3541; champagne #dfc087; cream #f6f4f0; ink #10242d. Georgia display paired with system sans body. H1 generally 48–68px desktop and 38–44px phone; body 16–18px, readable 60-character maximum. Eyebrows 12px with restrained tracking. Thin rules, modest square controls, generous space; no random ornamental badges or fabricated social destinations. Buttons and menu controls at least 44px tall. Focus and current states differ beyond color. No required animation; reduced-motion disables optional transitions.

Desktop Home uses the hero's quiet left half for copy and full right fish. At 1024px shorten the split and heading; below 768px put text on solid teal above a dedicated wide image with the fish retained. The Collections grid is three columns wide, two at tablet (third spans the row with horizontal treatment), one on phone. Category introductions stack at tablet/phone; fish studies use native 4:3 contain and preserve fins. Plants use layered green/bronze media and a compact ordinal planning list. Wood uses a wide 4:3-to-panorama study plus a text-led material spread. Story uses a wide waterfront between editorial sections, not an identical category hero. Quality is a structured numbered process, with no photographic hero. Contact becomes one column, keeps explanation before fields and full-width feedback.

Gutters 24px phone, 40px tablet, 64–80px desktop; at 320px reduce to 20px. Grids use minmax(0,1fr), titles wrap naturally, no fixed text height. Recheck long labels at 320px and 200% text size.

## Asset composition and provenance

Both supplied reference images and all nine PNGs were opened with view_image. They establish composition and palette, not business facts. No screenshot region is reused. Assets are AI-created illustrative images generated on 2026-10-10; input/assets/asset-manifest.json owns source IDs, hashes and generation provenance.

| Image | Use and crop |
| --- | --- |
| hero-angelfish | Home desktop wide cover center/right; phone separate 2.25:1 image, right 75% composition |
| heritage-waterfront | Story wide panorama, centered skyline; Home story image 4:3; phone 4:3 centered |
| collection-ornamental-fish | Category/index 4:3, centered at 40%, contain for detailed viewing |
| collection-aquatic-plants | Green plant entry and detail; 4:3 / portrait crop 35% center |
| collection-driftwood | Wood entry/detail and sibling preview; 4:3 center/35% with branches visible |
| highlight-red-betta | Fish red study, native 4:3 contain at all widths |
| highlight-angelfish | Fish striped study, native 4:3 contain at all widths |
| highlight-red-plants | Plant accent study, native 4:3 center |
| enquiry-underwater-school | Shared compact project invitation and Contact visual; center dark area with solid/gradient text protection |

Generate local WebP derivatives at 640px and up to 1600px with Pillow (quality 85); retain image dimensions and srcsets. Every build consumes only already-generated local demo/assets files. Build/preview use Python standard library without npm installation.

## Verification plan

Use available local Chromium tooling for all routes at 1440×900 and 390×844; key pages and header at 768×1024 and 1024×900. Sweep 320/360/430/1920px for overflow. Capture and inspect full-size Home, index, fish, Quality, Contact and phone menu, plus remaining routes. Exercise actual header/footer links, categories, breadcrumbs, siblings, new tabs, refresh/history, 404, keyboard focus/skip/Escape, no-JS navigation, invalid/recovered form and no external requests, reduced motion and long content. Record browser/package versions, commands and ownership. Any unavailable checks are not_run. Review defects and fix/retest affected behavior. Functional verification, self visual review and user acceptance remain separate; no self-score establishes acceptance.

The optional routed investigation/verification files are absent in this workspace. Current core rules and the product contract cover the work. External KB retrieval is intentionally omitted because this frozen independent experiment forbids outside comparative hints and earlier implementation context.
