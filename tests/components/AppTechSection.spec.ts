import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import AppTechSection from "~/components/AppTechSection.vue";

describe("AppTechSection", () => {
  it("mounts without errors", () => {
    const wrapper = mount(AppTechSection);
    expect(wrapper.exists()).toBe(true);
  });

  it("renders one <img> per technology icon", () => {
    const wrapper = mount(AppTechSection);
    const imgs = wrapper.findAll("img.icon-white");
    // Must match the length of the iconNames array in AppTechSection.vue.
    // If icons are added or removed, update this expectation deliberately.
    expect(imgs.length).toBe(24);
  });

  it("uses local /icons/*.svg paths for every icon (no CDN)", () => {
    const wrapper = mount(AppTechSection);
    const imgs = wrapper.findAll("img.icon-white");
    imgs.forEach((img) => {
      const src = img.attributes("src") ?? "";
      expect(src.startsWith("/icons/")).toBe(true);
      expect(src.endsWith(".svg")).toBe(true);
    });
  });

  it("starts in info mode (default) with the toggle labelled 'Animation'", () => {
    const wrapper = mount(AppTechSection);
    const btnLabel = wrapper.find(".info-btn-label");
    // infoMode.value = true at mount, so the button offers to switch back to Animation.
    expect(btnLabel.text()).toBe("Animation");
  });

  it("switches the toggle label to 'Technologien' after a click", async () => {
    const wrapper = mount(AppTechSection);
    const btn = wrapper.find(".info-btn");
    await btn.trigger("click");
    const btnLabel = wrapper.find(".info-btn-label");
    expect(btnLabel.text()).toBe("Technologien");
  });
});
