---
name: insight-extraction
description: Convert sourced facts and interpretations into traceable product insights and implications. Use when evidence exists; do not use for unsupported ideation.
---

# Insight Extraction

Version: 1.0.0

## Purpose
从多个事实和解释中形成可回溯、能影响产品决策的 Insight。

## When to Use
已有研究、访谈、数据、竞品观察或内部事实，需要收敛 So What 时。

## When NOT to Use
只有观点没有 Source，或目标只是摘要原文时。

## Input
符合 Source Schema 的来源、Fact 节点、上下文和决策问题。

## Reasoning Process
核对事实口径；寻找一致、冲突和异常；形成 Interpretation；组合为 Insight；说明 Implication 与置信度；记录反证。

## Output
符合 `insight.schema.json` 的 FACT、INTERPRETATION、INSIGHT、IMPLICATION 节点。

## Output Schema
`{"nodes":[],"tensions":[],"evidence_gaps":[]}`

## Quality Criteria
Insight 不是事实复述；每个节点有上游；置信度与证据一致。

## Common Mistakes
把单个比例叫洞察；忽略相反证据；把假设写成事实。

## Example
多份访谈显示设置入口难找，行为数据也显示高放弃率，可形成“主要障碍是可发现性”Insight；没有行为数据时只能保留中低置信度。
