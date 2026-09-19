# Agent integration protocol

- Initialize: `./ppt doctor`, optional `./ppt init` (non-destructive). Read `AGENTS.md` and project config schema.
- Create config: `presentation.yaml` or intent inference via `./ppt build --topic "..." --type competitor-analysis`. Project IDs and files are under `projects/<id>/`.
- Execute: `./ppt build`, or `research`, `outline`, `render`. Optional `./ppt approve <id> <checkpoint>` for configured checkpoints. Skip external research when the user requested no research or provided-only materials.
- Status: `./ppt status <id>`; outputs: `projects/<id>/output/*.pptx`, `*-sources.md`, `*-preview.pdf`. Advanced artifacts and logs remain in `artifacts/` and `logs/`.
- Privacy: never send input PDF contents to public search or upload externally. Search needs separately configured public provider; the demo has three preseeded official pages. Do not treat a template/example as a real business fact. Stop if evidence or required input is missing.
- MCP: `node app/adapters/mcp-stdio.mjs` exposes local stdio JSON-RPC tools. It routes through the same Application Layer, not directly into renderer internals. This adapter has a tested initialize/tools/list handshake, not yet client interoperability certification.

## Department intelligence extension

`/ppt review file.pptx` maps to `./ppt review file.pptx` (read-only, text-limited). `/ppt learn file.pptx` maps to `./ppt learn file.pptx` and returns a **candidate**, not an approved fact or template. `./ppt knowledge health/search/ingest` and `./ppt feedback diff/confirm` are local operations; promotion requires an explicit user confirmation with scope and rationale. MCP exposes read/review/learn/context tools but intentionally does **not** auto-promote knowledge. Project manifests record selected Domain Packs and Skill versions; Candidate method material must never be cited as external evidence.
