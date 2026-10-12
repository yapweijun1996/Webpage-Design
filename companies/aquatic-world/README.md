# Aquatic World — Website Design Case

## Metadata

| Field | Value |
| --- | --- |
| Case name | Aquatic World — fictional design case |
| Slug | aquatic-world |
| Industry | Aquatics / aquarium B2B |
| Company identity | Illustrative brand; no actual company identity has been verified |
| Market / location | Unverified; location in the reference is sample content |
| Official website | Unknown; the reference domain is not evidence |
| Status | building |
| Last updated | 2026-10-12 |

## Purpose

Develop a structured multi-page aquatic website with useful page destinations and professional visual detail. The user rejected the two round-2 landing pages on 2026-10-11 despite their passing historical checks. The [new design brief](redesign/BRIEF.md) defines eight content pages, improved global navigation/header and distinct inner-page content. Both native CLIs delivered that scope, then independently revised their own code using identical focused header/mobile-form feedback. The [Contact evaluation](comparison/round-5/RESULTS.md) separates passing functional checks, measured improvement, evaluator judgment and pending user acceptance. Open the [current homepage animation comparison](comparison/round-6-animation/preview.html) and [actual-site evaluation](comparison/round-6-animation/RESULTS.md). The [Contact before/after comparison](comparison/round-5/preview.html?stage=after&page=contact&viewport=mobile&extent=first) remains preserved.

The two completed landing-page rounds remain independent historical comparisons using the same supplied handoff, images and original task. They evaluate each model together with its CLI environment, not isolated model capability. Their scores measure the earlier single-page rubric and do not constitute acceptance of the current requirement.

| Implementation folder | CLI | Requested model | State |
| --- | --- | --- | --- |
| [round-6-animation/codex/](round-6-animation/codex/README.md) | Codex CLI | GPT-6.1 Sol (`gpt-6.1-sol`) | Home controlled animation integrated; exercised actual-site gates verified with recorded limits; user rejected the presentation |
| [round-6-animation/claude/](round-6-animation/claude/README.md) | Claude Code CLI | Opus 5.5 (`claude-opus-5-5`) | Home controlled animation integrated; exercised actual-site gates verified with recorded limits; user rejected the presentation |
| [round-5/codex/](round-5/codex/README.md) | Codex CLI | GPT-6.1 Sol (`gpt-6.1-sol`) | Four-group Contact simplification; independent exercised gates pass; user acceptance pending |
| [round-5/claude/](round-5/claude/README.md) | Claude Code CLI | Opus 5.5 (`claude-opus-5-5`) | Four-group Contact simplification; independent exercised gates pass; user acceptance pending |
| [round-4/codex/](round-4/codex/README.md) | Codex CLI | GPT-6.1 Sol (`gpt-6.1-sol`) | Focused header/phone Contact revision; independent exercised gates pass; user acceptance pending |
| [round-4/claude/](round-4/claude/README.md) | Claude Code CLI | Opus 5.5 (`claude-opus-5-5`) | Focused header/phone Contact revision; independent exercised gates pass; user acceptance pending |
| [round-3/codex/](round-3/codex/README.md) | Codex CLI | GPT-6.1 Sol (`gpt-6.1-sol`) | Eight pages + 404; evaluator structural/interaction checks pass; design assessment 85.0/100; user acceptance pending |
| [round-3/claude/](round-3/claude/README.md) | Claude Code CLI | Opus 5.5 (`claude-opus-5-5`) | Eight pages + 404; evaluator structural/interaction checks pass; design assessment 90.2/100; user acceptance pending |
| [round-2/codex/](round-2/codex/README.md) | Codex CLI | GPT-6.1 Sol (`gpt-6.1-sol`) | Historical single-page delivery verified; 93.5/100 (first: 87.5); user design acceptance rejected |
| [round-2/claude/](round-2/claude/README.md) | Claude Code CLI | Opus 5.5 (`claude-opus-5-5`) | Historical single-page delivery verified; 92.5/100 (first: 82.0); user design acceptance rejected |

The user authorized a focused fourth round on 2026-10-11: improve the shared headers, then put the phone Contact workspace ahead of secondary help. Both native CLIs completed their own-code revisions from identical [feedback](round-4/codex/REVIEW.md). [Execution protocol](comparison/round-4/README.md), [results](comparison/round-4/RESULTS.md) and [viewer](comparison/round-4/preview.html). Both first labeled fields now fit in the 390×844 first viewport. Previous deliveries remain preserved.

The user then authorized a fifth round: simplify repeated Contact headings/disclosures and nonessential fields using the same requirements in both original CLIs. Each revised its own round-4 copy from identical [feedback](round-5/codex/REVIEW.md). [Protocol](comparison/round-5/README.md), [results](comparison/round-5/RESULTS.md) and [phone viewer](comparison/round-5/preview.html?stage=after&page=contact&viewport=mobile&extent=first). Both now have four groups, one task heading and one editable-state local-only notice; Name/Email fit at 390×844 and 360×800. Original deliveries and older previews remain preserved.

Homepage motion preparation is complete: [video brief and selected source](redesign/motion-v1/BRIEF.md), [static composition study](redesign/motion-v1/preview.html), [shared integration contract](redesign/motion-v1/INTEGRATION.md) and [prepared round-6 requirements](comparison/round-6/README.md). The user authorized a US$3 Wan/Runway trial, tool support work and then one Runway prompt refinement. Two Runway samples completed at US$0.72 each, **US$1.44 total**. The [playable comparison](redesign/motion-v1/trial-v1/preview-refinement.html) and [latest review](redesign/motion-v1/trial-v1/REFINEMENT.md) show better fin framing and background stability in the second sample, but fish scale/orientation and a visible loop jump still fail the motion brief. Wan remains paused for unresolved billing; no empirical model winner is established. The user subsequently selected the original image with controlled webpage animation. The [new motion study](redesign/animation-v1/preview.html) and [common requirements](redesign/animation-v1/INTEGRATION.md) preserve the fish while adding subtle water light and particles; [study verification](redesign/animation-v1/VERIFICATION.md) records desktop/phone behavior, real Chrome hidden/visible transitions and native Save-Data initial-policy/opt-in checks. Real live network preference change remains unverified. Both native CLIs have now integrated that shared input in their own [round-6-animation workspaces](comparison/round-6-animation/README.md). The [actual-site results](comparison/round-6-animation/RESULTS.md) record five viewport sizes, full cycles, native policies, genuine hidden tabs and preserved Contact/navigation. The user subsequently rejected the framed-animation presentation; an immersive video redesign is not implemented. The Mac lock prevented a final additional native follow-up. The ten historical website implementations remain preserved; [preparation verification](comparison/round-6/PREPARATION-CHECK.md) is separate from trial review.

## Structure

```text
aquatic-world/
├── README.md
├── research.md
├── design-brief.md
├── redesign/              # Multi-page contracts, learning record and motion-v1 preparation
├── codex/                 # Independent CLI workspace
│   ├── AGENTS.md
│   ├── CLAUDE.md
│   ├── TASK.md
│   ├── input/             # Frozen handoff, references, and shared standalone assets
│   ├── demo/              # Implementation output
│   └── evidence/          # Run record, screenshots, and actual checks
├── claude/                # Same initial structure and frozen input bytes
├── round-2/               # Independent own-code copies; shared frozen feedback
│   ├── codex/
│   └── claude/
├── round-3/               # Fresh independent multi-page implementations
│   ├── codex/
│   └── claude/
├── round-4/               # Focused own-code header/mobile Contact revisions
│   ├── codex/
│   └── claude/
├── round-5/               # Focused own-code Contact simplification
│   ├── codex/
│   └── claude/
├── round-6-animation/     # Independent own-round-5 Home animation integrations
└── comparison/            # Protocol, frozen manifests, results and evaluator evidence
    ├── round-2/           # Historical feedback protocol and evaluation
    ├── round-3/           # Multi-page baseline protocol, deliveries, viewer and evaluation
    ├── round-4/           # Preserved header revision protocol and before/after viewer
    ├── round-5/           # Contact simplification, deliveries, verification and viewer
    ├── round-6/           # Historical homepage video preparation
    └── round-6-animation/ # Native integrations, actual-site evidence and comparison
```

## Context and preview

- [Source context and evidence limits](research.md)
- [Design brief](design-brief.md)
- [CLI startup commands and comparison protocol](comparison/README.md)
- [Shared image pack and offline preview](comparison/assets-v1/README.md)

The [second-round results](comparison/round-2/RESULTS.md) and [two-round comparison](comparison/preview.html) are complete. Both builders received the same feedback once, revised only their own copied code, and passed the same independent browser matrix. Codex remains slightly closer to the compact desktop reference (93.5); Claude substantially closed the gap (92.5). These non-blind scores describe this pair and its recorded CLI environments.

The current case remains `building` because the user rejected the Home motion presentation and requested immersive video. The two current eight-page websites preserve real navigation and useful page-specific content. Contact now has one heading, one concise editable-state disclosure and four field groups. At 390px, Codex Name moved 620→308px and its Preview button 1,260→896px; Claude Name moved 414→303px and its button 1,575→1,131px. Both pass the exercised independent gates. For this focused phone task, Codex is now the evaluator preference because all four editable groups fit in the first viewport; Claude retains explicit multi-category checkbox choices at a larger vertical cost. This does not replace historical judgments with a general model ranking or assert user satisfaction.

Worker READMEs are preserved original deliveries: Codex correctly records its own browser access as unavailable. The separate evaluator report supplies subsequent browser verification without rewriting that history. Original [Codex](codex/README.md) and [Claude](claude/README.md) first drafts remain preserved; see the [first-round report](comparison/RESULTS.md). No verified real-company profile, production deployment, pixel-perfect rendering or full accessibility compliance is asserted. Current browser/device/accessibility limits are in the [round-5 results](comparison/round-5/RESULTS.md).

The [CLI design lessons](redesign/LEARNINGS.md) and [implementation prompt](redesign/IMPLEMENTATION-PROMPT.txt) support this workflow. A personal `cli-web-design-director` skill captures the cross-project procedure; both builders received its identical frozen snapshot. Company-specific evidence stays local. The Contact simplification remains preserved. Current homepage animation delivery and exercised independent verification are complete; the user rejected its presentation. These functional checks do not establish design acceptance. Codex keeps its control within the first viewport at 360/320px; Claude is more compact at 390px and 768px. See the current report for evidence and limits.

### GitHub Pages publication

The repository [Pages workflow](../../.github/workflows/pages.yml) publishes the current implementations for demo/testing:

- Catalog: <https://yapweijun1996.github.io/Webpage-Design/>
- Codex: <https://yapweijun1996.github.io/Webpage-Design/aquatic-world/codex/>
- Claude: <https://yapweijun1996.github.io/Webpage-Design/aquatic-world/claude/>

The [deployment packager](../../scripts/prepare_pages.py) changes only URL attributes in exported HTML so navigation, responsive images and Contact category prefills work under the GitHub project path. Original implementations remain preserved. Only the two current runtime trees and a minimal demo catalog are deployed; research, historical trials, CLI transcripts and evaluator evidence are not served by Pages. Contact still creates a local preview and sends nothing.

This publishes the existing static-image animation, not the requested immersive video experience. Design acceptance was rejected on 2026-10-12; no redesign is included in this release.

### Run the current multi-page previews

From the repository root, in separate terminal windows:

```sh
cd companies/aquatic-world/round-6-animation/codex
python3 -B demo/build.py
AQUATIC_PREVIEW_PORT=4231 python3 -B demo/serve.py
```

```sh
cd companies/aquatic-world/round-6-animation/claude/demo
npm run build
AQUATIC_PREVIEW_PORT=4232 npm run serve
```

Open [Codex eight-page website with controlled Home animation](http://127.0.0.1:4231/) and [Claude eight-page website with controlled Home animation](http://127.0.0.1:4232/). Python 3.10+ is required for Codex; Node.js 22+ for Claude. No dependency install is needed; each owns the exact PNG and retains local WebP derivatives for inner pages. Fresh disposable builds reproduced the output exactly. Each root route supports direct loading, reload and a real 404 through its included server. Stop only the server you launched with Ctrl+C.

The comparison server command below serves all viewers. Open [the current Home/Contact animation viewer](http://127.0.0.1:4170/comparison/round-6-animation/preview.html) for native after captures at five exact sizes and preserved before references. Actual after websites require 4231/4232. The historical [Contact before/after viewer](http://127.0.0.1:4170/comparison/round-5/preview.html?stage=after&page=contact&viewport=mobile&extent=first) switches version, four phone widths, tablet/desktop and first/full captures. Its after-version links require 4211/4212; before-version links require preserved 4201/4202. Use the round-4 workspace commands on 4201/4202 for those previous pages. The unchanged [round-4 full-site comparison](comparison/round-4/preview.html) and [round-3 baseline viewer](comparison/round-3/preview.html) remain available.

### Run the historical landing-page previews

From the repository root, in separate terminal windows:

```sh
cd companies/aquatic-world/round-2/codex/demo
npm run dev -- --port 4181
```

```sh
cd companies/aquatic-world/round-2/claude/demo
npm run serve -- 4182
```

Open [Codex second version](http://127.0.0.1:4181/) and [Claude second version](http://127.0.0.1:4182/). Generated pages are present locally; for a fresh source checkout, follow each implementation README's build instructions first. Both preview servers were independently tested and served the delivered HTML exactly. Disposable fresh builds also reproduced the generated pages without installing packages. Historical first-version previews use ports 4171/4172 and their original workspace commands.

To show the screenshot comparison from the repository root:

```sh
python3 -m http.server 4170 --bind 127.0.0.1 --directory companies/aquatic-world
```

Open [the comparison viewer](http://127.0.0.1:4170/comparison/preview.html). It switches between both rounds, desktop/tablet/mobile and first-screen/full-page captures. The two actual-page links require the corresponding preview servers.
