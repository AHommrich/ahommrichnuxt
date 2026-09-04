import { vi } from "vitest";
import { ref } from "vue";
import { config } from "@vue/test-utils";
import de from "../i18n/locales/de.json";

// i18n stubs. The specs run without the Nuxt/@nuxtjs/i18n runtime, so we resolve
// translation keys against the real German locale file — existing assertions that
// check visible German text keep working unchanged.
const resolveKey = (obj: unknown, key: string): unknown =>
  key
    .split(".")
    .reduce<unknown>(
      (o, k) =>
        o && typeof o === "object"
          ? (o as Record<string, unknown>)[k]
          : undefined,
      obj,
    );

const t = (key: string, params?: Record<string, unknown>): string => {
  const value = resolveKey(de, key);
  if (typeof value !== "string") return key;
  if (!params) return value;
  // Minimal {name} interpolation so keys with placeholders resolve in tests.
  return value.replace(/\{(\w+)\}/g, (_m, name) =>
    name in params ? String(params[name]) : `{${name}}`,
  );
};

const g = globalThis as unknown as Record<string, unknown>;
g.useI18n = () => ({
  t,
  locale: ref("de"),
  locales: ref([
    { code: "de", name: "Deutsch" },
    { code: "en", name: "English" },
  ]),
});
g.useSwitchLocalePath = () => (code: string) =>
  code === "de" ? "/" : `/${code}`;
g.useLocalePath = () => (path: string) => path;

config.global.mocks = { ...(config.global.mocks ?? {}), $t: t };

// Minimal no-op stubs for browser observer APIs that happy-dom doesn't provide.
// Components attach observers during onMounted; without these stubs the mount
// throws and the test can't even render the initial state.

class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

if (typeof globalThis.IntersectionObserver === "undefined") {
  globalThis.IntersectionObserver =
    NoopObserver as unknown as typeof IntersectionObserver;
}

if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = NoopObserver as unknown as typeof ResizeObserver;
}

// requestAnimationFrame in happy-dom returns 0 and never fires the callback,
// which is fine — our specs assert initial state, not animated frames.
if (typeof globalThis.requestAnimationFrame === "undefined") {
  globalThis.requestAnimationFrame = vi.fn(() => 0);
  globalThis.cancelAnimationFrame = vi.fn();
}

// matchMedia is used by AppHeader to gate desktop-only slider work.
if (typeof globalThis.matchMedia === "undefined") {
  globalThis.matchMedia = vi.fn().mockReturnValue({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }) as unknown as typeof matchMedia;
}

// window.performance.navigation is a legacy API AppHeader uses to detect hard reload.
if (typeof window !== "undefined" && !("navigation" in window.performance)) {
  Object.defineProperty(window.performance, "navigation", {
    value: { type: 0 },
    configurable: true,
  });
}

// Nuxt auto-imports useSeoMeta at build time; in Vitest it isn't defined.
// A no-op is enough — SEO tags aren't what these specs assert about.
(
  globalThis as unknown as { useSeoMeta?: (...args: unknown[]) => void }
).useSeoMeta = () => {};
