# Self-review — Fusion Home v2 refinement (Claude)

2026-10-13. This is the worker's own source review. I had no browser, so nothing here is rendered
verification: every result is either a source/output assertion, an arithmetic model calibrated against
the reviewed baseline, or a Node vm simulation with stubbed DOM. The coordinator's CUA review decides
acceptance.

## What changed (Home only, plus one shared selector)

| Area | Change | Files |
| --- | --- | --- |
| Scrolled state | Moved from the deferred `site.js` (`header.is-scrolled` at >4px) to the inline `<head>` script that already swapped `no-js`→`js`: `html.is-scrolled`, on past 4px, off below 1px. Listener exists before the body is parsed. | `src/layout.mjs`, `src/site.js` |
| Home header surface | `::before` layer, `inset: 0`, `z-index: -1` inside the sticky header, solid `#041D25`. Opacity 1 when scrolled, when the menu is open, and always without JS. Protection is instant (`transition: none`). Only the return to the arrival state fades (160 ms). The wash stays underneath; the translucent `rgba(…, 0.8)` scrolled background is removed. | `src/site.css` |
| Feather | 24px gradient (0.9 → 0) starting at `top: 100%`, below the row; shown when scrolled or no-JS, hidden while open. | `src/site.css` |
| Open menu | Header and panel `#0A3541` → `#041D25`. Rows, extent, separators, marker, icon and behaviour are unchanged. | `src/site.css` |
| bfcache | `pageshow` with `persisted` closes a menu that was left open by following one of its links. | `src/site.js` |
| Short landscape | Geometry unchanged; bottom padding gains `+ env(safe-area-inset-bottom, 0px)`. | `src/site.css` |
| Inner pages | Shadow selector `.site-header.is-scrolled` → `.is-scrolled .site-header`. The visual result is the same; the hysteresis is negligibly different (shadow clears below 1px instead of at ≤4px). | `src/site.css` |

Media, package.json, assets, routes, copy, content and page markup are byte-identical to the baseline
apart from the head script. I confirmed this with `diff -rq baseline/demo/assets demo/assets` and a
source diff.

## Acceptance IDs: what I could and could not establish

| ID | Worker evidence | Open for rendered review |
| --- | --- | --- |
| H1 | At the top with the menu closed the layer is at opacity 0, so the round-8 wash and composition are unchanged. The portrait (390×844) and desktop (1440×900) models are unchanged and still pass. | Visual check at both sizes, plus horizontal overflow. |
| H2 | The layer covers the header's full live box (no fixed height) with an opaque colour. Protection is instant from 5px, well before 24px. The header itself is not resized. | **Primary gap.** Move each heading through the row on a bright frame, a dark frame and playing video. I could not observe glyph masking. |
| H3 | Same layer in the open state; panel `#041D25`. While scrolled, closing keeps `is-scrolled` and so keeps the opaque layer. The class change is opacity-only, so positions are unchanged. | Open/close at the top, mid-page and footer. |
| H4 | vm: a restore scroll event after the script runs protects at once, and a position that is already scrolled is protected at init. A bfcache return closes the menu. Returning to 0 clears the class. | Real reload/history timing in Chromium/WebKit. I reasoned about the claim that no unprotected frame is painted, but did not observe it. |
| L1 | Model: 844×390 gives a 38.8px heading, a 17px lead on 2 lines and the CTA at 281–329, leaving **61px** below it. 667×375 gives 32px, 2 lines and the CTA at 266–314, also **61px** below. CTA text is 16px, its height 48px and Menu 44px. The CTA and motion utility do not overlap (CTA right edge ≈355 vs utility left edge 781 at 844px). Calibrated to the reviewed y328.78. | Actual rects after fonts settle. Wrapping depends on Georgia/Arial being available (Android substitutes metric-compatible faces). |
| P1 | Unchanged source; the models for 390, 360 and 320 still pass (CTA 692–744 at 390×844). | Rendered confirmation. |
| R1/R2 | Compact switch, aspect query, crops and near-square rule are unchanged, and the static assertions still pass. | Rendered at 1119, 1120, 1280, 1440, 768, 900 and 500. |
| A1 | The layer follows wrapped rows because it is `inset: 0` on an auto-height header. The panel cap is unchanged (`100dvh - 100%`). | 200% text at 390×844 and 320×375. |
| A2 | vm: all existing disclosure paths still pass: Escape returns focus, focus exit, outside close, no trap or lock. | Keyboard and focus visibility in a browser. |
| M1 | vm: open/close suspends and resumes, manual Pause survives, and the bfcache close keeps Pause. Scrolling no longer reaches `site.js` at all. | Actual playback, and that the film is not requested again. |
| M2 | Reduced-motion/Save-Data policy is unchanged (vm). Without JS the header is always protected. | Real reduced-motion and no-JS rendering. |
| J1 | Routes, Contact groups, preview/Edit/Clear and category context still pass. Inner pages carry no Home film or Home header rules. | Full journey, Back/Forward and refresh. |

## Check results (saved outputs)

- `node scripts/build.mjs` → 9 pages (`evidence/build-output.txt`).
- `node scripts/check-motion.mjs` → **138/138** (`evidence/check-static-output.txt`). The baseline
  passed 126/126. Two round-8 assertions encoded the old `--ocean-900` surface and were replaced by the
  v2 contract. The rest are new: the v2 header contract and the L1 models.
- `node scripts/check-motion-logic.mjs` → **79/79** (`evidence/check-logic-output.txt`). The baseline
  passed 68/68. 11 cases are new: the bfcache menu close and the head-script hysteresis/restore cases.
- I also built with the base `/Webpage-Design/aquatic-world/claude/`: 0 unprefixed root references.
  I then rebuilt with the default base.
- I did **not** run `verify.mjs` or `shots.mjs`, because they drive Chrome over CDP, which this run
  forbids. `verify.mjs` was already stale for the immersive Home.

## Risks and judgment calls

- **Instant protection, faded release.** Going opaque at 5px is a hard step. A fade could leave
  lettering half-visible under the row on a fast flick in short landscape, where the eyebrow sits
  about 20px below the bar. The arrival wash is already 60% dark at the top edge, so the step is
  moderate. The coordinator should judge whether it reads as abrupt.
- **No-JS has no transparent arrival.** This is the fallback the brief allows.
- **Feather** darkens about 24px of content just below the row while scrolled. It is optional per the
  brief and easy to remove if the reviewer prefers a hard edge.
- **Safe area.** The viewport meta has no `viewport-fit=cover`, so `env(safe-area-inset-bottom)` is
  normally 0. Browser toolbars on real phones can reduce the visible height below the CSS test
  viewport. I did not exercise that on a device.
- **Landscape left as is.** My round-8 short landscape already met every L1 number, and the reviewer
  preferred it. Following the brief's "do not redesign successful compositions", I did not shrink the
  64px bar to 56px.
