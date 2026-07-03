import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import AppCard from "~/components/AppCard.vue";

describe("AppCard", () => {
  it("renders default slot content", () => {
    const wrapper = mount(AppCard, {
      slots: { default: "<p class='inner'>hello card</p>" },
    });
    expect(wrapper.find(".inner").exists()).toBe(true);
    expect(wrapper.text()).toContain("hello card");
  });

  it("renders the two offset shadow layers plus the content stack", () => {
    // The three layers are load-bearing for the slide-apart animation.
    // If any of them disappears, the visual effect breaks silently.
    const wrapper = mount(AppCard);
    expect(wrapper.find(".card-layer-back").exists()).toBe(true);
    expect(wrapper.find(".card-layer-front").exists()).toBe(true);
    expect(wrapper.find(".card-content").exists()).toBe(true);
  });

  it("applies default group and content classes when no props are given", () => {
    const wrapper = mount(AppCard);
    expect(wrapper.find(".card-group").classes()).toContain("w-full");
    expect(wrapper.find(".card-content").classes()).toContain("p-6");
    expect(wrapper.find(".card-content").classes()).toContain("gap-3");
  });

  it("merges custom groupClass onto the outer wrapper", () => {
    const wrapper = mount(AppCard, {
      props: { groupClass: "mx-auto w-1/2" },
    });
    const group = wrapper.find(".card-group");
    expect(group.classes()).toContain("mx-auto");
    expect(group.classes()).toContain("w-1/2");
    // Default is *replaced* (not merged) — verify the override took effect
    expect(group.classes()).not.toContain("w-full");
  });

  it("merges custom contentClass onto the inner content stack", () => {
    const wrapper = mount(AppCard, {
      props: { contentClass: "p-8 justify-center" },
    });
    const content = wrapper.find(".card-content");
    expect(content.classes()).toContain("p-8");
    expect(content.classes()).toContain("justify-center");
    expect(content.classes()).not.toContain("p-6");
  });

  it("starts without the is-in-view class (IntersectionObserver hasn't fired yet in the test DOM)", () => {
    // happy-dom doesn't drive IntersectionObserver, so the class stays off.
    // This asserts the *initial* state — the class is added only after the
    // observer callback marks the card as intersecting.
    const wrapper = mount(AppCard);
    expect(wrapper.find(".card-group").classes()).not.toContain("is-in-view");
  });
});
