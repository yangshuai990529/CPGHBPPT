export function proposeRepairs(report, slideSpecs) {
  const actions = report.issues.map((issue) => ({ slide: issue.slide, issue: issue.code, action: repairAction(issue.code), applied: false }));
  for (const item of actions) {
    const spec = slideSpecs[item.slide - 1];
    if (!spec) continue;
    if (item.action === "compress_text") { compress(spec); item.applied = true; }
    else if (item.action === "change_layout" && spec.layout?.fallback?.length) { spec.layout.preferred = spec.layout.fallback[0]; item.applied = true; }
  }
  return { policy: "repair-without-changing-product-logic", hard_minimum_font_pt: 14, actions };
}

function repairAction(code) {
  if (code === "TEXT_OVERFLOW") return "compress_text";
  if (code === "ELEMENT_OVERLAP") return "reflow";
  if (code === "IMAGE_DISTORTION") return "fit_contain_or_cover";
  if (code === "CONTENT_DENSITY") return "change_layout";
  if (code === "SAFE_AREA_VIOLATION") return "reflow";
  return "manual_review";
}
function compress(spec) { if (typeof spec.content?.body === "string" && spec.content.body.length > 600) spec.content.body = `${spec.content.body.slice(0, 590)}…`; }
