<script lang="ts" setup>
import { getCurrentAge } from "~/utils/age";
</script>

<template>
  <!-- About section -->
  <div id="ueber-mich" class="relative mx-auto mb-12 w-full max-w-7xl">
    <div
      class="relative z-10 flex w-full flex-col items-center sm:flex-row sm:px-9 sm:py-9"
    >
      <AppCard
        group-class="mx-auto w-[95%] lg:mx-0 lg:w-2/3"
        content-class="p-6 sm:justify-center"
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
          Mein Name ist André Hommrich. Ich bin {{ getCurrentAge() }} Jahre alt
          und stamme aus dem wunderschönen Westerwald. Menschen beschreiben mich
          als freundlich, hilfsbereit und leidenschaftlich darin, mein Wissen
          und meine Begeisterung für Technik mit anderen zu teilen.
        </p>
        <p
          class="py-3 text-left text-xs text-gray-200 sm:text-sm md:text-base lg:text-xl"
        >
          Besonders spannend finde ich es, mich in technische Herausforderungen
          zu vertiefen und diese mit einem Hang zur Perfektion zu lösen. Mein
          logisches Denken und technisches Verständnis ziehen sich wie ein roter
          Faden durch mein Leben – die ideale Kombination für komplexe Projekte,
          die Genauigkeit und Kreativität verlangen.
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
      </AppCard>

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
