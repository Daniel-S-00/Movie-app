import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.js"],
    css: false,
    env: {
      VITE_TMDB_API_KEY: "test-tmdb-key",
      VITE_APPWRITE_ENDPOINT: "https://test.appwrite.io/v1",
      VITE_APPWRITE_PROJECT_ID: "test-project",
      VITE_APPWRITE_DATABASE_ID: "test-database",
      VITE_APPWRITE_COLLECTION_ID: "test-collection",
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{js,jsx}"],
      exclude: [
        "src/**/__tests__/**",
        "src/test/**",
        "src/main.jsx",
        "src/reportWebVitals.js",
      ],
    },
  },
});
