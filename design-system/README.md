# PPT Design System Registry

本目录描述 `../../PPT设计规范/产品PPT模板.pptx` 的可观察结构，不修改也不复制源文件。

## 文件职责

- `master-registry.json`：源文件指纹、比例、母版和品牌硬约束。
- `layout-registry.json`：可选版式、用途、保留区和验证状态。
- `design-tokens.json`：尺寸、颜色、字体、字号和安全区 Token。

## 使用原则

1. 先按 Slide Spec 的 `slide_type` 选择 Registry 中 `verified` 的版式。
2. 把所有新增内容限制在 `content_safe_area`，同时避开 `reserved_regions`。
3. Logo、合作伙伴标识、保密标识、页码、红色品牌块和结束页固定文案不可被重绘或覆盖。
4. 保持图片和 Logo 的原始比例；不得从 PDF 旧稿反推 Corporate Master。
5. `theme_defaults` 仅代表 OOXML Theme 默认值；只有 `brand_usage: approved` 的颜色才可被当作品牌 Token。
6. 未验证版式必须先用源模板复制页做视觉核对，不能直接用于正式输出。

## 当前限制

- 设计规范未提供独立品牌手册，因此颜色用途来自模板对象的实测，而非品牌部门的语义命名。
- 本机渲染缺少部分字体，LibreOffice 预览出现中文方框。Renderer 应在目标 PowerPoint 环境重新检查字体替代和换行。
- 安全区是根据模板固定元素和示例页推导的保守值，后续应由设计团队确认后升级为 `approved`。
