---
name: product-architecture
description: Define layered product architecture from vision and user value through scenarios, capabilities, applications, and platform foundations.
---

# Product Architecture

Version: 1.0.0

## Purpose
把产品价值、场景、能力、应用与平台基础组织为可追溯层级。
## When to Use
产品包含多个能力或跨端模块，需要解释组成和依赖。
## When NOT to Use
单一功能、用户流程或 Roadmap；层级不存在时不强画架构。
## Input
Vision、User Value、Scenarios、Capabilities、Applications、Foundations、interfaces。
## Reasoning Process
确定层级语义；将对象放入唯一层；建立上下支撑和横向接口；检查缺失与重复。
## Output
架构层、模块、依赖和边界。
## Output Schema
`{"vision":"","layers":[{"name":"","purpose":"","components":[]}],"dependencies":[],"boundaries":[]}`
## Quality Criteria
每层对象同类；上层可回溯到下层；不把技术名词混入用户价值层。
## Common Mistakes
功能堆叠；箭头没有语义；应用与能力重复。
## Example
AI Picture 可分用户价值、观影场景、感知/推荐/预览能力、设置应用和画质算法/数据基础。
