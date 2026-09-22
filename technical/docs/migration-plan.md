# Migration Plan

执行顺序服从用户要求的 Phase 1–8；每阶段都是可回滚的增量。旧 provider 与现有项目产物保持可读，切换新契约须有版本字段和迁移器。任何新依赖先核验 License、锁版本和离线测试。

| 阶段 | 最小可交付纵向切片 | 放行标准 |
|---|---|---|
| Phase 1 架构审计 | `architecture-audit.md`、`target-architecture.md`、本迁移计划、TODO、CLI 能力基线 | 状态来自代码证据；`capabilities` 可执行；旧测试全过；模板未改 |
| Phase 2 Storyline | Brief Agent、类型分类、动态页纲、Slide Planner；本地材料案例先跑通 | 非固定 5/10 页；每页有目的/问题/结论/证据缺口；三种来源选项不回退 |
| Phase 3 Research | 自主搜索适配器、来源选择、证据/数据 Store、缺口补证 | 新主题无预填 URL 也可研究；数字有单位/时间/分母；断网和冲突可解释 |
| Phase 4 Visual/Data | 按页 Visual Plan、PNG 截图与裁切、素材匹配；Chart/Table/Diagram 对象 | 选图的每个必要页有图或明确缺口；无跨品牌误配；图表引用可追踪 |
| Phase 5 PPT Engine | Layout 评分与可编辑 provider；PptxGenJS 隔离 spike | 实测母版/Logo/页脚/字体/备注/图表 parity 后才决定是否切换；当前 Python 继续可用 |
| Phase 6 Quality | 包级/视觉/内容/数据 QA，局部修复循环 | 明确硬门槛与 `NOT_ASSESSED`；最多 3 次局部修复；无静默删内容 |
| Phase 7 Knowledge | 历史 PPT 结构学习、样式偏好、证据缓存 | 旧结论不当当前事实；人工晋升、来源、有效期与撤销可追溯 |
| Phase 8 Workflow | CLI 与 Agent 工作流、完整 Demo | 本地/联网/混合各一套真实输入；PPTX+预览+来源+Deck Plan 一致；非交互模式可复现 |

优先级：先修“内容/证据/图片逐页规划”，再扩版式/渲染；只换库不会修好空内容。Phase 2/3 保留现有 python-pptx 输出，用 feature flag 选择 v2 规划器；Phase 4 之后依次补图和数据。PptxGenJS 仅在 `renderer=pptxgenjs-experimental` 下比较同一 Slide Spec，不写入既有模板原件。失败时回退原 provider，不删除历史项目文件。

质量基准：选定 3 个可共享、无敏感信息的固定 Brief（本地、公开联网、混合），每个产出 Deck Plan、逐页来源和截图覆盖报告、PPTX、预览图与机器 QA；人工检查只记录真实评分，不用规则 QA 冒充设计验收。
