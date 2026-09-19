---
name: image-placement
description: Plan evidence-preserving image placement, cropping, aspect ratio, and relationship to text within corporate safe areas.
---
# Image Placement
Version: 1.0.0
## Purpose
定义图片、截图和 SVG 的用途、裁切和版面关系。
## When to Use
Slide Spec 需要视觉证据或产品截图。
## When NOT to Use
不为了装饰强加图片；不修改 Logo 或证据截图内容。
## Input
资产尺寸、用途、关键区域、版式安全区、标题和说明。
## Reasoning Process
确定图片是证据还是装饰；选择目标比例；保护关键内容；检查与固定区域冲突；定义 caption/source。
## Output
资产放置规格。
## Output Schema
`{"asset_id":"","role":"evidence|context|decoration","placement":{},"crop":"","protected_content":[],"caption":""}`
## Quality Criteria
不拉伸；证据不被裁掉；同一主图默认不重复使用。
## Common Mistakes
截图太小不可读；装饰图抢结论；裁切 Logo。
## Example
竞品交互截图应保留关键控件并配结论标注，不能用整屏缩略图填充角落。
