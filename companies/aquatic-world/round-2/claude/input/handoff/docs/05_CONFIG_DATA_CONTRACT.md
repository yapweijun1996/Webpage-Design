# 05 — Configuration & Content Data Contract (No Hardcoded Brand)

## Principle

**All customer-specific strings, links, geographic claims, imagery and business capabilities originate in validated content/configuration data.** Components render typed data only; switching from a hypothetical `Aquatic World` demo to another client must not require modifying components. Screenshot text is a demo, not production source data.

## Suggested source layout

```text
src/
  components/         # Presentational site components; no customer data
  templates/          # Homepage, collections, about, contact templates
  theme/              # CSS custom property tokens, replaceable theme
content/
  tenants/<tenantId>/
    site.json          # Brand, navigation, domains, locales, contact, feature flags
    homepage.json      # Section copy, approved claims, section visibility
    collections.json   # Arbitrary set of categories / display ordering
    assets.json        # Images and provenance
    claims.json        # Evidence, reviewers, validity window
```

A static single-tenant implementation may flatten these folders; contract stays the same. Multi-tenant separation is an optional architecture decision requiring proper isolation. **Do not infer that this spec authorizes deploying multiple tenants.**

## Example configuration

- `examples/site-config.example.json` demonstrates location-independent brand and contacts.
- `examples/home-page.example.json` demonstrates section data, hero headline and content with neutral placeholders.
- `examples/collections.example.json` demonstrates categories based on the aquatic design theme.
- `schemas/site-config.schema.json` and `schemas/home-content.schema.json` demonstrate useful validation constraints.

## Key rules

| Source property | Read at runtime/build from | Must NOT live in component |
|---|---|---|
| Brand, trademark, tagline, logo alt | `site.brand` | Static header/footer string |
| Country and regional claim | `site.location` | Hero headline + world map copy |
| Business email, phone, legal identity | `site.contact`, `site.legal` | Footer/CTA/JSON-LD |
| CTA labels/links | `site.navigation`, `site.cta` | Hardcoded click handlers |
| Hero photo and alt | `homepage.hero.imageId` + asset manifest | CSS fixed image path |
| Collections and routes | `collections.items[]` | Four hardcoded categories |
| Heritage text + quotation | `homepage.heritage` | Static marketing paragraphs |
| Quality points, country counts, credentials | `homepage.quality` + claim approvals | Assumed proof points |
| Copyright & legal pages | `site.legal`, deployment metadata | Fake © year or site name |

## Trust and evidence model

Any statement that implies **verified fact** (export count, founded year, source sustainability, certifications, successful logistics, handling procedure, quoted customer, social metrics) must have:

- Stable `claimId`;
- Source link / internal document path / owner attestation;
- Approval status `approved` (not `proposed`);
- `verifiedOn` and review date if the claim can become stale;
- Copy exact enough to match evidence without overclaiming.

Render only approved claims. When uncertain, omit claim and rebalance layout instead of replacing it with another boast.

## Safe configuration validation

- Verify required URL format and protocol: local route `/...` or `https://...`; disallow `javascript:` and untrusted injection.
- Validate duplicate IDs, empty titles, stale assets, and order collisions.
- Nonempty business CTA target required before enabling interactive enquiry.
- Strings must be escaped at render; never inject `innerHTML` from third-party content without a deliberate sanitizer.
- Maintain separation between `config` (business facts) and `style` (theme tokens).
- All mock copy flagged `demo_only` or unapproved must be blocked from production builds.

## Example brand swap acceptance test

1. Supply a client fixture with **entirely different** logo, brand name, country, navigation labels, category count (one or five), and CTA paths.
2. Build without editing any `src/components/*` or `src/templates/*` file.
3. Search output HTML, JS and metadata for `AQUATIC WORLD`, previous-client brand names, `Singapore`, demo URLs and demo credentials; expect **zero unintended occurrences**.
4. Visually verify header/hero/heritage/footer adapt without overflow.
5. Render an empty optional quality section without phantom badge icons or claims.
