// Sentry (self-hosted GlitchTip) — client-only error tracking.
// The `.client.ts` suffix enforces browser-only execution in Nuxt.
//
// Guarded exactly like Umami: without a DSN nothing initialises, so the site
// stays clean locally and in any environment where NUXT_PUBLIC_SENTRY_DSN is
// unset (see nuxt.config.ts runtimeConfig.public.sentry).
//
// DSGVO / consentless: no cookies, no personal data. We disable PII, send no
// performance traces, and additionally strip IP address and email from every
// event. Only technical error data is transmitted — the same legitimate-interest
// footing as the cookieless Umami setup.
import * as Sentry from "@sentry/vue";

export default defineNuxtPlugin((nuxtApp) => {
  if (!import.meta.client) return;

  const config = useRuntimeConfig();
  const sentry = config.public.sentry as { dsn?: string; environment?: string };
  const dsn = String(sentry?.dsn || "").trim();

  // Kein DSN -> kein Sentry (consentless/guarded).
  if (!dsn) return;

  Sentry.init({
    app: nuxtApp.vueApp,
    dsn,
    environment: String(sentry?.environment || "production"),
    // DSGVO: keine personenbezogenen Daten, keine Cookies.
    sendDefaultPii: false,
    // Kein Performance-Tracing -> weniger Volumen, keine Zusatzdaten.
    tracesSampleRate: 0,
    // Zusaetzliche Absicherung: IP-Adresse und E-Mail aus jedem Event entfernen.
    beforeSend(event) {
      if (event.user) {
        delete event.user.ip_address;
        delete event.user.email;
      }
      return event;
    },
  });
});
