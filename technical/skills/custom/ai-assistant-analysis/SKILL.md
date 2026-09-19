---
name: ai-assistant-analysis
description: Analyze assistant tasks and their user-facing limits. Use for evidence-based product presentations, not unverified current device facts.
---
# Ai Assistant Analysis
Version: 1.0.0

## Purpose
Analyze assistant tasks and their user-facing limits; produce scoped analysis questions before any interpretation.

## When to Use
Use when the brief explicitly calls for ai assistant analysis and models or research scope are identifiable.

## When NOT to Use
Do not apply every dimension to every deck, or present a research question as an observed product fact.

## Input
task, input modality, result, failure, privacy; Source/Evidence IDs and exact market/time scope as available.

## Reasoning Process
Select only relevant dimensions: request / context / response / user verification. Record what is supported, what is marketing language, and what is unknown. Keep FACT separate from INTERPRETATION and INSIGHT.

## Output
A prioritized dimension checklist with supporting Evidence IDs, unknowns, scope and follow-up research needs. Never output an ungrounded feature verdict.

## Output Schema
Use `schemas/claim.schema.json`, `schemas/evidence.schema.json` and `schemas/insight.schema.json` when making claims or interpretations.

## Quality Criteria
Every checked competitor cell has a Source and comparable model/market scope. Unchecked cells are unknown, not absent.

## Common Mistakes
Do not infer agent autonomy from chat interface.

## Example
Input: one official capability claim for a US model. Output: that model-scoped capability with its Evidence ID; all unresearched related dimensions stay `?`.
