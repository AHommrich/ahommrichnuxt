<template>
  <div class="pattern-wrap" aria-hidden="true" />
</template>

<style scoped>
/* Gleicher Circuit-Hintergrund wie die restliche Seite, aber nur die GRAUE
   Ebene (ohne die roten Akzente) — ruhiger und dokumententauglich für den
   Lebenslauf/das Anschreiben (die als layout:false eigenständig rendern).
   Nutzt die globalen CSS-Variablen aus main.css: kein Daten-Duplikat, und
   hell/dunkel schaltet automatisch über --bg-base/--bg-circuit. */
.pattern-wrap {
  position: absolute;
  inset: 0;
  background-color: var(--bg-base);
  background-image: var(--bg-circuit);
  background-size: 456px 456px;
  background-repeat: repeat;
  pointer-events: none;
}
</style>
