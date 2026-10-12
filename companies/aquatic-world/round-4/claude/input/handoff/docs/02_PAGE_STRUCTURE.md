# 02 — Homepage Blueprint / Information Architecture

## Screenshot section mapping

| Order | Reference region | Section ID | Layout and content | Functional goal |
|---|---|---|---|---|
| 0 | Dark top bar | `site-header` | Reconfigurable wordmark + tagline; Collections, Heritage, Quality, Contact; CTA; optional locale chooser | Orient visitor |
| 1 | Large photographic top | `hero` | Fish image on right, one H1 + optional italic accent line, intro, two actions, optional approved proof points | Tell visitor what/why |
| 2 | Photo + cream panel | `heritage` | Image left; heading, approved story and attributed quotation right | Humanize credible business |
| 3 | Dark teal 3-card area | `collections` | Editorial title + intro + configurable category cards | Browse offering |
| 4 | Cream icon band | `quality` | Short statement + 4–5 approved process/quality steps | Reduce uncertainty |
| 5 | Dark gallery/cards | `highlights` | Intro + 4 product/feature cards with accurately linked images | Showcase examples |
| 6 | Underwater CTA panel | `enquiry` | Headline, 1–2 lines of explanation, single main contact action | Convert enquiry |
| 7 | Light bottom strip | `site-footer` | Approved contact links, brand, legal/privacy, navigation, confirmed socials | Support & compliance |

## Section-level design decisions

### Header

Logo/wordmark left, primary links right. CTA prominently outlined in gold. Locale icon only when multilingual copy actually exists; otherwise hide it. Header on wide screens may overlay hero with a readable backdrop. Mobile collapses to a button-labelled menu; opened drawer/dialog must have keyboard and focus behavior.

### Hero

One editable H1 containing the value proposition, plus a separate stylized accent span. Both are text—not baked into the image. Headline should remain understandable if the line wrap changes. Primary CTA routes to collections; secondary CTA routes to enquiry. Three credibility items *only if approved*, else omit to avoid fabricated claims. Decorative sidebar labels should be CSS text only if informative, otherwise remove on small displays.

**Mockup example (NOT approved business copy):** “A World of Ornamental Beauty, Curated from Singapore.” Production headline should use `{brand/location/offer}` values approved for that specific client.

### Heritage

Use a business-approved premises, founder, team, farm or genuine region image. Do not imply that AI-generated architecture or staff photo documents a real company. On mobile, put headline and copy before or alongside the image as appropriate; the quote is optional and requires an approved author/source.

### Collections

Cards must be data-driven; do **not** assume every business sells Fish + Plants + Driftwood. Card fields: id, title, description, imageId, alt, href, order, enabled. Desktop screenshot uses three cards, but the component must gracefully support 1–6 and wrap or scroll accessibly. If more than 6, display top categories and a `View All` link. No horizontal mouse-only carousel.

### Quality

Each process step has an icon, title, short verified copy and optional detail link. If a step cannot be supported by a source, hide it. Do not display unlabeled certification badges or fabricated claims.

### Highlights

Thumbnail list of approved products/services/projects. Treat **featured** as editorial selection, not live stock, new arrivals or a transaction offer. If species are identified, labels must match documented sources. Use stable aspect ratios and `object-fit` adapted to the subject.

### Enquiry

Default to a real contact link (mailto or approved contact route) until secure server-side enquiry handling is available. A mock form is never allowed to show a success confirmation. Headline plus compact CTA panel; ensure actionable controls remain visible on 390px-wide screens.

### Footer

Brand, actual legal identity when authorized, navigation, contact method, privacy policy, actual licensed social account links, copyright year generated at build/runtime. No fabricated social networks or dead links.

## Cross-page extension plan

Suggested routes (all values configurable): `/`, `/collections`, `/collections/:slug`, `/about`, `/contact`, `/privacy`. v1 docs prioritize homepage; additional route design and data integration should be specified before building catalogue depth.
