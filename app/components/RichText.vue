<script setup lang="ts">
// Rendert vertrauenswürdigen, übersetzten i18n-HTML-Text (nur <strong>/<a> aus
// den eigenen Locale-Dateien, kein Nutzer-Input) als Absatz. Das v-html ist
// deshalb XSS-unkritisch und hier zentral gekapselt, damit die Seiten selbst
// kein v-html mehr enthalten.
defineProps<{ html: string }>();
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <p v-html="html" />
</template>
