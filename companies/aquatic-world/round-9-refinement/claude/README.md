# Aquatic World — Fusion Home

Status (2026-10-13): The Stage 2 motion-label correction is implemented and built. Rendered browser
review and publication by the coordinator are still pending.

- The background-motion label (Play/Pause/Resume background) no longer clips at 320px with 200% text.
  It wraps between words within the space left of the 44px button and grows upward.
- Normal-text placement, the target, the focus ring and the accessible name are unchanged.
- `npm run check`: 150/150 static, 79/79 logic.
- See [evidence/stage-2/self-review.md](evidence/stage-2/self-review.md) and
  [evidence/stage-2/delivery.md](evidence/stage-2/delivery.md).

The earlier Fusion Home v2 refinement is recorded in [evidence/self-review.md](evidence/self-review.md)
and [evidence/delivery.md](evidence/delivery.md).

v2 changes:
- Opaque `#041D25` Home header row once scrolled (from 5px) and while the menu is open.
- Transparent arrival at the top.
- Abyss-teal menu panel.
- Restored-scroll and bfcache handling.
- Safe-area-aware short-landscape bottom padding.

## Build and preview

Requires Node ≥ 22. There are no dependencies to install.

```sh
cd demo
npm run build      # writes demo/dist/ (base "/")
npm run serve      # http://127.0.0.1:4192/  (--port=N or AQUATIC_PREVIEW_PORT to change)
# or: npm run preview   (build + serve)
```

For a sub-path deployment such as GitHub Pages, build with a base, e.g.
`node scripts/build.mjs --base=/Webpage-Design/aquatic-world/claude/`, and publish `demo/dist/`.

## Checks

```sh
cd demo
npm run build
npm run check      # static source/output assertions + simulated controller logic (no browser)
```

`npm run verify` and `scripts/shots.mjs` drive Chrome over CDP and need a running preview. They were
not run in this worker session (browser automation was not permitted), and `verify.mjs` predates the
immersive Home.
