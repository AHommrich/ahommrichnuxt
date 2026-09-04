<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";

type ModuleKey = "frontend" | "mobile" | "backend" | "db" | "ops";

interface SceneModule {
  key: ModuleKey;
  title: string;
  text: string;
}

// Master list — drives both render order in the SVG and the detail overlay
// content. Keep keys identical to the <g> data-key attributes.
const MODULES: ReadonlyArray<SceneModule> = [
  {
    key: "frontend",
    title: "Website (Frontend)",
    text: "Alles, was Sie im Browser sehen und anklicken: Texte, Bilder, Buttons und Formulare. Die sichtbare Oberfläche der Anwendung. Sie wird aus dem Netz geladen und läuft ohne Installation direkt im Browser.",
  },
  {
    key: "mobile",
    title: "App (Mobile)",
    text: "Wird direkt aufs Smartphone installiert: Touch-Bedienung, kleine Bildschirme, Zugriff auf Kamera, GPS und Sensoren. Funktioniert auch ohne Internet und liegt jederzeit griffbereit auf dem Homescreen.",
  },
  {
    key: "backend",
    title: "Backend (Maschinenraum)",
    text: "Der unsichtbare Motor. Hier wird gerechnet, geprüft und entschieden, etwa Anmeldungen, Berechtigungen und Abläufe. Dazu kommen Hintergrund-Aufgaben wie Mails oder Schnittstellen. Nutzer sehen ihn nie, ohne ihn läuft aber nichts.",
  },
  {
    key: "db",
    title: "Datenbank (Archiv)",
    text: "Der sichere Ort, an dem alle Daten dauerhaft liegen: Konten, Inhalte und Einstellungen. Beim nächsten Login ist alles wieder da, auch nach einem Neustart, einem Update oder von einem anderen Gerät aus.",
  },
  {
    key: "ops",
    title: "Deployment, Hosting & Versionierung",
    text: "Liegt über allem: Code wird versioniert (jederzeit zurück zu früheren Ständen), auf Servern betrieben (Hosting) und ohne Ausfall live geschaltet (Deployment). So bleibt das System erreichbar und veränderbar.",
  },
];

const stageEl = ref<HTMLElement | null>(null);
const moduleRefs = ref<Partial<Record<ModuleKey, SVGGElement>>>({});

// Currently selected module key, null when the scene is in its idle state.
const activeKey = ref<ModuleKey | null>(null);
// CSS transform applied to the active <g>; computed in viewBox units so it
// lines up with the absolute corner-target regardless of container size.
const activeTransform = ref<string>("");
// True while a closing animation is in flight. The active module keeps its
// .is-active class (so the 0.85s transform transition keeps applying), but
// the stage drops out of detail-open so the rest of the scene fades back in.
const isReversing = ref(false);
// Match the duration of .module.is-active's transform transition.
const REVERSE_MS = 850;
// Driven by IntersectionObserver — gates the idle animations so they only run
// while the section is visible. Sticky after the first hit to avoid restart
// stutter when scrolling back into view.
const isLive = ref(false);

const activeModule = computed(
  () => MODULES.find((m) => m.key === activeKey.value) ?? null,
);

// Vue function-ref helper — records the SVGGElement for each module by key.
function setModuleRef(key: ModuleKey) {
  return (el: unknown) => {
    moduleRefs.value[key] = el instanceof SVGGElement ? el : undefined;
  };
}

// Target corner box for the flying module (in SVG viewBox units).
// Mobile: unchanged from the original design — looks good as-is.
// Desktop (>=768px): larger so the detail view feels filled out instead of
// leaving most of the reserved aspect-ratio stage empty.
const FLIP_MOBILE = { mx: 50, my: 50, w: 240, h: 130 };
const FLIP_DESKTOP = { mx: 60, my: 70, w: 380, h: 200 };

function select(key: ModuleKey) {
  const g = moduleRefs.value[key];
  if (!g) return;
  const bbox = g.getBBox();
  if (bbox.height === 0 || bbox.width === 0) return;
  // Pick the box matching the current viewport — keeps mobile pixel-identical
  // to the original layout, while desktop gets the larger detail composition.
  const cfg =
    typeof window !== "undefined" && window.innerWidth >= 768
      ? FLIP_DESKTOP
      : FLIP_MOBILE;
  // "fit-in" so wide modules (ops band) and narrow modules (mobile) both end
  // up with comparable visual weight in the corner without overflowing.
  const s = Math.min(cfg.w / bbox.width, cfg.h / bbox.height);
  const tx = cfg.mx - bbox.x * s;
  const ty = cfg.my - bbox.y * s;
  activeTransform.value = `translate(${tx}px, ${ty}px) scale(${s})`;
  activeKey.value = key;
  // Keep focus on the active module so Enter/Space toggles it back closed.
  nextTick(() => moduleRefs.value[key]?.focus());
}

let reverseTimer: ReturnType<typeof setTimeout> | null = null;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
  );
}

function reset() {
  if (activeKey.value === null || isReversing.value) return;
  const previous = activeKey.value;
  // Reduced-motion: skip the reverse animation entirely.
  if (prefersReducedMotion()) {
    activeKey.value = null;
    activeTransform.value = "";
    nextTick(() => moduleRefs.value[previous]?.focus());
    return;
  }
  // Keep activeKey set so the .is-active class (and its 0.85s transform
  // transition) stay applied while the module flies back. The stage drops
  // out of detail-open so the rest of the scene fades back in concurrently.
  isReversing.value = true;
  activeTransform.value = "";
  reverseTimer = setTimeout(() => {
    activeKey.value = null;
    isReversing.value = false;
    reverseTimer = null;
    nextTick(() => moduleRefs.value[previous]?.focus());
  }, REVERSE_MS);
}

// Click / Enter / Space on a module toggles its detail view. Replaces the
// previous one-way `select` → user clicks the icon again (or Esc) to close.
function activate(key: ModuleKey) {
  if (isReversing.value) return;
  if (activeKey.value === key) reset();
  else if (activeKey.value === null) select(key);
}

// While a detail is open, clicking anywhere on the stage (faded modules,
// background, conduits) closes it — only the explanation text and the active
// module itself absorb the click (the module has its own toggle handler).
function handleStageClick(e: MouseEvent) {
  if (activeKey.value === null || isReversing.value) return;
  const target = e.target as Element | null;
  if (target?.closest(".detail-content")) return;
  if (target?.closest(".back-btn")) return;
  // Click on any module (active or faded) is handled by the module's own
  // @click — don't double-process or we'd close immediately after opening.
  if (target?.closest(".node")) return;
  reset();
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === "Escape" && activeKey.value && !isReversing.value) {
    e.preventDefault();
    reset();
  }
}

let intersectionObserver: IntersectionObserver | null = null;

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
  if (stageEl.value && typeof IntersectionObserver !== "undefined") {
    intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isLive.value = true;
          intersectionObserver?.disconnect();
        }
      },
      { threshold: 0.01 },
    );
    intersectionObserver.observe(stageEl.value);
  } else {
    isLive.value = true;
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
  intersectionObserver?.disconnect();
  if (reverseTimer) clearTimeout(reverseTimer);
});
</script>

<template>
  <!--
    Interactive fullstack illustration. The white-only SVG sits directly on
    the burgundy card; the card background provides the contrast. Click /
    keyboard activates a module → it FLIPs into the top-left corner, the rest
    of the scene fades, and the HTML overlay reveals the explanation text.
  -->
  <div
    ref="stageEl"
    class="stage"
    :class="{
      'detail-open': activeKey !== null,
      'is-closing': isReversing,
    }"
    @click="handleStageClick"
  >
    <div class="scene" :class="{ 'is-live': isLive }">
      <svg
        viewBox="0 0 1200 770"
        role="img"
        aria-label="Interaktive Darstellung eines Fullstack-Systems: Website, App, Backend, Datenbank und Deployment-/Hosting-Schicht"
      >
        <!-- Overall headline — marks the whole illustration as "Fullstack-
             Entwicklung". Sits in the empty band above the ops bar. -->
        <text class="overall-label" x="600" y="22" text-anchor="middle">
          FULLSTACK-ENTWICKLUNG
        </text>

        <!-- Dashed droplines from the ops band down to frontend, backend, mobile -->
        <g class="ops-links">
          <path class="ops-link" d="M 250 108 V 205" />
          <path class="ops-link" d="M 600 108 V 405" />
          <path class="ops-link" d="M 890 108 V 198" />
        </g>

        <!-- Data conduits: faint background line + animated glow + travelling packet -->
        <g class="c-frontend">
          <path class="conduit" d="M 250 330 C 360 470, 470 470, 560 470" />
          <path
            class="conduit-glow"
            d="M 250 330 C 360 470, 470 470, 560 470"
          />
        </g>
        <g class="c-mobile">
          <path class="conduit" d="M 880 330 C 770 470, 690 470, 640 470" />
          <path
            class="conduit-glow"
            d="M 880 330 C 770 470, 690 470, 640 470"
          />
        </g>
        <g class="c-db">
          <!-- Routed out of the backend's LEFT edge (not bottom-center) so it
               clears the "Serveranwendung / API" label that sits below the
               rect. -->
          <path class="conduit" d="M 505 510 C 450 540, 420 600, 410 660" />
          <path
            class="conduit-glow"
            d="M 505 510 C 450 540, 420 600, 410 660"
          />
        </g>
        <!-- Travelling packets — driven by inline SVG <animateMotion>. Works
             in every modern browser (no offset-path quirks). Two per conduit,
             staggered half a period apart, so each line shows a continuous
             stream of glowing data dots. -->
        <circle class="packet" r="10">
          <animateMotion
            dur="4.5s"
            repeatCount="indefinite"
            path="M 250 330 C 360 470, 470 470, 560 470"
          />
        </circle>
        <circle class="packet" r="10">
          <animateMotion
            dur="4.5s"
            begin="-2.25s"
            repeatCount="indefinite"
            path="M 250 330 C 360 470, 470 470, 560 470"
          />
        </circle>
        <circle class="packet" r="10">
          <animateMotion
            dur="4.5s"
            begin="-0.9s"
            repeatCount="indefinite"
            path="M 880 330 C 770 470, 690 470, 640 470"
          />
        </circle>
        <circle class="packet" r="10">
          <animateMotion
            dur="4.5s"
            begin="-3.15s"
            repeatCount="indefinite"
            path="M 880 330 C 770 470, 690 470, 640 470"
          />
        </circle>
        <circle class="packet" r="10">
          <animateMotion
            dur="4.5s"
            begin="-1.5s"
            repeatCount="indefinite"
            path="M 505 510 C 450 540, 420 600, 410 660"
          />
        </circle>
        <circle class="packet" r="10">
          <animateMotion
            dur="4.5s"
            begin="-3.75s"
            repeatCount="indefinite"
            path="M 505 510 C 450 540, 420 600, 410 660"
          />
        </circle>

        <!-- OPS BAND — spans the full width, sits above everything else -->
        <g
          :ref="setModuleRef('ops')"
          data-key="ops"
          class="module m-ops node"
          :class="{
            'is-active': activeKey === 'ops',
            'is-other': activeKey !== null && activeKey !== 'ops',
          }"
          :style="activeKey === 'ops' ? { transform: activeTransform } : ''"
          :tabindex="activeKey !== null && activeKey !== 'ops' ? -1 : 0"
          :aria-expanded="activeKey === 'ops'"
          role="button"
          aria-label="Deployment, Hosting und Versionierung"
          @click="activate('ops')"
          @keydown.enter.prevent="activate('ops')"
          @keydown.space.prevent="activate('ops')"
        >
          <rect
            class="focus-ring"
            x="118"
            y="32"
            width="964"
            height="76"
            rx="16"
          />
          <rect class="body" x="130" y="40" width="940" height="60" rx="14" />
          <rect class="stroke" x="130" y="40" width="940" height="60" rx="14" />
          <g class="ops-graph">
            <path d="M 170 70 H 360" />
            <path d="M 230 70 C 260 70, 270 84, 300 84" />
          </g>
          <circle class="ops-dot" cx="190" cy="70" r="6" />
          <circle class="ops-dot" cx="230" cy="70" r="6" />
          <circle class="ops-dot" cx="300" cy="84" r="6" />
          <!-- Travelling packets along the ops commit-graph paths -->
          <circle class="ops-packet" r="6">
            <animateMotion
              dur="6s"
              repeatCount="indefinite"
              path="M 170 70 H 360"
            />
          </circle>
          <circle class="ops-packet" r="6">
            <animateMotion
              dur="6s"
              begin="-3s"
              repeatCount="indefinite"
              path="M 230 70 C 260 70, 270 84, 300 84"
            />
          </circle>
          <circle class="commit-head" cx="270" cy="70" r="7" />
          <text x="700" y="78" text-anchor="middle" font-size="20">
            Deployment, Hosting &amp; Versionierung
          </text>
        </g>

        <!-- FRONTEND — browser window -->
        <g
          :ref="setModuleRef('frontend')"
          data-key="frontend"
          class="module m-frontend node"
          :class="{
            'is-active': activeKey === 'frontend',
            'is-other': activeKey !== null && activeKey !== 'frontend',
          }"
          :style="
            activeKey === 'frontend' ? { transform: activeTransform } : ''
          "
          :tabindex="activeKey !== null && activeKey !== 'frontend' ? -1 : 0"
          :aria-expanded="activeKey === 'frontend'"
          role="button"
          aria-label="Website im Browser"
          @click="activate('frontend')"
          @keydown.enter.prevent="activate('frontend')"
          @keydown.space.prevent="activate('frontend')"
        >
          <rect
            class="focus-ring"
            x="120"
            y="195"
            width="260"
            height="170"
            rx="18"
          />
          <rect class="body" x="135" y="210" width="230" height="140" rx="12" />
          <rect
            class="stroke"
            x="135"
            y="210"
            width="230"
            height="140"
            rx="12"
          />
          <rect class="body2" x="135" y="210" width="230" height="30" rx="12" />
          <path class="stroke" d="M 135 240 H 365" />
          <circle class="browser-dot" cx="153" cy="225" r="4.5" />
          <circle class="browser-dot" cx="169" cy="225" r="4.5" />
          <circle class="browser-dot" cx="185" cy="225" r="4.5" />
          <rect class="body2" x="155" y="262" width="120" height="12" rx="6" />
          <rect class="body2" x="155" y="284" width="180" height="10" rx="5" />
          <rect class="body2" x="155" y="302" width="150" height="10" rx="5" />
          <text x="250" y="380" text-anchor="middle" font-size="18">
            Website
          </text>
          <text x="250" y="202" text-anchor="middle" class="tag">Frontend</text>
        </g>

        <!-- MOBILE — smartphone silhouette -->
        <g
          :ref="setModuleRef('mobile')"
          data-key="mobile"
          class="module m-mobile node"
          :class="{
            'is-active': activeKey === 'mobile',
            'is-other': activeKey !== null && activeKey !== 'mobile',
          }"
          :style="activeKey === 'mobile' ? { transform: activeTransform } : ''"
          :tabindex="activeKey !== null && activeKey !== 'mobile' ? -1 : 0"
          :aria-expanded="activeKey === 'mobile'"
          role="button"
          aria-label="App fürs Smartphone"
          @click="activate('mobile')"
          @keydown.enter.prevent="activate('mobile')"
          @keydown.space.prevent="activate('mobile')"
        >
          <rect
            class="focus-ring"
            x="828"
            y="190"
            width="124"
            height="200"
            rx="22"
          />
          <rect class="body" x="838" y="200" width="104" height="165" rx="18" />
          <rect
            class="stroke"
            x="838"
            y="200"
            width="104"
            height="165"
            rx="18"
          />
          <rect class="body2" x="852" y="222" width="76" height="92" rx="8" />
          <rect class="body2" x="852" y="324" width="40" height="10" rx="5" />
          <circle class="stroke" cx="890" cy="350" r="7" />
          <text x="890" y="395" text-anchor="middle" font-size="18">App</text>
          <text x="890" y="192" text-anchor="middle" class="tag">Frontend</text>
        </g>

        <!-- BACKEND — interlocking gears -->
        <g
          :ref="setModuleRef('backend')"
          data-key="backend"
          class="module m-backend node"
          :class="{
            'is-active': activeKey === 'backend',
            'is-other': activeKey !== null && activeKey !== 'backend',
          }"
          :style="activeKey === 'backend' ? { transform: activeTransform } : ''"
          :tabindex="activeKey !== null && activeKey !== 'backend' ? -1 : 0"
          :aria-expanded="activeKey === 'backend'"
          role="button"
          aria-label="Backend, der Maschinenraum"
          @click="activate('backend')"
          @keydown.enter.prevent="activate('backend')"
          @keydown.space.prevent="activate('backend')"
        >
          <rect
            class="focus-ring"
            x="492"
            y="398"
            width="216"
            height="160"
            rx="18"
          />
          <rect class="body" x="505" y="410" width="190" height="135" rx="14" />
          <rect
            class="stroke"
            x="505"
            y="410"
            width="190"
            height="135"
            rx="14"
          />
          <g class="gear gear-a">
            <circle class="body2" cx="565" cy="470" r="30" />
            <circle class="stroke" cx="565" cy="470" r="30" />
            <circle class="body" cx="565" cy="470" r="12" />
            <circle class="stroke" cx="565" cy="470" r="12" />
            <g class="stroke">
              <path d="M 565 432 v 12" />
              <path d="M 565 496 v 12" />
              <path d="M 527 470 h 12" />
              <path d="M 591 470 h 12" />
              <path d="M 538 443 l 9 9" />
              <path d="M 583 488 l 9 9" />
              <path d="M 592 443 l -9 9" />
              <path d="M 547 488 l -9 9" />
            </g>
          </g>
          <g class="gear gear-b">
            <circle class="body2" cx="635" cy="505" r="20" />
            <circle class="stroke" cx="635" cy="505" r="20" />
            <circle class="body" cx="635" cy="505" r="8" />
            <circle class="stroke" cx="635" cy="505" r="8" />
            <g class="stroke">
              <path d="M 635 481 v 8" />
              <path d="M 635 521 v 8" />
              <path d="M 611 505 h 8" />
              <path d="M 651 505 h 8" />
            </g>
          </g>
          <text x="600" y="402" text-anchor="middle" class="tag">Backend</text>
          <text x="600" y="575" text-anchor="middle" class="m-backend-label">
            Serveranwendung / API
          </text>
        </g>

        <!-- DATABASE — cylinder + pulsing top -->
        <g
          :ref="setModuleRef('db')"
          data-key="db"
          class="module m-db node"
          :class="{
            'is-active': activeKey === 'db',
            'is-other': activeKey !== null && activeKey !== 'db',
          }"
          :style="activeKey === 'db' ? { transform: activeTransform } : ''"
          :tabindex="activeKey !== null && activeKey !== 'db' ? -1 : 0"
          :aria-expanded="activeKey === 'db'"
          role="button"
          aria-label="Datenbank, das Archiv"
          @click="activate('db')"
          @keydown.enter.prevent="activate('db')"
          @keydown.space.prevent="activate('db')"
        >
          <rect
            class="focus-ring"
            x="320"
            y="600"
            width="180"
            height="170"
            rx="18"
          />
          <!-- All bodies first so opaque burgundy fills don't cover the
               middle dividing strokes drawn below. Each stroke now traces
               left-side + bottom-arc + right-side so the cylinder is closed. -->
          <ellipse class="body" cx="410" cy="625" rx="78" ry="20" />
          <path class="body" d="M 332 625 v 40 a 78 20 0 0 0 156 0 v -40 z" />
          <path class="body" d="M 332 665 v 40 a 78 20 0 0 0 156 0 v -40 z" />
          <ellipse class="stroke" cx="410" cy="625" rx="78" ry="20" />
          <path class="stroke" d="M 332 625 v 40 a 78 20 0 0 0 156 0 v -40" />
          <path class="stroke" d="M 332 665 v 40 a 78 20 0 0 0 156 0 v -40" />
          <ellipse class="db-pulse" cx="410" cy="625" rx="78" ry="20" />
          <text x="410" y="755" text-anchor="middle" font-size="18">
            Datenbank
          </text>
          <text x="410" y="597" text-anchor="middle" class="tag">Backend</text>
        </g>
      </svg>
    </div>

    <!-- Detail overlay — text appears under the flying icon (top-left corner). -->
    <div class="detail" aria-live="polite">
      <div class="detail-content">
        <h4 v-if="activeModule">{{ activeModule.title }}</h4>
        <p v-if="activeModule">{{ activeModule.text }}</p>
      </div>
    </div>

    <!-- Back button — sits to the right of the flown icon in detail mode.
         Click on the active icon, Esc, or this button all dismiss the detail. -->
    <button
      v-if="activeKey !== null"
      class="back-btn"
      type="button"
      aria-label="Zurück zur Übersicht"
      @click.stop="reset"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.4"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
      </svg>
      <span>Zurück</span>
    </button>
  </div>
</template>

<style scoped>
.stage {
  position: relative;
  width: 100%;
  /* Reserve room equal to the SVG's intrinsic aspect ratio (1200:770) so the
     absolute detail overlay has a stable height even before SVG paints. */
  aspect-ratio: 1200 / 770;
}
/* In detail mode the whole stage area acts as a "click to close" zone — except
   over the explanation text. The pointer hint reinforces that. */
.stage.detail-open {
  cursor: pointer;
}
.stage.detail-open .detail-content {
  cursor: auto;
}

.scene {
  position: relative;
  width: 100%;
}
.scene svg {
  width: 100%;
  height: auto;
  display: block;
  overflow: visible;
}

/* === Conduits & packets ============================================ */
.conduit {
  fill: none;
  stroke: rgba(255, 255, 255, 0.32);
  stroke-width: 5;
  stroke-linecap: round;
  opacity: 0;
  transition: opacity 0.5s ease;
}
.conduit-glow {
  fill: none;
  stroke: #ffffff;
  stroke-width: 3;
  stroke-linecap: round;
  opacity: 0;
  transition: opacity 0.5s ease;
}
.scene.is-live .conduit {
  opacity: 1;
  transition-delay: 0.45s;
}
.scene.is-live .conduit-glow {
  opacity: 0.6;
  transition-delay: 0.6s;
}

.ops-link {
  fill: none;
  stroke: rgba(255, 255, 255, 0.55);
  stroke-width: 2.5;
  stroke-dasharray: 4 7;
  opacity: 0;
  transition: opacity 0.5s ease;
}
.scene.is-live .ops-link {
  opacity: 0.6;
  transition-delay: 0.35s;
}

.packet {
  fill: #ffffff;
  /* Layered drop-shadow → reads as a luminous comet, not just a dot */
  filter: drop-shadow(0 0 6px rgba(255, 255, 255, 1))
    drop-shadow(0 0 18px rgba(255, 255, 255, 0.7));
  /* Motion is driven by inline SVG <animateMotion> children — no CSS path /
     keyframes here. Opacity stays at 1 by default; only the detail-open state
     hides packets (see .stage.detail-open .packet rule further down). */
  opacity: 1;
}

/* === Modules ======================================================= */
/* Opaque burgundy matches the card background so the module visually "cuts
   out" of the scene — conduits and packets running behind the module are
   hidden, instead of bleeding through a translucent fill. */
.module .body {
  fill: #8d1d29;
}
.module .body2 {
  fill: rgba(255, 255, 255, 0.18);
}
.module .stroke {
  stroke: #ffffff;
  stroke-width: 2.2;
  fill: none;
}
.module text {
  fill: #ffffff;
  font-weight: 600;
  letter-spacing: 0.01em;
}
.module .tag {
  fill: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
/* Backend module label sits BELOW the rect — same font size and spacing as
   the other module labels for visual consistency. The longer text extends a
   touch past the rect width, which is fine because labels sit outside it. */
.m-backend-label {
  fill: #ffffff;
  font-size: 18px;
  font-weight: 600;
}

/* Group headers — large uppercase "FRONTEND" / "BACKEND" labels above their
   respective module clusters. Lower contrast so they don't compete with the
   individual module labels. */
.group-label text {
  fill: rgba(255, 255, 255, 0.75);
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 0.32em;
  text-transform: uppercase;
}

/* Overall headline above the entire scene — frames the whole illustration as
   "Fullstack-Entwicklung". Sits in the empty band above the ops bar. */
.overall-label {
  fill: rgba(255, 255, 255, 0.9);
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.38em;
  text-transform: uppercase;
  transition: opacity 0.35s ease;
}

/* Module enter animation — slight rise on first appearance */
.module {
  opacity: 0;
  transform: translateY(14px);
  transition:
    opacity 0.6s ease,
    transform 0.5s cubic-bezier(0.2, 0.85, 0.25, 1);
  transform-box: view-box;
  transform-origin: 0 0;
}
.scene.is-live .module {
  opacity: 1;
  transform: translateY(0);
}
.scene.is-live .m-mobile {
  transition-delay: 0.12s;
}
.scene.is-live .m-backend {
  transition-delay: 0.24s;
}
.scene.is-live .m-db {
  transition-delay: 0.36s;
}

.node {
  cursor: pointer;
  outline: none;
  transition: filter 0.28s ease;
}
.module .body,
.module .body2 {
  transition: fill 0.28s ease;
}
/* Hover only in idle mode — once a module is open, the icon-in-corner shouldn't
   keep glowing as if hovered. */
.stage:not(.detail-open) .node:hover {
  filter: drop-shadow(0 0 22px rgba(255, 255, 255, 0.55));
}
.stage:not(.detail-open) .node:hover .body {
  fill: rgba(255, 255, 255, 0.14);
}
.stage:not(.detail-open) .node:hover .body2 {
  fill: rgba(255, 255, 255, 0.3);
}
.node:focus-visible .focus-ring {
  opacity: 1;
}
.focus-ring {
  fill: none;
  stroke: #ffffff;
  stroke-width: 3;
  opacity: 0;
}

/* OPS band specifics */
.ops-graph {
  fill: none;
  stroke: #ffffff;
  stroke-width: 3;
  stroke-linecap: round;
}
.ops-dot {
  fill: #ffffff;
}
.commit-head {
  fill: #8d1d29;
  stroke: #ffffff;
  stroke-width: 3;
}

/* Travelling packets along the ops commit-graph — motion driven by inline
   <animateMotion> in the SVG (no CSS path needed). */
.ops-packet {
  fill: #ffffff;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.95));
  opacity: 1;
}

/* Browser chrome dots — uniform white */
.browser-dot {
  fill: #ffffff;
  opacity: 0.85;
}

/* Gears */
.gear {
  transform-box: fill-box;
  transform-origin: center;
}
.scene.is-live .gear-a {
  animation: spin 6s linear infinite;
}
.scene.is-live .gear-b {
  animation: spin 4s linear infinite reverse;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* DB top — static highlight, no pulse */
.db-pulse {
  fill: #ffffff;
  opacity: 0.5;
}

/* === Detail-open state — fade siblings, FLIP active module ========= */
.stage.detail-open .conduit,
.stage.detail-open .conduit-glow,
.stage.detail-open .packet,
.stage.detail-open .ops-packet,
.stage.detail-open .ops-link,
.stage.detail-open .group-label,
.stage.detail-open .overall-label {
  opacity: 0;
  pointer-events: none;
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
}
/* Sibling modules shrink slightly while fading — gives a subtle "they're
   stepping back" motion instead of a flat opacity dip. */
.stage.detail-open .module.is-other {
  opacity: 0;
  pointer-events: none;
  transform: scale(0.92) translateY(8px);
  transform-box: fill-box;
  transform-origin: 50% 50%;
  transition:
    opacity 0.45s ease,
    transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.module.is-active {
  /* Expo-out easing: fast take-off, sleek settle — the icon feels "thrown"
     into the corner instead of mechanically translated. */
  transition: transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}

/* === Detail overlay ================================================ */
.detail {
  position: absolute;
  inset: 0;
  padding: clamp(20px, 4vw, 44px);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.4s ease;
}
.stage.detail-open .detail {
  /* Reserve interactive layer below the icon-row so the active SVG <g> in the
     top-left stays clickable (for click-to-close). The active module's FLIP
     transition runs ~0.85s — the text fades in afterwards so the sequence
     reads as "fly → land → read". */
  pointer-events: none;
  visibility: visible;
  opacity: 1;
  transition-delay: 0.6s;
}
/* During reverse: only the detail text and back button fade out immediately —
   the rest of the scene (conduits, packets, other modules) stays held back by
   .stage.detail-open until the active module has landed at T=0.85s. */
.stage.is-closing .detail {
  opacity: 0;
  visibility: visible;
  transition-delay: 0s;
}
.detail-content {
  /* Mobile / narrow: text sits BELOW the flying icon. Height fits its content
     (no `bottom` set) so empty area below the text is uncovered — clicks
     there fall through to the stage and trigger close.
     Icon corner ends near 23% of the stage height (viewBox y≈180 / 770);
     26% leaves a small breathing gap. */
  position: absolute;
  left: clamp(16px, 4vw, 44px);
  right: clamp(16px, 4vw, 44px);
  top: 26%;
  max-height: 70%;
  overflow-y: auto;
  pointer-events: auto;
}
.detail-content h4 {
  font-size: clamp(16px, 2vw, 22px);
  margin: 0 0 clamp(8px, 1.2vw, 14px);
  color: #ffffff;
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.01em;
}
.detail-content p {
  color: rgba(255, 255, 255, 0.92);
  line-height: 1.5;
  font-size: clamp(12px, 1.1vw, 14px);
  margin: 0;
  max-width: 65ch;
}

/* === Back button ===================================================
   Plain inline label — no pill / border / background. Sits to the right
   of the flown icon at the same vertical center (icon ends at viewBox
   x≈290 / 1200 ≈ 24.2%, midline y≈115 / 770 ≈ 15%). Whole stage doubles
   as a click-to-close target; this label just signals the affordance. */
.back-btn {
  position: absolute;
  top: 15%;
  left: calc(24.2% + 12px);
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  gap: clamp(6px, 0.8vw, 10px);
  padding: 0;
  background: transparent;
  border: 0;
  color: #ffffff;
  font-family: inherit;
  font-size: clamp(12px, 1.3vw, 15px);
  font-weight: 600;
  letter-spacing: 0.04em;
  cursor: pointer;
  z-index: 10;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.35s ease;
}
.stage.detail-open .back-btn {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transition-delay: 0.6s;
}
.stage.is-closing .back-btn {
  opacity: 0;
  visibility: visible;
  pointer-events: none;
  transition-delay: 0s;
}
.back-btn svg {
  flex-shrink: 0;
  transition: transform 0.2s ease;
}
.back-btn:hover svg,
.back-btn:focus-visible svg {
  transform: translateX(-2px);
}
.back-btn:focus-visible {
  outline: none;
  text-decoration: underline;
  text-underline-offset: 4px;
}

/* === Responsive overrides ==========================================
   Placed AFTER the global rules above so the media-query values actually
   win — same-specificity selectors otherwise lose to whatever is declared
   last in source order. */

/* Tablet / desktop: text sits to the RIGHT of the icon. On desktop the FLIP
   target grows (see FLIP_DESKTOP in the script), so the icon ends near
   viewBox x≈440 (≈36.7%); the text starts at 40%. Back button moves UNDER
   the icon — when the stage is squeezed (lg+ 2-col grid puts it at half
   width), a right-of-icon button would collide with the detail text. */
@media (min-width: 768px) {
  .detail-content {
    top: 10%;
    left: 40%;
    right: clamp(16px, 4vw, 44px);
    max-height: 84%;
  }
  .back-btn {
    top: 38%;
    left: 5%;
    transform: none;
  }
}

/* Larger headline / body only on real desktop (xl breakpoint). Between 768
   and 1279 the stage is often squeezed (half MacBook screen, lg 2-col grid
   below xl), so we keep the original type sizes there. */
@media (min-width: 1280px) {
  .detail-content h4 {
    font-size: clamp(18px, 2.2vw, 26px);
  }
  .detail-content p {
    font-size: clamp(13px, 1.2vw, 16px);
    max-width: 70ch;
  }
}

/* === Reduced motion ================================================ */
@media (prefers-reduced-motion: reduce) {
  .scene.is-live .gear-a,
  .scene.is-live .gear-b {
    animation: none !important;
  }
  .module {
    opacity: 1;
    transform: none;
    transition: none;
  }
  .module.is-active,
  .module.is-other {
    transition: none;
    transform: none;
  }
  .detail,
  .back-btn,
  .stage.detail-open .back-btn,
  .stage.detail-open .module.is-other,
  .stage.detail-open .conduit,
  .stage.detail-open .conduit-glow,
  .stage.detail-open .packet,
  .stage.detail-open .ops-packet,
  .stage.detail-open .ops-link,
  .stage.detail-open .group-label,
  .stage.detail-open .overall-label {
    transition: none !important;
  }
}
</style>
