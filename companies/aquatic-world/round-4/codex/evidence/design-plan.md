# Focused revision plan — recorded before implementation

Date: 2026-10-11. Authority: REVIEW.md, followed by BRIEF.md and ACCEPTANCE.md. This revises the supplied own-code eight-page demo; it does not rebuild the site or alter frozen inputs.

## Observed starting conditions

- Baseline Home at 1440×900: a 97px header, a two-line brand and 14px navigation compete with the enquiry action. The target is a compact, deliberately grouped header.
- Baseline Home at 768×1024: the 92px header precedes an overlaid hero; the italic heading crosses the fish's face/body. Overflow alone would not detect this defect.
- Baseline Contact at 390×844: introduction, disclosure, photography and help all precede the form in the DOM. No editable field appears in the first viewport. The full baseline confirms the excessive pre-form distance.
- Both original references were inspected. Retain solid dark teal, champagne controls, cream editorial surfaces and serif/sans contrast. Their business assertions are fictional and will not be adopted.
- All five supplied baseline captures and the nine-image pack were inspected. The pack contact sheet in this directory is an inspection aid, not a browser screenshot. Existing local WebP derivatives and provenance remain unchanged.

## B first — shared header and intermediate Home

1. Change the authoritative `brand()`/`header()` functions in `demo/build.py`; keep the slogan in the footer and omit it from the header. Preserve Home logo, five real destinations and one enquiry action.
2. Use a solid ocean-teal header with an 80px closed desktop row and 68px phone row, including border. Group 15px global labels in a navigation region, with a rule separating the aligned 44px champagne CTA. Use a single row before switching to the existing compact disclosure at 1119px.
3. Define stable underline cues for hover/current/current-section, visible focus, 44px minimum header targets, and a matching Menu/Close disclosure. Keep native details navigation without JavaScript; preserve Escape and focus return. Use grid areas so hiding desktop children cannot move controls into unintended tracks.
4. At 768–1119px use an intentional copy/image split with a full-width fish image below the copy, keeping the Home text entirely out of the photo. Retain the wide cinematic overlay and existing phone composition. No unrelated page redesign.

## A next — Contact task order

1. Make the actual DOM `compact introduction → complete form/preview panel → secondary help/photo`. At desktop use named grid areas to retain the introduction and help on the left, workspace on the right. Phone follows DOM order naturally, without positive tabindex or CSS order.
2. Keep one concise purpose paragraph. Place a short local-only/no-message-sent disclosure inside the form panel, before editable fields. Keep broader guidance, photography and a short how-to sequence after the entire workspace.
3. Budget the 390×844 first screen for the 68px header, compact breadcrumb/introduction, panel title/disclosure/context and the complete name label/input. This is a layout intent until actual browser geometry is available.
4. Shorten the general option to `Not sure yet`, explaining that it includes a complete aquascape. Preserve category values and prefill, associated validation, summary focus/links, safe textContent preview and edit. Add an explicit local clear/reset action since the current supplied code lacks one.

## Verification and completion

- Rebuild from sources, verify reproducibility and syntax. Inspect generated routes, unique page content, anchors, asset existence, current states, form DOM order and input-pack hashes.
- Exercise the actual request handler in-process (GET/HEAD/404/unsupported POST) if live sockets remain unavailable. Exercise the unmodified browser enhancement code in a local DOM harness where available; distinguish this from real browser behavior.
- Provide a reproducible browser matrix for all eight routes at 1440/1024/768/390/360/320px, extra 430/1920 widths, old acceptance journeys, menu/keyboard/no-JS, form invalid/preview/edit/clear and screenshots at matching dimensions. Do not describe a prepared test as an executed check.
- Record before/after decisions and exact checks in `evidence/revision-review.md`; replace stale root README references to absent historical evidence with current artifacts and honest status.
- No server, account, external service, model, global configuration, commit, deployment or enquiry changes. Write only demo/, evidence/ and root README.md. Verify all 66 currently present frozen files against `frozen-before.json`.

## Environment and known verification gap

Selected and exposed model: `gpt-6.1-sol`; exposed reasoning effort: `xhigh`; launch and installed Codex CLI: `0.162.1`. Python: `3.14.3`; Node: `v23.10.0`. Own native tools only; no delegation/advisor.

`python3 demo/serve.py` used AQUATIC_PREVIEW_PORT=4201 and failed before listening with PermissionError EPERM. A Node loopback probe also returned EPERM. The CUA Chrome extension is present, but its browser policy rejects file:// and expressly disallows workarounds. Do not bypass that policy. Browser screenshots, actual rendered layout/keyboard checks and live HTTP journeys are currently unavailable; report them as not_run. Missing routed instruction-modules/ are handled using the supplied core and explicit contracts. Relevant current context is already in the frozen local brief; no external memory was needed.
