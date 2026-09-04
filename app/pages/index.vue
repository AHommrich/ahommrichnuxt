<script setup lang="ts">
const { t } = useI18n();

useSeoMeta({
  title: () => t("seo.home.title"),
  description: () => t("seo.home.description"),
  ogTitle: () => t("seo.home.title"),
  ogDescription: () => t("seo.home.description"),
  ogImage: "https://ahommrich.de/img/andre-arbeit-3.jpg",
  ogUrl: "https://ahommrich.de",
  ogType: "website",
  ogLocale: "de_DE",
  twitterCard: "summary_large_image",
});

useHead({
  link: [{ rel: "canonical", href: "https://ahommrich.de" }],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        name: "André Hommrich",
        url: "https://ahommrich.de",
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
