# Aquatic World — Premium Aquatic Landing Page / Design Handoff v1.0

**Status:** Design selected by requester · Documentation handoff prepared · **No website implementation or deployment performed**.  
**Source of truth for visual direction:** [`reference/selected-homepage-mockup.png`](reference/selected-homepage-mockup.png).  
**Project intent:** Turn the selected premium aquatic homepage concept into a reusable, **configuration-driven** site template for aquarium / aquatics B2B suppliers or related businesses.

> **Important:** `AQUATIC WORLD`, Singapore, the imagery, product labels, and marketing claims inside the AI-generated reference are **visual/demo placeholders**, not verified commercial facts. Do not copy those claims into production unless approved by the actual business. No brand, country, domain, phone, product availability, achievements, testimonials, or certifications may be hardcoded.

## Start here

1. **Open `OPEN_ME.html`** locally in a browser for an offline, illustrated document navigator. No installation, server, account, or internet is required.
2. Inspect the selected mockup in `reference/selected-homepage-mockup.png`.
3. Read `docs/00_PROJECT_BRIEF.md` and `docs/01_VISUAL_DESIGN_SYSTEM.md`.
4. Read `docs/02_PAGE_STRUCTURE.md`, `docs/03_COMPONENT_INTERACTIONS.md`, and `docs/04_RESPONSIVE_ACCESSIBILITY.md`.
5. For developers or coding agents, continue with `docs/05_CONFIG_DATA_CONTRACT.md`, `docs/07_ENGINEERING_GUIDE.md`, and `docs/09_AI_AGENT_IMPLEMENTATION_PROMPT.md`.
6. Before deployment, follow `docs/08_QA_ACCEPTANCE.md` and the CSV checklists under `qa/`.

## Files at a glance

| Area | Files | Purpose |
|---|---|---|
| Reference | `reference/selected-homepage-mockup.png` | The *approved direction* for visual design; not a functional screenshot |
| Specifications | `docs/00`–`docs/12` | Scope, layout, UX, content, accessibility, engineering, QA and handoff |
| Tokens | `tokens/design-tokens.json`, `tokens/design-tokens.css` | Proposed consistent visual design variables |
| Data examples | `examples/*.json` | Generic, editable content and site configuration |
| Schemas | `schemas/*.json` | JSON Schema contracts to validate configuration and homepage content |
| QA templates | `qa/*.csv` | Evidence ledger, responsive test matrix, acceptance tracking and asset audit |
| Offline reader | `OPEN_ME.html` | Browse the entire spec without external dependencies |

## Locked design decisions

- Chosen direction: **Luxury Nature Storytelling** / **Premium Aquatic Editorial**.
- Visual motif: cinematic tropical freshwater aquarium imagery, deep ocean teal, restrained champagne-gold accents, off-white editorial panels, serif display headings and clean sans-serif text.
- Sequence: **Header → Hero → Heritage → Collections → Commitment/Quality → Selected Highlights → Enquiry CTA → Footer**.
- Primary action: **Explore Collections**; secondary: **Business Enquiry**. No shopping cart or checkout in v1.
- Branding: replaceable via data configuration; no business name baked into HTML, CSS, JavaScript, assets or SEO templates.
- Content: source and approvals required. Product gallery is *not* a live inventory feed.
- Deliverable here: **documentation + approved screenshot reference**, not website source code, API integration, public deployment or production-ready photographs.

## Operational notes / 使用提示

此 ZIP 是给开发者、Figma 设计师或 AI Coding Agent 的完整设计规格。你选中的图片是视觉方向，不代表真实公司的产品、出口国家、认证或地址。`Aquatic World` 只是图片中的示范品牌，实际网站的品牌、地点、产品分类及内容都应该通过 JSON 配置更换。实现前先看 `docs/10_DECISIONS_RISKS.md`，上线前必须经过 `qa/` 验收。

**Progress:** documentation package 100%; working website 0%; real business content approval pending.
