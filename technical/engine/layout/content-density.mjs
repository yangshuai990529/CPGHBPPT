const WEIGHTS = {
  textChar: 1,
  card: 115,
  image: 180,
  dataPoint: 18,
  tableCell: 22,
  component: 28,
};

export function analyzeContentDensity(spec) {
  const text = collectText({ title: spec.title, key_message: spec.key_message, content: spec.content, visualization_data: spec.visualization?.data }); // Only visible slide copy, not evidence metadata or research quotations.
  const structured = spec.content?.structured_data ?? {};
  const cards = structured.cards?.length ?? structured.competitors?.length ?? 0;
  const images = spec.assets?.length ?? 0;
  const dataPoints = countDataPoints(structured);
  const tableCells = Array.isArray(structured.table) ? structured.table.reduce((n, row) => n + row.length, 0) : 0;
  const components = spec.components?.length ?? 0;
  const score = text.length * WEIGHTS.textChar + cards * WEIGHTS.card + images * WEIGHTS.image + dataPoints * WEIGHTS.dataPoint + tableCells * WEIGHTS.tableCell + components * WEIGHTS.component;
  const level = score < 600 ? "LOW" : score < 1100 ? "MEDIUM" : score < 1650 ? "HIGH" : "OVERFLOW";
  return { level, score, metrics: { textChars: text.length, cards, images, dataPoints, tableCells, components } };
}

function collectText(value) {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(collectText).join("");
  if (value && typeof value === "object") return Object.values(value).map(collectText).join("");
  return "";
}

function countDataPoints(value) {
  let count = 0;
  if (Array.isArray(value)) {
    if (value.every((item) => typeof item === "number")) return value.length;
    for (const item of value) count += countDataPoints(item);
  } else if (value && typeof value === "object") {
    for (const item of Object.values(value)) count += countDataPoints(item);
  }
  return count;
}

export function densityRepairRecommendation(result) {
  if (result.level !== "OVERFLOW") return null;
  if (result.metrics.textChars > 1100) return "compress_text";
  if (result.metrics.cards > 4 || result.metrics.tableCells > 48) return "change_layout";
  return "split_slide";
}
