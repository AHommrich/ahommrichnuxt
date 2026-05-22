# CLAUDE.md — ahommrichnuxt

Persönliche Portfolio-Website von André Hommrich.

## Commands

```bash
npm run dev          # Dev-Server auf Port 3000
npm run build        # Production Build
npm run generate     # Static Site Generation
npm run preview      # Production Build lokal testen
npm run lintfix      # ESLint + Prettier auto-fix
```

### Docker (Deployment)
```bash
docker compose up -d          # Starten
docker compose down           # Stoppen
docker compose build          # Image neu bauen
docker compose logs -f app    # Logs
```

## Tech Stack

- **Framework:** Nuxt 3 + Vue 3 + TypeScript
- **Styling:** Tailwind CSS v4 (via `@tailwindcss/vite` — kein `tailwind.config.js`!)
- **Icons (UI):** FontAwesome (nur client-side — immer `import.meta.client` prüfen, sonst Hydration-Fehler)
- **Icons (Tech-Section):** Simple Icons als lokale SVGs in `public/icons/` — kein FontAwesome hier!
- **Animationen:** `requestAnimationFrame` Loop (kein GSAP in AppTechSection — wurde aus Performance-Gründen ersetzt)
- **Deployment:** Docker + Caddy (Let's Encrypt SSL, externer Docker-Network)
- **Node.js:** v20 (`.nvmrc` vorhanden — `nvm use` vor Dev-Start)

## Projektstruktur

```
components/
  AppHeader.vue        # Fixed Header, IntersectionObserver-Navigation
  AppHeroSection.vue   # Diamanten-Grid (Desktop: rotiertes 8er-Grid, Mobile: gestapelte Quadrate)
  AppAboutSection.vue  # Bio-Sektion, Alter auto-berechnet (geb. 1997-03-25)
  AppTechSection.vue   # Animierte Tech-Icons (rAF Physics + Mouse/Touch-Flee + Info-Modus)
  AppFooter.vue        # Footer mit Impressum-Link
pages/
  index.vue            # Homepage (Hero + About + Tech)
  impressum.vue        # Impressum / Kontakt
layouts/
  default.vue          # Haupt-Layout
plugins/
  fontawesome.client.js  # FontAwesome Setup (client-only)
assets/
  css/main.css         # Tailwind-Import
  logo-white.svg
  logo-black.svg
  pattern-light.svg
  pattern-dark.svg
public/
  img/                 # Portfolio-Fotos (8 JPGs)
  icons/               # Simple Icons SVGs (21 Stück, alphabetisch)
```

## Design-System

- **Primärfarbe:** Burgunder `#8D1D29`
- **Dunkel-Akzent:** `#4b0b15`
- **Sprache:** Deutsch
- **Dark Mode:** Tailwind `dark:` classes
- **Responsive:** Tailwind-Breakpoints (`sm:`, `md:`, `lg:`, `xl:`)

## AppTechSection — Animationssystem

### Überblick
- **Kein GSAP** — ersetzt durch einen einzigen `requestAnimationFrame`-Loop
- Physics-basiert: jedes Icon hat `x, y, vx, vy`-State
- Icons fliehen vor Maus/Touch (`FLEE_RADIUS=120px`, `FLEE_FORCE=5`, `DAMPING=0.92`, `MIN_SPEED=0.8`)
- `IntersectionObserver` pausiert den rAF-Loop wenn Section außerhalb des Viewports
- `will-change: transform` nur auf Elementen mit `.animating`-Klasse (Performance)
- Positionen werden document-relativ gecacht — kein `getBoundingClientRect()` im rAF-Loop
- Scroll-Handler setzt Pointer-Position zurück (verhindert Flee beim Scrollen)

### Events
- **Desktop:** `pointermove` (pointer.pointerType !== 'touch')
- **Mobile:** `touchstart` / `touchmove` / `touchend` mit `touchInContainer`-Flag
- Separate Behandlung wichtig — `pointermove` allein funktioniert auf Mobile nicht

### Info-Modus (Button unten rechts)
- Klick → Icons ordnen sich als Karten an: Icon + Label, alphabetisch
- Layout: dynamisch berechnete Grid-Breite (`gridCardW`), 2+ Spalten je nach Container-Breite
- Transition-Reihenfolge: `.info-card`-Klasse + Breite setzen → Force Reflow → `transform`-Transition starten → `infoMode.value = true` im nächsten rAF-Frame
- Labels: `v-show` (nicht `v-if`) um DOM-Mutation während Transition zu vermeiden
- Container-Höhe wird dynamisch per JS gesetzt (grid-basiert)

### Icons (21 Stück in `public/icons/`)
alphabetisch: anthropic, apple, bootstrap, css3, docker, git, github, gitlab, html5, javascript, jetbrains, laravel, linux, mysql, openai, php, symfony, tailwindcss, typescript, visualstudiocode, vuedotjs

- Darstellung: `<img>` mit `filter: brightness(0) invert(1)` (weiß im Dark Mode)
- `openai.svg` und `visualstudiocode.svg` kommen NICHT von simpleicons.org (dort entfernt) — aus Iconify-API bzw. vscode-material-icon-theme GitHub
- Apple-Label: "Apple Ecosystem" (Sonderfall)

## AppHeroSection — Mobile Subpixel-Gap-Fix

Mobile Diamonds haben weiße Lücken zwischen den `overflow:hidden`-Elementen durch Subpixel-Rendering auf echten Geräten. Fix via `<style scoped>`:

```css
.mobile-diamonds > div > div {
  outline: 1px solid transparent;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  transform: translateZ(0) scale(1.005);
}
```

Der `sm:hidden mobile-diamonds`-Wrapper ist bereits am mobilen Abschnitt gesetzt.

## Wichtige Konventionen

- Tailwind v4: Kein `tailwind.config.js`, Konfiguration via CSS (`@theme`, `@layer`)
- FontAwesome immer nur client-side (`import.meta.client` oder `.client.js` Plugin)
- Scoped Styles in Komponenten erlaubt
- ESLint + Prettier — vor Commit `npm run lintfix` ausführen
- Nuxt Server Preset: `node-server` (kein Static Export im Standard-Deploy)
- Bei neuen Simple Icons: prüfen ob auf simpleicons.org verfügbar — manche Icons (openai, vscode) wurden entfernt und müssen von Alternativquellen geholt werden

## Über André (Kontext für Texte)

- Beruflich: Fachinformatiker für Anwendungsentwicklung in einer Agentur (CRM-Systeme)
- Backend-Fokus: **Symfony** (beruflich), **Laravel** (privat)
- Frontend: **Vue.js** (primär), React Native (mobile Apps)
- KI-Tools (Claude Code etc.) als Kooperationspartner — nicht als Ersatz für eigenes Denken
- Herkunft: Westerwald
- Vorheriger Werdegang: Elektroniker → Industrie → Softwareentwicklung
