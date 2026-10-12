# Aquatic World Design Brief

## Current requirement

The user rejected the round-2 landing pages on 2026-10-11 and clarified the need for a structured multi-page website, independent navigation destinations and improved header/visual detail. Both new implementations follow the [multi-page brief](redesign/BRIEF.md), [acceptance scenarios](redesign/ACCEPTANCE.md) and [prepared prompt](redesign/IMPLEMENTATION-PROMPT.txt). The [round-3 evaluation](comparison/round-3/RESULTS.md) records passing exercised functional gates and remaining visual weaknesses; user acceptance is pending. The [learning record](redesign/LEARNINGS.md) explains the evidence and prompting research.

## Historical comparison scope

The sections below describe the two completed landing-page rounds. Their inputs and deliveries remain unchanged; their fidelity scores do not establish satisfaction of the new website requirement.

## Goal

Independently translate the supplied premium aquatic design into a working local landing page, then compare the results and explain the observable implementation decisions behind their differences.

## Fixed design direction

Use the handoff's selected screenshot: cinematic underwater photography, deep ocean teal, champagne-gold accents, cream story panels, serif display headings, and clear sans-serif supporting text.

Section sequence: header, hero, heritage, collections, quality, highlights, enquiry, footer. Primary action: collection discovery. Secondary action: business enquiry. Responsive behavior and accessibility take precedence where a static reference cannot specify a usable state.

## Shared task

The authoritative implementation task is the byte-identical `TASK.md` in each CLI workspace. The original handoff is preserved unchanged under each `input/handoff/`. The [fixed nine-image pack](comparison/assets-v1/README.md) is copied into each `input/assets/` with the same image-slot mapping. Input baseline v2 resolves demo-specific ambiguities and the original lack of independent imagery without changing the supplied handoff.

## Evidence boundaries

Brand and business-specific data must remain configurable. Sample content must be identified as fictional or illustrative. No actual business facts, valid contact destination, successful enquiry submission, or completed QA may be invented.

## Evaluation

Use the [comparison protocol](comparison/README.md) and its predeclared rubric. Compare equivalent run stages and viewports. Attribute observed differences to specific layout, asset, interaction, or code choices; treat claims about a model's general ability as unproven from one pair of outputs.
