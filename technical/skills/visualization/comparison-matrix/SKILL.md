---
name: comparison-matrix
description: Specify a comparison matrix for multiple comparable products or options across consistent dimensions.
---
# Comparison Matrix
Version: 1.0.0
## Purpose
用一致维度比较多个对象并支持结论。
## When to Use
对象可比，维度定义和评分规则一致。
## When NOT to Use
维度不同、单纯截图集合、精确数值更适合图表。
## Input
对象、维度、单元格事实、评分规则、Source、结论。
## Reasoning Process
统一口径；减少维度；区分事实与评分；突出与结论相关的差异。
## Output
矩阵规格和注释。
## Output Schema
`{"type":"comparison-matrix","rows":[],"columns":[],"cells":[],"legend":{},"source_ids":[]}`
## Quality Criteria
每格可追溯；缺失不写成否；颜色不替代标签。
## Common Mistakes
Feature Checklist 无 So What；用主观勾叉冒充证据。
## Example
以触发、自动化、可解释、可撤回比较 AI 画质方案，而非只写“支持/不支持 AI”。
