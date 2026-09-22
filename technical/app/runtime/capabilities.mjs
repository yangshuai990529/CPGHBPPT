import fs from 'node:fs/promises';
import path from 'node:path';

// Phase 1 audit baseline. "partial" never means production-ready.
const BASELINE = [
  { id: 'generation_options', status: 'implemented_bounded', phase: 1, evidence: ['app/commands/generation-options.mjs'], limitation: 'CLI asks for source mode and images, but the choices do not guarantee a finished deck.' },
  { id: 'brief_agent', status: 'not_implemented', phase: 2, evidence: ['app/config/index.mjs'], limitation: 'Config inference is not a goal/audience/decision-quality Brief Agent.' },
  { id: 'dynamic_storyline', status: 'partial', phase: 2, evidence: ['engine/reasoning/evidence-deck.mjs', 'app/output/content-deck.mjs', 'engine/planner/page-count.mjs'], limitation: 'Page counts now follow available evidence or an explicit count, but deep product reasoning is still limited.' },
  { id: 'local_input_parsing', status: 'partial', phase: 3, evidence: ['app/runtime/input.mjs'], limitation: 'PDF text, MD, TXT and CSV only; no OCR or DOCX/XLSX/PPTX pipeline.' },
  { id: 'autonomous_web_research', status: 'not_implemented', phase: 3, evidence: ['app/runtime/application.mjs', 'engine/research/index.mjs'], limitation: 'Most new web topics require externally supplied verified URLs and probes.' },
  { id: 'source_evidence_trace', status: 'partial', phase: 3, evidence: ['engine/research/evidence/index.mjs', 'engine/research/source/index.mjs'], limitation: 'Source and evidence IDs exist, but numeric provenance and cross-source adjudication are incomplete.' },
  { id: 'web_screenshot_capture', status: 'implemented_bounded', phase: 4, evidence: ['engine/research/visual/screenshot-capture/index.mjs'], limitation: 'Playwright writes PNG, but capture alone does not establish relevance or rights.' },
  { id: 'per_slide_image_planning', status: 'partial', phase: 4, evidence: ['engine/research/visual/visual-planner/index.mjs', 'engine/reasoning/evidence-deck.mjs', 'engine/planner/visual-decision.mjs'], limitation: 'Legacy capability id retained for compatibility; image acquisition planning is bounded and now feeds the separate Visual Planner.' },
  { id: 'visual_planner_agent', status: 'implemented_bounded', phase: 4, evidence: ['engine/visual-planner/index.mjs', 'schemas/visual-plan.schema.json', 'knowledge/patterns/evidence/evidence-insight.json'], limitation: 'Rule-based visual decisions, evidence compression and hard gates work; deep semantic art direction still needs human review.' },
  { id: 'asset_processor', status: 'partial', phase: 4, evidence: ['engine/assets/processor.mjs', 'engine/research/visual/screenshot-capture/index.mjs'], limitation: 'Extreme-wide and display-area failures can be cropped; OCR-guided region selection and automatic replacement search are not implemented.' },
  { id: 'layout_planning', status: 'partial', phase: 5, evidence: ['engine/layout/layout-engine.mjs', 'design-system/layout-registry.json'], limitation: 'Evidence layouts and current renderer layouts have explicit regions; adaptive optimization across all future layouts remains incomplete.' },
  { id: 'chart_table_diagram_engine', status: 'partial', phase: 4, evidence: ['app/output/content-deck.mjs', 'engine/planner/visual-decision.mjs', 'engine/renderer/providers/python_pptx_renderer.py'], limitation: 'Comparable CSV charts and native editable tables work; diagram engine and rich data validation remain missing.' },
  { id: 'corporate_template_renderer', status: 'implemented_bounded', phase: 5, evidence: ['engine/renderer/providers/python_pptx_renderer.py', 'app/runtime/template.mjs'], limitation: 'Python provider uses existing master but implements only a subset of registry layouts.' },
  { id: 'pptxgenjs_provider', status: 'not_implemented', phase: 5, evidence: ['app/runtime/application.mjs'], limitation: 'PptxGenJS has not been installed or validated against the corporate template.' },
  { id: 'visual_content_qa', status: 'partial', phase: 6, evidence: ['engine/qa/rule-based-qa.mjs', 'engine/qa/rendered-visual-qa.mjs', 'engine/critic/index.mjs'], limitation: 'Three-second, focal-point, screenshot-area, space-utilization and visual-weight checks exist; semantic taste and image meaning remain not assessed.' },
  { id: 'closed_loop_auto_repair', status: 'not_implemented', phase: 6, evidence: ['engine/repair/auto-repair.mjs', 'app/runtime/application.mjs'], limitation: 'Repair suggestions are not an automatic re-render/QA loop.' },
  { id: 'reviewed_knowledge', status: 'partial', phase: 7, evidence: ['engine/knowledge/index.mjs', 'app/knowledge/incremental-learn.mjs'], limitation: 'Human-reviewed scoped knowledge exists; historical deck learning is not a finished style intelligence system.' },
  { id: 'end_to_end_cli', status: 'partial', phase: 8, evidence: ['app/commands/cli.mjs', 'app/runtime/application.mjs'], limitation: 'CLI supports several stages, but not a fully autonomous department-quality workflow.' },
];

export async function capabilityBaseline(root) {
  const capabilities = await Promise.all(BASELINE.map(async item => {
    const missing_evidence_paths = [];
    for (const relative of item.evidence) {
      if (!await fs.access(path.join(root, relative)).then(() => true, () => false)) missing_evidence_paths.push(relative);
    }
    return { ...item, missing_evidence_paths };
  }));
  return {
    baseline_date: '2026-09-22',
    scope: 'Phase 1 source-code audit, not a runtime quality certificate',
    statuses: ['implemented_bounded', 'partial', 'not_implemented'],
    capabilities,
  };
}
