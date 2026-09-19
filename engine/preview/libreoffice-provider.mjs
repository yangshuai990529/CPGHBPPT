import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { PreviewProvider } from "./provider.mjs";

export class LibreOfficePreviewProvider extends PreviewProvider {
  async render(pptxPath, outputDir) {
    await fs.mkdir(outputDir, { recursive: true });
    await run("soffice", ["--headless", "--convert-to", "pdf", "--outdir", outputDir, pptxPath]);
    const pdfPath = path.join(outputDir, `${path.basename(pptxPath, path.extname(pptxPath))}.pdf`);
    await run("pdftoppm", ["-png", "-r", "110", pdfPath, path.join(outputDir, "slide")]);
    return { provider: "libreoffice+poppler", pdfPath, images: (await fs.readdir(outputDir)).filter((n) => /^slide-\d+\.png$/.test(n)).sort().map((n) => path.join(outputDir, n)) };
  }
}

function run(command, args) { return new Promise((resolve, reject) => { const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] }); let err = ""; child.stderr.on("data", (d) => { err += d; }); child.on("error", reject); child.on("close", (code) => code === 0 ? resolve() : reject(new Error(`${command} failed (${code}): ${err}`))); }); }
