# 00 — Project Brief & Design Contract

## Mission

Translate the **chosen reference mockup** into a production-capable design specification for a **rebrandable, business-to-business aquatic supplier landing page**. Prioritize high-end presentation, verified supplier information, product discovery, and a working enquiry pathway. Use content configuration instead of brand-specific or geographic assumptions.

## User/visitor groups

| Audience | Main question | Page answer | Primary route |
|---|---|---|---|
| Wholesaler / distributor | What categories can you supply? | Collection overview + request details | Collections → Enquiry |
| Retail shop purchaser | Do you handle trade orders? | Business capabilities *only if verified* | About / Enquiry |
| Aquarium or aquascaping professional | Can I find products by category? | Clear fish, plant and material imagery and labels | Collections |
| Business credibility reviewer | Is this a real, contactable company? | Legal profile, approved process, reachable contact | Heritage → Quality → Contact |
| Mobile prospect | Can I scan and contact quickly? | Concise hero, accessible navigation, stable CTA | Mobile menu → Enquiry |

## Jobs to be done

1. In under 5 seconds, convey what kind of business the site represents (audience and offering).
2. In under 2 interactions, let a visitor reach a useful collection category.
3. Present approved company provenance and responsible processing information without exaggeration.
4. Provide a reliable enquiry route that acknowledges *only confirmed delivery*.

## Scope v1

**In:** homepage, standard navigation and footer, configurable branding, categories/selected highlights, heritage storytelling, quality/process statements subject to approvals, contact CTA, fully responsive styles, metadata, keyboard-accessible interactions, lightweight static delivery, QA.

**Out (unless separately commissioned):** checkout, shopping cart, live stock pricing/availability, customer accounts, custom CMS, multiple supplier integrations, payment, automated export compliance assurances, live multilingual translation, unverifiable awards and claims.

## Source of truth and precedence

1. **Business-approved factual data** for names, labels, imagery, contact details, legal and marketing claims.
2. **Selected image reference** for layout/style/composition only.
3. This ZIP's specifications and design tokens for implementation details.
4. Developer judgment for safe semantic HTML and accessible implementation when the static mockup conflicts with usability.

## Success indicators (to measure after site exists)

- Accessible navigation and CTA flows across desktop and mobile.
- Zero confirmed misleading business claims.
- 100% required sections backed by valid config or explicitly hidden.
- Zero broken category links and zero false form-success messages.
- Web Vitals performance and accessibility gates in `08_QA_ACCEPTANCE.md`.

## Non-negotiable guardrails

- **No hardcoding company name, location, export facts or inventory data in components.**
- No unauthorized reuse of third-party photos or logos.
- AI-generated reference is a style target; it is not product availability proof.
- No live deployment, Git push or production content changes without distinct authorization.
- Content updates must not break headings, cards, responsiveness or keyboard interactions.
