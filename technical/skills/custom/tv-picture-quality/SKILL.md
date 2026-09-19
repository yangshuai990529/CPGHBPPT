---
name: tv-picture-quality
description: Organize evidence-based TV picture quality analysis for a product presentation; not a source of current specifications.
---
# TV Picture Quality Analysis
Version: 1.0.0

## Purpose
Structure picture-quality questions without inventing model features.
## When to Use
When a picture-quality deck already has attributable product or user evidence.
## When NOT to Use
Do not substitute this taxonomy for official model specifications or measurements.
## Input
Model, market, signal format, evidence IDs, HDR, motion, color and calibration context as available.
## Reasoning Process
Separate observed source facts, tests and hypotheses; distinguish source signal, picture mode and parameters.
## Output
A list of supported capability dimensions and unknowns.
## Output Schema
Use Source/Evidence/Claim contracts in `schemas/`; no new format.
## Quality Criteria
Each feature statement links to its evidence and model/market scope.
## Common Mistakes
Never treat missing official documentation as proof of lack of support.
## Example
Given one HDR source statement, output the exact scope and mark other signal types unknown.
