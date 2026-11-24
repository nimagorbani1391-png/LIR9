import { readFile, writeFile } from "node:fs/promises";

const gradlePath = "android/app/build.gradle";
const required = [
  "LIR9_KEYSTORE_PATH",
  "LIR9_KEYSTORE_PASSWORD",
  "LIR9_KEY_ALIAS",
  "LIR9_KEY_PASSWORD",
];

for (const name of required) {
  if (!process.env[name]) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
}

let gradle = await readFile(gradlePath, "utf8");
if (gradle.includes("signingConfigs.lir9Release")) {
  throw new Error("Release signing configuration is already present; refusing to duplicate it.");
}

gradle += `

// LIR9 release signing: credentials are supplied only by the CI environment.
android {
    signingConfigs {
        lir9Release {
            storeFile file(System.getenv("LIR9_KEYSTORE_PATH"))
            storePassword System.getenv("LIR9_KEYSTORE_PASSWORD")
            keyAlias System.getenv("LIR9_KEY_ALIAS")
            keyPassword System.getenv("LIR9_KEY_PASSWORD")
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.lir9Release
        }
    }
}
`;

await writeFile(gradlePath, gradle);
console.log("LIR9 release signing configuration applied.");
