# CPGHB Product PPT Agent（CPGHBPPT）

CPGHBPPT 是一个本地运行的 **Evidence-Driven Product Intelligence & Presentation Agent**。它不是单纯的“AI 自动排版 PPT”工具，而是把用户材料、受控知识、公开研究、官方视觉素材和产品推理组织成公司模板中的可编辑 PPTX，并保留 Sources、Preview 与 QA 结果。

## 直接安装（macOS）

```bash
git clone https://github.com/yangshuai990529/CPGHBPPT.git
cd CPGHBPPT
./install.sh
```

`install.sh` 会检查 Node.js 22.13+、Python 3.11+ 和 Poppler；如果缺少且本机已有 Homebrew，会自动安装。随后它会安装锁定的 Node/Python 依赖、复制仓库内的 `PPT设计规范/产品PPT模板.pptx` 到运行时模板目录、创建个人工作区，并在没有系统 Chrome 时安装 Playwright Chromium。

> 当前自动安装与完整渲染流程只在 macOS 验证。Linux/Windows 请先手动安装对应依赖，再运行 `./setup.sh`、`./CPGHBPPT init` 和 `./CPGHBPPT doctor`。

## 第一次使用

```bash
# 检查运行环境
./CPGHBPPT doctor

# 可直接运行的公开资料示例
./CPGHBPPT build examples/02-competitor-analysis/project.yaml

# 或从自然语言主题开始
./CPGHBPPT build --topic "AI Picture 竞品研究概览，分析 Samsung、Sony、Hisense" --type competitor-analysis
```

把个人材料放入 `workspace/input/`，把经过授权的优秀历史 PPT/PDF 放入 `workspace/旧PPT库/`，然后运行：

```bash
./CPGHBPPT learn
```

这些个人目录、生成项目、缓存、日志与候选知识默认不会进入 Git。`learn` 只创建待审阅候选，不会未经人工确认写入长期知识。

## 在其他 Agent / 工具中使用

- **Codex**：仓库已提供 `.agents/skills/cpghbppt/SKILL.md`。可以输入 `/CPGHBPPT ...`，或让 Agent 调用 `./CPGHBPPT`。
- **Claude Code / WorkBuddy**：仓库提供 `adapters/` 中的适配说明；也可以直接让工具读取 `AGENTS.md` 后执行 CLI。
- **任意终端或自动化工具**：以 `./CPGHBPPT help` 查看命令。`/CPGHBPPT` 是对话约定，不保证每个宿主都原生注册 Slash Command。

## 常用命令：每条命令做什么

| 命令 | 作用 | 什么时候使用 |
| --- | --- | --- |
| `./CPGHBPPT init` | 创建个人工作区、示例配置和本地资料目录，不覆盖已有配置。 | Clone 后第一次使用。 |
| `./CPGHBPPT doctor` | 检查 Node、Python Renderer、模板、依赖、PDF 工具、Preview、浏览器、字体和网络状态。 | 安装后、构建失败时或更换电脑后。 |
| `./CPGHBPPT learn [目录]` | 扫描历史 PPT/PDF，按文件哈希增量提取**待审阅候选**；不会自动批准为长期知识。省略目录时读取 `workspace/旧PPT库/`。 | 希望系统参考已授权的优秀历史材料时。 |
| `./CPGHBPPT build <brief.md>` | 根据自然语言 Brief 执行理解、研究、推理、故事线、Slide Spec、渲染和 QA。 | 只有文字需求或 Brief 时。 |
| `./CPGHBPPT build <presentation.yaml>` | 按结构化配置完整构建 PPT，并保存项目状态、来源、预览和 QA。 | 需要明确控制受众、竞品、Research、模板、审批点和输出时。 |
| `./CPGHBPPT research <brief或配置>` | 只运行研究链路，生成 Source、Claim、Evidence、冲突和覆盖率，不生成最终 PPT。 | 先核验证据，再决定是否做 PPT。 |
| `./CPGHBPPT outline <brief或配置>` | 运行到故事线、Deck Plan 和 Slide Spec，暂不渲染 PPTX。 | 先评审内容结构和每页结论时。 |
| `./CPGHBPPT assets <project-id>` | 为已有研究项目执行 Visual Research，发现、筛选、去重并匹配图片素材，同时报告缺口。 | 研究完成但图片不足，或需要重新整理视觉素材时。 |
| `./CPGHBPPT review <pptx或project-id>` | 只读检查已有 PPT 的可提取文字、标题和结构规则，不修改原文件。 | 评审现有 PPT；注意它不能代替视觉与事实核验。 |
| `./CPGHBPPT rebuild <页码> --project <ID>` | 重新生成指定页面的新版本，并检查其他页面 XML 哈希保持不变。 | 只想重做一页而不影响其他页面时。 |
| `./CPGHBPPT update <ID> <页码> --spec <slide.json>` | 使用人工审阅过的 Slide Spec 定向更新一页。 | 页面内容已经确认，只需精确落稿时。 |
| `./CPGHBPPT improve <ID> <页码> --spec <slide.json>` | 基于审阅后的 Slide Spec 生成该页改进稿；同样执行页面隔离与 QA。 | 保留原稿，同时输出改进版本时。 |
| `./CPGHBPPT source <ID> [页码]` | 查看整个项目或指定页面的 Source ID、来源标签、URL 和 Sources Appendix。 | 核验某页结论从哪里来时。 |
| `./CPGHBPPT qa <ID>` | 输出指定项目的机器 QA 摘要，包括错误、警告和通过状态。 | 发布或评审前检查。 |
| `./CPGHBPPT status <ID>` | 查看项目状态、当前 Checkpoint、阶段记录和输出文件位置。 | 构建暂停、恢复或排查进度时。 |
| `./CPGHBPPT skills` | 列出当前识别到的全部 Skills、分类和版本。 | 检查技能是否被正确安装或加载。 |
| `./CPGHBPPT templates` | 列出模板包及其可用状态。 | 检查公司模板是否安装成功。 |

> `research` 负责找证据，`outline` 负责形成内容结构，`build` 才执行完整生成。Skill 是分析与表达方法，不是事实来源；没有证据时 Skill 不能自行补造结论。

## Skills：每个技能是干什么的

CPGHBPPT 会按任务自动选择最少且足够的 Skills。标准顺序是：**Thinking 定义问题 → Research 找证据 → Analysis 形成分析 → Presentation 规划页面 → Visualization 选择表达 → Renderer 生成 PPTX → QA 检查**。

### Thinking：产品推理与故事线（6 个）

| Skill | 作用 |
| --- | --- |
| `executive-summary` | 把已经有证据支持的结论压缩成决策摘要；最后使用，不新增证据或建议。 |
| `insight-extraction` | 将事实与解释转成可追溯的产品洞察、影响和下一步，不从空白材料制造洞察。 |
| `opportunity-analysis` | 根据已验证的行业、用户、竞品和现状洞察，识别并排序产品机会。 |
| `product-storyline` | 根据主题、受众、目的、材料和约束，构建决策导向的故事线与 Deck Plan。 |
| `product-strategy` | 在机会、约束和取舍明确后选择产品方向与能力优先级，不把功能脑暴冒充策略。 |
| `pyramid-principle` | 用结论统领互不重叠的支撑论点，修复层级混乱和表达不清。 |

### Analysis：产品分析（10 个）

| Skill | 作用 |
| --- | --- |
| `background-analysis` | 连接背景变化、当前问题和触发因素，说明“为什么现在要讨论”。 |
| `competitor-analysis` | 从定位、用户、场景、能力、交互、优劣势和产品启示比较竞品，不只做参数表。 |
| `feature-definition` | 把策略转成有用户价值、触发条件、行为、边界、依赖和成功信号的功能定义。 |
| `gap-analysis` | 在目标标杆和当前状态都明确时识别关键差距及其产品影响。 |
| `market-analysis` | 在明确地区、时间、口径和来源的前提下分析市场规模、细分、结构和变化。 |
| `product-architecture` | 从愿景和用户价值向下拆解场景、能力、应用与平台基础，形成分层产品架构。 |
| `product-positioning` | 定义目标用户、品类框架、核心问题、价值、差异化和证明。 |
| `roadmap-metrics` | 建立分阶段目标、依赖、学习里程碑及用户/产品/业务指标。 |
| `trend-analysis` | 区分事实、趋势信号、解释和产品影响，识别真正持续的变化。 |
| `user-insight` | 从用户研究和使用证据中提炼行为、痛点、需求、动机和机会。 |

### Research：外部研究（2 个）

| Skill | 作用 |
| --- | --- |
| `competitor-research` | 查找竞品产品事实与原始证据，输出 Source/Claim/Evidence；不直接替代竞品定位分析。 |
| `market-research` | 收集带年份、地区、口径和原始单位的市场数据；不直接替代市场策略判断。 |

### Presentation：PPT 内容与版式规划（8 个）

| Skill | 作用 |
| --- | --- |
| `citation` | 将页面结论和图片关联到来源、范围、定位信息及页面/备注引用。 |
| `content-density` | 判断页面信息密度，优先建议删减、拆页或重组，而不是先缩小字号。 |
| `image-placement` | 规划图片的 contain/crop、比例、证据关系和安全区位置。 |
| `layout-selector` | 根据页面目的、密度和品牌保留区，从已验证 Registry 选择版式。 |
| `master-controller` | 在渲染前执行母版、页面尺寸、固定元素、字体和版式约束。 |
| `ppt-qa` | 检查 Deck Plan、Slide Spec 和成稿的内容、视觉、数据及产品逻辑问题。 |
| `slide-planner` | 将已批准的故事线拆成有明确目的的页面，并生成 Slide Specs；本身不渲染。 |
| `storyline` | 将产品论证组织成简洁的章节、页面角色和过渡关系，用于推理完成后、页面规划前。 |

### Visualization：可视化表达（14 个）

| Skill | 作用 |
| --- | --- |
| `architecture` | 表达分层或模块化架构，以及层级之间的依赖与边界。 |
| `bar-chart` | 比较相同单位下的离散类别数值。 |
| `big-number` | 突出一个有来源、需要上下文解释的核心数字。 |
| `comparison-matrix` | 用统一维度比较多个产品、竞品或方案。 |
| `feature-table` | 表达功能定义、责任、范围、检查项或精确对照信息。 |
| `funnel` | 仅在各阶段属于同一连续人群和统一分母逻辑时表达漏斗。 |
| `journey-map` | 表达用户阶段、行为、触点、情绪/阻力和机会。 |
| `line-chart` | 表达连续时间序列、变化速度和转折点。 |
| `matrix-2x2` | 用两个独立且有证据支撑的维度定位对象。 |
| `pyramid` | 表达真实层级、优先级或累积递进关系，不用于普通列表。 |
| `radar` | 在少量对象和已归一化可比维度下展示轮廓差异，并提示精度限制。 |
| `roadmap` | 表达阶段目标、能力演进、依赖关系和退出条件。 |
| `strategy-house` | 表达由共同基础支撑多个策略支柱、再共同支持目标的结构。 |
| `timeline` | 表达日期、里程碑或历史顺序，时间本身必须对结论有意义。 |

<details>
<summary><strong>TV / AI Domain Skills：电视画质与 AI TV 专项技能（22 个，点击展开）</strong></summary>

这些技能用于选择分析维度和检查问题，**不是当前产品规格或竞品事实来源**。

| Skill | 作用 |
| --- | --- |
| `ai-agent-analysis` | 按感知、记忆、目标、行动和用户控制，区分语音助手、自动化与 Agent 式规划执行。 |
| `ai-assistant-analysis` | 分析 AI Assistant 能完成的任务、交互边界和用户可见限制。 |
| `ai-content` | 分析内容识别、理解、发现和推荐链路中的证据。 |
| `ai-interaction` | 评估语音、遥控器、视觉等多模态 TV 交互流程。 |
| `ai-memory` | 评估记忆、存储、召回声明及隐私边界。 |
| `ai-personalization` | 评估用户偏好与个性化能力，避免把简单规则误写成自适应学习。 |
| `ai-picture` | 将 AI TV 能力与真实画质处理链路和证据连接起来。 |
| `ai-picture-analysis` | 沿输入、识别、处理、自动调节和用户控制分析 AI Picture，避免把 AI 品牌词等同于已验证学习能力。 |
| `ai-recommendation` | 评估推荐相关性、解释性、反馈机制和用户控制。 |
| `ai-tv-market` | 用明确时间、地区和研究口径定义 AI TV 市场问题。 |
| `calibration-analysis` | 按信号、目标、测量基线、应用设置和验证结果分析电视校准流程。 |
| `color-analysis` | 区分色彩能力、客观准确性与用户主观偏好。 |
| `dolby-vision-analysis` | 按设备型号、地区、信号和内容范围核验 Dolby Vision 能力。 |
| `game-picture-analysis` | 按信源、HDMI 端口、信号格式和模式分析游戏画质能力。 |
| `hdr-analysis` | 在明确 HDR 格式、内容、设备和信号范围后进行 HDR 产品分析。 |
| `local-dimming-analysis` | 区分 Local Dimming 宣传声明、技术配置与实际测量/观察效果。 |
| `mini-led-analysis` | 根据决策问题选择 Mini LED 竞品分析维度，而不是套固定参数清单。 |
| `motion-analysis` | 分析运动处理、帧率、信号兼容性和模式状态。 |
| `picture-mode-analysis` | 检查图效模式的入口、状态、适用信号、切换行为和参数关系。 |
| `picture-quality-competitor-analysis` | 对指定型号和市场做有来源的电视画质竞品对比，并按决策问题选择维度。 |
| `picture-quality-overview` | 建立电视画质分析范围，区分信号、模式、处理模块和使用场景。 |
| `tv-picture-quality` | 组织电视画质产品 PPT 的证据和分析框架；不提供未经核验的当前规格。 |

</details>

## 设计模板与许可

- `PPT设计规范/` **会随仓库发布**，安装时自动复制运行时母版。
- 源代码使用 MIT License。
- PowerPoint 模板、品牌元素与第三方视觉素材不自动获得 MIT 授权；使用者需自行确认使用范围。详见 [NOTICE.md](NOTICE.md)。

## 能力边界

- 无可靠输入或外部证据时会停止，不会只凭主题编造产品机会或策略。
- 公开检索可使用 Search Provider；示例还提供可核验的官网候选 URL。用户材料不会自动上传给外部服务。
- PDF 支持可提取文本；扫描件需先 OCR。Imported PPT review 目前主要检查可提取文字和结构，不能代替视觉与事实核验。
- 公开版 Renderer 只使用 MIT `python-pptx` Provider，不包含专有 Artifact Tool 依赖与实现。
- 当前已在 macOS/WPS 验证可编辑对象；Microsoft PowerPoint 与跨操作系统表现仍需单独验收。

## 验证开发环境

```bash
npm test
npm run validate
./CPGHBPPT doctor
```

更多信息：[Agent 集成](docs/agent-integration.md) · [架构](docs/architecture.md) · [研究与证据](docs/research-engine.md) · [受控知识循环](docs/department-intelligence.md) · [依赖与许可](docs/dependencies.md)
