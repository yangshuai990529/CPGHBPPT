---
name: line-chart
description: Specify a line chart for continuous time-series trends, rates of change, and turning points.
---
# Line Chart
Version: 1.0.0
## Purpose
表达随时间连续变化的方向、速度和拐点。
## When to Use
至少多个有序时间点，口径一致。
## When NOT to Use
无序类别、单一时间点、采样间隔不可比。
## Input
时间、系列、数值、单位、缺失规则、事件注释、Source。
## Reasoning Process
统一时间粒度；处理缺失；限制系列数；只标注关键拐点。
## Output
折线图规格。
## Output Schema
`{"type":"line-chart","x":[],"series":[],"unit":"","annotations":[],"source_ids":[]}`
## Quality Criteria
时间顺序正确；不插值假数据；事件注释不暗示未经证明因果。
## Common Mistakes
把预测和历史画成同一实线；双轴制造误导。
## Example
展示 AI 模式月活变化时，用虚线区分预测，并说明口径变化点。
