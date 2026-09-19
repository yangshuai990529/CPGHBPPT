---
name: executive-summary
description: Produce a concise decision summary from conclusions already supported in the deck. Use last in storyline drafting; never introduce new evidence or recommendations.
---

# Executive Summary

Version: 1.0.0

## Purpose
让决策者快速理解发现、建议、影响和所需决策。

## When to Use
正文逻辑和关键结论已稳定，需要生成首部摘要时。

## When NOT to Use
研究未完成、正文没有支持，或把摘要当作营销口号时。

## Input
已支持的 Insight、Opportunity、Strategy、Roadmap、Metrics 和 decision_needed。

## Reasoning Process
提取会改变决策的结论；合并重复；保留关键条件和风险；明确请求的决策。

## Output
摘要主张、3 至 5 个必要要点、决策请求和限制。

## Output Schema
`{"headline":"","findings":[],"recommendation":"","decision_request":"","conditions":[]}`

## Quality Criteria
每点可回到正文；没有新事实；读完可知道要决定什么。

## Common Mistakes
复制目录；加入未展开的新建议；使用空泛“全面提升”。

## Example
正文证明设置复杂导致使用流失后，摘要可写“首期应优先降低发现和调节门槛”，并引用相应 Slide IDs。
