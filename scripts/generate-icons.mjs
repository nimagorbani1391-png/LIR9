import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const source = "public/icon.png";
const output = "public/icons";

await mkdir(output, { recursive: true });
await mkdir("assets", { recursive: true });

const metadata = await sharp(source).metadata();
if (metadata.format !== "png") {
  throw new Error(`Official icon must be a real PNG; detected: ${metadata.format ?? "unknown"}`);
}
if (!metadata.width || !metadata.height || metadata.width !== metadata.height) {
  throw new Error(`Official icon must be square; received ${metadata.width}x${metadata.height}`);
}

// Keep the supplied artwork intact; only resize copies for platform-required sizes.
await sharp(source).resize(1024, 1024, { fit: "contain", background: "#080807" })
  .png({ compressionLevel: 9 }).toFile("assets/icon.png");
await sharp(source).resize(192, 192, { fit: "contain", background: "#080807" })
  .png({ compressionLevel: 9 }).toFile(`${output}/icon-192.png`);
await sharp(source).resize(512, 512, { fit: "contain", background: "#080807" })
  .png({ compressionLevel: 9 }).toFile(`${output}/icon-512.png`);
await sharp(source).resize(410, 410, { fit: "contain", background: "#080807" })
  .extend({ top: 51, bottom: 51, left: 51, right: 51, background: "#080807" })
  .png({ compressionLevel: 9 }).toFile(`${output}/icon-maskable-512.png`);

console.log(`LIR9 icons generated from ${source} (${metadata.width}x${metadata.height}).`);
