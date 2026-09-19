# Product PPT Methodology

## 默认产品逻辑链

`WHY -> WHAT CHANGED -> USER -> COMPETITOR -> CURRENT STATE -> GAP -> OPPORTUNITY -> PRODUCT STRATEGY -> PRODUCT DEFINITION -> SOLUTION -> ROADMAP -> METRICS`

这是检查清单，不是强制目录。根据目的和证据裁剪模块，但不得跳过关键因果桥梁。特别禁止从竞品功能清单直接跳到本产品 Feature。

## 十二个标准模块

### 01 Executive Summary

回答“最终发现了什么、建议做什么、需要什么决策”。只汇总正文已支持的结论，不提前制造新论点。

### 02 Background / Why Now

优先使用 `Trend -> Change -> Problem -> Opportunity`。区分长期背景和触发本次决策的近期变化。

### 03 Market / Industry Insight

将 `Fact`、`Trend`、`Interpretation`、`Implication` 分开。市场规模或增长率必须写清口径、地区和时间。

### 04 User Insight

从 `Behavior -> Pain Point -> Need -> Motivation -> Opportunity` 推导。调研比例本身不是洞察；洞察必须解释行为原因和产品含义。

### 05 Competitor Analysis

分析 Positioning、Target User、Scenario、Capability、Interaction、Strength/Weakness 和 So What。Feature Checklist 只能是证据层，不能作为最终结论。

### 06 Current State / Gap

说明当前能力、目标状态和差距。对比基准可以来自用户需求、行业变化、竞品或内部目标，但必须明确是哪一种。

### 07 Opportunity

这是行业、用户、竞品和当前状态之间的桥梁。每个 Opportunity 要写对象、场景、未满足问题、可创造价值和证据强度。

### 08 Product Strategy

使用 `Insight -> Opportunity -> Strategy -> Capability -> Feature`。Strategy 是对资源和方向的选择，不是功能集合。

### 09 Product Definition

回答产品为谁、在什么场景、解决什么问题、核心价值是什么、边界是什么。

### 10 Product Architecture

优先表达 `Vision -> User Value -> Scenario -> Capability -> Application -> Platform/Technology Foundation`。没有分层关系时不要强行画架构图。

### 11 Roadmap

使用 Now/Next/Future 或 Phase 1/2/3，并写清每阶段目标、进入条件、核心交付物、依赖和学习指标。时间不是唯一排序依据。

### 12 Metrics

至少检查 User、Product、Business 三类指标，同时标明基线、目标、口径和观察周期。无法定目标时先定义测量方法。

## 一页 PPT 规则

原则上一页只表达一个核心结论。内容按 `Conclusion -> Evidence -> Analysis -> Implication` 组织。

标题优先反映页面真实角色：

- 结论页：使用得到证据支持的 Conclusion Title，例如“头部厂商正从单点 AI 能力转向场景化体验”。
- 章节、目录、定义、流程和设置页：可以使用直接的 Topic Title，例如“产品架构”。
- 证据不足时不要把推测包装成强结论标题。

每页都必须回答：为什么需要这一页、它回答什么问题、它推动了哪个下游判断。

## 事实与分析分离

| 层级 | 定义 | 必要引用 |
| --- | --- | --- |
| FACT | 来源直接陈述或可复算的数据 | Source |
| INTERPRETATION | 对一个或多个事实的解释 | FACT IDs |
| INSIGHT | 多个事实与解释形成的稳定认识 | FACT/INTERPRETATION IDs |
| IMPLICATION | 洞察对本产品的影响 | INSIGHT IDs |
| OPPORTUNITY | 可解决的用户/市场机会 | IMPLICATION IDs |
| STRATEGY | 对方向和资源的选择 | OPPORTUNITY IDs |
| FEATURE | 承接策略的具体能力 | STRATEGY IDs |

假设使用 `HYPOTHESIS`，未来事实需求使用 `EVIDENCE_NEEDED`。模型输出不得自动升级为 FACT。

## Storyline 构造

1. 先写目标受众在汇报后应做出的决定。
2. 写唯一 Core Message。
3. 将 Core Message 拆成 3 到 5 个必须被证明的子命题。
4. 为每个子命题列证据、分析方法和缺口。
5. 安排顺序：建立背景，证明问题，解释原因，形成机会，提出选择，落到执行与衡量。
6. 删除不改变结论或决策的页面。
7. 为每页生成 purpose、question、key_message、evidence_needed、analysis_method、visualization_candidate 和 dependencies。

## 常见断链

- 背景很多，但没有 Why Now。
- 用户数据很多，但没有 Need 和 Motivation。
- 竞品截图很多，但没有共同方向、未解决问题和 So What。
- 直接从 Insight 跳到 Feature，缺少 Opportunity 和 Strategy。
- Roadmap 只是日期表，没有阶段目标和验证逻辑。
- Metrics 只有指标名，没有口径、基线和时间窗。
