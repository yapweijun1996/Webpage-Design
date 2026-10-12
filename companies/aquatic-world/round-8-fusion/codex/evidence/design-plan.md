# Fusion Home implementation plan

Prepared 2026-10-12. Implementation is authorized by TASK.md and the current request. This plan precedes source changes.

## Evidence and scope

Read AGENTS.md, TASK.md, BRIEF.md, REVIEW.md, CONCEPT-NOTES.md and the supplied cli-web-design-director skill/reference. Inspected all three reference PNGs and both clean WebP posters with the available image reader. Only this own baseline/demo source is used. The routed investigation/verification module directory is absent; core contracts and frozen inputs govern this run. No KB/MCP retrieval is permitted in this independent workspace.

The desktop concept establishes strong cream branding, regular navigation, left-aligned compact display copy and one gold arrival action. The phone concept establishes a readable brand, outlined Menu and the subject above the offer. Clean posters confirm the actual subject/habitat differs from generated concept recomposition. Preserve the exact existing crop and media, never use raster UI as runtime media. The brief, not the open raster's shorter panel or shifted copy, governs implementation.

## Route and action contract

| Page | Purpose / next step |
| --- | --- |
| / | Arrival, three collection entries, perspective, useful footer |
| /collections/ | Independent collection overview; open a category |
| /collections/ornamental-fish/ | Existing fish content; contextual Contact link |
| /collections/aquatic-plants/ | Existing plant content; contextual Contact link |
| /collections/driftwood/ | Existing hardscape content; contextual Contact link |
| /our-story/ | Existing perspective content |
| /quality/ | Existing principles and questions |
| /contact/ | Four-group validation, local preview, Edit and Clear |
| /404.html | Existing missing-page recovery |

Primary journey: Home -> Collections -> category -> Contact -> local preview. Global navigation stays page navigation. No enquiry sends or new business claims.

## Layout and state decisions

- Keep all fusion presentation in home-motion.css. Retain 80px desktop header, set 32px Georgia wordmark and regular 16px Arial navigation, 72px heading and a 540px maximum arrival copy column. Keep the existing desktop arrival anchor near 30svh.
- At 390px keep a 64px top bar, 20px side inset, 18px wordmark, 98x44px outlined Menu, 39-40px heading and 16px body. Use one natural-width 52px CTA with 17px label. Retain subject-first portrait spacing; allow readable content to grow/scroll at reduced height or text enlargement. At 320px use 16px sides and 16px branding without shrinking body text.
- Replace the Home modal treatment with a nonmodal details disclosure. The details and summary remain in the same grid cell for both states; its navigation alone is positioned immediately under the top bar. Five 56px minimum rows plus 24px bottom padding produce about 368px total at 390x844. The opaque open header/panel prevents ghosting. Limit and scroll the link area for short windows; keep Close above it.
- Home owns dismissal and playback wiring; bypass only shared navigation enhancement on Home. Preserve inner navigation and all Contact logic. Escape returns focus; outside interaction, focus leaving the header, link selection and desktop breakpoint close without traps, inert regions or scroll locking.
- Hide the motion utility while open; temporary suspension must not change manual-stop/policy/opt-in intent. Preserve orientation selection at 6/5 at every width, landscape cover 50% 50%, portrait cover 50% 30%, near-square copy at 70svh, silent whole-Home film, no automatic film attachment under reduced motion/data saving, session stop retention and all media fallbacks.

## Verification and limits

Use existing Python build and Node syntax/controller checks only. Verify frozen hashes, eight routes plus 404, exact unchanged generated inner-page HTML against baseline functions, unchanged inner theme and Contact implementation, local/deferred URL resolution under a simulated project base, and media identity in source/output. Exercise actual controller scripts in a bounded Node DOM/event double: menu dismissal/focus order, manual stop/menu/tab/policy combinations, asynchronous playback races, orientation and failures; exercise Contact validation/context/preview/Edit/Clear. These checks prove controller logic only, not browser layout, video decoding, native details interaction or accessibility.

Source-based dimensional budgets for standard phones and compact menu will be reported as estimates. All rendered viewports, moving-frame contrast/crop, loop joins, no-JS browser behavior, browser history, real focus, physical devices and assistive technology remain coordinator checks. No browser, network, server, extra agent/model, generation, dependency, Git operation or outside write is authorized. Save actual results in evidence/self-review.md and preview commands/limits in README.md.
