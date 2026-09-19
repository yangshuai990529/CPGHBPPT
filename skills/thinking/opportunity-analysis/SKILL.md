---
name: opportunity-analysis
description: Turn validated industry, user, competitor, and current-state insights into prioritized product opportunities. Use before product strategy and feature definition.
---

# Opportunity Analysis

Version: 1.0.0

## Purpose
建立 Insight 到 Strategy 之间的产品机会桥梁。

## When to Use
行业、用户、竞品和现状已有至少部分证据，需要定义可解决机会时。

## When NOT to Use
不要从单个竞品功能直接生成机会，也不要在目标用户未知时排序。

## Input
Insight/Implication 节点、目标用户、场景、当前能力、约束。

## Reasoning Process
定义未满足问题；写对象、场景、价值和触发条件；检查与当前能力的差距；评估价值、可行性、差异化和证据强度；保留不做理由。

## Output
Opportunity 列表、优先级和上游映射。

## Output Schema
`{"opportunities":[{"opportunity_id":"","user":"","scenario":"","problem":"","value":"","upstream_ids":[],"priority":"","confidence":""}],"rejected":[]}`

## Quality Criteria
每个机会可回溯；描述的是问题空间而非解决方案；排序标准透明。

## Common Mistakes
把 Feature 改名为 Opportunity；只看市场规模；忽略本方约束。

## Example
“自动优化画质”不是机会；“普通用户无法把主观观感转成参数，导致调节放弃”才是可验证机会。
