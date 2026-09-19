---
name: local-dimming-analysis
description: Local dimming claims versus measured/observed effect. Use for evidence-based product presentations, not unverified current device facts.
---
# Local Dimming Analysis
Version: 1.0.0

## Purpose
Local dimming claims versus measured/observed effect; produce scoped analysis questions before any interpretation.

## When to Use
Use when the brief explicitly calls for local dimming analysis and models or research scope are identifiable.

## When NOT to Use
Do not apply every dimension to every deck, or present a research question as an observed product fact.

## Input
source, firmware, mode, test pattern, ambient light; Source/Evidence IDs and exact market/time scope as available.

## Reasoning Process
Select only relevant dimensions: backlight claim / test condition / blooming / black level. Record what is supported, what is marketing language, and what is unknown. Keep FACT separate from INTERPRETATION and INSIGHT.

## Output
A prioritized dimension checklist with supporting Evidence IDs, unknowns, scope and follow-up research needs. Never output an ungrounded feature verdict.

## Output Schema
Use `schemas/claim.schema.json`, `schemas/evidence.schema.json` and `schemas/insight.schema.json` when making claims or interpretations.

## Quality Criteria
Every checked competitor cell has a Source and comparable model/market scope. Unchecked cells are unknown, not absent.

## Common Mistakes
Avoid comparing brightness without picture mode and test conditions.

## Example
Input: one official capability claim for a US model. Output: that model-scoped capability with its Evidence ID; all unresearched related dimensions stay `?`.
