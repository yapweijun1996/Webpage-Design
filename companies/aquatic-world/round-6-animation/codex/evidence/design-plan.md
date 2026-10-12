# Homepage controlled-animation design plan

Recorded before implementation on 2026-10-12. TASK.md authorizes this run and supersedes historical pending-execution wording. User acceptance remains pending.

## Evidence and scope

Read AGENTS.md, TASK.md, ACCEPTANCE.md, the animation contract/prompt/manifest and supplied HTML/CSS/JavaScript reference. Applied the frozen `input/skills/cli-web-design-director/SKILL.md` and its operation, prompt and design-review references. Inspected the original PNG, common desktop/390px captures and own baseline Home desktop/mobile and Contact mobile captures using a local image viewer. No other implementation was inspected. The routed `instruction-modules/` files are absent; use the supplied core and acceptance contract. KB/MCP retrieval and browser automation are prohibited for this run.

## Composition

- Preserve existing English brand wording, Georgia/system typography, teal/gold palette, current header and meaningful collection CTA.
- Replace only Home's cropped image/copy overlay with an opaque dark copy surface beside a complete landscape scene on desktop. Fit media and control together at 1280x800 by using a bounded two-column composition.
- At intermediate/phone widths, ordinary HTML copy and `/collections/` CTA precede the complete 1882/836 landscape scene. Reserve the frame before loading; place a stable 16px native playback button outside it. Keep both existing scene captions.
- Copy the exact PNG bytes to `demo/assets/hero-angelfish.png`; build into `demo/public/assets/hero-angelfish.png`. No derivative, source transform, crop, recolor, external runtime import or new dependency.
- Home-specific CSS and a Home-only motion script own the enhancement. Retain shared CSS, existing menu disclosure behavior and Contact script. Preserve these routes and page-specific content: `/`, `/collections/`, `/collections/ornamental-fish/`, `/collections/aquatic-plants/`, `/collections/driftwood/`, `/our-story/`, `/quality/`, `/contact/`, plus `/404.html`.

## Motion and interaction

Use the reference's one left-side water-light layer and exactly ten 2px points, with identical geometry, delays, durations, easing and matching endpoints. Pause with CSS animation-play-state to retain phase. Clip only decorations to the frame; make them aria-hidden and noninteractive. Do not reuse historical study links.

One state owner combines image readiness, user Pause, sticky policy stop, explicit opt-in, frame intersection, document visibility and the existing mobile menu's open state. Initial/live reduced motion and exposed Save-Data latch a static stop; a returning preference does not clear it. Explicit Play alone clears a stop but cannot override image/visibility/menu gates. Temporary suspensions retain intent. No polling; feature-detect live signal support and use event-driven visibility fallback if necessary. Reduced-motion CSS must allow explicit opt-in despite the inherited global animation suppression, while retaining suppression elsewhere.

No JavaScript: full image, copy, CTA and native navigation work; decorations and unavailable playback control stay hidden. Image error: stop/hide effects/control and show accessible fallback within the unchanged reserved frame. Contact retains exactly Name, Email, Collection and Project groups, category prefill, validation, local preview, Edit and Clear, with no-send disclosure.

## Verification and limits

Build with existing Python stdlib tooling. Check source/built PNG SHA-256, protected input hashes, route/link/asset resolution, inner-page byte preservation, header preservation, four Contact groups, script syntax, deterministic CSS and state transitions in a non-browser JavaScript fixture. Inspect source and record layout estimates as estimates only. Use the supplied AQUATIC_PREVIEW_PORT for a permitted loopback HTTP smoke check; do not take over unrelated processes. If needed, add an explicit PNG MIME mapping in the existing preview handler.

Real rendered checks at 1280x800, 768x1024, 390x844, 360x800 and 320x800; a full 18s cycle; keyboard/menu focus; no-JS/image failure rendering; console; history; genuine hidden/visible and native policy signals are unavailable to this worker and must be marked not run. The coordinator performs the common browser matrix. Preserve runtime/model evidence as exposed, without claiming a serving-model identity that is not exposed.
