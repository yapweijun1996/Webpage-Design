# Stage 1 design and state plan — Immersive Home (Claude Code worker)

Written before editing `demo/`. Sources: `TASK.md`, `ACCEPTANCE.md`, `input/immersive-home/STAGE.md`, `BRIEF.md`, `COMPARISON.md`, the frozen `cli-web-design-director` skill (SKILL.md, design-review.md, prompt-patterns.md) and the own baseline in `baseline/demo` (identical to the starting `demo/`).

## Inputs inspected (as images, not paths)

| Input | Observation used for the layout |
| --- | --- |
| `input/reference/desktop-v1.png` | Wordmark left / five links right on one baseline over water; copy block at left ≈ x 7–43 %, eyebrow ≈ y 27 %, two-line serif heading, two-line body, one sand-gold CTA; fish right ≈ x 54–94 %; quiet "Scroll to explore" at bottom centre; small round pause at bottom right. Direction only, never a runtime image. |
| `input/reference/mobile-v1.png` | Wordmark + "Menu" at top; fish in upper/middle third; copy block starts ≈ y 61 %; full-width gold CTA; scroll hint bottom centre, pause bottom right. Direction only. |
| `input/media/landscape-generation-frame.png` (1280×720) | Dark, quiet water across the left ≈ 0–50 % between y 25–60 %; light rays strongest at top centre; angelfish ≈ x 56–80 %, y 31–70 % incl. trailing fins; driftwood/plants along the bottom. |
| `input/media/portrait-generation-frame.png` (720×1280) | Light rays top; angelfish ≈ x 28–70 %, y 20–46 %; the lower half (y ≈ 60–95 %) is dark plants/water suitable for copy. |
| `input/media/*-poster.webp` | 1280×720 and 720×1280, SHA-256 equal to `poster-manifest.json`. Copied byte-for-byte to `demo/assets/immersive/`. |

## Route / content / action table (unchanged architecture)

| Route | Content | Primary action |
| --- | --- | --- |
| `/` | Immersive Home (rebuilt) | Explore the collections → `/collections/` |
| `/collections/` | Index (unchanged) | Category detail pages |
| `/collections/ornamental-fish/`, `/aquatic-plants/`, `/driftwood/` | Category detail (unchanged) | `/contact/?interest=<slug>#enquiry` |
| `/our-story/`, `/quality/` | Unchanged | — |
| `/contact/` | Four-group form, local preview, Edit, Clear (unchanged) | Local preview only, nothing sent |
| `/404.html` | Unchanged | Links back |

Primary journey: Home → Collections → category → Contact (prefilled) → local preview. Global links are real page URLs; the only in-page anchors on Home are the skip link and "Back to top".

## Home composition

* **Environment plane** — `div.home-env` (fixed, `inset:0`, `z-index:-1`, `aria-hidden`) rendered before the header: a `<picture>` poster (`<source media="(min-width: 900px) and (min-aspect-ratio: 6/5)">` landscape, `<img>` portrait fallback) and one `<video muted playsinline loop preload="none">` with **no `src`** and literal `data-landscape-src` / `data-portrait-src` attributes. Both use `object-fit: cover; object-position: 50% 50%`, no transforms. The body background on Home is abyss teal `#041D25`, so a missing poster and video leave a readable deep-teal page.
* **Readability plane** — no boxes. Header: shallow top gradient (darker translucent teal + feathered fade once scrolled). Hero: a left-weighted feathered gradient on landscape, a bottom-weighted gradient on portrait. Chapters 2–3 and footer: a horizontal wash that fades to transparent toward the right on landscape (water stays visible beside the text) and a vertically feathered wash on portrait. Maximum alpha ≈ 0.8, never a solid column or white band.
* **Content plane** — live text over the scene:
  * Chapter 1: eyebrow "FISH · PLANTS · DRIFTWOOD", h1 "A world beneath / the surface." (explicit `<br>`), description, one gold CTA "Explore the collections" → `/collections/`, quiet non-interactive "Scroll to explore". Hero min-height = visible viewport minus header (`100svh`), content grows on short screens/zoom. Landscape: copy at x = 7 vw, vertically centred (≈ y 32–38 % start), max width ≈ 38 vw. Portrait: copy anchored to the bottom (≈ y 56 %+), full width minus 20 px insets.
  * Chapter 2: "Three elements. One aquatic world." — three ruled editorial entries (name link + brief description + arrow) to the three category pages, plus "View all collections" → `/collections/`.
  * Chapter 3: "A closer connection to nature." + the shared sentence, understated "Our Story" / "Quality" links and "Discuss a project" → `/contact/#enquiry` as a quiet outlined button so the hero keeps the only gold CTA.
  * Compact Home footer over the same environment: wordmark, page links, category links, one fictional-demo disclosure, Back to top.
* **Typography (Home only)** — `body.page-home` redefines `--serif: Georgia…` and `--sans: Arial…`; inner pages keep their baseline fonts. Heading `clamp(2.25rem, 5vw, 5rem)` (≈ 64 px at 1280), body 18 px desktop / 17 px phone.
* **Header (Home only)** — same five links, no "Discuss a project" header button or divider, wordmark only (mark hidden), cream text, gold current underline, 80 px desktop / 64 px compact, side inset ≈ 4.5 vw. Compact Menu at < 1100 px (shared breakpoint, earlier than the 900 px media switch as STAGE.md allows). The open menu keeps the existing deep-teal panel, Close label, Escape + focus return, outside-click dismissal and scroll lock. Inner-page headers unchanged.
* **Motion utility** — a real `<button data-bg-toggle hidden>` placed right after the header (early in tab order), fixed bottom-right with safe-area insets, 44×44 px round target on a subtle dark surface, pause/play icon and a text label that appears beside it on hover/focus (and is the accessible name). Hidden without JS and while the menu is open.

## Removed from Home

The framed `figure.home-scene`, its caption and "Play animation" button, the water-light layer, ten particles and their keyframes, the image-card collection grid, the cream Story split, the paper Quality band and the photographic enquiry band. Their CSS is deleted where Home-only; `.principles`, `.cat-card`, `.section-head--row` etc. stay for inner pages. The build no longer copies the unused `assets/motion` PNG.

## Playback state model (`site.js`, Home only)

Inputs: `userPaused` (sessionStorage `aquatic-world:background-paused`, survives inner-page visits and return), `policyStopped` (reduced motion or exposed Save-Data / `prefers-reduced-data` at entry, or a later change toward them; cleared only by an explicit Play), `failure` (`null | blocked | denied | error`), suspension (`document.hidden`, menu open), orientation (`matchMedia` built from the `<source media>` attribute, no hard-coded query or URL in JS).

| State | Behaviour |
| --- | --- |
| Eligible entry | Attach `src` for the matching orientation (read from the data attribute), `play()`; video fades in once on first `playing` over the matching poster. Button: Pause background. |
| Manual Pause | `pause()` on current frame; store session flag. Button: Resume background. On a later Home visit, no `src` is attached (poster only) until Resume. |
| Reduced motion / Save-Data | No `src`, no download. Button: Play background (corner opt-in). A change toward the policy stops playback; reversing it alone does not resume. |
| Autoplay blocked (`NotAllowedError`) | Poster stays; Button: Play background. A second denial after explicit Play → `denied`, button hidden, no retry loop. |
| Loading / stalled | Poster (or last frame once shown) stays; no spinner. |
| Missing / invalid video (`error` event or `NotSupportedError`) | Poster; button hidden. **This is the expected Stage 1 runtime state for eligible visitors, because the MP4s are intentionally absent.** |
| Poster missing | `data-poster="error"` hides the image; deep-teal page. |
| Menu open / tab hidden | `pause()`; resume only if intent and policy still allow; never clears a manual Pause. |
| Orientation switch | Poster switches via `<picture>`; an attached video `src` is dropped and reattached for the new orientation only when playback is wanted. |
| Leaving Home (`pagehide`) | `pause()`; `pageshow` re-reads the session Pause. |
| No JavaScript | Poster environment, all links, no motion control. |

## Known risks to hand to the coordinator

* Centred cover of the 9:16 portrait master at near-square viewports that fail the 6/5 aspect query (e.g. 900×900, 1000×900, 1024×1024) crops the top of the frame enough to approach or clip the dorsal fin. The query and centring are common decisions, so they are not altered here.
* Contrast over the moving film, loop joins, inline playback, autoplay policy and every rendered layout are **not run** in this stage (no browser available; films absent).
