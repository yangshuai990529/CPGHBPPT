# Target Architecture：部门汇报级 PPT 生成

原则：保留用户模板的母版、页面结构与企业资产；在内容安全区内优化信息层级和排版。来源事实、模型推断、产品建议分层存储。用户明确目标后，先选择本地/联网/混合，再询问是否需要图片；图片以自行截取的网页 PNG 或用户本地素材为主，不以下载矢量装饰图替代证据。

## 契约链

`Request → Brief → Research Plan → Evidence Store → Insights → Storyline/Deck Plan → Slide Plan → Visual Plan → Asset Processor → Layout Plan → Slide Spec → Renderer → Preview → Designer QA → Repair → Delivery`

每个箭头都有持久化 JSON 和 Schema；每阶段保留输入哈希、来源、版本、时间及失败原因。没有输入/证据时停在明确缺口，不生成空白或编造数字。阶段可重跑；改变某页视觉不应重做整份外部研究。

| 层 | 输入 → 输出 | 验收门槛 |
|---|---|---|
| Brief Agent + Classifier | 用户目标/材料 → `brief.json`、演示类型、受众、决策问题、必须回答的问题、数据/图片选择 | 不从主题词猜具体产品事实；缺关键目标时只追问最少问题 |
| Research Planner / Agent | Brief → 查询、候选来源、事实/数字/冲突/缺口 | Web 模式能主动搜并核验，不依赖用户预填 URL；来源 URL、抓取日、原文位置可回溯 |
| Evidence Store | 原文/表格 → Claim、Evidence、Source、Metric、Limitations | 每个数字保存单位、分母、时间、地域、样本；矛盾不自动选赢家 |
| Storyline + Slide Planner | Brief/证据/洞察 → 可删增页的 Deck Plan | 每页一个核心结论，回答明确问题；存在理由、上下游依赖和证据状态可审计 |
| Image Agent | Slide Plan + Evidence → 逐页 `visual-requirements`、候选截图、审核结果 | 用户选择要图时逐页判断需求；截图来自允许页面，PNG 自动裁剪/匹配；缺图标明，不能默默以文字页代替 |
| Chart/Table/Diagram Engine | 经过口径核验的数据/结构 → 可编辑 PPT 对象或受限预览 | 不做伪图表；图表轴/单位/来源完整；截图/装饰图不替代数据图 |
| Layout Engine | Slide Spec + 企业 Layout Registry → 框架/位置/密度/字体/裁切方案 | 保留母版结构；安全区、保留区、最小字体、图片比例与内容覆盖率满足规则 |
| Renderer Providers | 已批准 Slide Spec + Layout Plan → PPTX | Python 为现有稳定线；PptxGenJS 仅经模板包级与视觉 parity 试验后可切换 |
| Visual/Content/Data QA | PPTX + 预览 PNG/PDF + Evidence Store → 分层 QA 报告 | 检查包级模板、超界/遮挡/重叠、逐页图像覆盖、数字血缘、逻辑与引用；自动规则不冒充人工审美 |
| Auto Repair | QA issue → 最小 Slide Spec/Layout patch → 局部重渲染 | 有上限、有回滚、有前后 diff；不改变事实和产品决策；无法修复则显式停止 |

## 关键边界

- `Slide Spec` 是内容事实的唯一渲染输入；Renderer 不搜索网页、不重写结论。
- 外部事实必须有 Evidence ID → Source ID → URL/本地文件与位置；截图另存 source_page、capture_time、可使用范围。
- Visual Plan 在 Storyline/Slide Plan 之后运行，不用固定 `s05` 代替逐页规划。图片插入前做语义相关性、比例、分辨率和来源检查。
- Corporate Master 和 Content Layout 分离；模板原件只读。优先原生文本、图表、表格与形状；网页截图为 PNG。图示可先用 Mermaid 生成结构预览，再转原生形状，避免 PDF/SVG 作为唯一可编辑内容。
- 质量状态分 `PASS / NEEDS_REVIEW / BLOCKED / NOT_ASSESSED`；只有所有硬门槛通过才输出“成品”，否则输出带缺口的草稿/研究报告。
- 本地材料不上传到外部研究服务；混合模式区分内部现状与外部公开证据。公共截图版权范围未确认时仅用于内部审阅，并在 Manifest 标注。

## 迁移策略

现有 CLI/Schema/项目 Manifest 保持兼容。按 `migration-plan.md` 增加 v2 契约和 provider adapter，不做一次性重写；每阶段使用固定的本地/联网/混合用例、母版包级差异、预览视觉与端到端 QA 作为放行条件。阶段未验收前不能在 CLI 或文档中宣称该能力已完成。


## 2026-09-22 已实现的 Visual Planning 纵向切片

- `engine/visual-planner/index.mjs`：逐页输出 primary message、visual center、主/次素材、P1/P2/P3 信息层级、构图、删减/合并/可视化建议、裁切策略、阅读顺序和设计理由。
- `engine/assets/processor.mjs`：对可修复但显示面积不足的截图生成派生裁切素材；来源无效、分辨率不足或 viewport fallback 不会被自动放行。
- `engine/layout/layout-engine.mjs`：在 Visual Planner 之后生成坐标和空间利用目标，Visual Planner 本身不向 Renderer 输出坐标。
- `knowledge/patterns/evidence/`：Hero Evidence、Evidence + Insight、Evidence Grid、Multi-source Evidence 四种证据页 Pattern。
- Renderer 前硬门槛：Visual Center、Assertion Title、Screenshot Readability、Layout Plan 均必须为 ready。
- Designer QA v2：检查三秒规则、55%–80% 空间利用目标、视觉重心、截图实际显示面积和视觉权重层级。该规则 QA 仍不能替代人工审美检查。
