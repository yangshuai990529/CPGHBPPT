---
name: content-density
description: Assess slide content density and recommend cutting, splitting, or restructuring before font reduction.
---
# Content Density
Version: 1.0.0
## Purpose
控制一页信息量，优先改内容结构而非缩小字体。
## When to Use
Slide Spec 文本、表格或图表可能超出安全区。
## When NOT to Use
不用于改变必须保留的证据含义，也不直接渲染。
## Input
标题、正文、数据点、资产、版式安全区、字号规则。
## Reasoning Process
计算内容组数量；检查一页一结论；识别可删、可移注释、可拆页内容；评估 low/medium/high。
## Output
密度等级和调整建议。
## Output Schema
`{"density":"low|medium|high","fit_risk":"pass|risk|fail","actions":[],"split_plan":[]}`
## Quality Criteria
不删除关键证据；不以低于可读阈值解决；建议能回到 Slide Spec。
## Common Mistakes
先缩字体；用卡片网格掩盖信息过载。
## Example
一页含 12 项竞品功能和 4 条结论时，保留结论与关键差异，把完整表移到附录。
