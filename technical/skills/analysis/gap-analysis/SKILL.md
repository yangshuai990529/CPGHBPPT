---
name: gap-analysis
description: Compare current state with a defined target benchmark and identify consequential product gaps. Use after benchmark and current state are explicit.
---

# Gap Analysis

Version: 1.0.0

## Purpose
明确我们在哪里、目标在哪里以及差距为何重要。
## When to Use
有当前状态和用户/行业/竞品/战略基准。
## When NOT to Use
基准不明确或只想列缺陷时。
## Input
Current State、Target State、benchmark type、证据、约束。
## Reasoning Process
对齐比较维度；量化或分级差距；识别根因与影响；区分能力缺口、体验缺口和证据缺口。
## Output
Gap 列表、影响、优先级和上游依据。
## Output Schema
`{"benchmark":"","gaps":[{"dimension":"","current":"","target":"","gap":"","impact":"","evidence_refs":[]}],"unknowns":[]}`
## Quality Criteria
比较口径一致；Gap 不等于 Feature；影响可解释。
## Common Mistakes
用竞品存在即定义差距；把未知当落后。
## Example
竞品支持自动模式不代表本品必须复制；需先确认目标用户问题和本方策略基准。
