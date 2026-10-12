# 04 — Responsive, Keyboard, Accessibility & SEO

## Breakpoints (implementation defaults; content-driven refinement allowed)

| Viewport | Header | Hero | Collections | Heritage | Highlights |
|---|---|---|---|---|---|
| 320–479px | compact + accessible menu | text first, strategic photo crop, 1–2 CTAs stacked | single column | text/image stacked | 1 column or comfortable 2 |
| 480–767px | menu | slightly wider text, controlled crop | 1–2 columns | stacked | 2 columns |
| 768–1023px | nav depending width, else menu | compact split or overlay | 2 columns | 1–2 columns | 2 columns |
| 1024–1439px | complete nav | image-right split | 3 columns | split | 4 columns |
| >=1440px | max-width header content | cinematic hero, proper max-width | 3 columns centered | balanced | 4 columns |

Never assume viewport *height*: iPhone landscape and 200% browser zoom must not clip buttons or content. Use `clamp()`, `%`, `min()`, `max()`, `minmax()`, `aspect-ratio`, and constrained image position; avoid fixed text heights.

## Quality targets

- No horizontal overflow at 320, 360, 390, 430, 768, 1024, 1440, and 1920 CSS px.
- Tap target recommended min 44×44 CSS px (larger than WCAG 2.2 24×24 minimum where applicable).
- Text on images uses dark overlay/background with at least 4.5:1 contrast for normal-sized text and 3:1 for large text; nontext focus/UI distinguishable.
- Full keyboard navigation: Tab, Shift+Tab, Enter, Space for buttons, Escape for menu; skip-to-content link; no focus trap outside modal/drawer.
- Proper landmarks (`header`, `nav`, `main`, `section`, `footer`), one H1, sensible H2/H3 order.
- Form labels associated, required status communicated, error summary provided and announced, privacy link reachable.
- Images convey accurate alt text: decorative aquarium background gets `alt=""` or CSS background; species photo alt names only after labels verified.
- Honor `prefers-reduced-motion`, font scaling, high contrast and low-bandwidth preference where feasible.

## SEO and discoverability

- Each page unique `title`, `meta description`, H1, and canonical derived from approved brand/site URL config; no fictional domain or SEO claims.
- Open Graph image must be an authorized site asset, not the screenshot mockup unless licensed and meaningful.
- Generate XML sitemap for actual published routes and crawlable links; implement redirects when replacing legacy URLs, preserving relevant route meaning.
- Add structured data (`Organization`) only with confirmed legal identity/contact. Do not fake credentials/reviews.
- Avoid injecting runtime-only article text if static generation can provide crawlable HTML.

## Performance and runtime

- Real-user Core Web Vitals targets at p75: LCP <=2.5 seconds, INP <=200 ms, CLS <=0.1 (using accepted measurement methodology).
- Render hero as responsive AVIF/WebP with image dimensions and suitable `srcset/sizes`; eager/high-priority for LCP image, lazy-load below-the-fold images.
- Do not load huge full-resolution gallery images for tiny preview cards.
- Limit decorative scripts and avoid blocking third-party embeds and fonts.
- Header/menu/form failures must degrade gracefully; no broken first paint if JavaScript is disabled.

## Mandatory test matrix

See `qa/responsive-test-matrix.csv` for device/interaction evidence rows. A generated screenshot alone **does not prove** these criteria.
