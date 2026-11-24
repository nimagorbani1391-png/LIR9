package com.lir9.platform

import android.os.Bundle
import com.getcapacitor.BridgeActivity

class MainActivity : BridgeActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        registerPlugin(NativeTtsPlugin::class.java)
        super.onCreate(savedInstanceState)
    }
}
