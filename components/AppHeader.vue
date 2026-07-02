<script setup lang="ts">
import { ref, onBeforeMount, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useRoute } from "vue-router";
import { lerp } from "~/utils/animation";

const route = useRoute();

// Ordered nav sections — index matches the .nav-link DOM order in the template
const SECTION_IDS = [
  "home",
  "ueber-mich",
  "was-ich-mache",
  "technologien",
] as const;

// Active section id — drives the mobile per-tab underline. On desktop the
// sliding underline handles the visual highlight, but writing this ref is
// essentially free (IntersectionObserver fires once per section change,
// not per frame).
const activeSection = ref<string>("home");

// Template ref on the sliding underline. The rAF loop writes the slider's
// transform straight to el.style instead of through Vue reactivity — same
// pattern as AppTechSection's icon positioning loop. Slider is desktop only
// (hidden below the sm: breakpoint via tailwind classes).
const sliderEl = ref<HTMLElement | null>(null);

// Cached layout measurements — refreshed on mount, resize, and whenever the body
// resizes (covers HMR text-size changes, late-loading images, FLIP scenes, etc.)
let navMetrics: { left: number; width: number }[] = [];
let sectionMidpoints: number[] = [];
let rafId: number | null = null;
let bodyObserver: ResizeObserver | null = null;
let sectionObserver: IntersectionObserver | null = null;

// Last values written via setSlider — used to skip redundant DOM writes when
// the slider is "parked" at a section anchor. onResize resets both to NaN so
// the next tick re-applies fresh values after measurements changed.
let lastLeft = NaN;
let lastWidth = NaN;

// Continuous scroll-driven rAF loop state. We can't rely on scroll events alone
// because iOS Safari throttles them heavily during momentum scrolling, which
// caused the sliding underline to lag and snap between events. The loop polls
// window.scrollY every animation frame instead and auto-stops when idle.
let lastScrollY = -1;
let idleFrames = 0;
const MAX_IDLE_FRAMES = 30; // ~500ms at 60fps — stops the loop when scroll settles

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

// Direct DOM write for the underline — bypasses Vue reactivity so the rAF loop
// doesn't schedule a component patch on every frame.
//
// Visible width is encoded as scaleX on a 1px-wide element (see <style>), not
// via style.width. width is a layout-triggering CSS property — animating it per
// frame would force a style recalc + layout + paint on the main thread every
// tick. A combined transform stays entirely on the compositor thread, matching
// the tech-section's icon animation path.
//
// Mobile note: the slider element is `display: none` on mobile and the rAF
// loop isn't even registered there (see onMounted matchMedia gate), so this
// function effectively only runs on desktop.
const setSlider = (left: number, width: number) => {
  if (left === lastLeft && width === lastWidth) return;
  lastLeft = left;
  lastWidth = width;
  const el = sliderEl.value;
  if (!el) return;
  el.style.transform = `translate3d(${left}px, 0, 0) scaleX(${width})`;
};

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
    setSlider(navMetrics[0].left, navMetrics[0].width);
    return;
  }

  // Past the last section midpoint → pin to last nav item
  if (viewportCenter >= sectionMidpoints[last]) {
    setSlider(navMetrics[last].left, navMetrics[last].width);
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
      setSlider(
        lerp(navMetrics[i].left, navMetrics[i + 1].left, t),
        lerp(navMetrics[i].width, navMetrics[i + 1].width, t),
      );
      return;
    }
  }
};

// Continuous rAF loop: polls scrollY every frame, runs the underline math when
// the value changes, and auto-stops after MAX_IDLE_FRAMES of no movement.
// Decoupling from scroll events keeps the underline in sync with the visible scroll
// position on iOS, where scroll events fire sparsely during momentum scrolling.
const tick = () => {
  const y = window.scrollY;
  if (y !== lastScrollY) {
    lastScrollY = y;
    updateLinePosition();
    idleFrames = 0;
  } else {
    idleFrames++;
  }
  if (idleFrames < MAX_IDLE_FRAMES) {
    rafId = requestAnimationFrame(tick);
  } else {
    rafId = null;
  }
};

const onScroll = () => {
  if (rafId === null) {
    idleFrames = 0;
    rafId = requestAnimationFrame(tick);
  }
};

const onResize = () => {
  // Invalidate the setSlider write cache so the next tick re-applies values
  // even if numerically identical — measurements may have shifted underneath.
  lastLeft = NaN;
  lastWidth = NaN;
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

  // IntersectionObserver drives the activeSection ref — on mobile it's the
  // sole mechanism that highlights the current tab; on desktop it co-exists
  // with the sliding underline. The callback only fires on section change,
  // so it stays well off the scroll hot path.
  sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) activeSection.value = entry.target.id;
      });
    },
    { threshold: 0.5 },
  );
  SECTION_IDS.forEach((id) => {
    const el = document.getElementById(id);
    if (el) sectionObserver!.observe(el);
  });

  // Slider-related work is desktop-only. On mobile the slider element is
  // `display: none` and neither the rAF loop nor the scroll/resize/body
  // observers are registered — keeping the mobile scroll hot path empty.
  const isDesktop = window.matchMedia("(min-width: 640px)").matches;
  if (!isDesktop) return;

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
  sectionObserver?.disconnect();
  sectionObserver = null;
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
    <div
      class="absolute inset-0 z-0 [clip-path:polygon(0_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,12px_100%,0_calc(100%-12px))] bg-[#8D1D29] opacity-80"
    />

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
            :class="{ 'is-active': activeSection === 'home' }"
            @click.prevent="scrollToSection('home')"
          >
            Home
          </a>
          <a
            class="nav-link mb-2 cursor-pointer text-gray-200"
            :class="{ 'is-active': activeSection === 'ueber-mich' }"
            @click.prevent="scrollToSection('ueber-mich')"
          >
            Über mich
          </a>
          <a
            class="nav-link mb-2 cursor-pointer text-gray-200"
            :class="{ 'is-active': activeSection === 'was-ich-mache' }"
            @click.prevent="scrollToSection('was-ich-mache')"
          >
            Aktuell
          </a>
          <a
            class="nav-link mb-2 cursor-pointer text-gray-200"
            :class="{ 'is-active': activeSection === 'technologien' }"
            @click.prevent="scrollToSection('technologien')"
          >
            Skills
          </a>

          <!-- Sliding underline — desktop only; mobile uses the static per-tab
               underline on .nav-link.is-active (see <style>). transform written
               directly by the rAF loop. -->
          <div
            ref="sliderEl"
            class="sliding-line pointer-events-none absolute bottom-0 hidden h-[2px] bg-gray-200 sm:block"
          />
        </template>

        <!-- On all other pages (e.g. Impressum): show a back link instead -->
        <template v-else>
          <NuxtLink to="/" class="mb-2 cursor-pointer text-gray-200">
            Zurück
          </NuxtLink>
        </template>
      </nav>
    </div>
  </header>
</template>

<style scoped>
/* Sliding underline (desktop only). Visible width comes from scaleX on a 1px
   base, not from animating style.width — width is a layout-triggering CSS
   property and animating it per frame visibly conflicts with iOS momentum
   scrolling. A combined transform stays GPU-composited. */
.sliding-line {
  width: 1px;
  transform-origin: left center;
  will-change: transform;
}

/* Mobile-only static per-tab underline. Implemented via box-shadow so toggling
   `.is-active` doesn't reflow the nav. Hidden on desktop because the sliding
   underline takes over. */
.nav-link {
  box-shadow: 0 2px 0 transparent;
  transition: box-shadow 180ms ease;
}
.nav-link.is-active {
  box-shadow: 0 2px 0 #e5e7eb; /* gray-200 — matches the desktop sliding underline */
}
@media (min-width: 640px) {
  .nav-link,
  .nav-link.is-active {
    box-shadow: none;
    transition: none;
  }
}
</style>
