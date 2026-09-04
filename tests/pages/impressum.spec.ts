import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Impressum from "~/pages/impressum.vue";
import AppCard from "~/components/AppCard.vue";

// Legal pages are load-bearing for compliance — asserting the *presence* of the
// key sections guards against accidental deletion during unrelated refactors.
// These tests don't police wording (that stays flexible); they check structure.
describe("pages/impressum.vue", () => {
  const stubs = { AppCard };

  it("renders the required Impressum heading", () => {
    const wrapper = mount(Impressum, { global: { stubs } });
    expect(wrapper.text()).toContain("Impressum");
  });

  it("shows a contact email address as a mailto link", () => {
    const wrapper = mount(Impressum, { global: { stubs } });
    const mailtos = wrapper
      .findAll("a")
      .filter((a) => a.attributes("href")?.startsWith("mailto:"));
    expect(mailtos.length).toBeGreaterThan(0);
  });

  it("declares a proper business imprint (§ 5 DDG, Kleinunternehmer § 19 UStG)", () => {
    // Seit Gewerbeanmeldung + geschäftlichem Kontaktformular ist die Seite gewerblich.
    // Die frühere „privat / keine gewerbliche Nutzung"-Aussage war damit falsch und
    // wurde bewusst durch ein korrektes Gewerbe-Impressum ersetzt.
    const wrapper = mount(Impressum, { global: { stubs } });
    const text = wrapper.text();
    expect(text).toMatch(/§\s*5\s*DDG/i);
    expect(text).toMatch(/§\s*19\s*UStG/i);
    // Die alte, nun unzutreffende Aussage darf NICHT mehr auftauchen.
    expect(text).not.toMatch(/keine gewerbliche/i);
  });

  it("renders the Bildnachweise (photo credits) section", () => {
    const wrapper = mount(Impressum, { global: { stubs } });
    expect(wrapper.text()).toContain("Bildnachweise");
  });

  it("marks every external link with rel='noopener noreferrer'", () => {
    // Enforces the CLAUDE.md rule for external links.
    const wrapper = mount(Impressum, { global: { stubs } });
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
