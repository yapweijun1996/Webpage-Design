# Aquatic World — Multi-page Website Design Brief

Status: both multi-page native implementations and their focused own-code revisions are delivered; exercised independent gates pass. User design acceptance is pending. See the [current evaluation](../comparison/round-4/RESULTS.md). [Round-4 feedback](../round-4/codex/REVIEW.md) adds compact header targets and phone intro → form/preview → secondary help order, with the first labeled field fully visible at 390×844. All frozen worker snapshots retain their original bytes.
Updated: 2026-10-11.

## Problem and current authority

The user rejected both round-2 landing pages as insufficiently professional. Global navigation currently scrolls to homepage sections; the requested experience is a structured website with independent destination pages. The user also rejected the header and overall visual detail despite high implementation/fidelity scores.

This brief defines the next implementation scope. The supplied handoff remains visual source material. Historical TASK.md, REVIEW.md, input manifests, code and scores remain unchanged and describe the earlier single-page experiment. They do not override this new product requirement or establish acceptance of it.

## Audience and goal

Working design assumption: aquarium retailers, aquascaping professionals and interested enthusiasts need to discover the collection, understand the proposed brand approach and prepare a relevant enquiry. This follows the earlier illustrative B2B case; actual company identity, market and audience have not been verified. See [research.md](../research.md).

Primary journey: Home → Collections → category detail → Contact/enquiry preview. Supporting journey: an inner-page visitor can discover Quality or Our Story, then return to the collection without returning to a homepage scroll position.

Success means an understandable page hierarchy, usable cross-page navigation and cohesive visual design. Reference similarity supports visual continuity; it is not the primary completion criterion.

## Required information architecture

Routes below are site-root paths; an implementation served under a prefix must resolve them against its configured base. Each URL must load directly and survive refresh. Static directory/index.html output is sufficient; a client router is optional, not required.

| Route | Global navigation context | Visitor question | Page-specific content | Next action |
| --- | --- | --- | --- | --- |
| `/` | Home | What is Aquatic World and what can I explore? | Brand/offer, cinematic angelfish introduction, compact collection previews, concise story/quality introductions | Browse Collections |
| `/collections/` | Collections | What are the main collection families? | Three category entries, clear fish/plants/driftwood distinctions, image-led discovery and useful category summaries | Open a category |
| `/collections/ornamental-fish/` | Collections | What does the ornamental fish concept cover? | Category-specific introduction, supplied fish studies, selection considerations and enquiry context | Prepare a fish enquiry |
| `/collections/aquatic-plants/` | Collections | How do plants shape an aquascape? | Plant/leaf imagery, proposed use and visual characteristics, relevant planning questions | Prepare a plant enquiry |
| `/collections/driftwood/` | Collections | How does driftwood shape the composition? | Hardscape imagery, structure/material discussion and planning context | Prepare a hardscape enquiry |
| `/our-story/` | Our Story | What perspective does the brand represent? | An editorial nature/people/water story, waterfront illustration and proposed values | Explore the collection |
| `/quality/` | Quality | What should a thoughtful selection process consider? | Clearly proposed selection/care principles, practical questions and expectations; illustrative rather than claimed certification | Discuss requirements |
| `/contact/` | Contact | How would I describe my project or enquiry? | Enquiry brief preview, category context, form validation and honest feedback that no message was sent | Preview enquiry |

There are eight content pages, not eight homepage sections. Each inner page needs useful depth and its own composition; do not split the old bands into thin wrappers or repeat the same oversized hero eight times. Category pages include Home → Collections → category breadcrumbs, an index return link and relevant sibling destinations. Provide a meaningful not-found page for unknown paths rather than showing Home silently.

## Navigation and header contract

Global links: Home, Collections, Our Story, Quality, Contact. The logo returns Home. Global destinations use real page links, not homepage `#collections`, `#quality` or `#enquiry`. A skip link or table of contents may still use an intentional in-page anchor. Collection cards and highlights go to category detail pages, not overlay-only panels.

Use one header component across pages, with a clear brand area, readable navigation and a single primary enquiry CTA. Suggested CTA: "Discuss a project", linking to the enquiry area on Contact. This shared destination is acceptable because the action and page context are clear.

- Desktop: deliberate baseline alignment, restrained readable labels, stable header height and generous enough separation for the logo, links and CTA. No tiny links floating indistinctly over a busy photograph.
- Inner pages: show current navigation context with `aria-current="page"` for exact destinations. On category pages, style Collections as the current section with an appropriate accessible context; do not falsely label its index link as the current page. Use `aria-current="location"` or an explicit current-section label if needed.
- Visual states: default, hover, focus and current must be coherent and distinguishable beyond color alone. Keep dimensions stable as these states change.
- Intermediate widths: switch to compact navigation before collisions or wrapping. Inspect 1024px and 768px; choose breakpoints based on actual fit.
- Phone: readable wordmark, an accessible Menu control and the same destinations. Define open/closed behavior, Escape/dismissal, focus behavior, active context and scrolling. Content must remain navigable without JavaScript.
- If sticky/fixed: prevent content, focused controls or anchor targets from being obscured. Do not hide the header during a keyboard journey.

## Visual direction and intended improvement

Retain ocean teal, restrained champagne accents, cream editorial surfaces, serif display type and aquatic photography. These belong to the supplied visual direction. Allow new page layouts, header proportions and typography/spacing decisions that make the whole website coherent.

The redesign should feel curated and calm: a strong image/offer in the first viewport, a clear navigation hierarchy, deliberate editorial alignment, measured contrast and fewer competing ornaments. This is a proposed direction, not a claim that the user will find it impressive.

| Area | Design treatment | Observable review |
| --- | --- | --- |
| Home | Cinematic brand/category introduction with one dominant collection action; brief previews of inner pages | Offer and fish subject are clear; next content is discoverable without a giant empty hero |
| Collection index | Image-led category editorial grid with distinct descriptions | Categories are recognizable and each card's entire interaction has a real destination |
| Category detail | Category-focused media, purposeful reading hierarchy and planning information | Adds depth beyond the index; fish/plants/wood are not identical text/image substitutions |
| Story | Editorial narrative with larger visual pauses and waterfront context | Reads as a story, not a row of generic marketing cards |
| Quality | Structured principles and practical considerations with restrained diagrams/icons if useful | Understandable content, readable hierarchy and no fabricated trust badges |
| Contact | Compact, welcoming enquiry workspace with clear labels and feedback | Form purpose and demo limitation are clear; keyboard validation and recovery work |
| Site-wide details | Consistent spacing, button family, rules, captions, icons and complete footer | Inspect actual full-size desktop/phone captures, including header and inner pages |

Choose type sizes from content hierarchy and test real wrapping. Body/label readability takes precedence over squeezing a screenshot. Use supplied image subjects deliberately: document crops at desktop, intermediate width and phone; avoid copy over fish faces or fins when a separate composition serves better. Respect reduced motion; use motion only when it clarifies state or supports the selected character.

## Assets and content

Use the same [nine-image pack](../comparison/assets-v1/README.md) as both previous rounds. Deterministic local optimization/cropping is allowed. Additional photos are not part of this prepared scope. Shared images may recur when appropriate, but every page need not have a photographic hero. Keep attribution/provenance in asset notes.

All Aquatic World copy remains illustrative. No real stock, product prices, certification, establishment date, premises, client logos, phone number or email destination is verified. Do not invent them. Keep the disclosure concise and visible without turning the entire interface into developer documentation.

The category pages discuss visual/selection considerations as proposed demo content; do not invent precise animal-care parameters or evidence of operational quality. Source facts if future research introduces such claims. A preview form validates locally and reports that nothing was sent. No external enquiry, ordering, account system or checkout is in scope.

Use English site copy. Keep brand, navigation labels, page titles, category content and asset mappings in a clear data source where useful for reuse. Independent runtime ownership remains mandatory. Build/preview instructions must describe actual code and routes.

## Handoff and acceptance

Use [ACCEPTANCE.md](ACCEPTANCE.md) and the prepared [implementation prompt](IMPLEMENTATION-PROMPT.txt). A builder should document its sitemap, header states and distinct page plans before coding, then implement when authorized. Do not turn this into a plan-only delivery.

Verify the main journey, every route, navigation from inner pages, direct links, refresh and history, mobile/keyboard states, image loading and responsive composition. Save real full-size screenshots for design review. Worker self-checks remain candidate evidence until independently verified.

The user authorized both native CLIs to independently rebuild from this same brief on 2026-10-11. The new versions start in separate fresh workspaces with identical input snapshots; prior deliveries remain preserved. Functional pass and user design acceptance are separate. See the company README for actual execution and verification status; authorization alone does not assert that a third round has finished.

## Current focused revision

The user authorized a fifth-round own-code revision to simplify Contact after the shared-header improvement. The identical [round-5 REVIEW.md](../round-5/codex/REVIEW.md) owns the focused requirements and overrides earlier Contact complexity; both worker snapshots are frozen. Other page architecture/asset/navigation contracts remain in force. The [current results](../comparison/round-5/RESULTS.md) and company README record delivery, verification and pending user design acceptance separately.
