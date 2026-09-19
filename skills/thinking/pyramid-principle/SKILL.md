---
name: pyramid-principle
description: Organize product arguments into a governing message and mutually distinct supporting claims. Use to repair unclear hierarchy, not to manufacture evidence.
---

# Pyramid Principle

Version: 1.0.0

## Purpose
把零散观点组织为结论、支撑命题和证据层级。

## When to Use
用于核心信息不清、论点重复、页面顺序松散的 Deck Plan。

## When NOT to Use
不要用来替代研究、补造证据或强行把复杂问题压成固定三点。

## Input
`claims`、`evidence_refs`、`decision_needed`、`constraints`。

## Reasoning Process
先写统领结论，再按因果、结构或时间选择一种分组逻辑；检查同层互斥、完整与证据归属；保留重要反例。

## Output
结构化 Argument Tree 和重复/缺口清单。

## Output Schema
`{"governing_message":"","grouping_logic":"cause|structure|sequence","supporting_claims":[],"evidence_map":{},"gaps":[]}`

## Quality Criteria
同层论点不重复；每个证据只支持明确 Claim；结论不超出证据。

## Common Mistakes
为了形式固定成三点；把事实、结论和行动混在同层。

## Example
将“用户痛点、竞品功能、我们的方案”重组为“机会成立的三类证据 -> 策略选择 -> 能力承接”，缺失用户证据时明确标记 gap。
