// FontAwesome setup — client-only plugin (filename suffix .client.js enforces this in Nuxt)
import { library, config } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

// Disable automatic CSS injection — Nuxt handles the stylesheet via nuxt.config.ts css array.
// Without this, FontAwesome would inject a duplicate <style> tag into the document head.
config.autoAddCss = false;

// Register solid and brand icon packs into the library so they can be referenced
// anywhere in the app via <font-awesome-icon :icon="['fas', 'icon-name']" />
library.add(fas, fab);

export default defineNuxtPlugin((nuxtApp) => {
  // Guard against SSR: FontAwesome relies on the DOM and must only run in the browser.
  // Rendering icons on the server would cause a Vue hydration mismatch.
  if (import.meta.client) {
    library.add(fas, fab);
    nuxtApp.vueApp.component("font-awesome-icon", FontAwesomeIcon);
  }
});
