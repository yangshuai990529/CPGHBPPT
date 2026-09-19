# CPGHB Product PPT Agent（CPGHBPPT）

## 安装步骤

当前自动安装流程已在 macOS 验证。

```bash
git clone https://github.com/yangshuai990529/CPGHBPPT.git
cd CPGHBPPT
./install.sh
```

`install.sh` 会检查并安装所需的 Node.js、Python、Poppler、Node/Python 项目依赖，配置 PPT 模板并初始化个人工作区。系统依赖自动安装需要本机已有 [Homebrew](https://brew.sh/)。

安装完成后验证：

```bash
./CPGHBPPT doctor
```

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
