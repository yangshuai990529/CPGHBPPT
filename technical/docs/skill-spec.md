# Unified Skill Specification

Skill 是可复用的产品 SOP，不是一次性 Prompt。目录名使用小写 kebab-case；入口文件统一为 `SKILL.md`，含 `name` 和 `description` YAML frontmatter。

## 必备章节

每个 Skill 必须包含：

1. `Purpose`：解决的产品问题和边界。
2. `When to Use`：可观察的触发条件。
3. `When NOT to Use`：最容易误用的场景。
4. `Input`：必需/可选字段、允许的未知值。
5. `Reasoning Process`：可审计的判断步骤，不要求披露模型私有思维过程；输出中应记录依据和决策。
6. `Output`：人类可理解的结果。
7. `Output Schema`：稳定、可序列化的字段。
8. `Quality Criteria`：可检查的合格条件。
9. `Common Mistakes`：真实风险与纠正方式。
10. `Example`：一个最小、具体的输入输出例子。

## 通用输入信封

```json
{
  "project_id": "string",
  "task": {},
  "materials": [],
  "constraints": {},
  "upstream_ids": [],
  "unknowns": []
}
```

Skill 可以定义领域字段，但不得改变 `project_id`、稳定 ID 和证据状态的语义。

## 通用输出信封

```json
{
  "skill": "string",
  "status": "complete|partial|blocked",
  "result": {},
  "assumptions": [],
  "evidence_refs": [],
  "open_questions": [],
  "quality_checks": []
}
```

`partial` 表示仍可继续下游，但缺口必须显式传递；`blocked` 表示缺口会使下游结论失真。

## 证据与推理规范

- FACT 只能来自 Source 可直接支持的内容。
- INTERPRETATION 必须引用一个或多个 FACT。
- INSIGHT 必须说明组合了哪些事实/解释以及为什么重要。
- IMPLICATION 说明对本产品的意义。
- OPPORTUNITY 说明可解决的对象、场景和价值。
- STRATEGY 说明选择的方向与放弃/延后的方向。
- FEATURE 必须回溯到 Strategy，不得从竞品清单直接生成。

## 质量与失败方式

- 输入不足时输出 `open_questions` 和 `evidence_needed`，禁止补造数据。
- 方法不适用时返回 `status: blocked` 或推荐更合适的 Skill。
- 输出必须区分结论与过程证据；长篇解释不能替代字段。
- 示例只解释格式，不得被当作默认事实或默认页数。

## 版本管理

每个 Skill 在正文中维护 `Version`。字段语义发生不兼容变化时升级主版本；只改措辞或补质量规则时升级次版本。跨宿主调用以文件内容和 Schema 为准，不依赖某个 Agent 产品的专有指令。
