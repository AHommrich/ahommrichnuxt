import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { useRoute } from "vue-router";
import AppHeader from "~/components/AppHeader.vue";

vi.mock("vue-router", () => ({
  useRoute: vi.fn(),
}));

// NuxtLink is a Nuxt auto-imported component; in tests we render it as a simple <a>
// so we can assert on the plain link markup without spinning up a Nuxt runtime.
const globalStubs = {
  NuxtLink: {
    props: ["to"],
    template: '<a :href="to"><slot /></a>',
  },
};

describe("AppHeader", () => {
  beforeEach(() => {
    vi.mocked(useRoute).mockReset();
  });

  it("renders the four section anchor links on the homepage", () => {
    vi.mocked(useRoute).mockReturnValue({ path: "/" } as ReturnType<
      typeof useRoute
    >);
    const wrapper = mount(AppHeader, { global: { stubs: globalStubs } });
    const navLinks = wrapper.findAll(".nav-link");
    expect(navLinks.length).toBe(4);
    const labels = navLinks.map((l) => l.text());
    expect(labels).toEqual(["Home", "Über mich", "Aktuell", "Skills"]);
  });

  it("shows the desktop sliding underline element on the homepage", () => {
    vi.mocked(useRoute).mockReturnValue({ path: "/" } as ReturnType<
      typeof useRoute
    >);
    const wrapper = mount(AppHeader, { global: { stubs: globalStubs } });
    expect(wrapper.find(".sliding-line").exists()).toBe(true);
  });

  it("renders a 'Zurück' link and no nav anchors on non-home routes", () => {
    vi.mocked(useRoute).mockReturnValue({ path: "/impressum" } as ReturnType<
      typeof useRoute
    >);
    const wrapper = mount(AppHeader, { global: { stubs: globalStubs } });
    expect(wrapper.findAll(".nav-link").length).toBe(0);
    expect(wrapper.text()).toContain("Zurück");
  });

  it("marks the 'Home' link as active by default", () => {
    vi.mocked(useRoute).mockReturnValue({ path: "/" } as ReturnType<
      typeof useRoute
    >);
    const wrapper = mount(AppHeader, { global: { stubs: globalStubs } });
    const activeLinks = wrapper.findAll(".nav-link.is-active");
    expect(activeLinks.length).toBe(1);
    expect(activeLinks[0].text()).toBe("Home");
  });
});
