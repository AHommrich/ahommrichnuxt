<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from "vue";

// Both props allow callers to compose the outer wrapper and inner content with
// their own Tailwind utilities (width, padding, alignment). Everything that
// belongs to the card-layer mechanism itself (border, shadow layers, transition)
// lives inside this component and is not overridable — that's the whole point
// of consolidating it here.
withDefaults(
  defineProps<{
    groupClass?: string;
    contentClass?: string;
  }>(),
  {
    groupClass: "w-full",
    contentClass: "p-6 gap-3",
  },
);

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
    { threshold: 0.35 },
  );
  observer.observe(cardEl.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
});
</script>

<template>
  <!--
    Reusable card with offset shadow layers and slide-apart animation.
    Slots have precedence over the default padding — use contentClass="" if the
    slot content already handles its own layout (e.g. tech section with a two-
    column grid inside).
  -->
  <div
    ref="cardEl"
    :class="['card-group relative', groupClass, { 'is-in-view': isInView }]"
  >
    <div
      class="card-layer card-layer-back absolute inset-0 w-full border border-[#3b4245] bg-white opacity-80 dark:border-white dark:bg-[#3b4245]"
    />
    <div
      class="card-layer card-layer-front absolute inset-0 w-full border border-[#3b4245] bg-[#8D1D29] opacity-80 dark:border-white"
    />
    <div :class="['card-content relative z-10 flex flex-col', contentClass]">
      <slot />
    </div>
  </div>
</template>

<style scoped>
/*
  Both shadow layers and the content stack sit on top of each other by
  default and slide apart on hover (desktop) or when the card enters the
  viewport (touch). Distance matches Tailwind's translate-1.5.
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

/*
  Reduced motion: render the card in its fully expanded state from the start.
  Same visual result as after the slide-apart, but with no transition and no
  hover / in-view trigger.
*/
@media (prefers-reduced-motion: reduce) {
  .card-layer,
  .card-content {
    transition: none;
  }
  .card-group .card-layer-back {
    transform: translate(0.375rem, 0.375rem);
  }
  .card-group .card-layer-front,
  .card-group .card-content {
    transform: translate(-0.375rem, -0.375rem);
  }
}
</style>
