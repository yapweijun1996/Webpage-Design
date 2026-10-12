# 12 — Phased Implementation Roadmap & Exit Gates

## Phase 0 — Content & source preparation (P0)

- Approve logo, legal business identity, country, headline, contact routes, intended audiences.
- Audit photo rights, species captions and optional brand claims; fill `qa/asset-manifest-template.csv` and `qa/claim-approval-register.csv`.
- Decide whether catalogue routes and real contact endpoint exist.
- **Exit:** zero unknown mandatory brand/contact fields for the planned release.

## Phase 1 — Visual system and static homepage (P0)

- Load tokens + set up config validation.
- Implement header, hero, heritage, collections, quality, highlights, enquiry and footer with real DOM.
- Create responsive variants and visual snapshots; keep reference image supplied only as the design target.
- **Exit:** no static brand/geo values in templates; desktop/mobile preview matches section rhythm.

## Phase 2 — Navigation, data and enquiry flow (P0)

- Ensure every rendered card and CTA has a valid target.
- Implement menu states, accessible anchors and optional approved enquiry backend.
- Add real metadata, canonical pages, privacy link and content approval checks.
- **Exit:** main conversion path working and no false-success state.

## Phase 3 — Cross-browser QA and polish (P0/P1)

- Audit responsive sizes, 200% zoom, keyboard, reduced motion, contrast, missing images, offline failure response and lighthouse/real user performance where accessible.
- Review copy with business owner and record Verified/Failed/Blocked.
- **Exit:** all P0 gates green with evidence; no outstanding critical claim/rights risks.

## Phase 4 — Optional launch (requires new authorization)

- Set up hosting, SSL, owned domain, verified analytics choices, backup, redirect map and rollback plan.
- Production deployment and any Git push/merge happen only under a distinct request.
- **Exit:** release evidence, rollback runbook and approved contact routing.

## Change control

A new brand, new location, updated product assortment or different photo set should be a **data/config edit**, not a component rewrite. A new major layout concept should be versioned as a design revision and compared against the selected screenshot so it can be reverted.

## Progress semantics

Documentation = 100% once this package passes integrity checks. UI implementation = 0% until a working site is built and tested. Company content approval = Pending; no QA claim is made merely from writing this document.
