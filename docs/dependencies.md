# 依赖与许可检查（2026-09-19，本地已安装版本）

此表解释项目直接导入/调用的依赖。锁文件中的 Node 可选/传递依赖与 Python Renderer 闭包见 `docs/dependency-inventory.json`，由 `node tools/dependency-inventory.mjs` 生成。版本/License 来自包元数据或原项目许可文件；公司母版、官方图片和历史材料另行授权。

| 依赖 | 本地版本 / License | 用途 | 生产必需？ | Fallback / 结论 |
|---|---|---|---|---|
| `python-pptx` | 1.0.2；MIT（[上游 LICENSE](https://github.com/scanny/python-pptx/blob/master/LICENSE)） | **默认 Renderer**：导入公司母版，写入原生文本、图片和图表 | 是 | 已通过 10 页样本、WPS 打开和原生对象检查；Microsoft PowerPoint 与跨平台仍待验收 |
| `Pillow` | 12.3.0；HPND | 图片格式、尺寸和 contain 放置 | 是 | Renderer 图片 Gate 依赖 |
| `ReportLab` | 4.4.9；BSD | 将已渲染 PNG 合成 Preview PDF | Preview 必需 | 关闭 Preview 时可不使用 |
| `@oai/artifact-tool` | proprietary/confidential | 不在公开版中 | 否 | 公开仓库不包含该依赖或对应 Renderer 实现 |
| `Sharp` | 0.35.4；Apache-2.0（本地包） | 图片元数据/像素哈希 | 视觉管线必需 | 失败时保留候选为未审阅，不入稿 |
| `Playwright` | 1.62.1；Apache-2.0（本地包） | 官网浏览/元素截图；可使用本机 Chrome | 截图可选 | 网站拒绝浏览器访问时报告缺口，不绕过 |
| `pdfjs-dist` | 6.3.289；Apache-2.0 | 可提取文本 PDF | PDF 解析必需 | 扫描件报 `needs_ocr`，无 OCR fallback；升级后 `npm audit` 为 0 漏洞 |
| LibreOffice | 系统二进制；具体再分发许可待核 | 非 macOS 的 PPTX→PDF 预览 fallback | 跨平台 Preview 可选 | macOS 默认使用 QuickLook；跨平台仍需单独验收 |
| Poppler `pdftoppm` | 系统二进制；具体再分发许可待核 | PDF→PNG 预览 | Preview 必需 | macOS `install.sh` 在 Homebrew 可用时自动安装 |
| macOS `curl` | 8.7.1；系统工具许可待核 | 对部分官方 CDN 资源做代理网络 fallback | 视觉资源按域名可选 | Node 安全 URL 校验、无重定向、大小上限；失败明确标记 |
| `PptxGenJS` | 4.0.1；MIT（本地包） | 当前核心未直接导入；候选重建 PPTX 能力 | 否 | 官方 API 以新建为主，现有母版导入/保真未验证 |
| Docling / PPTAgent / DeepPresenter / Qdrant | 未安装 | 仅规划评估，不在执行链 | 否 | 不得在 V1 报告中写成“已集成” |

安装入口为 `install.sh`，底层使用 `package-lock.json`、`requirements.txt` 与 `setup.sh`。模板、历史材料和第三方品牌图片的使用边界仍需由使用者确认，并在目标 Microsoft PowerPoint 环境复跑。此表不是法律意见，也不是第三方再分发批准。
