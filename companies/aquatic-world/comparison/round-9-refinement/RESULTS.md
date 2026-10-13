# Fusion Home Refinement — Actual-site Results

Reviewed 2026-10-13. Both independent implementations pass the exercised local acceptance after one identical bounded motion-label correction. Public delivery is recorded in [PUBLICATION.md](PUBLICATION.md). This is a polished static website demo; Contact has no enquiry service. Human creative acceptance remains open.

## Delivery and comparison conditions

Each CLI started from its own final round-8 source at `0aa3f689834b8975596fe9a18d2a6c6e13116137`. Twenty-three shared input files and four root contracts were frozen identically. Codex requested `gpt-6.1-sol`; Claude exposed `claude-opus-5-5`. Both used explicit high effort, exited 0 in both stages, and received the same correction/reference. Native versions: Codex 0.162.1; Claude Code 2.1.296. [Initial audit](evidence/cli-audit.json), [correction audit](evidence/cli-audit-stage-2.json), [common correction](stage-2/BRIEF.txt), [input guard](check_inputs.py).

Codex received six native JPEG attachments initially, seven including the defect reference in stage 2. Claude's events show eight initial image Reads (six references and two posters), then the same defect reference. Codex poster-image inspection is not independently exposed by its event stream; posters were available in its identical input pack. Requested Codex backend identity is not independently exposed by its JSON events. Tool modes and own-code baselines differ, so this compares these recorded CLI workflows, not isolated model ability. Raw transcripts remain private and ignored by Git. No coordinator edits were made to either candidate's product code. No new paid media generation occurred.

## Observed outcomes

| Area | Codex | Claude |
| --- | --- | --- |
| Scrolled navigation surface | Solid abyss teal across the complete header, 84px tall at normal phone / 100px desktop including its bottom padding | Solid abyss-teal pseudo-element across the live 64px phone / 80px desktop row, with a 24px feather below |
| 844×390 CTA | Bottom315.21; **74.79px** below the clickable rectangle | Bottom328.78; **61.22px** below |
| 667×375 CTA | Bottom300.70; **74.30px** below | Bottom314.31; **60.69px** below |
| 390×844 CTA | Bottom737.15; retained portrait placement | Bottom744; retained portrait placement |
| Normal phone Menu | Five readable rows; total extent369px; same deep-teal surface | Five readable rows; total extent369px; now the same deeper teal |
| 200% text /320×375 utility labels | Play/Pause/Resume wrap inside x30..242, bottom357 | All labels contained; widest x17..251, bottom359.90 |

Zero safe-area inset was reported in this desktop-browser emulation. The brief requires at least16px landscape clearance; both have substantial measured margin. Native device toolbars/notches remain a separate limitation.

My visual preference is now split by detail: Claude's thinner scrolled row preserves more of the underwater scene; Codex's lighter collection typography and more generous narrow-landscape clearance give the content more room. Both normal phone menus have similar height. Film quality is shared and cannot distinguish the models. Neither a score nor a general model winner is justified by this single paired case.

## Actual browser acceptance

All UI verification used the Codex in-app browser through CUA; source/stub checks are separate. [Browser records](evidence/browser-records.json), [interaction records](evidence/interactions.json), [final regression](evidence/final-regression.json), [motion policies](evidence/motion-policies.json), [final labels](evidence/motion-label-final.json), [dismissal](evidence/dismissal.json), [scroll/movie evidence](evidence/scroll-motion.json).

- H1/H2: Actual hero and collection headings were aligned at approximately y26 behind the closed header at390×844 and1440×900. Body lettering was masked. Collection overlap was inspected during real playback and at controlled paused source phases0.2s and3s; those are existing video frames, not edited images. Returning to zero restores arrival transparency. The final threshold check is opaque at24px at six representative sizes per candidate.
- H2 boundary: The existing page's natural scroll extent cannot move Codex's perspective heading to y26 at390×844 (minimum y165.39) or1440×900 (y251.89); Claude reaches y25.96 on phone but y79.27 on desktop. Additional **390×500 and1440×500** viewports move each actual perspective heading to approximately y26. No spacer, content relocation or fabricated overlap was used. This is an explicit adaptation of the requested scenario.
- H3/H4: Menu open/close at top, collection and footer preserves brand/control anchors and underlying content/scroll with native taps. Scrolled reload and destination→Back return with a protected row and closed Menu; returning to top restores transparency. Frame-by-frame first-paint timing is not asserted.
- L1/P1/R1/R2: Both were captured at12 normal sizes:1440×900,1280×800,1120×800,1119×800,768×1024,390×844,360×800,320×800,844×390,667×375,900×900,500×500. No horizontal document overflow. All three normal phones fit the CTA. Near-square windows retain natural vertical scrolling. Films follow aspect ratio6/5, independent of the1120 navigation switch. Screenshots and actual video sources were observed after orientation changes.
- A1: Every HTML element's pre-captured computed font size and numeric line height was doubled once at390×844 and320×375. This is **computed-text stress, not native zoom**. Live enlarged header rows remain protected; all five destinations are reachable in the internally scrolling short disclosure. Ordinary content through the footer has no text-ink overflow. The visible motion label revealed a real separate defect and received the common correction below.
- A2: Visible Close, Escape/focus return, all five forward Tab stops, Tab exit, Shift+Tab to brand then outside the header, and outside taps were checked. No body scroll lock or focus trap in Home.
- M1/M2: Playing→Menu pauses; Close resumes. Manual Pause survives menu cycles. At a fixed viewport, scrolling advanced movie time normally and made no new film requests. Clean reduced-motion starts (preference set, then test session cleared, then reload) show Play with zero film requests; explicit opt-in loads the film. No-JS versions load no film, keep a protected reading header and navigate to Contact. Temporary emulation/text changes were restored by reset/reload.
- J1: On the actual `/Webpage-Design/` publication base, both completed Home→Collections→Fish→contextual Contact→validation→preview→Edit→Clear and Back/Forward. Fictional inputs only. Both preview flows generated **zero network requests**. All16 content routes plus both404 pages were opened directly and refreshed; no broken loaded images, inner-page film requests, horizontal overflow or browser errors were observed. [Journey evidence](evidence/journeys.json), [direct routes](evidence/direct-routes.json).

## Defect correction and honest diagnostics

At320×375/200% text, Codex's visible Resume label originally started atx−17.92; native screenshot [defect](evidence/codex-text200-motion-label-defect.jpg) confirmed opacity1 and clipped lettering. Both CLIs received identical bounded feedback. Both revised only their own tooltip rule and relevant checks, allowing bounded wrapping and upward growth. All three labels were then exercised in the browser with full text,26px type and visible focus; normal desktop hover was separately verified with hover=true and focus-visible=false. [Final labels](evidence/motion-label-final.json). A source-only assumption would have missed this defect.

The first Claude menu test used a locator that auto-scrolled its sticky target430px before clicking. That is preserved in raw interaction evidence as a failed test attempt. Native accessible taps at the same positions kept scroll and content coordinates unchanged, so it was classified as an automation artifact, not a product defect. A generic text-range scan also included invisible opacity-zero tooltip text; visible focus inspection, not suppression of the check, established the real defect and verified its correction.

The first inner-markup equality check reported Claude's updated shared inline bootstrap. Source review confirmed the sole markup delta moves scroll-state initialization into the existing head script; the strengthened guard now permits exactly that reviewed bootstrap change and requires all remaining inner markup byte-identical. Codex's inner markup is fully byte-identical. [Preservation evidence](evidence/preservation.json), [Codex source diff](evidence/codex-source-change.patch), [Claude source diff](evidence/claude-source-change.patch).

## Packaging and remaining limits

The disposable Pages build preserves runtime CSS/JS/media bytes and rebases only HTML URL attributes. It includes16 content pages, two local404s, the catalog/global404 and16 selected native comparison JPEGs. All684 local references resolve. The catalog was checked at1280,390 and320px; all eight comparison modes load the intended images without overflow. Research, trials, CLI logs and evaluator-only artifacts are excluded from Pages.

Normal composition captures preceded the last tooltip-only correction; affected enlarged-label states and six key normal/header sizes per candidate were rechecked afterward. Existing media is unchanged: six-second silent forward/return loops with previously disclosed editing. This round did not retest physical iOS/Android, Safari, native text zoom, screen readers, live Save-Data changes or real hidden-tab timing; preserved controller simulation evidence does not replace those tests. No real company, inventory or enquiry delivery is claimed. Creative acceptance belongs to the user.
