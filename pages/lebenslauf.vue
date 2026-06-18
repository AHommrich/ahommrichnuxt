<script setup lang="ts">
// Standalone CV page — does not use the default site layout so the print
// output stays clean and self-contained.
definePageMeta({
  layout: false,
});

useSeoMeta({
  title: "Lebenslauf — André Hommrich",
  description: "Lebenslauf von André Hommrich.",
  robots: "noindex, nofollow, noarchive",
});

useHead({
  htmlAttrs: { lang: "de", class: "cv-route" },
});

// Triggers the browser's native print dialog, used by the user to save as PDF.
function downloadPdf() {
  window.print();
}

// Career history — most recent first.
const experience = [
  {
    period: "Seit 06.2025",
    company: "Creavo Projekt GmbH",
    location: "Limburg",
    role: "PHP Webentwickler",
    bullets: [
      "Backend-Entwicklung mit Symfony und dazugehörigem Ökosystem (Doctrine etc.)",
      "Frontend-Entwicklung mit Twig, Bootstrap und einzelnen JavaScript-Packages nach ES6",
      "CI/CD Konfigurationen",
      "Umfangreiches Testing mit PHPUnit",
      "KI-gestützte Softwareentwicklung (Claude Code & Junie)",
    ],
  },
  {
    period: "08.2022 – 06.2025",
    company: "AWESOME! Software GmbH",
    location: "Montabaur",
    role: "Ausbildung Fachinformatiker für Anwendungsentwicklung",
    bullets: [
      "Frontend-Entwicklung mit Vue.js, React und modernen JavaScript-Bibliotheken",
      "Backend-Entwicklung mit Laravel und dazugehörigem Ökosystem (Spatie etc.)",
      "Containerisierung mit Docker",
      "Hosting von Webapplikationen",
      "Ausbildung und Betreuung von Azubis und Praktikanten",
    ],
  },
  {
    period: "09.2018 – 07.2022",
    company: "Prior1 GmbH",
    location: "Sankt Augustin",
    role: "Servicetechniker",
    bullets: [
      "RZ-Installationen",
      "Netzwerk-Verkabelungen",
      "Wartungen & Inbetriebnahmen",
      "Vorarbeiter-Tätigkeiten",
    ],
  },
  {
    period: "09.2017 – 08.2018",
    company: "Modul-Technik GmbH",
    location: "Montabaur",
    role: "Fertigung & Montage",
    bullets: [
      "Elektro-Prüfungen und Fertigung von medizinischen Versorgungseinheiten",
      "Installation der Produkte vor Ort",
    ],
  },
  {
    period: "08.2014 – 08.2017",
    company: "Michael Bruch Elektrotechnik GmbH",
    location: "Helferskirchen",
    role: "Ausbildung & Geselle — Elektriker für Energie- und Gebäudetechnik",
    bullets: [
      "Rohbau-Installationen",
      "Kundendienst",
      "TV-Sat-Anlagen / KNX & EIB / Netzwerk",
    ],
    extra: "Abschluss: Sekundarabschluss I",
  },
];

// Project history — most recent first.
const projects = [
  {
    client: "grapeminds GmbH",
    role: "Frontend-Entwicklung",
    stack: [
      "Ionic",
      "Vue 3",
      "TypeScript",
      "CSS3",
      "Xcode",
      "Android Studio",
      "Chart.js",
    ],
    description:
      "Webapplikation mit ergänzender Smartphone-App zur Verwaltung von Weinbeständen und Bereitstellung von Informationen zu den vorhandenen Weinen. Als Frontend-Entwickler habe ich neue Features entwickelt, bestehende Komponenten optimiert und die Codebasis refaktoriert. Durch selbstständige Arbeitsweise wurden Entwicklungsprozesse effizienter und die Qualität der Anwendung kontinuierlich verbessert.",
  },
  {
    client: "HIDO Immobilien",
    role: "Webentwicklung",
    stack: ["Nuxt 3", "Tailwind CSS", "HTML5", "CSS3", "Docker", "Node.js"],
    description:
      "Vollständig selbst entwickelte und gehostete Nuxt 3 Landing Page für ein Immobilienberatungsunternehmen. Inklusive Microservice-Erweiterung für die serverseitige Verarbeitung von Kontaktanfragen über die Nuxt 3 Server-Routes.",
  },
  {
    client: "AWESOME! Software — CRM",
    role: "Fullstack-Entwicklung",
    stack: [
      "Laravel",
      "Vue 2",
      "JavaScript ES6",
      "MySQL",
      "Docker",
      "HTML5",
      "CSS3",
    ],
    description:
      "Erweiterung des internen CRM um eine Forecast-Funktion, die Vertriebsmitarbeitern Überblick über Mitarbeiter und Freiberufler bietet — inkl. Projektdauer, Austrittszeitpunkten und Umsatz-/Gewinnprognosen mit Zielvorgaben und optischem Feedback. Abwesenheiten werden in Umsatz- und Gewinnberechnungen automatisch berücksichtigt. Zusätzlich Implementierung eines systemweiten Aktivitäten-Logs, das jegliche Änderungen lückenlos nachvollziehbar dokumentiert.",
  },
  {
    client: "AWESOME! Software — Mitarbeiterplattform",
    role: "Fullstack-Entwicklung",
    stack: [
      "Nuxt 3",
      "Vue 3",
      "Tailwind CSS",
      "Laravel",
      "HTML5",
      "CSS3",
      "Docker",
    ],
    description:
      "Modernisierung der Firmenwebsite des Ausbildungsbetriebs und Erweiterung um eine Mitarbeiter- und Zeitmanagement-Plattform. Interne und externe Mitarbeiter verwalten ihre Profile, erfassen Arbeitszeiten und erhalten eine Gesamtübersicht über aktuelle Zeiten und Projektlaufzeiten.",
  },
  {
    client: "Abschlussprojekt — eLade-Monitoring",
    role: "Fullstack-Entwicklung",
    stack: [
      "Laravel",
      "React",
      "Inertia",
      "PHP",
      "TypeScript",
      "JavaScript ES6",
      "MySQL",
      "Docker",
      "Axios",
      "Chart.js",
    ],
    description:
      "Monitoring-System für die Wallboxen am Bürostandort, betrieben auf einem Raspberry Pi des Ausbildungsbetriebs. Echtzeit-Erfassung von Ladedaten, Stromverbrauch, Strompreisen und Netzbelastung. Berechnung von Ladeleistung, geladener Energie und Stromkosten sowie Überwachung der Phasenbelastung am Hausanschluss zur Vermeidung von Überlastungen. Visualisierung über einen zentral aufgestellten Monitor mit React-Frontend.",
  },
];

// Skills mirror the icon set rendered in AppTechSection on the homepage,
// grouped by domain so the sidebar stays compact and scannable.
const skillset = [
  {
    label: "Frontend",
    items:
      "Vue.js, Nuxt.js, JavaScript, TypeScript, HTML5, CSS3, Tailwind CSS, Bootstrap, Vite",
  },
  {
    label: "Backend",
    items: "PHP, Symfony, Laravel",
  },
  {
    label: "Datenbanken",
    items: "MySQL, MariaDB",
  },
  {
    label: "DevOps & Tooling",
    items:
      "Docker, Git, GitHub, GitLab, Linux, Apple Ecosystem, VS Code, JetBrains",
  },
  {
    label: "KI-Werkzeuge",
    items: "Anthropic (Claude), OpenAI",
  },
];

const profileBullets = [
  "Umfassende Erfahrung im Projektgeschäft",
  "Leidenschaft für Wissensvermittlung und kontinuierliche Weiterbildung",
  "Stark ausgeprägte Kunden- und Serviceorientierung",
  "Fundierte Kenntnisse in der Fullstack-Webentwicklung",
  "Begeisterung für komplexe Herausforderungen",
];
</script>

<template>
  <div class="cv-root">
    <!-- Tiled diamond pattern — same SVG asset used on the homepage -->
    <div class="cv-pattern" aria-hidden="true" />

    <!-- Action bar — screen only -->
    <div class="cv-actions">
      <NuxtLink to="/" class="cv-action-btn">← Zur Startseite</NuxtLink>
      <button
        type="button"
        class="cv-action-btn cv-action-btn--primary"
        @click="downloadPdf"
      >
        Als PDF speichern
      </button>
    </div>

    <div class="cv-container">
      <div class="cv-grid">
        <!-- SIDEBAR -->
        <aside class="cv-sidebar">
          <!-- Portrait card with offset-shadow stack (same idiom as homepage) -->
          <div class="cv-hero-card cv-portrait">
            <div class="cv-hero-shadow-1" />
            <div class="cv-hero-shadow-2" />
            <div class="cv-hero-inner">
              <img
                src="/img/andre.jpg"
                alt="Portraitfoto von André Hommrich"
                class="cv-portrait-img"
              />
            </div>
          </div>

          <section class="cv-card">
            <div class="cv-card-inner">
              <h2 class="cv-section-title">Kontakt</h2>
              <ul class="cv-list cv-list--plain">
                <li>André Hommrich</li>
                <li>Dernbacher Str. 26</li>
                <li>56410 Montabaur</li>
                <li>
                  <a href="mailto:andre-hommrich@web.de"
                    >andre-hommrich@web.de</a
                  >
                </li>
                <li>
                  <a
                    href="https://hommri.ch"
                    target="_blank"
                    rel="noopener noreferrer"
                    >hommri.ch</a
                  >
                </li>
              </ul>
            </div>
          </section>

          <section class="cv-card">
            <div class="cv-card-inner">
              <h2 class="cv-section-title">Skillset</h2>
              <ul class="cv-list cv-list--plain cv-skill-list">
                <li v-for="group in skillset" :key="group.label">
                  <strong>{{ group.label }}</strong>
                  <span>{{ group.items }}</span>
                </li>
              </ul>
            </div>
          </section>

          <section class="cv-card">
            <div class="cv-card-inner">
              <h2 class="cv-section-title">Sprachen</h2>
              <ul class="cv-list cv-list--plain">
                <li><strong>Deutsch</strong> — Muttersprache</li>
                <li>
                  <strong>Englisch</strong> — sicher im Verständnis, täglich im
                  beruflichen Einsatz
                </li>
              </ul>
            </div>
          </section>

          <section class="cv-card">
            <div class="cv-card-inner">
              <h2 class="cv-section-title">Weiterbildung</h2>
              <ul class="cv-list cv-list--plain">
                <li>
                  <strong>2020</strong> — Elektrofachkraft mit erweiterten
                  Sicherheitskenntnissen
                </li>
              </ul>
            </div>
          </section>

          <section class="cv-card">
            <div class="cv-card-inner">
              <h2 class="cv-section-title">Führerschein</h2>
              <ul class="cv-list">
                <li>Klasse B</li>
                <li>Staplerführerschein</li>
              </ul>
            </div>
          </section>
        </aside>

        <!-- MAIN COLUMN -->
        <main class="cv-main">
          <!-- Name / profile hero -->
          <div class="cv-hero-card">
            <div class="cv-hero-shadow-1" />
            <div class="cv-hero-shadow-2" />
            <div class="cv-hero-inner cv-name-inner">
              <h1 class="cv-name">ANDRÉ HOMMRICH</h1>
              <p class="cv-subtitle">Webentwickler &amp; Elektriker</p>
              <ul class="cv-profile-list">
                <li v-for="b in profileBullets" :key="b">{{ b }}</li>
              </ul>
            </div>
          </div>

          <!-- Berufserfahrung -->
          <section class="cv-section">
            <h2 class="cv-main-title">Berufserfahrung</h2>
            <div class="cv-stack">
              <article
                v-for="job in experience"
                :key="job.company + job.period"
                class="cv-entry"
              >
                <div class="cv-entry-inner">
                  <div class="cv-entry-head">
                    <div class="cv-entry-headline">
                      <h3 class="cv-entry-role">{{ job.role }}</h3>
                      <p class="cv-entry-company">
                        {{ job.company }} · {{ job.location }}
                      </p>
                    </div>
                    <span class="cv-entry-period">{{ job.period }}</span>
                  </div>
                  <ul class="cv-list cv-entry-list">
                    <li v-for="b in job.bullets" :key="b">{{ b }}</li>
                  </ul>
                  <p v-if="job.extra" class="cv-entry-extra">
                    {{ job.extra }}
                  </p>
                </div>
              </article>
            </div>
          </section>

          <!-- Diamond divider — echoes the homepage section divider -->
          <div class="cv-divider" aria-hidden="true">
            <span class="cv-divider-line" />
            <span class="cv-divider-square" />
            <span class="cv-divider-line" />
          </div>

          <!-- Projekthistorie -->
          <section class="cv-section">
            <h2 class="cv-main-title">Projekthistorie</h2>
            <div class="cv-stack">
              <article v-for="(p, i) in projects" :key="i" class="cv-entry">
                <div class="cv-entry-inner">
                  <div class="cv-entry-head">
                    <div class="cv-entry-headline">
                      <h3 class="cv-entry-role">{{ p.client }}</h3>
                      <p class="cv-entry-company">{{ p.role }}</p>
                    </div>
                  </div>
                  <p class="cv-entry-stack">{{ p.stack.join(" · ") }}</p>
                  <p class="cv-entry-text">{{ p.description }}</p>
                </div>
              </article>
            </div>
          </section>

          <p class="cv-signature">André Hommrich · Montabaur</p>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ------------------------------------------------------------------ */
/* Theme tokens — light by default, dark via prefers-color-scheme.    */
/* Mirrors the same dark-mode trigger used by Tailwind v4 elsewhere.  */
/* ------------------------------------------------------------------ */
.cv-root {
  /* Light theme (default) */
  --cv-bg: #f5f5f5;
  --cv-pattern: url("@/assets/pattern-light.svg");
  --cv-pattern-opacity: 0.55;
  --cv-text: #1a1a1d;
  --cv-text-muted: rgba(26, 26, 29, 0.72);
  --cv-text-subtle: rgba(26, 26, 29, 0.6);
  --cv-card-bg: rgba(255, 255, 255, 0.9);
  --cv-card-border: rgba(0, 0, 0, 0.12);
  --cv-hero-inner-bg: #ffffff;
  --cv-hero-inner-border: rgba(0, 0, 0, 0.1);
  --cv-hero-shadow-1-bg: #ffffff;
  --cv-hero-shadow-1-border: #3b4245;
  --cv-hero-shadow-2-bg: #8d1d29;
  --cv-hero-shadow-2-border: #3b4245;
  --cv-action-bg: rgba(255, 255, 255, 0.9);
  --cv-action-bg-hover: rgba(255, 255, 255, 1);
  --cv-action-color: #1a1a1d;
  --cv-action-border: rgba(0, 0, 0, 0.15);
  --cv-section-title-border: rgba(0, 0, 0, 0.15);

  position: relative;
  min-height: 100vh;
  background-color: var(--cv-bg);
  color: var(--cv-text);
  font-family:
    ui-sans-serif,
    system-ui,
    -apple-system,
    "Segoe UI",
    Roboto,
    "Helvetica Neue",
    Arial,
    sans-serif;
  overflow-x: hidden;
}

@media (prefers-color-scheme: dark) {
  .cv-root {
    --cv-bg: #1a1a1d;
    --cv-pattern: url("@/assets/pattern-dark.svg");
    --cv-pattern-opacity: 0.35;
    --cv-text: #e5e7eb;
    --cv-text-muted: rgba(229, 231, 235, 0.85);
    --cv-text-subtle: rgba(229, 231, 235, 0.6);
    --cv-card-bg: rgba(26, 26, 29, 0.7);
    --cv-card-border: rgba(229, 231, 235, 0.18);
    --cv-hero-inner-bg: #1a1a1d;
    --cv-hero-inner-border: rgba(59, 66, 69, 0.6);
    --cv-hero-shadow-1-bg: #3b4245;
    --cv-hero-shadow-1-border: #ffffff;
    --cv-hero-shadow-2-bg: #8d1d29;
    --cv-hero-shadow-2-border: #ffffff;
    --cv-action-bg: rgba(59, 66, 69, 0.85);
    --cv-action-bg-hover: rgba(75, 85, 89, 0.95);
    --cv-action-color: #e5e7eb;
    --cv-action-border: rgba(229, 231, 235, 0.2);
    --cv-section-title-border: rgba(229, 231, 235, 0.18);
  }
}

.cv-pattern {
  position: absolute;
  inset: 0;
  background-image: var(--cv-pattern);
  background-repeat: repeat;
  opacity: var(--cv-pattern-opacity);
  pointer-events: none;
}

.cv-actions {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 50;
  display: flex;
  gap: 0.5rem;
}

.cv-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--cv-action-bg);
  color: var(--cv-action-color);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  border: 1px solid var(--cv-action-border);
  transition:
    background 0.2s,
    transform 0.1s;
  text-decoration: none;
}
.cv-action-btn:hover {
  background: var(--cv-action-bg-hover);
}
.cv-action-btn:active {
  transform: translateY(1px);
}
.cv-action-btn--primary {
  background: rgba(141, 29, 41, 0.9);
  border-color: rgba(229, 231, 235, 0.25);
  color: #f5f5f5;
}
.cv-action-btn--primary:hover {
  background: #8d1d29;
}

.cv-container {
  position: relative;
  z-index: 10;
  max-width: 210mm;
  margin: 0 auto;
  padding: 3rem 1rem 2rem;
}

.cv-grid {
  /*
    Always keep the two-column PDF layout — including on mobile.
    On small screens the whole sheet scales down via the font-size
    reduction further below, so it reads like a shrunk PDF preview
    instead of growing each card to full screen width.
  */
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
  gap: 1.25rem;
}

/* ------------------------------------------------------------------ */
/* Cards                                                              */
/* ------------------------------------------------------------------ */
.cv-sidebar,
.cv-main {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cv-hero-card {
  position: relative;
}
/*
  Static "expanded" rendering of the homepage card-group — the two shadow layers
  sit permanently offset behind a sharp-edged inner content block. No hover or
  in-view animation: the CV is a presentation artifact, not an interactive page.
*/
.cv-hero-shadow-1,
.cv-hero-shadow-2 {
  position: absolute;
  inset: 0;
  opacity: 0.8;
}
.cv-hero-shadow-1 {
  transform: translate(0.25rem, 0.25rem);
  background: var(--cv-hero-shadow-1-bg);
  border: 1px solid var(--cv-hero-shadow-1-border);
}
.cv-hero-shadow-2 {
  transform: translate(-0.25rem, -0.25rem);
  background: var(--cv-hero-shadow-2-bg);
  border: 1px solid var(--cv-hero-shadow-2-border);
}
.cv-hero-inner {
  /*
    No background or border — content sits directly on the burgund front layer,
    matching the homepage card stack where the inner content block has no fill.
    Same -0.25rem offset as the front layer keeps them perfectly aligned.
  */
  position: relative;
  z-index: 2;
  transform: translate(-0.25rem, -0.25rem);
  padding: 1rem;
  color: #e5e7eb;
}

.cv-portrait .cv-hero-inner {
  padding: 0.5rem;
}
.cv-portrait-img {
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  display: block;
}

.cv-name-inner {
  padding: 1.25rem 1.5rem;
}
.cv-name {
  font-size: 1.875rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  margin: 0;
  color: #ffffff;
}
.cv-subtitle {
  font-size: 1.05rem;
  color: rgba(229, 231, 235, 0.85);
  margin: 0.25rem 0 0.75rem;
}
.cv-profile-list {
  margin: 0;
  padding-left: 1.1rem;
  list-style: disc;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-size: 0.92rem;
}

/*
  Card stack — mirrors the homepage card-group:
  ::before = back layer (white/dark grey, +offset)
  ::after  = front layer (burgund, -offset)
  .cv-card-inner = content sitting on the front layer (-offset, white text)
*/
.cv-card {
  position: relative;
  isolation: isolate;
  background: transparent;
  border: none;
  padding: 0;
}
.cv-card::before,
.cv-card::after {
  content: "";
  position: absolute;
  inset: 0;
  opacity: 0.8;
}
.cv-card::before {
  transform: translate(0.25rem, 0.25rem);
  background: var(--cv-hero-shadow-1-bg);
  border: 1px solid var(--cv-hero-shadow-1-border);
  z-index: 0;
}
.cv-card::after {
  transform: translate(-0.25rem, -0.25rem);
  background: #8d1d29;
  border: 1px solid var(--cv-hero-shadow-2-border);
  z-index: 1;
}
.cv-card-inner {
  position: relative;
  z-index: 2;
  transform: translate(-0.25rem, -0.25rem);
  padding: 0.9rem 1rem;
  color: #ffffff;
}

.cv-section-title {
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 0.5rem;
  color: #ffffff;
  padding-bottom: 0.3rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.35);
}

.cv-main-title {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  margin: 0 0 0.75rem;
  padding-bottom: 0.25rem;
  border-bottom: 2px solid #8d1d29;
  color: var(--cv-text);
}

.cv-list {
  list-style: disc;
  padding-left: 1.1rem;
  margin: 0;
  font-size: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  color: #ffffff;
}
.cv-list--plain {
  list-style: none;
  padding-left: 0;
}
.cv-skill-list {
  gap: 0.4rem;
}
.cv-skill-list li {
  display: flex;
  flex-direction: column;
  gap: 0.05rem;
}
.cv-skill-list strong {
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.85);
}
.cv-skill-list span {
  font-size: 0.82rem;
  line-height: 1.35;
}
.cv-list a {
  color: inherit;
  text-decoration: underline;
}

.cv-section {
  display: block;
}
.cv-stack {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.cv-entry {
  position: relative;
  isolation: isolate;
  background: transparent;
  border: none;
  padding: 0;
}
.cv-entry::before,
.cv-entry::after {
  content: "";
  position: absolute;
  inset: 0;
  opacity: 0.8;
}
.cv-entry::before {
  transform: translate(0.25rem, 0.25rem);
  background: var(--cv-hero-shadow-1-bg);
  border: 1px solid var(--cv-hero-shadow-1-border);
  z-index: 0;
}
.cv-entry::after {
  transform: translate(-0.25rem, -0.25rem);
  background: #8d1d29;
  border: 1px solid var(--cv-hero-shadow-2-border);
  z-index: 1;
}
.cv-entry-inner {
  position: relative;
  z-index: 2;
  transform: translate(-0.25rem, -0.25rem);
  padding: 0.85rem 1rem;
  color: #ffffff;
}
.cv-entry-head {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}
@media (min-width: 640px) {
  .cv-entry-head {
    flex-direction: row;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
  }
}
.cv-entry-headline {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}
.cv-entry-role {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: #ffffff;
}
.cv-entry-company {
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
}
.cv-entry-period {
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.85);
  white-space: nowrap;
}
.cv-entry-list {
  margin-top: 0.4rem;
}
.cv-entry-extra {
  margin: 0.4rem 0 0;
  font-size: 0.82rem;
  font-style: italic;
  color: rgba(255, 255, 255, 0.85);
}
.cv-entry-stack {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.75);
  margin: 0.3rem 0 0.5rem;
  letter-spacing: 0.01em;
}
.cv-entry-text {
  font-size: 0.86rem;
  color: #ffffff;
  margin: 0;
  line-height: 1.45;
}

/* Diamond divider between main sections — mirrors AppSectionDivider on the homepage */
.cv-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  margin: 0.25rem 0;
}
.cv-divider-line {
  height: 1px;
  width: 4rem;
  background: #8d1d29;
}
.cv-divider-square {
  width: 0.5rem;
  height: 0.5rem;
  background: #8d1d29;
  transform: rotate(45deg);
}

.cv-signature {
  font-size: 0.82rem;
  font-style: italic;
  text-align: right;
  color: var(--cv-text-muted);
  margin: 1rem 0 0;
}

/* ------------------------------------------------------------------ */
/* Mobile — additional spacing tweaks. The actual proportional shrink */
/* of the sheet happens via the html.cv-route font-size override in   */
/* the non-scoped <style> block (rem units are root-relative).        */
/* ------------------------------------------------------------------ */
@media (max-width: 640px) {
  .cv-container {
    padding: 3.5rem 0.5rem 1.5rem;
  }
  .cv-grid {
    gap: 0.6rem;
  }
  .cv-sidebar,
  .cv-main {
    gap: 0.6rem;
  }
  .cv-stack {
    gap: 0.5rem;
  }
  /*
    Action bar lives in the page coordinate system but should stay
    tap-friendly. Pin everything in absolute px so the html root-scale
    can shrink the rest without making the buttons unusable.
  */
  .cv-actions {
    top: 10px;
    right: 10px;
    gap: 6px;
  }
  .cv-action-btn {
    font-size: 13px;
    padding: 8px 12px;
    border-radius: 6px;
    gap: 6px;
  }
}

/* ------------------------------------------------------------------ */
/* Print rules — force light theme so the PDF is print-friendly       */
/* regardless of the user's current OS color scheme.                  */
/* ------------------------------------------------------------------ */
@media print {
  /*
    A real page margin so every page gets natural breathing room at the top
    (previously @page margin: 0 left page 2+ flush against the paper edge).
    To remove the browser's auto date/URL header that lands in this margin,
    the user disables "Kopf- und Fußzeilen" in the print dialog's "Weitere
    Einstellungen" — there is no fully reliable CSS-only way to suppress it.
  */
  @page {
    size: A4;
    margin: 12mm 10mm;
  }

  /* Reset theme tokens to light values for predictable print output */
  .cv-root {
    --cv-bg: #ffffff;
    --cv-pattern: url("@/assets/pattern-light.svg");
    --cv-pattern-opacity: 0.4;
    --cv-text: #1a1a1d;
    --cv-text-muted: rgba(26, 26, 29, 0.72);
    --cv-text-subtle: rgba(26, 26, 29, 0.6);
    --cv-card-bg: #ffffff;
    --cv-card-border: rgba(0, 0, 0, 0.15);
    --cv-hero-inner-bg: #ffffff;
    --cv-hero-inner-border: rgba(0, 0, 0, 0.12);
    --cv-hero-shadow-1-bg: #ffffff;
    --cv-hero-shadow-1-border: #3b4245;
    --cv-hero-shadow-2-bg: #8d1d29;
    --cv-hero-shadow-2-border: #3b4245;
    --cv-section-title-border: rgba(0, 0, 0, 0.18);
  }

  /*
    Hide the action bar AND the section divider in print. The divider
    fell on or near page breaks and got visually cut off; for the printed
    CV the section heading "Projekthistorie" is enough of a separator.
  */
  .cv-actions,
  .cv-divider {
    display: none !important;
  }

  /*
    Same diamond SVG as the homepage, tiled at ~20% of its native size.
    Chrome rasterizes SVG background-images for print: below ~300px tile
    width the bitmap gets visibly upscaled by the printer DPI and looks
    blurry. 400×300 keeps the diamonds small (~10px) but renders crisply.

    position: fixed makes modern browsers repeat the pattern on every
    printed page; print-color-adjust: exact forces it into the saved PDF.
    image-rendering: crisp-edges asks the browser not to soften the
    rasterized output, which helps further on lower-DPI printers.

    Note: Chrome's "Hintergrundgrafiken" checkbox in the print dialog can
    still strip background-image from the saved PDF on some systems even
    with print-color-adjust set — if the pattern is missing from the file,
    enable that option once under "Weitere Einstellungen".
  */
  .cv-pattern {
    position: fixed !important;
    inset: 0 !important;
    background-size: 400px 300px !important;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* Force background colors to render in print */
  .cv-root,
  .cv-hero-card,
  .cv-card,
  .cv-entry {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /*
    Print uses flat solid burgund cards — the screen's offset shadow stack
    leaves visible outline artifacts on white paper and prevents cards from
    splitting cleanly across pages. A plain box reads more like a real PDF
    CV and breaks gracefully when needed.
  */
  .cv-hero-shadow-1,
  .cv-hero-shadow-2 {
    display: none !important;
  }
  .cv-card::before,
  .cv-card::after,
  .cv-entry::before,
  .cv-entry::after {
    content: none !important;
  }
  .cv-hero-card,
  .cv-card,
  .cv-entry {
    background-color: #8d1d29 !important;
    border: 1px solid #4b0b15 !important;
  }
  .cv-hero-inner,
  .cv-card-inner,
  .cv-entry-inner {
    transform: none !important;
  }

  /* All card content sits on the burgund front layer — force pure white for max print contrast */
  .cv-hero-inner,
  .cv-name,
  .cv-subtitle,
  .cv-profile-list,
  .cv-card-inner,
  .cv-entry-inner,
  .cv-section-title,
  .cv-list,
  .cv-skill-list strong,
  .cv-entry-role,
  .cv-entry-company,
  .cv-entry-period,
  .cv-entry-extra,
  .cv-entry-stack,
  .cv-entry-text {
    color: #ffffff !important;
  }

  .cv-root {
    min-height: 0 !important;
  }

  .cv-container {
    max-width: 100% !important;
    /* Print margin lives on @page now, so the container is flush */
    padding: 0 !important;
  }

  .cv-grid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 2fr) !important;
    gap: 6mm !important;
  }

  .cv-sidebar,
  .cv-main {
    gap: 5mm !important;
  }

  .cv-stack {
    gap: 4mm !important;
  }

  /*
    Never split a card across pages — content cut mid-bullet looks broken.
    To make this work without huge whitespace gaps, the print typography
    below is aggressively compacted so more entries fit per page.
  */
  .cv-entry,
  .cv-card,
  .cv-hero-card {
    break-inside: avoid;
    page-break-inside: avoid;
  }
  /* Keep the role headline glued to its bullet list */
  .cv-entry-head {
    break-after: avoid;
    page-break-after: avoid;
  }

  /* ---------- Compact typography for print ---------- */

  /* Hero */
  .cv-name {
    font-size: 1.25rem;
  }
  .cv-subtitle {
    font-size: 0.8rem;
    margin: 0.15rem 0 0.4rem;
  }
  .cv-name-inner {
    padding: 0.6rem 0.85rem;
  }
  .cv-profile-list {
    font-size: 0.72rem;
    gap: 0.1rem;
    padding-left: 0.95rem;
  }

  /* Section headings on the main column */
  .cv-main-title {
    font-size: 0.95rem;
    margin: 0 0 0.4rem;
  }

  /* Sidebar cards */
  .cv-card-inner {
    padding: 0.55rem 0.7rem;
  }
  .cv-section-title {
    font-size: 0.62rem;
    margin: 0 0 0.35rem;
    padding-bottom: 0.2rem;
  }
  .cv-list {
    font-size: 0.7rem;
    gap: 0.1rem;
    padding-left: 0.95rem;
  }
  .cv-list--plain {
    padding-left: 0;
  }
  .cv-skill-list {
    gap: 0.3rem;
  }
  .cv-skill-list strong {
    font-size: 0.62rem;
  }
  .cv-skill-list span {
    font-size: 0.7rem;
    line-height: 1.25;
  }

  /* Main column cards (work + projects) */
  .cv-entry-inner {
    padding: 0.5rem 0.7rem;
  }
  .cv-entry-role {
    font-size: 0.85rem;
  }
  .cv-entry-company {
    font-size: 0.72rem;
  }
  .cv-entry-period {
    font-size: 0.72rem;
  }
  .cv-entry-list {
    font-size: 0.72rem;
    gap: 0.1rem;
    margin-top: 0.3rem;
    padding-left: 0.95rem;
  }
  .cv-entry-stack {
    font-size: 0.68rem;
    margin: 0.2rem 0 0.3rem;
  }
  .cv-entry-text {
    font-size: 0.74rem;
    line-height: 1.35;
  }
  .cv-entry-extra {
    font-size: 0.7rem;
    margin-top: 0.3rem;
  }

  /*
    Divider sits between Berufserfahrung and Projekthistorie. Generous
    vertical margin so the section transition has visible breathing room
    rather than the previous packed-together feel on page 2.
  */
  .cv-divider {
    margin: 2.5mm 0;
  }
  .cv-signature {
    font-size: 0.7rem;
    margin-top: 0.6rem;
  }
  /*
    The bullet list inside each entry sits slightly looser to match the
    perceived spacing of page 1's hero card.
  */
  .cv-entry-list {
    line-height: 1.4;
  }
  .cv-entry-text {
    line-height: 1.45;
  }

  /*
    Section headings should stay attached to their first card, but the
    section itself MUST be allowed to break across pages — `avoid-page`
    on tall sections leaves huge whitespace gaps before each new page.
  */
  .cv-main-title {
    break-after: avoid;
    page-break-after: avoid;
  }
}
</style>

<!--
  Non-scoped block: applies a smaller root font-size on mobile while the user
  is on this page. The `cv-route` class is set on <html> via useHead so the
  override naturally tears down on route change. We use html-level scaling
  because rem units are always root-relative — scoping the change to .cv-root
  would have no effect on rem-based child sizes.
-->
<style>
@media (max-width: 640px) {
  html.cv-route {
    font-size: 9.5px;
  }
}
@media (max-width: 380px) {
  html.cv-route {
    font-size: 8.5px;
  }
}
</style>
