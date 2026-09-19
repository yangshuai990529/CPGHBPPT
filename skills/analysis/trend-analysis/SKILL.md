---
name: trend-analysis
description: Identify durable product-relevant changes across time and separate facts, trend signals, interpretation, and implications.
---

# Trend Analysis

Version: 1.0.0

## Purpose
判断哪些变化足以影响产品方向。
## When to Use
有跨时间或多来源信号，需要区分短期事件和趋势。
## When NOT to Use
单个新闻、单一时间点或纯预测没有依据时。
## Input
时间序列、事件、多个来源、产品上下文。
## Reasoning Process
验证时间范围；识别方向、速度和拐点；寻找多源一致性与反例；形成 Implication。
## Output
趋势、信号、反信号、成熟度和产品含义。
## Output Schema
`{"trends":[{"statement":"","signals":[],"counter_signals":[],"maturity":"emerging|scaling|mature|declining","implication":""}]}`
## Quality Criteria
趋势有多个时间点或独立信号；不把预测当事实。
## Common Mistakes
把流行词当趋势；忽略地区差异。
## Example
多家厂商连续版本把 AI 从单点功能扩展到场景流程，可作为趋势候选；仍需用户采用证据确认产品意义。
