# Round-5 revision review — shorter Contact task

Date: 2026-10-11. Builder: Claude Code CLI, model Claude Opus 5.5 (`claude-opus-5-5`), single native model.
No delegate, sub-agent, advisor or additional model was used. Contract: REVIEW.md (with BRIEF.md and ACCEPTANCE.md).
Plan written before editing: [design-plan.md](design-plan.md). Status: worker self-verification only; independent evaluation and user design acceptance remain pending.

## Baseline defect → change → observed result

| Baseline defect (own round-4 code) | Source change | Observed result (Chrome 154, headless) |
| --- | --- | --- |
| Two task introductions: eyebrow "Contact" + h1, then h2 "Your enquiry brief" + note | Removed eyebrow, h2 and note (`demo/src/pages.mjs`). Form named by the h1 via `aria-labelledby="contact-title"`. One purpose sentence: "Describe your project and preview a brief." | Only visible heading before the first input is the h1 at every checked size (REV-C `headingsBeforeForm`) |
| Seven field groups (Organisation, You are, Timing) | Deleted those controls; groups are Name, Email, Collection(s), Project. The Project hint invites organisation, role or timing when useful | `[data-field]` = `name,email,interest,project`; zero `organisation/role/timing` controls |
| Local-only disclosure repeated six times (intro, note, email hint, action note, help step 3, demo notice) | One line at the top of the panel: "All fields are required. This preview stays on this page; nothing is sent." The no-JS `<noscript>` notice replaces it (`.no-js [data-local-note]{display:none}`). The note is hidden while the preview, with its own "Nothing was sent." status, is shown | Exactly 1 matching visible disclosure in the editable state; no-JS shows only the no-JS notice; preview shows only "Nothing was sent." |
| Name input at ≈414px at 390×844; Email below the fold | Removed redundant content and shortened lead to one line. Small phone spacing changes (banner 18/20px, labels raised from 15.5px to 16px). Controls unchanged at 52px | 390×844: Name input top **303px**, Email bottom 466px. 360×800: Name **302px**, Email bottom 465px. 320×700: Name 381px, Email bottom 544px (both visible) |
| Large pre-form category context card | Context moved into the Collection(s) fieldset as one hint line + back link; associated via `aria-describedby` only while shown | Prefill from all three categories and Not sure; unknown values ignored; Name stays at 303px with context |
| Clear left the "You came from…" context visible | Clear now resets fields, hides context and removes the query (`history.replaceState`) | Clear → empty fields, no checked boxes, no context, `location.search === ""`, focus on Name |
| Help repeated the task as three steps | Aside reduced to "What makes a brief useful" checklist + "Why no email or phone?" note, after the panel in DOM/keyboard order (beside it ≥900px, below on phones) | `helpBeforePanel = 0`; first Tab stop after the skip link is `f-name` |
| Preview rows included Organisation/You are/Timing | `demo/src/site.js` preview rows: Name, Email, Collections, Project | Preview `dt` list exactly `Name,Email,Collections,Project` |

Two defects I found in my own after-screenshots and fixed in this run:
1. In the no-JS state the notice touched the Name label: `p:last-child { margin-bottom: 0 }` applied inside the inline `<noscript>`. Fixed with `.form-panel noscript { display: block }` and an explicit margin. Measured gap is now 18px.
2. In the preview state the editable-state note duplicated "Nothing was sent". It is now hidden during preview and restored on Edit/Clear. Assertions were added to FORM-01.

Unchanged: header/menu, the seven other pages, routes, images, 404 and the global footer notice.

## Verification

Commands (from `demo/`, port from `AQUATIC_PREVIEW_PORT=4212`, verified free before use):

```sh
npm run build
AQUATIC_PREVIEW_PORT=4212 npm run verify      # 58/58 passed → evidence/verification.json
AQUATIC_PREVIEW_PORT=4212 node scripts/shots.mjs --routes=contact --sizes=390x844,360x800,320x700,1440x900,768x1024 --viewport-only --out=../evidence/screenshots/after
AQUATIC_PREVIEW_PORT=4212 node scripts/shots.mjs --routes=contact,home,collections,fish,quality,not-found --sizes=1440x900,390x844 --out=../evidence/screenshots/after
```

Results of the final run: **58/58 checks passed** (Chrome/154.0.8037.99). These include all previous gates (IA-01…06 for eight routes + 404, NAV-01…04, FORM-01 at 1440/390/320, REV-B home hero, UI-02 at 320–1920, UI-03, BUILD-01).
The round-4 REV-A Contact checks were replaced by REV-C for the new contract:
- REV-C ×5 at 390×844, 360×800, 320×700, 768×1024 and 1440×900. Each checks one h1 and no other heading before the form, four groups, no removed controls, one disclosure, "Preview enquiry" label and labels ≥16px. It also checks inputs ≥44px, Name hit-test, Name+Email fully visible below the sticky header, help after the panel and the first keyboard stop. At 390 and 360 it requires the first input top ≤320px.
- REV-C prefill matrix: `ornamental-fish`, `aquatic-plants`, `driftwood`, `not-sure`, `bogus`, `driftwood,unknown`.
- REV-C Quality → Contact opens a neutral form (no invented context).
- REV-C prefilled preview → Edit keeps values/context → Clear empties fields, context and query.
- FORM-01 also checks exact preview rows, hidden edit-state note during preview and long unbroken text with no overflow.

Screenshots inspected by me (real captures from this run):
- `screenshots/before/contact-{390x844,360x800,768x1024,1440x900}-viewport.png` — current round-4 code before editing (matches `baseline/contact-mobile-first.png` / `contact-desktop-first.png`).
- `screenshots/after/contact-{390x844,360x800,320x700,768x1024,1440x900}-viewport.png`, `after/contact-390x844.png` (full page), plus full-page Home, Collections, Ornamental Fish, Quality and 404 at 1440×900 and 390×844 as a regression look.
- `screenshots/check-contact-context-390.png`, `check-form-errors-390.png`, `check-form-preview-390.png`, `check-nojs-390-contact.png`, `check-menu-open-390.png`.

Process ownership: verify/shots start their own `serve.mjs` child when the port is free. One owned child (PID 76237, this workspace's `serve.mjs --port=4212`, PPID 1) was found still listening after a run. I stopped that PID only.
I then made both scripts stop their owned server even if closing Chrome fails. After the final runs, nothing listens on 4212.

## Gaps and not run

- not_run: real iOS Safari / Android devices, VoiceOver/NVDA screen-reader pass, Firefox/WebKit engines. Checks used headless Chrome only.
- not_run: sub-path (`--base=`) build in a browser (unchanged from round 4).
- Judgement call: all four groups remain required, so one "All fields are required" line replaces per-label REQUIRED marks. `required` attributes still expose this to assistive technology.
- No-JS first viewport: the wrapped no-JS header and notice put Name at ≈360px at 390×844 (measured after shortening the no-JS sentence). The ≤320px target was applied to the normal JS state only.
- At 320×700 the h1 wraps to two lines and Name starts at 381px; Name and Email remain fully visible.
- At 390px the prefill context wraps to two short lines (text + 44px back link); acceptable but not one line.
- Visual quality and the user's acceptance are not claimed.
- Scope note: two short throw-away measurement scripts were written to `/tmp` during layout tuning (CDP geometry and no-JS spacing via `demo/scripts/cdp.mjs`). They have since been deleted; their checks are now covered by REV-C/NAV-04/FORM-01 in `verify.mjs`.
