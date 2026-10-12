# Paired Video Trial Preflight

Checked on 2026-10-11 (Asia/Singapore). Outcome: input ready; provider submissions not attempted because the available tool's policy and first-frame implementation do not support this pair.

## Authorization and current public capability

The user's plan-A selection authorizes the initial one-per-model trial under a US$3 aggregate generation cap, with at most two preferred-model refinements when warranted and funded. Six seconds, 720p, 16:9 and first-frame input remain exposed for both exact model IDs in the [fresh API snapshot](live-models.json).

| Model | Live base SKU | Six-second estimate | Current Video Studio MCP constraint |
| --- | --- | --- | --- |
| `alibaba/wan-3.0` | `duration_seconds_720p: 0.1` USD/second | US$0.60 | New submissions paused with `PRICE_RECONCILIATION_REQUIRED`; first-frame 720p pricing path also absent |
| `runway/gen-4.5` | `cents_per_second_output: 12` cents/second | US$0.72 | Not in fixed submit allowlist (`MODEL_NOT_APPROVED`); first-frame pricing path absent |

These are estimates, not settled charges. [OpenRouter's current guide](https://openrouter.ai/docs/guides/overview/multimodal/video-generation) documents asynchronous submit/poll/content retrieval; API-level availability does not establish local tool permission or verified pricing implementation. Accessed 2026-10-11.

## Local evidence

Read-only inspection of Video Studio MCP's [video contract](/Users/yapweijun/Documents/GitHub/Open-Router-Video-MCP/docs/video.md) and [submit implementation](/Users/yapweijun/Documents/GitHub/Open-Router-Video-MCP/open_router_video_mcp/video.py:19) confirmed the fixed allowlist, Wan pause and MiniMax-only image path. This is an existing tool spending safeguard, not an automatic approval-review rejection. No rejected or potentially billable POST was used to rediscover it.

Its historical Wan test requested two seconds at 480p, estimated US$0.10 and exposed US$0.2125. That discrepancy remains unresolved in the tool contract. This history does not establish a five-second billing minimum or prove the current six-second 720p charge; no new assumption was used to remove the pause.

`get_account_balance` succeeded at 2026-10-11T13:08:14Z. Account funds were sufficient for the initial pair; the key's remaining budget was US$2. With the tool's 20% margin the initial pair requires US$1.584. All proposed refinements cannot be guaranteed under the current key limit. No credential value, key limit, account funding or allowlist was changed.

Before creative work, `search_assets` in the explicit `video-studio-shared` library returned no matching aquatic/angelfish video. `list_creative_rules` returned no approved rules for project `aquatic-world-homepage-motion-v1`, medium `video`, character `hero-angelfish`, style `calm-aquarium`. These empty results do not approve models or artworks.

## Prepared and verified

The selected original hash matches the motion brief. The shared PNG has been decoded and visually inspected. Its SHA-256 is `306858e5c37d4c2373d3444d920ec57c0ec85db00f16543d10126272c59ec3a8`; size is 1,385,006 bytes. Both planned requests pin these same image bytes and the same prompt hash. No image was sent to a video provider.

The request ledger contains zero submitted attempts, zero reserved submitted cost and no provider job IDs. This trial incurred US$0 in generation charges because no generation request was sent. Actual movie metadata, visual playback, loop seams, provider cost reconciliation and webpage behavior remain unchecked.

The next action requires work outside this website repository: extend the Video Studio MCP's supported submission/pricing paths and investigate Wan billing while preserving its spending and uncertain-POST protections. That scope has not been authorized by the current website trial selection. Keep the existing media-trial authorization; ask only about the additional tool work, not the same US$3 cap again.
