import { readFile, writeFile } from "node:fs/promises";

const manifestPath = "android/app/src/main/AndroidManifest.xml";
let manifest = await readFile(manifestPath, "utf8");

const permission = '<uses-permission android:name="android.permission.RECORD_AUDIO" />';
const queries = [
  "<queries>",
  '  <intent>',
  '    <action android:name="android.speech.RecognitionService" />',
  "  </intent>",
  "</queries>",
].join("\n");

if (!manifest.includes("android.permission.RECORD_AUDIO")) {
  manifest = manifest.replace(/<application\b/, `${permission}\n    <application`);
}
if (!manifest.includes("android.speech.RecognitionService")) {
  manifest = manifest.replace(/<application\b/, `${queries}\n    <application`);
}

if (!manifest.includes("android.permission.RECORD_AUDIO") || !manifest.includes("android.speech.RecognitionService")) {
  throw new Error("Could not safely patch Android microphone permission and speech service visibility.");
}

await writeFile(manifestPath, manifest, "utf8");
console.log("Android microphone permission and speech-service visibility configured.");
