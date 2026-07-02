import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import AppHeroSection from "~/components/AppHeroSection.vue";

// FontAwesome icons are registered as a Nuxt plugin at runtime; stub them here
// so mount() doesn't fail on the unregistered custom element.
const globalStubs = {
  "font-awesome-icon": {
    template: '<i class="fa-stub" />',
  },
};

describe("AppHeroSection", () => {
  it("mounts without errors", () => {
    const wrapper = mount(AppHeroSection, { global: { stubs: globalStubs } });
    expect(wrapper.exists()).toBe(true);
  });

  it("uses id='home' on the root section so the header IntersectionObserver can track it", () => {
    const wrapper = mount(AppHeroSection, { global: { stubs: globalStubs } });
    expect(wrapper.find("#home").exists()).toBe(true);
  });

  it("renders the mobile-diamonds wrapper that carries the subpixel-gap fix", () => {
    // The scoped CSS applies translateZ + backface-visibility to
    // `.mobile-diamonds > div > div` to eliminate iOS Safari subpixel seams.
    // If the wrapper class name changes, the CSS rule silently stops matching —
    // this spec guards against that.
    const wrapper = mount(AppHeroSection, { global: { stubs: globalStubs } });
    expect(wrapper.find(".mobile-diamonds").exists()).toBe(true);
  });
});
