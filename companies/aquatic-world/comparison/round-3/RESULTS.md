# Multi-page Comparison Results — Round 3

Completed independent verification on 2026-10-11. Both native deliveries implement eight distinct pages plus a real HTTP 404 and pass the exercised structural and interaction gates. **User design acceptance is pending**; the company remains `building` while design review is open.

The evaluator prefers **Claude's delivered design** for its compact header, differentiated inner pages and more useful enquiry preparation. Codex offers a simpler, balanced collection index and consistent editorial styling. Neither design is perfect. This is a non-blind judgment of these artifacts and CLI environments, not a general model ranking.

Open the [comparison viewer](http://127.0.0.1:4170/comparison/round-3/preview.html), [Codex site](http://127.0.0.1:4191/) or [Claude site](http://127.0.0.1:4192/). These are local previews; restart commands are in the [company README](../../README.md). The screenshot viewer exists at [preview.html](preview.html).

## Conditions and original deliveries

Both builders received the same 59 frozen files, nine source images, skill snapshot and prompt. They began in fresh independent folders without old implementation code. The [protocol](README.md) and [input manifest](input-manifest.json) record the boundary. Each had one autonomous primary run with its own self-review; neither received evaluator coaching.

Native processes finished with exit 0. Deliveries were captured before evaluator serving/testing: [Codex, 74 files](deliveries/codex.json); [Claude, 158 files](deliveries/claude.json). Both remain unchanged. No evaluator implementation repair or extra native run was needed. The visual weaknesses below remain visible in the preserved comparison.

| Condition | Codex | Claude |
| --- | --- | --- |
| Selected / exposed model | `gpt-6.1-sol` / matching turn context | `claude-opus-5-5` / matching init, assistant and usage records |
| Launch CLI | 0.160.0 | 2.1.289 |
| Exposed effort | `xhigh` | Unknown |
| Native wall time | 28m 10s | 44m 09s |
| Worker browser review | Socket/Chrome launch denied; file access rejected; browser checks honestly not run | Headless Chrome, 39 self-checks and 63 delivered screenshots |
| Evaluator browser | Headed Google Chrome 154.0.8037.99 | Same browser/session and viewports |
| Default build | Python standard library; no install | Node.js; no npm dependencies or install |

Codex recovered five recorded connection errors within its original process. Installed CLI inspection later reported 0.162.1, while launch-session metadata identifies 0.160.0; the process was not restarted and the reason for the version change is unknown. Claude could review screenshots and self-repaired observed header, crop, spacing and form details. Codex's missing browser review was completed independently by the evaluator. The contribution of this tooling difference cannot be isolated.

No additional advisory-model calls were observed. Effort, global tools and effective permissions were not normalized. [Environment](output/environment.json) and [native summary](output/native-run-summary.json) retain the exposed metadata. Claude reported a **$7.4050 list-price estimate**; actual account billing is unknown. Codex cost was not exposed. Different native token/cache schemas do not establish comparable cost or efficiency.

## Independent verification

| Check | Codex | Claude |
| --- | --- | --- |
| All-route layout matrix | 64 views pass | 64 views pass |
| Global links, direct/reload and current context | 96 assertions pass | 99 pass, including three footer Back to top utilities |
| Main journey, prefill, hierarchy, history/new tab and 404 recovery | 22 pass | 22 pass |
| Skip/menu, no-JS, validation/preview/edit, long input, reduced motion and no outbound requests | 19 pass | 19 pass |
| Contact keyboard traversal and error-summary recovery | 83 observations/assertions pass | 84 pass |
| Served URLs compared with delivery bytes | 32 pass | 44 pass |
| Fresh disposable build compared with delivery | 31 files match | 42 files match |
| Frozen source image provenance | All nine originals | All nine originals |

The matrix covers every route at 1440×900, 390×844 and 768×1024, plus width checks at 320, 360, 430, 1024 and 1920. No document horizontal overflow, broken rendered image, blocking page error or missing initial anchor was found. Each implementation has 48 evaluator first-screen/full-page captures. Visual review inspected all eight desktop/phone pages, actual-size core first screens and menus, plus intermediate-width layouts.

Direct URLs were checked against distinct titles/H1 and navigation context, not just HTTP status. Actual clicks exercised page transitions and native modifier-click new tabs. Each category prefills its enquiry option. Blank/invalid fields produce errors and summary links focus the relevant control; valid desktop/phone previews say nothing was sent. Long unbroken input wraps. No submission or external request occurred during exercised interactions. Keyboard checks use real Tab/Enter/Escape, focus styling, viewport visibility and hit testing; they are not a full accessibility audit.

Evidence: Codex [layouts](output/playwright/codex/layout-checks.json), [navigation](output/playwright/codex/navigation-checks.json), [journeys](output/playwright/codex/journeys-checks.json), [interactions](output/playwright/codex/interactions-checks.json), [focus](output/playwright/codex/focus-checks.json); Claude [layouts](output/playwright/claude/layout-checks.json), [navigation](output/playwright/claude/navigation-checks.json), [journeys](output/playwright/claude/journeys-checks.json), [interactions](output/playwright/claude/interactions-checks.json), [focus](output/playwright/claude/focus-checks.json). Supporting records: [fresh builds](output/fresh-build-checks.json), [Codex HTTP](output/codex-http-checks.json), [Claude HTTP](output/claude-http-checks.json), [provenance](output/asset-provenance-checks.json).

Manual content/source review found illustrative-brand disclosures, proposed quality principles, an honestly captioned waterfront and local-only form feedback. Neither invents verified inventory, prices, dates, certifications or contact details. These are fictional design demos, not researched real-company profiles.

## Design assessment

Ratings use the predeclared 0–5 scale; points are `rating / 5 × weight`. [RESULTS.json](RESULTS.json) records the structured ratings. Old landing-page scores used different weights and are not numerical baselines here.

| Criterion | Weight | Codex rating / points | Claude rating / points | Reason |
| --- | ---: | ---: | ---: | --- |
| Information architecture/usefulness | 25 | 4.2 / 21.0 | 4.5 / 22.5 | Both provide useful real pages. Claude adds comparisons, diagrams and specific sourcing/observation/packing questions; Codex is more abstract. |
| Header craft | 10 | 4.2 / 8.4 | 4.6 / 9.2 | Both have solid backgrounds and coherent current states. Claude's measured 77px desktop / 65px phone bar is more compact; Codex's 97px / 85px brand/tagline area occupies more space. |
| Composition/type/rhythm | 15 | 3.9 / 11.7 | 4.4 / 13.2 | Codex's equal three-card index scans quickly, but split layouts, ruled lists and italic headings recur. Claude varies story, process, category and form compositions more deliberately. |
| Imagery/detail/reference continuity | 10 | 3.8 / 7.6 | 4.5 / 9.0 | Both preserve teal/cream/gold and the fixed photographs. Claude separates intermediate/phone hero image and copy; Codex's 768px heading overlaps the fish subject. |
| Responsive/accessibility | 20 | 4.3 / 17.2 | 4.3 / 17.2 | Exercised layouts, keyboard, forms, no-JS and motion pass. Both phone forms follow long introductions. Claude uses a scrolling no-JS nav row on narrow phones. Full compliance is unverified. |
| Interaction completeness | 15 | 4.7 / 14.1 | 4.7 / 14.1 | Navigation, history, prefill and honest recovery/preview work. Neither has proven end-user usability or a connected enquiry service. |
| Reproducibility/ownership | 5 | 5.0 / 5.0 | 5.0 / 5.0 | Fresh builds match, assets stay local, runtimes and code remain independent. |
| **Total** | **100** | **85.0** | **90.2** | Evaluator judgment; user acceptance pending. |

Concrete strengths and remaining weaknesses:

- **Header:** Claude retains desktop links at 1024px, compact below 1000px; Codex switches below 1120px. Both fit. Claude explicitly labels the current phone-menu page; Codex uses a serif list in a flowing disclosure. [Codex menu](output/playwright/codex/menu-mobile.png), [Claude menu](output/playwright/claude/menu-mobile.png). Sticky versus static is a trade-off, not itself a defect.
- **Collections:** [Codex's equal-weight grid](output/playwright/codex/collections-desktop-full.png) exposes all three families quickly. [Claude's featured fish layout](output/playwright/claude/collections-desktop-full.png) adds a comparison section and quick real-page category links, but requires more scrolling.
- **Tablet hero:** [Codex at 768px](output/playwright/codex/home-tablet-first.png) places “A closer connection” across the fish face/upper body. Its over-image layout persists at that width, conflicting with the brief's intended subject separation. Stack earlier or narrow the copy in a future revision. [Claude at 768px](output/playwright/claude/home-tablet-first.png) separates photo and text at the cost of a taller introduction.
- **Domain-specific depth:** Claude's [plant layers](output/playwright/claude/plants-desktop-full.png), [wood composition](output/playwright/claude/driftwood-desktop-full.png) and [quality process](output/playwright/claude/quality-desktop-full.png) explain more than Codex's mainly text-led planning pages. Codex's restraint and shorter pages may suit quick browsing.
- **Enquiry friction:** Both [Codex](output/playwright/codex/contact-mobile-full.png) and [Claude](output/playwright/claude/contact-mobile-full.png) put substantial explanation before the phone form. Move it ahead of secondary help in a future revision. Codex's long default category wording is cramped in its closed phone select; a shorter label would help. Claude supports multiple collections and organisation/role/timing context, with more fields to complete.

These issues affect design ratings and remain visible in native deliveries. Functional passes do not imply that either meets the user's “impressive” threshold.

## Evaluator corrections

Rejected original reports are retained; only evaluator methods changed. Affected checks were rerun. Final journey, interaction and focus methods were exercised for both implementations.

1. [Capture](output/capture-method-correction.json): smooth scrolling left initial Codex first screens below the top. Instant scrolling and `scrollY === 0` checks replaced them before scoring.
2. [Navigation](output/navigation-method-correction.json): intentional Claude footer Back to top links were misclassified. Only that labelled utility with an existing target is allowed; global links still require real pages.
3. [Journey](output/journeys-method-correction.json): prefill was read before deferred script completion. Ten normal clicks worked; a controlled one-second script delay reproduced unchecked-at-interactive / checked-at-complete. Checks now await load before the unchanged category assertion.
4. [Interaction](output/interactions-method-correction.json): shared checkbox errors are described on a semantic fieldset. Chrome exposes the group error; individual and group association are both checked. [W3C grouping](https://www.w3.org/WAI/WCAG22/Techniques/html/H71) and [description guidance](https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA1) were consulted on 2026-10-11; screen-reader behavior remains untested.
5. [Focus](output/focus-method-correction.json): geometry alone misclassified a high-layer skip link as behind a sticky bar. Actual hit testing reaches the skip link; keyboard and visibility assertions remain.

The [viewer checks](output/viewer-checks.json) pass 48 page/viewport/extent combinations plus desktop/phone layout and shareable-selection checks.

Final [preservation checks](output/preservation-checks.json) confirm all three input baselines and six original deliveries. [Preview health](output/preview-health-checks.json) confirms all seven local ports and unchanged historical site bytes. [Documentation checks](output/document-link-checks.json) confirm current catalog/report targets exist. The [skill update validation](output/skill-update-validation.json) covers its metadata; it does not prove design quality.

## Limits and acceptance

Verified in one macOS Chrome environment. Safari/WebKit, Firefox, physical devices, screen readers, axe/Lighthouse, 200% zoom, Windows High Contrast, Core Web Vitals and deployment were not run. Other-OS system-font rendering is unverified. Evaluator default fresh builds use delivered local derivatives; optional image regeneration was not rerun.

Structural and exercised interaction completion: **pass**. Evaluator preference: **Claude**, with the trade-offs above. User design acceptance: **pending explicit feedback**. The new contract resolves the earlier single-page mismatch; one changed-scope comparison with unequal native tools cannot prove the skill alone caused better design.
