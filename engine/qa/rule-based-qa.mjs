import { analyzeContentDensity } from "../layout/content-density.mjs";

const SAFE = { x: 120, y: 124, w: 900, h: 500 };
const LOCKED = [
  { id: "logo", x: 1030, y: 14, w: 242, h: 222 },
  { id: "page-number", x: 930, y: 660, w: 330, h: 50 },
];

export function runRuleBasedQa(models, slideSpecs, assetList=[]) {
  const issues = [];
  models.forEach((model, index) => {
    const spec = slideSpecs[index];
    if (model.kind === "cover" || model.kind === "ending") return;
    if (!model.elements.length) add(issues, index, "EMPTY_SLIDE", "error", "Slide has no rendered content");
    const used=new Set();for(const ref of spec.assets??[]){if(ref.status!=='approved')continue;const asset=assetList.find(a=>a.asset_id===ref.asset_id);if(!asset){add(issues,index,'IMAGE_SOURCE_MISSING','error',`Asset ${ref.asset_id} missing from manifest`);continue;}if(asset.entity!==ref.entity)add(issues,index,'IMAGE_WRONG_ENTITY','error',`${ref.asset_id}: ${asset.entity} on ${ref.entity} slot`);if(!asset.source?.page_url)add(issues,index,'IMAGE_SOURCE_MISSING','error',`${ref.asset_id} has no source page`);if(ref.fit==='stretch')add(issues,index,'IMAGE_STRETCHED','error',`${ref.asset_id} stretched`);if(used.has(ref.asset_id))add(issues,index,'IMAGE_DUPLICATED','warning',`${ref.asset_id} repeated on slide`);used.add(ref.asset_id);if(asset.quality?.resolution==='low')add(issues,index,'IMAGE_LOW_RESOLUTION','error',`${ref.asset_id} low resolution`);if(asset.semantic_review!=='human_verified_for_internal_use')add(issues,index,'IMAGE_IRRELEVANT','error',`${ref.asset_id} semantic review missing`);if(asset.quality?.watermark===true)add(issues,index,'IMAGE_WATERMARK','warning',`${ref.asset_id} has watermark`);}
    const renderedImages=model.elements.filter(e=>e.type==='Image').map(e=>e.asset_id);for(const id of used)if(!renderedImages.includes(id))add(issues,index,'IMAGE_NOT_RENDERED','error',`Asset ${id} not rendered`);
    const density = analyzeContentDensity(spec);
    if (density.level === "OVERFLOW") add(issues, index, "CONTENT_DENSITY", "error", `Density score ${density.score}`);
    if (!spec.sources?.length) add(issues, index, "MISSING_SOURCE", "warning", "No source label supplied");
    for (const el of model.elements) {
      if (el.minFontPt && el.minFontPt < 10 && el.role !== "source") add(issues, index, "FONT_TOO_SMALL", "error", `${el.type} uses ${el.minFontPt} pt`);
      if (!insideSlide(el.frame)) add(issues, index, "SHAPE_OVERFLOW", "error", `${el.type} exceeds slide bounds`);
      if (contentRole(el) && !inside(el.frame, SAFE)) add(issues, index, "SAFE_AREA_VIOLATION", "warning", `${el.type} exceeds content safe area`);
      for (const lock of LOCKED) if (contentRole(el) && overlaps(el.frame, lock)) add(issues, index, lock.id === "logo" ? "LOGO_COLLISION" : "PAGE_NUMBER_COLLISION", "error", `${el.type} collides with ${lock.id}`);
    }
    for (let a = 0; a < model.elements.length; a += 1) for (let b = a + 1; b < model.elements.length; b += 1) {
      const x = model.elements[a], y = model.elements[b];
      if (!x.allowOverlap && !y.allowOverlap && topLevel(x) && topLevel(y) && overlapArea(x.frame, y.frame) > 80) add(issues, index, "ELEMENT_OVERLAP", "warning", `${x.type} overlaps ${y.type}`);
    }
    const occupied = model.elements.filter(topLevel).reduce((sum, e) => sum + e.frame.w * e.frame.h, 0) / (SAFE.w * SAFE.h);
    if (occupied < 0.22) add(issues, index, "EXCESSIVE_BLANK_SPACE", "warning", `Only ${Math.round(occupied * 100)}% of safe area is occupied`);
  });
  return { generated_at: new Date().toISOString(), engine: "rule-based-qa-v1", checks: 12, summary: summarize(issues), issues };
}

function add(issues, index, code, severity, message) { if (!issues.some((i) => i.slide === index + 1 && i.code === code && i.message === message)) issues.push({ slide: index + 1, code, severity, message }); }
function summarize(issues) { return { total: issues.length, errors: issues.filter((i) => i.severity === "error").length, warnings: issues.filter((i) => i.severity === "warning").length, passed: issues.every((i) => i.severity !== "error") }; }
function inside(f, p) { return f.x >= p.x && f.y >= p.y && f.x + f.w <= p.x + p.w && f.y + f.h <= p.y + p.h; }
function insideSlide(f) { return inside(f, { x: 0, y: 0, w: 1280, h: 720 }); }
function overlaps(a, b) { return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; }
function overlapArea(a, b) { if (!overlaps(a, b)) return 0; return Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y)); }
function contentRole(e) { return !["Title", "Source", "Divider"].includes(e.type); }
function topLevel(e) { return ["Insight", "Card", "BigNumber", "Chart", "Table", "VizNode", "Text", "Image"].includes(e.type); }
