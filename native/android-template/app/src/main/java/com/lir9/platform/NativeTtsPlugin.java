package com.lir9.platform;

import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@CapacitorPlugin(name = "NativeTts")
public class NativeTtsPlugin extends Plugin {
    private TextToSpeech textToSpeech;
    private boolean initialized = false;
    private final List<PluginCall> pendingInitializationCalls = new ArrayList<>();
    private final Map<String, PluginCall> pendingUtterances = new HashMap<>();

    @Override
    public void load() {
        super.load();
        textToSpeech = new TextToSpeech(getContext().getApplicationContext(), status -> {
            if (status == TextToSpeech.SUCCESS) {
                initialized = true;
                textToSpeech.setOnUtteranceProgressListener(new UtteranceProgressListener() {
                    @Override public void onStart(String utteranceId) {}

                    @Override
                    public void onDone(String utteranceId) {
                        completeUtterance(utteranceId, null);
                    }

                    @Override
                    public void onError(String utteranceId) {
                        completeUtterance(utteranceId, "اندروید نتوانست صدا را کامل پخش کند.");
                    }

                    @Override
                    public void onStop(String utteranceId, boolean interrupted) {
                        completeUtterance(utteranceId, interrupted ? "پخش صدا متوقف شد." : null);
                    }
                });
                List<PluginCall> queued = new ArrayList<>(pendingInitializationCalls);
                pendingInitializationCalls.clear();
                for (PluginCall call : queued) speakNow(call);
            } else {
                List<PluginCall> queued = new ArrayList<>(pendingInitializationCalls);
                pendingInitializationCalls.clear();
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
            pendingInitializationCalls.add(call);
            return;
        }
        speakNow(call);
    }

    private void speakNow(PluginCall call) {
        if (textToSpeech == null || !initialized) {
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
        pendingUtterances.put(utteranceId, call);
        int result = textToSpeech.speak(text, TextToSpeech.QUEUE_FLUSH, null, utteranceId);
        if (result == TextToSpeech.ERROR) {
            pendingUtterances.remove(utteranceId);
            call.reject("اندروید نتوانست گفتار را پخش کند.");
        }
    }

    private void completeUtterance(String utteranceId, String error) {
        PluginCall call = pendingUtterances.remove(utteranceId);
        if (call == null) return;
        getActivity().runOnUiThread(() -> {
            if (error == null) call.resolve();
            else call.reject(error);
        });
    }

    @PluginMethod
    public void stop(PluginCall call) {
        if (textToSpeech != null) textToSpeech.stop();
        List<PluginCall> interrupted = new ArrayList<>(pendingUtterances.values());
        pendingUtterances.clear();
        for (PluginCall pending : interrupted) pending.reject("پخش صدا متوقف شد.");
        call.resolve();
    }

    @Override
    protected void handleOnDestroy() {
        pendingInitializationCalls.clear();
        for (PluginCall pending : pendingUtterances.values()) pending.reject("پخش صدا متوقف شد.");
        pendingUtterances.clear();
        if (textToSpeech != null) {
            textToSpeech.stop();
            textToSpeech.shutdown();
            textToSpeech = null;
        }
        initialized = false;
        super.handleOnDestroy();
    }
}
