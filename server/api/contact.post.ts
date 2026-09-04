import {
  createError,
  defineEventHandler,
  getHeader,
  getRequestIP,
  readRawBody,
  setResponseHeader,
} from "h3";
import type { H3Event } from "h3";
import {
  contactPrivacyNoticeVersion,
  getContactIntent,
  getContactTopic,
  isContactIntentId,
  isContactTopicId,
} from "~~/data/contact";
import type {
  ContactFormPayload,
  ContactSubmissionResponse,
} from "~~/types/contact";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
// Notbremse gegen Speicher-Erschöpfung, falls sehr viele verschiedene IPs anfragen.
const RATE_LIMIT_MAX_TRACKED_IPS = 5000;
const MAX_BODY_BYTES = 20_000;
const requestsByIp = new Map<string, number[]>();

const requiredString = (value: unknown, maxLength: number) => {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return normalized && normalized.length <= maxLength ? normalized : null;
};

const optionalString = (value: unknown, maxLength: number) => {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
};

const validTimezone = (value: unknown) => {
  const timezone = requiredString(value, 64);
  if (!timezone) return null;
  try {
    new Intl.DateTimeFormat("de-DE", { timeZone: timezone }).format();
    return timezone;
  } catch {
    return null;
  }
};

const enforceRateLimit = (event: H3Event) => {
  // X-Forwarded-For wird bewusst vertraut: In Produktion läuft die App hinter dem
  // Traefik-/Coolify-Reverse-Proxy, der den Header setzt — nur so kommt die echte
  // Client-IP an. Ohne diesen Proxy (direkter Zugriff) wäre das spoofbar.
  const ip = getRequestIP(event, { xForwardedFor: true }) || "unknown";
  const now = Date.now();

  // Abgelaufene Einträge global aufräumen, damit die Map über die Zeit nicht unbegrenzt wächst.
  for (const [key, timestamps] of requestsByIp) {
    const active = timestamps.filter(
      (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
    );
    if (active.length) requestsByIp.set(key, active);
    else requestsByIp.delete(key);
  }
  if (requestsByIp.size > RATE_LIMIT_MAX_TRACKED_IPS) requestsByIp.clear();

  const recent = requestsByIp.get(ip) ?? [];
  if (recent.length >= RATE_LIMIT_MAX) {
    setResponseHeader(
      event,
      "retry-after",
      String(Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)),
    );
    throw createError({
      statusCode: 429,
      message: "Bitte versuchen Sie es später erneut.",
    });
  }

  recent.push(now);
  requestsByIp.set(ip, recent);
};

const validateBody = (value: unknown): ContactFormPayload => {
  if (!value || typeof value !== "object") {
    throw createError({
      statusCode: 400,
      message: "Bitte prüfen Sie Ihre Angaben.",
    });
  }

  const body = value as Record<string, unknown>;
  const firstName = requiredString(body.firstName, 100);
  const lastName = requiredString(body.lastName, 100);
  const email = requiredString(body.email, 254);
  const message = requiredString(body.message, 4000);
  const suppliedTimezone = optionalString(body.privacyNoticeTimezone, 64);
  const privacyNoticeTimezone = suppliedTimezone
    ? validTimezone(suppliedTimezone)
    : "Europe/Berlin";

  if (
    !firstName ||
    !lastName ||
    !email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !message ||
    !isContactIntentId(body.intent) ||
    !isContactTopicId(body.intent, body.topic) ||
    body.privacyNoticeAccepted !== true ||
    body.privacyNoticeVersion !== contactPrivacyNoticeVersion ||
    typeof body.privacyNoticeAcceptedAt !== "string" ||
    !Number.isFinite(Date.parse(body.privacyNoticeAcceptedAt)) ||
    !privacyNoticeTimezone
  ) {
    throw createError({
      statusCode: 400,
      message: "Bitte prüfen Sie Ihre Angaben.",
    });
  }

  return {
    firstName,
    lastName,
    email,
    message,
    intent: body.intent,
    topic: body.topic,
    phone: optionalString(body.phone, 40),
    privacyNoticeAccepted: true,
    privacyNoticeVersion: contactPrivacyNoticeVersion,
    privacyNoticeAcceptedAt: body.privacyNoticeAcceptedAt,
    privacyNoticeTimezone,
    website: optionalString(body.website, 200),
  };
};

export default defineEventHandler(
  async (event): Promise<ContactSubmissionResponse> => {
    // Schnelle Abweisung, wenn Content-Length bereits zu groß ist ...
    const contentLength = Number(getHeader(event, "content-length") || 0);
    if (contentLength > MAX_BODY_BYTES) {
      throw createError({ statusCode: 413, message: "Anfrage zu groß." });
    }

    enforceRateLimit(event);

    // ... und zusätzlich eine harte Grenze auf den tatsächlich gelesenen Body, damit auch
    // chunked Requests ohne Content-Length-Header nicht beliebig groß werden können.
    const raw = await readRawBody(event, "utf8");
    if (raw && Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) {
      throw createError({ statusCode: 413, message: "Anfrage zu groß." });
    }

    let parsedBody: unknown;
    try {
      parsedBody = raw ? JSON.parse(raw) : undefined;
    } catch {
      throw createError({
        statusCode: 400,
        message: "Bitte prüfen Sie Ihre Angaben.",
      });
    }

    const body = validateBody(parsedBody);

    // Datenschutz-Nachweis: Server-Eingangszeit ist die belastbare Größe; die Nutzerzeit
    // aus dem Formular wird zusätzlich protokolliert, ist aber vom Client gesetzt.
    const receivedAt = new Date().toISOString();

    // Honeypot-Treffer werden ohne weitere Verarbeitung neutral bestätigt.
    if (body.website) return { success: true, simulated: true };

    // Versand läuft über den zentralen hommrich-hub (Zustellung via Brevo, Retry, Consent-Ablage).
    // Konfiguration per Env: HUB_URL, HUB_SITE_SLUG, HUB_KEY (aus dem Hub-Panel).
    // Fehlt eine der Variablen (z. B. lokal), wird die Anfrage neutral als „simuliert" bestätigt,
    // damit das Formular ohne Hub testbar bleibt und keine Nachricht ins Leere läuft.
    const hubUrl = String(process.env.HUB_URL || "").replace(/\/$/, "");
    const hubSlug = String(process.env.HUB_SITE_SLUG || "");
    const hubKey = String(process.env.HUB_KEY || "");

    if (!hubUrl || !hubSlug || !hubKey)
      return { success: true, simulated: true };

    const intent = getContactIntent(body.intent);
    const topic = getContactTopic(body.intent, body.topic);

    try {
      await $fetch(`${hubUrl}/api/sites/${hubSlug}/contact`, {
        method: "POST",
        // Timeout: Ohne Grenze könnte eine hängende Hub-Instanz die Anfrage unbegrenzt blockieren.
        timeout: 10_000,
        headers: { "X-Hub-Key": hubKey },
        body: {
          first_name: body.firstName,
          last_name: body.lastName,
          email: body.email,
          phone: body.phone,
          message: body.message,
          intent: intent.label,
          topic: topic.label,
          consent_version: body.privacyNoticeVersion,
          consent_accepted_at: body.privacyNoticeAcceptedAt,
          consent_timezone: body.privacyNoticeTimezone,
          privacy_accepted: true,
        },
      });
    } catch (error) {
      // Diagnose bewusst minimiert: nur Status/Message, NICHT der Hub-Antwortkörper
      // (könnte übermittelte personenbezogene Daten enthalten).
      const hubError = error as {
        statusCode?: number;
        status?: number;
        message?: string;
      };
      console.error("[contact] Hub-Versand fehlgeschlagen:", {
        status: hubError.statusCode ?? hubError.status,
        message: hubError.message,
        hub: hubUrl,
        slug: hubSlug,
        receivedAt,
      });
      throw createError({
        statusCode: 502,
        message: "Die Nachricht konnte gerade nicht gesendet werden.",
      });
    }

    return { success: true, simulated: false };
  },
);
