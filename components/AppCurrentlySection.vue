<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from "vue";

// IntersectionObserver toggles the in-view class used by (hover: none) CSS
// to trigger the same layer-slide animation on touch devices.
const cardEl = ref<HTMLElement | null>(null);
const isInView = ref(false);
let observer: IntersectionObserver | null = null;

onMounted(() => {
  if (!cardEl.value || typeof IntersectionObserver === "undefined") return;
  observer = new IntersectionObserver(
    ([entry]) => {
      isInView.value = entry.isIntersecting;
    },
    { threshold: 0.4 },
  );
  observer.observe(cardEl.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
});
</script>

<template>
  <!-- Currently-doing section: short job-focused card -->
  <div id="was-ich-mache" class="relative mx-auto mb-12 w-full max-w-7xl">
    <div
      class="relative z-10 flex w-full flex-col items-center sm:px-9 sm:py-9"
    >
      <div
        ref="cardEl"
        :class="[
          'card-group relative mx-auto w-[95%]',
          { 'is-in-view': isInView },
        ]"
      >
        <!-- Offset shadow layers — match the other main cards -->
        <div
          class="card-layer card-layer-back absolute inset-0 w-full border border-[#3b4245] bg-white opacity-80 dark:border-white dark:bg-[#3b4245]"
        />
        <div
          class="card-layer card-layer-front absolute inset-0 w-full border border-[#3b4245] bg-[#8D1D29] opacity-80 dark:border-white"
        />

        <div
          class="card-content relative z-10 flex flex-col p-6 sm:justify-center"
        >
          <h3
            class="self-center pb-3 text-center text-2xl text-gray-200 sm:text-3xl md:text-4xl lg:text-5xl"
          >
            Was ich aktuell mache?
          </h3>

          <!--
            Two-column layout on lg+: illustration on the left, both paragraphs
            on the right. On smaller screens, stack: illustration first (eye-
            catcher), then the two text paragraphs below.
          -->
          <div class="flex flex-col lg:flex-row lg:items-start lg:gap-10">
            <!-- Illustration column -->
            <div class="my-6 lg:my-0 lg:w-1/2">
              <AppFullstackScene />
            </div>

            <!-- Text column -->
            <div class="flex flex-col lg:w-1/2 lg:justify-center lg:py-4">
              <p
                class="py-3 text-left text-xs text-gray-200 sm:text-sm md:text-base lg:text-xl"
              >
                Als Fullstack-Webentwickler arbeite ich täglich an realen
                Projekten – von der Planung über die Umsetzung bis hin zur
                Wartung. In meiner Ausbildungszeit und darüber hinaus habe ich
                ein breites technisches Fundament aufgebaut, das ich seitdem
                kontinuierlich erweitere.
              </p>
              <p
                class="py-3 text-left text-xs text-gray-200 sm:text-sm md:text-base lg:text-xl"
              >
                In meiner Zeit als Entwickler habe ich gemerkt, wie gut der
                Beruf zu mir passt. Er verbindet das, was mich sowieso antreibt
                — Neugier, logisches Denken und technisches Verständnis.
                Komplexe Probleme zu lösen und dabei ständig dazuzulernen ist im
                Alltag genau das, was mir an dem Job am meisten Spaß macht.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/*
  Card layer animation — both shadow layers (and the content stack) sit on top
  of each other by default and slide apart on hover (desktop) or when the card
  enters the viewport (touch). Distance matches Tailwind's translate-1.5.
*/
.card-layer,
.card-content {
  transition: transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

@media (hover: hover) {
  .card-group:hover .card-layer-back {
    transform: translate(0.375rem, 0.375rem);
  }
  .card-group:hover .card-layer-front,
  .card-group:hover .card-content {
    transform: translate(-0.375rem, -0.375rem);
  }
}

@media (hover: none) {
  .card-group.is-in-view .card-layer-back {
    transform: translate(0.375rem, 0.375rem);
  }
  .card-group.is-in-view .card-layer-front,
  .card-group.is-in-view .card-content {
    transform: translate(-0.375rem, -0.375rem);
  }
}
</style>
