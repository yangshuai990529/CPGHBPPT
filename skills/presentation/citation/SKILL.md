---
name: citation
description: Map slide claims and assets to sources with scope, locator, and visible or note-level citation requirements.
---
# Presentation Citation
Version: 1.0.0
## Purpose
确保事实、数据、图片和引用能回溯到支持它们的 Source。
## When to Use
Slide Spec 含外部事实、内部材料、图片或数据。
## When NOT to Use
不为纯内部假设伪造引用，也不把搜索结果页当来源。
## Input
Claims、Source Objects、Slide Specs、披露要求。
## Reasoning Process
逐 Claim 匹配直接支持来源；记录页码/章节；判断页内或讲者备注；标记 Source 不足和许可限制。
## Output
Citation Map 和 Slide Spec source_ids 更新。
## Output Schema
`{"citations":[{"slide_id":"","claim":"","source_id":"","locator":{},"placement":"slide|notes"}],"unsupported_claims":[]}`
## Quality Criteria
来源直接支持 Claim；定位精确；图片许可被记录。
## Common Mistakes
一个来源支持整页所有结论；引用二手摘要却写成一手事实。
## Example
市场规模数字应引用具体报告页和年份；模型形成的 Opportunity 只引用其上游 Evidence，不伪装成外部原话。
