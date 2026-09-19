---
name: slide-planner
description: Split an approved storyline into purposeful slides and produce Slide Specs without rendering.
---
# Slide Planner
Version: 1.0.0
## Purpose
把 Storyline 拆成一页一个结论的 Slide Specs。
## When to Use
Deck Plan 已批准，需要定义逐页内容和依赖。
## When NOT to Use
故事线仍在变化，或用户只需要分析报告。
## Input
Deck Plan、Insight IDs、Source IDs、Design System Registry、页数约束。
## Reasoning Process
为每个必要问题分配页面；选择 slide_type；写标题、结论、证据、分析和 Implication；生成 visualization/layout 候选；检查依赖。
## Output
符合 `slide-spec.schema.json` 的 Slide Spec 列表。
## Output Schema
`{"slides":[],"coverage_map":{},"unresolved":[]}`
## Quality Criteria
每页只一个核心结论；所有关键 Storyline 节点有覆盖；证据缺口显式。
## Common Mistakes
先选版式再塞内容；把多个独立结论放一页。
## Example
竞品事实、共性判断和产品机会若无法在一页清楚表达，应拆成“比较证据”和“机会结论”两页。
