# Aquatic World — Homepage Animation Integration

Status: Home controlled-animation integration implemented and built in this independent copy of the round-5 site. Worker static/script checks pass; **browser checks not run by the worker** (coordinator evaluates). User acceptance pending.

Fictional design case; the hero image is an AI-generated illustrative scene. The Contact page previews an enquiry locally and sends nothing.

## Build and preview
Node ≥ 22, no dependencies.

```sh
cd demo
npm run build                         # writes demo/dist (8 routes + 404.html)
npm run check                         # static + simulated state-logic checks (no browser)
AQUATIC_PREVIEW_PORT=4232 npm run serve   # http://127.0.0.1:4232/  (default 4192; or --port=N)
npm run preview                       # build, then serve
```

`npm run verify` and `scripts/shots.mjs` drive headless Chrome over CDP; they were not run in this restricted worker run.

## Paths
- Source: `demo/src/` (`pages.mjs` Home scene, `site.css`, `site.js` motion state owner), `demo/scripts/build.mjs`, `demo/scripts/serve.mjs`.
- Owned image: `demo/assets/motion/hero-angelfish.png` (exact supplied bytes, sha256 `8e69f724fd29a138a438afa05739a77b81bc01e795eb115532fb8416efbeb3d1`) → `demo/dist/assets/motion/hero-angelfish.png`.
- Build output: `demo/dist/`. The preview server maps `.png` to `image/png`.

## Evidence
- `evidence/design-plan.md` — plan written before edits.
- `evidence/implementation-notes.md` — changes, motion/state table, checks run, checks not run.
- `evidence/static-checks.txt` — `npm run check` output (40 static + 34 simulated logic checks).
- `evidence/http-checks.txt`, `evidence/http-serve.log` — curl route/asset/MIME/hash checks against an owned, stopped preview server.
- `evidence/process-run.json`, `cli-events.jsonl`, `cli-stderr.log` — coordinator run records (not written by the worker).
