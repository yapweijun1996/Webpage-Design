# Aquatic Hero — Authorized Paired Trial v1

Prepared and first reviewed on 2026-10-11; prompt refinement reviewed on 2026-10-12. Status: two authorized Runway samples completed at actual **US$1.44 total**. Both pass checked technical delivery conditions; the second improves framing but still fails the homepage loop requirements. [Watch the comparison](preview-refinement.html) and read the [latest review](REFINEMENT.md). The [first-sample review](RESULTS.md) remains preserved. Wan remains paused for unresolved billing; the paired model comparison is incomplete. The [live ledger](request-plan.json) owns current provider state.

The user selected plan A: one Wan 3.0 and one Runway Gen-4.5 sample with identical input and prompt, within a US$3 generation cap. The user then authorized modifying Video Studio MCP model support and investigating Wan billing. Neither authorization changes a key limit, recharges credits or starts the website workers.

## Frozen trial input

- [First frame](first-frame.png): 1280×720 RGB PNG, cropped from the existing hero image at x=396, y=0, width=1486, height=836 and resized with Pillow 12.2.0 Lanczos. The original source is unchanged.
- [Exact prompt](PROMPT.txt): the concise common motion prompt proposed in the model comparison. This trial text supersedes the longer preparation draft for these initial samples only.
- [Request plan and live ledger](request-plan.json): authorization, hashes, parameters, estimates, actual reported cost and remaining prerequisites. Separate provider receipts are linked in the review.
- [Live model metadata](live-models.json): read-only OpenRouter retrieval immediately before this preflight.
- [Preflight findings](PREFLIGHT.md): tool policy and current budget limits.

The coordinator inspected the first frame at 1280×720: the fish body, fine extended fins and tail remain inside the frame with surrounding water; quiet water remains on the left. This establishes input composition only. Fish continuity, camera motion and loop quality cannot be checked before a movie exists. Source provenance remains in the [motion brief](../BRIEF.md).

## Tool verification and remaining boundary

Video Studio MCP now supports first-frame Runway 720p with exact cents-to-USD conversion and the existing account/key margins, image pins, duplicate checks and uncertain-POST protection. All 91 Python tests, catalog UI and lock checks passed; the fresh STDIO preflight loaded all 32 tools. Its prepared Wan 720p mapping remains behind the billing pause. Historical job/generation metadata still reports US$0.2125 without billable seconds; neither current price documentation nor a five-second default explains the difference. [Tool changes and investigation](/Users/yapweijun/Documents/GitHub/Open-Router-Video-MCP/docs/video-model-support-2026-10-11.md).

The initial preflight reported US$2 key allowance remaining. After sample 01, a refresh returned US$1.2763175; the user selected one additional Runway refinement rather than preserving that allowance for Wan. After sample 02, [the refreshed allowance](budget-after-02.json) is US$0.5563175. It is below a further Runway request's US$0.864 safety requirement and Wan's US$0.60 base quote. The trial total is US$1.44; the US$3 user cap and separate key limit remain unchanged. No additional request, recharge or limit change was made.

Request `aquatic_runway_20261011_01` and its [receipt](runway-submit.json) retain the original input/prompt and [review](RESULTS.md). Request `aquatic_runway_20261012_02` uses the same image with [PROMPT-02.txt](PROMPT-02.txt); its [receipt](runway-02-submit.json), [media checks](media-check-02.json) and [desktop/phone playback evidence](browser-review-02.json) support the [refinement review](REFINEMENT.md). Both raw outputs and review encodings/posters are preserved as drafts; no final shared media was selected. Round-6 remains pending. Earlier [preflight](PREFLIGHT.md), [zero-submission verification](verification.json) and [first-sample verification](trial-check.json) are historical checkpoints. [Refinement verification](refinement-check.json) covers the latest changes.

Use the company preview server at `http://127.0.0.1:4170/redesign/motion-v1/trial-v1/preview-refinement.html`. To run independently from the repository root:

```sh
python3 -m http.server 4175 --bind 127.0.0.1 --directory companies/aquatic-world
```

Then open `http://127.0.0.1:4175/redesign/motion-v1/trial-v1/preview-refinement.html`.

## Operate the retained request

From the Video Studio MCP repository, use its locked environment to run this case-specific controller. `submit-runway` refuses when an attempt is already recorded; use polling to continue the existing job. No credentials are passed in arguments or stored in this folder.

```sh
uv run --locked python -B /Users/yapweijun/Documents/GitHub/Webpage-Design/companies/aquatic-world/redesign/motion-v1/trial-v1/run_trial.py poll-runway
uv run --locked python -B /Users/yapweijun/Documents/GitHub/Webpage-Design/companies/aquatic-world/redesign/motion-v1/trial-v1/run_trial.py download-runway
```
