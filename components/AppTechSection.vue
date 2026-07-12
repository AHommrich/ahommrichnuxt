<template>
  <!-- Tech section: animated icon physics playground + info card grid -->
  <div
    id="technologien"
    class="relative mx-auto mb-12 w-full max-w-7xl sm:w-11/12"
  >
    <div
      class="relative z-10 flex w-full flex-col items-center px-4 py-6 sm:px-9 sm:py-9"
    >
      <AppCard content-class="p-6">
        <h3
          class="self-center pb-3 text-center text-2xl text-gray-200 sm:text-3xl md:text-4xl lg:text-5xl"
        >
          Womit ich arbeite
        </h3>

        <!--
          Two-column layout (md+): text left, animation right.
          Default flex `items-stretch` lets the animation column match the
          taller text column's height; the inner flex centres the fixed-height
          animation container within that space.
          Mobile: stacked — animation rendered first (order-1) so the
          eye-catcher appears above the text in the reading flow.
        -->
        <div class="flex flex-col md:flex-row md:gap-8 lg:gap-12">
          <!-- Text column — md+: left half, vertically centered to balance against the animation column -->
          <div
            class="order-2 flex flex-col md:order-1 md:w-1/2 md:justify-center"
          >
            <p
              class="py-3 text-left text-xs text-gray-200 sm:text-sm md:text-base lg:text-xl"
            >
              Mein Schwerpunkt liegt in der PHP Backend-Entwicklung – beruflich
              mit Symfony, privat mit Laravel. Im Frontend setze ich primär auf
              Vue.js, ergänzt durch TypeScript und CSS-Frameworks wie Tailwind
              CSS und Bootstrap. Für mobile Anwendungen bringe ich zudem
              Erfahrung mit React Native mit. Diese Kombination ermöglicht es
              mir, Projekte ganzheitlich zu denken und als Fullstack-Entwickler
              umzusetzen. KI-Tools wie Claude Code setze ich dabei bewusst als
              Kooperationspartner ein – nicht als Ersatz für eigenes Denken,
              sondern um effizienter und zielgerichteter zu arbeiten.
            </p>
            <p
              class="py-3 text-left text-xs text-gray-200 sm:text-sm md:text-base lg:text-xl"
            >
              Containerisierung mit Docker, Versionskontrolle mit Git,
              CI/CD-Pipelines und Datenbankarbeit mit MySQL gehören für mich zum
              Alltag. Ich halte mich ständig auf dem neuesten Stand – ob neue
              Frameworks, Deployment-Konzepte oder moderne
              Entwicklungsworkflows.
            </p>
          </div>

          <!-- Animation column — md+: right half, stretches to text height -->
          <div
            class="order-1 flex items-center justify-center md:order-2 md:w-1/2"
          >
            <!-- Animated icon container — rAF loop positions icons inside this element -->
            <div ref="container" class="relative my-6 w-full overflow-hidden">
              <!-- One wrapper per icon; positioned absolutely via JS transform -->
              <div
                v-for="(name, index) in iconNames"
                :key="name"
                :ref="(el) => ((animatedElements as any)[index] = el)"
                class="icon-wrapper"
              >
                <!-- SVG icon rendered as solid white via CSS filter -->
                <img
                  :src="`/icons/${name}.svg`"
                  :alt="iconLabels[name]"
                  class="h-8 w-8 shrink-0 icon-white"
                />
                <!-- Label only visible in info mode (v-show keeps DOM stable during transition) -->
                <span v-show="infoMode" class="icon-label-inline">{{
                  iconLabels[name]
                }}</span>
              </div>

              <!--
                Info bar: toggle button + disclaimer text.
                The button stays available under prefers-reduced-motion so the
                user can opt into the animation manually; only the pulse's
                scale change is dropped (see CSS).
              -->
              <div class="info-bar">
                <button
                  class="info-btn"
                  :class="{
                    active: infoMode,
                    'pulse-hint': pulseHint,
                  }"
                  :aria-label="
                    infoMode ? 'Animation starten' : 'Technologien anzeigen'
                  "
                  @click="toggleInfoMode"
                >
                  <!-- Inline info (ℹ) icon — SVG to avoid FontAwesome client-only constraint -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    style="flex-shrink: 0"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="8.5" />
                    <line x1="12" y1="12" x2="12" y2="16" />
                  </svg>
                  <span class="info-btn-label">{{
                    infoMode ? "Animation" : "Technologien"
                  }}</span>
                </button>
                <span v-show="infoMode" class="info-disclaimer"
                  >Eine Auswahl an Tools &amp; Technologien, die ich regelmäßig
                  einsetze.</span
                >
              </div>
            </div>
          </div>
        </div>
      </AppCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, nextTick, ref } from "vue";
import {
  applyDamping,
  applyFleeForce,
  bounceOffBounds,
  computeGridDimensions,
  computeInfoGridPosition,
  ensureMinSpeed,
} from "~/utils/animation";
import type { IconState } from "~/utils/animation";

// --- Physics constants ---
// Values are tuned empirically so icons stay visibly reactive to the pointer
// without spiralling into chaos: FLEE_FORCE injects energy near the pointer,
// DAMPING bleeds it off, MIN_SPEED prevents damping from ever freezing an icon.
// Changing one usually requires re-tuning the others.
const ICON_SIZE = 32; // icon width/height in pixels
const ICON_HALF = ICON_SIZE / 2;
const BASE_SPEED = 1.5; // initial velocity magnitude (px/frame)
const FLEE_RADIUS = 120; // pointer proximity at which flee kicks in — chosen large enough to feel responsive on desktop, small enough that mobile taps don't repel the whole grid
const FLEE_FORCE = 5; // per-frame acceleration inside FLEE_RADIUS — high enough for a noticeable dodge, low enough that DAMPING can absorb it within ~1s
const DAMPING = 0.92; // per-frame velocity multiplier (< 1). Without it, sustained pointer pressure would compound flee forces and icons would fly out of the container
const MIN_SPEED = 0.8; // floor enforced after DAMPING so icons never fully stop and the section always looks alive

// All technology icons (filenames without extension, matching /public/icons/)
const iconNames = [
  "anthropic",
  "apple",
  "bootstrap",
  "coolify",
  "docker",
  "expo",
  "git",
  "github",
  "githubactions",
  "gitlab",
  "inertia",
  "javascript",
  "jetbrains",
  "laravel",
  "linux",
  "mariadb",
  "mysql",
  "nuxtdotjs",
  "openai",
  "php",
  "react",
  "sentry",
  "symfony",
  "tailwindcss",
  "typescript",
  "visualstudiocode",
  "vite",
  "vuedotjs",
];

// Human-readable display labels shown on info mode cards
const iconLabels: Record<string, string> = {
  anthropic: "Anthropic (Claude)",
  apple: "Apple Eco System",
  bootstrap: "Bootstrap",
  coolify: "Coolify",
  docker: "Docker",
  expo: "Expo",
  git: "Git",
  github: "GitHub",
  githubactions: "GitHub Actions",
  gitlab: "GitLab",
  inertia: "Inertia.js",
  javascript: "JavaScript",
  jetbrains: "JetBrains",
  laravel: "Laravel",
  linux: "Linux",
  mariadb: "MariaDB",
  mysql: "MySQL",
  nuxtdotjs: "Nuxt.js",
  openai: "OpenAI (GPT)",
  php: "PHP",
  react: "React Native",
  sentry: "Sentry",
  symfony: "Symfony",
  tailwindcss: "Tailwind CSS",
  typescript: "TypeScript",
  visualstudiocode: "VS Code",
  vite: "Vite",
  vuedotjs: "Vue.js",
};

// --- Vue refs ---
const container = ref<HTMLElement | null>(null); // the overflow:hidden animation canvas
const animatedElements = ref<HTMLElement[]>([]); // one DOM element per icon (filled by v-for :ref)
// Default to info-list view so first-time visitors aren't dropped into a busy animation;
// the pulsing button invites them to start the physics view.
const infoMode = ref(true); // true = static grid layout, false = physics animation
const isVisible = ref(false); // tracks viewport visibility (driven by IntersectionObserver below)
// Continuous pulse on the toggle button while the list is shown and the section is in view.
// Kept active even under prefers-reduced-motion — the reduce override in the CSS
// keyframes drops just the scale change, so users can still notice the button.
const pulseHint = computed(() => infoMode.value && isVisible.value);

// --- Info-mode grid layout constants ---
const MIN_CARD_W = 160; // minimum card width — guarantees readable label text
const CARD_H = 40; // fixed card height in info mode
const CARD_GAP = 8; // gap between cards (both axes)
const CARD_PAD = 4; // inner padding of the grid area

// Computed once per layout pass, reused by applyContainerHeight and toggleInfoMode
let gridCols = 2;
let gridCardW = MIN_CARD_W;

/**
 * Recalculates the grid column count and card width based on the current container width.
 * Delegates the pure math to computeGridDimensions so it can be unit-tested.
 */
const computeGrid = () => {
  const dims = computeGridDimensions(
    containerW,
    MIN_CARD_W,
    CARD_GAP,
    CARD_PAD,
  );
  gridCols = dims.cols;
  gridCardW = dims.cardW;
};

/**
 * Places every icon directly into its grid cell with no transition — used at
 * mount time when the default view is the info list. Avoids the staggered
 * fly-in animation that the toggle handler runs.
 */
const applyInfoLayoutInstant = () => {
  if (!container.value) return;
  computeGrid();
  container.value.style.setProperty("--card-w", `${gridCardW}px`);
  animatedElements.value.forEach((el, index) => {
    const e = el as HTMLElement;
    if (!e) return;
    e.classList.remove("animating");
    e.classList.add("info-card");
    e.style.transition = "none";
    e.style.transitionDelay = "";
    const { tx, ty } = computeInfoGridPosition(
      index,
      gridCols,
      gridCardW,
      CARD_H,
      CARD_GAP,
      CARD_PAD,
      INFO_BAR_H,
    );
    e.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    if (states[index]) {
      states[index].x = tx + ICON_HALF;
      states[index].y = ty + ICON_HALF;
    }
  });
};

/**
 * Switches between animation mode and info card grid mode.
 *
 * Entering info mode (4-step sequence to avoid layout conflicts during transition):
 *   1. Apply .info-card class + set CSS --card-w variable (no transition yet)
 *   2. Force a reflow so the width change is committed before transitions start
 *   3. Begin staggered transform transitions to grid positions
 *   4. Reveal text labels in the next rAF frame (avoids DOM mutation mid-transition)
 *
 * Exiting info mode:
 *   - Hide labels, remove .info-card, restore .animating, scatter icons, restart rAF loop
 */
const toggleInfoMode = () => {
  if (!infoMode.value) {
    // Stop the rAF loop before modifying DOM positions
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    resetPointer();

    computeGrid();
    container.value?.style.setProperty("--card-w", `${gridCardW}px`);

    // Step 1: switch to card layout without triggering a transition
    animatedElements.value.forEach((el) => {
      const e = el as HTMLElement;
      e.classList.remove("animating");
      e.style.transition = "none";
      e.style.transitionDelay = "";
      e.classList.add("info-card");
    });

    // Step 2: force reflow — without this the width change and transform animate simultaneously,
    // causing icons to briefly appear at their old (wrong) size
    void container.value?.offsetHeight;

    // Step 3: animate each icon to its grid position with a staggered delay
    iconNames.forEach((_, index) => {
      const el = animatedElements.value[index] as HTMLElement;
      if (!el) return;
      const { tx, ty } = computeInfoGridPosition(
        index,
        gridCols,
        gridCardW,
        CARD_H,
        CARD_GAP,
        CARD_PAD,
        INFO_BAR_H,
      );
      el.style.transitionDelay = `${index * 20}ms`;
      el.style.transition = "transform 0.3s ease-out";
      el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      // Sync physics state so resuming animation starts from the correct positions
      states[index].x = tx + ICON_HALF;
      states[index].y = ty + ICON_HALF;
    });

    // Step 4: show text labels after the current frame to avoid DOM mutation during transition
    requestAnimationFrame(() => {
      infoMode.value = true;
    });
  } else {
    // Exit info mode: hide labels, remove card styles, re-enable physics
    infoMode.value = false;
    nextTick(() => {
      animatedElements.value.forEach((el) => {
        const e = el as HTMLElement;
        e.classList.remove("info-card");
        e.style.transition = "none";
        e.style.transitionDelay = "";
        e.classList.add("animating");
      });
      // Randomise velocity directions so icons scatter from their grid positions
      iconNames.forEach((_, index) => {
        const angle = Math.random() * Math.PI * 2;
        states[index].vx = Math.cos(angle) * BASE_SPEED;
        states[index].vy = Math.sin(angle) * BASE_SPEED;
      });
      if (isVisible.value && rafId === null)
        rafId = requestAnimationFrame(tick);
    });
  }
};

// --- Mutable animation state (not reactive — updated every frame, no Vue reactivity overhead) ---
let states: IconState[] = []; // physics state for every icon
let containerW = 0; // container width in px (updated by ResizeObserver)
let containerH = 0; // container height in px (computed from grid rows)
let pointerX = -1000; // pointer X relative to container — starts far off-screen
let pointerY = -1000; // pointer Y relative to container — starts far off-screen
let rafId: number | null = null; // current requestAnimationFrame handle
let resizeObserver: ResizeObserver | null = null;
let intersectionObserver: IntersectionObserver | null = null;
// Document-relative container origin — cached so scroll/pointermove handlers need no layout reads
let containerDocTop = 0;
let containerDocLeft = 0;

const INFO_BAR_H = 52; // vertical space reserved at the top of the container for the button bar

/**
 * Calculates and sets the container height to fit the info-mode grid.
 * Also caches the container's document-relative position used by pointer coordinate conversion.
 * Called on mount and on every resize.
 */
const applyContainerHeight = () => {
  if (!container.value) return;
  computeGrid();
  const rows = Math.ceil(iconNames.length / gridCols);
  containerH =
    INFO_BAR_H + CARD_PAD * 2 + rows * CARD_H + (rows - 1) * CARD_GAP;
  container.value.style.height = `${containerH}px`;
  // Cache document-relative origin — getBoundingClientRect is expensive, so we only call it here
  // and on resize; current scroll offsets are applied later in getContainerPointerPos
  const rect = container.value.getBoundingClientRect();
  containerDocTop = rect.top + window.scrollY;
  containerDocLeft = rect.left + window.scrollX;
};

/**
 * Initialises a random physics state for every icon.
 * Each icon starts at a random position with a random velocity direction at BASE_SPEED.
 */
const initStates = () => {
  states = iconNames.map(() => {
    const angle = Math.random() * Math.PI * 2;
    return {
      x: ICON_HALF + Math.random() * (containerW - ICON_SIZE),
      y: ICON_HALF + Math.random() * (containerH - ICON_SIZE),
      vx: Math.cos(angle) * BASE_SPEED,
      vy: Math.sin(angle) * BASE_SPEED,
    };
  });
};

/**
 * Main animation loop — called every frame via requestAnimationFrame.
 * For each icon:
 *   1. Apply flee force if pointer is within FLEE_RADIUS
 *   2. Integrate velocity into position
 *   3. Bounce off container walls (reverse the relevant velocity component)
 *   4. Apply damping (friction)
 *   5. Enforce minimum speed
 *   6. Write the resulting transform directly to the DOM element
 */
const tick = () => {
  states.forEach((state, index) => {
    const el = animatedElements.value[index];
    if (!el) return;

    applyFleeForce(state, pointerX, pointerY, FLEE_RADIUS, FLEE_FORCE);

    // Integrate velocity
    state.x += state.vx;
    state.y += state.vy;

    bounceOffBounds(state, ICON_HALF, containerW, containerH);
    applyDamping(state, DAMPING);
    ensureMinSpeed(state, MIN_SPEED);

    // Position is center-based — subtract ICON_HALF to get the top-left origin for CSS transform
    el.style.transform = `translate3d(${state.x - ICON_HALF}px, ${state.y - ICON_HALF}px, 0)`;
  });

  rafId = requestAnimationFrame(tick);
};

/**
 * Converts viewport-relative client coordinates to container-relative coordinates.
 * Uses the cached document-relative container origin plus current scroll offset to avoid
 * calling getBoundingClientRect() on every pointer/touch event.
 */
const getContainerPointerPos = (clientX: number, clientY: number) => {
  pointerX = clientX - (containerDocLeft - window.scrollX);
  pointerY = clientY - (containerDocTop - window.scrollY);
};

/** Moves the virtual pointer far off-screen so no flee force is applied */
const resetPointer = () => {
  pointerX = -1000;
  pointerY = -1000;
};

/**
 * Pointer move handler — mouse only.
 * Touch events are handled separately because pointermove on mobile fires with
 * pointerType 'touch' and has different propagation behaviour than real mouse events.
 */
const handlePointerMove = (e: PointerEvent) => {
  if (e.pointerType === "mouse") getContainerPointerPos(e.clientX, e.clientY);
};

// Flag: true while a touch that started inside the container is still active
let touchInContainer = false;

/** Records touch start position and marks the touch as originating inside the container */
const handleTouchStart = (e: TouchEvent) => {
  touchInContainer = true;
  if (e.touches.length > 0)
    getContainerPointerPos(e.touches[0].clientX, e.touches[0].clientY);
};

/** Tracks the first touch point as it moves — only while touch started inside the container */
const handleTouchMove = (e: TouchEvent) => {
  if (!touchInContainer || e.touches.length === 0) return;
  getContainerPointerPos(e.touches[0].clientX, e.touches[0].clientY);
};

/** Resets pointer when touch ends or is cancelled */
const handleTouchEnd = () => {
  touchInContainer = false;
  resetPointer();
};

/** Resets pointer on page scroll to prevent icons from fleeing while the user scrolls past */
const handleScroll = () => {
  resetPointer();
};

onMounted(async () => {
  if (!container.value) return;

  await nextTick();
  containerW = container.value.getBoundingClientRect().width;
  applyContainerHeight();
  initStates();
  // Default view is the info list — set icons directly to grid positions without animation
  if (infoMode.value) applyInfoLayoutInstant();

  // ResizeObserver: update container dimensions and clamp icon positions on layout changes
  resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      containerW = entry.contentRect.width;
      applyContainerHeight();
      if (infoMode.value) {
        // Column count and card width may have changed with the new width —
        // reposition every card instantly, otherwise cards stay at stale
        // coordinates from the old grid and spill past the recalculated
        // (often shorter) container height, getting clipped by overflow:hidden.
        applyInfoLayoutInstant();
      } else {
        // Clamp icon positions to the new bounds so nothing escapes the container after resize
        states.forEach((state) => {
          state.x = Math.max(
            ICON_HALF,
            Math.min(containerW - ICON_HALF, state.x),
          );
          state.y = Math.max(
            ICON_HALF,
            Math.min(containerH - ICON_HALF, state.y),
          );
        });
      }
    }
  });
  resizeObserver.observe(container.value);

  // IntersectionObserver: pause the rAF loop while the section is off-screen
  // to avoid wasting CPU on animation that nobody can see
  intersectionObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        isVisible.value = entry.isIntersecting;
        if (isVisible.value && !infoMode.value && rafId === null) {
          // Section entered viewport — start animating
          animatedElements.value.forEach((el) =>
            (el as HTMLElement)?.classList.add("animating"),
          );
          rafId = requestAnimationFrame(tick);
        } else if (!isVisible.value && rafId !== null) {
          // Section left viewport — stop animating
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    },
    { threshold: 0 },
  );
  intersectionObserver.observe(container.value);

  // Attach pointer and touch event listeners to the container
  container.value.addEventListener("pointermove", handlePointerMove);
  container.value.addEventListener("pointerleave", resetPointer);
  container.value.addEventListener("touchstart", handleTouchStart, {
    passive: true,
  });
  container.value.addEventListener("touchmove", handleTouchMove, {
    passive: true,
  });
  container.value.addEventListener("touchend", handleTouchEnd);
  container.value.addEventListener("touchcancel", handleTouchEnd);
  // Global scroll listener to reset flee state while the user scrolls
  window.addEventListener("scroll", handleScroll, { passive: true });
});

// Clean up all observers and event listeners to prevent memory leaks on unmount
onBeforeUnmount(() => {
  if (rafId !== null) cancelAnimationFrame(rafId);
  resizeObserver?.disconnect();
  intersectionObserver?.disconnect();
  container.value?.removeEventListener("pointermove", handlePointerMove);
  container.value?.removeEventListener("pointerleave", resetPointer);
  container.value?.removeEventListener("touchstart", handleTouchStart);
  container.value?.removeEventListener("touchmove", handleTouchMove);
  container.value?.removeEventListener("touchend", handleTouchEnd);
  container.value?.removeEventListener("touchcancel", handleTouchEnd);
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
/* Base icon wrapper — absolutely positioned, sized to the icon */
.icon-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 32px;
  height: 32px;
}

/* Add will-change only while the rAF loop is running to avoid unnecessary compositing layers */
.icon-wrapper.animating {
  will-change: transform;
}

/* Info card layout: fixed height flex row with icon + label text */
.icon-wrapper.info-card {
  width: var(
    --card-w,
    160px
  ); /* --card-w is set dynamically from JS before the transition */
  height: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
}

.icon-label-inline {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 11px;
  color: white;
  pointer-events: none;
}

/* Render all SVG icons as solid white regardless of their original fill color */
.icon-white {
  filter: brightness(0) invert(1);
}

/* Absolutely positioned bar at the top of the container for the toggle button */
.info-bar {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 10;
}

.info-btn {
  flex-shrink: 0;
  height: 34px;
  padding: 0 12px 0 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: 17px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.25);
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease;
}

.info-btn:hover {
  background: rgba(255, 255, 255, 0.28);
  border-color: rgba(255, 255, 255, 0.45);
}

.info-btn.active {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

.info-btn-label {
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  letter-spacing: 0.01em;
}

/* Continuous pulse that highlights the toggle button while the info list is shown */
@keyframes pulse-hint {
  0%,
  100% {
    transform: scale(1);
    background: rgba(255, 255, 255, 0.18);
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
  50% {
    transform: scale(1.15);
    background: rgba(255, 255, 255, 0.42);
    border-color: rgba(255, 255, 255, 0.85);
    box-shadow: 0 0 0 8px rgba(255, 255, 255, 0.18);
  }
}

.info-btn.pulse-hint {
  animation: pulse-hint 1.4s ease-in-out infinite;
  transform-origin: center;
}

.info-disclaimer {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  pointer-events: none;
  line-height: 1.3;
}

/*
  Reduced motion: keep the pulse's colour/border/glow blink because it stays
  useful as a subtle visual cue, but drop the transform: scale change so the
  button doesn't grow. Users who want the full animation can still trigger it
  via the toggle.
*/
@media (prefers-reduced-motion: reduce) {
  @keyframes pulse-hint {
    0%,
    100% {
      background: rgba(255, 255, 255, 0.18);
      border-color: rgba(255, 255, 255, 0.3);
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
    }
    50% {
      background: rgba(255, 255, 255, 0.42);
      border-color: rgba(255, 255, 255, 0.85);
      box-shadow: 0 0 0 8px rgba(255, 255, 255, 0.18);
    }
  }
}
</style>
