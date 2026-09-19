import fs from "node:fs/promises";
import path from "node:path";

export async function loadDesignSystem(projectRoot) {
  const dir = path.join(projectRoot, "design-system");
  const [tokens, masters, layouts] = await Promise.all([
    readJson(path.join(dir, "design-tokens.json")),
    readJson(path.join(dir, "master-registry.json")),
    readJson(path.join(dir, "layout-registry.json")),
  ]);
  return {
    tokens,
    masters,
    layouts,
    contentLayouts: new Map(layouts.content_layouts.map((item) => [item.layout_id, item])),
    corporateLayouts: new Map(layouts.layouts.map((item) => [item.layout_id, item])),
  };
}

export async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

export function tokenColor(design, name, fallback = "#333333") {
  const value = design.tokens.colors[name]?.value ?? name ?? fallback;
  return typeof value === "string" ? value : fallback;
}

export function typography(design, name) {
  const style = design.tokens.typography[name];
  if (!style) throw new Error(`Unknown typography token: ${name}`);
  return style;
}

export function ptToPx(value) {
  return Number(value) * (96 / 72);
}
