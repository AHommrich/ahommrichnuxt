# Tests

Diese Testsuite ist bewusst schlank gehalten. Statt Coverage-Zahlen zu jagen,
zielt sie auf **Failure Modes**, die im Alltag realistisch kaputt gehen können.

## Struktur

```
tests/
├── setup.ts          Stubs für Browser-APIs, die happy-dom nicht anbietet
├── utils/            Reine Funktionen — Physik-Math und Age-Berechnung
├── components/       Vue-Komponenten — Render-Contract und Verhalten
└── pages/            Legal-Pages — Compliance-Regression-Guards
```

## Was wir testen

- **`utils/animation.ts`** — Flee-Force, Damping, Bounce, Grid-Layout.
  Extrahiert aus `AppTechSection.vue`, damit die Physik-Math ohne DOM-Mount
  prüfbar bleibt. Fängt u. a. Division-by-Zero an koinzidenten Punkten,
  falsche Bounce-Richtung nach Corner-Overshoots, Off-by-One im Grid-Wrap.
- **`utils/age.ts`** — Off-by-One am Geburtstag, Monats- und Jahresgrenzen.
  Referenzdatum ist injizierbar, damit Tests deterministisch bleiben ohne
  `Date` global zu mocken.
- **`components/AppCard.spec.ts`** — die geteilte Card-Layer-Struktur, die
  drei Sections gleichzeitig backt. Ohne diesen Test würde ein Refactor am
  Slide-Mechanismus alle drei Sections gleichzeitig leise brechen.
- **`components/AppTechSection.spec.ts`** — Icon-Count, lokale Pfade
  (kein CDN) und **jede der 24 SVG-Dateien existiert wirklich auf der Platte**.
  Der Existenz-Check fängt umbenannte Dateien, die `imgs.length === 24`
  alleine übersieht.
- **`pages/impressum.spec.ts` + `pages/datenschutz.spec.ts`** — DSGVO-relevante
  Sections dürfen nicht durch Refactors leise verschwinden. Assertiert werden
  Strukturen (§1..§5, alle sechs Betroffenenrechte), nicht Wording. Extern
  verlinkte `<a>`-Elemente müssen `rel="noopener noreferrer"` tragen.

## Was wir bewusst _nicht_ testen

- **E2E (Playwright / Cypress)** — für ein Solo-Portfolio zu viel
  Wartungsaufwand relativ zum Nutzen. CSS-Transitions, echte Pointer-Events
  und Scroll-Verhalten müssen manuell im Browser verifiziert werden.
- **`AppFullstackScene.vue` (SVG-Illustration)** — Snapshot-Tests produzieren
  bei animierten SVGs mehr false positives als sie echte Regressionen fangen.
- **rAF-Loop selbst** — die _Reihenfolge der Frame-Operationen_ (Flee →
  Integrate → Bounce → Damping) ist implizit durch die Unit-Tests der
  Einzelschritte geschützt; die Frame-Kette selbst ist Timing-Verhalten und
  gehört in E2E, nicht in Vitest.

## Ausführen

```bash
npm test              # einmalig
npm run test:watch    # im Watch-Mode
```
