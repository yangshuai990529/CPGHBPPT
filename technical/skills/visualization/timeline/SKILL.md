---
name: timeline
description: Specify a timeline for dated events, milestones, or historical sequence where timing itself explains the story.
---
# Timeline
Version: 1.0.0
## Purpose
按时间解释关键事件、里程碑或变化。
## When to Use
准确时间和先后关系对结论重要。
## When NOT to Use
阶段策略、类别比较或没有可靠日期。
## Input
时间点/区间、事件、状态、Source、因果说明。
## Reasoning Process
统一时间粒度；筛选关键事件；区分事件与影响；标记不确定日期。
## Output
Timeline 规格。
## Output Schema
`{"type":"timeline","granularity":"","events":[],"source_ids":[]}`
## Quality Criteria
顺序正确；不以相邻位置暗示因果；日期可追溯。
## Common Mistakes
塞入所有历史；把 Roadmap 当 Timeline。
## Example
展示标准发布、厂商支持和产品适配节点时，用不同标记区分外部事件与内部里程碑。
