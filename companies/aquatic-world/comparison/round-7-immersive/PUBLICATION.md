# GitHub Pages publication

Published and independently checked on 2026-10-12. The authorized implementation commit `2970a5f877f0899eea3303fee70ce797623b512d` was merged to main as `6d6b36c9ed57a42f83d58835671b01a2ed14cf0a` and pushed without rewriting history. Remote main matched the merge commit. [GitHub Actions run 38231271703](https://github.com/yapweijun1996/Webpage-Design/actions/runs/38231271703) completed both build and deployment successfully; deployment completed at 09:40:04 UTC.

- [Catalog](https://yapweijun1996.github.io/Webpage-Design/)
- [Codex immersive website](https://yapweijun1996.github.io/Webpage-Design/aquatic-world/codex/)
- [Claude immersive website](https://yapweijun1996.github.io/Webpage-Design/aquatic-world/claude/)
- [Live deployment manifest](https://yapweijun1996.github.io/Webpage-Design/manifest.json): the workflow supplies its deployed commit and exact runtime hashes.

The local Pages package builds 16 content pages plus the two candidate 404 pages, verifies 676 local URL references including deferred MP4/poster paths, and retains source CSS/JS/media bytes. Actual CUA preview at the real project base verifies loaded advancing movies, Menu/Pause, no-download retained stops and page navigation. The package deploys current runtimes and catalog only; raw logs, research and evaluator files are not served by Pages. Source/evidence remain in the repository.

## Observed public output

[HTTP verification](evidence/publication-http-checks.json) confirms the live manifest reports the merge commit and the same runtime inventory as the independently built local package. All **86 candidate runtime files** returned HTTP 200 with exact manifest SHA-256 matches, including all 16 content pages, both candidate 404 pages, CSS/JS, both films and matching posters for each candidate. The public catalog returned 200 and showed the new immersive direction. A nonexistent project route returned the catalog-linked 404. Reads used an explicit release query and no-cache headers; no remote media was saved for display.

[Actual public browser verification](evidence/publication-browser-checks.json) used CUA at the public HTTPS origin, at 1440×900 and 390×844. Each Home loaded the correct full-viewport landscape/portrait film with real advancing playback, muted/inline looping and no horizontal overflow. Pause/Resume agreed with playback, the hero action opened the real Collections page, and phone Menu suspended playback before its Contact link opened the independent Contact page. The observed inner pages did not contain/download Home films. Claude Contact also survived an explicit public refresh. Policy/fallback/native-lifecycle cases were exercised locally with the identical published runtime bytes; they were not all repeated at the public origin.

Actual public first-screen captures: [Codex desktop](evidence/codex-public-desktop.jpg), [Codex phone](evidence/codex-public-mobile.jpg), [Claude desktop](evidence/claude-public-desktop.jpg), [Claude phone](evidence/claude-public-mobile.jpg).

This publication record and its evidence are a documentation-only follow-up to the verified runtime release. Its subsequent push triggers the same Pages workflow; it does not alter the verified HTML, CSS, JS or media. The live manifest identifies the latest deployment commit.

Contact only creates a local preview. Physical phones and human creative acceptance remain open; see [RESULTS.md](RESULTS.md).
