# Aquatic World — Multi-page Design Plan

Written before implementation on 2026-10-11 (Claude Code, model `claude-opus-5-5`).
Sources read: AGENTS.md, CLAUDE.md, TASK.md, BRIEF.md, ACCEPTANCE.md, input/CONTEXT.md,
input/skills/cli-web-design-director (SKILL.md + design-review, prompt-patterns, cli-operation),
input/handoff tokens/visual design system/reference notes, both reference PNGs and all nine assets.

Observation: `input/additional-reference.png` and `input/handoff/reference/selected-homepage-mockup.png`
render the same homepage mockup but have different SHA-256 values (3c0d…f8f vs dee0…c39); treated
as the same visual reference.

## 1. What survives from the reference, and what changes

Keep: deep ocean teal surfaces (#061C26 / #0A3541 / #0C4450), champagne gold (#DFC087 / #C6A466)
used sparingly for the primary action, rules and italic emphasis, cream editorial surfaces (#F6F4F0),
serif display type with uppercase tracked eyebrows, dark cinematic aquatic photography.

Change:
- Header becomes a **solid** ocean bar (no tiny links floating over the photo), with a larger wordmark,
  15px navigation labels and one gold CTA "Discuss a project".
- No hash navigation. Every global destination is its own page.
- Drop unverifiable reference copy: "Curated from Singapore", "Trusted by global partners",
  "Global delivery", social icons, EN language selector, handwritten slogans. The waterfront is
  presented as an illustrative scene, not as premises.
- Fewer ornaments: vertical side captions and icon-ring rows are removed; structure comes from a grid,
  hairline rules and type.

## 2. Sitemap and journeys

```
/                                   Home                 (nav: Home = page)
/collections/                       Collections index    (nav: Collections = page)
  /collections/ornamental-fish/     Category detail      (nav: Collections = location)
  /collections/aquatic-plants/      Category detail      (nav: Collections = location)
  /collections/driftwood/           Category detail      (nav: Collections = location)
/our-story/                         Our Story            (nav: Our Story = page)
/quality/                           Quality              (nav: Quality = page)
/contact/                           Contact / enquiry    (nav: Contact = page)
/404.html (served for unknown paths with HTTP 404)
```

Primary journey: Home → Collections → category → "Prepare a … enquiry" → /contact/?interest=<slug>#enquiry
(interest prefilled, category context shown with a link back).
Supporting journey: any inner page → Quality/Our Story via header → "Explore the collections" → /collections/.

## 3. Page content plans (all copy illustrative)

| Route | Composition | Content | Next action |
| --- | --- | --- | --- |
| `/` | Cinematic split hero: text left on dark gradient, angelfish right (desktop); phone: image block on top cropped to the fish, text below — no copy over the fish | Eyebrow (three families), H1 "A world of ornamental beauty, *curated with care.*", lead, primary CTA "Browse the collections", secondary link "How we think about quality". Then: three collection preview cards → detail pages; story split (waterfront image / cream text) → Our Story; quality intro with four numbered principles → Quality; enquiry band on the underwater-school panorama → Contact | Browse Collections |
| `/collections/` | Cream page intro (no photo hero) + asymmetric editorial grid: fish large left, plants + driftwood stacked right; then a three-column "how the families differ" comparison | Per family: number, name, 2-sentence summary, "considered for" terms, whole-card link. Comparison rows: role in a display, what to look at, questions to bring | Open a category |
| `/collections/ornamental-fish/` | Dark split header (copy left, betta image right). "Studies" gallery of two complete fish (contain fit, captioned as illustrative). Considerations as a 2×2 definition grid. Enquiry checklist aside | Colour & finnage, form & movement, temperament & community (as questions, no care parameters), display context. What to include in a fish enquiry | Prepare a fish enquiry |
| `/collections/aquatic-plants/` | Full-bleed plant image with a cream text panel overlapping its lower edge; layered-planting diagram (foreground/midground/background bands); red-foliage study beside "colour contrast" text | How plants shape a scape: layers, leaf form, colour, texture, growth habit — described visually. Planning questions | Prepare a plant enquiry |
| `/collections/driftwood/` | Dark header with tall driftwood image left, copy right; SVG composition diagram (focal point, lines, negative space); material notes in a ruled list | Structure (line, branching, mass), material (surface, tone, how it reads under water), composition, planning context (dimensions, pairing with plants/fish) | Prepare a hardscape enquiry |
| `/our-story/` | Editorial: large centred serif title on cream → full-bleed waterfront with honest caption → narrow reading column in three chapters (Nature / People / Water) with gold pull quote → full-bleed underwater pause → proposed values as ruled text list | Brand perspective as a proposal; no founding date, location or history claims | Explore the collection |
| `/quality/` | Cream intro with explicit "proposed principles — not a certification" note; five-step horizontal process line (vertical on phone); two-column practical-questions checklist; "expectations" ruled list; angelfish study aside | Selection, observation, acclimation planning, handling & packing, follow-up — described as what a thoughtful process considers | Discuss requirements |
| `/contact/` | Short underwater banner strip; two columns: left = purpose, honest "nothing is sent" notice, category context, what to include; right = form workspace. Preview result replaces nothing — it appears beneath the form heading with the summary | Fields: name*, organisation, email* (format), role, interests (checkboxes, prefilled by `?interest=`), project description* (min 20 chars), timing. Error summary + inline errors; preview shows a summary and "Nothing was sent" | Preview enquiry |
| 404 | Cream page with short message and recovery links | "This page isn't part of the collection" + Home / Collections / Contact | Recover |

Category pages each include breadcrumbs (Home › Collections › Category, current item `aria-current="page"`),
a "Back to all collections" link and two sibling cards.

Footer (all pages): wordmark, Explore (5 global links), Collections (3 categories), and a concise
demo disclosure: illustrative concept, AI-generated imagery, no enquiries sent, no verified business facts.

## 4. Header states

| State | Desktop (≥ 1000px) | Compact (< 1000px) |
| --- | --- | --- |
| Layout | 76px solid ocean-950 bar, sticky. Mark + "AQUATIC WORLD" serif wordmark (≈20px, 0.16em tracking) left; 5 links centred-right at 15px; gold CTA right. All items share one centre line | 64px bar: wordmark left, "Menu" button (text + icon, 44px) right. CTA moves into the panel |
| Default link | fog-200 text, transparent 2px bottom bar | panel link: cream, 18px, 52px rows separated by hairlines |
| Hover | white text + fog underline bar (bar has fixed reserved space, no shift) | background ocean-900 |
| Focus-visible | 2px gold outline, 3px offset, plus hover treatment | same outline inside panel |
| Current page (`aria-current="page"`) | white text + solid gold 2px bar | gold 3px left bar + "Current page" visually hidden label is not needed; aria-current conveys it, plus visible bar |
| Current section (`aria-current="location"`) on category pages | white text + gold bar with gap (dashed look) — distinguishable from page | gold left bar + small "Section" caption |
| Menu open | — | `aria-expanded="true"`, panel slides under the bar (no animation with reduced motion), max-height: 100dvh − bar with own scroll; Escape / outside click / focus leaving header closes and Escape returns focus to the button; body scroll locked while open |
| No JavaScript | — | `html.no-js`: Menu button hidden; links render as a horizontally scrollable row under the bar; footer lists all destinations |

Sticky header: `scroll-padding-top` = header height so skip-link and anchor targets aren't hidden;
header never hides on scroll. Breakpoint chosen at 1000px: measured fit to be confirmed at 1024 (full nav)
and 768 (compact). Breakpoint will be moved if the 1024 measurement shows collisions.

## 5. Responsive compositions and crops

| Asset | Desktop | Intermediate (768–1024) | Phone (≤ 600) |
| --- | --- | --- | --- |
| hero-angelfish (1882×836) | Home hero background, `object-position 72% 45%`, left gradient for copy | same, copy column narrower, gradient stronger | art-directed crop (x 860–1740 of source) shown as a 4:3 image block above copy |
| collection-ornamental-fish | Collections large card; fish detail header right | 4:3 | 4:3, `object-position 45% 50%` keeps head and fins |
| collection-aquatic-plants | Collections card; plants full-bleed header (21:9) | 16:9 | 4:3, `35% 50%` |
| collection-driftwood | Collections card; driftwood tall header (3:4 crop) | 4:3 | 4:3, `35% 50%` |
| highlight-red-betta / highlight-angelfish | Fish studies, `contain` on dark to keep complete fins | same | stacked |
| highlight-red-plants | Plants "colour" study 4:5 | 4:3 | 4:3 |
| heritage-waterfront | Home story split; Our Story full-bleed (21:9, position 50% 55%) | 16:9 | 4:3 |
| enquiry-underwater-school | Home enquiry band; Our Story pause; Contact banner strip | same | centre crop |

Derivatives: `demo/scripts/images.mjs` encodes WebP at fixed widths (640/1280/1920 as source allows)
with `cwebp` plus one deterministic crop for the phone hero. Sources are never modified; provenance
mapping is written to `demo/assets/img/manifest.json`.

Grid: max content width 1240px, gutters clamp(20px, 4vw, 40px). Spacing scale 4–96px.
Type: display serif stack (Iowan Old Style / Palatino / Georgia), body system-ui 17px/1.65,
H1 clamp(2.4rem, 4.6vw, 4.4rem), H2 clamp(1.8rem, 3vw, 2.8rem).

## 6. Implementation approach

- No framework/dependencies. `demo/src/content.mjs` owns brand, navigation, pages, categories and
  asset mappings; `demo/src/render.mjs` holds the shared layout (header/footer/breadcrumbs) and page
  renderers; `demo/scripts/build.mjs` writes static `dist/<route>/index.html` + `dist/404.html`.
- `demo/src/site.css` (one stylesheet) and `demo/src/site.js` (menu, form preview, interest prefill).
- `demo/scripts/serve.mjs`: loopback static server, clean directory URLs, real 404 status.
- `demo/scripts/verify.mjs`: dependency-free Chrome DevTools Protocol checks + full-size screenshots
  into `evidence/screenshots/`.
- Motion: only short colour/underline transitions and the menu panel; disabled under reduced motion.
