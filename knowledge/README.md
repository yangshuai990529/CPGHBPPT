# Example Mining and Pattern Library

## 目标

把旧 PPT 转化为可复用 Pattern，而不是复制页面。旧材料只作为真实工作样本；Pattern 仍需通过产品逻辑、证据和可读性评审。

## Pipeline

`Old PPT -> Slide Extraction -> Slide Classification -> Purpose Recognition -> Content Structure Recognition -> Visual Structure Recognition -> Product Logic Recognition -> Pattern Extraction -> Review -> Registry`

### 1. Slide Extraction

记录文件、页码、标题、正文、图表/图片类型、可见来源和版面截图。PDF 只标记可观察信息，不推断原生对象。

### 2. Classification

区分封面、导航、背景、市场、用户、竞品、现状、差距、机会、策略、定义、方案、架构、路线图、指标和附录。

### 3. Recognition

分别识别页面 Purpose、内容关系、视觉关系和产品逻辑。四者不得合并成“这页很好”。

### 4. Pattern Extraction

只有跨页/跨文件可复用或解决明确问题的结构才进入 `patterns/`。Pattern 必须符合 `schemas/pattern.schema.json`。

### 5. Review

候选 Pattern 先标记 `candidate`。评审至少回答：逻辑是否成立、证据是否充分、何时不适用、是否只是特定视觉风格、是否比原页面更清楚。

## 目录

- `patterns/storyline/`：跨页因果结构。
- `patterns/slides/`：单页信息结构。
- `patterns/visualization/`：内容关系到视觉结构的映射。
- `examples/`：只保存脱敏后的结构化例子和引用，不复制源文件。
- `methodology/`：从多份材料稳定验证的方法规则。

原资料位于 `../../旧PPT库/`，只读。任何 Pattern 都应保留文件和页码证据，并注明局限。
