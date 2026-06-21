<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useRoute } from "vue-router";

// Tracks the currently visible section id — used to highlight the active nav link
const activeSection = ref("");
const route = useRoute();

// Ordered nav sections — index matches the .nav-link DOM order in the template
const SECTION_IDS = [
  "home",
  "ueber-mich",
  "was-ich-mache",
  "technologien",
] as const;

// Sliding underline state — x position and width are interpolated based on scroll progress
const lineLeft = ref(0);
const lineWidth = ref(0);

// Cached layout measurements — refreshed on mount, resize, and whenever the body
// resizes (covers HMR text-size changes, late-loading images, FLIP scenes, etc.)
let navMetrics: { left: number; width: number }[] = [];
let sectionMidpoints: number[] = [];
let rafId: number | null = null;
let bodyObserver: ResizeObserver | null = null;

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

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Reads offsetLeft/offsetWidth of each nav-link in the header. Uses a fresh DOM
// query each time so this works regardless of Vue-ref timing or HMR state.
const measureNavItems = () => {
  const items = document.querySelectorAll<HTMLElement>("header .nav-link");
  navMetrics = Array.from(items).map((el) => ({
    left: el.offsetLeft,
    width: el.offsetWidth,
  }));
};

// Reads the vertical midpoint of each tracked section in document coordinates
const measureSections = () => {
  sectionMidpoints = SECTION_IDS.map((id) => {
    const el = document.getElementById(id);
    return el ? el.offsetTop + el.offsetHeight / 2 : 0;
  });
};

// Core logic: interpolates the line's position/width based on where the viewport center
// sits between two consecutive section midpoints — gives a continuous, scroll-driven motion
const updateLinePosition = () => {
  if (!navMetrics.length || !sectionMidpoints.length) return;

  const viewportCenter = window.scrollY + window.innerHeight / 2;
  const last = sectionMidpoints.length - 1;

  // Before the first section midpoint → pin to first nav item
  if (viewportCenter <= sectionMidpoints[0]) {
    lineLeft.value = navMetrics[0].left;
    lineWidth.value = navMetrics[0].width;
    return;
  }

  // Past the last section midpoint → pin to last nav item
  if (viewportCenter >= sectionMidpoints[last]) {
    lineLeft.value = navMetrics[last].left;
    lineWidth.value = navMetrics[last].width;
    return;
  }

  // In-between: find the segment and interpolate
  for (let i = 0; i < last; i++) {
    const a = sectionMidpoints[i];
    const b = sectionMidpoints[i + 1];
    if (viewportCenter >= a && viewportCenter < b) {
      const span = b - a;
      if (span <= 0) return;
      const t = (viewportCenter - a) / span;
      lineLeft.value = lerp(navMetrics[i].left, navMetrics[i + 1].left, t);
      lineWidth.value = lerp(navMetrics[i].width, navMetrics[i + 1].width, t);
      return;
    }
  }
};

// rAF-throttled scroll handler — avoids running the math more than once per frame
const onScroll = () => {
  if (rafId !== null) return;
  rafId = requestAnimationFrame(() => {
    rafId = null;
    updateLinePosition();
  });
};

const onResize = () => {
  measureNavItems();
  measureSections();
  updateLinePosition();
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

  // Initial measurement + first paint of the sliding underline
  measureNavItems();
  measureSections();
  updateLinePosition();

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);

  // Re-measure once after fonts/images/FLIP scenes have settled — avoids stale offsets
  setTimeout(onResize, 500);

  // Re-measure whenever the page body changes size (HMR, lazy-loaded content,
  // section-collapse animations, etc.) so the line never sticks to stale offsets.
  if (typeof ResizeObserver !== "undefined") {
    bodyObserver = new ResizeObserver(onResize);
    bodyObserver.observe(document.body);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onResize);
  bodyObserver?.disconnect();
  bodyObserver = null;
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
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

      <nav class="relative flex gap-6">
        <!-- On the homepage: show section anchor links with active-state underline -->
        <template v-if="route.path === '/'">
          <a
            class="nav-link mb-2 cursor-pointer text-gray-200"
            @click.prevent="scrollToSection('home')"
          >
            Home
          </a>
          <a
            class="nav-link mb-2 cursor-pointer text-gray-200"
            @click.prevent="scrollToSection('ueber-mich')"
          >
            Über mich
          </a>
          <a
            class="nav-link mb-2 cursor-pointer text-gray-200"
            @click.prevent="scrollToSection('was-ich-mache')"
          >
            Aktuell
          </a>
          <a
            class="nav-link mb-2 cursor-pointer text-gray-200"
            @click.prevent="scrollToSection('technologien')"
          >
            Skills
          </a>

          <!-- Sliding underline — interpolated between nav items based on scroll progress -->
          <div
            class="sliding-line pointer-events-none absolute bottom-0 block h-[2px] bg-black dark:bg-white"
            :style="{
              transform: `translate3d(${lineLeft}px, 0, 0)`,
              width: `${lineWidth}px`,
            }"
          />
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

<style scoped>
/* Smooth interpolation between scroll-driven position updates — kept short so the
   line still feels like it's tracking the scroll rather than lagging behind it */
.sliding-line {
  transition:
    transform 120ms linear,
    width 120ms linear;
  will-change: transform, width;
}
</style>
