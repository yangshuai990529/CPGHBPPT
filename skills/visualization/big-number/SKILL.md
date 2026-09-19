---
name: big-number
description: Specify a big-number visual for one sourced metric that needs emphasis and context.
---
# Big Number
Version: 1.0.0
## Purpose
突出一个能改变判断的核心数字。
## When to Use
只有一个主指标，单位、时间、基准和 Source 完整。
## When NOT to Use
多指标比较、无基准、数字未经验证。
## Input
数值、单位、定义、时间、基准、Source、结论。
## Reasoning Process
验证口径；判断数字是否足以承载结论；补最小上下文。
## Output
视觉规格、标签、来源和禁用条件。
## Output Schema
`{"type":"big-number","value":"","unit":"","context":"","source_ids":[]}`
## Quality Criteria
读者无需猜分母和时间；数字不夸大精度。
## Common Mistakes
把多个 KPI 排成卡片；数字大但无 So What。
## Example
“设置完成率 42%”只有在说明样本、时间和对比基准后才可使用。
