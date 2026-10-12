# Fusion Home — Worker Self-Review (Claude workspace)

2026-10-12 · `claude-opus-5-5` through Claude Code CLI 2.1.289, tools Read/Edit/Write/Bash, no MCP, no browser. Plan: [design-plan.md](design-plan.md). Raw command output: [check-output.txt](check-output.txt).

**Scope of this evidence.** Everything below is about source and build output, plus a stubbed controller run in a Node VM. No page was rendered, so this file contains no visual, layout, contrast, playback or assistive-technology result. Rendered acceptance belongs to the coordinator.

## What changed

| File | Change |
| --- | --- |
| `demo/src/site.css` | Home section only (lines before and after the Home block are byte-identical to the baseline). Desktop: 32px wordmark, 16px regular links, 72px-capped heading at −0.03em, 12px regular eyebrow, 18px description at 21em, 56px CTA, ≤540px copy column, 40/120 arrival padding. Phone: 18px wordmark (17px below 360px with 16px insets), fixed 98×44 outlined Menu control with a sentence-case label, ≈39.5px heading at 390, 11px eyebrow, 16px description, 52px/17px CTA with a 24px label–arrow gap (wraps only under enlargement), copy inset equal to the header inset. Compact Home switch below 1120px: a top-anchored opaque disclosure, five 56px min-height rows, gold marker, no "Current page" text, internal scrolling capped at the visible height. The inherited body scroll lock is removed on Home. |
| `demo/src/layout.mjs` | The Home header carries `data-compact-query="(max-width: 1119.98px)"`. Inner-page markup is unchanged. |
| `demo/src/site.js` | One line: the compact query comes from that attribute, with the inner pages' 1100px default as fallback. All other controller code is unchanged. |
| `demo/scripts/check-motion.mjs`, `check-motion-logic.mjs` | Added fusion contracts and menu scenarios (below). |
| `demo/dist/` | Rebuilt with the existing `scripts/build.mjs`. |

Not changed: media, images, content/copy, page renderers, the inner-page CSS/header (still 1100px with its enquiry button), Contact logic, `package.json` (no dependencies), `input/`, `baseline/` and the root contracts.

## What actually ran

| Command / check | Result |
| --- | --- |
| Baseline before editing: build, `check-motion.mjs`, `check-motion-logic.mjs` | 98/98, 40/40 |
| `node scripts/build.mjs` (root base) | 8 routes + 404 built |
| `node scripts/check-motion.mjs` | **126/126**: media SHA-256/size/MP4 boxes, crops/orientation/near-square rules, exact copy, one gold CTA, real destinations, routes/404, category context, Contact four groups/preview/Edit/Clear/no-send, link resolution, plus 28 new fusion checks: compact query wiring; no `role="dialog"`/`aria-modal`/`inert` in any page; no focus-trap code; absolute top-anchored panel (not fixed or centred); opaque panel with dvh/vh height cap and internal scrolling; no Home scroll lock; typography/CTA/inset values; layout model |
| `node scripts/check-motion-logic.mjs` | **68/68**: the 40 baseline film-controller scenarios plus 28 new disclosure scenarios — Menu/Close label and `aria-expanded`; link click inside the header stays open; focus within the header stays open; focus leaving the header closes without moving focus; outside click closes; Escape closes and returns focus; Home uses the 1120 query and the inner pages keep 1100; inner-page menu works without the film; open suspends and close resumes eligible motion; manual Pause, reduced motion, Save-Data, blocked autoplay and film error each survive open/close with no film download or retry; an orientation change while open attaches the portrait film only after closing |
| Mutation sanity | Removing Escape focus return in `dist/assets/site.js` → 2 logic FAILs. A `position: fixed` panel plus a restored scroll lock in `dist/assets/site.css` → 3 static FAILs. Rebuilt clean afterwards (126/126, 68/68). |
| `node scripts/build.mjs --base=/aw-fusion/` + Node link walk | Every root-relative `href`/`src`/`srcset`/film data URL carries the base and resolves in `dist`; rebuilt at `/` afterwards |
| Baseline render comparison (Node import of `baseline/demo/src`, in memory) | 8/8 non-Home documents byte-identical to the new build |
| `cmp` of the four media files | input = demo source = dist = baseline |

### Layout model (arithmetic, not measurement)

Computed in `check-motion.mjs` from the CSS values, assuming two heading lines (the `<br>`) and two description lines:

- **390×844:** heading ≈39.5px, top ≈513 (brief 505–515); CTA 692–744 (brief top 685–700); eyebrow ≈481; the open bar and panel end at **369px** (brief 360–380).
- **360×800 and 320×800:** CTA 648–700, fully inside the viewport, with the panel above the eyebrow (≈438).
- **1440×900:** heading top ≈312 (brief 305–320); CTA top ≈570 (brief ≈565).

Approximate Georgia capital widths give a wordmark of about 330px at 1120px, about 181px at 390px and about 166px at 320px, each fitting beside the links or the 98px control. These are estimates from rough glyph advances, not font metrics. Real line breaks and glyph widths can differ by platform font.

## Not run (coordinator / CUA)

- Every rendered viewport from REVIEW.md: 1440×900 … 500×500, including the 1119/1120 transition fit, the open menu at 390×844, narrow landscape and 200% text.
- Actual `getBoundingClientRect` values, topmost hit targets, horizontal overflow and the visible focus ring under the sticky bar.
- Real Tab/Shift+Tab order, Escape, outside tap, and scroll position kept on open and close.
- Contrast over bright and dark moving frames; real playback, loop joins, autoplay policy, Save-Data and reduced-motion delivery, network requests, bfcache.
- Physical devices and screen readers.
- `scripts/verify.mjs` and `scripts/shots.mjs` drive Chrome over CDP, so they were **not run** (not authorized). `verify.mjs` is also stale for the immersive Home, as its header comment says.

## Judgement notes and known limits

- **Raster drift not copied:** I used 56px rows and a 369px panel edge rather than the concept's ≈46px pitch and ≈327px edge. The arrival copy does not move when the menu opens, because the panel is absolutely positioned inside the sticky header.
- **Short phones such as 375×667:** the arrival copy sits higher (heading top ≈333 by the same model), so the open panel temporarily covers the eyebrow and heading. This coverage is allowed by the brief and goes away on close.
- **Shared controller:** `site.js` serves every page, so inner pages get the same nonmodal close paths. Their 1100px switch and CSS scroll lock stay as in the baseline (inner-page presentation is out of scope).
- **No-JS 1100–1119px:** Home shows the full link row with the compact 18px wordmark. This is functional, but not visually checked.
- **CTA arrow:** it keeps the baseline's 3px hover nudge inside the button; the target size never changes.
