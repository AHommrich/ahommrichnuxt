<template>
  <div class="pattern-wrap" aria-hidden="true" />
</template>

<style scoped>
/* Identical to the homepage .bg-pattern setup — same PNG files, same background-size.
   PNG statt SVG: das gekachelte <pattern>-SVG musste beim Scrollen laufend neu
   gerastert werden (Frames bis 414 ms auf Mobile); ein PNG wird einmal dekodiert
   und danach nur noch billig kopiert. Optik identisch. */
.pattern-wrap {
  position: absolute;
  inset: 0;
  background-color: #ffffff;
  background-image: url("/img/bg-dots-light.png");
  background-size: 2000px 6000px;
  background-repeat: repeat;
  pointer-events: none;
}

@media (prefers-color-scheme: dark) {
  .pattern-wrap {
    background-color: #3b4245;
    background-image: url("/img/bg-dots-dark.png");
  }
}
</style>
