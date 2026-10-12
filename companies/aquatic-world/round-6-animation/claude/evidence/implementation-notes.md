# Home controlled animation — implementation and self-review

Status: implemented and built; worker static/script checks pass. **Browser checks not run (unavailable to this worker). User acceptance pending.**

## Run information (as exposed)
- CLI: Claude Code 2.1.289 (`claude --version` inside the run). Requested/exposed model: `claude-opus-5-5` (per `evidence/process-run.json`, written by the coordinator). Effort: not exposed.
- Tools used: Read, Write, Edit, Bash. No MCP, other model, agent, network, API, browser or OS automation.

## Source and build paths
| Item | Path |
| --- | --- |
| Owned source image (exact bytes, sha256 `8e69f724…3d1`) | `demo/assets/motion/hero-angelfish.png` |
| Built image | `demo/dist/assets/motion/hero-angelfish.png` → served at `/assets/motion/hero-angelfish.png` |
| Home scene markup | `demo/src/pages.mjs` (`homeScene()`, `home()`) |
| Scene/hero CSS, keyframes, reduced-motion scoping | `demo/src/site.css` ("Home" block, phone hero rule, `prefers-reduced-motion` rule) |
| Motion state owner | `demo/src/site.js` ("Home: ambient scene motion"), hooked into the existing `setMenu` |
| Build copy step | `demo/scripts/build.mjs` (`assets/motion` → `dist/assets/motion`) |
| Preview PNG MIME | `demo/scripts/serve.mjs` adds `".png": "image/png"` (previously served as `application/octet-stream`) |
| Checks | `demo/scripts/check-motion.mjs`, `demo/scripts/check-motion-logic.mjs` (`npm run check`) |

Nothing at runtime references `input/`, `baseline/`, the reference study or another workspace (checked over all built HTML/CSS/JS). The WebP hero derivatives remain in `assets/img` but Home no longer uses them; no image was generated or re-encoded.

## What changed (Home only)
- The cover-fit full-bleed hero and the phone fish crop were replaced by an opaque `--ocean-950` hero: copy column + full 1882/836 frame (`object-fit: contain`, frame `aspect-ratio: 1882 / 836` reserved before decode, no transforms).
- ≥1100px: copy left, scene right, centred. <1100px (intermediate, phones): eyebrow, H1, lead, "Browse the collections" and quality link come first; frame, then caption row with the control.
- Header, nav/current indicators, compact menu, all sections below the hero, the other seven pages, 404 and Contact are unchanged in markup and styling. `verify.mjs` REV-B/BUILD-01 were updated to assert the new full-frame hero instead of the retired crop (not run — see below).

## Motion contract as implemented
- One `.water-light` (left/top 3%, 46%×85%, 18s ease-in-out, translateY 0→6px→0, opacity .04→.09→.04).
- Ten 2px round particles in `inset: 8% 52% 18% 4%` with the reference positions, negative delays and 16/20/22s durations; translate (0,0)→(5px,−8px)→(0,0), opacity .18→.42→.18. 0%/100% share one keyframe → identical endpoints, zero endpoint velocity under ease-in-out. Rightmost possible particle x ≈ 44.5% + 5px, left of the fish (mouth ≈ 54%).
- Layer is `aria-hidden`, `pointer-events: none`, clipped by the frame, and toggled with `visibility` + `animation-play-state` only (never `display`, never restarted), so Pause freezes phase and Play continues it.
- The site-wide reduced-motion rule (`animation-duration: 0.01ms !important`) now excludes `.water-effects` and descendants, so an explicit opt-in under reduced motion uses real timing; a scoped reduced-motion rule keeps decorations paused unless `data-opt-in="true"`.

## State table
`running = imageReady && inView && !document.hidden && !menuOpen && !userPaused && !policyStopped`

| State/event | Behaviour |
| --- | --- |
| No JavaScript | `.no-js` hides decorations (`display:none`); button keeps its `hidden` attribute; image, copy, CTA, nav usable |
| Image loading | Decorations hidden, button hidden |
| Image ready (load or already complete) | Button shown; runs if other gates permit — "Pause animation" |
| Image error (event or already broken at init) | `data-image="error"`: decorations/button hidden, image visually hidden, frame keeps ratio, visible fallback text, alt retained |
| Pause | `userPaused`; play-state paused; label "Play animation" |
| Play | Clears `userPaused` and `policyStopped`, sets opt-in; runs only if image/view/visibility/menu gates allow |
| Fully offscreen (IntersectionObserver, rect fallback) | Suspends; re-entry resumes only if not paused/stopped |
| Document hidden | Suspends; return resumes only if allowed |
| Compact menu open (existing disclosure) | Suspends via `setMenu` hook; Escape/outside click/focus-out close behaviour and trigger-focus return unchanged |
| Reduced motion initially / Save-Data true initially | `policyStopped`: still image, decorations hidden, "Play animation" opt-in |
| Live change to reduce / Save-Data `change` to true | Stops immediately, hides decorations, clears opt-in |
| Preference returns to default | No automatic resume |

Label text only changes when running state changes; no live region, so no repeated announcements. Button: native `<button>`, 16px/600 label, 48px tall, 196px min-width (stable across label swap), gold 2px focus ring.

## Checks performed (worker, non-browser)
| Check | Result | Evidence |
| --- | --- | --- |
| `npm run build` | exit 0, 8 routes + 404 | console |
| `npm run check` → `check-motion.mjs` (40 static checks: hashes, markup counts, CSS values compared with `input/animation/styles.css`, no runtime escapes, routes/H1/titles distinct, scene only on Home, current indicators, four Contact groups, links/src/srcset resolve, no dependencies) | 40/40 pass | `evidence/static-checks.txt` |
| `check-motion-logic.mjs` — built `site.js` in a Node vm with stub DOM and **synthetic** events (pause/play, offscreen, hidden, menu, Escape focus return, live/initial reduce, Save-Data, image error/complete, IO fallback) | 34/34 pass | `evidence/static-checks.txt` |
| `node --check` on all JS/MJS | pass | console |
| HTTP: owned `serve.mjs` on `AQUATIC_PREVIEW_PORT` 4232, curl 8 routes, prefilled Contact, 404, trailing-slash redirect, PNG/CSS/JS | all expected statuses; PNG `image/png`, 2,205,920 B, sha256 matches; server pid stopped, port free afterwards | `evidence/http-checks.txt`, `evidence/http-serve.log` |
| `input/animation` file hashes vs `input-manifest.json` | match (unchanged) | console |

The simulated logic test proves only the state owner's transitions under stubbed objects; it is not evidence of real media-query, Save-Data, visibility or IntersectionObserver delivery, or of rendering.

## Not run (unavailable to this worker)
All browser checks: rendered layout at 1280×800, 768×1024, 390×844, 360×800, 320×800; overflow and image/control rectangles; actual moving/paused frames and a full 18s light cycle; keyboard focus and menu focus/close in a browser; real reduced-motion (initial/live), Save-Data and hidden-tab signals; no-JS rendering; image-error rendering; console errors; Back/Forward and Contact journeys in a browser. `npm run verify` / `shots.mjs` (Chrome via CDP) were deliberately not run. Visual composition values above (e.g. 1280×800 frame ≈ 658×292 with the control inside the first viewport) are source-based estimates, not measurements.

## Deviations / notes
- One stray write outside the workspace: a build log to `/tmp/aw-build.log` during a check; deleted immediately in the same run. No other outside writes.
- An initial curl loop failed because a zsh loop variable named `path` overwrote `PATH`; rerun with a different variable name. The failed attempt's server was stopped.

User acceptance: pending.
