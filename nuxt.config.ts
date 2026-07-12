import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-02-18",
  // Automatically enabled in development, disabled in production builds
  devtools: { enabled: process.env.NODE_ENV !== "production" },
  app: {
    head: {
      htmlAttrs: { lang: "de" },
      title: "André Hommrich — Fullstack-Entwickler",
      meta: [
        {
          name: "description",
          content:
            "Portfolio von André Hommrich — Fullstack-Entwickler aus dem Westerwald. Symfony, Laravel, Vue.js, TypeScript und Docker.",
        },
      ],
      link: [{ rel: "icon", type: "image/png", href: "/favicon.ico" }],
    },
  },
  css: [
    // FontAwesome CSS must be included manually because autoAddCss is disabled in the plugin
    "@fortawesome/fontawesome-svg-core/styles.css",
    // Global Tailwind entry point (imports @tailwind base/components/utilities)
    "~/assets/css/main.css",
    // Shared tokens/primitives for the /lebenslauf and /anschreiben pages
    "~/assets/css/document.css",
  ],
  modules: ["@nuxt/eslint"],
  nitro: {
    // puppeteer-core must not be bundled by Rollup — it relies on dynamic
    // requires and a native Chromium binary resolved at runtime.
    externals: { external: ["puppeteer-core"] },
  },
  vite: {
    plugins: [
      // Tailwind CSS v4 is integrated as a Vite plugin — no tailwind.config.js needed
      tailwindcss(),
    ],
    optimizeDeps: {
      // Pre-bundle FontAwesome packages to avoid slow cold-start in dev
      // (these packages ship CommonJS and benefit from Vite's dep optimisation)
      include: [
        "@fortawesome/free-solid-svg-icons",
        "@fortawesome/fontawesome-svg-core",
        "@fortawesome/vue-fontawesome",
      ],
    },
  },
});
