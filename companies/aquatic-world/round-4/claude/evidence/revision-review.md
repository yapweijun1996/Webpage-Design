# Round 4 focused revision — review record

Date: 2026-10-11. Scope: REVIEW.md B (shared header), then A (phone Contact order), plus the related
intermediate-width Home hero collision. Plan written before editing: [design-plan.md](design-plan.md).
Status: implemented and self-verified (56/56 scripted checks plus visual inspection of real captures).
This is worker evidence only; independent evaluator judgment and user design acceptance remain pending.

## Model and tool metadata (as exposed in this run)

- Model: Claude Opus 5.5, model ID `claude-opus-5-5` (from the system context; `evidence/process-run.json` records `--model claude-opus-5-5`).
- CLI: Claude Code `2.1.289` (`claude --version`), non-interactive `--print`, permission mode `auto`.
- Tools used: Bash, Read, Write, Edit (the native CLI tools only). There were no subagents and no advisor or other models, and no MCP browser tools were used. (The `chrome-devtools` MCP server failed to connect, so it wasn't used.)
- Browser: headless Google Chrome 154.0.8037.99, driven by the workspace's own `demo/scripts/cdp.mjs`.
- Runtime: Node v23.10.0. The preview server ran on loopback port 4202 (`AQUATIC_PREVIEW_PORT`). It was started and stopped by the scripts as their own child process. No other process was touched, and no server was left running.

## Changes: baseline defect → change → observed result

| # | Baseline defect (own round-3 code) | Change (source) | Observed result |
| --- | --- | --- | --- |
| B1 | The header surface was `#061C26`, the same near-black as the hero. The bar dissolved into the photo, and links and CTA formed one undifferentiated row (`baseline/home-desktop-first.png`). | `site.css` header block: solid ocean teal `--ocean-900 #0A3541` and a champagne hairline border. A new `.header-divider` (`layout.mjs`) separates the destination group from the action. The CTA gains an arrow and 0.95rem/600 type. | At 1440 and 1180 the teal bar reads as its own layer above the darker hero. Brand │ five links │ divider │ gold CTA sit on one centre line (`after/home-1440x900-viewport.png`, `after/fish-1440x900-viewport.png`). |
| B2 | Nav labels were 15px, fog-grey and low emphasis. | Labels are now 16px/500 in `#E2E9E8` with 44px targets and 14px padding. | NAV-01 measured labels ≥15px, every target 44px tall, ≥16px gaps brand→links→CTA, closed height 77px (76 + 1 border) on desktop. |
| B3 | On category pages the "current section" state relied on `aria-current="location"` alone. | `layout.mjs` adds visually hidden "(current section)" text. Visually: a segmented gold underline (desktop) or segmented side bar plus a "Current section" tag (menu). Current page uses a solid gold bar. The focus ring is now a 2px gold inset outline, and hover is a transform-only underline (no layout shift). | IA-01 asserts the note appears only on the three category pages. Visual: `after/fish-1440x900-viewport.png`, `after/menu-open-1024-driftwood.png`. |
| B4 | The compact switch was at <1000px, so 1000–1100 squeezed the full row (measured fit is about 1040px). | The breakpoint moved to <1100px in `site.css` and `site.js` (`matchMedia`). The compact bar is 64px + 1px border. The open panel uses the same teal surface, aligned to the page gutter; the toggle reads "Close" with an × icon. | NAV-01 passes at 1440/1180/1100/1024/768/390/360/320. NAV-02 passes for pointer, Enter, Tab, Escape (focus returns to the toggle), outside click and link navigation. |
| H1 | Home at 1024 and 900: the lead/heading lay across the angelfish's face (`before/home-1024x768-viewport.png`, `before/home-900x1000-viewport.png`). | `pages.mjs` adds a `<picture>` source for 861–1199px using the fish-centred crop. `site.css` makes a deliberate split there: copy on solid ocean (left half), image in the right half, `object-position: 28% 50%`, with a 10% blend edge. ≥1200 keeps the overlay; ≤860 keeps the stacked layout. | REV-B checks geometry: copy right edge vs image column / computed fish-mouth x at 1440, 1180, 1024, 900 and 768. Visual: `after/home-1024x768-viewport.png`, `after/home-900x1000-viewport.png`. My first split at `42%` placed the mouth on the fade edge at 1024; I fixed it after inspection. |
| A1 | At 390 the first field sat about 1,500px down, after a photo banner, "How this works", a checklist and a notice (`baseline/contact-mobile-full.png`). | `pages.mjs`: the DOM is now intro → `#enquiry` form/preview panel → `<aside>` help (steps, checklist, demo limitation). Desktop grid is `7fr 4fr` (form left, help right), so visual order equals DOM order. There is no `order` and no positive tabindex. | REV-A at 390×844, 360×780 and 320×700: scrollY 0, Name label and input fully visible below the header (input bottom 466px at 390), and `elementFromPoint` hits the input. After the skip link, the first Tab stop is `f-name`. No help content precedes the panel. |
| A2 | The phone intro banner used about 335px (photo, padding and a 3-line lead). | ≤767px: solid ocean intro with no photo and 20/22px padding. The lead is one sentence and carries the disclosure "Nothing is sent — the preview stays in your browser." The form panel is tighter on phones. | `check-contact-first-390.png` shows the heading, disclosure, form title and Name field in the first viewport. |
| A3 | The context-prefill card sat in the pre-form aside. | Moved inside the panel above the fields, without its eyebrow. | REV-A prefill: `?interest=ornamental-fish` card in the panel; the Name input is still visible at 390×844 (bottom 602px). IA-03 still confirms prefill and "Back to …" links for all three categories. |
| A4 | "Not sure yet" had no explanation. | A hint is associated through the fieldset's `aria-describedby`: "Choose 'Not sure yet' if you would like the families suggested from your description." The value and the label are unchanged. The closed selects ("Choose one", "No fixed timing") weren't cramped, so I kept them; this deviates from the plan's proposed wording change, which wasn't needed. | REV-A prefill check asserts the hint and the association. |
| A5 | Found during this run (probably also present in the baseline): after a valid preview on a phone, `focus()` scrolled the "Nothing was sent" status under the sticky header (top 38px at 390, −63px at 320, header bottom 65px). | `site.js`: `focus({ preventScroll: true })`, then `scrollIntoView({ block: "start" })`, so the html `scroll-padding-top` applies. I applied the same fix to the error summary. | Re-probe: summary and preview tops at 80px (phone) and 92px (1440), both below the header. FORM-01 now asserts `statusClear` and `summaryClear` at 1440, 390 and 320. |

## Verification run

```sh
cd demo
npm run build                 # Built 9 pages
npm run verify                # 56/56 checks passed (Chrome/154.0.8037.99) → evidence/verification.json
node scripts/shots.mjs --sizes=1440x900,390x844 --out=../evidence/screenshots/after
node scripts/shots.mjs --sizes=1440x900,1180x820,1024x768,900x1000,768x1024,390x844,360x780,320x700 --viewport-only --out=../evidence/screenshots/after
```

Checks: the original IA-01…06, NAV-01…04, FORM-01, UI-02, UI-03 and BUILD-01 gates still run. NAV-01 now covers 8 widths. FORM-01 runs at three viewports.
New REVIEW checks: REV-A (Contact order and first field, 5 viewports, plus prefill) and REV-B (hero vs fish, 5 widths).
The verify script was updated for the new contract:
- The nav label is read from `.nav-label`.
- Compact mode applies below 1100.
- Teal background, spacing and CTA height are asserted.

No assertion was removed to obtain a pass. The 1440 hero threshold changed from an arbitrary "≤46% of width" to the computed fish-mouth position minus 24px. The old rule failed at 690px while the mouth was at 744px and visibly clear.

Test-driver stability: two early verify runs aborted (not failed) with CDP `Inspected target navigated or closed`. The cause was that `cdp.mjs` `settle()` evaluated in the page right after a click that had started a navigation. `settle()` now tolerates only that context-destroyed error; `navigateBy()` still awaits the new load. After the fix, three consecutive full runs each passed 56/56 with exit code 0.

Screenshot console output: the only console error is the intentional HTTP 404 document on `/missing-page/` (not-found route).

Visually inspected captures, each compared with `baseline/` at the same size where one exists:
- Home at 1440×900, 1180, 1024, 900, 768×1024 and 320.
- Ornamental Fish at 1440.
- Contact at 1440, 768×1024 and 390 (first viewport and full page).
- The open menu at 390 (Quality) and 1024 (Driftwood).
- Error states at 390 and preview states at 320.
- Header strips from `check-header-*`.

Before captures: `evidence/screenshots/before/`. After captures: `evidence/screenshots/after/` and `evidence/screenshots/check-*`.

## Remaining gaps / not run

- At ≤767px, the Contact supporting photograph no longer appears; it's still shown at ≥768px. This is a deliberate trade-off for the first-field target, not a missing asset.
- Only headless Chrome was used: no Safari, Firefox or real mobile devices. No screen-reader session was run; accessible names were checked through the DOM only.
- I didn't visually inspect every page at every one of the 6 REVIEW widths. Header geometry, overflow and no-JS behaviour on all routes are covered by scripted checks; the visual inspection covered the pages listed above.
- `--base=/prefix/` builds were not browser-tested.
- No commit, push, deploy or enquiry was performed. Frozen inputs, baseline and governance files were not modified: their mtimes all predate the run start.
