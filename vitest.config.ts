import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "node:url";

// Standalone Vitest config (no Nuxt runtime). Uses @vitejs/plugin-vue for SFC
// support and happy-dom for a lightweight DOM. Nuxt's auto-imports aren't
// available in tests — components/composables use explicit imports.
const rootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "~": rootDir,
      "@": rootDir,
    },
  },
  test: {
    environment: "happy-dom",
    include: ["tests/**/*.spec.ts"],
    globals: true,
    setupFiles: ["tests/setup.ts"],
  },
});
