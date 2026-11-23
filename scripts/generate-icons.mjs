import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const source = "public/lir9-icon.svg";
const output = "public/icons";

await mkdir(output, { recursive: true });
await mkdir("assets", { recursive: true });

// Capacitor launcher icon source (1024px, generated from the uploaded official logo).
await sharp(source).resize(1024, 1024).png({ compressionLevel: 9 }).toFile("assets/icon.png");

await sharp(source).resize(192, 192).png({ compressionLevel: 9 }).toFile(`${output}/icon-192.png`);
await sharp(source).resize(512, 512).png({ compressionLevel: 9 }).toFile(`${output}/icon-512.png`);
await sharp(source)
  .resize(410, 410, { fit: "contain", background: "#080807" })
  .extend({ top: 51, bottom: 51, left: 51, right: 51, background: "#080807" })
  .png({ compressionLevel: 9 })
  .toFile(`${output}/icon-maskable-512.png`);

console.log("LIR9 Android/PWA icons generated.");
