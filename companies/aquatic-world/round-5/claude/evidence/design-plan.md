# Round-5 design plan — shorter Contact task

Written 2026-10-11 before editing source. Contract: REVIEW.md (supersedes older Contact complexity only).
Scope is Contact only; header, seven other pages, routes, images and 404 stay unchanged.

## Baseline evidence (own round-4 code)

- `baseline/contact-mobile-first.png` (390×844): eyebrow "Contact" + h1 + lead that already says "Nothing is sent",
  then a second heading "Your enquiry brief" and a note "Nothing you type leaves this page". Name input starts ≈414px;
  Email is below the fold, with Organisation between them.
- `baseline/contact-mobile-full.png`: seven field groups (Name, Organisation, Email, You are, Collections, About the project, Timing);
  local-only is repeated in intro, form note, email hint, action note, "How this works" step 3 and the Demo limitation notice.
- `baseline/contact-desktop-first.png`: same duplication; aside "How this works" restates the nothing-sent step.
- Re-captured with current code in `evidence/screenshots/before/` (390×844, 360×800, 768×1024, 1440×900).

## Decisions

1. **One heading.** Keep h1 "Prepare an enquiry brief". Remove the "Contact" eyebrow and the h2 "Your enquiry brief".
   The form is named by the h1 (`aria-labelledby="contact-title"`). One purpose sentence: "Describe your aquatic project and preview a tidy brief."
2. **Four field groups.** Name, Email (one row on desktop), Collection(s) (existing multiple-choice checkboxes incl. "Not sure yet"), Project.
   Organisation, You are and Timing are deleted from markup, validation and preview rows. The Project hint invites that information when useful.
   All four groups are required (unchanged contract), so a single "All four fields are required" phrase replaces per-label REQUIRED/OPTIONAL marks; `required` attributes stay.
3. **One disclosure.** A single short line at the top of the form panel: required fields + "local preview — nothing you type leaves this page and no message is sent".
   Removed from intro lead, email hint, action note and help steps. The no-JS `<noscript>` notice takes the same slot; the normal line is hidden under `.no-js`, so they never both show.
   Preview success keeps "Nothing was sent." Button stays "Preview enquiry".
4. **First viewport.** Phone banner keeps the solid compact treatment; without the eyebrow/second heading/note the Name input should start ≤320px and Email be fully visible at 390×844 and 360×800 without shrinking type (16px+ labels/body) or the 50px controls.
   Measure in Chrome and adjust spacing only if needed.
5. **Category context at the field.** Move the prefill context from the pre-form card into the Collections fieldset as a one-line hint + back link. Unknown `interest` values are ignored (existing filter). Clear hides the context, resets checkboxes and removes the query from the URL via `history.replaceState`, so the page no longer claims a prefill.
6. **Help after the workspace.** Aside (after the panel in DOM/keyboard order; right column ≥900px, below on phones) becomes one concise "What makes a brief useful" checklist plus a short note on why no email/phone is listed. Drop the 3-step "How this works" list, which only repeated the task and the nothing-sent message.
7. **Verification.** Update `scripts/verify.mjs` to the four-group contract (preview rows exactly Name/Email/Collections/Project, no removed controls, single disclosure, no-JS non-duplication, first input ≤320px and Email visible at 390×844/360×800/320, context at the field, Clear resets context) while keeping all other gates.
   Re-run all checks, capture after screenshots at matching sizes and inspect them.
