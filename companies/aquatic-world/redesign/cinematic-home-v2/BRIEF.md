# Shared Cinematic Home Design Brief

## Product and visitor journey

Aquatic World is a fictional aquarium website demo. Serve visitors discovering ornamental fish, aquatic plants and driftwood, then exploring a category or preparing a local project enquiry. Build a coherent living freshwater environment with editorial clarity, useful destinations and restrained controls. A static mockup supplies art direction, not proof of video or responsive behavior.

Required route contract:

| Destination | Visitor purpose | Home action |
| --- | --- | --- |
| `/` | Discover the habitat and collection | Brand / Home |
| `/collections/` | Compare the three categories | Explore the collections |
| `/collections/ornamental-fish/` | Explore fish details | Ornamental Fish chapter |
| `/collections/aquatic-plants/` | Explore plant details | Aquatic Plants chapter |
| `/collections/driftwood/` | Explore wood details | Driftwood chapter |
| `/our-story/` | Understand the illustrative brand | Our Story |
| `/quality/` | Read existing quality information | Quality |
| `/contact/` | Create, edit or clear a local enquiry preview | Contact / Discuss a project |

Preserve existing page-specific content, direct URLs, refresh, Back/Forward, category context, 404 and the honest local-only Contact flow. Global navigation links to pages. Intentional utilities such as Skip to content and the enquiry anchor remain appropriate. Do not invent business history, stock, guarantees, customer quotes or submission success.

## Film environment and visual language

Use a full-Home edge-to-edge film environment behind live navigation, copy, chapters and footer. Keep UI in HTML, never burned into the production media. No framed player, timeline, center play overlay, particles added in code, cursor effect, scroll-scrub or forced scroll snapping.

Use the new UI-free landscape and independently composed portrait scenes: natural forest greens, deep petrol water, warm restrained highlights, receding wood and fine plant textures. Fish belong within the environment at multiple depths; the habitat is the focal experience. Continuous natural swimming must be visible without turning one huge fish into a stationary mascot. The video specification and treatment are owned by STORYBOARD.md.

Use cream `#F3EFE4` for primary type, muted warm gold `#C5AF7A` only for small accents, and deep water `#071D22` for reading surfaces. Preserve the existing serif/sans-serif families unless the source cannot support this hierarchy; no new font dependency. Remove solid gold fills from Home primary actions. Use a thin cream outline, subtle shaded transparent fill, clear focus state and restrained hover fill. Main CTA stays **Explore the collections**.

## First viewport and header

- Desktop: shaded left reading region, habitat and swimming fish in the right middle distance. Align wordmark, title and CTA to a common gutter. At 1440px the wordmark should read around 24–28px, navigation 14–16px, title 60–68px and body 17–18px. Treat these as design targets; responsive readability takes priority over screenshot imitation.
- Portrait phone: a separately composed habitat with complete fish in the upper middle; copy in the lower shaded region. Keep subjects away from horizontal crop boundaries. Near-square and short landscape get their own responsive copy placement; never shrink text to preserve an unsuitable layout.
- Keep the live title **A world beneath the surface.**, eyebrow **FISH · PLANTS · DRIFTWOOD**, and description **Discover ornamental fish, aquatic plants and natural driftwood.** Limit decorative text and keep the description compact.
- Navigation is transparent over the opening environment with a restrained tonal wash. After scrolling, the actual navigation row fully masks content behind it. Preserve this verified behavior. Brand links Home; current-page marker, hover and keyboard focus remain distinguishable.
- Mobile Menu and Close use the same quiet visual language and all existing destinations. An open menu has a stable deep-water reading surface, pauses the film, and remains usable at enlarged text and short heights. Preserve keyboard behavior, dismissal and scroll handling.
- Home primary buttons have at least 48px height on phone. Keep title, description and CTA visible without intersecting the header, motion control or viewport bottom. Controls and text must remain usable at 200% text size, with natural scrolling where necessary.

## Home chapters and reading rhythm

The film remains the environment throughout Home, with local tonal reading washes that preserve a sense of water and depth. Replace the plain repeated text-list presentation with existing category photography and useful category-specific copy:

1. **Ornamental Fish**: an editorial image-led feature and concise existing category introduction, linked to its detail page.
2. **Aquatic Plants**: image/text relationship reverses on desktop; use the same clear image → heading → description → link reading order on phone.
3. **Driftwood**: a wider landscape image that emphasizes grain, branching and habitat structure, followed by a compact link.

Use the exact centrally supplied existing category image bytes in both builds. Keep imagery as normal editorial content, not video-player cards or heavy floating panels. Avoid huge artificial empty sections. Distinguish chapter emphasis while keeping spacing and type consistent. End with one compact perspective/enquiry section and a restrained footer, retaining the fictional-demo and local-enquiry disclosure.

## Media policies and independent delivery

Preserve silent inline playback, user Pause/Play, manual pause persistence, reduced-motion and Save-Data defaults, poster fallback, hidden-tab handling and menu-driven suspension. Inner pages do not acquire background video. Choose landscape by `(min-aspect-ratio: 6/5)` and portrait otherwise; validate actual moving crops before freezing final object-position values. Avoid downloading both films unnecessarily.

Each CLI owns its implementation and evidence, reuses only its own final round-9 source, and may not inspect the sibling implementation. The coordinator freezes identical brief, storyboard, acceptance, skill snapshot, reference concepts, category images and accepted final media before launch. Requested native models remain `gpt-6.1-sol` and `claude-opus-5-5`; no silent substitution. Record actual model/tool/effort differences and keep raw transcripts private. No new paid generation or provider calls from workers.
