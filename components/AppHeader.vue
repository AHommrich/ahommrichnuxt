<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { useRoute } from "vue-router";

// Tracks the currently visible section id — used to highlight the active nav link
const activeSection = ref("");
const route = useRoute();

/**
 * Smoothly scrolls the page to a section by its id.
 * Applies a 100px top offset to prevent the fixed header from overlapping the section heading.
 */
const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    window.scrollTo({
      top: element.offsetTop - 100,
      behavior: "smooth",
    });
  }
};

// On hard reload (navigation type 1), scroll back to top so the page always starts at the hero
onBeforeMount(() => {
  if (window.performance.navigation.type === 1) {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
});

onMounted(async () => {
  await nextTick();

  // Delay the initial active section assignment slightly so the IntersectionObserver has time
  // to fire first — prevents the scroll listener from immediately overriding it
  setTimeout(() => {
    activeSection.value = "home";
  }, 10);

  // IntersectionObserver: marks a section as active when it crosses the 50% visibility threshold
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id;
        }
      });
    },
    {
      threshold: 0.5,
    },
  );

  const sections = document.querySelectorAll("[id]");
  sections.forEach((section) => observer.observe(section));

  // Fallback scroll listener: handles sections too tall to ever reach the 50% threshold
  // (e.g. on small screens where a section fills the entire viewport height)
  window.addEventListener("scroll", () => {
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (
        rect.top <= window.innerHeight / 1.1 &&
        rect.bottom >= window.innerHeight / 2
      ) {
        activeSection.value = section.id;
      }
    });
  });
});
</script>
<template>
  <!-- Fixed header pinned to the top-centre, max-width aligned with page content -->
  <header
    class="fixed left-1/2 z-50 w-full max-w-7xl -translate-x-1/2 transform shadow-lg"
  >
    <!-- Semi-transparent burgundy background layer -->
    <div class="absolute inset-0 z-0 rounded-b-xl bg-[#8D1D29] opacity-80" />

    <div
      class="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-3 text-gray-200 opacity-100"
    >
      <!-- Logo — links back to the homepage -->
      <div class="text-lg font-bold">
        <NuxtLink to="/" class="text-lg font-bold">
          <img src="@/assets/logo-white.svg" alt="Logo" class="h-10 w-auto" />
        </NuxtLink>
      </div>

      <nav class="flex gap-6">
        <!-- On the homepage: show section anchor links with active-state underline -->
        <template v-if="route.path === '/'">
          <a
            class="mb-2 cursor-pointer text-gray-200"
            :class="{
              'border-b-2 border-black dark:border-white':
                activeSection === 'home',
            }"
            @click.prevent="scrollToSection('home')"
          >
            Home
          </a>
          <a
            class="mb-2 cursor-pointer text-gray-200"
            :class="{
              'border-b-2 border-black dark:border-white':
                activeSection === 'ueber-mich',
            }"
            @click.prevent="scrollToSection('ueber-mich')"
          >
            Über mich
          </a>
          <a
            class="mb-2 cursor-pointer text-gray-200"
            :class="{
              'border-b-2 border-black dark:border-white':
                activeSection === 'technologien',
            }"
            @click.prevent="scrollToSection('technologien')"
          >
            Skills
          </a>
        </template>

        <!-- On all other pages (e.g. Impressum): show a back link instead -->
        <template v-else>
          <NuxtLink
            to="/"
            class="mb-2 cursor-pointer text-gray-200"
            @click.prevent="activeSection = 'home'"
          >
            Zurück
          </NuxtLink>
        </template>
      </nav>
    </div>
  </header>
</template>
