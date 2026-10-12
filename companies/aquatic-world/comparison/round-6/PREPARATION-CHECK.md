# Preparation Verification

Date: 2026-10-11. Scope: design documents, selected original image, static composition study and comparison requirements. No generated clip or sixth-round implementation exists.

The original `hero-angelfish.png` dimensions, byte size and SHA-256 match its original manifest. Four existing source images were visually inspected to support the selection. The proposed common 16:9 first-frame derivative is not yet produced or approved.

All nine preparation checks pass; the detailed observations are in [preparation-check.json](preparation-check.json).

- Selected source dimensions/bytes/hash match the original manifest; all eight prepared common-contract hashes match [input-plan.json](input-plan.json).
- Local Markdown and static-study references resolve. The study's eight distinct local asset/document URLs returned HTTP 200 and matched local file bytes.
- The in-app browser rendered the static study at its default 1280×720 viewport. All three displayed image instances loaded at the original 1882×836 source size; document width equals viewport width. The desktop panel and 390px-wide phone schematic were visually inspected, including full fish/fin framing and text/media separation.
- [Browser observation](output/browser-observation.json) and [full-page screenshot](output/static-study.png) are saved. Browser warning/error logs were empty when inspected. The study contains zero video elements and zero active buttons, consistently with its static-only scope.
- All 2,064 files across seven existing worker/source-pack roots retain the same path/hash aggregate as [preservation-before.json](preservation-before.json). Cache directories are explicitly excluded. This covers the ten earlier worker versions and original asset pack; it is not a claim of rerunning their functional suites.
- The existing round-5 gallery and both current website root URLs remain reachable. No round-6 worker folders or approved video/poster/first-frame media exist; generation/execution status remains pending.

The browser's read-only DOM facade did not expose `img.decode()`. Verification used loaded image dimensions/completion plus the screenshot; no product defect or video-readiness result is inferred from that tool limitation. No viewport override was set. The phone panel is a schematic, not an actual phone-browser implementation check.

Video anatomy/motion/loop quality, encoding, delivered byte budgets, play/pause behavior, policy/network behavior, performance and both CLI implementations are not run. They require approved generated media and later implementation. The static study is not evidence of those outcomes.
