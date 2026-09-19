---
name: product-ppt
description: Build a company-template product presentation from a brief or local materials using the Product PPT Agent CLI. Use for product overviews, competitor presentations, or source-preserving reports; do not claim strategy conclusions without evidence.
---
# Product PPT Agent

Work in this repository. Read `AGENTS.md` and `docs/agent-integration.md` once. Convert the user's natural-language request (including `/ppt ...` as a project convention, not a built-in slash command) to `./ppt build ...`. Prefer a provided `presentation.yaml`; otherwise use `./ppt build --topic "..." --type ...`, adding `--input <local file>` for user materials. Run `./ppt doctor` if runtime is uncertain. Read `manifest.json` and return PPTX, sources, preview and QA status, or one actionable blocking question. Never pretend unverified evidence is a conclusion. Keep user files local; only public research pages may be fetched. If the user says no Research, use `--no-research`; a real readable input is required. If output is a bounded research readout rather than the requested product strategy, say so plainly. Do not assume `/ppt` is a registered native slash command on every Codex host.

For `/ppt review <file.pptx>`, run `./ppt review`; for `/ppt learn <file.pptx>`, run `./ppt learn` and return the candidate ID, **not** an approved knowledge claim. Only an explicit user confirmation with scope, reviewer and reason permits `./ppt knowledge promote`. Feedback diffs stay UNCLASSIFIED until the user labels the reason; do not infer a team-wide preference from one change. Domain Packs are question frameworks, not current competitor facts.
