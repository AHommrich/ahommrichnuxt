import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-02-18",
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.ico' }
      ]
    }
  },
  css: [
    "@fortawesome/fontawesome-svg-core/styles.css",
    "~/assets/css/main.css",
  ],
  modules: ["@nuxt/eslint"],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        "@fortawesome/free-solid-svg-icons",
        "@fortawesome/fontawesome-svg-core",
        "@fortawesome/vue-fontawesome",
      ],
    },
  },
});
