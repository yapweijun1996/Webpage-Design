# Common Acceptance — Fusion Home Refinement v2

Prepared 2026-10-13. These are **future acceptance requirements**, not completed verification. Apply the same checks and feedback to both candidates. Review rendered pages independently of CLI self-reports.

## Required scenarios

| ID | Scenario | Pass condition |
| --- | --- | --- |
| H1 | Home at scroll zero, normal 390×844 and 1440×900 | Water remains visible behind navigation; brand, title and CTA retain the established composition. No horizontal overflow. |
| H2 | Slowly move the hero, collection and perspective headings behind the header at 390×844 and 1440×900 | By 24px scroll, the full brand/control row masks underlying lettering. Inspect a paused bright frame and a dark frame as well as playing video. No recognizable body glyphs, flicker or layout movement within the row. |
| H3 | Open/close Menu at the top, mid-page and footer | The common deep-teal surface is opaque; open/close keeps brand/control positions, underlying content geometry and scroll position stable. Closing while scrolled retains the protected row. |
| H4 | Reload a scrolled Home; visit a destination and use Back; return to scroll zero | Restored state has the correct header treatment. Menu returns closed; restoring the top restores arrival transparency. Movie time is not controlled by scrolling. |
| L1 | Initial 844×390 and 667×375, normal text | Full offer and CTA are visible. CTA bottom is at least 16px above the visible bottom safe area, body/CTA text is at least 16px, tap targets are at least 44px and controls do not overlap. |
| P1 | Initial 390×844, 360×800 and 320×800, normal text | Full CTA fits; subject/copy separation and readable brand/Menu remain. No unnecessary redesign of successful portrait composition. |
| R1 | 1119×800, 1120×800, 1280×800 and 1440×900 | Correct navigation mode, no collisions or horizontal overflow, protected scrolled row and retained desktop composition. |
| R2 | 768×1024, 900×900 and 500×500 | Existing media/crop policy and near-square copy placement remain; ordinary vertical scrolling is allowed. |
| A1 | 200% text at 390×844 and 320×375 | Actual header height remains protected. Full brand, Menu/Close and all five destinations are reachable; short menu scrolls internally. No clipped text or horizontal document/text-ink overflow through the footer. Vertical scrolling is expected. |
| A2 | Visible Close, Escape, Tab/Shift+Tab, focus leaving header, outside dismissal | Accessible nonmodal behavior, visible focus, return focus on Escape and stable targets; no body lock or trap. |
| M1 | Playing → Menu → Close; manual Pause → Menu → Close | First flow suspends/resumes as allowed; second stays paused. Scrolling changes only the header's appearance. No new film request/restart caused by the header surface change. |
| M2 | Reduced motion initially enabled; JavaScript unavailable | Policy starts with no automatic video download; explicit opt-in remains useful. No-JS navigation works and scrolled reading stays protected. Document untested native device policies honestly. |
| J1 | Home CTA → Collections → category → Contact → local preview/Edit/Clear; Back/Forward and direct refresh | Existing independent pages and local-only feedback remain functional. Inner pages do not load Home film or inherit the new Home-only header styles. |

The exact defect alignment matters: a generic mid-page screenshot with only water behind the header is insufficient for H2. Move each large heading through the actual navigation row and capture the overlap location. CSS alpha values, document width and click tests alone cannot prove that text is visually masked.

For text enlargement use native browser text/zoom controls when supported. If using a computed-font/line-height stress test, record the method precisely, restore it afterward, and do not call it native zoom or a physical-device test. Observe layout after fonts, media orientation and visible images settle. Verify captured pixels actually show the selected state; a dropdown label or changed image URL can precede repaint.

## Comparable evidence

Capture the same views for both candidates: 390×844 arrival, normal Menu open, collection heading under the closed header, perspective heading under it, scrolled Menu open/closed, and both narrow landscape arrivals. Add desktop scrolled-heading and short enlarged-menu evidence. Record viewport, scroll position, current media source/readiness and header/CTA rectangles. Keep full-frame originals.

Use each candidate's own pre-change baseline for before/after. Align the semantic defect, not merely equal scroll offsets when content lengths differ. Independent movies are not frame-synchronized; for a controlled still use the same existing poster or matched media phase and label that method. At least one actual playback check remains required.

Keep new evidence separate from immutable round-8 output. Record the exact source commit, requested and exposed model identity, CLI/tool/effort conditions, prompt hashes and real exit status in the future comparison directory. Freeze byte-identical task/reference/media/skill inputs before the run. If one result needs another correction, issue identical bounded feedback to both.

## Decision and limits

Functional gates and visual judgment are separate. First resolve all confirmed in-scope H/L failures and relevant regressions. Then compare: readability while scrolling, harmony of the dark navigation surface with water, landscape breathing room, portrait/desktop preservation and lack of distracting transitions. Report trade-offs without claiming general model superiority.

No new source build or browser pass is claimed by this design preparation. Physical iOS/Android, assistive-technology behavior and moving-frame contrast certification remain unverified until actually exercised. Builds, screenshots and automated assertions do not equal human creative acceptance. Publication remains a separately executed and verified delivery step after a future authorized implementation.
