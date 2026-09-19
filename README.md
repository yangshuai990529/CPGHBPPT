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

## 常用命令

```text
./CPGHBPPT init
./CPGHBPPT doctor
./CPGHBPPT learn [目录]
./CPGHBPPT build <brief.md|presentation.yaml>
./CPGHBPPT research
./CPGHBPPT outline
./CPGHBPPT assets <project-id>
./CPGHBPPT review <pptx|project-id>
./CPGHBPPT rebuild <页码> --project <ID>
./CPGHBPPT update <ID> <页码> --spec <已审阅Slide Spec>
./CPGHBPPT source <ID> [页码]
./CPGHBPPT qa
./CPGHBPPT status
```

`rebuild` 会生成新版本而不覆盖基础 PPTX，并检查其他页面 XML 哈希不变。运行到 Checkpoint 时会暂停并给出下一步；重复 `build` 会复用未过期研究和未变化的阶段文件。

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
