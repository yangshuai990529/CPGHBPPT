---
name: market-research
description: Collect sourced market metrics with original units and scope, not market strategy
---
# market-research

Version: 1.0

## Purpose
Collect sourced market metrics with original units and scope, not market strategy. Return verified facts and explicit gaps.

## When to Use
When a Deck Plan requires external market evidence.

## When NOT to Use
Do not infer product opportunities, strategy, or user preferences from missing facts.

## Input
Project brief, research questions, target entities, market and timeframe; user materials remain local. Fields: metric, value, unit, period, region, population, source_id.

## Reasoning Process
Prefer official sources for product claims, research publications for market metrics. Record URL, date, exact passage, model and region. Cross-check conflicts without auto-picking a winner. Never treat a screenshot alone as a product feature claim.

## Output
Research Dataset with Source, Claim, Evidence IDs, coverage and gaps. Unknown is `?`, not false.

## Output Schema
`schemas/source.schema.json`, `schemas/evidence.schema.json`, `schemas/claim.schema.json`; queries use `schemas/research-query.schema.json`.

## Quality Criteria
Every checked cell has an Evidence ID and URL. Every metric retains original value, unit, period, region and scope.

## Common Mistakes
Do not turn vendor marketing copy into an independent lab result, or a missing result into absence. Do not mix product variants or regions.

## Example
Input: Samsung AI picture, US. Output: {"status":"partial","evidence_refs":["E001"],"open_questions":["Which models?"],"result":{"claim_id":"C001"}}.
