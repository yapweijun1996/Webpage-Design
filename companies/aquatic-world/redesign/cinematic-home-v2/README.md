# Aquatic World — Cinematic Home v2

Prepared on 2026-10-13 (Asia/Singapore). The user selected an AI cinematic environment and authorized the complete design → standalone film review → independent native CLI implementation → browser comparison → GitHub Pages workflow. New paid video requests still require a separately authorized, concrete spending limit.

## Current delivery state

- New landscape and portrait clean scenes and desktop/phone UI concepts have been generated with the built-in image tool. [Static preview](preview.html) shows both concepts and the existing shared category imagery; [asset manifest](asset-manifest.json) records all nine image hashes and dimensions.
- [Shared design brief](BRIEF.md), [film storyboard](STORYBOARD.md), [acceptance criteria](ACCEPTANCE.md), and [common CLI handoff](CLI-PROMPT.txt) define the requested replacement experience.
- Both version-pinned shot inputs pass the Video Studio preparation checks. Read-only quotes estimate US$1.20 per ten-second silent 720p take, US$2.40 total. The user explicitly authorized a new US$3.00 cap for at most two requests, with no automatic retry; [request ledger](media/request-plan.json) records that authorization.
- The first landscape request was submitted once at 2026-10-13 15:34:08 UTC, but Video Studio returned `SUBMISSION_OUTCOME_UNKNOWN_DO_NOT_RETRY`. [Status receipt](media/landscape-status.json) has no task ID and no settled cost. The original request may have been accepted or charged; it has not been retried. The portrait request is untouched.
- No playable replacement film has been retrieved. The film gate blocks native CLI implementation and runtime publication; current website code and historical media remain unchanged. [Preparation and recovery evidence](PREPARATION.md) records the checks and missing prerequisite.
- The current published round-9 film remains creatively rejected. Earlier functional evidence remains historical; this package does not relabel it as new acceptance.

## Files and ownership

`visuals/` owns static UI concepts. `media/` owns UI-free scene inputs, exact prompts, model/quote evidence and later standalone film results. `details/` owns the shared existing category photographs and their provenance. The later comparison case will own frozen input copies, independent own-code workspaces, execution metadata, actual-site evidence and publication results.

Past implementations and media remain unchanged. Both builders will start from their own final round-9 code at `e39f68b4cc8b900c4e18018d2c8cabbedef28b66` and receive byte-identical new inputs after the film gate passes.

Preview from the repository root:

```sh
python3 -m http.server 4270 --bind 127.0.0.1 --directory companies/aquatic-world/redesign/cinematic-home-v2
```

Open `http://127.0.0.1:4270/preview.html`. The [actual design-board browser capture](visuals/design-board-browser.jpg) shows the preparation display, not an implemented Home.

The [motion study](../immersive-motion-study/README.md) supplies photographic references and the cause of the previous wallpaper-like result. Green Aqua videos are references only; none is copied into the site. This remains a fictional aquarium brand, not verified inventory or an operating enquiry service.
