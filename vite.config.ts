import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // LIR9 is deployed at the root of its Cloudflare Pages hostname.
  base: "/",
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        admin: "admin.html",
        verify: "verify.html",
      },
    },
  },
});
