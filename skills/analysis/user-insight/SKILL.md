---
name: user-insight
description: Derive behavior, pain point, need, motivation, and opportunity from user research and usage evidence. Use when user evidence exists.
---

# User Insight

Version: 1.0.0

## Purpose
把用户材料转为 `Behavior -> Pain Point -> Need -> Motivation -> Opportunity`。
## When to Use
已有访谈、调研、反馈、日志或行为数据。
## When NOT to Use
只有团队观点、Persona 想象或无法确认样本时。
## Input
研究问题、样本、观察/原话、行为数据、场景。
## Reasoning Process
先记录行为；区分症状和原因；识别 Need 与 Motivation；检查人群差异；形成机会并标置信心。
## Output
用户 Insight、证据链、分群差异和研究缺口。
## Output Schema
`{"insights":[{"user_segment":"","behavior":"","pain_point":"","need":"","motivation":"","opportunity":"","evidence_refs":[],"confidence":""}]}`
## Quality Criteria
结论不超出样本；行为和态度分开；机会不提前写成 Feature。
## Common Mistakes
把原话等同普遍需求；只展示比例没有原因。
## Example
“不会调参数”需进一步判断是入口不可见、术语难懂还是反馈不足，三者对应不同机会。
