import { Capacitor, registerPlugin } from "@capacitor/core";

type NativeTtsPlugin = {
  speak(options: { text: string; language?: string; rate?: number }): Promise<void>;
  stop(): Promise<void>;
};

const NativeTts = registerPlugin<NativeTtsPlugin>("NativeTts");

/**
 * Uses Android's native TextToSpeech engine inside the Capacitor APK.
 * Keeps the browser SpeechSynthesis implementation for web/PWA previews.
 */
export async function speakText(
  text: string,
  onError?: (message: string) => void
): Promise<void> {
  const cleanText = text.trim();
  if (!cleanText) return;

  if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === "android") {
    try {
      await NativeTts.speak({ text: cleanText, language: "en-US", rate: 1 });
    } catch {
      onError?.("پخش تلفظ انجام نشد؛ موتور تبدیل متن به گفتار اندروید را بررسی کن.");
    }
    return;
  }

  if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
    onError?.("این مرورگر از تبدیل متن به گفتار پشتیبانی نمی‌کند.");
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = "en-US";
  utterance.onerror = () => onError?.("پخش تلفظ انجام نشد؛ تنظیمات صدای مرورگر را بررسی کن.");
  window.speechSynthesis.speak(utterance);
}
