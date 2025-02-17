import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sentryVitePlugin({
      org: "diory-oy",
      project: "mobile-proto-ui",
    }),
  ],

  build: {
    sourcemap: true,
  },
});
