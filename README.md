# Webpage Design

A collection of company website design demos across industries. Each company has its own folder containing background research, a design brief, and an independently previewable demo.

The goal is to show how a company's business, audience, and industry shape its website. A visitor should be able to browse the collection, understand each design's context, and open its demo.

## What "standard" means

Standardize the research structure, design rationale, and demo quality. Choose the layout, visual style, content, and interactions to fit each company and industry.

## Current state

The user requested final closure, commit and merge to `main` on 2026-10-15. The [Aquatic World local desktop delivery](companies/aquatic-world/redesign/cinematic-home-v2/desktop-home-v1/DELIVERY.md) is complete: accepted ecosystem movie, protected copy, eight real destinations, portrait still fallback and a single-play/loop comparison. Twenty-four comparison checks and 43 journey checks passed. The existing loop default and documented raw join remain; closure adds no media fees and does not replace the published round-9 websites. No further work is scheduled.

The wider case retains its existing `building` catalog status for unmet public replacement criteria. The following chronology preserves earlier decisions and does not represent outstanding tasks in the closed local delivery.

## Historical design and release stages

The [Aquatic World case](companies/aquatic-world/README.md) has two independent eight-page websites with a full-Home underwater video environment. Both native CLIs have now applied the same [Fusion Home refinement brief](companies/aquatic-world/redesign/fusion-home-v2/README.md): opaque scrolled navigation, comfortable narrow-landscape actions and readable enlarged motion labels. Codex requested GPT-6.1 Sol; Claude exposed Opus 5.5. Previous rounds remain preserved.

[Current actual-site results](companies/aquatic-world/comparison/round-9-refinement/RESULTS.md) record twelve normal viewports per candidate, heading masking, enlarged text, keyboard/menu behavior, movie policies and the preserved multi-page Contact journey. [Media provenance](companies/aquatic-world/redesign/immersive-home-v1/media/README.md) records the earlier authorized US$1.44 video cost and disclosed return-loop editing; no new generation occurred in this round. Human creative acceptance remains open for public testing. The [company catalog](companies/README.md) owns browsing navigation.

The user subsequently rejected that film and chose an AI cinematic replacement. [Cinematic Home v2 preparation](companies/aquatic-world/redesign/cinematic-home-v2/README.md) supplies new static concepts, clean scene inputs and a common natural-motion/design contract. The improvement workflow and a new US$3 video cap are authorized. The first landscape request returned an unknown submission outcome with no task ID; it has not been retried, and no replacement website is published yet.

The latest [ecosystem landscape trial v3](companies/aquatic-world/redesign/cinematic-home-v2/media/kling-loop-v1/trial-v3/README.md) completed the separately authorized single desktop request at actual US$1.12. The user subsequently approved the exact raw movie's visual effect and creative direction. Full decode, four complete 1x browser plays and independent source-frame inspection completed; copy intrusion and the raw loop reset remain Home integration gaps. Plant/anatomy composite acceptance remains unestablished. Phone/retries stopped, no website release; the raw review uses a verified loopback byte-range server.

The user-authorized [local desktop Home adaptation](companies/aquatic-world/redesign/cinematic-home-v2/desktop-home-v1/README.md) now uses that exact movie with a protected reading region, outlined action and three editorial category chapters. It preserves eight real destinations and the local Contact flow. The raw loop reset remains visible; no new media fee or publication occurred. Preview it on loopback port 4285 using the documented build/server commands.

A subsequent free [single-play/loop comparison](companies/aquatic-world/redesign/cinematic-home-v2/desktop-home-v1/PLAYBACK-COMPARISON.md) presents the same desktop Home in both playback modes. Single play ends naturally with Replay; the loop keeps moving with the original jump. Twenty-four targeted checks and 43 existing interaction checks passed. The default remains looping, with human preference pending and zero new media fees.

The latest [ecosystem trial preparation v3](companies/aquatic-world/redesign/cinematic-home-v2/media/kling-loop-v1/trial-preparation-v3/README.md) records the user-confirmed static direction, two ready first-frame-only plans and live US$1.12-per-take quotes. Recommend one desktop request under a new US$1.50 ceiling because current conservative capacity does not cover both requests plus the old reservation. New paid authorization remains absent; no provider submission or website release occurred.

The new [living-ecosystem still review](companies/aquatic-world/redesign/cinematic-home-v2/media/kling-loop-v1/ecosystem-v3/README.md), prepared 2026-10-15, supplies independent desktop/phone fish-group compositions, retained UI layouts and four-layer motion-intent annotations. Seven browser viewport checks passed. At the still-generation stage, static acceptance was pending and no video quote/request or shot-plan change occurred. The later preparation above owns the accepted static decision and new local plans/quotes; website release remains unchanged.

The latest [midpoint static review](companies/aquatic-world/redesign/cinematic-home-v2/media/kling-loop-v1/midpoint-v2/README.md) adds desktop/phone fish-visible scenes, refined Top bars and phone copy, proposed route overlays and seven browser viewport checks. The user accepted the static scale/route/UI placement and a US$3 new Kling scope, at most two requests. [Trial execution v2](companies/aquatic-world/redesign/cinematic-home-v2/media/kling-loop-v1/trial-v2/README.md) records one completed landscape request at actual US$1.12, rejected for artificial fish and a static, sparsely inhabited environment. Portrait and retries are stopped. The scene correction is a draft; no website runtime release occurred.

## GitHub Pages demo publication

[Compare actual desktop/phone captures](https://yapweijun1996.github.io/Webpage-Design/comparison/), [open the demo catalog](https://yapweijun1996.github.io/Webpage-Design/), [Codex website](https://yapweijun1996.github.io/Webpage-Design/aquatic-world/codex/) or [Claude website](https://yapweijun1996.github.io/Webpage-Design/aquatic-world/claude/).

The [Pages workflow](.github/workflows/pages.yml) publishes the current round-9 runtimes on pushes to main. The [packager](scripts/prepare_pages.py) rebuilds disposable copies, rebases URL attributes including deferred video paths, verifies local references and preserves CSS/JS/media bytes. Pages serves current runtimes, the responsive preview catalog and a comparison page with sixteen selected browser stills; research, raw trials, raw CLI transcripts and other evaluator evidence are excluded. Contact makes a local preview and sends nothing. This is a fictional design case.

To reproduce and preview the actual project path:

```sh
python3 -B scripts/prepare_pages.py --base=/Webpage-Design/
python3 -B scripts/serve_pages.py --port=4240
```

Open `http://127.0.0.1:4240/Webpage-Design/`. [Fusion brief and static references](companies/aquatic-world/redesign/fusion-home-v1/README.md), [comparison workflow](companies/aquatic-world/comparison/round-9-refinement/README.md) and its [publication record](companies/aquatic-world/comparison/round-9-refinement/PUBLICATION.md) distinguish local verification, external deployment and user acceptance. Raw CLI logs remain private and Git-ignored.

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
