---
name: storyline
description: Convert an approved product argument into a concise presentation narrative with section roles and transitions. Use after product reasoning, before slide planning.
---
# Presentation Storyline
Version: 1.0.0
## Purpose
把已批准的产品论证转为适合汇报的叙事顺序。
## When to Use
Insight、Opportunity 和 Strategy 已形成，需要确定章节和转场。
## When NOT to Use
不要替代 `thinking/product-storyline` 的产品推导，也不生成布局。
## Input
Argument Tree、受众、时长、决策点、必须覆盖内容。
## Reasoning Process
选择开场上下文；安排问题证明、机会桥梁、策略选择、执行与衡量；为章节写角色和过渡；删除重复。
## Output
Presentation Narrative 和章节顺序。
## Output Schema
`{"opening":"","sections":[{"role":"","message":"","transition":""}],"closing":""}`
## Quality Criteria
顺序服务决策；章节有因果关系；转场不依赖口头补充。
## Common Mistakes
照搬研究顺序；把目录当叙事；重复 Executive Summary。
## Example
先证明为什么现在需要 AI Picture，再解释用户障碍和机会，随后给出产品定义、能力和验证路径。
