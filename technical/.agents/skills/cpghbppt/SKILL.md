---
name: cpghbppt
description: Build a company-template product presentation from a brief or local materials using the CPGHBPPT project CLI. Use for product overviews, competitor presentations, or source-preserving reports; do not claim strategy conclusions without evidence.
---
# Product PPT Agent

Work in this repository. Read `technical/AGENTS.md` and `technical/docs/agent-integration.md` once. After the user gives a clear PPT goal, ask these two questions before building unless the answers are already explicit: (1) choose `1. 本地数据`, `2. 联网生成`, or `3. 本地+联网生成`; (2) whether images are needed. Convert the answers to `--source-mode local|web|hybrid` and `--images yes|no`. Do not silently choose for the user.

Convert the user's natural-language request (including `/CPGHBPPT ...` as a project convention, not a built-in slash command) to `./CPGHBPPT build ...`. Prefer a provided `presentation.yaml`; otherwise use `./CPGHBPPT build --topic "..." --type ... --source-mode ... --images ...`, adding `--input <local file>` for local or hybrid mode. For web or hybrid mode, the Agent must research current public sources, verify claims, and provide source URLs/probes instead of treating model memory as evidence. If images are requested, capture relevant public webpage sections as PNG screenshots and add those screenshots to the deck. Do not download or insert SVG/vector artwork. Preserve the supplied corporate template, masters, logo, cover, ending and reserved regions; optimize only the editable content area.

Run `./CPGHBPPT doctor` if runtime is uncertain. Read `manifest.json` and return PPTX, sources, preview and QA status, or one actionable blocking question. Never pretend unverified evidence is a conclusion. Keep user files local; only public research pages may be fetched. If the user chooses local-only, use `--source-mode local`; a real readable input is required. If output is a bounded research readout rather than the requested product strategy, say so plainly. Do not assume `/CPGHBPPT` is a registered native slash command on every Codex host.

For `/CPGHBPPT review <file.pptx>`, run `./CPGHBPPT review`; for `/CPGHBPPT learn <file.pptx>`, run `./CPGHBPPT learn` and return the candidate ID, **not** an approved knowledge claim. Only an explicit user confirmation with scope, reviewer and reason permits `./CPGHBPPT knowledge promote`. Feedback diffs stay UNCLASSIFIED until the user labels the reason; do not infer a team-wide preference from one change. Domain Packs are question frameworks, not current competitor facts.

For bare `/CPGHBPPT learn`, inspect the private local directory `workspace/旧PPT库/`; run incremental learning, return learned/skipped/failed counts and candidate IDs. Do not search sibling folders or claim a folder of PDF reports supplies validated PPTX structure. A bare `/CPGHBPPT` request with no trustworthy user/market evidence must stop at an evidence gap, not fabricate Opportunity or Strategy.
