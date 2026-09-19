---
name: master-controller
description: Enforce corporate master, slide size, fixed elements, font rules, and layout registry constraints before rendering.
---
# Master Controller
Version: 1.0.0
## Purpose
把 Corporate Master 作为硬约束注入 Renderer Gate。
## When to Use
选择模板、版式或验证品牌合规时。
## When NOT to Use
不用于修改源 Master 或决定内容优先级。
## Input
Master Registry、Design Tokens、Layout Registry、Slide Specs。
## Reasoning Process
验证源指纹和比例；解析固定元素；检查字体可用性；核对 layout_id；输出约束和 blocker。
## Output
Master Constraint Pack。
## Output Schema
`{"master_id":"","slide_size":{},"hard_constraints":[],"font_warnings":[],"blockers":[]}`
## Quality Criteria
所有固定区域可识别；源文件只读；未验证项不会被当作官方规则。
## Common Mistakes
重绘 Logo；覆盖保密区；使用 Office Accent 当企业色。
## Example
检测到 `tcl-product-master-v1` 的 hash 变化时停止并要求重新扫描，而非继续套旧坐标。
