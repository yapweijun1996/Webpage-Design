# Shared Feedback Revision — Round 2

Both original deliveries remain preserved. Each independent `../../round-2/<runner>/` workspace starts from that runner's own first code and README, without previous execution evidence or dependency caches. Both receive the byte-identical [REVIEW.md](REVIEW.md), original 50 frozen inputs, the same native revision prompt, and one autonomous revision opportunity. No mid-run evaluator coaching or competitor access is allowed.

Models, native permissions, default effort, and CLI harness choices continue from round 1: Codex GPT-6.1 Sol with workspace-write/never; Claude Opus 5.5 with auto permissions. Tool permissions are not equivalent, so this compares resulting CLI artifacts rather than isolating model capability. Codex could not launch terminal Chromium but used connected Chrome through cua_repl for builder QA. Claude used headless Chromium and one built-in advisor whose serving model is redacted. The evaluator independently used the same headed Google Chrome 154.0.8037.99 for both.

The [input manifest](input-manifest.json) owns 51 shared frozen files. [Starting delivery hashes](starting-deliveries.json) record distinct own-code starting points. Independent deliverable hashes were captured after each native process finished under `deliveries/`. Original first-round hashes remain authoritative for preservation.

The evaluation rubric and viewport matrix are unchanged. Evaluator capture/interaction scripts are copied from round 1 with only workspace output paths, session name, and ports changed (4181/4182). Additional explicit regression checks will cover Forward restoration and all shared feedback items. The [completed results](RESULTS.md) score Codex 93.5 and Claude 92.5 under the unchanged rubric. All independent journey/configuration/history checks and eight-width layout checks passed. First drafts remain unchanged.

The [launcher source](run_pair.py) records the already completed run and refuses to overwrite existing process records. Check inputs from the repository root:

```sh
python3 companies/aquatic-world/comparison/round-2/check_inputs.py
```

The launcher refuses to overwrite execution records. Do not rerun it after launch.

## Reproduce the independent evaluator checks

Start second-version servers on ports 4181/4182 using the company README. From this comparison subdirectory, with the installed Playwright skill wrapper:

```sh
/Users/yapweijun/.codex/skills/playwright/scripts/playwright_cli.sh -s=aquatic-round-2 open about:blank --headed
python3 capture_report.py codex http://127.0.0.1:4181/
python3 check_interactions.py codex
python3 check_regressions.py codex
python3 capture_report.py claude http://127.0.0.1:4182/
python3 check_interactions.py claude
python3 check_regressions.py claude
python3 check_fresh_builds.py
```

Preserve existing evaluator outputs before rerunning these commands. They overwrite evaluator evidence, never contestant deliveries. The wrapper is local evaluator tooling, not a demo runtime dependency. After closing the session, remove its temporary `.playwright-cli/` cache.

`verify_delivery.py check codex` and `verify_delivery.py check claude` verify the second-delivery hashes. The original parent verifier still checks first deliveries. Keep the local native logs needed by those manifests; review logs before any future external publication.
