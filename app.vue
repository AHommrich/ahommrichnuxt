<script setup lang="ts">
// Self-hosted Umami (cookiefrei): nur wenn Website-ID + Host konfiguriert sind.
// Dieselbe App wird unter ahommrich.de und hommri.ch ausgeliefert, daher trackt
// EINE Website-ID beide Domains; im Umami-Dashboard nach Hostname filterbar.
// Ohne Konfiguration (z. B. lokal) wird kein Analytics-Skript eingebunden.
const config = useRuntimeConfig();
const umami = config.public.umami as { websiteId?: string; apiHost?: string };
const umamiWebsiteId = String(umami?.websiteId || "").trim();
const umamiHost = String(umami?.apiHost || "")
  .trim()
  .replace(/\/$/, "");
const umamiEnabled = Boolean(umamiWebsiteId) && Boolean(umamiHost);

if (umamiEnabled) {
  useHead({
    script: [
      {
        src: `${umamiHost}/script.js`,
        defer: true,
        "data-website-id": umamiWebsiteId,
      },
    ],
  });
}
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
