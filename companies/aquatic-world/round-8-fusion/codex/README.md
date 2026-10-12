# Aquatic World — Fusion Home

Status: Stage 3 bounded Home text-resizing correction implemented and built; 21 focused source/integrity assertions passed. Evidence is recorded under evidence/stage-3/. Actual-browser acceptance and publication remain pending with the coordinator.

Home collection number/arrow tracks now reserve content width, narrow reading content can break otherwise overlong words, and action/footer flex content is bounded with natural wrapping. The footer brand retains word-boundary wrapping. Ordinary type sizes, hero/menu anchors and the stage-2 header/disclosure rules remain unchanged in source. Content-sized collection tracks can reserve a few more pixels at ordinary size; the coordinator must review their actual composition. No text shrinking, clipping, overflow hiding or QA preference was added.

This independent workspace uses only its own supplied baseline. Eight independent content pages plus 404, all inner-page content/styles, contextual category enquiries and four-group local-only Contact behavior remain. Nothing is sent from Contact. Film/poster bytes, controllers and fallback/manual-pause policies remain unchanged. The stage-2 menu fix is retained.

## Preview instructions for the coordinator

From this workspace directory, build with the existing standard-library tool:

```sh
python3 -B demo/build.py
```

To start the existing loopback preview for authorized coordinator browser review:

```sh
python3 -B demo/serve.py --port 8765
```

Open `http://127.0.0.1:8765/`. Entry file: `demo/public/index.html`; serving `demo/` directly is not the built preview. Stop with Ctrl+C. No server was started in this worker run.

Destinations: `/`, `/collections/`, `/collections/ornamental-fish/`, `/collections/aquatic-plants/`, `/collections/driftwood/`, `/our-story/`, `/quality/`, `/contact/`. Unknown paths use the existing `404.html` response. For a contextual local preview use `/contact/?category=driftwood#enquiry` or enter from a category page.

Generated HTML owns root-relative page/asset URLs, including deferred video data attributes. A nested GitHub Pages publication requires the coordinator's attribute rebasing to the chosen project base. Historical simulated reference checks are not deployed-path evidence; publication remains coordinator-owned.

## Stage 3 verification and evidence

```sh
python3 -B evidence/stage-3/check-source.py
```

Read the [design plan](evidence/stage-3/design-plan.md), [self-review](evidence/stage-3/self-review.md) and [focused patch](evidence/stage-3/source-change.patch). Check code, integrity snapshot and actual build/check outputs live only under evidence/stage-3/. Source/hash assertions establish implementation scope and preserved contracts; they cannot establish text-ink fit, CSS rendering, keyboard traversal, scrollability or playback.

Original [design plan](evidence/design-plan.md) and [self-review](evidence/self-review.md) remain historical and unchanged. [Stage 2 self-review](evidence/stage-2/self-review.md), its 18 source checks and 7 controller scenario groups also remain historical and unchanged. Those suites were not rerun or rewritten for this correction.

## Pending browser acceptance

The coordinator test doubles each HTML element's pre-captured computed font-size and numeric line-height once with viewport unchanged at 390x844 or 320x844; reload restores it. This injected text-only resizing is distinct from native zoom or physical-device evidence.

Coordinator review must repeat closed/open/scrolled full Home at those sizes, checking text-node Range rects as well as element boxes. Confirm secondary enquiry controls, collection labels/arrows, perspective text and footer brand/navigation stay within the viewport through wrapping/reflow. Retain complete word-boundary branding, reachable Menu/Close, internally scrolling short disclosure, all keyboard destinations, focus-exit closing, equal open/closed hero anchors and correct film/pause/policy restoration. Repeat all 13 ordinary viewport compositions from input/design/REVIEW.md, including desktop and ordinary phone.

No browser/server, physical-device, assistive-technology, native zoom, playback or deployed-path check ran here. This correction is not marked visually accepted or published.
