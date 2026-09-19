# PPT QA

## 严重级别

- `blocker`：不得进入 Renderer 或交付。
- `major`：会改变结论、可读性或品牌合规，必须返工。
- `minor`：不改变结论，但影响清晰度或一致性。
- `note`：记录可选优化。

## Content QA

- 一页是否只有一个核心结论，导航页是否明确承担导航角色。
- 标题是否准确反映页面角色；结论标题是否有证据支持。
- 是否存在信息堆砌、重复页或无法说明存在理由的页面。
- 页面是否有 So What，Evidence 与 Implication 是否可区分。
- 洞察是否引用 Evidence，假设是否被标注。
- Executive Summary 是否只汇总正文支持的结论。

## Visual QA

- 所有内容是否在 `content_safe_area` 内。
- 是否覆盖 Logo、保密标识、页码和装饰保留区。
- 字体是否符合模板且达到可读阈值；字体替代是否造成换行变化。
- 图片是否保持宽高比，关键证据是否被裁切。
- 是否存在溢出、重叠、过密、不合理留白或对齐漂移。
- 图表标签、图例、单位和颜色是否清楚，品牌色是否被误用为数据语义。

## Data QA

- 每个外部事实是否有 Source，Source 是否直接支持 Claim。
- 数据口径、单位、地区、样本、时间范围和基线是否清楚。
- 图表系列是否使用一致单位和时间粒度。
- 计算是否可复算；四舍五入是否改变结论。
- 截图、图片和引用是否保留来源与许可说明。

## Product Logic QA

- Background 是否支持 Why Now。
- Competitor 是否产生 Insight，而非停留在 Feature Checklist。
- Current State 与目标基准是否明确。
- Insight 是否导向 Opportunity。
- Opportunity 是否导向 Strategy。
- Strategy 是否导向 Capability / Feature。
- Roadmap 是否承接能力建设与验证顺序。
- Metrics 是否能检验 Strategy 和 Feature 的价值。

## 前置 Gate

Renderer 前执行 Schema 校验、ID 引用校验、证据状态校验和逻辑链校验。任何 FACT 无 Source、任何强结论依赖 `needed` 证据、任何 Feature 无 Strategy 上游，均为 blocker。

## 返工循环

Critic 输出 `finding_id`、`severity`、`slide_id`、`rule`、`evidence`、`required_change` 和 `owner_layer`。Thinking 问题回到 Thinking Layer；布局问题回到 Renderer；不得让 Renderer 用缩小字体掩盖内容过载。
