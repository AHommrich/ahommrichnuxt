import type { ContactIntentId, ContactTopicId } from "~~/data/contact";

export type ContactFormPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  intent: ContactIntentId;
  topic: ContactTopicId;
  privacyNoticeAccepted: boolean;
  privacyNoticeVersion: string;
  privacyNoticeAcceptedAt: string;
  privacyNoticeTimezone: string;
  // Honeypot: muss leer bleiben. Ein befüllter Wert deutet auf einen Bot hin.
  website: string;
};

export type ContactSubmissionResponse = {
  success: true;
  simulated: boolean;
};
