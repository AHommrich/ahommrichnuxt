<script lang="ts" setup>
import { getCurrentAge } from "~/utils/age";
</script>

<template>
  <!-- About section -->
  <div id="ueber-mich" class="relative mx-auto mb-12 w-full max-w-7xl">
    <div
      class="relative z-10 flex w-full flex-col items-center sm:flex-row sm:px-9 sm:py-9"
    >
      <AppCard
        group-class="mx-auto w-[95%] lg:mx-0 lg:w-2/3"
        content-class="p-6 sm:justify-center"
      >
        <h3
          class="self-center pb-3 text-center text-2xl text-gray-200 sm:text-3xl md:text-4xl lg:text-5xl"
        >
          {{ $t("about.heading") }}
        </h3>
        <p
          class="py-3 text-left text-xs text-gray-200 sm:text-sm md:text-base lg:text-xl"
        >
          <!-- Age is computed at render time so it stays accurate without manual updates -->
          {{ $t("about.p1", { age: getCurrentAge() }) }}
        </p>
        <p
          class="py-3 text-left text-xs text-gray-200 sm:text-sm md:text-base lg:text-xl"
        >
          {{ $t("about.p2") }}
        </p>
        <!-- Inline photo shown only on mobile/tablet (hidden on lg and above) -->
        <img
          src="/img/andre-arbeit-3.jpg"
          class="block h-auto max-h-64 w-full py-3 object-cover shadow-lg md:object-[center_45%] lg:hidden"
          :alt="$t('about.photoAlt')"
        />
        <p
          class="pt-3 text-left text-xs text-gray-200 sm:text-sm md:text-base lg:text-xl"
        >
          {{ $t("about.p3") }}
        </p>
      </AppCard>

      <!-- Side photo shown only on large screens (lg and above) -->
      <div class="ml-8 hidden w-1/3 items-center justify-center lg:flex">
        <img
          src="/img/andre-arbeit-3.jpg"
          class="h-auto max-h-[550px] w-full object-contain shadow-lg"
          :alt="$t('about.photoAlt')"
        />
      </div>
    </div>
  </div>
</template>
