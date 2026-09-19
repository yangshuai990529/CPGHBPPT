# Architecture

## 设计目标

核心能力与 Codex、Claude Code、WorkBuddy 或其他宿主解耦。宿主负责模型调用与工具连接；项目用 Markdown SOP、JSON Schema、Registry 和文件接口表达稳定能力。

## 分层

```text
User Request
  -> Orchestrator
  -> Task Understanding
  -> Product Analysis Plan
  -> Thinking and Analysis Skills
  -> Insight Graph
  -> Storyline and Deck Plan
  -> Visualization Planning
  -> Slide Specs
  -> Renderer Entry Gate
  -> Renderer (later phase)
  -> QA and Critic
  -> Final PPTX (later phase)
```

### Thinking Layer

输入是任务、材料和约束，输出是理解、分析计划、洞察、故事线和 Slide Specs。它拥有产品判断权，不拥有 PPTX 绘制权。

### Rendering Layer

输入只能是通过 Gate 的 Slide Specs、Design System Registry 和已批准资产。它负责布局解析、对象创建、溢出处理、可编辑性和文件导出，不得重新解释产品策略。

### Knowledge Layer

保存从旧资料提炼的 Pattern，不保存“某页很好看”的主观标签。Pattern 有适用条件、禁用条件、证据与成熟度，可被替换或废弃。

### QA/Critic Layer

在渲染前检查内容和逻辑，在渲染后检查视觉和文件质量。第一阶段只实现前置规则和结构化报告。

## 核心对象

| 对象 | 作用 | Schema |
| --- | --- | --- |
| Project Request | 任务边界和材料清单 | `project.schema.json` |
| Source | 来源、范围和可支持 Claim | `source.schema.json` |
| Insight | 事实到机会/策略的可追溯推导 | `insight.schema.json` |
| Deck Plan | 整套故事线和逐页意图 | `deck-plan.schema.json` |
| Slide Spec | Thinking 到 Renderer 的唯一核心接口 | `slide-spec.schema.json` |
| Pattern | 可复用的历史逻辑/页面/视觉模式 | `pattern.schema.json` |

## 工程目录

- `docs/`：方法论、规则和扫描事实。
- `skills/`：四层产品 SOP。
- `schemas/`：跨 Agent 的结构化协议。
- `knowledge/`：Pattern 与方法知识。
- `design-system/`：Corporate Master 的结构化描述。
- `engine/`：后续实现边界；当前只含模块契约。
- `tests/`：端到端思考链样例与自检结果。
- `input/`、`output/`：后续运行时输入输出，不保存源库副本。

## 解耦原则

- 文件和 Schema 是系统边界，不依赖某一模型的私有消息格式。
- Skill 输出必须可序列化；自然语言说明不能替代结构化字段。
- `source_id`、`insight_id`、`slide_id` 使用稳定标识，跨阶段只引用 ID。
- Renderer 通过 `layout_id` 和 Design Token 工作，不通过“像第 3 页那样”工作。
- 任何推理结果都能回溯到输入、Source、前置 Insight 或显式假设。

## 后续接口

第二阶段可增加 `research-provider`、`asset-provider` 和 `renderer-adapter`，但它们必须实现独立适配器，不得改变现有对象语义。第三方宿主只需能读写 JSON、调用 Skills 并执行 Gate。
