import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-02-18",
  // Automatically enabled in development, disabled in production builds
  devtools: { enabled: process.env.NODE_ENV !== "production" },
  app: {
    head: {
      // html lang wird pro Sprache über useLocaleHead im Layout gesetzt.
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
  modules: ["@nuxt/eslint", "@nuxtjs/i18n"],
  i18n: {
    // Deutsch bleibt auf "/" (kein Präfix, kein SEO-Verlust), Englisch unter "/en".
    strategy: "prefix_except_default",
    defaultLocale: "de",
    locales: [
      { code: "de", language: "de-DE", name: "Deutsch", file: "de.json" },
      { code: "en", language: "en-US", name: "English", file: "en.json" },
    ],
    // DSGVO: Sprache steckt in der URL. Keine automatische Browser-Weiterleitung
    // und KEIN Locale-Cookie -> keine Einwilligung nötig. Umschalten nur per Schalter.
    detectBrowserLanguage: false,
    compilation: {
      // Die Rechtsseiten-Absätze enthalten Inline-HTML (<strong>/<a> für Links)
      // in den Übersetzungswerten. Der Message-Compiler lehnt HTML sonst ab.
      // Inhalte sind von uns selbst verfasst (kein Nutzer-Input) und werden nur
      // auf den Rechtsseiten via v-html gerendert.
      strictMessage: false,
      escapeHtml: false,
    },
  },
  runtimeConfig: {
    public: {
      // Self-hosted Umami (cookiefrei). Werte via NUXT_PUBLIC_UMAMI_WEBSITE_ID
      // und NUXT_PUBLIC_UMAMI_API_HOST setzen. Ohne beide Werte wird kein
      // Analytics-Skript geladen (siehe app.vue).
      umami: {
        websiteId: "",
        apiHost: "",
      },
    },
  },
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
