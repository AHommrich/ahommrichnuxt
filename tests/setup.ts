import { vi } from "vitest";

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
