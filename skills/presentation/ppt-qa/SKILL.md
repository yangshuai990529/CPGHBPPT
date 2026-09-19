---
name: ppt-qa
description: Audit deck plans, Slide Specs, rendered slides, and evidence for content, visual, data, and product-logic defects.
---
# PPT QA
Version: 1.0.0
## Purpose
发现阻断交付的内容、数据、逻辑和视觉问题，并把返工分配到正确层。
## When to Use
Renderer 前检查 Spec，Renderer 后检查可编辑 PPTX 和渲染图。
## When NOT to Use
不替代产品研究，不通过自动规则宣称设计优秀。
## Input
Deck Plan、Slide Specs、Sources、Design Registry；后续可选 PPTX 与渲染图。
## Reasoning Process
执行 Content、Visual、Data、Product Logic 清单；记录证据和严重级别；判断 owner_layer；重新验证返工项。
## Output
QA Report 和 Gate 状态。
## Output Schema
`{"status":"pass|fail","findings":[{"finding_id":"","severity":"blocker|major|minor|note","slide_id":"","rule":"","evidence":"","required_change":"","owner_layer":"thinking|renderer|source"}]}`
## Quality Criteria
Finding 可复现；严重级别一致；未解决 blocker 不进入 Renderer。
## Common Mistakes
只查重叠不查逻辑；让 Renderer 修内容过载；把 schema pass 当质量 pass。
## Example
Feature 无 Strategy 上游是 blocker，归 Thinking Layer；Logo 被遮挡是 blocker，归 Renderer。
