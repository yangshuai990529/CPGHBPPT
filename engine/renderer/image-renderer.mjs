import { inspectImage, fitImage } from "../assets/image-handler.mjs";
export async function prepareImage(filePath, frame, mode = "contain") { const source = await inspectImage(filePath); return { source, placement: fitImage(source, frame, mode) }; }
