# Follow-ups

Lebende Liste offener, nicht dringender Verbesserungen für diese Seite.

## Offen

### `<noscript>`-Fallback für das Kontaktformular
Die Seite läuft mit SSR, der Inhalt ist also ohne JavaScript lesbar — **das Kontaktformular
aber nicht**: es sendet über `$fetch` / `@submit.prevent`, ist damit reines JS und stirbt
still, wenn JS aus ist oder das Bundle nicht lädt (Blocker, lahmes Netz, Firmen-Proxy) →
verlorene Anfrage ohne Rückmeldung.

**To-do:** einen `<noscript>`-Hinweis mit direktem Kontakt (Telefon/E-Mail) ergänzen, z. B.:
```html
<noscript>Für das Kontaktformular bitte JavaScript aktivieren —
oder schreiben Sie mir direkt: [E-Mail/Telefon der Seite]</noscript>
```
Nicht das ganze Formular ohne JS lauffähig machen (unverhältnismäßig) — nur der Fallback-Hinweis.

Teil des zentralen Baseline-Standards (plan-Repo: `planung/site-baseline-qualitaetsstandards.md`).
