# Agent integration protocol

- Initialize: `./CPGHBPPT doctor`, optional `./CPGHBPPT init` (non-destructive). Read `technical/AGENTS.md` and the project config schema.
- Confirm generation options after the goal is clear: ask for `1 local / 2 web / 3 hybrid`, then ask `images yes / no`. Do not silently choose for the user. Non-interactive execution must pass `--source-mode local|web|hybrid --images yes|no`.
- Create config: `presentation.yaml` or intent inference via `./CPGHBPPT build --topic "..." --type competitor-analysis`. Project IDs and files are under `projects/<id>/`. For generic web topics, the Agent performs live research first and passes verified source URLs/probes into config; the renderer does not invent web evidence.
- Execute: `./CPGHBPPT build`, or `research`, `outline`, `render`. Optional `./CPGHBPPT approve <id> <checkpoint>` for configured checkpoints. Skip external research in `local` mode.
- Status: `./CPGHBPPT status <id>`; outputs: `projects/<id>/output/*.pptx`, `*-sources.md`, `*-preview.pdf`. Advanced artifacts and logs remain in `artifacts/` and `logs/`.
- Privacy: never send input PDF contents to public search or upload externally. Search needs separately configured public provider; the demo has three preseeded official pages. When images are enabled, capture verified webpage/local-PDF screenshots as PNG; do not download SVG/vector artwork. Do not treat a template/example as a real business fact. Stop if evidence or required input is missing.
- MCP: `node app/adapters/mcp-stdio.mjs` exposes local stdio JSON-RPC tools. It routes through the same Application Layer, not directly into renderer internals. This adapter has a tested initialize/tools/list handshake, not yet client interoperability certification.

## Department intelligence extension

`/CPGHBPPT review file.pptx` maps to `./CPGHBPPT review file.pptx` (read-only, text-limited). `/CPGHBPPT learn file.pptx` maps to `./CPGHBPPT learn file.pptx` and returns a **candidate**, not an approved fact or template. `./CPGHBPPT knowledge health/search/ingest` and `./CPGHBPPT feedback diff/confirm` are local operations; promotion requires an explicit user confirmation with scope and rationale. MCP exposes read/review/learn/context tools but intentionally does **not** auto-promote knowledge. Project manifests record selected Domain Packs and Skill versions; Candidate method material must never be cited as external evidence.
