// 301-Weiterleitung auf die kanonische Hauptdomain hommri.ch.
//
// Die App wird (noch) unter mehreren Hostnamen ausgeliefert. Damit SEO-Signale
// gebündelt werden und kein Duplicate Content entsteht, leiten wir die
// Alt-Domain ahommrich.de sowie alle www.*-Varianten dauerhaft auf
// https://hommri.ch um. Pfad und Query bleiben erhalten.
//
// Läuft nur bei echten Fremd-Hosts — localhost/Dev bleibt unberührt.
export default defineEventHandler((event) => {
  const host = getRequestHost(event, { xForwardedHost: true })?.toLowerCase();
  if (!host) return;

  const CANONICAL = "hommri.ch";
  const needsRedirect =
    host === "ahommrich.de" ||
    host === "www.ahommrich.de" ||
    host === "www.hommri.ch";
  if (!needsRedirect) return;

  const url = getRequestURL(event, { xForwardedHost: true });
  return sendRedirect(
    event,
    `https://${CANONICAL}${url.pathname}${url.search}`,
    301,
  );
});
