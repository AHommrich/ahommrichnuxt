<template>
  <div id="ueber-mich" class="relative mx-auto mb-36 w-full max-w-7xl">
    <!-- Wrapper für den Inhalt -->
    <div
      class="relative z-10 flex w-full flex-col items-center sm:flex-row sm:px-9 sm:py-9"
    >
      <!-- Hintergrundboxen nur für das w-2/3 div -->
      <div class="relative w-[95%] lg:w-2/3">
        <!-- Graue Box (Hintergrund) nur für w-2/3 -->
        <div
          class="absolute inset-0 w-full translate-x-1.5 translate-y-1.5 rounded-xl border border-[#3b4245] bg-white opacity-80 dark:border-white dark:bg-[#3b4245]"
        />
        <!-- Rote Box (Hintergrund) nur für w-2/3 -->
        <div
          class="absolute inset-0 w-full -translate-x-1.5 -translate-y-1.5 rounded-xl border border-[#3b4245] bg-[#8D1D29] opacity-80 dark:border-white"
        />

        <!-- Textbereich (Inhalt von w-2/3) -->
        <div
          class="relative z-10 flex flex-col space-y-6 p-6 sm:justify-center"
        >
          <h3
            class="self-center text-center text-2xl text-gray-200 sm:text-3xl md:text-4xl lg:text-5xl"
          >
            Wer bin ich?
          </h3>
          <p
            class="text-left text-xs text-gray-200 sm:text-sm md:text-base lg:text-xl"
          >
            Mein Name ist André Hommrich. Ich bin 28 Jahre alt und stamme aus
            dem wunderschönen Westerwald. Menschen beschreiben mich als
            freundlich, hilfsbereit und leidenschaftlich darin, mein Wissen und
            meine Begeisterung für Technik mit anderen zu teilen.
          </p>
          <p
            class="text-left text-xs text-gray-200 sm:text-sm md:text-base lg:text-xl"
          >
            Besonders spannend finde ich es, mich in technische
            Herausforderungen zu vertiefen und diese mit einem Hang zur
            Perfektion zu lösen. Mein logisches Denken und technisches
            Verständnis ziehen sich wie ein roter Faden durch mein Leben – die
            ideale Kombination für komplexe Projekte, die Genauigkeit und
            Kreativität verlangen.
          </p>
          <img
            src="/img/andre-arbeit-3.jpg"
            class="block h-auto max-h-64 w-full rounded-xl object-cover shadow-lg md:object-[center_45%] lg:hidden"
            alt="André bei der Arbeit"
          >
          <p
            class="text-left text-xs text-gray-200 sm:text-sm md:text-base lg:text-xl"
          >
            Ich habe eine Ausbildung zum Elektroniker für Energie- und
            Gebäudetechnik absolviert, was mir die Grundlagen der Technik und
            des Handwerks vermittelt hat. Im Anschluss habe ich in verschiedenen
            Branchen gearbeitet, darunter die Produktion von medizinischen
            Versorgungseinheiten, die Elektrotechnik in der Industrie sowie die
            deutschlandweite Montage von Rechenzentren. In diesen Bereichen
            konnte ich umfassende Erfahrungen sammeln und mein technisches
            Wissen kontinuierlich erweitern und festigen, insbesondere in der
            Planung, Installation und Wartung komplexer Systeme.
          </p>
        </div>
      </div>

      <!-- Bildbereich (1/3) mit margin-left für Abstand -->
      <div class="ml-8 hidden w-1/3 items-center justify-center lg:flex">
        <img
          src="/img/andre-arbeit-3.jpg"
          class="h-auto max-h-[550px] w-full rounded-xl object-contain shadow-lg"
          alt="André bei der Arbeit"
        >
      </div>
    </div>
  </div>
</template>
