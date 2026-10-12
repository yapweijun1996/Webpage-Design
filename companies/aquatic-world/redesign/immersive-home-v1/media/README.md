# Immersive Home media

Prepared 2026-10-12 for the user's website completion goal. New video authorization: two requests only, maximum US$1.75, no automatic retry. Both Runway Gen-4.5 jobs completed at US$0.72 each: **US$1.44 additional total**, separate from the historical US$1.44 trial cost. [Request ledger](request-plan.json) retains exact receipts and the authorization source.

## Clean scene inputs

The built-in image tool removed all UI from the shared desktop and phone concepts. One targeted landscape refinement reduced the full fish for fin margins. Original concepts remain unchanged. [Exact image prompts](PROMPTS.md) and [source dimensions/hashes](first-frames.json) preserve provenance; the image tool did not expose serving model or monetary cost.

- [Landscape scene](landscape-first-frame.png): quiet left water, complete fish at right.
- [Portrait scene](portrait-first-frame.png): fish above, dark lower water for live copy.

FFmpeg normalized the clean scenes to the provider's 1280×720 and 720×1280 first frames, preserving the complete canvas with proportional fit and at most negligible edge padding. No semantic retouching was performed during normalization. [Landscape video prompt](landscape-VIDEO-PROMPT.txt), [portrait video prompt](portrait-VIDEO-PROMPT.txt), pinned input receipts and shot plans precede the submissions. Asset library versions remain drafts; preparation and coordinator selection never manufacture human approval.

## Raw generation and runtime derivatives

[Landscape raw](landscape-raw.mp4) and [portrait raw](portrait-raw.mp4) are untouched provider outputs: native target dimensions, H.264, 24 fps, 145 frames, 6.041667 seconds, no audio. Both change composition during the full raw shot. Raw endpoint mismatch is unsuitable for a direct repeating background; individual frames do not prove a watched playback test.

[make_loops.py](make_loops.py) creates centrally supplied runtime candidates from frames 1–36 of each raw clip. It traverses this stable early segment forward and backward with explicit cosine-eased frame indices over six seconds. The resulting motion is an edited return loop, **not an untouched naturally repeating provider output**. Reverse motion and held/resampled frames are disclosed; there is no crossfade, double-subject dissolve, crop, recoloring, generated still-film replacement or extra paid request. The first timing-remap candidate is retained in runtime-rejected-v1/ with its failed endpoint metric; it was not distributed to workers.

The [runtime manifest](runtime/manifest.json) owns exact dimensions, durations, hashes, sizes and commands. Both films fully decode, have 144 frames at 24 fps and no audio, and are below 3 MiB each. Posters are encoded from each actual runtime frame zero and are below 200 KiB. Initial first-frame WebP previews remain separately preserved; Stage 1 input copies are immutable.

Stage 2 used `(min-width: 900px) and (min-aspect-ratio: 6/5)`. Actual narrow-landscape review found that width guard unsuitable; the identical Stage 3 correction sets the current common query to `(min-aspect-ratio: 6/5)` at every width. The preserved runtime manifest describes the original Stage 2 preparation, and the Stage 3 brief owns the query override. Landscape uses centered cover. Portrait uses `50% 30%` to protect upper fins at intermediate aspect ratios. Near-square portrait windows need lower copy placement; both workers receive the same correction in Stage 2. Actual viewport crops and moving readability are recorded in the round-7 comparison results; human acceptance remains open.

[Technical loop review](loop-technical-review.json) measures decoded endpoints and full decoding. Endpoint similarity does not prove a pleasant loop. Final actual-site recordings cover three joins per orientation/candidate, with sampled join-frame, readability, fin-margin and normal-scroll review; see the comparison results for evidence and limits. Human creative acceptance remains open for the requested public test.

Reproduce in a fresh output directory:

```sh
python3 -B make_loops.py --output /absolute/new/output-directory
```

Run from this directory or use the script's absolute path. Existing reviewed outputs are never overwritten. The pipeline uses installed FFmpeg and cwebp, with no provider or credential access.
