# Stage 2 — Self-review

Date: 2026-10-13. Worker implementation/checks complete; rendered acceptance pending coordinator.

## Confirmed defect and correction

The supplied native `reference.jpg` visibly clips the start of Resume background. The coordinator reported opacity 1, tooltip x=-17.92..242 and text x=-7.92..232 at 320×375 after manual Pause and focus under 200% computed text scaling. This agrees with this candidate's previously unbounded, nowrap label placed 60px left of its fixed control.

Only `.home-motion-explanation` changed in `demo/home-motion.css`. It retains 13px normal font size, all full action strings, padding, colors, right separation and hover/focus visibility. Its intrinsic width is capped by `100vw - 108px - safe-area-inset-right`, with normal word wrapping and emergency word wrapping. Existing border-box sizing remains intact. No truncation, text shrinking, height cap or overflow hiding was added.

`bottom:0` plus `translateY(min(0px,calc(50% - 24px)))` preserves the normal centered position: for a label shorter than 48px, its center is still the button center. A taller label has zero translation and grows upward from the button bottom. This avoids the old center anchoring pushing enlarged multiline content below the viewport. The fixed button stays 48×48px; focus remains the existing 2px gold outline with 6px offset.

## Passed available checks

- `python3 -B demo/build.py`: eight independent content pages plus 404 built successfully.
- `python3 -B evidence/stage-2/check-regressions.py`: JavaScript syntax, existing static preservation checks, all ten existing Node controller scenarios and an additional full-label agreement scenario passed. The added scenario compares visible text, aria-label and title for Pause, manual Resume, Resume after menu suspension, subsequent Pause, reduced-motion Play and data-saving Play. These are mocks, not browser playback.
- Static output: nine HTML files, 304 local references, all seven inner pages plus 404 byte identical to baseline output; category context and Contact fields/controls preserved. Both MP4s and both posters byte identical to supplied, baseline, source and built copies.
- Source/algebra: only the tooltip rule differs from stage 1; built stylesheet matches source; wrapping/visibility/focus/48px target rules retained; twelve width-constraint and four vertical-position cases passed. At width 320 with zero safe inset, the maximum label border-box width is 212px, right edge 242px and left edge 30px. These are authored constraint calculations, not measured browser/text rectangles. At 320×375 the assumed 95.2px two-line height would extend upward from y357 to y261.8. Actual wrapping and glyph fit are unverified.
- Hash comparison: only README, source Home CSS and generated Home CSS changed among worker-owned pre-existing files. Home HTML, all controllers, other styles, media, inputs, baseline, root contracts and original stage-1 evidence remain byte identical.

The first blanket hash assertion also detected two live coordinator CLI capture logs (`cli-events.jsonl`, `cli-stderr.log`) changing during the run. It was rerun with those two explicitly classified as externally maintained live logs; no historical evidence was excluded. See `scope-check-results.json`. No worker command edited those logs.

## Remaining acceptance

No browser/server/device automation was run, as required. This worker cannot claim rendered fit, actual hover/focus accessibility, no text-ink overflow or moving-media behavior. Coordinator must test all three full labels at fixed 320×375 with each HTML element's pre-captured computed font size and numeric line height doubled exactly once. In particular: manually Pause, then keyboard-focus the button and inspect the visible Resume label. Test hover separately, capture label and text rectangles, inspect glyphs and focus ring, and check bottom containment/document overflow. Normal portrait/desktop labels and preserved v2 header/menu, short-landscape and Contact states also remain coordinator browser checks.

No new global skill or memory was written: this narrowly scoped CSS correction has no independent rendered verification. The missing routed instruction-module files were handled using the supplied core contracts and local evidence.
