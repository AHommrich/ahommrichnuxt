<template>
  <!-- Currently-doing section: short job-focused card -->
  <div id="was-ich-mache" class="relative mx-auto mb-12 w-full max-w-7xl">
    <div
      class="relative z-10 flex w-full flex-col items-center sm:px-9 sm:py-9"
    >
      <AppCard
        group-class="mx-auto w-[95%]"
        content-class="p-6 sm:justify-center"
      >
        <h3
          class="self-center pb-3 text-center text-2xl text-gray-200 sm:text-3xl md:text-4xl lg:text-5xl"
        >
          Was ich aktuell mache?
        </h3>

        <!--
          Two-column layout on lg+: illustration on the left, both paragraphs
          on the right. On smaller screens, stack: illustration first (eye-
          catcher), then the two text paragraphs below.
        -->
        <div class="flex flex-col lg:flex-row lg:items-start lg:gap-10">
          <!-- Illustration column -->
          <div class="my-6 lg:my-0 lg:w-1/2">
            <AppFullstackScene />
          </div>

          <!-- Text column -->
          <div class="flex flex-col lg:w-1/2 lg:justify-center lg:py-4">
            <p
              class="py-3 text-left text-xs text-gray-200 sm:text-sm md:text-base lg:text-xl"
            >
              Als Fullstack-Webentwickler begleite ich eine Anwendung von der
              ersten Planung bis in den laufenden Betrieb. Vieles, was ich baue,
              betreibe ich danach auch selbst. Deshalb achte ich schon beim
              Entwickeln darauf, dass es später zuverlässig läuft. Ich prüfe zum
              Beispiel, ob sich ein Backup im Ernstfall wirklich
              wiederherstellen lässt, und behandle Datenschutz als festen Teil
              der Technik und nicht als etwas, das man am Ende dazusetzt.
            </p>
            <p
              class="py-3 text-left text-xs text-gray-200 sm:text-sm md:text-base lg:text-xl"
            >
              In den Jahren als Entwickler habe ich gemerkt, wie gut der Beruf
              zu mir passt: Ich lerne ständig dazu und darf an Problemen
              tüfteln, die sich mit der ersten naheliegenden Lösung nicht
              erledigen. Das macht mir an der Arbeit am meisten Spaß.
            </p>
          </div>
        </div>
      </AppCard>
    </div>
  </div>
</template>
