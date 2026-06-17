<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from "vue";

/**
 * Calculates the current age based on the birthday (1997-03-25).
 * Month is 0-indexed (2 = March). Subtracts 1 if the birthday hasn't occurred yet this year.
 */
function getCurrentAge() {
  const today = new Date();
  const birthday = new Date(1997, 2, 25);
  let age = today.getFullYear() - birthday.getFullYear();
  const m = today.getMonth() - birthday.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
    age--;
  }
  return age;
}

// IntersectionObserver tracks whether the card is in the viewport. The
// resulting class is consumed by a (hover: none) CSS branch to trigger the
// same layer-slide animation on touch devices where :hover is unreliable.
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
  <!-- About section -->
  <div id="ueber-mich" class="relative mx-auto mb-12 w-full max-w-7xl">
    <div
      class="relative z-10 flex w-full flex-col items-center sm:flex-row sm:px-9 sm:py-9"
    >
      <div
        ref="cardEl"
        :class="[
          'card-group relative mx-auto w-[95%] lg:mx-0 lg:w-2/3',
          { 'is-in-view': isInView },
        ]"
      >
        <!--
          Decorative offset shadow layers — sharp edges echo the Hero diamond grid.
          They sit on top of each other by default and slide apart on hover
          (or when the card scrolls into view on touch devices).
        -->
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
            Wer bin ich?
          </h3>
          <p
            class="py-3 text-left text-xs text-gray-200 sm:text-sm md:text-base lg:text-xl"
          >
            <!-- Age is computed at render time so it stays accurate without manual updates -->
            Mein Name ist André Hommrich. Ich bin {{ getCurrentAge() }} Jahre
            alt und stamme aus dem wunderschönen Westerwald. Menschen
            beschreiben mich als freundlich, hilfsbereit und leidenschaftlich
            darin, mein Wissen und meine Begeisterung für Technik mit anderen zu
            teilen.
          </p>
          <p
            class="py-3 text-left text-xs text-gray-200 sm:text-sm md:text-base lg:text-xl"
          >
            Besonders spannend finde ich es, mich in technische
            Herausforderungen zu vertiefen und diese mit einem Hang zur
            Perfektion zu lösen. Mein logisches Denken und technisches
            Verständnis ziehen sich wie ein roter Faden durch mein Leben – die
            ideale Kombination für komplexe Projekte, die Genauigkeit und
            Kreativität verlangen.
          </p>
          <!-- Inline photo shown only on mobile/tablet (hidden on lg and above) -->
          <img
            src="/img/andre-arbeit-3.jpg"
            class="block h-auto max-h-64 w-full py-3 object-cover shadow-lg md:object-[center_45%] lg:hidden"
            alt="André bei der Arbeit"
          />
          <p
            class="pt-3 text-left text-xs text-gray-200 sm:text-sm md:text-base lg:text-xl"
          >
            Meine berufliche Laufbahn begann im Handwerk – als ausgebildeter
            Elektroniker m.F. Energie u. Gebäudetechnik konnte ich früh
            Projekterfahrung in der Praxis sammeln und verstehen, wie moderne
            Arbeitsprozesse funktionieren. Heute arbeite ich als ausgebildeter
            Fachinformatiker für Anwendungsentwicklung aktiv an realen
            Kundenprojekten und bewege mich dabei täglich mit modernen
            Technologien und Konzepten. Entwicklung ist nicht nur mein Beruf,
            sondern meine Leidenschaft – weshalb ich mich ständig privat
            weiterbilde und eigene Projekte umsetze.
          </p>
        </div>
      </div>

      <!-- Side photo shown only on large screens (lg and above) -->
      <div class="ml-8 hidden w-1/3 items-center justify-center lg:flex">
        <img
          src="/img/andre-arbeit-3.jpg"
          class="h-auto max-h-[550px] w-full object-contain shadow-lg"
          alt="André bei der Arbeit"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/*
  Card layer animation:
  - Default state: both layers sit exactly on top of each other (no transform).
  - On hover-capable devices (desktop): the layers slide apart while the pointer
    is over the card.
  - On touch devices (hover: none): the slide is triggered by an IntersectionObserver
    once the card is in the viewport, since :hover is unreliable on touch.
  Distance matches Tailwind's translate-1.5 (= 0.375rem) used previously.
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
