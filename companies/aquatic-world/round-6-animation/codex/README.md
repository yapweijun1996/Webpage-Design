# Aquatic World — Homepage Animation Integration

Status: authorized Home integration implemented and built; source/build self-review passed. Browser evaluation and user acceptance remain pending. This is a fictional website demo with illustrative imagery and a local Contact preview; nothing is sent or saved.

## Build and preview

Run from this workspace with the existing tooling; no dependency installation is needed:

```sh
python3 -B demo/build.py
python3 -B demo/serve.py --port 4231
```

The supplied `AQUATIC_PREVIEW_PORT` is 4231. The equivalent preview command is `python3 -B demo/serve.py --port "$AQUATIC_PREVIEW_PORT"`. After a permitted server start, Home is at `http://127.0.0.1:4231/`. The worker's actual attempt was denied by the filesystem/network sandbox at socket bind (`PermissionError: [Errno 1] Operation not permitted`); no HTTP responses or rendered preview were obtained. No preview process is left running. The coordinator can run the documented command in its permitted environment.

Source: [demo/build.py](demo/build.py), [demo/home-motion.css](demo/home-motion.css), [demo/home-motion.js](demo/home-motion.js). Built entry: [demo/public/index.html](demo/public/index.html). Existing shared [styles.css](demo/styles.css), [script.js](demo/script.js) and navigation/header are preserved. Only Home loads the new stylesheet/script. [serve.py](demo/serve.py) explicitly maps `.png` to `image/png`; its loopback-only behavior and honest custom 404 remain intact.

## Scene and behavior

The owned source is [demo/assets/hero-angelfish.png](demo/assets/hero-angelfish.png); the built copy is [demo/public/assets/hero-angelfish.png](demo/public/assets/hero-angelfish.png). Both preserve all 2,205,920 original bytes and SHA-256 `8e69f724fd29a138a438afa05739a77b81bc01e795eb115532fb8416efbeb3d1`. [Asset provenance](demo/assets/animation-provenance.json) records the supplied AI-generated illustration and demo limits. No re-encoding, new generation or image-size/performance improvement is claimed.

Home retains its English copy, collection CTA, Georgia/system typography and teal/gold palette. Opaque copy sits beside the complete 1882/836 scene on desktop and before it on phones. The image has no crop, recolor or transform. One low-opacity water-light layer and exactly ten deterministic 2px particles preserve the supplied positions, delays, 18s light and 16/20/22s particle cycles, easing and continuous endpoints. Decorations are clipped, aria-hidden and noninteractive. A fixed-width native 16px Play/Pause button sits outside the frame.

One Home state owner combines image readiness, user intent, sticky policy stop, viewport intersection, document visibility and the existing native mobile menu. Pause uses `animation-play-state`, retaining phase. Reduced motion and exposed Save-Data start static and latch new policy stops; returning to default cannot resume them. Explicit Play alone clears a stop, while image/visibility/menu gates still apply. A connection with no `change` event is sampled on normal lifecycle events; a silent live change cannot be detected immediately without a delivered event. No polling or fabricated native event evidence is used.

Without JavaScript, image/copy/CTA/native navigation remain HTML and decorations/dead controls stay hidden. An image error hides effects/control and shows fallback within the reserved frame. Seven inner pages and 404 retain byte-identical built HTML. Contact still has exactly Name, Email, Collection and Project groups, category prefill, validation, local preview, Edit and Clear.

## Checks and evidence

Actual commands completed:

```sh
python3 -B demo/build.py
node --check demo/home-motion.js
node --check demo/script.js
python3 -B evidence/check-static.py
node evidence/check-motion.cjs
```

- Build passed: eight distinct pages plus 404 in `demo/public/`.
- [51 static checks](evidence/static-checks.json) passed: frozen input/reference hashes, original PNG dimensions/bytes, all HTML links/fragments/assets/srcsets, Home-only resources, unchanged inner pages/header/shared files, four Contact groups and canonical motion geometry/timing/endpoints.
- [38 JavaScript fixture scenarios](evidence/motion-checks.json) passed in Node: readiness/error, manual Pause, policy stops/opt-in, visibility, existing menu Escape/focus callback, optional connection API and observer fallback. These are synthetic state checks, not browser/native signal evidence.
- [Three offline preview handler checks](evidence/preview-handler-checks.json) passed for PNG MIME and GET/HEAD custom-404 methods. [Loopback HTTP attempt](evidence/http-checks.json) failed at bind before any request; this limitation is retained.
- Python syntax was checked with `ast.parse` without bytecode artifacts. No browser automation, other agent/model, MCP, API, download, new dependency, credential change, Git action or publication was used.

[Design plan](evidence/design-plan.md) was written before edits. [Self-review](evidence/self-review.md) separates source evidence, layout estimates and unavailable browser checks. [Exposed tooling record](evidence/tooling.json) distinguishes requested model/effort from unexposed serving identity; the installed version query reported Codex CLI 0.162.1.

All requested actual rendered checks remain **not run by this worker**: 1280x800, 768x1024, 390x844, 360x800 and 320x800; complete 18s light cycle and phase preservation; keyboard/menu background behavior; native hidden/visible and policy signals; no-JS/error rendering; console; direct load/refresh/Back/Forward and collection-to-Contact journeys. The coordinator performs these through the common CUA environment. Build and script checks do not establish visual acceptance. User acceptance stays pending.

## Routes

| Page | Route | Built file |
| --- | --- | --- |
| Home | `/` | `demo/public/index.html` |
| Collections | `/collections/` | `demo/public/collections/index.html` |
| Ornamental Fish | `/collections/ornamental-fish/` | `demo/public/collections/ornamental-fish/index.html` |
| Aquatic Plants | `/collections/aquatic-plants/` | `demo/public/collections/aquatic-plants/index.html` |
| Driftwood | `/collections/driftwood/` | `demo/public/collections/driftwood/index.html` |
| Our Story | `/our-story/` | `demo/public/our-story/index.html` |
| Quality | `/quality/` | `demo/public/quality/index.html` |
| Contact | `/contact/` | `demo/public/contact/index.html` |
| Custom 404 | `/404.html` and unknown addresses | `demo/public/404.html` |
