# Product PPT Agent 架构审计（2026-09-22）

范围：仓库根目录与 `technical/` 的可执行代码、配置、Schema、Skills、测试及模板契约。本报告区分“目录/Schema 已存在”和“端到端真正可用”。基线：`npm test` 为 47/47 通过，Golden contract 通过；这证明现有回归未坏，不证明生成稿达到部门汇报质量。

## Current Architecture

实际入口是 `./CPGHBPPT` → `technical/app/commands/cli.mjs` → `app/runtime/application.mjs`。后者同时承担输入、研究、素材、故事线、渲染、QA、打包与状态管理，已形成单点编排耦合。主要运行链：

`CLI → config/readInputs → knowledge → research(可选) → visual research(可选) → storyline/slide plan → Visual Planner → Asset Processor → Layout Planning → python-pptx → preview/Designer QA → output`

联网与本地仍有两条内容生成路径：`engine/reasoning/evidence-deck.mjs` 生成有界公开证据稿，`app/output/content-deck.mjs` 生成本地材料稿；两者已按证据量或明确页数动态选页，并统一进入 Visual/Asset/Layout 三阶段。`schemas/` 有 17 个结构定义，`skills/` 有 62 个 `SKILL.md`，但多数不是运行时自动执行的推理器。`design-system/layout-registry.json` 宣告了多种版式，实际 `python_pptx_renderer.py` 只分支实现其中少数；Registry 不等于已经能渲染。企业模板以只读方式导入，当前 Python provider 继承其母版；不得擅自改模板结构。

## Existing Capabilities / Missing Capabilities

| 领域 | 已验证或已有实现 | 当前缺口 |
|---|---|---|
| Brief/分类 | CLI 已询问本地/联网/混合、是否要图；YAML 配置和类型字段可用 | 没有面向目标、受众、决策问题的可验证 Brief Agent；类型不是内容规划决策 |
| 文件解析 | PDF 文本、MD/TXT/CSV；CSV 可生成简单柱状图 | 无 DOCX/XLSX/PPTX 输入链、扫描 PDF OCR、表格单位/口径校验 |
| Research | 已提供 URL 的抓取、字面 probe、来源/证据 ID、冲突提示与缓存 | 用户仅给主题时并不能稳定自主联网研究：无来源 URL 时多数主题会报错；没有多轮检索/缺口补证/数据口径审核 |
| 图像 | Playwright 网页 PNG 截图、本地 PDF 页截图、哈希去重、素材 Manifest、逐页 Visual Plan、截图显示面积检测和极端宽图裁切 | 仍缺 OCR 引导的证据区域定位、深层语义图像审核和缺图后的自动补采/替换 |
| 数据与图示 | 简单 CSV 柱状图；部分布局以文本框拼接结构图 | 无通用 Chart/Table/Diagram Engine、数据血缘、错误分母/时间窗口校验；Registry 中的表格与多数图示未落实到 Renderer |
| Storyline/Slide Plan | Deck Plan、动态页数、Slide Spec、Evidence 去重压缩和结论式标题 | Brief Agent 与跨页产品论证仍较浅，自动拆页和完整产品策略推导未完成 |
| Layout/模板 | 企业母版继承、安全区、Visual Center、四类证据页 Pattern、Layout Plan 与可编辑 Evidence + Insight 版式 | 当前坐标仍是规则模板；更多内容类型的自适应布局评分、字体实测和跨页节奏优化未完成 |
| QA/Repair | Shape/Source、三秒规则、截图面积、空间利用率、视觉重心、视觉权重和预览稀疏度检查 | 语义审美和图片含义仍未自动评估；`auto-repair` 主要提建议，未接入最多三次的可回滚重渲染闭环 |
| 知识/Skill | 知识检索、人工晋升、域包、CLI Skill 列表 | Skills 多为说明文档；缺真实任务路由、输入/输出验证及效果评价；旧 PPT 学习不应冒充当前事实 |
| 编排/CLI | 阶段缓存、断点、局部重建、review、doctor | 当前 pipeline 无统一能力门槛；错误消息已提示部分能力外置给 Agent，CLI 尚非无人值守成品系统 |

## Critical Problems

1. **产品推理仍浅**：页数已可按证据量动态生成，Research 原文也会去重压缩，但 Brief Agent、跨页论证和“目标 → 决策问题 → 洞察 → 建议”的深层动态推导仍不完整。结论不能因为引用了来源就自动变成洞察。
2. **图片语义仍有限**：Visual Planner 已能逐页决定视觉中心并阻断不可读截图，但尚不能通过 OCR/视觉语义稳定定位任意网页的最佳证据区域，也不能在缺图后自动重新搜索替代素材。
3. **数据缺**：除 CSV 的简单图表外，没有可审计的数据提取/指标口径/图表选型链。无可信数据时正确做法是标缺口，不能补模拟数据；但当前缺少继续检索权威数据的闭环。
4. **排版仍是规则驱动**：Visual/Asset/Layout 三阶段已建立，Evidence + Insight 等版式也已验证，但坐标优化仍依赖预设区域，尚未做到真实字体测量、自由组合搜索和语义级设计 Critic。QA 通过只说明已定义的硬规则通过。
5. **联网落差**：CLI 提供 `web/hybrid`，但 `application.mjs` 对大部分新主题要求外部 Agent 预先给已核验 URL/probe；“联网生成”按钮并不是完整 Research Agent。
6. **模板风险**：不能用新库重建一个视觉近似模板并声称结构未变。母版、页眉页脚、版式、Logo、可编辑性需包级和视觉双重比较。

## Recommended Architecture

采用 `docs/target-architecture.md` 的分层契约：Brief → Research/Evidence → Storyline/SlidePlan → Visual/Data Plans → SlideSpec → Layout → Renderer Provider → Preview/QA/Repair。先把领域判断和渲染分开，沿用现有 Python provider 保持企业模板，另开 PptxGenJS provider 做受控试验。任何新增能力必须同时给出产物 Schema、可观测性、失败状态和自动化测试。

## GitHub 开源评估与许可

这里仅评估是否可作为依赖/适配器，不复制上游代码；引入前锁版本并复核 transitive licenses。MIT 项目代码与企业模板版权是两回事；网页截图的公开可见性也不等于再使用授权。

| 项目 | 官方依据 | 结论 |
|---|---|---|
| [PptxGenJS](https://github.com/gitbrent/PptxGenJS) | [MIT](https://github.com/gitbrent/PptxGenJS/blob/master/LICENSE)；官方展示文本、形状、图片、表格、图表、Master 支持 | Phase 5 做 provider spike，不立即取代 Python。现有 PPTX 导入能力尚未验证；[历史 issue](https://github.com/gitbrent/PptxGenJS/issues/99) 曾明确不支持，必须以当前版实测模板包结构、母版、备注、图表与字体。 |
| [python-pptx](https://github.com/scanny/python-pptx) | [MIT](https://github.com/scanny/python-pptx/blob/master/LICENSE)，项目声明可创建、读取、更新 PPTX | 保留为当前企业模板基线；优先补版式与 QA，不自写 OOXML。 |
| [MarkItDown](https://github.com/microsoft/markitdown) | [MIT](https://github.com/microsoft/markitdown/blob/main/LICENSE)，官方支持 PDF/PPTX/DOCX/XLSX 等转 Markdown，并说明不保证视觉保真 | Phase 2/3 可作为可选文本抽取适配器；扫描件与复杂表格仍需校验，绝不当成排版解析。 |
| [Mermaid](https://github.com/mermaid-js/mermaid) | [MIT](https://github.com/mermaid-js/mermaid/blob/develop/LICENSE) | Phase 4 用于关系图预览/结构校验；正式 PPT 优先原生可编辑图形。矢量装饰素材不下载。 |
| [Marp](https://github.com/marp-team/marp) / [Slidev](https://github.com/slidevjs/slidev) | 均 MIT，面向 Markdown/Web slides | 可借鉴预览/内容表达，不作为要求保留现有 PPTX 母版的主渲染器。 |
| [Firecrawl](https://github.com/firecrawl/firecrawl) | [AGPL-3.0](https://github.com/firecrawl/firecrawl/blob/main/LICENSE) | 不把其服务端代码并入 MIT 仓库；若未来使用独立 API/服务，先审许可、隐私与成本。当前优先扩展现有浏览器适配器。 |

决策：成熟基础设施复用“文档抽取、浏览器截图、PPTX 对象生成、预览”；自行研发差异化的“故事线、证据链、逐页视觉规划、布局评分、产品判断及 QA 门槛”。

## 审计边界

本次未把现有演示稿人工评为“部门级成品”，也未引入/安装上述依赖或改动模板。Phase 1 只固化真实能力基线和目标接口；对应实施见 `migration-plan.md` 与 `upgrade-todo.md`。
