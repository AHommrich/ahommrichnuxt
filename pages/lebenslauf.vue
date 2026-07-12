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

const { isPdfLoading, downloadPdf } = useDocumentPdf("lebenslauf.pdf");

onMounted(() => {
  document.documentElement.setAttribute("data-ready", "1");
});

// Career history — most recent first.
const experience = [
  {
    period: "Seit 06.2025",
    company: "Creavo Projekt GmbH",
    location: "Limburg",
    role: "PHP Webentwickler",
    current: true,
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
      "Rechenzentrum- und Serverraum-Installationen",
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
      "TV-Sat-Anlagen - KNX/EIB - Netzwerktechnik",
    ],
    extra: "Abschluss: Sekundarabschluss I",
  },
];

// Project history — most recent first.
const projects = [
  {
    client: "Eventplaner — eveplan.de",
    role: "Fullstack & Mobile",
    stack: [
      "Laravel 12",
      "Vue 3",
      "TypeScript",
      "Inertia.js",
      "Tailwind CSS 4",
      "React Native",
      "Expo",
      "Docker",
    ],
    description:
      "Vollständig selbst entwickelter Hochzeits- und Eventplaner als Progressive Web App mit nativer Begleiter-App für Gäste (React Native / Expo). Gäste authentifizieren sich per QR-Code ohne Passwort; der persönliche Event-Hub bietet Fotogalerie mit Upload, Fotospiel mit delta-basiertem Aufgabenmodell, Trinkspiel mit physiologisch motivierter Punktberechnung und tokengesicherter Beamer-Slideshow. Backend durch rund 200 automatisierte Pest-Tests abgedeckt, dreistufiger Deploy-Prozess (develop → staging → production) mit CI-Guard gegen Compose-Drift. Live unter eveplan.de.",
  },
  {
    client: "Portfolio — hommri.ch",
    role: "Frontend",
    stack: [
      "Nuxt 3",
      "Vue 3",
      "TypeScript",
      "Tailwind CSS 4",
      "Docker",
      "Coolify",
    ],
    description:
      "Persönliche Portfolio-Website ohne externe Runtime-Abhängigkeiten — kein CDN, kein Tracking, keine Analytics. Tech-Icon-Sektion mit eigenem requestAnimationFrame-Loop, Physics-Modell und Pointer-Flee-Verhalten. Hero-Sektion als rotiertes CSS-Grid. Deployed über Docker und Coolify. Live unter hommri.ch.",
  },
  {
    client: "grapeminds GmbH",
    role: "Frontend",
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
    client: "AWESOME! Software — CRM",
    role: "Fullstack",
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
    role: "Fullstack",
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
    role: "Fullstack",
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
    items: [
      "Vue.js",
      "Nuxt.js",
      "Vite",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "Bootstrap",
      "HTML5",
      "CSS3",
    ],
  },
  {
    label: "Backend",
    items: ["PHP", "Laravel", "Symfony"],
  },
  {
    label: "Datenbanken",
    items: ["MySQL", "MariaDB"],
  },
  {
    label: "DevOps & Tooling",
    items: [
      "Docker",
      "Git",
      "GitHub",
      "GitLab",
      "Linux",
      "Apple Ecosystem",
      "VS Code",
      "JetBrains",
    ],
  },
  {
    label: "KI-Werkzeuge",
    items: ["Anthropic (Claude Code)", "OpenAI (Codex)"],
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
    <!-- Inline SVG pattern — keeps vector rendering in Chrome PDF export -->
    <AppCvPattern />

    <!-- Action bar — screen only -->
    <div class="cv-actions">
      <NuxtLink to="/" class="cv-action-btn">← Zur Startseite</NuxtLink>
      <button
        type="button"
        class="cv-action-btn cv-action-btn--primary"
        :disabled="isPdfLoading"
        @click="downloadPdf('/api/pdf/lebenslauf')"
      >
        {{ isPdfLoading ? "Wird generiert…" : "Als PDF speichern" }}
      </button>
    </div>

    <!-- Document paper — floats over the site pattern -->
    <div class="cv-paper">
      <!-- SIGNATURE: header band -->
      <header class="cv-band">
        <div>
          <h1 class="cv-band-name">André Hommrich</h1>
          <p class="cv-band-sub">Fullstack-Webentwickler</p>
        </div>
        <div class="cv-band-diamonds" aria-hidden="true">
          <span /><span /><span />
        </div>
      </header>
      <div class="cv-band-pin" aria-hidden="true"><span /></div>

      <div class="cv-body">
        <!-- SIDEBAR -->
        <aside class="cv-sidebar">
          <div class="cv-portrait">
            <img src="/img/andre.jpg" alt="Portraitfoto von André Hommrich" />
          </div>

          <section>
            <h2 class="cv-label">Kontakt</h2>
            <ul class="cv-list">
              <li>André Hommrich</li>
              <li>Dernbacher Str. 26</li>
              <li>56410 Montabaur</li>
              <li>
                <a href="mailto:andre-hommrich@web.de">andre-hommrich@web.de</a>
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
          </section>

          <section>
            <h2 class="cv-label">Skillset</h2>
            <div
              v-for="group in skillset"
              :key="group.label"
              class="cv-skill-group"
            >
              <h3>{{ group.label }}</h3>
              <div class="cv-pills">
                <span v-for="item in group.items" :key="item" class="cv-pill">
                  {{ item }}
                </span>
              </div>
            </div>
          </section>

          <section>
            <h2 class="cv-label">Sprachen</h2>
            <ul class="cv-list">
              <li><strong>Deutsch</strong> — Muttersprache</li>
              <li>
                <strong>Englisch</strong> — sicher im Verständnis, täglich im
                beruflichen Einsatz
              </li>
            </ul>
          </section>

          <section>
            <h2 class="cv-label">Weiterbildung</h2>
            <ul class="cv-list">
              <li>
                <strong>2020</strong> — Elektrofachkraft mit erweiterten
                Sicherheitskenntnissen
              </li>
            </ul>
          </section>

          <section>
            <h2 class="cv-label">Führerschein</h2>
            <ul class="cv-list">
              <li>Klasse B</li>
              <li>Staplerführerschein</li>
            </ul>
          </section>
        </aside>

        <!-- MAIN COLUMN -->
        <main class="cv-main">
          <section>
            <ul class="cv-profile">
              <li v-for="b in profileBullets" :key="b">{{ b }}</li>
            </ul>
          </section>

          <!-- Berufserfahrung — timeline -->
          <section>
            <h2 class="cv-label">Berufserfahrung</h2>
            <div class="tl">
              <article
                v-for="job in experience"
                :key="job.company + job.period"
                class="tl-entry"
                :class="{ 'tl-current': job.current }"
              >
                <div class="tl-head">
                  <h3 class="tl-role">{{ job.role }}</h3>
                  <span class="tl-date">{{ job.period }}</span>
                </div>
                <p class="tl-org">{{ job.company }} · {{ job.location }}</p>
                <ul>
                  <li v-for="b in job.bullets" :key="b">{{ b }}</li>
                </ul>
                <p v-if="job.extra" class="tl-note">{{ job.extra }}</p>
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
          <section>
            <h2 class="cv-label">Projekthistorie</h2>
            <article v-for="(p, i) in projects" :key="i" class="prj">
              <div class="prj-head">
                <h3 class="prj-title">{{ p.client }}</h3>
                <span class="prj-role">{{ p.role }}</span>
              </div>
              <div class="cv-pills">
                <span v-for="s in p.stack" :key="s" class="cv-pill">{{
                  s
                }}</span>
              </div>
              <p>{{ p.description }}</p>
            </article>
          </section>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ------------------------------------------------------------------ */
/* Grid — structure via whitespace, no more boxes                     */
/* ------------------------------------------------------------------ */
.cv-body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
  gap: 0 2.4rem;
  padding: 2.2rem 2.6rem 2.6rem;
}
.cv-band {
  padding: 2.2rem 2.6rem 2rem;
}

.cv-sidebar,
.cv-main {
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  min-width: 0;
}

/* ------------------------------------------------------------------ */
/* Sidebar                                                             */
/* ------------------------------------------------------------------ */

/* Portrait — static offset idiom (AppCard end-state, no hover/animation) */
.cv-portrait {
  position: relative;
  margin: 0.2rem 0.45rem 0.45rem 0;
}
.cv-portrait::before {
  content: "";
  position: absolute;
  inset: 0;
  transform: translate(0.45rem, 0.45rem);
  border: 1px solid var(--cv-anthrazit);
  background: var(--cv-paper);
}
.cv-portrait img {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  border: 1px solid var(--cv-burgund);
}

/* Diamond cluster right of the name — echoes the hero overlays */
.cv-band-diamonds {
  display: flex;
  gap: 0.85rem;
  padding-bottom: 0.2rem;
}
.cv-band-diamonds span {
  width: 0.7rem;
  height: 0.7rem;
  transform: rotate(45deg);
}
.cv-band-diamonds span:nth-child(1) {
  background: var(--cv-burgund-dark);
}
.cv-band-diamonds span:nth-child(2) {
  border: 1px solid rgba(255, 255, 255, 0.85);
}
.cv-band-diamonds span:nth-child(3) {
  background: rgba(255, 255, 255, 0.9);
}

.cv-band-name {
  font-size: 2.1rem;
}
.cv-band-sub {
  font-size: 0.74rem;
}

.cv-list {
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 0.82rem;
  line-height: 1.65;
  color: var(--cv-text-muted);
}
.cv-list a {
  color: inherit;
}
.cv-list strong {
  color: var(--cv-text);
  font-weight: 600;
}

.cv-skill-group {
  margin-bottom: 0.75rem;
}
.cv-skill-group:last-child {
  margin-bottom: 0;
}
.cv-skill-group h3 {
  margin: 0 0 0.3rem;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--cv-accent-strong);
}

/* ------------------------------------------------------------------ */
/* Main column                                                         */
/* ------------------------------------------------------------------ */
.cv-profile {
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--cv-text-muted);
}
.cv-profile li {
  position: relative;
  padding-left: 1rem;
  margin-bottom: 0.25rem;
}
.cv-profile li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.5em;
  width: 0.32rem;
  height: 0.32rem;
  background: var(--cv-accent);
  transform: rotate(45deg);
}

/* Timeline: border per entry instead of an absolute line → break-safe.
   Diamond dot marks each station. */
.tl {
  display: flex;
  flex-direction: column;
}
.tl-entry {
  position: relative;
  border-left: 1px solid var(--cv-line);
  padding: 0 0 1.2rem 1.3rem;
  margin-left: 0.25rem;
}
.tl-entry:last-child {
  padding-bottom: 0.2rem;
}
.tl-entry::before {
  content: "";
  position: absolute;
  left: -0.3rem;
  top: 0.28em;
  width: 0.55rem;
  height: 0.55rem;
  background: var(--cv-paper);
  border: 1.5px solid var(--cv-accent);
  transform: rotate(45deg);
}
.tl-entry.tl-current::before {
  background: var(--cv-accent);
}

.tl-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
}
.tl-role {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--cv-text);
}
.tl-date {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--cv-accent);
  white-space: nowrap;
}
.tl-org {
  margin: 0.15rem 0 0.45rem;
  font-size: 0.78rem;
  color: var(--cv-text-subtle);
}
.tl-entry ul {
  margin: 0;
  padding-left: 1.05rem;
  font-size: 0.8rem;
  line-height: 1.55;
  color: var(--cv-text-muted);
}
.tl-entry ul li {
  margin-bottom: 0.12rem;
}
.tl-note {
  margin: 0.4rem 0 0;
  font-size: 0.74rem;
  font-style: italic;
  color: var(--cv-text-subtle);
}

/* Projects: compact, pills for the stack */
.prj {
  margin-bottom: 1.1rem;
}
.prj:last-child {
  margin-bottom: 0;
}
.prj-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
}
.prj-title {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--cv-accent-strong);
}
.prj-role {
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--cv-text-subtle);
  white-space: nowrap;
}
.prj .cv-pills {
  margin: 0.35rem 0 0.4rem;
}
.prj p {
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.55;
  color: var(--cv-text-muted);
}

/* ------------------------------------------------------------------ */
/* Mobile                                                             */
/* ------------------------------------------------------------------ */
@media (max-width: 640px) {
  .cv-body {
    grid-template-columns: 1fr;
    padding: 1.4rem 1.2rem 1.6rem;
    gap: 1.2rem 0;
  }
  .cv-band {
    padding: 1.6rem 1.2rem 1.4rem;
  }
}

/* ------------------------------------------------------------------ */
/* Print — white pages, band prints in colour, diamond divider stays  */
/* visible. Disable "Kopf- und Fußzeilen" in Chrome's print dialog to */
/* remove the auto date/URL strips.                                  */
/* ------------------------------------------------------------------ */
@media print {
  .cv-band {
    padding: 14mm 20mm 10mm;
  }
  .cv-body {
    padding: 10mm 20mm 15mm;
    gap: 0 8mm;
    /* Repeats the padding on every page fragment — without it, only the
       first page gets top clearance and subsequent pages start flush
       against the page edge. */
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
  }
  .tl-entry,
  .prj,
  .cv-skill-group,
  .cv-portrait {
    break-inside: avoid;
  }
  .cv-label {
    break-after: avoid;
  }
  .cv-profile li::before,
  .tl-entry::before {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
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
@media print {
  html.cv-route,
  html.cv-route body {
    background: transparent !important;
  }
}
</style>
