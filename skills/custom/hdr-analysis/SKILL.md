---
name: hdr-analysis
description: HDR product analysis with explicit format and content scope. Use for evidence-based product presentations, not unverified current device facts.
---
# Hdr Analysis
Version: 1.0.0

## Purpose
HDR product analysis with explicit format and content scope; produce scoped analysis questions before any interpretation.

## When to Use
Use when the brief explicitly calls for hdr analysis and models or research scope are identifiable.

## When NOT to Use
Do not apply every dimension to every deck, or present a research question as an observed product fact.

## Input
HDR format, source, model, firmware, market; Source/Evidence IDs and exact market/time scope as available.

## Reasoning Process
Select only relevant dimensions: format support / signal received / current picture mode / measured or observed outcome. Record what is supported, what is marketing language, and what is unknown. Keep FACT separate from INTERPRETATION and INSIGHT.

## Output
A prioritized dimension checklist with supporting Evidence IDs, unknowns, scope and follow-up research needs. Never output an ungrounded feature verdict.

## Output Schema
Use `schemas/claim.schema.json`, `schemas/evidence.schema.json` and `schemas/insight.schema.json` when making claims or interpretations.

## Quality Criteria
Every checked competitor cell has a Source and comparable model/market scope. Unchecked cells are unknown, not absent.

## Common Mistakes
Do not equate HDR-capable hardware with a given HDR signal or result.

## Example
Input: one official capability claim for a US model. Output: that model-scoped capability with its Evidence ID; all unresearched related dimensions stay `?`.
