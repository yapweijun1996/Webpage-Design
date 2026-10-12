# Round-2 revision — changes and limitations

Source of feedback: `REVIEW.md` (one shared submission). Verification: `npm test` in `demo/` →
`checks.json` (60/60 pass, Chromium 156 headless via Playwright 1.64). Screenshots: `screenshots/`; first-delivery
captures for comparison: `before/`.

## 1. Composition and density
- Type scale tightened to the reference: h1 `clamp(2.1rem, 3.4vw, 3.1rem)`, h2 `clamp(1.6rem, 2.3vw, 2.15rem)`; header 82→76px.
- Section padding reduced in every band; heritage image/panel ratio 0.82:1; collection cards 160→128px min height;
  quality icons 62→54px; footer padding halved; heritage second paragraph shortened.
- 1440px page height 3138px → 2085px (reference scaled to 1440 ≈ 1862px). Checked per band, not as a total: each band is
  within ±25% of its scaled reference height. Measured / reference (ratio): hero 606/558 (1.09), heritage 319/296 (1.08),
  collections 327/288 (1.14), quality 239/212 (1.13), highlights 235/207 (1.14), enquiry 286/240 (1.19), footer 73/61 (1.20).
  The remaining difference is mostly the honest demo disclosures (hero note, quality note, enquiry notice, legal line) and 44px
  touch targets in the footer.
- Tablet (640–1023px): collection cards become vertical so three sit in one row instead of 2 + orphan.

## 2. Photographic text contrast
- Heritage caption rule scoped to `.heritage__media .heritage__caption` so cream-panel text rules cannot reach it; darker scrim
  under the text plus a text shadow.
- Hero side notes were measured at 4.2:1 (1440) and 2.6:1 (1920) over the fins and plants. Fix: a dark scrim on the hero's right
  edge, and the notes now anchor to the full-bleed hero edge instead of the centred container.
- Measured, not assumed: for every text layer over a photo (heritage caption; hero eyebrow, title, accent, lead, proof points,
  demo note and side notes; highlights eyebrow, title, note, card titles and side note; enquiry eyebrow, title, lead, notice,
  side note and signature) the test reads the computed colour, hides the text, screenshots its glyph box and compares against the
  95th-percentile background luminance. Required 4.5:1 (3:1 large text). Run at 1920/1440/1280/1024/768/390 for both brands:
  all pass; the lowest value is 6.4:1 (enquiry signature at 1440). Heritage caption 10–12.5:1.

## 3. Responsive hero and crop
- ≥1200px: full-bleed overlay as in the reference. <1200px: the photo is its own band under the header
  (`height: min(92vw, 520px)`), copy below it, so no heading or body copy can cover the fish and the header never sits on it at 390px.
- Object positions are configuration (`tabletPosition: 100% 50%`, `mobilePosition: 95% 45%`), chosen from the source: the fish
  occupies x 54–92%, y 10–86% of the image.
- Test maps that box through `object-fit: cover` and the computed object-position at 320–1920px: no text overlap at any width,
  100% of the fish visible from 320 to 1440px, 98.3% at 1920px.

- Header: below 900px the JS header stays one row (a long tagline wraps inside the wordmark column), and the stacked hero's top
  offset follows the measured header height (`--header-offset`), so the header never covers the photo (previously the header
  wrapped to 112px at 320px and for the Tidewell brand). Without JS the header is in normal flow above the hero.
- 900–1199px: hero photo height `clamp(400px, 60vh, 520px)` so the headline and CTAs reach the first screen at 1024×768.
- The hero test now also fails if the header overlaps the fish below 1200px.

## 4. History and explorer state
- The URL hash is now the single source of truth (`fromHash` on load, `popstate`, `hashchange`, de-duplicated):
  collection hash → that detail; `#collection-explorer` → overview; empty/unrelated hash → explorer closes, then the page
  re-aligns with the hash target (needed because collapsing the explorer moves the sections below it).
- Verified: open → switch → Back → Back to empty (closed, no `aria-current`) → Forward (correct panel, focused) → nav to
  `#quality` (closed) → Back (reopened) → header CTA to `#enquiry` while open (closed, enquiry in view) → Back (reopened) →
  Close (focus returns to the card). Initial load with a category hash on the default and the 5-category brand.

## 5. Preserved contracts
Eight sections and image-slot mapping, JSON content, second brand, 1/3/5 categories, optional-section hiding, mobile menu
keyboard behaviour, enquiry preview ("nothing was sent", no network request), no-JS rendering and reduced motion are all
re-checked in the same run. No new images, dependencies or claims.

## Limitations
- Chromium headless only. Safari/Firefox, real devices, screen readers and 200% zoom were not run (`not_run`).
- The fish bounding box in the hero test is a manual measurement of the source image, not image recognition.
- At 1920px the hero crops ~2% of the fish (tail fin tips) by design of the full-bleed cover crop.
- Contrast is sampled at the 95th-percentile background pixel; it is a measurement aid, not a full WCAG audit.
- Desktop total height remains ~13% above the reference because demo disclosures are kept visible.
