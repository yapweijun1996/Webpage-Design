# Webpage Design

A collection of company website design demos across industries. Each company has its own folder containing background research, a design brief, and an independently previewable demo.

The goal is to show how a company's business, audience, and industry shape its website. A visitor should be able to browse the collection, understand each design's context, and open its demo.

## What "standard" means

Standardize the research structure, design rationale, and demo quality. Choose the layout, visual style, content, and interactions to fit each company and industry.

## Current state

The repository contains directory conventions, a reusable company template, and twelve independent implementation versions in the [Aquatic World case](companies/aquatic-world/README.md). Two current eight-page websites integrate the same original-image controlled Home animation and preserve the previous Contact simplification. Their [actual-site animation comparison](companies/aquatic-world/comparison/round-6-animation/preview.html) and [current results](companies/aquatic-world/comparison/round-6-animation/RESULTS.md) record five viewport sizes, complete cycles, native policies, genuine hidden tabs and navigation/enquiry regression checks. Remaining physical-network/native-follow-up limits are stated in that report. Their [phone before/after viewer](companies/aquatic-world/comparison/round-5/preview.html) and [evaluation](companies/aquatic-world/comparison/round-5/RESULTS.md) show measured task-density improvement and remaining trade-offs; user design acceptance is pending. The [previous header/form revision](companies/aquatic-world/comparison/round-4/preview.html), [multi-page baselines](companies/aquatic-world/comparison/round-3/preview.html) and four [historical landing pages](companies/aquatic-world/comparison/preview.html) remain preserved. The [company catalog](companies/README.md) is the browsing entry point.

The [Aquatic World homepage video preparation](companies/aquatic-world/redesign/motion-v1/README.md) defines the common motion/integration contracts. Two authorized Runway samples completed at **US$1.44 total**. The [prompt-refinement viewer](companies/aquatic-world/redesign/motion-v1/trial-v1/preview-refinement.html) and [latest review](companies/aquatic-world/redesign/motion-v1/trial-v1/REFINEMENT.md) show improved fin framing and background stability but a remaining visible loop jump; media approval is pending. Wan remains paused for unresolved billing, so the model comparison is incomplete. The user then chose original-image webpage animation. The [controlled motion study](companies/aquatic-world/redesign/animation-v1/preview.html) is now the shared local preparation, with [integration requirements](companies/aquatic-world/redesign/animation-v1/INTEGRATION.md) and [verification](companies/aquatic-world/redesign/animation-v1/VERIFICATION.md). Both native CLIs completed independent [round-6-animation integrations](companies/aquatic-world/comparison/round-6-animation/README.md); current website previews use ports 4231/4232. The standalone study stays a common input, with actual-site verification recorded separately. The user rejected the current framed-animation direction and requested an immersive video experience; that redesign is not implemented.

## GitHub Pages demo publication

The next direction is prepared in the [immersive Home design package](companies/aquatic-world/redesign/immersive-home-v1/README.md): continuous full-page underwater video with integrated navigation, typography and actions. It includes one common brief, future CLI prompt and comparison protocol. This is design-only; implementation has not started, and approved landscape/portrait loops and posters remain unavailable. The published demos below are unchanged.

The current Codex and Claude demos are packaged by [the Pages workflow](.github/workflows/pages.yml) on pushes to `main`. The publication catalog is at <https://yapweijun1996.github.io/Webpage-Design/>; it links to both independent eight-page sites.

The [packager](scripts/prepare_pages.py) builds disposable copies, adjusts root HTML URLs for the project subdirectory, verifies local references, and publishes only the current website runtimes. CSS, JavaScript, images, and original implementation folders stay unchanged. Run `python3 -B scripts/prepare_pages.py --base=/Webpage-Design/` to reproduce `_site/` locally. Raw CLI transcripts are kept locally and excluded from Git; reviewed execution summaries remain in the repository.

On 2026-10-12 the user rejected the current image-animation presentation: the intended experience is immersive video integrated into the page environment. These published demos remain a testable record of the existing implementation, not an accepted immersive redesign. No new media generation or design revision is part of this publication. The company remains `building`.

## Directory structure

```text
Webpage-Design/
├── AGENTS.md                  # Repository contracts for future contributors
├── README.md                  # Project purpose, workflow, and quality criteria
├── companies/
│   ├── README.md              # Company catalog
│   └── <company-slug>/        # Created when a company is selected
│       ├── README.md          # Company metadata, status, and preview instructions
│       ├── research.md        # Company and industry findings with sources
│       ├── design-brief.md    # Design decisions grounded in the research
│       └── demo/              # Website implementation
│           ├── README.md      # Implementation and verification notes
│           └── assets/        # Company-specific media with source records
└── templates/
    └── company/               # Copy this folder to start a company case study
```

The company folder in this tree illustrates the default structure. A comparison case may contain multiple independent implementation folders, as documented in its company README.

## Start a company case study

1. Choose the company and use a lowercase, hyphen-separated slug, such as `example-company`.
2. Copy the template into a new, unused company directory. Replace `example-company` with the chosen slug before running this command from the repository root:

   ```sh
   cp -R templates/company companies/example-company
   ```

3. Fill in the company's `README.md` and register it in the [company catalog](companies/README.md).
4. Complete `research.md`, checking company and industry information against current sources.
5. Write `design-brief.md`, connecting research to audience, site type, route/page structure, visual direction and primary action. Distinguish a one-page landing page from a multi-page website explicitly; a homepage reference does not settle that choice.
6. Implement the website inside `demo/` and document how to preview it.
7. Verify the demo against the quality criteria below, record the results, and update the company status.

## Research to design

Use this sequence for every company:

```text
Company and industry research
    → Audience needs and website purpose
    → Content, page structure, and visual direction
    → Website demo
    → Verification and catalog entry
```

Capture the connection explicitly. For example, a finding that customers need to assess complex services before contacting sales may justify service explanations, evidence of expertise, and a clear enquiry path. This is an illustrative design rationale, not a claim about a specific company.

## Demo quality criteria

A company can be marked `ready` when:

- Company and industry findings have source URLs and access dates; assumptions and fictional demo content are identified.
- The design brief explains the primary audience, website goal, key content, and the reasons behind the design.
- The implemented scope is complete and the company README provides working preview instructions.
- The site type and route/content/action map match the user's intended experience. For a multi-page website, required destinations have meaningful page-specific content, load directly, survive refresh and work through cross-page navigation/history. Intentional in-page anchors remain appropriate for a one-page scope.
- The main journey works, including navigation, the primary action, and any forms. Unavailable backend actions are described honestly.
- The layout works on mobile and desktop without clipped content or unintended horizontal scrolling.
- Semantic structure, readable contrast, visible focus, and keyboard access support the main journey.
- Links and assets resolve, and the implemented journey has no blocking browser errors.
- Verification notes record what was checked, the result, and remaining limitations.
- Visual review inspects actual-size desktop/mobile headers, page hierarchy, typography, crops, spacing and interaction states. Record functional verification, visual judgment and user acceptance separately; a fidelity score or successful build cannot override explicit user rejection.

## Implementation direction

For an initial static demo, plain HTML, CSS, and JavaScript are a reasonable default. Choose a framework when the requested interactions or project requirements justify it, and document any setup commands in that company's README.

Keep a company's code and assets local to its demo. Introduce shared implementation only after multiple demos demonstrate a concrete need.

## Future browsing experience

Once company demos exist, the catalog can support a gallery with company previews, industry filters, brief context, and links to each demo. Build that interface from the actual collection rather than presenting unfinished case studies as completed work.
