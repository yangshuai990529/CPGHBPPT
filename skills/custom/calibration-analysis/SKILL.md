---
name: calibration-analysis
description: Analyze TV calibration flows by signal, target, measured baseline, applied setting and verified result; do not invent accuracy gains.
---
# Calibration Analysis
Version: 1.1.0

## Purpose
Make a calibration claim reproducible and distinguish parameter change from picture improvement.

## When to Use
A deck covers camera/phone calibration, TV calibration, color correction, picture profile or before/after assessment.

## When NOT to Use
Do not claim a successful calibration from a UI screenshot, completed wizard or uploaded file alone.

## Input
Device/model, firmware, input signal, selected picture mode, measurement device, target, baseline, adjusted settings, result and source/consent scope.

## Reasoning Process
Check precondition → measure → apply correction → remeasure → compare under the same signal/mode and conditions. Record RGB/color coordinates, units and uncertainty only if present. Separate a user-facing explanation from the technical result and a privacy/consent concern from an image-quality metric.

## Output
Testable calibration flow, evidence table, unresolved conditions and warranted interpretation only.

## Output Schema
Use project Source/Evidence/Claim schemas and an Insight node only after result evidence exists.

## Quality Criteria
A result specifies target, before/after, signal/mode, measurement and limitations. The workflow does not invent a server-side rollback or permissions not present in source requirements.

## Common Mistakes
Do not infer current mode from available modes or infer visual quality from a completed upload.

## Example
If before/after measurements are missing, output `RESULT_NOT_VERIFIED` and request them rather than writing “color improved”.
