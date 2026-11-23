import React from "react";
import ReactDOM from "react-dom/client";
import { Capacitor } from "@capacitor/core";
import App from "./App";
import "./styles.css";

// Keep the PWA service worker on the web, but let Capacitor manage its
// native WebView runtime without a competing service worker.
if (
  import.meta.env.PROD &&
  !Capacitor.isNativePlatform() &&
  "serviceWorker" in navigator
) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`, {
        scope: import.meta.env.BASE_URL,
      })
      .catch((error: unknown) => {
        console.error("LIR9 service worker registration failed:", error);
      });
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
