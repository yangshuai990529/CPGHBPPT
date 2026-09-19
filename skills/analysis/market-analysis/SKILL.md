---
name: market-analysis
description: Analyze market size, segments, structure, and dynamics with explicit scope and sources. Use when market evidence affects product choice.
---

# Market Analysis

Version: 1.0.0

## Purpose
给出有口径的市场结构和产品含义。
## When to Use
市场规模、细分、增长或渠道会影响优先级时。
## When NOT to Use
没有可靠数据，或产品决策与市场规模无关时。
## Input
地区、时间、品类定义、市场数据、Source。
## Reasoning Process
统一口径；拆分细分；比较规模和变化；识别驱动与限制；形成 Implication。
## Output
市场事实、细分、变化、解释和限制。
## Output Schema
`{"scope":{},"facts":[],"segments":[],"interpretations":[],"implications":[],"limitations":[]}`
## Quality Criteria
每个数字有时间、单位、地区和 Source；不混用 TAM 与销量。
## Common Mistakes
拼接不同口径数据；把增长等同机会。
## Example
比较不同地区 AI 电视渗透时，必须统一年份和品类定义，否则只输出缺口。
