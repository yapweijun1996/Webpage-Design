# Common Acceptance Criteria

## Film and visual acceptance

- Raw take and runtime derivative exhibit real forward motion and believable anatomy; no return-loop editing or held-frame stretch.
- Complete normal-speed take and at least three repeated joins are reviewed in both orientations. Record failure honestly; passing metadata or stills cannot establish cinematic quality.
- Main fish do not remain clipped against an edge. Foreground/middle/background remain distinct. Copy stays readable throughout motion, including the brightest useful frame.
- Desktop and portrait concepts communicate the same habitat with deliberate separate compositions. Home CTA is a clear outlined control, not a solid gold block.
- Fish, Plants and Driftwood chapters each add relevant category photography and reading rhythm while the underwater Home environment remains coherent.

## Responsive and interaction checks

Check both candidates at the same sizes: 1440×900, 1280×720, 1024×768, 768×1024, 390×844, 360×800, 320×568 and 844×390. Add an intermediate viewport only when an observed transition defect warrants it. Inspect actual-size captures at scroll zero after assets settle, open Menu, and a scrolled chapter/header alignment.

- No unintended horizontal overflow, title/subject collision, clipped primary action or motion-control overlap. Normal first-screen CTA has at least 16px bottom clearance.
- At 200% text size, navigation, menu dismissal, CTA and motion control remain readable and reachable; natural scrolling is allowed. Disclose text-resize simulation separately from native browser zoom.
- Keyboard users can skip to content, navigate, operate Menu/Close/Pause, see focus and escape/dismiss the menu according to its implementation. No hidden item receives unintended focus.
- Scrolled navigation row masks content behind it. Opening state remains integrated with the environment. The active page indicator and category context remain meaningful.
- Home → Collections → category → Contact works; Contact preview, Edit and Clear remain local and honest. Direct open/refresh and browser Back/Forward work across all eight routes plus 404.

## Media policy and delivery checks

- Muted inline playback, user pause persistence, menu/tab suspension and eligible resume work. A manually paused film never resumes automatically.
- Reduced-motion and Save-Data default to the usable poster without film download; explicit opt-in is separate from those defaults. Film fetch failure and autoplay refusal leave title, CTA and navigation usable.
- Landscape/portrait selection follows the common aspect query. Review actual cover crops at all agreed viewport shapes; no duplicate orientation fetch without a concrete cause.
- New inner pages do not fetch background film. Film/poster/category bytes match the final frozen manifest in both runtimes.
- Existing native build commands pass; Pages packaging resolves local references, preserves media bytes and produces the project-base URLs.

## Comparison and release decision

Compare immersive motion, first-screen composition, header/menu, CTA, chapter rhythm and responsive behavior at the same full-size viewports. Explain concrete strengths and failures; no universal model ranking or automated aesthetic acceptance score.

Report functional checks, coordinator visual judgment and user creative acceptance separately. Only publish the new runtime after required checks and the standalone coordinator visual gate pass. User acceptance remains pending unless explicitly provided, and the case stays `building` while it is pending. The full implementation/publication request authorizes continued work after those gates pass. Commit intended files, merge main, push and verify the remote commit and deployed routes/assets before claiming release success. Preserve historical deliveries and raw transcripts outside Pages.
