<template>
  <!-- Tech section: animated icon physics playground + info card grid -->
  <div
    id="technologien"
    class="relative mx-auto mb-36 w-full max-w-7xl sm:w-11/12"
  >
    <div
      class="relative z-10 flex w-full flex-col items-center px-4 py-6 sm:px-9 sm:py-9"
    >
      <div class="relative w-full">
        <!-- Decorative offset shadow layers (light/dark mode aware) -->
        <div
          class="absolute inset-0 w-full translate-x-1.5 translate-y-1.5 rounded-xl border border-[#3b4245] bg-white opacity-80 dark:border-white dark:bg-[#3b4245]"
        />
        <div
          class="absolute inset-0 w-full -translate-x-1.5 -translate-y-1.5 rounded-xl border border-[#3b4245] bg-[#8D1D29] opacity-80 dark:border-white"
        />
        <div class="relative z-10 flex flex-col p-6 sm:justify-center">
          <h3
            class="self-center text-center pb-3 text-2xl text-gray-200 sm:text-3xl md:text-4xl lg:text-5xl"
          >
            Was ich aktuell mache?
          </h3>
          <p
            class="text-left text-xs text-gray-200 py-3 sm:text-sm md:text-base lg:text-xl"
          >
            Als Fachinformatiker für Anwendungsentwicklung arbeite ich täglich
            an realen Projekten – von der Planung über die Umsetzung bis hin zur
            Wartung. In meiner Ausbildungszeit und darüber hinaus habe ich ein
            breites technisches Fundament aufgebaut, das ich seitdem
            kontinuierlich erweitere.
          </p>
          <p
            class="text-left text-xs text-gray-200 py-3 sm:text-sm md:text-base lg:text-xl"
          >
            Mein Schwerpunkt liegt in der PHP Backend-Entwicklung – beruflich
            hauptsächlich mit Symfony, privat mit Laravel. Im Frontend setze ich
            primär auf Vue.js, ergänzt durch TypeScript und CSS-Frameworks wie
            Tailwind CSS und Bootstrap. Für mobile Anwendungen bringe ich zudem
            Erfahrung mit React Native mit. Diese Kombination ermöglicht es mir,
            Projekte ganzheitlich zu denken und als Fullstack-Entwickler
            umzusetzen. KI-Tools wie Claude Code setze ich dabei bewusst als
            Kooperationspartner ein – nicht als Ersatz für eigenes Denken,
            sondern um effizienter und zielgerichteter zu arbeiten.
          </p>

          <!-- Animated icon container — rAF loop positions icons inside this element -->
          <div ref="container" class="relative my-6 overflow-hidden">
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

            <!-- Info bar: toggle button + disclaimer text -->
            <div class="info-bar">
              <button
                class="info-btn"
                :class="{
                  active: infoMode,
                  'pulse-hint': pulseHint && !infoMode,
                }"
                :aria-label="
                  infoMode ? 'Animation fortsetzen' : 'Technologien anzeigen'
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
          <p
            class="text-left text-xs text-gray-200 py-3 sm:text-sm md:text-base lg:text-xl"
          >
            Containerisierung mit Docker, Versionskontrolle mit Git,
            CI/CD-Pipelines und Datenbankarbeit mit MySQL gehören für mich zum
            Alltag. Ich halte mich ständig auf dem neuesten Stand – ob neue
            Frameworks, Deployment-Konzepte oder moderne Entwicklungsworkflows.
          </p>
          <p
            class="text-left text-xs text-gray-200 py-3 sm:text-sm md:text-base lg:text-xl"
          >
            In meiner Zeit als Softwareentwickler habe ich meine Leidenschaft
            für diesen Beruf voll entdeckt. Für mich vereint er perfekt meine
            Neugier, mein logisches Denken und mein technisches Verständnis. Die
            Möglichkeit, komplexe Probleme zu lösen, kreative Lösungen zu
            entwickeln und dabei ständig dazuzulernen, erfüllt mich und macht
            diesen Beruf zu meiner idealen Berufung. Hier kann ich meine
            Wissbegierde ausleben und gleichzeitig mein technisches Know-how in
            Projekten anwenden, die sowohl herausfordernd als auch bereichernd
            sind.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, nextTick, ref } from "vue";

// --- Physics constants ---
const ICON_SIZE = 32; // icon width/height in pixels
const ICON_HALF = ICON_SIZE / 2;
const BASE_SPEED = 1.5; // initial velocity magnitude (px/frame)
const FLEE_RADIUS = 120; // distance at which icons start fleeing the pointer (px)
const FLEE_RADIUS_SQ = FLEE_RADIUS * FLEE_RADIUS; // squared to avoid Math.sqrt in the hot loop
const FLEE_FORCE = 5; // acceleration applied when the pointer is inside FLEE_RADIUS
const DAMPING = 0.92; // velocity multiplier per frame (< 1 simulates friction)
const MIN_SPEED = 0.8; // prevents icons from coming to a complete stop

// All technology icons (filenames without extension, matching /public/icons/)
const iconNames = [
  "anthropic",
  "apple",
  "bootstrap",
  "css3",
  "docker",
  "git",
  "github",
  "gitlab",
  "html5",
  "javascript",
  "jetbrains",
  "laravel",
  "linux",
  "mariadb",
  "mysql",
  "nuxtdotjs",
  "openai",
  "php",
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
  css3: "CSS3",
  docker: "Docker",
  git: "Git",
  github: "GitHub",
  gitlab: "GitLab",
  html5: "HTML5",
  javascript: "JavaScript",
  jetbrains: "JetBrains",
  laravel: "Laravel",
  linux: "Linux",
  mariadb: "MariaDB",
  mysql: "MySQL",
  nuxtdotjs: "Nuxt.js",
  openai: "OpenAI",
  php: "PHP",
  symfony: "Symfony",
  tailwindcss: "Tailwind CSS",
  typescript: "TypeScript",
  visualstudiocode: "VS Code",
  vite: "Vite",
  vuedotjs: "Vue.js",
};

/** Per-icon physics state — updated on every animation frame */
interface IconState {
  x: number; // center X position within container (px)
  y: number; // center Y position within container (px)
  vx: number; // horizontal velocity (px/frame)
  vy: number; // vertical velocity (px/frame)
}

// --- Vue refs ---
const container = ref<HTMLElement | null>(null); // the overflow:hidden animation canvas
const animatedElements = ref<HTMLElement[]>([]); // one DOM element per icon (filled by v-for :ref)
const infoMode = ref(false); // true = static grid layout, false = physics animation
const pulseHint = ref(false); // triggers the one-time CSS pulse on the info button

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
 * Uses as many columns as fit while respecting MIN_CARD_W, with a minimum of 2.
 */
const computeGrid = () => {
  gridCols = Math.max(
    2,
    Math.floor(
      (containerW - CARD_PAD * 2 + CARD_GAP) / (MIN_CARD_W + CARD_GAP),
    ),
  );
  gridCardW = Math.floor(
    (containerW - CARD_PAD * 2 - (gridCols - 1) * CARD_GAP) / gridCols,
  );
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
      const col = index % gridCols;
      const row = Math.floor(index / gridCols);
      const tx = CARD_PAD + col * (gridCardW + CARD_GAP);
      const ty = INFO_BAR_H + CARD_PAD + row * (CARD_H + CARD_GAP);
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
      if (isVisible && rafId === null) rafId = requestAnimationFrame(tick);
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
let isVisible = false; // tracks whether the section is in the viewport (IntersectionObserver)

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
 * Ensures an icon never fully stops moving.
 * If speed drops below MIN_SPEED, velocity is scaled up (or a random direction is assigned
 * if the icon is completely stationary).
 */
const ensureMinSpeed = (state: IconState) => {
  const speed = Math.sqrt(state.vx * state.vx + state.vy * state.vy);
  if (speed < MIN_SPEED) {
    if (speed === 0) {
      const angle = Math.random() * Math.PI * 2;
      state.vx = Math.cos(angle) * MIN_SPEED;
      state.vy = Math.sin(angle) * MIN_SPEED;
    } else {
      const factor = MIN_SPEED / speed;
      state.vx *= factor;
      state.vy *= factor;
    }
  }
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

    // Flee: push icon away from pointer if it is within FLEE_RADIUS
    const dx = state.x - pointerX;
    const dy = state.y - pointerY;
    const distSq = dx * dx + dy * dy;

    if (distSq < FLEE_RADIUS_SQ && distSq > 0) {
      const dist = Math.sqrt(distSq);
      // Force is proportional to proximity: strongest at distance 0, zero at FLEE_RADIUS
      const force = (1 - dist / FLEE_RADIUS) * FLEE_FORCE;
      state.vx += (dx / dist) * force;
      state.vy += (dy / dist) * force;
    }

    // Integrate velocity
    state.x += state.vx;
    state.y += state.vy;

    // Bounce off left/right walls
    if (state.x < ICON_HALF) {
      state.x = ICON_HALF;
      state.vx = Math.abs(state.vx);
    } else if (state.x > containerW - ICON_HALF) {
      state.x = containerW - ICON_HALF;
      state.vx = -Math.abs(state.vx);
    }
    // Bounce off top/bottom walls
    if (state.y < ICON_HALF) {
      state.y = ICON_HALF;
      state.vy = Math.abs(state.vy);
    } else if (state.y > containerH - ICON_HALF) {
      state.y = containerH - ICON_HALF;
      state.vy = -Math.abs(state.vy);
    }

    state.vx *= DAMPING;
    state.vy *= DAMPING;
    ensureMinSpeed(state);

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

  // ResizeObserver: update container dimensions and clamp icon positions on layout changes
  resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      containerW = entry.contentRect.width;
      applyContainerHeight();
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
  });
  resizeObserver.observe(container.value);

  // IntersectionObserver: pause the rAF loop while the section is off-screen
  // to avoid wasting CPU on animation that nobody can see
  let hasPulsed = false;
  intersectionObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        isVisible = entry.isIntersecting;
        if (isVisible && !infoMode.value && rafId === null) {
          // Section entered viewport — start animating
          animatedElements.value.forEach((el) =>
            (el as HTMLElement)?.classList.add("animating"),
          );
          rafId = requestAnimationFrame(tick);
        } else if (!isVisible && rafId !== null) {
          // Section left viewport — stop animating
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        // Trigger the one-time button pulse hint when section first scrolls into view
        if (isVisible && !hasPulsed) {
          hasPulsed = true;
          setTimeout(() => {
            pulseHint.value = true;
            setTimeout(() => {
              pulseHint.value = false;
            }, 2400);
          }, 800);
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

/* One-time pulse animation to draw attention to the info button on first scroll into view */
@keyframes pulse-hint {
  0%,
  100% {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.25);
    box-shadow: none;
  }
  50% {
    background: rgba(255, 255, 255, 0.35);
    border-color: rgba(255, 255, 255, 0.7);
    box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.15);
  }
}

.info-btn.pulse-hint {
  animation: pulse-hint 0.8s ease-in-out 3;
}

.info-disclaimer {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  pointer-events: none;
  line-height: 1.3;
}
</style>
