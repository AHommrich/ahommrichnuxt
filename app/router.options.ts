import type { RouterConfig } from "@nuxt/schema";

// Custom scroll behaviour. The main reason it exists: switching the language
// (DE <-> EN) is a route change from "/" to "/en" (same page, other locale).
// The default behaviour would jump back to the top, which feels unprofessional.
// When only the locale prefix differs we keep the current scroll position;
// otherwise we fall back to hash-anchor scrolling, saved position (back/forward)
// or the top of the page.
export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    const stripLocale = (path: string) =>
      path.replace(/^\/en(?=\/|$)/, "") || "/";

    // Same page, different locale -> stay where the visitor is.
    if (stripLocale(to.path) === stripLocale(from.path)) {
      return false;
    }

    if (to.hash) {
      return { el: to.hash, behavior: "smooth" };
    }

    return savedPosition ?? { top: 0 };
  },
};
