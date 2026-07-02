# ahommrichnuxt

[![CI](https://github.com/AHommrich/ahommrichnuxt/actions/workflows/ci.yml/badge.svg)](https://github.com/AHommrich/ahommrichnuxt/actions/workflows/ci.yml)

Persönliche Portfolio-Website von André Hommrich — Fullstack-Entwickler aus dem Westerwald. Nuxt 3, Vue 3, Tailwind CSS 4, deployt via Docker + Coolify. Live unter **[ahommrich.de](https://ahommrich.de)**.

> 🇬🇧 Also available in English: [README.md](README.md)

![Hero-Bereich mit rotiertem Diamanten-Grid — Desktop](docs/screenshots/hero-desktop.png)

![Tech-Section im Info-Modus — Desktop](docs/screenshots/tech-info-mode-desktop.png)

![Hero-Bereich — Mobile](docs/screenshots/hero-mobile.png)

![Tech-Section im Info-Modus — Mobile](docs/screenshots/tech-info-mode-mobile.png)

---

## Feature-Highlights

Sortiert von „technisch interessant" nach „UX-Feinschliff". Jeder Punkt verlinkt auf die Datei, die den Mechanismus implementiert.

1. **`requestAnimationFrame`-Physics mit Pointer-Flucht und Info-Modus** — ein einziger rAF-Loop treibt 21 Icons durch ein `x, y, vx, vy`-Modell, flieht innerhalb eines 120 px-Radius vor dem Pointer und ordnet sich auf Wunsch als alphabetisches Karten-Grid an. Ersatz für eine GSAP-Umsetzung, aus Performance-Gründen für Mobile. Touch- und Pointer-Events werden getrennt behandelt, damit das Scrollen auf Mobile keine Flucht auslöst; der Loop pausiert per `IntersectionObserver`, sobald die Section den Viewport verlässt.
   → [`components/AppTechSection.vue`](components/AppTechSection.vue)

2. **Rotiertes 8-Kachel-Diamanten-Grid im Hero** — Desktop nutzt ein rotiertes CSS-Grid mit `overflow: hidden` pro Kachel. Mobile fällt auf gestapelte Quadrate zurück, mit dokumentiertem Subpixel-Gap-Fix (`translateZ(0) scale(1.005)` + `backface-visibility: hidden`), weil iOS Safari sonst halbe-Pixel-Nähte zwischen den Kacheln rendert.
   → [`components/AppHeroSection.vue`](components/AppHeroSection.vue)

3. **Sticky Header mit `IntersectionObserver`-gesteuerter aktiver Section** — der Header hebt den aktuellen Abschnitt ohne Scroll-Listener hervor; der Slider unter der Navigation wurde in fünf Iterationen für Mobile perf-optimiert.
   → [`components/AppHeader.vue`](components/AppHeader.vue)

4. **Druckbare Lebenslauf-Route unter `/lebenslauf`** — nicht verlinkt in der Navigation, `robots: noindex, nofollow`, Print-optimiertes Layout. Bewusst öffentlich per URL erreichbar — kein Login, kein Rate-Limiting; die URL wird schlicht nicht öffentlich beworben.
   → [`pages/lebenslauf.vue`](pages/lebenslauf.vue)

5. **Null Third-Party-Runtime** — keine Analytics, kein CDN, keine Google Fonts, keine externen Scripts. FontAwesome ist lokal gebündelt und tree-shaken; die Tech-Section nutzt lokale Simple-Icons-SVGs. Bewusste DSGVO-Haltung, kein Zufall: die Datenschutzerklärung sagt „keine Cookies, kein Tracking", und der Code hält sich daran.
   → [`nuxt.config.ts`](nuxt.config.ts), [`plugins/fontawesome.client.js`](plugins/fontawesome.client.js)

6. **Tailwind CSS 4 über `@tailwindcss/vite`** — keine `tailwind.config.js`; Theme-Tokens leben im CSS über `@theme`. Dark Mode durchgängig via `dark:`-Klassen.
   → [`assets/css/main.css`](assets/css/main.css), [`nuxt.config.ts`](nuxt.config.ts)

---

## Tech-Stack

| Ebene                | Technologie                                                 |
| -------------------- | ----------------------------------------------------------- |
| Framework            | Nuxt 3 + Vue 3 + TypeScript                                 |
| Styling              | Tailwind CSS 4 (`@tailwindcss/vite`) — keine Config-Datei   |
| Icons (UI)           | FontAwesome (client-only via Nuxt-Plugin)                   |
| Icons (Tech-Section) | Simple Icons — lokale SVGs in `public/icons/`               |
| Animationen          | `requestAnimationFrame`-Loop (kein GSAP)                    |
| Runtime              | Node 20 (`.nvmrc`)                                          |
| Deploy               | Docker + Coolify (Traefik-Reverse-Proxy, Let's Encrypt TLS) |

---

## Schnellstart

```bash
nvm use              # zieht Node 20 aus .nvmrc
npm ci               # reproduzierbarer Install (nutzt package-lock.json)
npm run dev          # Dev-Server auf http://localhost:3000
```

### Verfügbare Scripts

| Befehl              | Was er tut                                    |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Dev-Server mit HMR                            |
| `npm run build`     | Production Build (Nitro `node-server`-Preset) |
| `npm run generate`  | Static Site Generation                        |
| `npm run preview`   | Production Build lokal starten                |
| `npm run lint`      | ESLint + Prettier Check                       |
| `npm run lintfix`   | ESLint Autofix + Prettier Write               |
| `npm run typecheck` | `nuxt typecheck` über `vue-tsc`               |

---

## Deployment

Production läuft auf **Coolify** (self-hosted PaaS) mit **Traefik** als Reverse-Proxy und Let's Encrypt für TLS. Deploys werden durch Push auf `main` ausgelöst; Coolify zieht das Repo, baut das Image aus dem [`Dockerfile`](Dockerfile) und tauscht den laufenden Container aus.

Für einen lokalen Production-Check: `npm run build && npm run preview`.

---

## Projekt-Struktur

```
components/    App*.vue — Header, HeroSection, AboutSection, TechSection, Footer, Card, …
pages/         index.vue, lebenslauf.vue, impressum.vue, datenschutz.vue
layouts/       default.vue
plugins/       fontawesome.client.js — FontAwesome-Setup (client-only)
public/        img/ (Portfolio-Fotos), icons/ (21 Simple-Icons-SVGs)
assets/css/    main.css — Tailwind-Entry
```

Ein ausführlicherer Rundgang durch das Animationssystem, die Mobile-Fixes und Konventionen steht in [`CLAUDE.md`](CLAUDE.md) (Kontext für KI-Assistenten, die im Repo arbeiten).

---

## Architektur (Kurzfassung)

Eine einzelne Nuxt-3-App im SSR-Modus mit Nitro-Preset `node-server`. Alle Seiten sind statischer Inhalt; es gibt keinen API-Layer, keine Datenbank, kein Auth. Die animationslastigen Komponenten (`AppTechSection`, `AppHeroSection`, `AppHeader`) laufen komplett clientseitig und sind in sich geschlossen — kein Store, keine geteilten Composables.

---

## DSGVO / Datenschutz

- **Keine Cookies, kein Tracking, keine Analytics.** Bestätigt per Grep, nicht nur per Policy.
- **Keine Third-Party-Runtime-Assets.** FontAwesome + Simple Icons sind lokal gebündelt.
- Impressum unter [`/impressum`](https://ahommrich.de/impressum) (§ 5 TMG)
- Datenschutzerklärung unter [`/datenschutz`](https://ahommrich.de/datenschutz) (Art. 13 DSGVO)

---

## Lizenz

Alle Rechte vorbehalten. Der Code ist zur Ansicht und als Referenz öffentlich, aber nicht zur Nachnutzung lizenziert. Wenn du eine Komponente oder das Setup nutzen möchtest, öffne bitte ein Issue und frag nach.
