# Stage 3 — 200% Text, Rest of Home: Self-Review (Claude workspace)

2026-10-12 · `claude-opus-5-5` through the Claude Code CLI. Tools: Read, Edit, Write and Bash. No MCP, no browser or OS automation, no network, no Git, no other model or agent. Plan: [design-plan.md](design-plan.md), written before any edit.

**Scope.** This evidence covers source, build output and arithmetic only. I rendered nothing. Every geometry number is an estimate from approximate Georgia/Arial advances, not a Range or element measurement. Rendered acceptance belongs to the coordinator.

## Change

The only product source changed is `demo/src/site.css`, and only for Home. In the build, only `dist/assets/site.css` differs. Markup, `site.js`, content, media, inner pages and the stage-2 header/menu rules are byte-identical or untouched.

| Rule | Finding addressed | Normal text | Doubled text (estimate) |
| --- | --- | --- | --- |
| `.page-home .home-enquiry { max-width: 100%; white-space: normal; }` | **Discuss a project** ran to x374 at 320. The cause was `.btn { white-space: nowrap }` | Same one-line ≈220px button | It now wraps at the space: "Discuss a" / "project". The widest row is ≈193px with the arrow and padding, inside 288px. The outline grows taller; it does not get wider |
| `.home-footer .brand-name { white-space: normal; line-height: 1.15; }` | **Footer brand** ran to x349 at 320, and its nowrap min-content stretched the 1-column footer grid | One line (≈166px at 320, ≈180px at 390). It is centred in the unchanged 44px brand box | It wraps only between AQUATIC and WORLD (≈175px at 320, ≈190px at 390). The grid track's minimum drops to that word, so the footer navigation and disclosure get the full column. No `overflow-wrap`/`word-break` is applied to any brand rule (checked) |
| `.home-entries { container-type: inline-size; }` + `@container (max-width: 16em) { .home-entry { grid-template-columns: minmax(0, 1fr) auto; grid-template-areas: "num arrow" "name name" "text text"; } }` | Collection names: "Ornamental" at 48px (≈258px) could not fit the ≈202px name track left by the fixed 36px number column, gaps and arrow. That made a text-ink overflow that element boxes do not show | At 16px, 16em = 256px, below every ordinary Home content width (smallest 284px at a 568px landscape window). The row layout is unchanged everywhere | At 32px, 16em = 512px. At 390 and 320 each entry stacks: the number with the arrow at right, then the name and note across the full ≈280px row. "Ornamental" fits without being split |
| `.home-arrival-copy, .home-chapter-inner, .home-footer-base { overflow-wrap: break-word; }` | A single word wider than its whole line: "connection" in the closing heading at 64px is ≈325px against 288px at 320. This one is my estimate, not reported | No effect, because every word fits its line | Such a word breaks inside the column instead of running to ≈x340. Not applied to the header or footer brand |

I added no font-size change, no clipping, no hiding, no `overflow-x: hidden`, no preference, no injection and no QA hook. Each condition was checked in the source/output.

My SVG arrows are fixed at 18×12px, so the reported Codex text-arrow issue has no counterpart in my Home.

**Correction to the plan:** the plan gave the normal enquiry button as ≈179px. The model in the check, which includes 2 × 26px padding, gives ≈220px. It is still one line in 288px, so the conclusion stands.

## Checks actually run

| Command | Result |
| --- | --- |
| Pre-change hashes of `demo/dist`, `demo/src`+`scripts`, the original and stage-2 evidence, and `input/`, `baseline/` and the root contracts | `pre-change-dist-sha256.txt`, `pre-change-src-sha256.txt`, `original-evidence-sha256.txt`, `stage-2-evidence-sha256.txt`, `frozen-contracts-sha256.txt` |
| `node demo/scripts/build.mjs` | 8 routes + 404 built |
| `node demo/scripts/check-motion.mjs` | **126/126**, see [check-motion-output.txt](check-motion-output.txt). No assertion needed changing |
| `node evidence/stage-2/check-text-enlargement.mjs` (stage-2 header/menu fix still asserted) | **18/18**, see [stage-2-check-rerun-output.txt](stage-2-check-rerun-output.txt) |
| `node evidence/stage-3/check-home-text-reflow.mjs` (new; [source](check-home-text-reflow.mjs)) | **25/25**, see [check-home-text-reflow-output.txt](check-home-text-reflow-output.txt) |
| Mutation: revert A, B and C in `dist/assets/site.css`, then rebuild clean | 3 expected FAILs (22/25), then 25/25 after the rebuild. See [mutation-output.txt](mutation-output.txt) |
| Integrity after the work | Original evidence, stage-2 evidence, `input/`, `baseline/` and root contracts are identical. Only `src/site.css` and `dist/assets/site.css` changed. See [integrity-output.txt](integrity-output.txt) |

The first run of the new verifier gave 24/25. The failure was a bug in the checker, not in the product: it located the Home CSS range in comment-stripped CSS, where the end-marker comment no longer exists. I fixed it to slice the raw CSS, and it then passed.

`check-motion-logic.mjs` was **not rerun**. It exercises only `site.js`, which is byte-identical to the pre-change build. Its last recorded result is stage 1's 68/68.

## What the stage-3 verifier asserts

- The four rules exist with Home-only selectors.
- The ordinary entry grid is unchanged.
- No brand rule uses `overflow-wrap`, `word-break` or `hyphens`. Home has no `overflow-wrap: anywhere` or `word-break`.
- The new rules change no font-size and add no overflow, hiding or clipping. There is no `overflow-x: hidden` and no QA hook or preference.
- The stage-2 header/menu rules are still present.
- Only `site.css` changed in `dist`, and the media matches `input/media` byte for byte.
- The arithmetic holds for all four findings at 320 and 390, normal and doubled.
- The 16em threshold is below every ordinary content width and is reached at 390/320 with doubled text.

## Remaining browser acceptance (coordinator)

- At 390×844 and 320×844 with doubled text, test the full Home with Menu closed, open and scrolled. Check document width ≤ viewport, and text-node **Range** rects (not only element boxes) for the h1, h2s, entry names and notes, the enquiry button, the quiet links, the footer brand and nav, and the disclosure.
- **Container-query `em`.** The stacked entry depends on `em` in `@container` resolving against the list's own (doubled) font size, as the spec and current engines define it. If a browser resolves it differently, entries keep the row layout. The break-word safety net would then keep names inside the column but split them, for example "Ornamen/tal". That would need a rendered check.
- Real glyph widths. The 390 heading word "connection" (≈325 of 350px) and the footer "AQUATIC" are estimates.
- The 13 ordinary compositions and normal desktop, to confirm they are visually unchanged. The rules are designed to be inert at normal text, but nothing was rendered.
- Stage-2 header/menu behavior under doubled text, rechecked together with the above. It is unchanged in source.
- Contrast, playback, devices and assistive technology remain unverified, as in stages 1–2.
