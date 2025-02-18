<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { useRoute } from "vue-router";

const activeSection = ref(""); // Setze "home" als Standard, wenn die Seite geladen wird
const route = useRoute(); // Aktuelle Route

// Scrollen zu einem Abschnitt
const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    window.scrollTo({
      top: element.offsetTop - 100, // 100px Offset für den Header
      behavior: "smooth", // Sanftes Scrollen
    });
  }
};
onBeforeMount(() => {
  // Nur beim vollständigen Seitenreload sicherstellen, dass wir oben landen
  if (window.performance.navigation.type === 1) {
    window.scrollTo({
      top: 0, // 100px Offset für den Header
      behavior: "smooth", // Sanftes Scrollen
    });
  }
});
// Beobachte, welche Sektion aktuell sichtbar ist
onMounted(async () => {
  await nextTick();
  setTimeout(() => {
    activeSection.value = "home";
  }, 10);
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Wenn der Abschnitt zu mindestens 50% sichtbar ist, markiere ihn als aktiv
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id;
        }
      });
    },
    {
      threshold: 0.5, // 50% des Elements müssen sichtbar sein
    },
  );

  // Beobachte alle Sektionen mit einer ID
  const sections = document.querySelectorAll("[id]");
  sections.forEach((section) => observer.observe(section));

  // Füge einen Scroll-Event-Listener hinzu, der den aktuellen Abschnitt ebenfalls erkennt
  window.addEventListener("scroll", () => {
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      // Wenn der Abschnitt mehr als 50% sichtbar ist
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
  <header
    class="fixed left-1/2 z-50 w-full max-w-7xl -translate-x-1/2 transform shadow-lg"
  >
    <div class="absolute inset-0 z-0 rounded-b-xl bg-[#8D1D29] opacity-80" />

    <div
      class="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-3 text-gray-200 opacity-100"
    >
      <!-- Logo links -->
      <div class="text-lg font-bold">
        <NuxtLink to="/" class="text-lg font-bold">
          <img src="@/assets/logo-white.svg" alt="Logo" class="h-10 w-auto" >
        </NuxtLink>
      </div>

      <!-- Navigation rechts -->
      <nav class="flex gap-6">
        <!-- Zeige Navigation nur, wenn die Route nicht die Startseite ist -->
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

        <!-- Zeige einen Zurück-Button für alle anderen Routen -->
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
