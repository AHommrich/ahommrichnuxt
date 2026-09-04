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
      <div
        class="absolute inset-0 z-0 [clip-path:polygon(12px_0,calc(100%-12px)_0,100%_12px,100%_100%,0_100%,0_12px)] bg-[#8D1D29] opacity-80"
      />

      <div
        class="relative z-10 mx-auto flex w-full transform items-center justify-between gap-3 px-4 py-2 shadow-lg sm:px-12"
      >
        <img
          src="/img/hommri-logo.svg"
          alt="hommri.ch"
          class="h-8 w-auto shrink-0 self-center sm:h-14"
        />
        <div class="flex items-center gap-4 text-sm sm:gap-6 sm:text-base">
          <a
            href="https://github.com/AHommrich"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub-Profil von André Hommrich"
            class="transition-opacity hover:opacity-70"
          >
            <!-- GitHub mark (inline SVG, no external dependency) -->
            <svg
              class="h-5 w-5 sm:h-6 sm:w-6"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.06-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.49 5.93.43.37.81 1.1.81 2.22 0 1.6-.01 2.9-.01 3.29 0 .32.22.7.83.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z"
              />
            </svg>
          </a>
          <NuxtLink :to="'impressum'"> Impressum </NuxtLink>
          <NuxtLink :to="'datenschutz'"> Datenschutz </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>
