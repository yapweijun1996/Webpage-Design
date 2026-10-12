# Multi-page Website Implementation Task

## Outcome

Deliver the eight-page Aquatic World website in demo/ from the new BRIEF.md and ACCEPTANCE.md. The user's prior dissatisfaction concerned single-page navigation, the top bar and overall visual detail. This rebuild must solve the structural problem and apply deliberate professional design; a clone of the old homepage cut into eight thin pages is insufficient.

## Inputs and precedence

Read AGENTS.md, BRIEF.md, ACCEPTANCE.md and input/CONTEXT.md. Read input/skills/cli-web-design-director/SKILL.md and its relevant design/prompt/CLI references. Inspect input/handoff/reference/selected-homepage-mockup.png, input/additional-reference.png and all nine independent input/assets/*.png source images. Use the original handoff for visual tokens and intent only where consistent with the new brief. Do not treat its old hash-navigation or eight-section examples as requirements.

## Delivery

- Document a concrete page/content plan, header states, responsive compositions and asset crops in evidence/design-plan.md before implementing. Then implement and verify in the same autonomous run; do not stop at a plan or request routine approval.
- Required independent URLs: /, /collections/, /collections/ornamental-fish/, /collections/aquatic-plants/, /collections/driftwood/, /our-story/, /quality/, /contact/. Every page needs distinct useful content and correct global/current navigation. Provide an honest not-found page with usable recovery.
- Use semantic DOM, real page links, a cohesive shared header/footer and meaningful category/breadcrumb/enquiry journeys. A single-page hash router or homepage-scroll substitution does not meet the route contract. Client routing is allowed only if all required direct loads and no-JS navigation remain useful; static directory/index.html output is a reasonable default.
- Keep ocean teal/champagne/cream visual continuity while improving header readability, type hierarchy, spacing, imagery and inner-page layout. Use full-size rendering, not tiny comparison thumbnails, for self-review. Let each page's purpose determine its composition.
- The contact page includes a local enquiry preview form with clear labels, validation, recoverable errors and explicit feedback that nothing was sent. Keep all data local; no external submission. Category context may prefill via a query parameter. Include a readable no-JS limitation/alternative.
- Brand, navigation labels, category copy and imagery should have clear data ownership. Use simple local static tooling where sufficient. Do not add a framework or dependencies merely for appearance. Document actual Node/browser prerequisites and asset generation; fresh builds must be reproducible.
- Use only supplied source imagery. Local deterministic cropping/encoding is permitted; provenance remains recorded. No downloads or newly generated imagery. No fabricated history, stock, prices, care parameters, guarantees, certificates, contact details or trust logos.

## Verification and evidence

Execute the supplied ACCEPTANCE.md scenarios using available tools. Review all routes at desktop and phone sizes, key layouts at tablet, and narrow/intermediate/wide overflow. Inspect full-size screenshots of Home, Collections, fish detail, Quality, Contact and the open phone menu; correct observed defects before delivery. Check cross-page navigation, direct loading/refresh/history, new-tab links, breadcrumbs, current context, not-found recovery, menu/focus/Escape, form validation/honest feedback, reduced motion and no-JS behavior. Record unavailable checks as not_run; never invent evidence.

Use one autonomous implementation opportunity with self-review and repairs. Do not consult competitor code or external comparative hints. Save actual evidence and a concise delivery under evidence/. Record model, CLI version, exposed effort/tools, unknowns and limitations in evidence/run.json. Root README.md must state verified build/preview commands and route entry points. The new declared evaluator rubric is information architecture/usefulness 25, visual craft 35, responsive/accessibility 20, interactions 15, reproducibility/ownership 5. Structural gates cannot be overridden by a score, and user acceptance is pending explicit feedback.
