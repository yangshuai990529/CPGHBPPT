import { createRenderContext, renderComponent } from "../components/index.mjs";
import { resolveLayoutFrames } from "../layouts/index.mjs";
import { selectLayout } from "../layout/layout-selector.mjs";
import { renderVisualization } from "../visualizations/index.mjs";

const TITLE = { x: 128, y: 28, w: 760, h: 54 };
const SOURCE = { x: 120, y: 632, w: 760, h: 26 };

export function renderContentSlide(slide, spec, slideNumber, design, assets=new Map()) {
  const ctx = createRenderContext(slide, slideNumber, design);
  const selection = selectLayout(spec, design.contentLayouts);
  const frames = resolveLayoutFrames(selection.layout_id, layoutContext(spec));
  renderComponent(ctx, "Title", { frame: TITLE, text: spec.title });
  const data = spec.content?.structured_data ?? {};
  const insight = spec.content?.conclusion ?? data.insight ?? spec.key_message;

  switch (selection.layout_id) {
    case "L21_COMPETITOR_VISUAL_3COL":
      (data.competitors??[]).slice(0,3).forEach((item,i)=>{const ref=spec.assets?.find(a=>a.entity===item.name&&a.status==='approved');renderComponent(ctx,'VisualCompetitorCard',{frame:frames.cards[i],title:item.name,body:item.summary,asset:ref?assets.get(ref.asset_id):null});});
      renderComponent(ctx,'Insight',{frame:frames.insight,text:insight,size:14});
      break;
    case "L01_TITLE_TEXT":
      renderComponent(ctx, "Text", { frame: frames.body, text: spec.content?.structured_data?.body ?? spec.content?.analysis?.join("\n") ?? "", size: 19 });
      if (spec.content?.implication) renderComponent(ctx, "Insight", { frame: frames.insight, text: spec.content.implication, size: 15 });
      break;
    case "L20_EXECUTIVE_SUMMARY":
      renderComponent(ctx, "Insight", { frame: frames.headline, text: data.headline, bold: true, size: 18 });
      (data.findings ?? []).slice(0, 3).forEach((item, i) => renderComponent(ctx, "Card", { frame: frames.columns[i], title: item.title, body: item.body }));
      renderComponent(ctx, "Insight", { frame: frames.decision, text: data.decision, size: 15 });
      break;
    case "L11_CHART_INSIGHT":
      renderVisualization(ctx, spec.visualization.type, frames.chart, spec.visualization.data);
      renderComponent(ctx, "Insight", { frame: frames.insight, text: insight, size: 16 });
      renderComponent(ctx, "BigNumber", { frame: frames.metric, value: data.big_number?.value, label: data.big_number?.label });
      break;
    case "L09_COMPETITOR_4COL":
    case "L08_COMPETITOR_3COL":
      (data.competitors ?? []).slice(0, frames.cards.length).forEach((item, i) => renderComponent(ctx, "ComparisonCard", { frame: frames.cards[i], title: item.name, body: item.summary }));
      renderComponent(ctx, "Insight", { frame: frames.insight, text: insight, size: 14 });
      break;
    case "L12_2X2_MATRIX":
      renderVisualization(ctx, "matrix-2x2", frames.matrix, spec.visualization.data);
      renderComponent(ctx, "Insight", { frame: frames.insight, text: insight, size: 15 });
      break;
    case "L15_STRATEGY_HOUSE":
      renderVisualization(ctx, "strategy-house", frames.house, spec.visualization.data);
      renderComponent(ctx, "Insight", { frame: frames.explanation, text: insight, size: 14 });
      break;
    case "L16_ARCHITECTURE":
      renderVisualization(ctx, "architecture", frames.architecture, spec.visualization.data);
      break;
    case "L17_USER_JOURNEY":
      renderVisualization(ctx, "journey-map", frames.journey, spec.visualization.data);
      renderComponent(ctx, "Insight", { frame: frames.insight, text: insight, size: 14 });
      break;
    case "L19_ROADMAP":
      renderVisualization(ctx, "roadmap", frames.roadmap, spec.visualization.data);
      renderComponent(ctx, "Insight", { frame: frames.insight, text: insight, size: 14 });
      break;
    default:
      if (spec.visualization?.type) renderVisualization(ctx, spec.visualization.type, frames.timeline ?? frames.funnel ?? frames.pyramid ?? frames.body, spec.visualization.data);
      else renderComponent(ctx, "Text", { frame: frames.body, text: spec.content?.body ?? "" });
  }
  if (spec.sources?.length) renderComponent(ctx, "Source", { frame: SOURCE, text: (spec.render_options?.source_labels ?? spec.sources).join("; ") });
  slide.speakerNotes.textFrame.setText(`Product PPT Agent | ${selection.layout_id} | ${selection.reason}\n${(spec.notes ?? []).join("\n")}\n${(spec.render_options?.source_urls ?? []).join("\n")}\n${(spec.evidence ?? []).map(e => `${e.evidence_id}: ${e.claim} [${e.source_ids.join(", ")}]`).join("\n")}`);
  ctx.model.layout = selection;
  ctx.model.title = spec.title;
  return ctx.model;
}

function layoutContext(spec) { return { itemCount: spec.content?.structured_data?.big_numbers?.length ?? spec.content?.structured_data?.findings?.length ?? 3 }; }
