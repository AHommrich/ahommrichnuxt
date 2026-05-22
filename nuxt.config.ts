import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-02-18",
  devtools: { enabled: false },
  app: {
    head: {
      link: [{ rel: "icon", type: "image/png", href: "/favicon.ico" }],
    },
  },
  css: [
    // FontAwesome CSS must be included manually because autoAddCss is disabled in the plugin
    "@fortawesome/fontawesome-svg-core/styles.css",
    // Global Tailwind entry point (imports @tailwind base/components/utilities)
    "~/assets/css/main.css",
  ],
  modules: ["@nuxt/eslint"],
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
