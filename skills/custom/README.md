# 自定义 Skill
在 `skills/custom/<id>/SKILL.md` 加入 YAML frontmatter (`name`, `description`) 与 `Version: x.y.z`。运行 `./ppt skills` 动态发现并刷新 `skills/registry.json`。Workflow 的 `presentation-types/registry.json` 中选择推荐 Skill ID。Skill 描述方法，不自动授予读取敏感文件或外发权限。自定义 Skill 不会自动执行任意代码。
