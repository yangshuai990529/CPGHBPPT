import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadDesignSystem } from "../design/load-design-system.mjs";
import { layoutPatterns } from "../layouts/index.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const design = await loadDesignSystem(root);
const registered = [...design.contentLayouts.keys()];
const implemented = Object.keys(layoutPatterns);
const missing = registered.filter((id) => !implemented.includes(id));
const extra = implemented.filter((id) => !registered.includes(id));
if (registered.length < 20 || missing.length || extra.length) {
  console.error(JSON.stringify({ status: "fail", registered: registered.length, implemented: implemented.length, missing, extra }, null, 2));
  process.exitCode = 1;
} else console.log(JSON.stringify({ status: "pass", registered: registered.length, implemented: implemented.length }, null, 2));
