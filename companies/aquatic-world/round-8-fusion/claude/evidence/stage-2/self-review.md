# Stage 2 — 200% Text Header Refinement: Self-Review (Claude workspace)

2026-10-12 · `claude-opus-5-5` through the Claude Code CLI. Tools: Read, Edit, Write and Bash. No MCP, no browser, no Git and no other model or agent. Plan: [design-plan.md](design-plan.md), written before any edit.

**Scope.** This evidence covers source, build output and arithmetic only. I rendered nothing. Every geometry number below is an estimate from approximate glyph advances, not a measurement. Rendered acceptance belongs to the coordinator.

## Change

The only product source changed is `demo/src/site.css`, and only for Home. `site.js`, markup, content, media and inner-page HTML are unchanged. In the build, only `dist/assets/site.css` differs from the pre-change build (checked by hash).

| Rule | Before | After | Why |
| --- | --- | --- | --- |
| `.js .page-home .header-inner` (<1120px) | inherited fixed `height: 64px`, no wrap | `flex-wrap: wrap; row-gap: 8px; height: auto; min-height: var(--header-h); padding-block: 8px` | The bar can grow and reflow instead of overflowing. At normal text: 8 + 48 content ≥ 44 control, so the bar is still 64px and the controls stay centred at y = 10 |
| `.page-home .site-header .brand` (<1120px) | `flex: none` | `flex: 1 1 0; max-width: max-content` | The row decision uses the wordmark's min-content width (`AQUATIC`). Growth is capped at its one-line width, so at normal text the link box is the same ≈181px and Menu keeps `margin-left: auto` |
| `.page-home .site-header .brand-name` (<1120px) | `white-space: nowrap; line-height: 1` | `white-space: normal; line-height: 1.15` | Wraps only at the space between AQUATIC and WORLD. No `overflow-wrap: anywhere`/`word-break`, so it never splits inside a word. 1.15 keeps the Q tail clear of the second line |
| `.page-home .menu-toggle` | `width: 98px; height: 44px; padding: 0 0 0 15px` | `min-width: 98px; min-height: 44px; padding: 0 10px 0 15px` | Still 98×44 at normal text (content ≈95px). At 32px the label stays inside the outline instead of spilling past it |
| `.page-home .menu-text` (+ `::before`/`::after`) | text only | column inline-flex with hidden, zero-height `"Menu"`/`"Close"` pseudo-elements (empty alt text) | The label box is always as wide as the wider word, so the control keeps one size and one left edge when Menu becomes Close |
| `.js .page-home .site-menu` max-height | `calc(100dvh - var(--header-h))` (assumed 64px) | `calc(100vh - 100%)`, then `calc(100dvh - 100%)` | For an absolutely positioned box, `100%` is its containing block's height, which is the sticky header's actual height. `top: 100%` (unchanged) already starts the panel under the actual bar |

I added no font-size reduction, no text-size preference, no runtime injection, no QA stylesheet and no hiding or clipping. Desktop (≥1120px), the panel's rows, colours and dismissal, and the inner pages' 1100px header are untouched.

`demo/scripts/check-motion.mjs` had two stage-1 assertions that encoded the old values. I changed them: the fixed `width: 98px`/`height: 44px` assertion is now a 98×44 minimum with no fixed width/height, and the `--header-h` panel cap assertion is now the `100%` cap. No other check changed.

## Checks actually run

| Command | Result |
| --- | --- |
| Pre-change hashes of `demo/dist`, `demo/src`+`scripts` and the original evidence files | saved as `pre-change-dist-sha256.txt`, `pre-change-src-sha256.txt`, `original-evidence-sha256.txt` |
| `node demo/scripts/build.mjs` | 8 routes + 404 built |
| `node demo/scripts/check-motion.mjs` (its CSS inputs changed) | **126/126**, see [check-motion-output.txt](check-motion-output.txt). Covers media SHA/size, orientation and crops, copy, routes, Contact, panel anchoring/opacity, no dialog/trap/scroll lock, and the normal-text model (panel end 369px at 390×844, heading 513, CTA 692–744; 1440×900 heading 312, CTA 570) |
| `node evidence/stage-2/check-text-enlargement.mjs` | **18/18**, see [check-text-enlargement-output.txt](check-text-enlargement-output.txt) |
| Mutation: put back the `--header-h` panel cap and the `nowrap` wordmark in `dist/assets/site.css` | 2 expected FAILs (16/18). Rebuilt clean → 18/18, see [mutation-output.txt](mutation-output.txt) |
| Original evidence hashes after the work | identical (`diff` against `original-evidence-sha256.txt`) |
| Source hashes after the work | only `src/site.css` and `scripts/check-motion.mjs` differ |

What the stage-2 verifier asserts:

- The new rules exist with Home-only selectors.
- The panel stays `absolute; top: 100%`, its cap uses `100%` with no `--header-h`, and the sticky header is the nearest positioned ancestor.
- Compact header type sizes are unchanged.
- There is no word-breaking, clipping or hiding on the header controls, and no preference, injection or QA hook in the CSS, JS or HTML. Comments are excluded, as is the baseline's `-webkit-text-size-adjust: 100%`, unchanged since round 7.
- Only `site.css` changed in `dist`, and the four media files match their exact SHA-256 hashes.
- The arithmetic model holds:

| Case | Estimated result |
| --- | --- |
| 390 normal | One-line 181px wordmark beside a 98×44 control. Bar 64px, Menu 272–370, panel end 369 (unchanged) |
| 320 normal | 166px wordmark, bar 64px, Menu 206–304 |
| 390 at 200% | `AQUATIC` ≈191px and control ≈134px share a row. Wordmark on 2 lines in ≈200px, bar ≈99px, Menu/Close 236–370. Panel content ≈321px against a ≈745px cap, ending ≈420 |
| 320 at 200% | 175 + 12 + 134 > 288, so Menu moves to a second row, right-aligned at 170–304. Wordmark on 2 lines across 288px, bar ≈146px. Panel content ≈321px against a ≈698px cap |

`check-motion-logic.mjs` was **not rerun**. It exercises only `site.js`, and `dist/assets/site.js` is byte-identical to the pre-change build. Its last recorded result is stage 1's 68/68.

## Not run (coordinator browser acceptance)

- Any rendered view: 1440×900 and 390×844 at normal text, and the 200% text stress test at 390 and 320 with Menu open and closed.
- Real Georgia/Arial wrapping. My 390 estimate leaves only ≈9px of slack for `AQUATIC` beside Close. If the real glyphs are wider, the same rules move Menu to its own row, as at 320. That layout is still in the viewport, but the header is taller.
- Actual `getBoundingClientRect` of the brand, Menu/Close and panel. Document width ≤ viewport. The panel's actual top equals the header's bottom. Scrolling and Tab order to the fifth destination inside the capped scroller.
- Whether Menu/Close keeps the same rect when open and closed. This relies on the pseudo-element reserve; browsers without the `/ ""` alt syntax fall back to plain hidden content, which still adds nothing to the accessibility tree.
- Contrast, playback, devices and assistive technology, as in stage 1.

## Known limits and judgement notes

- **At 320px and 200%, Menu sits on a second row under the wordmark.** It stays right-aligned at the usual edge. I chose this over shrinking text or splitting a word.
- **Desktop at ≥1120px with 200% text was not in scope and is unchanged.** It still uses a no-wrap 32px wordmark beside the link row.
- **The scroll offset still assumes a 64px bar.** `html { scroll-padding-top }` and the arrival's `min-height` subtract `--header-h`. With a grown bar, in-page fragment targets can land partly under it, and the arrival grows past one screen and scrolls, which the refinement allows. Home has no in-page fragment links except `#top`/`#main`.
- **No-JS Home is unchanged.** The wrap, padding and auto-height rules are `.js`-scoped. The no-JS header keeps its stage-1 behavior, except that the wordmark may now wrap at the word boundary when space is short.
