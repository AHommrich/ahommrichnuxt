<script setup lang="ts">
import AppFooter from "@/components/AppFooter.vue";
import AppHeader from "@/components/AppHeader.vue";
import { onMounted, ref } from "vue";

// Determines whether the footer should be fixed to the bottom of the viewport.
// On short pages (e.g. Impressum) the content doesn't fill the screen, so the footer
// would float in the middle of the page without this fix.
const isFooterFixed = ref(false);

onMounted(() => {
  const contentHeight = document.documentElement.scrollHeight;
  const windowHeight = window.innerHeight;
  // Fix the footer only when all page content fits within the viewport
  isFooterFixed.value = contentHeight <= windowHeight;
});
</script>

<template>
  <div>
    <!-- Background: tiled SVG pattern switches between light/dark variants via Tailwind dark: -->
    <div
      class="bg-background-light bg-[url('@/assets/pattern-light.svg')] text-black/50 dark:bg-[url('@/assets/pattern-dark.svg')] dark:text-gray-200/50"
    >
      <!-- Full-height flex column so the footer is always pushed to the bottom -->
      <div
        class="relative flex min-h-screen w-full flex-col selection:bg-[#9c5258] selection:text-gray-200"
      >
        <AppHeader />
        <!-- Page content is injected here via Nuxt's layout slot -->
        <slot />
        <AppFooter :is-footer-fixed="isFooterFixed" />
      </div>
    </div>
  </div>
</template>
