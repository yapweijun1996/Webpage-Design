# Delivery — Aquatic World multi-page rebuild (Claude Code, claude-opus-5-5)

Date: 2026-10-11. Three outcomes are kept separate:

1. **Functional verification (worker self-check):** 39/39 scripted checks passed — `evidence/verification.json`, Chrome 154 headless, run 2026-10-11T07:11Z, against a fresh `rm -rf dist && npm run build`.
2. **Evaluator design assessment:** not performed by this worker. Self-review notes below are candidate evidence only.
3. **User design acceptance:** pending explicit user feedback.

## What was built

Eight independent static pages plus a not-found page, generated from one data source (`demo/src/content.mjs`) and shared layout (`demo/src/layout.mjs`). Each global nav item, footer link, collection card, breadcrumb and sibling card is a plain `<a href>` to a real directory URL; there is no hash routing or overlay panel. The plan in `design-plan.md` was implemented with the deviations listed below.

### Key design decisions

- **Header:** solid ocean-950 bar (76px desktop / 64px compact) in place of links floating over the photograph; serif wordmark with a small line mark, 15px sans labels, one gold CTA "Discuss a project" → `/contact/#enquiry`. Current page = solid gold underline + `aria-current="page"`; category pages mark Collections with a segmented gold underline + `aria-current="location"` (and visible "Current section" text in the compact menu). Hover adds a fog underline in reserved space, so dimensions stay fixed. Measured fit: full navigation still aligns on one centre line at 1024px, so the compact breakpoint is <1000px (checked at 1440/1024/768/390).
- **Compact menu:** disclosure panel under the bar (not a modal): `aria-expanded`, label switches Menu/Close, Escape closes and returns focus, outside click or focus leaving the header closes, body scroll locked while open, closes when resizing to desktop.
- **No JavaScript:** `html.no-js` hides the Menu button and shows the five links as a row under the wordmark; footer repeats every destination. The contact preview button stays disabled, and a `<noscript>` notice says nothing is sent.
- **Distinct compositions:** Home = cinematic split hero + three category cards + story split + quality principles + enquiry band. Collections = cream intro with an index list, a full-width feature card plus two cards, and a dark "how the families differ" comparison. Fish = dark split header + two "studies" + 2×2 considerations. Plants = full-bleed banner with an overlapping cream panel + layer diagram (SVG) + trait list beside red foliage. Driftwood = tall image header + composition diagram (SVG) + material notes. Story = centred editorial title, full-bleed waterfront with an honest caption, narrow reading column with drop cap and pull quote, underwater visual pause, values list. Quality = explicit "proposed principles" notice + five-step process line (vertical below 1100px) + supplier questions + expectations. Contact = underwater banner + aside (how it works, prefilled category context, what helps, demo limitation) + form workspace.
- **Imagery:** only the nine supplied PNGs, encoded to WebP at fixed widths by `demo/scripts/images.mjs` (deterministic; re-run produced identical SHA-256 values). One art-directed crop (`hero-angelfish-fish`, source crop 860,0,1000×836) is used on phones (≤640px) so the copy sits below the fish, not over it; between 641 and 860px the hero stacks image-over-copy using the full image. Provenance: `demo/assets/img/manifest.json` (source path + source SHA-256 per derivative). Studies use `object-fit: contain` to keep complete fins.
- **Honesty:** removed reference claims (Singapore origin, "trusted by global partners", global delivery, social icons, language selector). Disclosure in every footer; waterfront captioned as not depicting premises; quality page explicitly not a certification; category copy framed as visual/selection questions without care parameters; contact page has no email/phone and states that nothing is sent.

### Deviations from the plan

- Breadcrumbs appear only on category pages (top-level pages use an eyebrow instead).
- Hero eyebrow shortened to "Fish · Plants · Driftwood" after the phone capture showed an orphaned word.
- Typography uses system font stacks (no font files bundled): Iowan Old Style / Palatino / Georgia for display, system-ui for body. Rendering on non-Apple systems will fall back to Palatino Linotype/Georgia (not inspected).

## Self-review: observed defects and repairs

| Viewport / page | Observation | Cause | Repair | Re-check |
| --- | --- | --- | --- | --- |
| 320, 360px, every route | 53px / 13px horizontal overflow | wordmark + Menu button wider than the row | narrow-phone header sizes; mark hidden <350px | measured 0px overflow 320–430; UI-02 pass |
| 390px Home | eyebrow wrapped leaving "Driftwood" alone | long eyebrow copy | shorter copy | phone capture |
| 1440 Collections | large empty gap in the feature card | `margin-top:auto` on the explore cue | fixed 20px margin in the feature card | capture |
| 1440 Driftwood | diagram labels sat on branch strokes | label coordinates | moved labels into clear areas | native-resolution crop |
| 1440 Contact | checkbox tiles misaligned, no padding | `.field label` out-specified `.choice` | scoped `.field .choice` rule | crop |
| 1440 Story | pull quote rendered at body size | `.story-column p` rule overrode it | rule scoped to sections | crop |
| 768 category pages | sibling cards cramped (narrow image, wrapped titles) | two columns of row cards | single column below 900px | tablet capture |
| 1920 Home | H1 wrapped to four lines | font clamp max 4.5rem | max 4.25rem | 1920 capture |
| 390 no-JS | "Contact" clipped at row edge | link padding | tighter row spacing (fits at 390; scrolls at 320) | no-JS capture |
| Capture tooling | blank images in some full-page shots | lazy images switched to eager, captured before paint | decode + paint wait in `loadAllImages` | images verified loaded (naturalWidth) and visible |

Full-size captures inspected: Home, Collections, Fish, Plants, Driftwood, Story, Quality, Contact at 1440 (full page), all routes at 390 (tiled at native scale), tablet 768 (Collections, Driftwood, Home), 1920/320 viewports, open phone menu (page and section states), no-JS phone, form error and preview states.

## Acceptance coverage (`npm run verify`)

| ID | Result | How |
| --- | --- | --- |
| IA-01 | pass | all 8 routes loaded directly and reloaded: HTTP 200, distinct titles, expected H1, single correct `aria-current`, >600 chars main content, no broken images |
| IA-02 | pass | every header (5) and footer (8) link clicked from Home, Quality and Contact; destination path + H1 checked; no `#` links |
| IA-03 | pass | Home → "Browse the collections" → each category card → "Prepare a … enquiry" → Contact with that interest checked and context card linking back |
| IA-04 | pass | category href opened in a separate target (correct page and `location` state); Back/Back/Forward/Forward across Home/Collections/Plants with correct nav context |
| IA-05 | pass | from each category: logo, both breadcrumbs, "Back to all collections", both sibling cards |
| IA-06 | pass | deep unknown path: HTTP 404, honest heading, CSS loaded, 8 recovery links, recovery click works |
| NAV-01 | pass | all routes at 1440/1024/768/390: one centre line, ordered without overlap, single-line 44px links, ≥15px labels, compact toggle below 1000px, no overflow |
| NAV-02 | pass | pointer open, "Close" label, all links + CTA in view, body locked, Escape closes and returns focus, Enter opens, Tab reaches Home, outside click closes, menu link navigates |
| NAV-03 | pass | 1440 and 390: first Tab = skip link, Enter moves focus to `main`, 40 Tabs through the contact page: every focus visible (outline) and never under the sticky header |
| NAV-04 | pass | scripts disabled: `no-js`, 5 visible nav links, Menu hidden, contact preview disabled with notice, native navigation works |
| FORM-01 | pass | blank submit → focused summary with 4 linked errors, `aria-invalid` + `aria-describedby`; summary link focuses field; partial errors; live recovery; valid → preview with "Nothing was sent", URL unchanged, long token wraps; Edit keeps values; Clear resets; zero non-GET / cross-origin / document requests |
| UI-01 | captured | full-page 1440×900 and 390×844 for all routes, 768×1024 for 8 routes (`evidence/screenshots/`) |
| UI-02 | pass | 320/360/390/430/768/1024/1920 on all routes + 404: no document overflow, no clipped labels, no element beyond the viewport |
| UI-03 | pass | `prefers-reduced-motion: reduce` → transitions ≈0; no content hidden pending animation (no reveal animations exist) |
| BUILD-01 | pass | fresh build; no console errors, failed requests or broken images on any route; phone hero uses the cropped derivative; image regeneration deterministic |
| FACT-01 | manual | claims reviewed as above; disclosure in footer; no contact details, stock, prices, certifications or dates |

Contrast (computed from token hex, WCAG formula): bronze eyebrow/link #7A5C24 on cream 5.65:1, slate on cream 7.03:1, fog on ocean-900 8.35:1, gold on ocean-900 7.52:1, ink on gold 9.17:1, error on white 6.81:1, input border on white 3.49:1 (non-text). Text over photographs relies on gradients and was inspected visually, not measured.

## Not run / limitations

- No screen-reader session (VoiceOver/NVDA) and no axe/Lighthouse audit — `not_run`.
- Only Chromium (Chrome 154 headless) was exercised; Safari/WebKit, Firefox and physical phones/tablets — `not_run`.
- 200% browser zoom and Windows High Contrast — `not_run`.
- Sub-path (`--base`) build checked by link output only, not served in a browser.
- The no-JS nav row scrolls horizontally at ≤360px (intended, but less polished than the JS menu).
- Visual quality judgements above are the builder's own; they do not establish user acceptance.
