import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/LIR9/",
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
