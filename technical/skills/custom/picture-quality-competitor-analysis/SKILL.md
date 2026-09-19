---
name: picture-quality-competitor-analysis
description: Compare TV picture quality capabilities for specified models and markets using only source-linked evidence; choose dimensions by the decision question, not a universal checklist.
---
# Picture Quality Competitor Analysis
Version: 1.1.0

## Purpose
Select a defensible picture-quality comparison scope and report unknowns without treating vendor copy as an independent lab result.

## When to Use
The brief asks to compare TV models on picture quality, calibration, AI picture or gaming image performance.

## When NOT to Use
Do not apply every dimension to every deck; do not infer user satisfaction from panel specifications.

## Input
Decision question, audience, target user, market, model/SKU, firmware if material, source signal, price tier, Source/Evidence IDs and test conditions.

## Reasoning Process
1. Fix comparable scope: model, region, date, signal type, picture mode and measurement method.
2. Route dimensions: Mini LED → backlight/local dimming, brightness conditions, HDR and blooming; AI Picture → recognition, processing, adjustment, ambient adaptation, personalization and user control; Calibration → target, measurement, adjustment, validation; gaming → source/port, VRR/ALLM, latency and picture result.
3. For each cell keep vendor claim, independent test and actual user observation separate. A checked cell needs an Evidence ID. A `?` means research has not established the answer; never write `✗` by absence alone.
4. Compare trade-offs only where scope is matched. Flag conflicts for a human reviewer rather than averaging figures from different models.

## Output
Prioritized comparison matrix, gaps/conflicts, sources, scope caveats and the next research question. Interpretation belongs to Product Reasoning, not this Skill.

## Output Schema
Use `schemas/claim.schema.json`, `schemas/evidence.schema.json` and `schemas/insight.schema.json` for downstream interpretation.

## Quality Criteria
Every positive cell traces to a source passage or result; all metrics retain year, unit, region and test mode. An advantage statement compares like for like.

## Common Mistakes
Do not say a television has no ambient adaptation just because one US product page does not mention it. Avoid comparing a lab HDR measurement against a marketed peak brightness claim as equal values.

## Example
Input: AI Picture across three named US models. Output: recognition/auto-adjustment evidence rows per model, with unsupported or conflicting fields as `?`/`!`, plus next checks for environment adaptation and user control.
