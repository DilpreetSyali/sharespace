import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
    server: {
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