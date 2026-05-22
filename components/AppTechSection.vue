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
            class="relative m-8 hidden sm:flex min-h-32 items-center py-3 justify-center overflow-hidden lg:min-h-56"
          >
            <div
              v-for="(element, index) in elements"
              :key="index"
              :ref="(el) => ((animatedElements as any)[index] = el)"
              class="absolute-anime flex h-12 w-12 items-center justify-center"
            >
              <img
                :src="`/icons/${element.icon}.svg`"
                :alt="element.icon"
                class="h-8 w-8 icon-white"
              />
            </div>
          </div>
          <div class="flex flex-wrap sm:hidden justify-center gap-4 py-3">
            <div v-for="(element, index) in elements" :key="index" class="flex">
              <img
                :src="`/icons/${element.icon}.svg`"
                :alt="element.icon"
                class="h-8 w-8 icon-white"
              />
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
import { gsap } from "gsap";
import { nextTick, onMounted, ref, onBeforeUnmount } from "vue";

const globalSpeed = ref(5); // global animation speed
const globalMaxCoalitions = ref(20); // global maximum number of coalitions

const iconNames = [
  "vuedotjs",
  "symfony",
  "laravel",
  "php",
  "javascript",
  "bootstrap",
  "docker",
  "git",
  "github",
  "gitlab",
  "jetbrains",
  "visualstudiocode",
  "mysql",
  "apple",
  "openai",
  "anthropic",
];

const elements = ref(
  iconNames.map((icon) => ({
    icon,
    directionX: Math.random() * 2 - 1,
    directionY: Math.random() * 2 - 1,
  })),
);

const container = ref(null);
const animatedElements = ref([]);

onMounted(() => {
  nextTick(() => {
    elements.value.forEach((_, index) => {
      moveElement(index);
    });
    document.addEventListener("mousemove", handleMouseMove);
  });
});

onBeforeUnmount(() => {
  document.removeEventListener("mousemove", handleMouseMove);
});

const collisionCounters = ref(
  elements.value.map(() => ({
    count: 0,
    lastCollisionTime: Date.now(),
  })),
);

const resetElementPosition = (index: number) => {
  const el = animatedElements.value[index];
  if (!el) return;

  // set element position to (0, 0)
  gsap.set(el, { x: 0, y: 0 });

  // set random direction
  elements.value[index].directionX = Math.random() * 2 - 1;
  elements.value[index].directionY = Math.random() * 2 - 1;

  // reset collision counter
  collisionCounters.value[index].count = 0;
};

const moveElement = (index: number) => {
  const containerEl = container.value;
  const el = animatedElements.value[index];

  if (!el || !containerEl) return;

  const speed = globalSpeed.value;
  const elRect = (el as HTMLElement).getBoundingClientRect();
  const containerRect = (containerEl as HTMLElement).getBoundingClientRect();

  const now = Date.now();
  const collisionData = collisionCounters.value[index];

  // coalition detection and direction reversal
  let hasCollided = false;
  if (
    elRect.right >= containerRect.right ||
    elRect.left <= containerRect.left
  ) {
    elements.value[index].directionX *= -1;
    hasCollided = true;
  }

  if (
    elRect.bottom >= containerRect.bottom ||
    elRect.top <= containerRect.top
  ) {
    elements.value[index].directionY *= -1;
    hasCollided = true;
  }

  // if element has collided with the container, increase the collision counter
  if (hasCollided) {
    if (now - collisionData.lastCollisionTime < 3000) {
      collisionData.count++;
    } else {
      // reset counter after 3 seconds
      collisionData.count = 1;
    }
    collisionData.lastCollisionTime = now;
    // if more than the defined number of collisions, reset the element position
    if (collisionData.count > globalMaxCoalitions.value) {
      resetElementPosition(index);
    }
  }

  // continuous movement without fixed duration
  gsap.to(el, {
    x: `+=${speed * elements.value[index].directionX}`,
    y: `+=${speed * elements.value[index].directionY}`,
    duration: 0.1,
    onComplete: () => moveElement(index),
    ease: "none",
  });
};

const handleMouseMove = (event: MouseEvent) => {
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  elements.value.forEach((_, index) => {
    const el = animatedElements.value[index] as HTMLElement;
    const elRect = el.getBoundingClientRect();

    // is mouse inside element?
    if (
      mouseX >= elRect.left &&
      mouseX <= elRect.right &&
      mouseY >= elRect.top &&
      mouseY <= elRect.bottom
    ) {
      // set random direction
      elements.value[index].directionX =
        (Math.random() * 2 - 1) * globalSpeed.value;
      elements.value[index].directionY =
        (Math.random() * 2 - 1) * globalSpeed.value;
    }
  });
};
</script>

<style scoped>
.absolute-anime {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.icon-white {
  filter: brightness(0) invert(1);
}
</style>
