# 03 — Component & Interaction Specification

## Reusable component inventory

| Component | Props / data contract | States | Keyboard/accessibility requirements |
|---|---|---|---|
| `SiteHeader` | `brand`, `navItems`, `cta`, `locales[]` | top, scrolled, menu-open | semantic `<nav>`, visible menu label, Escape closes, focus managed |
| `Wordmark` | `name`, `tagline`, `logoAssetId?` | image/text fallback | linked home, meaningful accessible name |
| `Hero` | `eyebrow`, `title`, `accent`, `body`, `imageId`, `actions[]`, `proofPoints[]` | default, image fallback | h1 only, real text, sufficient overlay |
| `ActionButton` | `label`, `href` or `action`, `kind` | idle, hover, focus, disabled | use links for navigation, buttons for actions; focus visible |
| `HeritagePanel` | `heading`, `body`, `photoId`, `quote?` | image loaded/fallback | correct reading order and source reference |
| `CollectionGrid` | `items[]` | 0,1,3,6,overflow | cards are linked, no nested clickable elements |
| `CollectionCard` | `title`, `description`, `imageId`, `href` | idle, focus, hover | alt text/thumbnail semantics; full-card link |
| `QualitySteps` | `items[]` | 0–5 | meaningful steps list, not pictograms only |
| `FeaturedGallery` | `items[]` | empty/loading/ready | figure captions; 1-click detail, keyboard reach |
| `EnquirySection` | `heading`, `description`, `cta` | contact-link or enabled form | no false success, error messages announced |
| `SiteFooter` | `nav`, `contact`, `social`, `legal` | enabled data only | no dead or placeholder links |

## Header states

- On page load desktop: hero overlay background, transparent/dark underlay (always high contrast).
- On scroll: fixed or sticky header may become solid navy with border; maintain visible logo and button and reserve layout space to avoid CLS.
- Mobile: wordmark left, labelled menu button right. Menu opens below header in an accessible overlay (not behind content); Escape closes; clicking link closes and navigates; restore focus to trigger when appropriate. Lock background scrolling only while overlay open. No horizontal overflow at 320–430px.
- If language chooser is not backed by translated content, hide it rather than offering broken routes.

## CTA rules

1. Hero primary → page section `#collections` or category index path, derived from config.
2. Hero secondary → valid enquiry path or real mailto, derived from config.
3. Card CTA → real collection detail/list page; if route is unavailable, omit the link/card or indicate not ready without deceptive affordance.
4. CTA visual hierarchy: exactly one dominant filled gold action per context; outline is secondary.
5. No custom approval modal for cosmetic UI changes; version control plus reviewable diffs/revert is preferred for design iteration. Deployment/production/business-data actions still require authorization.

## Interaction states

**Buttons:** default, hover, keyboard focus, active, loading, disabled. A disabled action must expose a helpful reason and never redirect to an unrelated page.  
**Cards:** subtle lift/highlight on hover; keyboard focus outline; touch tap directly.  
**Images:** load fallback is brand-neutral gradient and actual alt text; no broken icon clutter.  
**Form (only if enabled):** empty → invalid (field errors) → submitting → confirmed success OR actionable failure. Success means a server acknowledged a real enquiry, not merely a client-side click.

## Motion and progressive enhancement

- CSS-first responsive components; JS enhances menus/form, not basic page visibility.
- Only enable transition when motion is allowed. No layout-affecting animations that cause reflow or CLS.
- Focus ring 2–3px visible over dark and cream backgrounds.

## Component layout criteria

- `Hero`: at desktop, text width 40–50%, main image focal point at 65–80% x-position; at mobile, overlay gradient must cover entire text area and crop safely.
- `HeritagePanel`: image/text each ~50% desktop, stacked mobile; quote becomes optional small aside.
- `CollectionGrid`: desktop 3 columns for screenshot fidelity; tablet 2; mobile 1, unless space comfortably supports 2 without cramped captions.
- `QualitySteps`: desktop 4–5 columns; tablet 2; mobile 1–2 depending actual text length; avoid microtype.
- `FeaturedGallery`: desktop 4 compact cards; tablet 2; mobile 1–2; no invisible items behind a decorative gradient.
- `Enquiry`: horizontal desktop, vertically centered on mobile; never overlap foreground copy with underwater focal animals.
