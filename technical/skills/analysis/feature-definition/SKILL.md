---
name: feature-definition
description: Define product features as scoped capabilities with user value, trigger, behavior, boundaries, dependencies, and success signals. Use after strategy.
---

# Feature Definition

Version: 1.0.0

## Purpose
把 Strategy/Capability 转为可评审的 Feature，而非功能名列表。
## When to Use
策略和能力已确认，需要描述产品行为与边界。
## When NOT to Use
机会或策略未建立，或进入详细交互规格阶段。
## Input
Strategy ID、Capability、用户、场景、触发、依赖、约束。
## Reasoning Process
写用户价值；定义触发和核心行为；列前置、状态、反馈、保存、异常、边界和成功信号；回溯 Strategy。
## Output
Feature 定义和依赖。
## Output Schema
`{"features":[{"feature_id":"","strategy_id":"","user_value":"","trigger":"","behavior":"","boundaries":[],"dependencies":[],"success_signals":[]}]}`
## Quality Criteria
可理解、可验证、有边界；每个 Feature 有 Strategy 上游。
## Common Mistakes
只有名称；遗漏失败状态；复制竞品交互。
## Example
“一键优化”需定义何时可用、分析什么、如何预览、如何撤回、是否跨信源保存。
