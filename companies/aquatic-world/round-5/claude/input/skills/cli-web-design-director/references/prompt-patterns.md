# Prompt patterns

Fill actual context and constraints; never send unresolved placeholders. These are starting structures, not magic model-specific phrases. Keep task prompts short and put detailed contracts in named files.

## Brief preparation

```text
Turn the user's request and supplied evidence into an implementation-ready website brief.
Audience and visitor task: [actual audience and task].
Site type and required scope: [landing page / multi-page company site / application].
Sources: [research, references and assets]; distinguish facts from assumptions.
Produce the route table, page-specific outline, main journey, navigation states,
responsive visual direction and concrete acceptance scenarios.
Resolve ordinary implementation choices yourself. Ask only when a missing product
decision materially changes the experience. This task is design preparation only.
```

## Implementation

```text
Read repository instructions, DESIGN-BRIEF.md and ACCEPTANCE.md.
Inspect named reference images and supplied assets.
Build the current brief in [owned output directory]. Document the page/content plan
before coding, then implement and verify the result.
The reference defines [visual qualities]; the brief defines [product scope].
Implement required destinations with page-specific content and usable states.
Verify the actual main journey, direct loads, refresh, browser history, keyboard
header/menu behavior and responsive composition on agreed viewports.
Capture real screenshots; identify and repair concrete layout defects.
Record actual checks, limitations, model/CLI/tool metadata and preview commands.
```

For multi-page work, include actual routes and explicitly forbid replacing global page navigation with homepage scroll links. For one-page work, retain intentional anchors. Do not say "landing page" when the request is a complete website.

## Focused revision

```text
Revise [owned source] against [current contract].
Observed defect: [viewport, route, state and screenshot/evidence].
User impact: [what is unclear, inaccessible or structurally wrong].
Required result: [observable behavior or visual treatment].
Preserve [working relevant contracts].
Recheck [affected scenarios], save comparable screenshots and disclose remaining gaps.
```

Example: "On inner pages, Collections currently links to #collections on Home. Link to /collections/, show Collections as current on category pages, and verify navigation from Contact, direct category loading, reload and Back. Use the index for discovery and detail pages for category context."

## Paired comparison

Give workers byte-identical input files and the same short implementation prompt. Do not coach only one after seeing output. Record shared revisions as a new experiment stage. When product scope changes, change the scoring protocol; do not present a multi-page score as a direct improvement percentage over a single-page score.

## Learn from a failure

Record request, relevant prompt clause, observed output, cause evidence, corrected instruction and verification coverage. Wrong scope needs a better contract; CSS defects need source fixes; unavailable browser access needs an honest QA gap or an authorized available tool. Prompt wording alone cannot resolve all three.
