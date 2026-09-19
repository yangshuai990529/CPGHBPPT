---
name: product-strategy
description: Choose product directions and capability priorities from validated opportunities, constraints, and tradeoffs. Use after opportunity analysis, not as a feature brainstorm.
---

# Product Strategy

Version: 1.0.0

## Purpose
把优先机会转成方向选择、能力组合和明确取舍。

## When to Use
已有 Opportunity、组织约束和目标，需要形成产品方向时。

## When NOT to Use
机会未经验证、仅需描述现有产品，或只是列功能时。

## Input
Opportunities、目标、约束、现有能力、差异化要求和风险。

## Reasoning Process
定义成功；比较候选方向；说明选择和不选择；把 Strategy 映射到 Capability；检查资源、顺序和风险。

## Output
策略主张、战略支柱、取舍、能力映射和验证假设。

## Output Schema
`{"strategy_statement":"","pillars":[],"choices":[],"non_choices":[],"capability_map":[],"validation_hypotheses":[]}`

## Quality Criteria
Strategy 有取舍；每个支柱承接 Opportunity；Capability 不等于 Feature 清单。

## Common Mistakes
使用空泛口号；每个机会都做；把 Roadmap 当 Strategy。

## Example
针对画质偏好差异，策略可选择“先降低个性化调节门槛，再沉淀可复用方案”，并明确首期不做开放社区。
