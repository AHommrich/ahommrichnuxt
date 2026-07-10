<template>
  <div class="pattern-wrap" aria-hidden="true" />
</template>

<style scoped>
/* Identical to the homepage .bg-pattern setup — same SVG files, same background-size */
.pattern-wrap {
  position: absolute;
  inset: 0;
  background-color: #ffffff;
  background-image: url("/img/bg-dots-light.svg");
  background-size: 2000px 6000px;
  background-repeat: repeat;
  pointer-events: none;
}

@media (prefers-color-scheme: dark) {
  .pattern-wrap {
    background-color: #3b4245;
    background-image: url("/img/bg-dots-dark.svg");
  }
}

@media print {
  .pattern-wrap {
    position: fixed !important;
    inset: 0 !important;
    background-color: #ffffff !important;
    background-image: url("/img/bg-dots-light.svg") !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
</style>
