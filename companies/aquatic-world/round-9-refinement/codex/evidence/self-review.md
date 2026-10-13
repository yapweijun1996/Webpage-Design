# Fusion Home v2 self-review

## Implemented result

Home's complete fixed header uses opaque #041D25 by default, covering safe-area padding and the live flex/grid row rather than a fixed-height mask. The original arrival wash applies only at explicitly initialized scroll zero with Menu closed. Any positive scroll is protected, including exactly 24px. Open Menu remains opaque, keeps the existing five rows and internal scrolling, and closing at a scrolled position retains protection. No transparency transition was added.

Initial controller execution and pageshow update header state. Pageshow closes a cached menu and rechecks scroll state on the next animation frame; subsequent restoration scroll events also update the surface. Scrolling changes only a dataset attribute, without geometry, focus, movie calls or timeline writes. The default opaque surface also protects no-JS reading.

The short-landscape rule applies only at width <=899px, height <=500px and aspect ratio >=6/5. It uses a 60px minimum header, 18–20px wordmark, a 16px gap after the measured live row, naturally wrapping 32–38px heading, 16px body and CTA at 1.5 line-height, and 48px minimum CTA. The optional scroll hint is omitted. Bottom padding is 24px plus the reported bottom safe area. These are flow/spacing rules, not absolute element coordinates or measured acceptance results. Enlarged copy can grow vertically; no clipping, transform scaling or document overflow suppression was introduced.

The heading's added whitespace makes the original line break optional on short landscape. Portrait and desktop retain that line break. Existing aspect-only selection, matching poster/film paths, cover crops, near-square behavior, lower chapters and footer remain unchanged. Menu geometry now also supplies the live row bottom to the short-landscape offer.

## Checks actually run

| Check | Result and scope |
| --- | --- |
| `python3 -B demo/build.py` | Exit 0; eight independent pages and 404 produced in demo/public. |
| `node --check demo/home-motion.js` | Exit 0; JavaScript syntax only. |
| `node --check demo/script.js` | Exit 0; unchanged inner/controller syntax only. |
| `python3 -B evidence/check-source.py` | Exit 0; nine route outputs, 304 resolved local references/anchors, exact offer markup, category-context enquiry URLs and four Contact groups. |
| Inner pages/404 | All eight non-Home outputs byte-identical to own baseline's in-memory renderer; baseline build was not executed or written. Shared styles, Contact script and other original source/assets unchanged. |
| Media identity | All four films/posters byte-identical across input/media, baseline, demo source and built assets; SHA-256 recorded in source-check-results.json. |
| `node evidence/check-home-controller.cjs` | Exit 0; ten controller scenarios passed in Node VM mocks. Covers initial/restored header state, exact 24px/top return, scroll isolation, growing-row geometry, menu suspension/resumption, manual Pause persistence, Escape/outside/focus dismissal, motion/data-saving opt-in, hidden tabs and failed-film poster fallback. |
| Source diff | Only build.py, home-motion.css and home-motion.js changed from original baseline source; build.py differs only by whitespace in the Home heading. |

The mock does not implement native layout, disclosure toggle scheduling, media decoding, asynchronous autoplay promises, browser history or actual keyboard traversal. Its results establish controller logic under the stated inputs, not browser acceptance.

## Acceptance still requiring independent rendered review

| Acceptance | Available evidence / remaining gap |
| --- | --- |
| H1–H3 | Home-only surface rules and original arrival/menu geometry preserved in source. Actual glyph masking through each heading, bright/dark/playing frames, stable row positions and appearance still untested. |
| H4 | Initial scroll and pageshow/restoration logic exercised in mocks; real reload/Back/Forward and frame timing still untested. |
| L1 | Compact flow implemented for 844×390 and 667×375. Actual CTA rectangles, >=16px visible safe-area clearance, focus ring separation and text/target dimensions must be measured in browser. No calculated or simulated rectangles are presented as rendered measurements. |
| P1 / R1 / R2 | Rules remain unchanged outside the targeted short-landscape range. Portrait, breakpoint 1119/1120, desktop and near-square rendered regressions still untested. |
| A1 / A2 | Existing wrap/internal menu scroll rules retained and live geometry tested in mocks. Native 200% text, text-ink overflow, real Tab order, accessibility technology and short enlarged menus still untested. |
| M1 / M2 | Policy and intent checked in mocks; exact film bytes and absent initial src/autoplay checked statically. Real playback, native Save-Data/reduced-motion/autoplay policy and no-JS browser behavior still untested. |
| J1 | Routes, anchors, category URLs and complete unchanged inner output checked. Actual click journey, form preview/Edit/Clear, refresh and history still untested. |

All six frozen JPEG references and both posters were read with the image reader. They establish baseline evidence, not screenshots of this implementation. No new rendered captures, visual score, human acceptance or published result is claimed. Physical iOS/Android, assistive technology and moving-frame contrast remain unverified.

## Scope and limits

No sibling source, evaluator scripts, extra model/agent, network, MCP retrieval, media generation/editing, added dependency, credential/configuration change, server, browser automation, Git, upload or publication was used. Writes stay in demo/, evidence/ and workspace README.md. The missing routed investigation/verification modules were reported; the supplied core and acceptance governed checks. Coordinator owns the real-browser acceptance matrix and publication.
