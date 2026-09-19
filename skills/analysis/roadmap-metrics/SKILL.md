---
name: roadmap-metrics
description: Build phased product roadmaps with goals, dependencies, learning milestones, and user/product/business metrics. Use after strategy and capability definition.
---

# Roadmap Metrics

Version: 1.0.0

## Purpose
把能力建设、验证顺序和衡量方法组合为可执行 Roadmap。
## When to Use
Strategy、Capabilities 与关键假设已明确。
## When NOT to Use
只需要项目排期，或日期和资源完全未知时假装精确。
## Input
能力、依赖、风险、假设、资源约束、已有基线。
## Reasoning Process
按价值和依赖分阶段；为每阶段写目标、交付、进入/退出条件；定义 User/Product/Business Metrics 与口径。
## Output
阶段 Roadmap、依赖和指标树。
## Output Schema
`{"phases":[{"name":"","goal":"","deliverables":[],"dependencies":[],"exit_criteria":[]}],"metrics":{"user":[],"product":[],"business":[]}}`
## Quality Criteria
阶段有学习逻辑；指标有口径、基线/待测和时间窗。
## Common Mistakes
Roadmap 只是功能日历；用虚构目标数字填空。
## Example
Phase 1 验证推荐可理解性，Phase 2 扩展场景和可复用方案；无基线时写“首期建立基线”。
