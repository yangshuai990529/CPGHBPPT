# Upgrade TODO（未完成项保持未勾选）

- [x] Phase 1：代码/配置/Schema/Skill/测试与模板边界审计；开源与许可评估。
- [x] Phase 1：目标架构、迁移计划、可执行能力基线。
- [ ] Phase 2：Brief Schema、目标/受众/决策问题抽取与最少追问。
- [x] Phase 2：本地与联网研究稿已移除运行时对固定页数测试夹具的依赖；按材料容量或明确页数生成，可拒绝填充空页。
- [ ] Phase 2：进一步完成面向决策的 Brief Agent 与产品故事线推理。
- [ ] Phase 3：新主题自主联网发现来源，建立 Evidence/Metric Store 与冲突处理。
- [ ] Phase 3：DOCX/XLSX/PPTX/扫描 PDF 的可选解析器与安全边界。
- [x] Phase 4：初版逐页视觉选择与截图质量门槛；文本 PDF 不强行截图，空白/回退画面不自动入稿。
- [x] Phase 4：Visual Planner v1、证据页四类 Pattern、截图可读性检测、极端宽图自动裁切与 Renderer 前门禁。
- [ ] Phase 4：深层语义图像审核、OCR 定位式裁切及逐页视觉缺口自动补采。
- [x] Phase 4：同口径 CSV 柱状图与原生可编辑表格。
- [ ] Phase 4：通用 Diagram Engine、更完整数据口径与引用 QA。
- [x] Phase 5：Layout Planning v1、空间利用率与视觉权重规则、Evidence + Insight 可编辑布局。
- [ ] Phase 5：更多布局的自适应评分、真实字体测量、自动拆页与 PptxGenJS parity spike。
- [x] Phase 6：Designer QA v2 初版（Visual Center、三秒规则、截图面积、空间利用、视觉权重）。
- [ ] Phase 6：语义视觉 Critic、内容/数据/模板综合 QA 和最多 3 次可回滚局部修复。
- [ ] Phase 7：人工确认的历史结构学习与偏好反馈。
- [ ] Phase 8：三种来源模式 Demo、非交互 CLI 与成品交付门槛。

每项合并条件：代码与 Schema/契约测试、失败路径测试、真 PPTX 预览及模板不变性检查、文档状态更新。不得仅靠目录存在或截图命令成功就勾选。
