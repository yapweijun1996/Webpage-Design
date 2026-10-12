# Contact simplification plan

Recorded before source edits, 2026-10-11. REVIEW.md is the focused authority. BRIEF.md and ACCEPTANCE.md continue to own the other eight-page contracts.

## Current evidence

- Read AGENTS.md, REVIEW.md, BRIEF.md, ACCEPTANCE.md, root README, and the frozen cli-web-design-director skill plus all three references.
- Inspected the supplied own-code Contact desktop/phone first screens, phone full capture, Home desktop capture, the supplied homepage reference and the existing underwater help image. The old phone Name input begins around 620px. The repeated introduction, form introduction, pre-field context and repeated disclosures cause the delay.
- The baseline form already has four groups. Preserve its single-select semantics, required name/email/project validation, text-safe rendering, shared menu and eight actual pages.
- No instruction-modules directory is supplied. Use the available core and explicit acceptance contract. No sibling, earlier workspace, parent report, evaluator, additional model or agent is read or used.

## Intended changes

1. One workspace headed “Your project brief”, one short purpose sentence, one concise editable-state local-only disclosure. Remove the parallel introductory panel and duplicate task headings/eyebrows.
2. Exactly Name, Email, Collection and Project. Retain Not sure yet; move query/selection context to one hint under Collection. Keep body/labels/controls at 16px and controls at least 48px. Use comfortable 20px field spacing.
3. Centre a restrained cream/white workspace, with Name/Email side by side only where comfortably wide. Budget the phone top: unchanged 68px header, 24px section padding, compact breadcrumb, 20px panel padding, 32px task heading, short purpose/disclosure and 20px form gap. Target first input <=320px, both Name/Email fully visible at 390×844 and 360×800; inspect 320, 768 and 1440 where a renderer is available.
4. Place closed, keyboard-accessible “Help with your brief” and the secondary existing image after the entire form/preview workspace in DOM and visual order. Consolidate the useful setting/material/questions guidance and preview/edit instructions.
5. Preview displays only four values and explicitly says Nothing was sent. Return to edit retains values. Clear empties text/errors/output and resets Collection to Not sure yet, including incoming contextual enquiries. Associated errors, summary focus/links and focus clearance stay intact.
6. No-JS: one short explanation replaces the normal disclosure. Keep navigation and guidance available; disable all form controls until enhancement is ready, preventing an accidental native submission.

## Verification and ownership

- Edit authoritative demo/build.py, demo/styles.css and demo/script.js, then rebuild demo/public. Hash frozen files and non-Contact HTML before and after; preserve them byte for byte.
- Run build reproducibility, static route/link/assets/DOM/form checks and actual script logic checks. Exercise prefill for all three category slugs, Quality/general, unknown values, blank/invalid, valid preview, edit, clear and long literal text.
- Attempt loopback serving using AQUATIC_PREVIEW_PORT=4211. The preflight bind returned PermissionError: [Errno 1] Operation not permitted; no server was started and no existing process was stopped. Check available browser local-file capability. If unavailable, record rendering, viewport geometry and real keyboard/history/no-JS interaction checks as not_run, without fabricated screenshots or visual-pass claims.
- Update root README and evidence/revision-review.md with actual commands, outcomes and gaps. Functional source/logic verification, rendered visual assessment and user acceptance remain separate outcomes.
