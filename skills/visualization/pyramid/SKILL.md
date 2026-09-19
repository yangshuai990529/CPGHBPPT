---
name: pyramid
description: Specify a pyramid for genuine hierarchy, priority, or cumulative progression, not ordinary lists.
---
# Pyramid
Version: 1.0.0
## Purpose
表达稳定层级、优先级或由基础到上层的递进。
## When to Use
上下关系有明确语义，层级数量有限。
## When NOT to Use
普通并列项、时间流程、层级宽度不代表意义。
## Input
层级、上下关系、宽度语义、结论。
## Reasoning Process
定义顶部/底部含义；检查每层是否依赖下层；说明面积是否有量化含义。
## Output
金字塔规格。
## Output Schema
`{"type":"pyramid","direction":"bottom-up|top-down","layers":[],"area_has_quantity":false}`
## Quality Criteria
层级互斥；视觉面积不误导；标签简短。
## Common Mistakes
为了好看把三项塞进金字塔；混用优先级和层级。
## Example
从基础数据能力到场景能力再到用户价值可用金字塔，若是并列能力则不用。
