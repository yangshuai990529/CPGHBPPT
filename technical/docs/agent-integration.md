# Agent integration protocol

- Initialize: `./CPGHBPPT doctor`, optional `./CPGHBPPT init` (non-destructive). Read `technical/AGENTS.md` and the project config schema.
- Create config: `presentation.yaml` or intent inference via `./CPGHBPPT build --topic "..." --type competitor-analysis`. Project IDs and files are under `projects/<id>/`.
- Execute: `./CPGHBPPT build`, or `research`, `outline`, `render`. Optional `./CPGHBPPT approve <id> <checkpoint>` for configured checkpoints. Skip external research when the user requested no research or provided-only materials.
- Status: `./CPGHBPPT status <id>`; outputs: `projects/<id>/output/*.pptx`, `*-sources.md`, `*-preview.pdf`. Advanced artifacts and logs remain in `artifacts/` and `logs/`.
- Privacy: never send input PDF contents to public search or upload externally. Search needs separately configured public provider; the demo has three preseeded official pages. Do not treat a template/example as a real business fact. Stop if evidence or required input is missing.
- MCP: `node app/adapters/mcp-stdio.mjs` exposes local stdio JSON-RPC tools. It routes through the same Application Layer, not directly into renderer internals. This adapter has a tested initialize/tools/list handshake, not yet client interoperability certification.

## Department intelligence extension

`/CPGHBPPT review file.pptx` maps to `./CPGHBPPT review file.pptx` (read-only, text-limited). `/CPGHBPPT learn file.pptx` maps to `./CPGHBPPT learn file.pptx` and returns a **candidate**, not an approved fact or template. `./CPGHBPPT knowledge health/search/ingest` and `./CPGHBPPT feedback diff/confirm` are local operations; promotion requires an explicit user confirmation with scope and rationale. MCP exposes read/review/learn/context tools but intentionally does **not** auto-promote knowledge. Project manifests record selected Domain Packs and Skill versions; Candidate method material must never be cited as external evidence.
