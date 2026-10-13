# Publication — Fusion Home Refinement

The user explicitly authorized commit, merge to main and GitHub Pages publication. The shared design package was committed as `939cc38` and fast-forward merged to local main, then the independently implemented and verified refinement was committed as `0d25c8ece905182fae4e5df98ed38da042f3a2fe`, fast-forward merged and pushed. The remote main SHA matched that release.

[GitHub Actions run38339093997](https://github.com/yapweijun1996/Webpage-Design/actions/runs/38339093997) completed successfully on2026-10-13: build02:54:28 UTC, deploy02:54:41 UTC. The served manifest reported the exact release SHA.

## Verified external result

[Public byte verification](evidence/pages-public.json) checked105 user-facing files against the local disposable build, including16 content routes, both candidate404s, the global404,16 selected comparison stills and the catalog. All684 packaged local references resolve. Every checked content file returned200 and its SHA-256 matched. The empty `.nojekyll` build marker is intentionally reported separately: local200/empty, public404/not exposed; it is not user-facing content.

[Actual public browser evidence](evidence/public-browser.json) confirms both390×844 arrivals loaded their portrait MP4, readyState4 and playing, and both scrolled navigation surfaces mask the real collection heading. The public catalog and comparison were also inspected. Native [catalog screenshot](evidence/catalog-public-full.png), [Codex Home](evidence/codex-home-public.jpg), [Claude Home](evidence/claude-home-public.jpg), [Codex header](evidence/codex-header-public.jpg) and [Claude header](evidence/claude-header-public.jpg) are retained.

- [Demo catalog](https://yapweijun1996.github.io/Webpage-Design/)
- [Codex website](https://yapweijun1996.github.io/Webpage-Design/aquatic-world/codex/)
- [Claude website](https://yapweijun1996.github.io/Webpage-Design/aquatic-world/claude/)
- [Side-by-side comparison](https://yapweijun1996.github.io/Webpage-Design/comparison/)

This publication-record commit adds only documentation and observed evidence; it changes no packaged runtime, catalog or comparison bytes. Its main-branch workflow will redeploy the same artifact content with a newer manifest commit. The coordinator verifies that final deployment separately before claiming the task finished. The durable full byte audit above identifies the exact release whose runtime bytes it proves.

Contact is explicitly a local preview; nothing is sent. Physical-device and assistive-technology limits are recorded in [RESULTS.md](RESULTS.md). No new media generation cost occurred. Human creative acceptance remains open.
