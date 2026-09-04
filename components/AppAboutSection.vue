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
          und komme aus dem Westerwald. Am meisten treibt mich die Frage an,
          warum Dinge so funktionieren, wie sie funktionieren. Ich gebe mich
          selten mit einer Antwort zufrieden, bevor ich sie wirklich verstanden
          habe.
        </p>
        <p
          class="py-3 text-left text-xs text-gray-200 sm:text-sm md:text-base lg:text-xl"
        >
          Angefangen habe ich im Handwerk, als Elektroniker für Energie- und
          Gebäudetechnik. Schon dort wollte ich immer verstehen, was hinter
          einer Aufgabe steckt, statt sie nur abzuarbeiten. In der
          Softwareentwicklung ist dieses Nachfragen zu meinem wichtigsten
          Werkzeug geworden. Hier zahlt es sich aus, ein Problem erst ganz zu
          durchdringen, bevor man es löst.
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
          Heute arbeite ich hauptberuflich als Fachinformatiker für
          Anwendungsentwicklung an realen Projekten. Daneben entwickle ich
          Websites für kleinere Unternehmen und lokale Betriebe oder Vereine
          sowie private Anwendungen für mich selbst, von der ersten Idee bis in
          den laufenden Betrieb. Was mich dabei antreibt, ist immer derselbe
          Anspruch: verstehen, bevor man baut, und bauen, dass es hält.
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
