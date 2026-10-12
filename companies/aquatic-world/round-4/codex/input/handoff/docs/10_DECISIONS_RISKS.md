# 10 — Design Decisions, Open Questions & Risk Register

## Confirmed design decision

Selected by user: **the shown dark luxurious image with `AQUATIC WORLD` as demo placeholder**. Specific visual characteristics are locked for the next design iteration; brand wording is deliberately *not* locked to any company.

| ID | Decision | Status | Owner |
|---|---|---|---|
| D01 | Choose premium underwater nature-storytelling direction | Selected | User |
| D02 | Do not hardcode any client brand or the sample brand | Required | User |
| D03 | No fixed country and no fake worldwide claims | Required safeguard | Implementation |
| D04 | B2B collections + business enquiry as primary paths | Proposed | User to confirm per client |
| D05 | Use JSON-driven content and CSS theme variables | Recommended | Engineering |
| D06 | Provide documentation ZIP before any code changes | Requested | This deliverable |

## Open questions (do not block documentation)

| ID | Question | Safe temporary answer |
|---|---|---|
| OQ01 | What is the actual deployment brand/logo? | Show text `Your Brand` from config in development only |
| OQ02 | Is Singapore actually the client's base? | Remove geographic claims until configured and approved |
| OQ03 | Which claims or quality process are real? | Hide optional trust/process items |
| OQ04 | Do photos document real listed products? | Use licensed category-illustration photos + neutral descriptions |
| OQ05 | Do you need working enquiry form or mailto? | Verified contact link; form optional later |
| OQ06 | What framework/hosting stack is required? | Prefer small static build; confirm operational constraints |
| OQ07 | Which pages beyond homepage are in first release? | Plan routes, don't invent their contents |
| OQ08 | Is language switching needed? | Hide EN dropdown until translations exist |

## Risk register

| Risk | Severity | Mitigation |
|---|---|---|
| AI mock shows fictitious staff/facilities/business claims | Critical | Require content approval; never publish as factual image |
| Generated animal photo inaccurately identifies species | High | Human species/content audit, explicit asset tracking |
| Brand or country hardcoded across sections | High | Config-swap integration test + build grep |
| B2B enquiry button goes nowhere / false success | High | Verified target or working secure backend; negative-path test |
| Dark photo obscures headline/CTAs | Medium | CSS left-to-right gradient, measured contrast on images |
| Hero image becomes huge LCP | Medium | Art-direction, responsive encoding, measured performance |
| Mobile header obscures content / scroll overflow | High | 320–430px viewport QA, sticky offset handling |
| Unapproved font or third-party photo redistributed | High | License check and manifest before production |
| Company claims become stale | Medium | Dates + approval register + scheduled review owner |
| Screenshot copied as flat background webpage | High | DOM text/components required; functional checks |

## Escalation criteria

Pause release (not necessarily design work) when legal identity, operating location, shipping/certification claims, photo permission, submitted enquiry destination or client ownership of domain remains unconfirmed.
