---
name: bar-chart
description: Specify a bar chart for sourced comparisons among discrete categories with a common unit.
---
# Bar Chart
Version: 1.0.0
## Purpose
比较离散类别的大小或差异。
## When to Use
类别有限、数值同单位、排序有意义。
## When NOT to Use
连续时间趋势、不同量纲、类别过多。
## Input
类别、数值、单位、基线、Source、排序。
## Reasoning Process
核对零基线和单位；选择横/竖向；排序；只强调与结论相关系列。
## Output
图表数据和标注规格。
## Output Schema
`{"type":"bar-chart","orientation":"horizontal|vertical","categories":[],"series":[],"unit":"","source_ids":[]}`
## Quality Criteria
轴和单位完整；颜色数量克制；标签可读。
## Common Mistakes
截断坐标夸大差异；混合百分比与绝对值。
## Example
比较不同使用障碍占比时按比例排序，并保留样本量与时间。
