<script setup lang="ts">
defineProps<{
  // When true, the footer is fixed to the bottom of the viewport.
  // Used on short pages (e.g. Impressum) where the content doesn't fill the screen height.
  isFooterFixed?: boolean;
}>();
</script>

<template>
  <footer
    :class="{
      'z-60 fixed bottom-0 left-0 right-0 flex w-full text-gray-200':
        isFooterFixed,
      'z-50 mt-auto w-full text-gray-200': !isFooterFixed,
    }"
    class="h-auto"
  >
    <div class="relative mx-auto h-full w-full max-w-7xl">
      <!-- Semi-transparent burgundy background layer -->
      <div class="absolute inset-0 z-0 rounded-t-xl bg-[#8D1D29] opacity-80" />

      <div
        class="relative z-10 mx-auto flex w-full transform justify-between px-12 py-2 shadow-lg"
      >
        <img src="@/assets/logo-white.svg" alt="Logo" class="h-24 w-auto" />
        <div class="flex items-center">
          <NuxtLink :to="'impressum'"> Impressum </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>
