---
name: product-storyline
description: Build a decision-oriented product deck storyline and Deck Plan from a product topic, audience, purpose, materials, and constraints. Use before slide planning; do not use to render slides.
---

# Product Storyline

Version: 1.0.0

## Purpose

把产品任务转为有因果关系的 Storyline 与逐页 Deck Plan，说明每页为什么存在。

## When to Use

用于产品概要、洞察、竞品、规划、方案或管理层汇报，在生成 Slide Spec 之前调用。

## When NOT to Use

不要用于直接排版、渲染 PPTX、纯 SOP 操作说明，或在 purpose/audience 完全未知时强行定故事线。

## Input

```json
{"topic":"","purpose":"","audience":[],"available_materials":[],"constraints":{},"decision_needed":null}
```

## Reasoning Process

1. 明确受众要做的决定和唯一 Core Message。
2. 选择必要模块，不机械套完整目录。
3. 为每个模块写 question 和 answer，检查前后依赖。
4. 把 Fact、Interpretation、Insight、Opportunity、Strategy 和 Feature 分层。
5. 为每页写存在理由、证据缺口、分析方法和可视化候选。
6. 删除不能推动核心结论或决策的页面。
7. 标记 blocker；证据不足时不得生成强结论。

## Output

符合 `schemas/deck-plan.schema.json` 的 Deck Plan。

## Output Schema

```json
{"deck_title":"","objective":"","core_message":"","storyline":[],"slides":[{"slide_id":"s01","purpose":"","question":"","key_message":"","evidence_needed":[],"analysis_method":"","visualization_candidate":"","dependencies":[]}],"open_questions":[]}
```

## Quality Criteria

- 每页只承担一个核心结论或导航目的。
- 每页都能回答“为什么需要这一页”。
- Opportunity 是 Insight 与 Strategy 的桥梁。
- 标题强度不超过证据强度。
- Deck Plan 的 ID、顺序和依赖有效。

## Common Mistakes

- 把目录当 Storyline。
- 从竞品功能直接跳到 Feature。
- 为了凑页数保留重复内容。
- 在证据缺失时写确定性结论。

## Example

输入“AI Picture 产品概要，面向产品评审会，无外部材料”；输出应包含证据需求、产品定义、策略、架构、Roadmap 和 Metrics，并将 Renderer Gate 标记为 blocked，而不是编造市场数据。
