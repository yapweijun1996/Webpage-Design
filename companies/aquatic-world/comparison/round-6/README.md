# Round 6 — Prepared Homepage Video Integration Comparison

Prepared on 2026-10-11. Status: design/protocol preparation complete; generation model/budget, approved media, implementation execution and results are pending. There are no round-6 worker deliveries or website preview URLs yet. The current live sites remain round 5.

The user authorized this preparation: select one existing aquatic image, write a homepage video brief and set common integration/comparison requirements for Codex and Claude. A paid video request and the later native CLI runs require their own selected model/budget and execution instruction. This protocol does not execute those actions.

## Authoritative inputs

- [Motion brief](../../redesign/motion-v1/BRIEF.md) owns the image choice, visual direction, shot and intended framing.
- [Integration contract](../../redesign/motion-v1/INTEGRATION.md) owns playback, loading, fallback and accessibility behavior.
- [Acceptance](ACCEPTANCE.md) owns the independent checks and focused rubric.
- [Common implementation prompt](IMPLEMENTATION-PROMPT.txt) is prepared for identical use after its input package exists.
- [Input plan](input-plan.json) records actual preparation hashes and explicitly pending media. It is not a frozen execution manifest.
- [Static study](../../redesign/motion-v1/preview.html) is a review artifact, not a contestant webpage or a generated clip.

## Fairness and ownership

Each worker starts from an independent copy of its own round-5 implementation, including its own current README. Intended directories are `companies/aquatic-world/round-6/codex/` and `companies/aquatic-world/round-6/claude/`; neither exists yet. Preserve older code, raw evidence, frozen manifests and previews. Workers cannot inspect one another's code, output, screenshots or review notes.

Retain the requested native CLIs/models: Codex `gpt-6.1-sol`; Claude Code `claude-opus-5-5`. Verify installed help and exposed serving model before launch. Do not silently substitute models or add other-model advisors/delegates. Record actual CLI version, effort, tools, permissions, browser capability, timing, exit status and exposed usage/cost. Unknown fields stay unknown; earlier versions/capabilities are not assumed current.

Both workers receive byte-identical motion brief, generation prompt, integration contract, acceptance, protocol, implementation prompt, source/provenance notes, approved first frame, final MP4, poster and current frozen design-director skill snapshot. Retain the previous common handoff/nine-image sources and contracts. Copy design-file references into a self-contained worker package and check links before freezing. Each gets only its own before screenshots/code; those differ and belong in a separate starting-conditions manifest.

Generate and review the media once centrally before either worker runs. The media's quality is a common starting condition. Worker-specific source re-encoding or replacement is outside this experiment. Native environments and preexisting design/code differ: the comparison concerns these two implementations' video integration, not isolated model skill or generator quality.

## Execution sequence after preparation

1. Confirm generation model/provider, supported six-second/720p/16:9/first-frame parameters, credential destination and total cost cap including retries. Use a generation tool separate from the visitor runtime.
2. Produce and review a common first-frame crop. Generate the clip with the prepared prompt, inspect anatomy/motion/seam and produce the shared final MP4/poster. Record actual file sizes, duration, dimensions, codec, frame rate, audio tracks, provenance and hashes. Do not launch webpage workers if the asset-quality gate fails.
3. Create independent own-code workspaces. Capture each own static Home baseline under the same evaluator conditions. Materialize identical inputs/skill snapshot, record distinct starting hashes and freeze `input-manifest.json`. Add actual run/preview commands only after verifying them.
4. Give both CLIs the same implementation prompt. Allow one autonomous build/self-review run per worker. An extra shared revision becomes a declared new stage; no asymmetric coaching or evaluator product-code repair.
5. Freeze each original delivery before independent QA. Exercise [ACCEPTANCE.md](ACCEPTANCE.md) in the same browser/network/viewport conditions; disclose missing tools or device coverage. A corrected evaluator preserves the rejected evidence and the intended assertion.
6. Review actual moving pages and stable screenshots. Record functional gates, focused design judgment, score reasons and user acceptance separately. Publish a before/after viewer and results only when actual artifacts exist.

## Evidence and comparison controls

Use one browser version, device scale factor, local server conditions and scripted journey. For each pair, keep viewport, motion preference, menu state, scroll position and cache/network scenario equal. Wait for fonts, visible images and actual media readiness. A `networkidle` wait alone does not establish video frame readiness.

Capture a comparable frame at 0 s, 2 s and near the end where seeking is supported, plus a real-time observation of at least three loops. Record actual seek/frame timing; tolerate codec seek granularity and do not compare random asynchronous frames as if synchronized. Use the same capture method and exact approved media on both sides.

Measure performance in three cold runs per implementation using the same declared throttling profile (planned: 1.6 Mbps down, 750 Kbps up, 150 ms latency, 4× CPU slowdown), with cache/service workers disabled. Record medians, ranges, LCP, CLS, poster/video bytes and first-frame delay. Run the own round-5 Home baseline under the identical profile. Targets: LCP ≤2.5 s and total page CLS ≤0.1; video enhancement causes no layout shift. These are experiment targets, not prior measurements. If the environment cannot supply these measurements, mark them not run and leave that acceptance open. Local emulation does not prove real-device performance.

Existing shared budgets: final MP4 ≤3 MiB, poster ≤200 KiB. They are checked centrally before delivery. Integration must not duplicate media requests or fetch video on initial reduced-motion/no-JS/Save-Data loads. An asset-driven limitation shared by both workers is reported separately from implementation behavior.

No new overall website/model ranking or comparison against earlier numeric scores is implied. User design acceptance stays pending until explicit feedback.
