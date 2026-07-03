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
              Als Fullstack-Webentwickler arbeite ich täglich an realen
              Projekten – von der Planung über die Umsetzung bis hin zur
              Wartung. In meiner Ausbildungszeit und darüber hinaus habe ich ein
              breites technisches Fundament aufgebaut, das ich seitdem
              kontinuierlich erweitere.
            </p>
            <p
              class="py-3 text-left text-xs text-gray-200 sm:text-sm md:text-base lg:text-xl"
            >
              In meiner Zeit als Entwickler habe ich gemerkt, wie gut der Beruf
              zu mir passt. Er verbindet das, was mich sowieso antreibt —
              Neugier, logisches Denken und technisches Verständnis. Komplexe
              Probleme zu lösen und dabei ständig dazuzulernen ist im Alltag
              genau das, was mir an dem Job am meisten Spaß macht.
            </p>
          </div>
        </div>
      </AppCard>
    </div>
  </div>
</template>
