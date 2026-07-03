import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Datenschutz from "~/pages/datenschutz.vue";
import AppCard from "~/components/AppCard.vue";

// Guards the presence of every DSGVO-required section. Wording is not asserted —
// only that the structural heading (§1..§5) hasn't been accidentally removed.
describe("pages/datenschutz.vue", () => {
  const stubs = { AppCard };

  it("renders the Datenschutzerklärung heading", () => {
    const wrapper = mount(Datenschutz, { global: { stubs } });
    expect(wrapper.text()).toContain("Datenschutzerklärung");
  });

  it("renders the five DSGVO sections in numbered order", () => {
    const wrapper = mount(Datenschutz, { global: { stubs } });
    const text = wrapper.text();
    expect(text).toContain("1. Verantwortlicher");
    expect(text).toContain("2. Hosting");
    expect(text).toContain("3. Cookies und Tracking");
    expect(text).toContain("4. Externe Links");
    expect(text).toContain("5. Ihre Rechte");
  });

  it("names Hetzner as hosting provider with a German server location", () => {
    // Load-bearing factual claim — if the hosting section is edited to lie
    // about this, the test fails and forces a deliberate update.
    const wrapper = mount(Datenschutz, { global: { stubs } });
    const text = wrapper.text();
    expect(text).toContain("Hetzner");
    expect(text).toMatch(/Nürnberg|Deutschland/);
  });

  it("declares no cookies and no tracking", () => {
    const wrapper = mount(Datenschutz, { global: { stubs } });
    const text = wrapper.text();
    expect(text).toMatch(/keine Cookies/i);
    expect(text).toMatch(/kein Tracking/i);
  });

  it("lists all six DSGVO subject-rights articles", () => {
    // If someone drops one of these bullets, we've broken a compliance claim.
    const wrapper = mount(Datenschutz, { global: { stubs } });
    const text = wrapper.text();
    expect(text).toContain("Art. 15 DSGVO");
    expect(text).toContain("Art. 16 DSGVO");
    expect(text).toContain("Art. 17 DSGVO");
    expect(text).toContain("Art. 18 DSGVO");
    expect(text).toContain("Art. 20 DSGVO");
    expect(text).toContain("Art. 21 DSGVO");
  });

  it("all external links carry rel='noopener noreferrer'", () => {
    const wrapper = mount(Datenschutz, { global: { stubs } });
    const externals = wrapper
      .findAll("a")
      .filter((a) => a.attributes("target") === "_blank");
    expect(externals.length).toBeGreaterThan(0);
    externals.forEach((a) => {
      expect(a.attributes("rel") ?? "").toContain("noopener");
      expect(a.attributes("rel") ?? "").toContain("noreferrer");
    });
  });
});
