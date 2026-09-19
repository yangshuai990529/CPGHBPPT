---
name: journey-map
description: Specify a journey map for user stages, actions, touchpoints, emotions or friction, and opportunities.
---
# Journey Map
Version: 1.0.0
## Purpose
展示用户跨阶段的行为、触点、痛点和机会。
## When to Use
需要理解端到端用户体验和断点。
## When NOT to Use
技术调用链、组织流程或纯界面流程。
## Input
用户、目标、场景、阶段、行为、触点、证据、痛点、机会。
## Reasoning Process
确定起终点；按用户行为分阶段；放入证据；区分观察与推断；连接机会。
## Output
Journey Map 规格。
## Output Schema
`{"type":"journey-map","persona":"","goal":"","stages":[],"source_ids":[]}`
## Quality Criteria
以用户行为命名阶段；痛点有证据；机会不提前变 Feature。
## Common Mistakes
把系统页面顺序当 Journey；情绪曲线凭空绘制。
## Example
从发现 AI Picture、理解建议、预览效果到应用和撤回，分别记录障碍与机会。
