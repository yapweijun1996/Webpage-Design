# Aquatic World — Fusion Home

Status: stage-2 motion-label correction implemented; build and source/mock checks passed. Coordinator browser acceptance and publication remain pending.

Home now uses an opaque #041D25 navigation surface whenever scrolled or Menu is open, retains the transparent closed arrival at the top, and adapts short-landscape offer spacing around the live header row. Portrait/desktop rules, inner pages, exact media and motion policies are preserved. This is a fictional design demo with a local-only enquiry preview.

The motion utility now allows its full Play/Pause/Resume background label to wrap within a viewport-bounded tooltip. Normal single-line labels retain their centered position; taller labels grow upward from the button's bottom edge. This addresses the coordinator's visible 320×375 enlarged-text clipping report without changing the button or playback controller. Rendered fit at 200% computed-font/line-height scaling has not been checked by this worker.

## Build

From this workspace root, using the existing Python stdlib tools:

```sh
python3 -B demo/build.py
```

Output: `demo/public/index.html`, seven other independent content routes, `404.html` and local assets. No dependency installation is required.

## Preview for the coordinator

```sh
python3 -B demo/serve.py --port 8765
```

Open `http://127.0.0.1:8765/`. Omit `--port` to use an automatically selected port printed by the server. Root-relative links require serving `demo/public/` at the preview root. The existing server provides direct routes and an honest custom 404. It was not started during this worker run. GitHub Pages packaging, base-path rebasing and publication belong to the coordinator.

## Available verification

```sh
python3 -B evidence/stage-2/check-regressions.py
```

All passed: eight content pages plus 404; 304 local references; exact inner-page/404 output and media bytes; eleven controller scenarios in Node mocks, including all three full action labels; tooltip-only CSS scope and bounded positioning arithmetic. The runner preserves original evidence and saves new results under `evidence/stage-2/`. Source/mock checks do not prove rendered label fit, glyph masking, CTA clearance or browser interaction. Real browser acceptance—including focused/hovered labels at fixed 320×375 with each element's pre-captured computed font size and numeric line height doubled exactly once—remains pending. This stress method is not native zoom.

Stage-2 [layout plan](evidence/stage-2/layout-plan.md), [self-review](evidence/stage-2/self-review.md) and [delivery](evidence/stage-2/delivery.md) describe the correction and coordinator checks.

Read [layout plan](evidence/layout-plan.md), [self-review](evidence/self-review.md) and [delivery](evidence/delivery.md) for the implementation boundaries, evidence and actual limits. Frozen inputs and baseline were preserved.
