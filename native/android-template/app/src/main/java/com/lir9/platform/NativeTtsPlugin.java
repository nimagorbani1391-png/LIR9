package com.lir9.platform;

import android.speech.tts.TextToSpeech;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@CapacitorPlugin(name = "NativeTts")
public class NativeTtsPlugin extends Plugin {
    private TextToSpeech textToSpeech;
    private boolean initialized = false;
    private final List<PluginCall> pendingCalls = new ArrayList<>();

    @Override
    public void load() {
        super.load();
        textToSpeech = new TextToSpeech(getContext().getApplicationContext(), status -> {
            if (status == TextToSpeech.SUCCESS) {
                initialized = true;
                List<PluginCall> queued = new ArrayList<>(pendingCalls);
                pendingCalls.clear();
                for (PluginCall call : queued) speakNow(call);
            } else {
                List<PluginCall> queued = new ArrayList<>(pendingCalls);
                pendingCalls.clear();
                for (PluginCall call : queued) call.reject("موتور گفتار اندروید راه‌اندازی نشد.");
            }
        });
    }

    @PluginMethod
    public void speak(PluginCall call) {
        String text = call.getString("text", "").trim();
        if (text.isEmpty()) {
            call.reject("متن برای پخش خالی است.");
            return;
        }
        if (!initialized) {
            pendingCalls.add(call);
            return;
        }
        speakNow(call);
    }

    private void speakNow(PluginCall call) {
        if (textToSpeech == null) {
            call.reject("موتور گفتار آماده نیست.");
            return;
        }

        String text = call.getString("text", "").trim();
        String languageTag = call.getString("language", "en-US");
        Locale locale = Locale.forLanguageTag(languageTag);
        int languageStatus = textToSpeech.setLanguage(locale);

        if (languageStatus == TextToSpeech.LANG_MISSING_DATA ||
                languageStatus == TextToSpeech.LANG_NOT_SUPPORTED) {
            call.reject("صدای زبان انتخاب‌شده روی دستگاه نصب یا پشتیبانی نمی‌شود.");
            return;
        }

        double requestedRate = call.getDouble("rate", 1.0);
        float rate = (float) Math.max(0.5, Math.min(2.0, requestedRate));
        textToSpeech.setSpeechRate(rate);

        String utteranceId = "lir9-" + System.nanoTime();
        int result = textToSpeech.speak(text, TextToSpeech.QUEUE_FLUSH, null, utteranceId);
        if (result == TextToSpeech.ERROR) {
            call.reject("اندروید نتوانست گفتار را پخش کند.");
        } else {
            JSObject response = new JSObject();
            response.put("started", true);
            call.resolve(response);
        }
    }

    @PluginMethod
    public void stop(PluginCall call) {
        if (textToSpeech != null) textToSpeech.stop();
        call.resolve();
    }

    @Override
    protected void handleOnDestroy() {
        pendingCalls.clear();
        if (textToSpeech != null) {
            textToSpeech.stop();
            textToSpeech.shutdown();
            textToSpeech = null;
        }
        initialized = false;
        super.handleOnDestroy();
    }
}
