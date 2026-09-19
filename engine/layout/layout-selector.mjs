import { analyzeContentDensity } from "./content-density.mjs";

export function selectLayout(spec, registry) {
  const data = spec.content?.structured_data ?? {};
  const competitors = data.competitors?.length ?? 0;
  const dimensions = data.dimensions?.length ?? 0;
  const preferred = spec.layout?.preferred;
  const density = analyzeContentDensity(spec);

  if (spec.assets?.some(a=>a.status==='approved')&&competitors===3&&registry.has('L21_COMPETITOR_VISUAL_3COL')) return result('L21_COMPETITOR_VISUAL_3COL','Verified visual assets for 3 competitors',0.98,registry);
  if (preferred && registry.has(preferred) && supportsDensity(registry.get(preferred), density.level)) {
    return result(preferred, "Slide Spec preferred layout is compatible with content density", 0.98, registry);
  }
  if (spec.slide_type === "executive_summary") return result("L20_EXECUTIVE_SUMMARY", "Executive summary with headline, findings and decision request", 0.96, registry);
  if (spec.visualization?.type === "bar-chart" || spec.visualization?.type === "line-chart") return result("L11_CHART_INSIGHT", "Chart evidence plus a separate insight block", 0.95, registry);
  if (spec.visualization?.type === "journey-map") return result("L17_USER_JOURNEY", "Stage-based user actions, pain points and opportunities", 0.95, registry);
  if (spec.visualization?.type === "matrix-2x2") return result("L12_2X2_MATRIX", "Two independent axes with positioned items", 0.95, registry);
  if (spec.visualization?.type === "strategy-house") return result("L15_STRATEGY_HOUSE", "Goal, strategic pillars and shared foundation", 0.96, registry);
  if (spec.visualization?.type === "architecture") return result("L16_ARCHITECTURE", "Layered product structure and dependencies", 0.96, registry);
  if (spec.visualization?.type === "roadmap") return result("L19_ROADMAP", "Phased goals, capabilities and exit criteria", 0.96, registry);
  if (spec.visualization?.type === "timeline") return result("L18_TIMELINE", "Dated or ordered event sequence", 0.92, registry);
  if (spec.visualization?.type === "funnel") return result("L13_FUNNEL", "Successive cohort stages", 0.94, registry);
  if (spec.visualization?.type === "pyramid") return result("L14_PYRAMID", "True hierarchy or progression", 0.92, registry);
  if (competitors === 4 && dimensions <= 5) return result("L09_COMPETITOR_4COL", "Four competitors with limited comparison dimensions", 0.91, registry);
  if (competitors === 3 && dimensions <= 6) return result("L08_COMPETITOR_3COL", "Three competitors with limited comparison dimensions", 0.91, registry);
  if (competitors > 4 || dimensions > 6) return result("L10_COMPARISON_TABLE", "Comparison volume exceeds card layout capacity", 0.94, registry);
  if ((data.big_numbers?.length ?? 0) > 0) return result("L03_BIG_NUMBER", "One to three headline metrics", 0.9, registry);
  return result("L01_TITLE_TEXT", "General explanation with limited structured content", 0.72, registry);
}

function supportsDensity(layout, level) {
  return level === "OVERFLOW" ? false : layout.density.includes(level);
}

function result(layoutId, reason, confidence, registry) {
  const layout = registry.get(layoutId);
  return { layout_id: layoutId, reason, confidence, fallback: layout?.fallback_layouts ?? [] };
}
