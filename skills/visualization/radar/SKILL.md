---
name: radar
description: Specify a radar chart for a small number of objects across comparable normalized dimensions, with caution about precision.
---
# Radar
Version: 1.0.0
## Purpose
展示少量对象的多维轮廓。
## When to Use
3 至 8 个同尺度维度，目标是整体画像而非精确差值。
## When NOT to Use
维度尺度不同、对象过多、需要精确比较。
## Input
维度、标准化规则、对象、分值、Source。
## Reasoning Process
验证同尺度；限制对象；固定轴顺序；同时保留数值表或标签。
## Output
雷达图规格。
## Output Schema
`{"type":"radar","dimensions":[],"scale":{},"series":[],"source_ids":[]}`
## Quality Criteria
分值规则透明；面积不作为定量结论；不遮挡。
## Common Mistakes
主观评分无依据；用面积比较细微差异。
## Example
竞品体验画像可用统一 1-5 评分，但正式结论应回到各维证据。
