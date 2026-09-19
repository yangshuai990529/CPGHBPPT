---
name: architecture
description: Specify an editable layered or modular architecture visual with explicit dependencies and boundaries.
---
# Architecture
Version: 1.0.0
## Purpose
表达产品分层、模块和依赖。
## When to Use
存在稳定层级或模块接口，图比文字更清楚。
## When NOT to Use
功能清单、用户步骤、阶段计划。
## Input
层级、模块、接口、依赖、边界、结论。
## Reasoning Process
选择 layered 或 modular；统一层内对象；只保留有语义连接；标注边界与外部依赖。
## Output
可编辑架构图规格。
## Output Schema
`{"type":"architecture","mode":"layered|modular","layers":[],"connections":[],"boundaries":[]}`
## Quality Criteria
连线少且明确；上层价值可回溯；不使用装饰箭头。
## Common Mistakes
所有对象都互连；混入时间和责任人。
## Example
AI Picture 用 layered 架构表达用户价值、场景、能力、应用与算法基础。
