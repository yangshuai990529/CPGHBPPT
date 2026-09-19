---
name: layout-selector
description: Select a verified corporate layout from the registry based on slide purpose, density, and reserved regions.
---
# Layout Selector
Version: 1.0.0
## Purpose
为 Slide Spec 选择真实存在且不冲突的 Corporate Layout。
## When to Use
Slide 内容和视觉结构已确定，准备进入 Renderer Gate。
## When NOT to Use
不要用来决定产品内容；不要使用不存在或未验证版式作为正式输出。
## Input
Slide Spec、`layout-registry.json`、`design-tokens.json`、资产尺寸。
## Reasoning Process
按 slide_type 过滤；排除 unverified；检查密度和保留区；验证安全区；记录备选和风险。
## Output
layout_id、safe_area_token、reserved_regions 和适配说明。
## Output Schema
`{"layout_id":"","safe_area_token":"","reserved_regions":[],"fit":"pass|risk|fail","notes":[]}`
## Quality Criteria
layout_id 存在；内容不进入保留区；高密度页不靠缩字解决。
## Common Mistakes
凭页码引用模板；把 Theme 色当品牌色；忽略鸟形装饰区。
## Example
普通内容页优先 `tcl-content-bird-01`；若右上需要关键图表且与装饰冲突，应改结构或先验证 clean 版式。
