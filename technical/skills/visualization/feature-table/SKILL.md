---
name: feature-table
description: Specify a precise editable table for feature definitions, ownership, scope, or checklist-style evidence.
---
# Feature Table
Version: 1.0.0
## Purpose
让读者精确查询多行多列信息。
## When to Use
字段固定、逐项核对比整体趋势更重要。
## When NOT to Use
目标是表达趋势、定位或单一结论；表格会过宽时。
## Input
行、列、值、单位、Source、排序规则。
## Reasoning Process
删无决策价值列；统一字段；确定排序；标注缺失和例外。
## Output
可编辑表格规格。
## Output Schema
`{"type":"feature-table","columns":[],"rows":[],"sort":"","source_ids":[]}`
## Quality Criteria
同列同义；可读字号；关键信息无需横向猜测。
## Common Mistakes
把整份需求塞入一页；合并单元格破坏比较。
## Example
功能范围表可列 Capability、Feature、首期范围、依赖和 Owner。
