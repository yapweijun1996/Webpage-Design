# Aquatic World — Local Desktop Home

Prepared **2026-10-15, Asia/Singapore** after the user approved the v3 movie and requested a local desktop homepage with loop/copy inspection. This is a coordinator-owned adaptation of the existing Codex source, separate from the frozen paired CLI comparison. The published websites are unchanged.

**Final delivery:** the user requested closure, commit and merge to `main` on 2026-10-15. [Delivery record](DELIVERY.md) closes the local adaptation and comparison with the existing loop default and documented media limits. No further playback decision or paid generation is required to close this work. Earlier acceptance/pending statements below describe the review state when those checks were recorded.

## Preview

From the repository root:

```sh
python3 -B companies/aquatic-world/redesign/cinematic-home-v2/desktop-home-v1/demo/build.py
python3 -B companies/aquatic-world/redesign/cinematic-home-v2/desktop-home-v1/demo/serve.py --port 4285
```

Open [the local Home](http://127.0.0.1:4285/). The loopback server supports byte ranges and serves eight real pages plus an honest 404. Generated `demo/public/` is ignored and rebuilt from this package.

The user-authorized [playback comparison](http://127.0.0.1:4285/playback-comparison/) adds single-play and continuous-loop versions of this same Home. [Study notes](PLAYBACK-COMPARISON.md) describe their behavior. The default Home still loops; a preferred mode has not been selected.

## Adaptation

- Exact accepted raw movie, silent inline forward playback at 1x. [Media manifest](asset-manifest.json) records unchanged bytes and zero new media cost.
- Left title/body/action share an opaque deep-water reading core with soft outer edges. Fish continue their original route behind that UI region. The treatment protects copy; it does not change the source trajectory.
- A 26px desktop wordmark, responsive 56–64px title and cream outlined collection action retain the accepted language and right-side lead.
- Three existing AI category images form alternating editorial chapters. [Canonical provenance](../details/README.md) identifies them as illustrative assets.
- Existing inner pages, category context and the local Contact preview/Edit/Clear are retained from the [Codex baseline](../../../round-9-refinement/codex/README.md).
- Portrait uses its separately composed accepted still. No portrait video exists or is fetched.
- Manual Pause/Play, session pause persistence, menu suspension, reduced-motion/Save-Data poster defaults and media failure fallback remain.

[Layout plan](LAYOUT-PLAN.md) defines the scope. [The original movie review](../media/kling-loop-v1/trial-v3/README.md) and its human decision remain distinct from local UI acceptance.

## Verification and limits

The initial local adaptation checks are preserved in the [baseline verification](evidence/desktop-baseline-runtime/verification.json) and [review](REVIEW.md). [Current verification](verification.json) records the subsequent playback comparison: 24 targeted checks and 43 existing interaction checks passed. The following initial layout results remain historical evidence; changed baseline source files are archived beside their original record.

- Ten viewport sizes have no horizontal overflow and retain at least 16px first-screen action clearance. Portrait is a static fallback.
- At five desktop sizes, the entire painted copy box is pixel-identical at 0, 4, 7.5 and 9.99 seconds. The opaque reading core prevents fish/background changes from crossing its text and button.
- Four complete forward plays at 1x cover all 241 source frames per play, with four wraps and 965 total callbacks. The scene resets at the join. [Exact final frame](evidence/endpoint-last.png), [exact first frame](evidence/endpoint-first.png) and [their timestamp record](evidence/endpoints.json) bind the visual comparison to source frames 240 and 0.
- 43 interaction checks pass, including real routes, local Contact preview/Edit/Clear, menu focus/dismissal, manual pause persistence, reduced-motion/Save-Data defaults and injected movie/autoplay failures. The unknown-route 404 and injected failures are expected negative tests.
- Burst requests reproduced ten connection failures in 24 requests on the initial server. HTTP/1.1 connection reuse and a 128-entry connection queue remedied the fixture (24/24); full browser checks then passed again.

The original raw loop discontinuity remains a known media limitation; no reverse, hold, crossfade, retiming or new generation is used. This package is not a claim that the film's full visual gate passed or that publication is ready. Local UI human acceptance is pending.

The CLI host kept both tabs visible when trying native tab activation. Synthetic hidden/visible transitions test the controller branch; real hidden-tab behavior is not certified. Save-Data and failures are injected fixtures. Text was simulated at 200% and a half-width CSS viewport was checked; native browser zoom was not measured. Attempted live join screenshots have capture windows that straddle the wrap, so the separately paused exact endpoint frames supply the precise visual evidence.

The reusable local checks run through the installed Playwright CLI:

```sh
/Users/yapweijun/.codex/skills/playwright/scripts/playwright_cli.sh -s=aquatic-desktop-v1 open http://127.0.0.1:4285/ --headed
/Users/yapweijun/.codex/skills/playwright/scripts/playwright_cli.sh -s=aquatic-desktop-v1 run-code --filename companies/aquatic-world/redesign/cinematic-home-v2/desktop-home-v1/check-layout.js
/Users/yapweijun/.codex/skills/playwright/scripts/playwright_cli.sh -s=aquatic-desktop-v1 run-code --filename companies/aquatic-world/redesign/cinematic-home-v2/desktop-home-v1/check-playback.js
/Users/yapweijun/.codex/skills/playwright/scripts/playwright_cli.sh -s=aquatic-desktop-v1 run-code --filename companies/aquatic-world/redesign/cinematic-home-v2/desktop-home-v1/check-interactions.js
```

Checks capture first into `output/playwright/aquatic-desktop-v1/`; reviewed evidence is retained locally in this package. No physical phone, Safari/Firefox, native browser zoom or independent second reviewer is implied.
