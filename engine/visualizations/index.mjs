import { renderComponent } from "../components/index.mjs";

const RED = "#E90000";
const DARK = "#263540";
const PALETTE = ["#E90000", "#3C586B", "#7890A0", "#B9C6CF"];

export function renderVisualization(ctx, type, frame, data) {
  const fn = renderers[type];
  if (!fn) throw new Error(`Unknown visualization: ${type}`);
  ctx.model.visualization = type;
  return fn(ctx, frame, data ?? {});
}

const renderers = {
  "bar-chart": (ctx, frame, data) => renderComponent(ctx, "Chart", { frame, kind: "bar", categories: data.categories, series: data.series }),
  "line-chart": (ctx, frame, data) => renderComponent(ctx, "Chart", { frame, kind: "line", categories: data.categories, series: data.series }),
  "comparison-matrix": (ctx, frame, data) => renderComponent(ctx, "Table", { frame, values: data.values }),
  "funnel": (ctx, frame, data) => stacked(ctx, frame, data.items, true),
  "pyramid": (ctx, frame, data) => stacked(ctx, frame, [...(data.items ?? [])].reverse(), true),
  "strategy-house": strategyHouse,
  "matrix-2x2": matrix2x2,
  "architecture": architecture,
  "journey-map": journey,
  "roadmap": roadmap,
  "timeline": timeline,
};

function rect(ctx, frame, text, fill = "#FFFFFF", color = DARK, size = 14, bold = false) {
  const s = ctx.slide.shapes.add({ geometry: "roundRect", position: { left: frame.x, top: frame.y, width: frame.w, height: frame.h }, fill, line: { style: "solid", fill: "#D6DDE2", width: 1 } });
  s.text = text; s.text.style = { typeface: "Hiragino Sans GB", fontSize: size, color, bold, autoFit: "shrinkText", textAlign: "center", verticalAlignment: "middle" };
  ctx.model.elements.push({ type: "VizNode", frame, minFontPt: size, text, role: "visualization", allowOverlap: false });
  return s;
}

function line(ctx, x, y, w, h, color = "#AEB8BF", width = 2) { ctx.slide.shapes.add({ geometry: "line", position: { left: x, top: y, width: w, height: h }, fill: "none", line: { style: "solid", fill: color, width } }); }

function strategyHouse(ctx, f, d) {
  rect(ctx, { x: f.x + 80, y: f.y, w: f.w - 160, h: 70 }, d.goal, RED, "#FFFFFF", 18, true);
  const pillars = d.pillars ?? []; const gap = 12; const pw = (f.w - gap * (pillars.length - 1)) / pillars.length;
  pillars.forEach((p, i) => rect(ctx, { x: f.x + i * (pw + gap), y: f.y + 92, w: pw, h: 235 }, `${p.title}\n\n${p.body}`, i === 1 ? "#EEF2F4" : "#FFFFFF", DARK, 14, true));
  rect(ctx, { x: f.x, y: f.y + 348, w: f.w, h: 72 }, d.foundation, DARK, "#FFFFFF", 16, true);
}

function architecture(ctx, f, d) {
  const layers = d.layers ?? []; const h = (f.h - 12 * (layers.length - 1)) / layers.length;
  layers.forEach((layer, i) => {
    const y = f.y + i * (h + 12); rect(ctx, { x: f.x, y, w: 150, h }, layer.name, i === 0 ? RED : DARK, "#FFFFFF", 15, true);
    const items = layer.items ?? []; const gap = 10; const iw = (f.w - 170 - gap * (items.length - 1)) / Math.max(1, items.length);
    items.forEach((item, j) => rect(ctx, { x: f.x + 170 + j * (iw + gap), y, w: iw, h }, item, "#F5F6F7", DARK, 13, false));
  });
}

function matrix2x2(ctx, f, d) {
  line(ctx, f.x + 48, f.y + f.h - 42, f.w - 70, 0, DARK, 2); line(ctx, f.x + 48, f.y + 23, 0, f.h - 65, DARK, 2);
  line(ctx, f.x + f.w / 2, f.y + 15, 0, f.h - 70, "#D4DADF", 1); line(ctx, f.x + 48, f.y + f.h / 2, f.w - 70, 0, "#D4DADF", 1);
  renderComponent(ctx, "Text", { frame: { x: f.x + f.w - 140, y: f.y + f.h - 38, w: 130, h: 30 }, text: d.xAxis ?? "X →", size: 11, color: DARK });
  renderComponent(ctx, "Text", { frame: { x: f.x, y: f.y, w: 120, h: 32 }, text: d.yAxis ?? "Y ↑", size: 11, color: DARK });
  (d.items ?? []).forEach((it, i) => { const x = f.x + 70 + it.x * (f.w - 140); const y = f.y + 25 + (1 - it.y) * (f.h - 105); rect(ctx, { x: x - 55, y: y - 20, w: 110, h: 40 }, it.label, PALETTE[i % PALETTE.length], "#FFFFFF", 12, true); });
}

function journey(ctx, f, d) {
  const stages = d.stages ?? []; const gap = 10; const w = (f.w - gap * (stages.length - 1)) / stages.length;
  stages.forEach((s, i) => { const x = f.x + i * (w + gap); rect(ctx, { x, y: f.y, w, h: 54 }, `${i + 1}. ${s.name}`, i === 0 ? RED : DARK, "#FFFFFF", 14, true); rect(ctx, { x, y: f.y + 65, w, h: f.h - 65 }, `行为\n${s.action}\n\n痛点\n${s.pain}\n\n机会\n${s.opportunity}`, "#FFFFFF", DARK, 13, false); });
}

function roadmap(ctx, f, d) {
  const phases = d.phases ?? []; const gap = 14; const w = (f.w - gap * (phases.length - 1)) / phases.length;
  phases.forEach((p, i) => { const x = f.x + i * (w + gap); rect(ctx, { x, y: f.y, w, h: 55 }, p.phase, PALETTE[i % PALETTE.length], "#FFFFFF", 15, true); rect(ctx, { x, y: f.y + 68, w, h: f.h - 68 }, `目标\n${p.goal}\n\n交付\n• ${(p.deliverables ?? []).join("\n• ")}\n\n准出\n${p.exit}`, "#FFFFFF", DARK, 13, false); });
}

function timeline(ctx, f, d) {
  const items = d.items ?? []; line(ctx, f.x + 45, f.y + f.h / 2, f.w - 90, 0, DARK, 3);
  const step = (f.w - 90) / Math.max(1, items.length - 1);
  items.forEach((it, i) => { const x = f.x + 45 + i * step; rect(ctx, { x: x - 12, y: f.y + f.h / 2 - 12, w: 24, h: 24 }, "", RED); rect(ctx, { x: x - 75, y: i % 2 ? f.y + f.h / 2 + 32 : f.y + 10, w: 150, h: 92 }, `${it.time}\n${it.title}`, "#FFFFFF", DARK, 13, true); });
}

function stacked(ctx, f, items = [], tapered = false) {
  const h = f.h / Math.max(1, items.length);
  items.forEach((item, i) => { const inset = tapered ? i * 32 : 0; rect(ctx, { x: f.x + inset, y: f.y + i * h, w: f.w - inset * 2, h: h - 8 }, `${item.label}\n${item.value ?? ""}`, PALETTE[i % PALETTE.length], "#FFFFFF", 14, true); });
}
