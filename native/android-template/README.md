# Android native TextToSpeech bridge

The web app now calls the Capacitor plugin named `NativeTts` for lesson pronunciation when running inside the Android app. Browser previews continue to use the Web Speech API.

## Platform integration

The repository currently has Capacitor configured, but does not contain a generated `android/` platform project. Generate it from the repository root:

```bash
npm install
npm run build
npx cap add android
```

Then copy the Kotlin files in this directory into the generated Android project:

- `app/src/main/java/com/lir9/platform/NativeTtsPlugin.kt`
- `app/src/main/java/com/lir9/platform/MainActivity.kt`

The generated app package must remain `com.lir9.platform`, matching `capacitor.config.ts`.

After copying the files:

```bash
npx cap sync android
```

Open the Android project in Android Studio, build, and test on a physical Android device. The device must have an installed English (United States) Text-to-Speech voice in its Android Text-to-Speech settings.

This is a source integration, not a prebuilt APK. The APK still needs to be built and signed from the generated Android project.
