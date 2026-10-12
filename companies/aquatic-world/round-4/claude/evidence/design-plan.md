# Round 4 focused revision — design plan (written before editing)

Scope: REVIEW.md B (shared header) then A (phone Contact order), plus the intermediate-width Home
hero copy/fish collision. Everything else (eight routes, page compositions, content, images,
enquiry behaviour) is preserved. Sources edited at their origin: `demo/src/layout.mjs`,
`demo/src/pages.mjs`, `demo/src/site.css`, `demo/src/site.js` (only if needed), then `npm run build`.

## Baseline evidence (own round-3 code, inspected before editing)

| Viewport | Observed baseline defect | Source cause |
| --- | --- | --- |
| 1440×900 header (`baseline/home-desktop-first.png`) | Header is near-black `#061C26`, the same value as the hero, so the bar dissolves into the photograph; nav labels are fog-grey and the CTA floats with no grouping. Nothing separates "destinations" from "action". | `.site-header { background: var(--ocean-950) }`; `.site-menu` puts links and CTA in one undifferentiated flex row. |
| 1024×768, 900×1000 Home (`evidence/screenshots/before/`) | Lead copy runs across the angelfish face at 1024; at 900 the heading and lead sit on the fish body. | Overlay hero (copy over full-bleed photo) is kept down to 861px; `object-position: 70%` cannot move the fish clear of a 590px copy column below ~1200px. |
| 390×844 Contact (`baseline/contact-mobile-first.png`, `contact-mobile-full.png`) | First form field is ~1,500px down; visitor reads a 330px photo banner, "How this works", a checklist and a demo notice first. | DOM order is banner → `<aside>` (steps, checklist, notice) → form panel; the grid collapses to one column in that order. |
| 390×844 Contact | Banner alone uses ~335px (padding 64/48 + 3-line lead). | `.contact-banner` padding clamp and lead length. |

## B — Shared header plan

Structure (single component, `layout.mjs` `header()`):
`brand` | `menu-toggle` (compact only) | `site-menu` = [`nav` group] [divider] [`header-cta`].
DOM order unchanged (brand → toggle → nav → CTA) so the opened compact menu follows the toggle in tab order.

| Element | Decision |
| --- | --- |
| Surface | Solid ocean teal `--ocean-900 #0A3541` with a 1px champagne hairline bottom border (`rgba(223,192,135,.22)`). Distinct from the darker `#061C26` hero/photo surfaces so the bar reads as its own layer. No transparency over photos. |
| Height | Desktop 76px + 1px border = 77px (target 72–84). Compact/phone 64px + 1px = 65px (target 64–72). Measured by verify NAV-01. |
| Brand | Mark 34px gold + serif wordmark 1.25rem / 0.16em tracking, cream. Unchanged size (already readable); slogan stays footer-only. |
| Nav group | Labels 1rem (16px, ≥15px requirement), weight 500, cream at ~86% (`#E4E9E8`), 44px target height, 14px side padding, 2px gaps. |
| Divider | 1px × 28px champagne rule between nav group and CTA to group destinations vs action. |
| CTA | Gold filled button, 44px tall, 0.95rem/600, "Discuss a project" + arrow; only primary-coloured element in the bar. |
| Hover | Label turns white + 2px fog underline scales in (transform only — no layout shift). |
| Current page | White label + solid 2px gold underline + `aria-current="page"`. Non-colour cue: the persistent bar. |
| Current section (category pages) | White label + segmented gold underline, `aria-current="location"` + visually-hidden "(current section)" text so screen readers get explicit context, not "current page". |
| Focus | 2px gold outline, offset −2px inside the 44px target, so it is never clipped by the bar and causes no shift. |
| Breakpoint | Compact menu below the measured fit point: full row needs ≈ brand 260 + nav ≈ 460 + divider/gaps 56 + CTA ≈ 190 ≈ 966px of content plus gutters. Switch at **< 1100px** (so 1024 uses the compact menu rather than squeezing labels). Verify at 1100/1180 that items do not touch. |

Compact (≤1099px) and phone:
- Bar: brand left, "Menu" button right (44px, bordered champagne, hamburger icon). Same teal surface.
- Open state: panel drops from the bar on the same teal surface, aligned to the same `.wrap` gutter as the brand; links 56px rows, 1.125rem, separators, current page/section marked by gold side bar + "Current page"/"Current section" tag; CTA full-width at the bottom. Toggle reads "Close" with an × icon (clear dismissal). Escape closes and returns focus to the toggle; outside click and focus leaving the header close it; body scroll locked while open.
- No-JS: the toggle is hidden and the destinations remain a horizontal scrollable row under the bar (existing behaviour retained).
- Narrow phones 320–360: mark shrinks, wordmark 1rem, still single row; mark hidden below 350px as before.

## A — Contact phone order plan

New DOM order inside `main`:
1. Compact introduction (`.contact-intro`): eyebrow "Contact", h1 "Prepare an enquiry brief", one-sentence lead that includes the local-only disclosure ("Nothing is sent — the preview stays in your browser.").
2. Form panel `#enquiry` (heading, required-note, contextual-prefill card, error summary, form, preview).
3. Secondary help `<aside>`: how it works, what makes a brief useful, demo limitation, supporting photograph.

- Phone (≤767px): intro has no photo band (solid ocean surface, ~24px padding); form panel follows immediately; the photograph moves into the secondary aside after the form. Target: Name label + input fully visible at scroll 0 at 390×844 (and checked at 360/320).
- Desktop/tablet (≥900px): grid `7fr 4fr` — form left, help aside right — so visual order equals DOM order (no reordering by `order`/grid placement, no positive tabindex). The photo banner returns above as a shorter atmospheric intro at ≥768px.
- Contextual prefill card moves into the form panel directly above the fields (only rendered when `?interest=` is present), keeping "Back to …" link.
- "You are" select default "Choose one" → "Select (optional)"; Collections "Not sure yet" keeps its value and gains a hint "Pick this if you would like a suggestion." Timing default "No fixed timing" stays.
- Error summary, field errors, preview, edit/clear and no-JS notice stay inside the panel and are re-checked at 320/390/1440.

## Home hero collision plan

- ≥1200px: keep the overlay composition (verified clear at 1180–1440).
- 861–1199px: deliberate split — copy column on solid ocean (left), fish-centred crop (`hero-angelfish-fish`) as the right column, so no copy covers the fish. `<picture>` source media extended to this range.
- ≤860px: keep the existing stacked image-above-copy layout (768 baseline already clear).

## Verification plan

`npm run build`, `npm run verify` (39 original gates updated for the new header/contact contract plus new REVIEW checks: header heights, nav label ≥15px, CTA alignment, current-section label, contact DOM order, first field visible at 390×844/360/320, Not-sure hint), then `node scripts/shots.mjs` at 1440×900, 1180×820, 1024×768, 900×1000, 768×1024, 390×844, 360×780, 320×700 for affected routes, and visual inspection compared with `baseline/`.
