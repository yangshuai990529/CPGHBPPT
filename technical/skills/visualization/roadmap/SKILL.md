---
name: roadmap
description: Specify a roadmap visual for phased goals, capability evolution, dependencies, and exit criteria.
---
# Roadmap
Version: 1.0.0
## Purpose
表达分阶段目标、能力演进和依赖。
## When to Use
阶段有不同目标、交付和验证条件。
## When NOT to Use
只有日期事件、没有阶段逻辑，或时间尚不确定却要求精确甘特图。
## Input
阶段、目标、交付、依赖、进入/退出条件、时间确定性。
## Reasoning Process
选择 Now/Next/Future 或 Phase；先排依赖后放时间；标记确定与暂定；关联指标。
## Output
Roadmap 视觉规格。
## Output Schema
`{"type":"roadmap","time_mode":"relative|dated","phases":[],"dependencies":[],"milestones":[]}`
## Quality Criteria
每阶段有目标；不只是功能列表；不制造假精度。
## Common Mistakes
按团队分泳道却没有产品逻辑；所有功能都在 Phase 1。
## Example
先验证自动推荐与撤回，再扩展跨信源和方案分享，最后做生态与开放能力。
