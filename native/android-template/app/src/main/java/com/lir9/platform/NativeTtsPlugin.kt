package com.lir9.platform

import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import java.util.Locale
import java.util.concurrent.CopyOnWriteArrayList

@CapacitorPlugin(name = "NativeTts")
class NativeTtsPlugin : Plugin() {
    private var textToSpeech: TextToSpeech? = null
    private var initialized = false
    private val pendingCalls = CopyOnWriteArrayList<PluginCall>()

    @PluginMethod
    fun speak(call: PluginCall) {
        val text = call.getString("text")?.trim().orEmpty()
        if (text.isEmpty()) {
            call.reject("متن برای پخش خالی است.")
            return
        }

        pendingCalls.add(call)
        if (textToSpeech == null) {
            textToSpeech = TextToSpeech(context.applicationContext) { status ->
                if (status == TextToSpeech.SUCCESS) {
                    initialized = true
                    val queued = pendingCalls.toList()
                    pendingCalls.clear()
                    queued.forEach { play(it) }
                } else {
                    val queued = pendingCalls.toList()
                    pendingCalls.clear()
                    queued.forEach { it.reject("موتور گفتار اندروید راه‌اندازی نشد.") }
                }
            }
        } else if (initialized) {
            pendingCalls.remove(call)
            play(call)
        }
    }

    private fun play(call: PluginCall) {
        val engine = textToSpeech
        val text = call.getString("text")?.trim().orEmpty()
        if (engine == null || text.isEmpty()) {
            call.reject("موتور گفتار آماده نیست یا متن خالی است.")
            return
        }

        val languageTag = call.getString("language") ?: "en-US"
        val locale = Locale.forLanguageTag(languageTag)
        val languageStatus = engine.setLanguage(locale)
        if (languageStatus == TextToSpeech.LANG_MISSING_DATA ||
            languageStatus == TextToSpeech.LANG_NOT_SUPPORTED) {
            call.reject("صدای زبان انتخاب‌شده روی دستگاه نصب یا پشتیبانی نمی‌شود.")
            return
        }

        val rate = call.getDouble("rate")?.toFloat()?.coerceIn(0.5f, 2.0f) ?: 1.0f
        engine.setSpeechRate(rate)
        val utteranceId = "lir9-${System.nanoTime()}"
        val result = engine.speak(text, TextToSpeech.QUEUE_FLUSH, null, utteranceId)
        if (result == TextToSpeech.ERROR) {
            call.reject("اندروید نتوانست گفتار را پخش کند.")
        } else {
            call.resolve(JSObject().put("started", true))
        }
    }

    @PluginMethod
    fun stop(call: PluginCall) {
        textToSpeech?.stop()
        call.resolve()
    }

    override fun handleOnDestroy() {
        pendingCalls.forEach { it.reject("برنامه بسته شد.") }
        pendingCalls.clear()
        textToSpeech?.stop()
        textToSpeech?.shutdown()
        textToSpeech = null
        initialized = false
        super.handleOnDestroy()
    }
}
