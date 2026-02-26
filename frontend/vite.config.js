import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // listen on all addresses so that external previews (Codespaces, GitHub.dev,
    // etc.) can connect. vite prints “use --host to expose” by default when the
    // host is localhost only, which is why the page was just showing a white
    // screen in the remote browser.
    host: true,

    proxy: {
      // Browser calls /api/... → Vite forwards to backend inside container
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});