<script setup lang="ts">
const { t } = useI18n();

useSeoMeta({
  title: () => t("seo.home.title"),
  description: () => t("seo.home.description"),
  ogTitle: () => t("seo.home.title"),
  ogDescription: () => t("seo.home.description"),
  ogImage: "https://hommri.ch/og-image.png",
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: "hommri.ch — André Hommrich, Fullstack-Entwickler",
  ogUrl: "https://hommri.ch",
  ogType: "website",
  ogLocale: "de_DE",
  twitterCard: "summary_large_image",
  twitterImage: "https://hommri.ch/og-image.png",
});

useHead({
  link: [{ rel: "canonical", href: "https://hommri.ch" }],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        name: "André Hommrich",
        url: "https://hommri.ch",
        jobTitle: "Fullstack-Entwickler",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Montabaur",
          addressRegion: "Westerwald",
          addressCountry: "DE",
        },
        knowsAbout: [
          "PHP",
          "Symfony",
          "Laravel",
          "Vue.js",
          "TypeScript",
          "Docker",
          "Git",
          "MySQL",
        ],
      }),
    },
  ],
});
</script>

<template>
  <div>
    <!-- Homepage: renders the main sections in order -->
    <!-- Visually hidden h1 for screen readers and SEO -->
    <h1 class="sr-only">{{ $t("seo.home.title") }}</h1>
    <AppHeroSection />
    <AppAboutSection />
    <AppCurrentlySection />
    <AppTechSection />
    <AppContactSection />
  </div>
</template>
