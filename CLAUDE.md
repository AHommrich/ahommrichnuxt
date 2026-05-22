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
- **Icons:** FontAwesome (nur client-side — immer `import.meta.client` prüfen, sonst Hydration-Fehler)
- **Animationen:** GSAP v3
- **Deployment:** Docker + Caddy (Let's Encrypt SSL, externer Docker-Network)

## Projektstruktur

```
components/
  AppHeader.vue        # Fixed Header, IntersectionObserver-Navigation
  AppHeroSection.vue   # Rotierende Bilder-Grid (8 Quadrate)
  AppAboutSection.vue  # Bio-Sektion, Alter auto-berechnet (geb. 1997-03-25)
  AppTechSection.vue   # Animierte Tech-Icons (GSAP Physics + Mouse-Flee)
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
public/img/            # Portfolio-Fotos (8 JPGs)
```

## Design-System

- **Primärfarbe:** Burgunder `#8D1D29`
- **Dunkel-Akzent:** `#4b0b15`
- **Sprache:** Deutsch
- **Dark Mode:** Tailwind `dark:` classes
- **Responsive:** Tailwind-Breakpoints (`sm:`, `md:`, `lg:`, `xl:`)

## Wichtige Konventionen

- Tailwind v4: Kein `tailwind.config.js`, Konfiguration via CSS (`@theme`, `@layer`)
- FontAwesome immer nur client-side (`import.meta.client` oder `.client.js` Plugin)
- Scoped Styles in Komponenten erlaubt
- ESLint + Prettier — vor Commit `npm run lintfix` ausführen
- Nuxt Server Preset: `node-server` (kein Static Export im Standard-Deploy)
