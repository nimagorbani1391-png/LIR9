import { Capacitor, registerPlugin } from "@capacitor/core";

type NativeTtsPlugin = {
  speak(options: { text: string; language?: string; rate?: number }): Promise<void>;
  stop(): Promise<void>;
};
type NativeSpeechPlugin = {
  listen(options: { language?: string }): Promise<{ transcripts?: string[] }>;
  stop(): Promise<void>;
};

type SpeechAlternative = { transcript: string };
type SpeechResult = ArrayLike<SpeechAlternative>;
type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<SpeechResult>;
};
type SpeechRecognitionErrorLike = { error: string };
type WebSpeechRecognition = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorLike) => void) | null;
  onend: (() => void) | null;
  start(): void;
  abort(): void;
};
type WebSpeechRecognitionConstructor = new () => WebSpeechRecognition;

const NativeTts = registerPlugin<NativeTtsPlugin>("NativeTts");
const NativeSpeech = registerPlugin<NativeSpeechPlugin>("NativeSpeech");
let activeWebRecognition: WebSpeechRecognition | null = null;

function getRecognitionConstructor(): WebSpeechRecognitionConstructor | null {
  const speechWindow = window as Window & {
    SpeechRecognition?: WebSpeechRecognitionConstructor;
    webkitSpeechRecognition?: WebSpeechRecognitionConstructor;
  };
  return speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition || null;
}

/** Uses Android's native TextToSpeech engine in the APK and the platform speech engine on web. */
export async function speakText(
  text: string,
  onError?: (message: string) => void,
  options: { language?: string; rate?: number } = {},
): Promise<void> {
  const cleanText = text.trim();
  if (!cleanText) return;
  const language = options.language || "en-US";
  const rate = options.rate ?? 1;

  try {
    if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === "android") {
      await NativeTts.speak({ text: cleanText, language, rate });
      return;
    }

    if (!( "speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
      throw new Error("speech-unavailable");
    }

    window.speechSynthesis.cancel();
    await new Promise<void>((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = language;
      utterance.rate = rate;
      utterance.onend = () => resolve();
      utterance.onerror = () => reject(new Error("speech-failed"));
      window.speechSynthesis.speak(utterance);
    });
  } catch {
    onError?.("پخش صدا انجام نشد؛ موتور گفتار دستگاه و صدای زبان انگلیسی را بررسی کن.");
  }
}

export async function stopSpeaking(): Promise<void> {
  if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === "android") {
    try { await NativeTts.stop(); } catch { /* Native bridge may already be closing. */ }
  }
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

/** Android uses SpeechRecognizer with a runtime microphone permission; web uses Web Speech API. */
export async function recognizeSpeech(language = "en-US"): Promise<string[]> {
  if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === "android") {
    const response = await NativeSpeech.listen({ language });
    return Array.isArray(response.transcripts) ? response.transcripts : [];
  }

  const Recognition = getRecognitionConstructor();
  if (!Recognition) throw new Error("unsupported");

  return new Promise<string[]>((resolve, reject) => {
    const recognition = new Recognition();
    activeWebRecognition = recognition;
    recognition.lang = language;
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;
    let settled = false;

    const finish = (callback: () => void) => {
      if (settled) return;
      settled = true;
      if (activeWebRecognition === recognition) activeWebRecognition = null;
      callback();
    };

    recognition.onresult = event => {
      const result = event.results[event.resultIndex] || event.results[0];
      const alternatives = Array.from(result || [])
        .map(item => item.transcript)
        .filter(value => typeof value === "string" && value.trim().length > 0);
      finish(() => resolve(alternatives));
    };
    recognition.onerror = event => finish(() => reject(new Error(event.error || "recognition-failed")));
    recognition.onend = () => finish(() => reject(new Error("no-speech")));

    try {
      recognition.start();
    } catch {
      finish(() => reject(new Error("recognition-failed")));
    }
  });
}

export async function stopRecognition(): Promise<void> {
  if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === "android") {
    try { await NativeSpeech.stop(); } catch { /* No active native recognition. */ }
  }
  if (activeWebRecognition) {
    try { activeWebRecognition.abort(); } catch { /* Recognition may already have ended. */ }
    activeWebRecognition = null;
  }
}
