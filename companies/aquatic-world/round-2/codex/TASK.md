# Premium Aquatic Landing Page — Shared Implementation Task v2

## Objective

Implement the supplied design as a complete, responsive, independently previewable local landing page. Produce the best verified result you can from these inputs. This task authorizes local implementation in the workspace boundaries specified in `AGENTS.md`.

## Inputs to inspect

1. `input/handoff/reference/selected-homepage-mockup.png` — primary visual reference.
2. `input/additional-reference.png` — additional view of the same design direction.
3. `input/handoff/README.md` and all specifications in `input/handoff/docs/`.
4. The handoff's `tokens/`, `examples/`, `schemas/`, and `qa/` files.
5. `input/assets/README.md`, `asset-manifest.json`, `prompts.json`, and the nine standalone images. Use the manifest's fixed slot mapping.

Actually view the images. They define visual composition; they are not website source code or verified real-company information. Follow this task's local-demo decisions where source examples disagree. Preserve the supplied documents unchanged.

## Implementation scope

- Build header, hero, heritage, collections, quality, highlights, enquiry, and footer in the reference order.
- Preserve the dark ocean teal, champagne gold, cream panels, serif hierarchy, photographic emphasis, section proportions, and restrained editorial style.
- Use real semantic DOM for text and interactive controls. Do not present a screenshot or full-reference background as an implemented website. Do not implement the illustrated browser chrome or outer picture frame.
- Prefer HTML, CSS, and minimal JavaScript with JSON-driven content. A small static build is allowed if justified; avoid unnecessary frameworks and dependencies.
- All implementation and local dependencies belong in `demo/`. Document how to preview from a fresh checkout.
- All brand, location, copy, image paths, categories, contact states, links, and SEO values must come from configuration/content. CSS theme tokens may define visual styles.
- Demonstrate a second brand and 1/3/5-category configurations without editing presentation components.
- Keep content visible without scroll-triggered animations and respect reduced motion.

## Shared demo decisions

- This is an independent fictional design concept. `AQUATIC WORLD` may be the sample display brand in configuration, explicitly marked as demo-only. Identify the fictional/demo context in the site and documentation without obstructing the design.
- Use neutral illustrative story and product copy. Do not invent company facts, approved quotations, real stock, certifications, export claims, scientific species labels, or a genuine contact destination.
- Use `#enquiry` consistently for enquiry navigation; the handoff example's `#contact` is an unresolved sample mismatch.
- Default to three collections matching the selected reference: ornamental fish, aquatic plants, and driftwood. The four-item example is sample data, not a mandatory default. Support arbitrary configured categories.
- The quality band may show clearly illustrative category/selection information. Unsupported factual business guarantees must be omitted; optional sections must hide cleanly.
- Provide a useful local collection exploration interaction, such as an accessible detail panel or section. Navigation and collection controls must reach their advertised content.
- An enquiry CTA must reach the enquiry section. With no verified contact or backend, clearly show that real enquiries are unavailable. If a local preview form is included, validate it and state that nothing was sent; never display submission success.
- Do not add an inactive language chooser or unimplemented privacy/social routes.

## Image and asset policy

Input baseline v2 supplies nine standalone images under `input/assets/`, with one shared manifest mapping eleven image slots. Both builders receive byte-identical sources. Use the mapped image for each hero, heritage, collection, highlight, and enquiry slot. Intentional reuse is recorded in the manifest.

The fixed images are AI-generated illustrations informed by the reference; they are not real-company evidence or exact original photographs. Do not present them as verified premises, stock, or species. They contain no website typography or UI. All rendered text and controls must remain semantic HTML/CSS.

Do not replace images, extract different screenshot regions, download alternative media, or generate additional imagery in this round. For 1/3/5-category fixtures, reuse an appropriate supplied source. CSS cropping, masks/gradients, responsive object positions, and deterministic resizing or format encoding are allowed. Record derivatives and their source asset ID; do not overwrite the frozen inputs.

Copy the selected sources or derivatives into your own `demo/` assets. Do not reference a sibling implementation or the canonical comparison pack at runtime. Keep an asset manifest in your output. The image pack is approximately 21.3 MiB of PNG sources; choose suitable delivery sizes and encodings and record actual results.

## Verification and delivery

1. Inspect inputs and outline the implementation, then implement and test your own page.
2. Test the main journey, mobile menu, keyboard/focus/Escape, CTA and enquiry state, image/link resolution, and runtime errors.
3. Check full layouts at 1440x900, 768x1024, and 390x844. Check horizontal overflow at 320, 360, 430, 1024, and 1920 widths as well.
4. Exercise a brand swap, optional section visibility, and 1/3/5 categories.
5. Capture screenshots and actual check results in `evidence/`. If a browser or other required tool is unavailable, record `not_run` or the concrete limitation; do not claim the check passed.
6. Record the actual model, CLI version, effort, tools/plugins, elapsed time, human interventions, and any exposed usage/cost in `evidence/run.json`. Unknown values remain unknown. Do not store credentials or private account configuration.
7. Update the workspace README with preview instructions, implementation scope, and limitations. Summarize your delivered behavior, verification, and unresolved gaps.

Self-review and fixes are allowed before declaring your initial delivery. Do not inspect competitor outputs, request comparative hints, or modify the frozen task. Do not commit, push, deploy, change accounts, or send real enquiries as part of this task.
