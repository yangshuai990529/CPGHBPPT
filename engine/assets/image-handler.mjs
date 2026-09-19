import fs from "node:fs/promises";
import sharp from "sharp";

export async function inspectImage(filePath) {
  await fs.access(filePath);
  const meta = await sharp(filePath).metadata();
  return { path: filePath, width: meta.width, height: meta.height, format: meta.format, aspect: meta.width / meta.height };
}

export function fitImage(source, frame, mode = "contain") {
  const srcAspect = source.width / source.height;
  const dstAspect = frame.w / frame.h;
  if (mode === "stretch") throw new Error("Image stretching is forbidden; use contain or cover");
  if (mode === "contain") {
    const w = srcAspect > dstAspect ? frame.w : frame.h * srcAspect;
    const h = srcAspect > dstAspect ? frame.w / srcAspect : frame.h;
    return { x: frame.x + (frame.w - w) / 2, y: frame.y + (frame.h - h) / 2, w, h, crop: null };
  }
  const crop = srcAspect > dstAspect
    ? { left: (1 - dstAspect / srcAspect) / 2, top: 0, right: (1 - dstAspect / srcAspect) / 2, bottom: 0 }
    : { left: 0, top: (1 - srcAspect / dstAspect) / 2, right: 0, bottom: (1 - srcAspect / dstAspect) / 2 };
  return { ...frame, crop };
}
