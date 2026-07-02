# Refactor-Plan: ahommrichnuxt bewerbungsreif machen

> **Status: PLAN-ONLY — nicht zur sofortigen Ausführung.**
>
> Diese Datei ist die Übergabe-Spezifikation für einen späteren Claude-Code-Chat, der die Umsetzung **mit einem nicht-technischen Kollegen als Operator** durchführt. Der ausführende Claude darf erst beginnen, wenn André den Refactor explizit startet. Bis dahin: keine Branches, keine Commits, keine npm-Installs, keine Datei-Änderungen im Repo.
>
> Bei kritischen Stellen stellt der ausführende Claude eine Rückfrage an André (siehe Stop-Punkt-Übersicht am Ende). Alles andere wird mit dem Kollegen abgewickelt.

---

## Kurzanleitung für den Kollegen (nicht-technisch)

So startest du das Refactoring mit Claude Code:

1. **Repo klonen** (falls noch nicht geschehen):
   ```bash
   git clone <repo-url> ahommrichnuxt
   cd ahommrichnuxt
   ```
2. **Claude Code öffnen** in diesem Repo-Verzeichnis.
3. **Diesen Prompt eingeben** (kopieren und einfügen):

   > Bitte arbeite den `REFACTOR_PLAN.md` im Repo-Root Schritt für Schritt ab. Beginne mit Phase 0. Halte dich strikt an die Stop-Punkte — bei `🛑` fragst du mich (den Kollegen), bei `❓` muss André bestätigen. Beginne erst, wenn ich dir das OK gebe.

4. **Worauf du achten musst:**
   - Bei `🛑 STOP — Kollegenbestätigung`: Claude erklärt dir, was er gemacht hat. Du prüfst visuell (z.B. Website im Browser, oder eine Stelle im Code) und sagst „passt" oder „nein, das sieht anders aus".
   - Bei `❓ STOP — Rückfrage an André`: Du brichst die Sitzung kurz ab und schreibst André eine Nachricht. Erst weitermachen, wenn André geantwortet hat.
   - Bei Fehlern: NIE „Skip" oder „--no-verify" — Claude soll die Ursache finden.

5. **Wenn du unsicher bist:** Frag Claude „Was bedeutet das?" — er erklärt es dir auf Deutsch und ohne Fachjargon.

---

## Context

Das Repo `ahommrichnuxt` ist André Hommrichs persönliche Portfolio-Website. Es soll als Referenz bei Bewerbungen mitgegeben werden — d.h. Recruiter und Tech-Leads klonen das Repo, gucken in den Code und sollen einen professionellen Eindruck bekommen.

**Aktueller Zustand laut Audit (2026-06-30):**

- Code grundsätzlich gut kommentiert (besonders `AppTechSection.vue`), aber massive Template-Duplikationen (Diamond-Tiles 13×, Card-Pattern 4×) und hardcoded Hex-Farben (22 Treffer)
- README ist Nuxt-Default-Boilerplate, keine LICENSE, `package.json` Metadaten unvollständig
- **Keine Tests**, keine CI/CD, keine Commit-Convention-Enforcement
- Commit-History stark unsauber (`asdf`, `final homepage`, `refactor X 1–5`)
- `pages/lebenslauf.vue` mit 1167 Zeilen unhandlich
- `Dockerfile` ohne Multi-Stage-Build, ohne non-root User
- Deprecated API in `AppHeader.vue:180` (`performance.navigation.type`)

**Ziel:** Repo aufräumen ohne sichtbare Verhaltensänderungen. Pflichtangaben (Impressum, Datenschutz) und die Inhalte/Texte bleiben unverändert.

**Strategische Entscheidungen (vom User bestätigt):**

- Lizenz: **All Rights Reserved** (persönliche Fotos/Texte im Repo)
- Git-Historie: **squashen** in thematische Blöcke (Backup-Branch + User-Bestätigung vor Force-Push)
- Tests: **Vitest (Unit) + Playwright (E2E)**
- CI: **GitHub Actions** mit Lint + Typecheck + Build + Test

---

## Wie dieser Plan abgearbeitet wird

**Zielgruppe der Ausführung:** Ein anderer Claude-Code-Chat mit einem **nicht-technischen Kollegen** als Gegenüber. Daher gilt:

- **Eine Phase = ein Feature-Branch + ein abschließender Commit** (Conventional Commits, siehe Phase 1)
- **Stop-Punkte** sind explizit markiert mit `🛑 STOP — Kollegenbestätigung` oder `❓ STOP — Rückfrage an André`
- Bei UI-relevanten Änderungen: `npm run dev` starten, Screenshot oder Live-Vergleich mit dem Kollegen vor Merge
- Bei Build-/Lint-/Test-Failures: NICHT mit `--no-verify` umgehen, sondern Ursache finden
- Die `main`-Branch bleibt während Phase 1–5 unangetastet — alle Arbeit auf `refactor/*` Branches, gemerged via lokalem `git merge --no-ff` (kein GitHub-PR-Zwang, da Solo-Repo)
- **Phase 6 (History-Rewrite) erfolgt erst nach Phase 1–5 und IMMER mit expliziter André-Bestätigung**

---

## Phase 0 — Safety & Setup

**Branch:** `chore/refactor-setup`

1. Backup-Tag setzen: `git tag backup/pre-refactor-$(date +%Y%m%d) && git push --tags`
2. Backup-Branch erstellen: `git branch backup/main-pre-refactor main && git push -u origin backup/main-pre-refactor`
3. `~/.nvm/versions/node/v20.19.4/bin/node` Pfad verifizieren (siehe `CLAUDE.md` ESLint-Fallstrick)
4. `npm install` ausführen, prüfen dass `npm run dev`, `npm run build`, `npm run lintfix` alle grün laufen
5. **Baseline-Screenshots** der Live-Site (Desktop + Mobile, Homepage + Lebenslauf + Impressum + Datenschutz) im Ordner `/tmp/baseline-screenshots/` ablegen — diese sind die visuelle Referenz für alle UI-Refactors

🛑 **STOP — Kollegenbestätigung:** Backup-Tag + Backup-Branch existieren auf GitHub. Baseline-Screenshots sind vollständig.

---

## Phase 1 — Commit-Hygiene (zuerst, damit alles Folgende sauber landet)

**Branch:** `chore/commit-conventions`

1. Installieren: `npm i -D husky @commitlint/cli @commitlint/config-conventional`
2. `npx husky init` ausführen
3. `.husky/commit-msg` schreiben: `npx --no -- commitlint --edit "$1"`
4. `.husky/pre-commit` schreiben: `npm run lintfix && npm run typecheck` (typecheck-Script in Phase 5 ergänzt — bis dahin nur lintfix)
5. `commitlint.config.js` mit `extends: ['@commitlint/config-conventional']`
6. **CONTRIBUTING.md** anlegen mit:
   - Conventional Commits Cheatsheet (feat/fix/refactor/docs/chore/test/ci/style/perf)
   - Branch-Naming (`feat/*`, `fix/*`, `refactor/*`, `chore/*`, `docs/*`)
   - Kurze Erklärung warum (für Recruiter, die ins Repo gucken)
7. Test: Manueller Versuch eines `git commit -m "asdf"` muss vom Hook abgelehnt werden

**Conventional Commit:** `chore: enforce conventional commits via husky + commitlint`

🛑 **STOP — Kollegenbestätigung:** Test-Commit mit Müll-Message wurde abgelehnt. Test-Commit mit `chore: foo` wurde akzeptiert.

---

## Phase 2 — Code-Refactor (in mehreren kleinen Branches)

Jeder Sub-Branch wird **einzeln** abgearbeitet, gemerged, dann der nächste. Reihenfolge ist relevant.

### 2.1 `refactor/extract-pure-functions`

Verzeichnisse anlegen: `utils/` und `composables/`

Extraktionen:
- `utils/age.ts` → `calculateAge(birthday: Date, today = new Date()): number` (aus `AppAboutSection.vue:8-17`)
- `utils/grid.ts` → `computeGrid(containerW, minW, gap, pad)` (aus `AppTechSection.vue:255-265`)
- `utils/physics.ts` → `ensureMinSpeed`, `applyFleeForce`, `bounceInBounds` (aus `AppTechSection.vue:430-503`)
- `utils/scroll-slider.ts` → `computeSliderPosition(scrollY, vh, midpoints, navMetrics)` (aus `AppHeader.vue:106-139`)
- `utils/flip.ts` → `computeFlipTransform(bbox, cfg)` (aus `AppFullstackScene.vue:79-99`)

Alle extrahierten Funktionen erhalten **TSDoc** mit `@param`/`@returns`/Beispiel.

Alle Originalkomponenten importieren die neuen Utils und nutzen sie — kein toter Code zurücklassen.

**Verifikation:** `npm run dev` → visuelle Parität mit Baseline-Screenshots prüfen, insbesondere TechSection-Animation und Header-Slider.

**Conventional Commit:** `refactor: extract pure functions into utils/`

🛑 **STOP — Kollegenbestätigung:** TechSection animiert wie vorher, Header-Slider bewegt sich beim Scrollen wie vorher, Alter im AppAboutSection ist korrekt.

### 2.2 `refactor/diamond-tile-component`

Neue Komponente `components/DiamondTile.vue` mit Props: `image`, `iconSlot`/`icon`, `caption`, `overlayColor`, `overlayPosition`, `mode: 'desktop' | 'mobile'`

`AppHeroSection.vue` umbauen: die 13× Duplikation durch eine Liste von Konfig-Objekten + `v-for` mit `<DiamondTile>` ersetzen.

**Mobile-Subpixel-Fix** (siehe `CLAUDE.md`) muss in `DiamondTile.vue` als scoped style erhalten bleiben.

❓ **STOP — Rückfrage an André:** Die Diamond-Cluster-Geometrie (Magic Numbers `-left-[200px]`, `-top-[400px]` etc. in den Mobile-Tiles) wird beim Refactor zu Daten — bitte einen Augenblick gemeinsam auf Mobile (375×812) gucken, ob die Tiles exakt gleich sitzen. Visuelle Drift hier ist nicht ausschließbar.

**Conventional Commit:** `refactor(hero): extract DiamondTile component (13x dedup)`

### 2.3 `refactor/reuse-app-card`

`AppCard.vue` existiert bereits aber wird nur stellenweise genutzt. Drei Komponenten haben das identische `card-group`-Pattern dupliziert:

- `AppAboutSection.vue`
- `AppCurrentlySection.vue`
- `AppTechSection.vue` (vorsichtig — die Section hat zusätzlich das Animationssystem, der Card-Wrapper ist nur der äußere Container)

`AppCard.vue` so erweitern (Slots/Props), dass alle drei es nutzen können, ohne Funktionalität zu verlieren. IntersectionObserver-Logik kann in ein Composable `composables/useCardReveal.ts` wandern.

**Verifikation:** Hover-Effekte, Reveal-Animation, Dark Mode prüfen.

**Conventional Commit:** `refactor: consolidate card-group pattern via AppCard + useCardReveal`

### 2.4 `refactor/color-tokens`

Tailwind v4 nutzt `@theme` in CSS. In `assets/css/main.css` einen `@theme`-Block ergänzen:

```css
@theme {
  --color-brand-burgundy: #8D1D29;
  --color-brand-burgundy-dark: #4b0b15;
  --color-brand-graphite: #3b4245;
}
```

Alle 22 Hex-Treffer durch `var(--color-brand-*)` oder Tailwind-Utilities (`bg-brand-burgundy`, `text-brand-burgundy-dark`) ersetzen.

**Conventional Commit:** `refactor(styles): centralize brand colors as theme tokens`

### 2.5 `refactor/lebenslauf-data-extraction`

⚠️ **Wichtig laut Memory:** `pages/lebenslauf.vue` bleibt **statisch**, keine Animation, Homepage-Stil nur als „ausgeklappter" Endzustand. Refactor betrifft NUR Daten-Trennung.

- Neuer Ordner `data/`
- `data/cv.ts` mit typisierten Konstanten: `experience`, `projects`, `skills`, `education` (Daten aus `lebenslauf.vue:24+`)
- `lebenslauf.vue` importiert diese — Template bleibt 1:1, Script schrumpft von 197 auf ~30 Zeilen
- Globalen `<style>`-Block am Ende von `lebenslauf.vue` mit klarem Kommentar versehen warum er global sein muss (Print-Styles)

**Verifikation:** `/lebenslauf` Seite und PDF-Print sehen identisch aus.

**Conventional Commit:** `refactor(lebenslauf): extract CV data into data/cv.ts`

### 2.6 `fix/deprecated-performance-navigation`

`AppHeader.vue:180`: `window.performance.navigation.type === 1` ist deprecated.

Ersetzen durch:

```ts
const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
const isReload = navEntry?.type === 'reload';
```

Kurzen TSDoc-Kommentar mit Begründung dazu (warum Reload speziell behandelt wird).

Außerdem: `onBeforeMount` zum Import-Statement hinzufügen (aktuell läuft über Vue-Auto-Import, ist inkonsistent).

**Conventional Commit:** `fix(header): replace deprecated performance.navigation API`

### 2.7 `refactor/dockerfile-best-practices`

`Dockerfile` neu schreiben:

- Multi-Stage-Build (builder + runtime)
- `npm ci --omit=dev` im Runtime-Stage
- Non-root User (`USER node`)
- `HEALTHCHECK` ergänzen
- Englische Kommentare statt der aktuellen deutschen Trivial-Kommentare
- `.dockerignore` ergänzen (node_modules, .git, .nuxt, .output, .vscode, *.md außer LICENSE)

**Verifikation:** `docker compose build && docker compose up -d`, Site lädt auf konfiguriertem Port, `docker compose logs app` zeigt keine Fehler.

❓ **STOP — Rückfrage an André:** Aktuell läuft Production via Caddy + Docker. Bevor der neue Dockerfile in Production geht, einmal mit André die Caddy-Network-Konfiguration cross-checken — das Image-Verhalten beim Reverse-Proxy-Setup kann sich ändern.

**Conventional Commit:** `refactor(docker): multi-stage build, non-root user, healthcheck`

### 2.8 `refactor/named-constants`

Magic Numbers benennen statt nur kommentieren:
- `AppHeader.vue`: `HEADER_OFFSET_PX = 100`, `RESIZE_REMEASURE_MS = 500`, `IO_THRESHOLD = 0.5`
- `AppTechSection.vue`: bereits viele benannt (Z.155-163), ergänzen: `INFO_BAR_HEIGHT_PX = 52`, `CARD_*`-Konstanten (242-245), `PULSE_ANIMATION_S = 1.4`, `STAGGER_MS = 20`, `POINTER_PARKING_PX = -1000`
- `AppAboutSection.vue` etc.: IO-Thresholds benennen mit Begründung im TSDoc

Den `any`-Cast in `AppTechSection.vue:87` durch ein typisiertes Ref-Setter-Pattern ersetzen oder via `// eslint-disable-next-line` mit klarer Begründung versehen.

**Conventional Commit:** `refactor: replace magic numbers with named constants`

---

## Phase 3 — Tests

### 3.1 `test/setup-vitest`

- Installieren: `npm i -D vitest @vitest/coverage-v8`
- `vitest.config.ts` mit Nuxt-kompatibler Test-Umgebung
- `npm run test` Script ergänzen
- Coverage-Threshold zunächst niedrig (60% Lines) — wird in Phase 5 von CI geprüft

**Conventional Commit:** `test: add vitest setup`

### 3.2 `test/unit-tests-pure-functions`

Tests schreiben für die in Phase 2.1 extrahierten Utils:

- `utils/age.test.ts` — 5 Tests inkl. Geburtstag-heute, Schaltjahr, vor/nach Geburtstag
- `utils/grid.test.ts` — 4 Tests: Min-Cols, Sehr breiter Container, Edge case 0, normale Werte
- `utils/physics.test.ts` — 6 Tests: `ensureMinSpeed` bei speed=0, `applyFleeForce` außerhalb Radius (no-op), innerhalb Radius (Vektor stimmt), `bounceInBounds`
- `utils/scroll-slider.test.ts` — 4 Tests: vor erster Section, nach letzter, zwischen zwei (Interpolation), exakt an Midpoint
- `utils/flip.test.ts` — 3 Tests: Identity-Transform, Scale, Translate

**Insgesamt ~22 Tests, alle synchron, kein JSDOM nötig.**

**Conventional Commit:** `test: cover extracted utils with vitest`

### 3.3 `test/setup-playwright`

- Installieren: `npm i -D @playwright/test`
- `npx playwright install --with-deps chromium`
- `playwright.config.ts` mit `webServer: { command: 'npm run dev', port: 3000 }`
- `npm run test:e2e` Script

**Conventional Commit:** `test: add playwright setup for e2e`

### 3.4 `test/e2e-smoke`

Drei E2E-Tests in `e2e/`:

- `homepage.spec.ts` — `/` lädt, alle vier Section-IDs sind im DOM, h1 enthält "André Hommrich"
- `lebenslauf.spec.ts` — `/lebenslauf` lädt, Print-Button sichtbar und klickbar (window.print stubben)
- `tech-toggle.spec.ts` — `/`, scroll zur Tech-Section, Info-Button klicken, Klassenwechsel `.info-card` ↔ `.animating` prüfen

**Conventional Commit:** `test(e2e): smoke tests for homepage, lebenslauf, tech-toggle`

---

## Phase 4 — Dokumentation

### 4.1 `docs/license`

`LICENSE` im Root:

```
Copyright (c) 2026 André Hommrich

All Rights Reserved.

This repository contains personal portfolio content including photos, biographical
information, and source code. No license is granted to use, copy, modify, merge,
publish, distribute, sublicense, or sell copies of the contents of this repository
without prior written permission from the copyright holder.

The repository is published for the sole purpose of demonstrating the author's
work to prospective employers and collaborators.
```

**Conventional Commit:** `docs: add all-rights-reserved license`

### 4.2 `docs/readme-overhaul`

`README.md` komplett neu, Sektionen:

1. **Titel + One-Liner**: "André Hommrich — Personal Portfolio"
2. **Live**: Link zu hommri.ch
3. **Tech Stack**: Nuxt 3, Vue 3, TS, Tailwind v4, FontAwesome, Docker+Caddy
4. **Highlights**: rAF-Physics-System der TechSection (kurz erklärt), Diamond-Hero-Grid, statischer Lebenslauf mit Print-Layout
5. **Setup**: `nvm use` + `npm install` + `npm run dev`
6. **Scripts**: dev/build/generate/preview/lint/lintfix/test/test:e2e
7. **Deployment**: Docker + Caddy, Verweis auf `Dockerfile`/`docker-compose.yml`/`Caddyfile`
8. **Projektstruktur**: aus CLAUDE.md übernehmen (für Menschen lesbar)
9. **Design**: Brand-Farben, Sprache (de-DE), Dark Mode via `prefers-color-scheme`
10. **Tests + CI**: Vitest/Playwright + GitHub Actions Status-Badge
11. **Lizenz**: All Rights Reserved, Verweis auf LICENSE
12. **Kontakt**: Link zu Impressum, ggf. GitHub-Profil

**Wichtig laut Memory:** Texte nicht in glatte KI-Werbesprache umschreiben. README darf nüchtern und sachlich sein — keine Marketing-Floskeln.

**Screenshots:** 2-3 kleine PNGs in `docs/screenshots/` (Hero Desktop, TechSection, Lebenslauf) einbinden.

**Conventional Commit:** `docs: rewrite README for portfolio showcase`

### 4.3 `docs/package-metadata`

`package.json` ergänzen:

```json
{
  "name": "ahommrichnuxt",
  "description": "André Hommrichs Portfolio-Website (Nuxt 3 / Vue 3 / TypeScript / Tailwind v4)",
  "version": "1.0.0",
  "private": true,
  "author": "André Hommrich <kontakt@hommri.ch>",
  "repository": { "type": "git", "url": "..." },
  "license": "SEE LICENSE IN ./LICENSE"
}
```

❓ **STOP — Rückfrage an André:** Welche Repository-URL soll rein? Aktuelle Remote-URL via `git remote get-url origin` prüfen — ggf. ist das ein privates Repo, dann muss die URL nicht in `package.json` (kann auf "private" gesetzt bleiben).

**Conventional Commit:** `chore: populate package.json metadata`

### 4.4 `docs/editor-config`

- `.editorconfig` (UTF-8, LF, 2 spaces, final newline, trim trailing whitespace)
- `.gitattributes` (text=auto eol=lf, binäre Bilder als binary markieren)

**Conventional Commit:** `chore: add editorconfig and gitattributes`

### 4.5 `docs/jsdoc-pass`

JSDoc-Blöcke ergänzen an:

- Allen extrahierten Utils (sollten schon aus 2.1 da sein — sicherstellen)
- Den 4 komplexesten Stellen in `AppTechSection.vue` (Physics-Loop, toggleInfoMode, ensureMinSpeed-Aufruf, computeGrid-Aufruf)
- `AppHeader.vue` Slider-System (ein zusammenfassender Block am Anfang des Scripts)
- `AppFullstackScene.vue` FLIP-Animation (zusammenfassender Block)
- `composables/useCardReveal.ts` (falls in 2.3 erstellt)

**Conventional Commit:** `docs: add JSDoc blocks to complex code paths`

### 4.6 `docs/claude-md-cleanup`

`CLAUDE.md` aktualisieren — alle in Phase 2 geänderten Pfade/Patterns/Konventionen einarbeiten. Insbesondere:

- Neue `utils/`, `composables/`, `data/` Ordner erwähnen
- Test-Workflow ergänzen (`npm run test`, `npm run test:e2e`)
- Commit-Convention-Verweis (auf `CONTRIBUTING.md`)
- Veraltete Hinweise entfernen

**Conventional Commit:** `docs: update CLAUDE.md to reflect refactor changes`

---

## Phase 5 — CI/CD

### 5.1 `ci/github-actions`

`.github/workflows/ci.yml`:

```yaml
name: CI
on:
  push: { branches: [main] }
  pull_request:
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version-file: '.nvmrc', cache: 'npm' }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run build
      - run: npm run test -- --coverage
      - uses: actions/upload-artifact@v4
        if: always()
        with: { name: coverage, path: coverage/ }

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version-file: '.nvmrc', cache: 'npm' }
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
```

`typecheck`-Script in `package.json`: `nuxt typecheck` (benötigt `vue-tsc` als devDep).

`.github/dependabot.yml` ergänzen (wöchentlich, npm + github-actions).

`.github/PULL_REQUEST_TEMPLATE.md` mit Checkliste (Lint, Tests, Screenshots bei UI-Änderung).

**Conventional Commit:** `ci: add github actions for lint, typecheck, build, test, e2e`

🛑 **STOP — Kollegenbestätigung:** GitHub Actions Run auf Push grün. Falls rot: Ursache fixen, NICHT CI ausschalten oder skippen.

---

## Phase 6 — History-Cleanup (DESTRUKTIV — am Ende!)

❓ **STOP — Rückfrage an André (Pflicht-Stop):** Phasen 0–5 sind alle gemerged, Tests grün, CI grün, Site läuft. Soll der History-Rewrite jetzt durchgeführt werden?

**Backup-Check zwingend vor Rewrite:**
- `git tag -l backup/pre-refactor-*` zeigt mindestens einen Tag
- `git branch -a | grep backup/main-pre-refactor` existiert lokal und auf origin
- Optional zusätzlich: kompletter Zip-Snapshot des Repos lokal

### 6.1 Squash-Strategie

Interactive Rebase auf den letzten ~50 Commits. Thematische Gruppierung (chronologisch, aber Inhalte konsolidiert):

1. `feat: initial nuxt project setup`
2. `feat: hero section with diamond grid layout`
3. `feat: about section with auto-calculated age`
4. `feat: tech section with rAF physics animation`
5. `feat: header with intersection-observer driven slider`
6. `feat: impressum and datenschutz pages`
7. `feat: lebenslauf page with print layout`
8. `feat: fullstack scene with FLIP animation`
9. `feat: docker + caddy deployment setup`
10. `style: dark mode and brand color refinement`
11. `perf: header slider mobile optimization`
12. (Ab hier: alle Refactor-Commits aus Phasen 1–5 bleiben **unverändert** — sie sind ja schon sauber)

Konkrete Befehle baut der ausführende Claude live mit dem Kollegen, basierend auf dem aktuellen `git log`.

### 6.2 Force-Push

❓ **STOP — Rückfrage an André (Pflicht-Stop):** Lokaler Rebase fertig, `git log --oneline` zeigt saubere Historie. Force-Push auf `origin/main` JETZT durchführen?

`git push --force-with-lease origin main`

(`--force-with-lease` statt `--force` — verhindert Überschreiben, falls jemand parallel gepusht hat. Solo-Repo, sollte aber Standard sein.)

### 6.3 Cleanup

- Backup-Branch behalten für 30 Tage, dann ggf. löschen
- `git gc --prune=now` lokal um alte Referenzen zu räumen

---

## Phase 7 — Final Verification

Auf einem **frischen Clone** (ohne lokale Reste):

```bash
git clone <repo-url> /tmp/portfolio-check
cd /tmp/portfolio-check
nvm use && npm ci
npm run lint && npm run typecheck && npm run test && npm run build
npm run dev    # manuell prüfen: Homepage, Lebenslauf, Impressum, Datenschutz
npm run test:e2e
docker compose build
```

Alles muss auf einem ungekannten Rechner aus dem Stand "frisch geklont" laufen.

🛑 **STOP — Kollegenbestätigung:** Frischer Clone läuft komplett durch ohne manuelle Tricks. README ist verständlich. CI ist grün. Site sieht aus wie Baseline-Screenshots.

---

## Stop-Punkt-Übersicht (für den ausführenden Claude)

**Pflicht-Stops für André (technische Entscheidungen):**

- Phase 2.2: Mobile-Diamond-Geometrie nach Refactor visuell prüfen
- Phase 2.7: Caddy-Network-Cross-Check vor Docker-Production-Deploy
- Phase 4.3: Repository-URL in package.json klären
- Phase 6 (zweimal!): Vor Rebase + vor Force-Push

**Kollegen-Bestätigungen (visuell/funktional):**

- Nach Phase 0: Backup vorhanden, Baseline-Screenshots gemacht
- Nach Phase 1: Commit-Hook lehnt Müll-Messages ab
- Nach jedem Phase-2-Sub-Branch: visuelle Parität mit Baseline
- Nach Phase 3: alle Tests grün lokal
- Nach Phase 5: GitHub-Actions-Run grün
- Nach Phase 7: Frischer Clone läuft komplett

**Wenn unklar → immer eher bei André nachfragen als Annahmen treffen.** Speziell bei:

- Texte auf der Seite ändern (Originalstimme respektieren — keine Werbesprache)
- Arbeitgeber-Namen einbauen (Memory-Regel: keine konkreten Arbeitgeber auf der Homepage)
- Lebenslauf-Animation hinzufügen (Memory-Regel: bleibt statisch!)

---

## Geschätzter Aufwand

Ohne Anspruch auf Genauigkeit, grobe Hausnummern:

- Phase 0–1: 1 Sitzung
- Phase 2 (7 Sub-Branches): 3–5 Sitzungen
- Phase 3: 2 Sitzungen
- Phase 4: 1–2 Sitzungen
- Phase 5: 1 Sitzung
- Phase 6: 1 Sitzung
- Phase 7: 1 Sitzung

= **10–13 Arbeitssitzungen** mit dem Kollegen, jeweils 30–90 Min.
