# Aquatic World — Shared Immersive Home Brief v1

Prepared 2026-10-12 for Codex CLI `gpt-6.1-sol` and Claude Code CLI `claude-opus-5-5`. Current scope: design documentation only. Future implementation needs a later implementation instruction and the common approved media package described below.

## 1. Product outcome and evidence

The first impression should be entering a calm underwater world. Video fills the viewport behind the Home page from the header through the final Home content and footer. Navigation, headings, collection links and actions occupy the foreground of that continuous environment. The environment is present throughout ordinary scrolling, not confined to a hero panel that disappears after the first screen.

Within a few seconds a visitor should recognize the aquatic theme, understand the three collection families and find the collection action. The intended audience is trade buyers, aquascapers and aquarium enthusiasts; this is a design assumption from the [existing brief](../BRIEF.md) and [source context](../../research.md), not newly verified company research. All brand claims and imagery remain illustrative.

The user explicitly rejected the framed media presentation and requested an integrated top bar, headline and CTA. The earlier brief prescribed a solid copy column, separate landscape media, captions and visible playback controls. Both CLIs followed that direction. This new brief changes the composition contract rather than asking for more polish within the rejected layout.

Primary journey: Home → Collections → category detail → Contact → local enquiry preview. Watching a loop is optional; visitors can take an action immediately while media is loading or stopped.

## 2. Recommended visual concept: Beneath the Surface

One underwater scene forms the visual foundation. Gentle natural motion, restrained cream typography and a single sand-gold primary action supply the hierarchy. The fish is a subject within its habitat, with room around its complete silhouette. It should not look like an enlarged product photograph pasted behind a heading.

### Visual planes

| Plane | Design role |
| --- | --- |
| Environment | One silent, continuously looping aquarium scene fills the visible viewport on Home, including the area beneath the top bar. It remains behind all Home chapters. |
| Readability | Soft local gradients darken the header and text regions. They have feathered edges and reveal the water texture; they must not read as a separate opaque content column or boxed media panel. |
| Content | Live selectable headings, concise copy, collection links and CTA sit directly within that scene. They remain still while the environment moves. |
| Utilities | Menu, skip link, focus states and one discreet background-motion control remain independently usable. The motion control has much lower visual emphasis than the primary CTA. |

There is no video card, border, rounded frame, media caption, timestamp, timeline, volume bar, fullscreen button or large central Play button. There is no floating glass card behind the main heading. Additional bubbles, particle layers, cursor effects, zoom, parallax and scroll-controlled playback are outside this direction; the video already supplies the motion.

## 3. First-screen composition

These are starting composition targets. Real poster/video frames and typography must later be reviewed at the specified viewports; percentages do not establish a usable crop.

The [desktop and mobile static concepts](visuals/README.md) now illustrate this first-screen direction. They are shared visual references with rasterized UI, not runtime posters, video-generation first frames or evidence of implemented responsive behavior.

| Area | Desktop / landscape | Phone / portrait |
| --- | --- | --- |
| Environment | Edge-to-edge water, filling the visible viewport. Use a landscape master with ample water around the fish. | Edge-to-edge water, filling the visible viewport, from a separately composed portrait master. |
| Header | Wordmark at left; five page links at right on one baseline. Starting height 80px, side insets about 4–5%. | Wordmark at left, Menu at right. Starting height 64px, side insets 20px. |
| Fish and long fins | Right half, approximately x=54–94%, y=15–87%; all extremities retain breathing room. | Upper/middle scene, approximately x=12–88%, y=14–53%; full silhouette above the main copy. |
| Main copy | Left quiet water, starting x=7%, y=32–38%; width about 38%, adjusted to real wrapping. | Lower quiet water, starting around y=57%; width equals viewport minus side insets. |
| Heading | Two deliberate lines, around 64px at 1280px width; larger screens may reach 80px. | Two or three balanced lines, 36–44px, based on width. |
| Supporting copy | 18px, about 40 characters per line. | 16–18px, usually two lines. |
| Primary CTA | Directly below copy, approximately 52px high, with one restrained arrow. | At least 48px high, below copy, fully reachable without covering the fish. |
| Motion utility | Bottom-right viewport corner, 44×44px minimum target. | Bottom-right with device-safe inset; separate from the CTA and browser controls. |

The initial hero occupies approximately one visible screen. Content and controls must fit the actual visible area, not assume that browser chrome is absent. Allow normal scrolling and content growth on short screens or text enlargement instead of clipping, shrinking body text or locking the page. Essential UI is present immediately; no opening film, splash screen or staged title animation delays access.

### Shared first-screen copy

| Element | Exact proposed English copy |
| --- | --- |
| Eyebrow | FISH · PLANTS · DRIFTWOOD |
| Heading | A world beneath / the surface. |
| Description | Discover ornamental fish, aquatic plants and natural driftwood. |
| Primary action | Explore the collections |
| Small scroll hint | Scroll to explore |

The slash denotes an intended line break, not displayed punctuation. The scroll hint is quiet, noninteractive text; do not style it as a dead button. The primary action opens `/collections/`, not a Home section anchor. Avoid duplicate slogans, image captions, technical motion explanations or multiple competing first-screen actions.

## 4. Top bar integrated with the environment

At the top of Home, the water remains visible behind the header. A shallow dark gradient protects the cream wordmark and navigation throughout the clip. No separate opaque teal stripe, heavy border, oversized navigation pill or highly reflective glass effect appears above the scene.

Desktop destinations remain Home, Collections, Our Story, Quality and Contact. The exact current destination has a subtle underline as well as color. Hover and keyboard focus remain visible without moving labels or changing header dimensions. Header links are at least 16px; keep the wordmark legible. Switch to the compact menu before links collide at intermediate widths.

Home has one dominant first-screen CTA in its main copy. Omit the duplicate filled "Discuss a project" button from the Home header; Contact remains a clear page destination. This is a Home-specific presentation change. Inner-page header behavior, destinations and enquiry action stay intact.

During Home scrolling, the header becomes slightly darker and remains compact so it is readable against each chapter. Its background still belongs to the underwater environment. It must not hide focused elements or become an unrelated solid band.

On phones and compact widths, opening Menu pauses the background and presents a readable deep-teal navigation surface with the same five page destinations. Provide an explicit Close action, Escape dismissal, correct focus return and background isolation appropriate to the chosen menu pattern. Opening or closing Menu never clears an explicit user Pause. Links and the primary journey remain available when JavaScript is absent.

## 5. The whole Home page, not only its hero

Use three concise chapters over the continuous background. The scene stays in the viewport while the foreground content scrolls normally. It does not restart, seek, move with the pointer, become a smaller rectangle or vanish at a section boundary. Use a darker local wash for later reading regions while leaving some water, light and subject detail visible. No hard switch into white or cream content bands on Home.

| Chapter | Foreground content and placement | Action / destination |
| --- | --- | --- |
| 1 — Arrival | The first-screen copy and scene described above. | Explore the collections → `/collections/` |
| 2 — The collection | Heading "Three elements. One aquatic world." Three spacious editorial entries in the quiet left/center region, separated by restrained rules rather than heavy cards. Preserve a visible area of moving water beside them. | Ornamental Fish → fish detail; Aquatic Plants → plant detail; Driftwood → driftwood detail; one overview link → Collections |
| 3 — Perspective and enquiry | Heading "A closer connection to nature." One concise perspective sentence, understated Story and Quality links, then the enquiry action. Keep the environment visible around the reading area. | Our Story, Quality, and Discuss a project → their respective pages |

Shared collection descriptions: Fish — "Colour, form and gentle movement." Plants — "Texture, depth and a living landscape." Driftwood — "Natural lines and structure."

Shared final perspective sentence: "Explore the elements of an aquatic landscape, and the questions that shape it." Final action: "Discuss a project" → `/contact/#enquiry`.

Finish with a compact footer over the same environment. Retain useful navigation and one concise fictional-demo disclosure. Keep media provenance and implementation notes in documentation rather than adding technical captions to the visitor experience. Lower chapters can adapt their layout to fit real content; they should not repeat full-screen titles or stretch the site into empty cinematic screens.

## 6. Site architecture retained

| Navigation / action | Independent destination |
| --- | --- |
| Logo and Home | `/` |
| Collections and primary Home CTA | `/collections/` |
| Ornamental Fish | `/collections/ornamental-fish/` |
| Aquatic Plants | `/collections/aquatic-plants/` |
| Driftwood | `/collections/driftwood/` |
| Our Story | `/our-story/` |
| Quality | `/quality/` |
| Contact / enquiry | `/contact/` / `/contact/#enquiry` |

Keep all eight independent pages, direct loading, refresh and Back/Forward. Resolve routes and assets under the GitHub Pages project base as well as local previews. Global navigation must not become Home scroll links. This iteration changes Home composition and its header theme; the other seven pages, category enquiry context, four-group Contact validation/local preview/Edit/Clear and honest no-send behavior are preserved. Inner pages do not load the Home background film.

## 7. Media composition and current readiness

The [selected source image](../../comparison/assets-v1/hero-angelfish.png) was visually inspected for this design. It has quiet dark water at left, a striped fish at right, long fins, plants and driftwood. The proposed text placement is a design inference from those visible features.

| Existing asset | Recorded status |
| --- | --- |
| Original image | 1882×836; 2,205,920 bytes; SHA-256 `8e69f724fd29a138a438afa05739a77b81bc01e795eb115532fb8416efbeb3d1`; [AI illustration provenance](../../comparison/assets-v1/asset-manifest.json). |
| Runway samples 01 and 02 | Historical landscape drafts, not approved background masters. The [refinement review](../motion-v1/trial-v1/REFINEMENT.md) records scale/orientation variation and a visible end-to-start jump. |
| Approved landscape loop and matching poster | Not available. |
| Approved portrait loop and matching poster | Not available. |

Do not simply enlarge the current 16:9 trial or center-crop it into a tall phone viewport. A portrait cover crop would lose the left copy space and long fins. Prepare two centrally art-directed compositions from the same illustrative source: landscape with the fish right and copy space left; portrait with the fish above and copy space below. Expanding the water environment is preferable to stretching the subject. Static interface mockups now illustrate the proposed compositions; clean scene masters, video-generation first frames and runtime posters have not been prepared or approved.

Target one locked-camera shot: restrained fin motion, slight plant movement and soft water light. Hold fish identity, scale, orientation and subject position. Avoid new animals, deforming stripes, dramatic camera travel, rapid lighting changes and motion that enters the text zones. Prefer an approximately 8–12 second natural loop; duration and supported output resolution are preparation decisions to verify against the chosen provider before any later quote or generation. No provider recommendation or spending approval is implied here.

Preserve the complete subject in each delivered composition with at least roughly 5% breathing room around fin extremities. Confirm this across the whole clip and the actual target viewport crops, not only frame zero. Target 16:9 landscape and 9:16 portrait masters with enough overscan for the intermediate and wide desktop views. Each still poster matches its corresponding clip's opening composition and framing.

Before paired implementation, the coordinator supplies one common package: desktop and portrait video, matching posters, common frame-safe-area references and a manifest recording hashes, dimensions, duration, encoding, provenance and actual creative approval. Choose the landscape/portrait transition centrally after reviewing the same tablet/wide-screen cases; both workers use that same decision. Workers do not generate their own video, repair their own seam, select a different clip, recolor the fish or independently alter the media crop contract.

Both workers receive identical media bytes. Their page composition can be judged independently, but a missing approved loop must not be disguised as a passed immersive-video delivery using static-image particles.

## 8. Playback, fallback and accessibility

Normal eligible entry uses silent inline playback and a verified continuous loop. Do not enter device fullscreen. A matching poster already occupies the whole background while video loads; text, navigation and CTA remain usable. A subtle poster-to-video transition may occur once without a black flash or layout jump.

| State | Visitor experience |
| --- | --- |
| Video ready / autoplay allowed | The environment moves gently; a small Pause background icon is available. |
| Manual Pause | Freeze the current frame. Navigation and scrolling work. The discreet control changes to Resume background. Remember this choice within the tab session, including inner-page visits and return. |
| Reduced motion or an exposed data-saving preference | Poster environment by default, without automatic video download/playback. Optional explicit Play background action stays in the corner, never in the center. A change toward reduced motion stops playback; reversing that preference alone cannot erase the stop. |
| Autoplay blocked | Keep the poster and usable page; a small Play background action may invite explicit opt-in. A second denied attempt leaves the poster, without retry loops. |
| Loading / stalled playback | Keep the last usable frame or matching poster and all actions. No blocking spinner, progress screen or empty black stage. |
| Missing/invalid video | Use the poster and hide a motion action that cannot work. |
| Video and poster both missing | Deep-teal background with readable content and usable navigation; record media failure in QA. |
| Menu open / tab hidden | Suspend playback. Resume only when prior intent and motion policies still allow it. Temporary suspension never overrides a manual stop. |
| Leaving Home / Home scrolling | Leave Home: stop its playback. Scroll within Home: keep the same background timeline, without resets or section-triggered clips. |
| JavaScript unavailable | Same full-page poster environment, useful text/links and working navigation; no dead motion utility or required intro animation. |

The small motion utility is a real keyboard button, visually represented by a pause/resume icon, with a descriptive accessible action name and a visible explanation on hover/focus. The hit area is at least 44×44px. It sits on a subtle local dark surface, away from the CTA and fins. It remains available through Home scrolling but never resembles a player toolbar. Decorative media is not focusable and is hidden from assistive technology; essential meaning is supplied by actual page text, not baked into video frames.

Use cream text over controlled dark regions. Normal text meets 4.5:1 contrast; qualifying large display text and meaningful control graphics meet 3:1. Inspect bright and dark moments from the moving background as well as the posters. Readability gradients may become stronger locally; they must preserve the environmental composition. Keep visible focus and a working skip link. No mandatory sounds, flashing highlights or continuous text movement.

Silent playback still needs a reliable fallback: [MDN autoplay guidance](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay) describes policy-dependent playback and poster fallback. A discreet pause mechanism also serves automatically moving content alongside page content: [W3C SC 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html). Sources accessed 2026-10-12. These references support the requirements, not a claim that an unbuilt design has passed accessibility checks.

## 9. Shared visual foundations and implementation boundaries

Use abyss teal `#041D25`, warm cream `#F3F0E7` and restrained sand gold `#D4BE89` as starting color roles. Display type is Georgia; supporting text and controls are Arial with ordinary system fallbacks. Both workers use this same typographic direction for the first comparison. No new external font download is required. Actual text wrapping, contrast and rhythm matter more than forcing a fixed screenshot shape.

CTA surfaces are simple and proportionate, with stable hover/focus states. Use restrained rules and consistent spacing; avoid dashboard-style cards, badges and decorative UI labels. The brief's numerical values guide composition, while [comparison gates](COMPARISON.md) determine the observable result.

Future work belongs in fresh independent copies of each worker's own current `round-6-animation` implementation. Preserve originals, their inputs and historical evidence. No sibling runtime imports, cross-reading or shared mutable implementation. A later publication update must explicitly point the packager to the new completed versions; creating this brief does not change the existing GitHub Pages demo.

The website runtime has no generation API, credential, provider request, tracking or external enquiry. It plays locally supplied common media. Image/video generation, paid trials, new dependencies and deployment are separate from this design task. Functional checks, visual judgment, user acceptance and untested device behavior must be reported separately.
