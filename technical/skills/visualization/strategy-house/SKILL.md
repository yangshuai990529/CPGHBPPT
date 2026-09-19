---
name: strategy-house
description: Specify a strategy house only when a goal is supported by distinct strategic pillars resting on shared foundations.
---
# Strategy House
Version: 1.0.0
## Purpose
表达 Goal、Strategic Pillars、Foundation 的支撑关系。
## When to Use
存在一个目标、多个互补支柱和共同基础能力。
## When NOT to Use
只有任务清单、支柱重复、没有基础层。
## Input
Goal、Pillars、Foundation、每个支柱的 Opportunity 上游。
## Reasoning Process
验证 Goal 可衡量；支柱互斥互补；基础对多个支柱有共同支撑；删装饰元素。
## Output
Strategy House 规格和追溯关系。
## Output Schema
`{"type":"strategy-house","goal":"","pillars":[],"foundation":[],"traceability":[]}`
## Quality Criteria
每个支柱有策略选择；Foundation 不是杂项。
## Common Mistakes
把功能当支柱；屋顶写口号；地基只写技术名。
## Example
目标“降低用户获得稳定观感的成本”，支柱可为自动理解、可解释推荐、可控应用，基础是感知和参数映射能力。
