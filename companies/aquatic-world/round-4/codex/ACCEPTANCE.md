# Multi-page Website Acceptance

Prepared 2026-10-11. These scenarios have not yet been run against a new implementation. Historical landing-page checks do not cover them.

## Functional gates

| ID | Scenario | Required outcome |
| --- | --- | --- |
| IA-01 | Load each of the eight BRIEF.md routes directly and reload | Correct, distinct page content, title, heading and assets; no Home fallback |
| IA-02 | Use every header/footer global link from Home, Quality and Contact | Relevant page URL/content; no substitution with homepage section scrolling |
| IA-03 | Follow Home → Collections → each category → Contact | Category context remains understandable; all three meaningful detail pages exist |
| IA-04 | Open a category link in a new tab and use Back/Forward across pages | Native link behavior, correct page and current navigation context |
| IA-05 | Use logo, breadcrumbs, collection index return and sibling links | Expected destination and clear hierarchy from each detail page |
| IA-06 | Load an unknown path | Honest not-found state with usable recovery; appropriate HTTP status if the server supports it |
| NAV-01 | Inspect header on every page at 1440, 1024, 768 and 390px | Readable brand/labels, stable alignment, no wrap/collision or invisible image overlays |
| NAV-02 | Open/dismiss phone menu by pointer and keyboard; press Escape | Coherent state, focus behavior and usable destinations; no trapped/out-of-view controls |
| NAV-03 | Navigate by keyboard through header, content and form | Visible focus, sensible order, usable skip link; sticky header does not obscure focus |
| NAV-04 | Disable JavaScript and open inner pages | Core content and page navigation remain usable; menu destinations remain available |
| FORM-01 | Submit blank/invalid preview fields, correct them, preview valid input | Clear associated errors and recovery; explicit nothing-sent result; no outbound submission |
| UI-01 | Inspect all routes at 1440×900 and 390×844; key layouts at 768×1024 | Readable hierarchy, meaningful layout, correct images and no overlapping text/controls |
| UI-02 | Check widths 320, 360, 430, 1024 and 1920 | No unintended horizontal overflow, clipped labels or unreadable crops |
| UI-03 | Review long content/labels and reduced-motion behavior | Layout remains stable and accessible; no required animated reveal |
| BUILD-01 | Reproduce documented build/preview and request assets/links | Working fresh build and routes; no blocking browser errors or broken rendered assets |
| FACT-01 | Review company claims, quality copy, contact information and asset provenance | Assumptions/demo copy are identified; no unsupported real-world guarantees |

Choose test depth according to the actual implementation. A URL returning HTTP 200 is insufficient: confirm the intended page-specific heading/content. A source route table is insufficient: actually traverse the site. Record unavailable browsers/devices/a11y checks explicitly.

## Visual and product review

Functional gates must pass before marking the implementation functionally verified. The design review separately inspects full-size Home, collection index, one category, Quality and Contact captures at desktop/phone, plus the open mobile menu. Check every remaining page through a browser walkthrough.

Review brand/offer clarity, top-bar hierarchy and states, type/copy wrapping, imagery/crops, cross-page consistency, differentiated content layouts, spacing/rhythm, component details and enquiry friendliness. Explain concrete weaknesses and repair their causes. Do not equate numerous completed checklist items with visual polish or user satisfaction.

If a new paired experiment is selected, predeclare a new rubric before either worker runs: information architecture/usefulness 25, visual craft 35, responsive/accessibility 20, interaction completeness 15 and reproducible implementation/ownership 5. Reference continuity is considered within visual craft rather than dominating the experiment. These weights are a proposal until recorded in that experiment's protocol.

Record three separate outcomes: functional verification; evaluator design assessment with screenshots/reasons; user design acceptance (pending until explicit feedback). Any failed structural gate blocks overall completion, irrespective of numerical score. Do not compare these future scores numerically with the old landing-page rubric.
