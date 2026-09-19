# Research & Evidence Engine (Phase 3)

## Architecture

- `engine/research/planner`: brand × capability questions, required evidence, budgets.
- `engine/research/web`: replaceable `SearchProvider` (Brave Search API opt-in; URL seeds for deterministic reproducibility).
- `engine/research/browser`: replaceable HTTP text reader; optional Playwright screenshot implementation (requires separately installed Playwright/browser).
- `engine/research/source`: public HTTPS restriction, redirect checks, authority ranking, freshness windows.
- `engine/research/evidence`: literal substring extraction, Claim state, conservative numeric conflict detection.
- `engine/research/competitor`: `✓/?/!` matrix and denominator-based coverage.
- `engine/research/assets`: official HTTPS download, PNG/GIF/WebP/SVG inspection, content hashes, manual usage review.
- `engine/research/cache`: URL-keyed local cache with TTL; `engine/research/synthesis`: facts-only summary.
- `engine/research/citation`: short slide citation and full source index.
- `engine/context`: role-specific, minimal, deduplicated Reasoning Context.
- `engine/reasoning/evidence-deck.mjs`: separate, bounded reasoning and existing 10-page Renderer input.

## Run

```
node engine/bin/research.mjs --brief tests/ai-picture/research-brief.json --output output/AI-Picture-Research
node engine/bin/research-to-ppt.mjs
RUNTIME_PYTHON=<python3> node engine/bin/build-python.mjs --deck output/AI-Picture-Research/deck-plan.json --slides output/AI-Picture-Research/slide-specs.json --template templates/tcl-product/master.pptx --output output/AI-Picture-Research
```

Set `BRAVE_SEARCH_API_KEY` for optional live discovery when no seed URLs are supplied. A seed is a research target, not evidence: only fresh fetched text and matched passages become verified evidence. Seeds in the AI Picture example identify US official pages and testable exact phrases; they do not contain fabricated research results. Search results without extraction produce no supported claims. `published_at: null` means not verified, not today's date. Cache saves extracted text and URL, not full pages.

## Outputs and boundaries

`output/<project>/research/` contains plan, sources, claims, evidence, matrix, market-data placeholder, assets manifest, coverage, conflicts, issues, JSONL log, dataset and reasoning context; `output/<project>/` contains insight, deck plan, specs, citations and appendix. The market and asset modules are callable foundations, not an unattended large-scale crawler. Capability extraction uses explicit probes, not semantic AI reading; no automatic competitor dimensions beyond the configured ten. Numeric conflict detection requires identical entity/capability/scope and obvious units; qualitative contradictions still require review. No external search credentials are stored in the project.

The example deck is **a research readout**, not a TCL strategy proposal. It has one bounded cross-brand interpretation and explicitly requests user research and internal data before strategy. Existing phase-2 chart and 10-page finalizer contracts are reused. Do not claim a true end-to-end arbitrary topic agent without configuring discovery and evidence extraction.

## Verified AI Picture sample (2026-09-19)

- Three live US official pages fetched: Samsung 2025 8K Neo QLED highlights, Sony XR Processor overview, Hisense 65U8QG product page. Publication date was not confirmed from page metadata. Only literal page passages were accepted as evidence; the three-brand insight is explicitly bounded to these pages.
- 14/30 planned cells found (Samsung 6/10, Sony 4/10, Hisense 4/10); 16 gaps remain unknown, not unsupported product capabilities. No conflicting numeric claims were present in this sample.
- One Samsung-hosted image (1920×760) downloaded from a verified official-page reference, status `review_required` for reuse rights; intentionally not embedded in the deck.
- Playwright package imported, but the Chromium browser executable was not installed, so live screenshot capture was not performed. This is a known optional-provider limitation, not a successful screenshot test.
- The 10-page research readout passed package integrity, layout, rule-based QA and both preview generators; the optional visual critic remains disabled. Source citations appear by publisher/date on slides, URLs in notes and appendix.
