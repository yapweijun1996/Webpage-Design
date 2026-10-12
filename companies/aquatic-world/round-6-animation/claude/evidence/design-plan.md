# Design plan — Home controlled animation (written before edits)

## Inputs inspected
- `input/animation/assets/hero-angelfish.png` (1882×836): angelfish occupies roughly x 53–93%; the left half is open dark water with light shafts, plants/driftwood along the bottom-left. Motion belongs in that quiet left half only.
- `input/reference/desktop.png`, `phone-390.png`: copy column + full landscape frame; caption row under the frame carrying the Play/Pause control; on phone copy and link come first, then the frame, then the control.
- Own baseline `baseline/home-desktop-first.png`, `home-mobile-first.png`, `contact-mobile-first.png`: full-bleed `object-fit: cover` hero with overlaid copy (desktop) and an art-directed fish crop (phone). Both crop the source and so cannot carry the new contract.

## What survives / what changes
- Keep: header (bar, nav, current indicators, compact Menu disclosure at <1100px), hero wording, eyebrow, display type, gold "Browse the collections" primary action to `/collections/`, quality secondary link, every section below the hero, all other pages, Contact.
- Change: Home hero only. Replace the cover/crop background with an opaque ocean-950 surface holding a copy column and a full, uncropped 1882/836 frame (the exact PNG, not the WebP derivatives or the fish crop).

## Composition
- ≥1100px: two-column grid, copy left (~0.85fr), scene right (~1.15fr), vertically centred. At 1280×800 the frame (~658×292) and its caption/control row sit together well inside the first viewport.
- <1100px (intermediate and phones): single column — eyebrow, H1, lead, actions first; then frame; then caption row with the control. Frame width = content width, height from aspect-ratio, so 320/360/390px show the whole fish and fins.
- Caption row: short honest caption ("Illustrative scene — still image, gentle light in the water") and the button; wraps on narrow phones without overflow.

## Motion (copied contract, own class names)
- One `.water-light` layer at left 3%/top 3%/46%×85%, 18s ease-in-out, translateY 0→6px→0, opacity .04→.09→.04.
- Ten 2px `i` particles inside `inset: 8% 52% 18% 4%`, the reference positions/delays/durations (16/20/22s), translate (0,0)→(5px,-8px)→(0,0), opacity .18→.42→.18. Same 0%/100% keyframes → matching endpoints, zero endpoint velocity with ease-in-out.
- Decorations `aria-hidden`, `pointer-events: none`, clipped by the frame. Hidden by `visibility` (never `display`) so phase is preserved; paused via `animation-play-state`.
- Global reduced-motion rule gets a scoped exclusion for the decoration layer so an explicit opt-in still uses the real durations; the decoration layer has its own reduced-motion guard keyed on opt-in.

## State owner (site.js, Home only)
`running = imageReady && inView && !document.hidden && !menuOpen && !userPaused && !policyStopped`.
- `policyStopped` starts true for reduced motion or exposed `saveData`; live change *to* reduce/saveData sets it; changing back never clears it. Only explicit Play clears `userPaused`/`policyStopped` and sets opt-in.
- Inputs: image load/error (plus already-complete check), IntersectionObserver (scroll/resize fallback), `visibilitychange`, the existing mobile menu `setMenu` (hooked, not reimplemented), `matchMedia` change, `connection.change` if exposed.
- Button: native `<button>`, visible text "Pause animation"/"Play animation" reflecting actual running state, 16px, ≥48px tall with fixed min-width, gold focus ring. `hidden` in markup; shown only after image readiness. No live region (no repeated announcements).
- No JS: `.no-js` hides decorations; button stays `hidden`. Image error: decorations off, button hidden, frame keeps its reserved ratio, visible fallback text shown, alt retained.

## Assets / build / serve
- Copy PNG byte-for-byte to `demo/assets/motion/hero-angelfish.png`; build copies to `dist/assets/motion/`. Add `.png: image/png` to the preview server MIME map.
- No new dependencies, no image regeneration.

## Checks I can run
Build; static `scripts/check-motion.mjs` (hashes, markup counts, keyframe/position values against the shared contract, no escaping runtime URLs, routes/404 present and distinct, four Contact groups, internal links/assets resolve); a simulated state-logic test of the motion owner (explicitly not browser evidence). Browser checks are not available in this run and will be recorded as not run.
