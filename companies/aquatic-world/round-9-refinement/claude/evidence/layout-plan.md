# Layout plan — Fusion Home v2 refinement (Claude)

Written 2026-10-13 before any source edit. Starting point: this workspace's own round-8 source
(`demo/` was byte-identical to `baseline/demo/`; baseline build passed 126/126 static and 68/68 simulated
logic checks). Inputs read: AGENTS.md, TASK.md, BRIEF.md, ACCEPTANCE.md, references/README.md, the design
skill and design-review.md; all six reference JPEGs and both posters viewed as images.

## Diagnosis from my own source

| Defect / requirement | Cause in round-8 source |
| --- | --- |
| Perspective heading visible behind the closed, scrolled header (`claude-footer.jpg`) | `.page-home .site-header.is-scrolled` uses `rgba(4, 29, 37, 0.8)` over the 0.6→0 wash: about 20% of body glyphs still show through. |
| Open menu lighter blue (`claude-menu.jpg`) | Header and panel use `--ocean-900` (#0A3541), not abyss teal. |
| Restored scroll could paint before protection | `is-scrolled` is set by the deferred `site.js`; a reload/history restore can paint before it runs, and the 200 ms background fade would show text during the transition. |
| bfcache Back after a menu link | The menu stays open: a header-link click is "inside" and does not close, and nothing closes it on `pageshow`. |
| No-JS scrolled header | Never gets `is-scrolled`, so stays translucent. |

Short landscape, from the CSS (model calibrated against the reference measurement of y328.78 at 844×390):

| Viewport | Bar | Copy top | Heading | Lead | CTA rect | Clearance |
| --- | --- | --- | --- | --- | --- | --- |
| 844×390 | 64 | 84 | 38.8px, 2 lines | 17px, 2 lines | 281–329 | ≈61px |
| 667×375 | 64 | 84 | 32px, 2 lines | 17px, 2 lines (Arial widths: line 1 ≈251px of a 293px column) | 266–314 | ≈61px |

My round-8 landscape already satisfies L1 (≥16px clearance, heading 30–40px, body/CTA ≥16px, CTA 48px,
Menu 44px, scroll hint omitted below 560px height, left copy / right fish). The brief says not to
redesign successful compositions, so landscape gets only a safe-area-aware bottom padding term; the
geometry stays.

## Header surface design

One opaque layer, not a background swap: `.page-home .site-header::before` (absolute, `inset: 0`,
`z-index: -1` inside the sticky header's own stacking context, `background: #041D25`). Its box is the
header's live border box, so it follows wrapped/enlarged brand rows and any padding automatically. The
existing shallow wash stays underneath on the header itself.

| State | `::before` | Feather `::after` (below the row only) |
| --- | --- | --- |
| Top, closed | opacity 0 (arrival wash visible) | hidden |
| Scrolled, closed (`html.is-scrolled`) | opacity 1, no transition (instant, so it is complete well before 24px) | visible, 24px, opaque teal → transparent |
| Menu open (any scroll) | opacity 1, instant | hidden; the panel is solid #041D25 too |
| Back to top / close at top | fades to 0 over 160 ms (only this direction animates) | fades out |
| No JS | opacity 1 always (acceptable readable fallback) | visible |

Scroll state moves into the existing inline `<head>` script (the one that swaps `no-js` → `js`), on
`<html>`, with hysteresis: on past 4px, off only below 1px. Because the listener is registered before
the body is parsed, a reload/history scroll restore sets the class in the same frame as the restored
scroll; the protected direction has no transition, so there is no partially transparent frame. The class
only switches opacity of pseudo-elements: no layout, focus, film or Pause effects. Inner pages keep their
existing shadow via the same class (`.is-scrolled .site-header`); `site.js` drops its own scroll handler.

Menu panel: `--ocean-900` → `--abyss` (#041D25) for header and disclosure. Rows, 56px heights, panel
extent (64 + 5×56 + 24 + 1 = 369px at 390×844), separators, current marker, icon placement, internal
scrolling and nonmodal behaviour are unchanged. `site.js` additionally closes an open menu on a bfcache
`pageshow` (Back after choosing a menu link returns closed; manual Pause is re-read as before).

## Preserved (explicitly not touched)

Exact copy and routes; portrait 390/360/320 composition; desktop 1440/1280 composition and 1120px compact
switch; `(min-aspect-ratio: 6/5)` film/poster selection at every width; landscape 50% 50% / portrait
50% 30% cover; near-square rule; media bytes; film controller policy (reduced motion, data saving,
explicit opt-in, hidden tab, menu suspension, session Pause); footer; inner-page presentation; Contact.

## Checks to run (no browser available to me)

- `npm run build`, then `node scripts/check-motion.mjs` updated for the v2 header contract (opaque
  abyss layer, open/scrolled/no-JS states, head script, panel colour) and an L1 arithmetic model for
  844×390 and 667×375; existing assertions kept.
- `node scripts/check-motion-logic.mjs` plus new cases: bfcache close, head-script scroll hysteresis
  (run in a Node vm with stubs).
- Rendered H/L/P/R/A/M/J scenarios remain for the coordinator's CUA browser review.
