// Kontaktformular-Datenmodell für hommri.ch / ahommrich.de.
//
// Bewusst als NEUTRALER Kontaktpunkt gestaltet, nicht als Leistungskatalog: Die Frage
// lautet „Worum geht es?" — der Besucher wählt seinen Anlass, es wird nichts aktiv beworben.
// Thematisch strikt auf Websites/Betrieb beschränkt (keine Webapplikationen/Portale), um die
// Abgrenzung zur Anstellung zu wahren.

export type ContactTopicId =
  | "neuer-webauftritt"
  | "website-ueberarbeiten"
  | "hosting-betreuung"
  | "unverbindlich-austauschen"
  | "allgemeine-frage"
  | "feedback"
  | "allgemein-sonstiges";

export type ContactTopic = {
  id: ContactTopicId;
  label: string;
};

export type ContactIntentId = "projekt" | "allgemein";

export type ContactIconName = "screen" | "message";

export type ContactIntent = {
  id: ContactIntentId;
  label: string;
  icon: ContactIconName;
  topicLabel: string;
  topics: readonly ContactTopic[];
};

// Version des Datenschutzhinweises am Formular. Bei inhaltlichen Änderungen des Hinweises
// hochzählen (Datum), damit der Consent-Nachweis eindeutig einer Fassung zuordenbar bleibt.
export const contactPrivacyNoticeVersion = "2026-09-04";

export const contactIntents = [
  {
    id: "projekt",
    label: "Projekt & Website",
    icon: "screen",
    topicLabel: "Worum geht es bei Ihrem Projekt?",
    topics: [
      { id: "neuer-webauftritt", label: "Neuer Webauftritt" },
      { id: "website-ueberarbeiten", label: "Bestehende Website überarbeiten" },
      { id: "hosting-betreuung", label: "Hosting & Betreuung" },
      {
        id: "unverbindlich-austauschen",
        label: "Erst mal unverbindlich austauschen",
      },
    ],
  },
  {
    id: "allgemein",
    label: "Allgemeine Anfrage",
    icon: "message",
    topicLabel: "Wie kann ich helfen?",
    topics: [
      { id: "allgemeine-frage", label: "Allgemeine Frage" },
      { id: "feedback", label: "Feedback" },
      { id: "allgemein-sonstiges", label: "Sonstiges" },
    ],
  },
] as const satisfies readonly ContactIntent[];

export const defaultContactIntent: ContactIntentId = "projekt";

export const getContactIntent = (id: ContactIntentId) =>
  contactIntents.find((intent) => intent.id === id) ?? contactIntents[0];

export const normalizeContactIntent = (value: unknown): ContactIntentId =>
  typeof value === "string" &&
  contactIntents.some((intent) => intent.id === value)
    ? (value as ContactIntentId)
    : defaultContactIntent;

export const isContactIntentId = (value: unknown): value is ContactIntentId =>
  typeof value === "string" &&
  contactIntents.some((intent) => intent.id === value);

export const isContactTopicId = (
  intentId: ContactIntentId,
  value: unknown,
): value is ContactTopicId =>
  typeof value === "string" &&
  getContactIntent(intentId).topics.some((topic) => topic.id === value);

export const normalizeContactTopic = (
  intentId: ContactIntentId,
  value: unknown,
): ContactTopicId => {
  const intent = getContactIntent(intentId);
  if (
    typeof value === "string" &&
    intent.topics.some((topic) => topic.id === value)
  ) {
    return value as ContactTopicId;
  }
  return intent.topics[0].id;
};

export const getContactTopic = (
  intentId: ContactIntentId,
  topicId: ContactTopicId,
) => {
  const intent = getContactIntent(intentId);
  return (
    intent.topics.find((topic) => topic.id === topicId) ?? intent.topics[0]
  );
};
