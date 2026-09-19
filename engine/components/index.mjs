import fs from "node:fs";

const FONT = "Hiragino Sans GB";
const RED = "#E90000";
const INK = "#252525";
const MUTED = "#66717A";
const LINE = "#D9DEE3";
const PALE = "#F5F6F7";

function track(ctx, type, frame, options = {}) {
  ctx.model.elements.push({ type, frame: { ...frame }, minFontPt: options.fontSize ?? null, text: options.text ?? "", role: options.role ?? type, allowOverlap: Boolean(options.allowOverlap), source: options.source ?? null });
}

function box(slide, frame, { fill = "#FFFFFF", line = LINE, radius = true, name } = {}) {
  return slide.shapes.add({ geometry: radius ? "roundRect" : "rect", name, position: { left: frame.x, top: frame.y, width: frame.w, height: frame.h }, fill, line: line === "none" ? { fill: "none", width: 0 } : { style: "solid", fill: line, width: 1 } });
}

function textShape(slide, frame, text, { size = 17, color = INK, bold = false, fill = "none", line = "none", align = "left", name } = {}) {
  const shape = slide.shapes.add({ geometry: "textbox", name, position: { left: frame.x, top: frame.y, width: frame.w, height: frame.h }, fill, line: line === "none" ? { fill: "none", width: 0 } : { style: "solid", fill: line, width: 1 } });
  shape.text = String(text ?? "");
  shape.text.style = { typeface: FONT, fontSize: size, color, bold, autoFit: "shrinkText", textAlign: align, verticalAlignment: "middle" };
  return shape;
}

export const components = {
  Text(ctx, props) { const size = props.size ?? tokenSize(ctx, "body", 17); textShape(ctx.slide, props.frame, props.text, { size, color: props.color ?? tokenColor(ctx, "body", INK) }); track(ctx, "Text", props.frame, { text: props.text, fontSize: size }); },
  Title(ctx, props) { const size = props.size ?? tokenSize(ctx, "page_title", 24); textShape(ctx.slide, props.frame, props.text, { size, color: tokenColor(ctx, "page_title", INK), bold: true, name: "agent-page-title" }); track(ctx, "Title", props.frame, { text: props.text, fontSize: size }); },
  Subtitle(ctx, props) { const size = props.size ?? tokenSize(ctx, "body_small", 14); textShape(ctx.slide, props.frame, props.text, { size, color: MUTED }); track(ctx, "Subtitle", props.frame, { text: props.text, fontSize: size }); },
  Insight(ctx, props) { const size = props.size ?? tokenSize(ctx, "card_title", 16); box(ctx.slide, props.frame, { fill: "#FFF4F3", line: "#FFD2CF" }); textShape(ctx.slide, inset(props.frame, 14), props.text, { size, color: INK, bold: Boolean(props.bold) }); track(ctx, "Insight", props.frame, { text: props.text, fontSize: size }); },
  BigNumber(ctx, props) { const size = props.size ?? tokenSize(ctx, "data_number", 32); box(ctx.slide, props.frame, { fill: "#FFFFFF" }); textShape(ctx.slide, { x: props.frame.x + 16, y: props.frame.y + 18, w: props.frame.w - 32, h: 74 }, props.value, { size, color: tokenColor(ctx, "data_number", RED), bold: true }); textShape(ctx.slide, { x: props.frame.x + 16, y: props.frame.y + 92, w: props.frame.w - 32, h: props.frame.h - 106 }, props.label, { size: tokenSize(ctx, "body_small", 14), color: MUTED }); track(ctx, "BigNumber", props.frame, { text: `${props.value} ${props.label}`, fontSize: tokenSize(ctx, "body_small", 14) }); },
  Image(ctx, props) { if(!props.asset?.local_path)throw new Error('Image requires approved manifest asset, not a placeholder');const b=fs.readFileSync(props.asset.local_path);const type={png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp',gif:'image/gif',avif:'image/avif'}[props.asset.format];if(!type)throw new Error('Unsupported visual format');ctx.slide.images.add({blob:b,contentType:type,alt:props.asset.semantic_description||`${props.asset.entity} visual`,fit:props.fit??'contain',position:{left:props.frame.x,top:props.frame.y,width:props.frame.w,height:props.frame.h}});track(ctx,'Image',props.frame,{role:'image',source:props.asset.asset_id});const e=ctx.model.elements.at(-1);e.asset_id=props.asset.asset_id;e.fit=props.fit??'contain';e.entity=props.asset.entity;e.source_url=props.asset.source_url;e.width=props.asset.width;e.height=props.asset.height;},
  ProductImage(ctx, props) { components.Image(ctx, props); },
  VisualCompetitorCard(ctx, props) { box(ctx.slide,props.frame,{fill:'#FFFFFF',line:LINE});const title={x:props.frame.x+16,y:props.frame.y+13,w:props.frame.w-32,h:32};textShape(ctx.slide,title,props.title,{size:16,bold:true});track(ctx,'Text',title,{text:props.title,fontSize:16});const imageFrame={x:props.frame.x+16,y:props.frame.y+55,w:props.frame.w-32,h:155};if(props.asset)components.Image(ctx,{frame:imageFrame,asset:props.asset,fit:'contain'});else {textShape(ctx.slide,imageFrame,'官网视觉素材未找到',{size:13,color:MUTED});track(ctx,'Text',imageFrame,{text:'视觉缺口',fontSize:13});}const body={x:props.frame.x+16,y:props.frame.y+226,w:props.frame.w-32,h:props.frame.h-244};textShape(ctx.slide,body,props.body,{size:13,color:MUTED});track(ctx,'Text',body,{text:props.body,fontSize:13});},
  Icon(ctx, props) { const s = box(ctx.slide, props.frame, { fill: props.fill ?? RED, line: "none", radius: true }); s.text = props.text ?? "•"; s.text.style = { typeface: FONT, fontSize: props.size ?? 16, color: "#FFFFFF", bold: true, textAlign: "center", verticalAlignment: "middle" }; track(ctx, "Icon", props.frame, { allowOverlap: true }); },
  Card(ctx, props) { box(ctx.slide, props.frame, { fill: props.fill ?? "#FFFFFF", line: props.line ?? LINE }); textShape(ctx.slide, { x: props.frame.x + 16, y: props.frame.y + 14, w: props.frame.w - 32, h: 34 }, props.title, { size: 16, color: INK, bold: true }); textShape(ctx.slide, { x: props.frame.x + 16, y: props.frame.y + 54, w: props.frame.w - 32, h: props.frame.h - 70 }, props.body, { size: props.size ?? 14, color: MUTED }); track(ctx, "Card", props.frame, { text: `${props.title} ${props.body}`, fontSize: props.size ?? 14 }); },
  MetricCard(ctx, props) { components.BigNumber(ctx, props); },
  Quote(ctx, props) { box(ctx.slide, props.frame, { fill: "#F7F8F9", line: "none" }); textShape(ctx.slide, inset(props.frame, 18), `“${props.text}”\n${props.author ?? ""}`, { size: 16, color: INK }); track(ctx, "Quote", props.frame, { text: props.text, fontSize: 16 }); },
  Source(ctx, props) { const size = tokenSize(ctx, "caption", 10); textShape(ctx.slide, props.frame, `来源：${props.text}`, { size, color: "#777777" }); track(ctx, "Source", props.frame, { text: props.text, fontSize: size, source: props.text, role: "source" }); },
  Badge(ctx, props) { box(ctx.slide, props.frame, { fill: props.fill ?? RED, line: "none" }); textShape(ctx.slide, props.frame, props.text, { size: 11, color: "#FFFFFF", bold: true, align: "center" }); track(ctx, "Badge", props.frame, { text: props.text, fontSize: 11, allowOverlap: true }); },
  Divider(ctx, props) { ctx.slide.shapes.add({ geometry: "line", position: { left: props.frame.x, top: props.frame.y, width: props.frame.w, height: props.frame.h || 1 }, fill: "none", line: { style: "solid", fill: props.color ?? LINE, width: props.width ?? 1 } }); track(ctx, "Divider", props.frame, { allowOverlap: true }); },
  Arrow(ctx, props) { const s = ctx.slide.shapes.add({ geometry: "rightArrow", position: { left: props.frame.x, top: props.frame.y, width: props.frame.w, height: props.frame.h }, fill: props.fill ?? "#AAB5BD", line: { fill: "none", width: 0 } }); if (props.text) { s.text = props.text; s.text.style = { typeface: FONT, fontSize: 12, color: "#FFFFFF", bold: true, autoFit: "shrinkText" }; } track(ctx, "Arrow", props.frame, { text: props.text, fontSize: 12, allowOverlap: true }); },
  Table(ctx, props) { renderTable(ctx, props); },
  Chart(ctx, props) { renderChart(ctx, props); },
  ComparisonCard(ctx, props) { components.Card(ctx, props); },
  TimelineItem(ctx, props) { const d = { x: props.frame.x, y: props.frame.y + 8, w: 22, h: 22 }; box(ctx.slide, d, { fill: RED, line: "none" }); textShape(ctx.slide, { x: props.frame.x + 34, y: props.frame.y, w: props.frame.w - 34, h: props.frame.h }, `${props.title}\n${props.body ?? ""}`, { size: 14, color: INK, bold: false }); track(ctx, "TimelineItem", props.frame, { text: `${props.title} ${props.body ?? ""}`, fontSize: 14 }); },
};

export function createRenderContext(slide, slideNumber, design) { return { slide, slideNumber, design, model: { slideNumber, elements: [], visualization: null } }; }
export function renderComponent(ctx, type, props) { const fn = components[type]; if (!fn) throw new Error(`Unknown component: ${type}`); return fn(ctx, props); }

function renderTable(ctx, props) {
  const rows = props.values ?? [];
  const rh = props.frame.h / Math.max(1, rows.length);
  const cols = Math.max(1, ...rows.map((r) => r.length));
  const cw = props.frame.w / cols;
  rows.forEach((row, ri) => row.forEach((value, ci) => {
    const frame = { x: props.frame.x + ci * cw, y: props.frame.y + ri * rh, w: cw, h: rh };
    box(ctx.slide, frame, { fill: ri === 0 ? RED : ri % 2 ? "#FFFFFF" : PALE, line: LINE, radius: false });
    textShape(ctx.slide, inset(frame, 8), value, { size: props.size ?? 12, color: ri === 0 ? "#FFFFFF" : INK, bold: ri === 0, align: ci === 0 ? "left" : "center" });
  }));
  track(ctx, "Table", props.frame, { fontSize: props.size ?? 12 });
}

function renderChart(ctx, props) {
  const chart = ctx.slide.charts.add(props.kind === "line" ? "line" : "bar", { position: { left: props.frame.x, top: props.frame.y, width: props.frame.w, height: props.frame.h }, categories: props.categories, series: props.series.map((s, i) => ({ ...s, fill: s.fill ?? [RED, "#4F6B83", "#8EA6B8"][i % 3] })), barOptions: { direction: "column", grouping: "clustered" }, hasLegend: props.series.length > 1, dataLabels: { showValue: true, position: "outEnd" } });
  track(ctx, "Chart", props.frame, { role: "chart" });
  return chart;
}

function inset(frame, n) { return { x: frame.x + n, y: frame.y + n, w: Math.max(1, frame.w - n * 2), h: Math.max(1, frame.h - n * 2) }; }
function tokenSize(ctx, name, fallback) { return Number(ctx.design?.tokens?.typography?.[name]?.size_pt ?? fallback); }
function tokenColor(ctx, name, fallback) { const key = ctx.design?.tokens?.typography?.[name]?.color; return ctx.design?.tokens?.colors?.[key]?.value ?? key ?? fallback; }
