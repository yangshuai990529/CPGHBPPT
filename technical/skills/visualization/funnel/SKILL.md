---
name: funnel
description: Specify a funnel only for successive stages sharing a valid cohort and denominator logic.
---
# Funnel
Version: 1.0.0
## Purpose
显示同一流程中的逐级转化和流失。
## When to Use
阶段顺序固定，用户群可追踪，分母关系明确。
## When NOT to Use
普通流程步骤、不同人群指标、可回流流程。
## Input
阶段、人数/比例、cohort、时间窗、分母、Source。
## Reasoning Process
验证 cohort；计算转化和流失；识别最大损失点；避免把相关性当原因。
## Output
漏斗规格和转化表。
## Output Schema
`{"type":"funnel","cohort":"","stages":[],"time_window":"","source_ids":[]}`
## Quality Criteria
阶段单调且口径一致；同时显示绝对量或明确分母。
## Common Mistakes
用漏斗画任意流程；混合不同时间窗。
## Example
入口曝光、进入设置、完成分析、应用方案可形成漏斗，前提是同一用户 cohort。
