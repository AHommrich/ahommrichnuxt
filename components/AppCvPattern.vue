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
</style>
