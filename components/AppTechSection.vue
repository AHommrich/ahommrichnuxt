<template>
  <div
    id="technologien"
    class="relative mx-auto mb-36 w-full max-w-7xl sm:w-11/12"
  >
    <div
      class="relative z-10 flex w-full flex-col items-center sm:flex-row sm:px-9 sm:py-9"
    >
      <div class="relative w-[95%]">
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
            Als ausgebildeter Fachinformatiker für Anwendungsentwicklung arbeite
            ich täglich an realen Projekten – von der Planung über die Umsetzung
            bis hin zur Wartung. In meiner Ausbildungszeit und darüber hinaus
            habe ich ein breites technisches Fundament aufgebaut, das ich
            seitdem kontinuierlich erweitere.
          </p>
          <p
            class="text-left text-xs text-gray-200 py-3 sm:text-sm md:text-base lg:text-xl"
          >
            Mein Schwerpunkt liegt in der Backend-Entwicklung – beruflich
            hauptsächlich mit Symfony, privat mit Laravel. Im Frontend setze ich
            primär auf Vue.js, ergänzt durch TypeScript und CSS-Frameworks wie
            Tailwind CSS und Bootstrap. Für mobile Anwendungen bringe ich zudem
            Erfahrung mit React Native mit. Diese Kombination ermöglicht es mir,
            Projekte ganzheitlich zu denken und als Fullstack-Entwickler
            umzusetzen.
          </p>
          <div
            ref="container"
            class="relative my-6 overflow-hidden"
          >
            <div
              v-for="(name, index) in iconNames"
              :key="name"
              :ref="(el) => ((animatedElements as any)[index] = el)"
              class="icon-wrapper"
              :class="{ 'info-card': infoMode }"
            >
              <img
                :src="`/icons/${name}.svg`"
                :alt="iconLabels[name]"
                class="h-8 w-8 shrink-0 icon-white"
              />
              <span v-show="infoMode" class="icon-label-inline">{{ iconLabels[name] }}</span>
            </div>
            <button
              class="info-btn"
              :class="{ active: infoMode }"
              :aria-label="infoMode ? 'Animation fortsetzen' : 'Technologien anzeigen'"
              @click="toggleInfoMode"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="8.5" />
                <line x1="12" y1="12" x2="12" y2="16" />
              </svg>
            </button>
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

const ICON_SIZE = 32;
const ICON_HALF = ICON_SIZE / 2;
const BASE_SPEED = 1.5;
const FLEE_RADIUS = 120;
const FLEE_RADIUS_SQ = FLEE_RADIUS * FLEE_RADIUS;
const FLEE_FORCE = 5;
const DAMPING = 0.92;
const MIN_SPEED = 0.8;

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
  "mysql",
  "openai",
  "php",
  "symfony",
  "tailwindcss",
  "typescript",
  "visualstudiocode",
  "vuedotjs",
];

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
  mysql: "MySQL",
  openai: "OpenAI",
  php: "PHP",
  symfony: "Symfony",
  tailwindcss: "Tailwind CSS",
  typescript: "TypeScript",
  visualstudiocode: "VS Code",
  vuedotjs: "Vue.js",
};

interface IconState {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const container = ref<HTMLElement | null>(null);
const animatedElements = ref<HTMLElement[]>([]);
const infoMode = ref(false);

const MIN_CARD_W = 160; // minimum width — guarantees readable text
const CARD_H = 40;
const CARD_GAP = 8;
const CARD_PAD = 4;

// computed at layout time, used by both applyContainerHeight and toggleInfoMode
let gridCols = 2;
let gridCardW = MIN_CARD_W;

const computeGrid = () => {
  gridCols = Math.max(2, Math.floor((containerW - CARD_PAD * 2 + CARD_GAP) / (MIN_CARD_W + CARD_GAP)));
  gridCardW = Math.floor((containerW - CARD_PAD * 2 - (gridCols - 1) * CARD_GAP) / gridCols);
};

const toggleInfoMode = () => {
  if (!infoMode.value) {
    // 1. Stop animation first
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    animatedElements.value.forEach((el) => (el as HTMLElement)?.classList.remove("animating"));

    computeGrid();
    container.value?.style.setProperty("--card-w", `${gridCardW}px`);

    // 2. Write all transforms & transitions before Vue touches the DOM
    iconNames.forEach((_, index) => {
      const el = animatedElements.value[index] as HTMLElement;
      if (!el) return;
      const col = index % gridCols;
      const row = Math.floor(index / gridCols);
      const tx = CARD_PAD + col * (gridCardW + CARD_GAP);
      const ty = CARD_PAD + row * (CARD_H + CARD_GAP);
      el.style.transitionDelay = `${index * 25}ms`;
      el.style.transition = "transform 0.35s ease";
      el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      states[index].x = tx + ICON_HALF;
      states[index].y = ty + ICON_HALF;
    });

    // 3. Show labels after transforms are committed (next frame)
    requestAnimationFrame(() => {
      infoMode.value = true;
    });
  } else {
    // Hide labels first, then restart animation
    infoMode.value = false;
    nextTick(() => {
      iconNames.forEach((_, index) => {
        const el = animatedElements.value[index] as HTMLElement;
        if (!el) return;
        el.style.transition = "none";
        el.style.transitionDelay = "";
        el.classList.add("animating");
        const angle = Math.random() * Math.PI * 2;
        states[index].vx = Math.cos(angle) * BASE_SPEED;
        states[index].vy = Math.sin(angle) * BASE_SPEED;
      });
      rafId = requestAnimationFrame(tick);
    });
  }
};

let states: IconState[] = [];
let containerW = 0;
let containerH = 0;
let pointerX = -1000;
let pointerY = -1000;
let rafId: number | null = null;
let resizeObserver: ResizeObserver | null = null;
let cachedContainerLeft = 0;
let cachedContainerTop = 0;

const applyContainerHeight = () => {
  if (!container.value) return;
  computeGrid();
  const rows = Math.ceil(iconNames.length / gridCols);
  containerH = CARD_PAD * 2 + rows * CARD_H + (rows - 1) * CARD_GAP;
  container.value.style.height = `${containerH}px`;
  // update cached position
  const rect = container.value.getBoundingClientRect();
  cachedContainerLeft = rect.left;
  cachedContainerTop = rect.top;
};

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

const tick = () => {
  states.forEach((state, index) => {
    const el = animatedElements.value[index];
    if (!el) return;

    const dx = state.x - pointerX;
    const dy = state.y - pointerY;
    const distSq = dx * dx + dy * dy;

    if (distSq < FLEE_RADIUS_SQ && distSq > 0) {
      const dist = Math.sqrt(distSq);
      const force = (1 - dist / FLEE_RADIUS) * FLEE_FORCE;
      state.vx += (dx / dist) * force;
      state.vy += (dy / dist) * force;
    }

    state.x += state.vx;
    state.y += state.vy;

    if (state.x < ICON_HALF) {
      state.x = ICON_HALF;
      state.vx = Math.abs(state.vx);
    } else if (state.x > containerW - ICON_HALF) {
      state.x = containerW - ICON_HALF;
      state.vx = -Math.abs(state.vx);
    }
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

    el.style.transform = `translate3d(${state.x - ICON_HALF}px, ${state.y - ICON_HALF}px, 0)`;
  });

  rafId = requestAnimationFrame(tick);
};

const getContainerPointerPos = (clientX: number, clientY: number) => {
  pointerX = clientX - cachedContainerLeft;
  pointerY = clientY - cachedContainerTop;
};

const handleMouseMove = (e: MouseEvent) => {
  getContainerPointerPos(e.clientX, e.clientY);
};

const handleMouseLeave = () => {
  pointerX = -1000;
  pointerY = -1000;
};

const handleTouchMove = (e: TouchEvent) => {
  if (e.touches.length === 0) return;
  getContainerPointerPos(e.touches[0].clientX, e.touches[0].clientY);
};

const handleTouchEnd = () => {
  pointerX = -1000;
  pointerY = -1000;
};

onMounted(async () => {
  if (!container.value) return;

  await nextTick();
  const rect = container.value.getBoundingClientRect();
  containerW = rect.width;
  cachedContainerLeft = rect.left;
  cachedContainerTop = rect.top;
  applyContainerHeight();
  initStates();

  // keep cached position fresh on scroll
  window.addEventListener("scroll", () => {
    if (!container.value) return;
    const r = container.value.getBoundingClientRect();
    cachedContainerLeft = r.left;
    cachedContainerTop = r.top;
  }, { passive: true });

  resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      containerW = entry.contentRect.width;
      applyContainerHeight();
      states.forEach((state) => {
        state.x = Math.max(ICON_HALF, Math.min(containerW - ICON_HALF, state.x));
        state.y = Math.max(ICON_HALF, Math.min(containerH - ICON_HALF, state.y));
      });
    }
  });
  resizeObserver.observe(container.value);

  rafId = requestAnimationFrame(tick);

  container.value.addEventListener("mousemove", handleMouseMove);
  container.value.addEventListener("mouseleave", handleMouseLeave);
  container.value.addEventListener("touchmove", handleTouchMove, {
    passive: true,
  });
  container.value.addEventListener("touchend", handleTouchEnd);
});

onBeforeUnmount(() => {
  if (rafId !== null) cancelAnimationFrame(rafId);
  if (resizeObserver) resizeObserver.disconnect();
  if (container.value) {
    container.value.removeEventListener("mousemove", handleMouseMove);
    container.value.removeEventListener("mouseleave", handleMouseLeave);
    container.value.removeEventListener("touchmove", handleTouchMove);
    container.value.removeEventListener("touchend", handleTouchEnd);
  }
});
</script>

<style scoped>
.icon-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 32px;
  height: 32px;
}

.icon-wrapper.animating {
  will-change: transform;
}

.icon-wrapper.info-card {
  width: var(--card-w, 160px);
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

.icon-white {
  filter: brightness(0) invert(1);
}

.info-btn {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;
  z-index: 10;
}

.info-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.info-btn.active {
  background: rgba(255, 255, 255, 0.35);
}
</style>
