# Native Review References and Provenance

These six JPEGs are unchanged copies of native in-app Chromium captures taken during the 2026-10-13 phone review. They show the published round-8 baseline at commit `0aa3f689834b8975596fe9a18d2a6c6e13116137`, at 390×844 CSS pixels. No AI image generation, compositing, recoloring or cropping was used. The [reference manifest](manifest.json) records byte identity.

Sources inspected on 2026-10-13: [Codex Home](https://yapweijun1996.github.io/Webpage-Design/aquatic-world/codex/) and [Claude Home](https://yapweijun1996.github.io/Webpage-Design/aquatic-world/claude/). These are the fictional case's own demos, not company research or real-company evidence.

| File | Observed state and purpose |
| --- | --- |
| [Codex arrival](codex-home.jpg) | Settled portrait film, readable offer and complete CTA. Preserve this successful composition. |
| [Claude arrival](claude-home.jpg) | Same preservation reference for its own layout. Films were captured independently, not at matched phases. |
| [Codex Menu](codex-menu.jpg) | Opaque dark disclosure, readable links and unchanged underlying hero placement. |
| [Claude Menu](claude-menu.jpg) | Similar normal-phone panel extent, with a lighter blue surface. This revision aligns the deep-teal color rather than shrinking rows. |
| [Codex scrolled header](codex-scrolled-header.jpg) | Collection heading visibly bleeds behind the brand/control row. This is the primary failure reference. |
| [Claude scrolled footer](claude-footer.jpg) | Perspective heading/body remains visible behind the top row at the end of document scrolling. The footer composition is context, not a requested footer redesign. |

Measured review facts: at 844×390, the Codex CTA ends at y391.98 and the Claude CTA at y328.78. At 390×844 their CTA bottoms are approximately y737.15 and y744 respectively, and both normal menus end around y369. These are baseline observations, not target coordinates. The horizontal screenshots were inspected in the live browser; they are not included in this six-image package. Historical measurement records also appear in the [round-8 matrix](../../../comparison/round-8-fusion/evidence/viewport-matrix-final.json).

The observed cause of header bleed is a scrolled surface that remains translucent. The original design requirement also requested a stronger translucent wash. The new brief deliberately replaces that requirement with full masking inside the navigation row. This is a design-contract correction as well as an implementation refinement.

Visual preference: the reviewer favored Codex's darker surface and restrained lower-page type, and Claude's more comfortable narrow-landscape layout. Normal-phone Menu height does not establish a Claude advantage. These judgments are distinct from the concrete overlap and CTA-clearance findings and do not establish user acceptance.
