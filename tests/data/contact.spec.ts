import { describe, it, expect } from "vitest";
import {
  contactIntents,
  defaultContactIntent,
  getContactIntent,
  getContactTopic,
  isContactIntentId,
  isContactTopicId,
  normalizeContactIntent,
  normalizeContactTopic,
} from "~/data/contact";

describe("data/contact", () => {
  it("exposes exactly the two neutral contact intents", () => {
    // Bewusst neutraler Kontaktpunkt — kein Leistungskatalog. Ein „Zusammenarbeit"-/
    // Freelance-Anliegen wurde bewusst ENTFERNT (Arbeitgeber-Abgrenzung: kein
    // Auftreten als Entwickler-für-Hire). Diese Liste zu ändern soll den Test brechen.
    expect(contactIntents.map((intent) => intent.id)).toEqual([
      "projekt",
      "allgemein",
    ]);
  });

  it("does not advertise web applications, portals or freelance dev work (Arbeitgeber-Abgrenzung)", () => {
    // Sicherung gegen Formulierungen, die als Konkurrenz zum Arbeitgeber gelesen werden
    // könnten (Webapplikationen/Portale oder Entwickler-für-Hire / freie Zusammenarbeit).
    const allLabels = contactIntents
      .flatMap((intent) => [intent.label, ...intent.topics.map((t) => t.label)])
      .join(" ")
      .toLowerCase();
    expect(allLabels).not.toMatch(
      /applikation|portal|webapp|software|freiberuf|freelance/,
    );
  });

  it("isContactIntentId accepts known ids and rejects the rest", () => {
    expect(isContactIntentId("projekt")).toBe(true);
    expect(isContactIntentId("unbekannt")).toBe(false);
    expect(isContactIntentId(42)).toBe(false);
  });

  it("normalizeContactIntent falls back to the default for junk input", () => {
    expect(normalizeContactIntent("allgemein")).toBe("allgemein");
    expect(normalizeContactIntent("nonsense")).toBe(defaultContactIntent);
    expect(normalizeContactIntent(undefined)).toBe(defaultContactIntent);
    // Das entfernte Freelance-Anliegen darf NICHT mehr gültig sein.
    expect(normalizeContactIntent("zusammenarbeit")).toBe(defaultContactIntent);
  });

  it("isContactTopicId validates a topic against its own intent only", () => {
    expect(isContactTopicId("projekt", "neuer-webauftritt")).toBe(true);
    // Gültiges Thema, aber falsches Anliegen -> ungültig.
    expect(isContactTopicId("allgemein", "neuer-webauftritt")).toBe(false);
    expect(isContactTopicId("projekt", "gibt-es-nicht")).toBe(false);
  });

  it("normalizeContactTopic returns the first topic of the intent for junk input", () => {
    const firstProjektTopic = getContactIntent("projekt").topics[0].id;
    expect(normalizeContactTopic("projekt", "nonsense")).toBe(
      firstProjektTopic,
    );
    expect(normalizeContactTopic("projekt", "hosting-betreuung")).toBe(
      "hosting-betreuung",
    );
  });

  it("getContactTopic resolves labels used in the outgoing hub payload", () => {
    expect(getContactTopic("projekt", "neuer-webauftritt").label).toBe(
      "Neuer Webauftritt",
    );
    // Unbekanntes Thema fällt sicher auf das erste Thema des Anliegens zurück.
    expect(getContactTopic("allgemein", "x" as never).label).toBe(
      "Allgemeine Frage",
    );
  });
});
