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

const isPdfLoading = ref(false);

async function downloadPdf() {
  isPdfLoading.value = true;
  try {
    const response = await fetch("/api/pdf/lebenslauf");
    if (!response.ok) throw new Error("PDF-Generierung fehlgeschlagen");
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lebenslauf.pdf";
    a.click();
    URL.revokeObjectURL(url);
  } finally {
    isPdfLoading.value = false;
  }
}

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
    role: "Fullstack-Entwicklung & Mobile",
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
    role: "Frontend-Entwicklung",
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
      "Vue.js, Nuxt.js, Vite, TypeScript, JavaScript, Tailwind CSS, Bootstrap, HTML5, CSS3",
  },
  {
    label: "Backend",
    items: "PHP, Laravel, Symfony",
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
    items: "Anthropic (Claude Code), OpenAI (Codex)",
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
        @click="downloadPdf"
      >
        {{ isPdfLoading ? "Wird generiert…" : "Als PDF speichern" }}
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
          <div class="cv-hero-card cv-name-hero">
            <div class="cv-hero-shadow-1" />
            <div class="cv-hero-shadow-2" />
            <div class="cv-hero-inner cv-name-inner">
              <h1 class="cv-name">ANDRÉ HOMMRICH</h1>
              <p class="cv-subtitle">Fullstack-Webentwickler</p>
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
/* Theme tokens                                                        */
/* ------------------------------------------------------------------ */
.cv-root {
  --cv-bg: #ffffff;
  --cv-text: #1a1a1d;
  --cv-text-muted: rgba(26, 26, 29, 0.65);
  --cv-text-subtle: rgba(26, 26, 29, 0.5);
  --cv-card-bg: #ffffff;
  --cv-card-border: rgba(0, 0, 0, 0.1);
  --cv-card-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
  --cv-hero-shadow-1-bg: #ffffff;
  --cv-hero-shadow-1-border: #3b4245;
  --cv-hero-shadow-2-bg: #8d1d29;
  --cv-hero-shadow-2-border: #3b4245;
  --cv-action-bg: rgba(255, 255, 255, 0.9);
  --cv-action-bg-hover: rgba(255, 255, 255, 1);
  --cv-action-color: #1a1a1d;
  --cv-action-border: rgba(0, 0, 0, 0.15);

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
    --cv-bg: #3b4245;
    --cv-text: #e5e7eb;
    --cv-text-muted: rgba(229, 231, 235, 0.75);
    --cv-text-subtle: rgba(229, 231, 235, 0.5);
    --cv-card-bg: #26262a;
    --cv-card-border: rgba(229, 231, 235, 0.1);
    --cv-card-shadow: 0 1px 6px rgba(0, 0, 0, 0.35);
    --cv-hero-shadow-1-bg: #3b4245;
    --cv-hero-shadow-1-border: #ffffff;
    --cv-hero-shadow-2-bg: #8d1d29;
    --cv-hero-shadow-2-border: #ffffff;
    --cv-action-bg: rgba(59, 66, 69, 0.85);
    --cv-action-bg-hover: rgba(75, 85, 89, 0.95);
    --cv-action-color: #e5e7eb;
    --cv-action-border: rgba(229, 231, 235, 0.2);
  }
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
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
  gap: 1.25rem;
}

/* ------------------------------------------------------------------ */
/* Columns                                                            */
/* ------------------------------------------------------------------ */
.cv-sidebar,
.cv-main {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ------------------------------------------------------------------ */
/* Hero cards (portrait + name) — both use the same clean card style  */
/* ------------------------------------------------------------------ */
.cv-hero-card {
  position: relative;
}

/* Shadow divs unused in new design — hidden on all hero cards */
.cv-hero-shadow-1,
.cv-hero-shadow-2 {
  display: none;
}
.cv-hero-inner {
  position: relative;
  padding: 1rem;
}

/* Portrait — full-bleed photo, no inner padding */
.cv-portrait .cv-hero-inner {
  padding: 0;
  background: var(--cv-card-bg);
  border: 1px solid var(--cv-card-border);
  border-top: 3px solid #8d1d29;
  box-shadow: var(--cv-card-shadow);
}
.cv-portrait-img {
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  display: block;
}

/* Name hero — same card style as sidebar, name in burgund as anchor */
.cv-name-hero .cv-hero-inner {
  background: var(--cv-card-bg);
  border: 1px solid var(--cv-card-border);
  border-top: 3px solid #8d1d29;
  box-shadow: var(--cv-card-shadow);
}
.cv-name-inner {
  padding: 1.25rem 1.5rem;
}
.cv-name {
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: 0.02em;
  line-height: 1;
  margin: 0;
  color: #8d1d29;
}
/* Uppercase with generous tracking — reads like a professional label under the name */
.cv-subtitle {
  font-size: 0.78rem;
  font-weight: 400;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--cv-text-muted);
  margin: 0.5rem 0 1rem;
}
.cv-profile-list {
  margin: 0;
  padding-left: 1.1rem;
  list-style: disc;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 0.9rem;
  line-height: 1.55;
  color: var(--cv-text);
}

/* ------------------------------------------------------------------ */
/* Sidebar cards — white with burgund top accent                      */
/* ------------------------------------------------------------------ */
.cv-card {
  position: relative;
}
.cv-card-inner {
  padding: 1rem 1.1rem;
  background: var(--cv-card-bg);
  border: 1px solid var(--cv-card-border);
  border-top: 3px solid #8d1d29;
  box-shadow: var(--cv-card-shadow);
  color: var(--cv-text);
}

.cv-section-title {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin: 0 0 0.65rem;
  color: #8d1d29;
  padding-bottom: 0.35rem;
  border-bottom: 1px solid rgba(141, 29, 41, 0.2);
}

.cv-main-title {
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin: 0 0 0.85rem;
  padding-bottom: 0.3rem;
  border-bottom: 2px solid #8d1d29;
  color: var(--cv-text);
}

.cv-list {
  list-style: disc;
  padding-left: 1.1rem;
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.5;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  color: var(--cv-text);
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
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #8d1d29;
}
.cv-skill-list span {
  font-size: 0.86rem;
  line-height: 1.45;
  color: var(--cv-text-muted);
}
.cv-list a {
  color: inherit;
  text-decoration: underline;
}

/* ------------------------------------------------------------------ */
/* Main column                                                        */
/* ------------------------------------------------------------------ */
.cv-section {
  display: block;
}
.cv-stack {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Job/project entries — white card with left burgund accent stripe */
.cv-entry {
  position: relative;
}
.cv-entry-inner {
  padding: 1rem 1.1rem;
  background: var(--cv-card-bg);
  border: 1px solid var(--cv-card-border);
  border-left: 3px solid #8d1d29;
  box-shadow: var(--cv-card-shadow);
  color: var(--cv-text);
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
  font-weight: 700;
  margin: 0;
  color: #8d1d29;
}
.cv-entry-company {
  font-size: 0.84rem;
  color: var(--cv-text-muted);
  margin: 0.1rem 0 0;
}
.cv-entry-period {
  font-size: 0.84rem;
  color: var(--cv-text-muted);
  white-space: nowrap;
}
.cv-entry-list {
  margin-top: 0.55rem;
  color: var(--cv-text);
}
.cv-entry-extra {
  margin: 0.4rem 0 0;
  font-size: 0.84rem;
  font-style: italic;
  color: var(--cv-text-muted);
}
.cv-entry-stack {
  font-size: 0.8rem;
  color: var(--cv-text-subtle);
  margin: 0.35rem 0 0.5rem;
}
.cv-entry-text {
  font-size: 0.9rem;
  color: var(--cv-text);
  margin: 0;
  line-height: 1.55;
}

/* Diamond divider between main sections */
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
/* Mobile                                                             */
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
/* Print — light theme forced, white cards render natively            */
/* Disable "Kopf- und Fußzeilen" in Chrome's print dialog to remove  */
/* the auto date/URL strips from the 12mm margin area.               */
/* ------------------------------------------------------------------ */
@media print {
  @page {
    size: A4;
    margin: 15mm 20mm;
  }

  .cv-root {
    --cv-bg: #ffffff;
    --cv-text: #1a1a1d;
    --cv-text-muted: rgba(26, 26, 29, 0.65);
    --cv-text-subtle: rgba(26, 26, 29, 0.5);
    --cv-card-bg: #ffffff;
    --cv-card-border: rgba(0, 0, 0, 0.15);
    --cv-card-shadow: none;
    --cv-hero-shadow-1-bg: #ffffff;
    --cv-hero-shadow-1-border: #3b4245;
    --cv-hero-shadow-2-bg: #8d1d29;
    --cv-hero-shadow-2-border: #3b4245;
    /* transparent so the html background pattern shows through */
    background-color: transparent !important;
  }

  .cv-actions,
  .cv-divider {
    display: none !important;
  }

  :deep(.pattern-wrap) {
    display: none !important;
  }

  /* Force burgund accents to render in print */
  .cv-root,
  .cv-hero-inner,
  .cv-card-inner,
  .cv-entry-inner {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* Portrait */
  .cv-portrait .cv-hero-inner {
    background: #ffffff !important;
    border: 1px solid rgba(0, 0, 0, 0.15) !important;
    border-top: 3px solid #8d1d29 !important;
    box-shadow: none !important;
  }

  /* Name hero — white card, burgund name */
  .cv-name-hero .cv-hero-inner {
    background: #ffffff !important;
    border: 1px solid rgba(0, 0, 0, 0.15) !important;
    border-top: 3px solid #8d1d29 !important;
    box-shadow: none !important;
  }
  .cv-name {
    color: #8d1d29 !important;
  }
  .cv-subtitle {
    color: rgba(26, 26, 29, 0.65) !important;
  }
  .cv-profile-list {
    color: #1a1a1d !important;
  }

  /* Sidebar cards: white + burgund top border */
  .cv-card-inner {
    background: #ffffff !important;
    border: 1px solid rgba(0, 0, 0, 0.15) !important;
    border-top: 3px solid #8d1d29 !important;
    box-shadow: none !important;
    color: #1a1a1d !important;
  }
  .cv-section-title {
    color: #8d1d29 !important;
    border-bottom-color: rgba(141, 29, 41, 0.25) !important;
  }
  .cv-list {
    color: #1a1a1d !important;
  }
  .cv-skill-list strong {
    color: #8d1d29 !important;
  }
  .cv-skill-list span {
    color: rgba(26, 26, 29, 0.7) !important;
  }

  /* Entries: white + burgund left stripe */
  .cv-entry-inner {
    background: #ffffff !important;
    border: 1px solid rgba(0, 0, 0, 0.15) !important;
    border-left: 3px solid #8d1d29 !important;
    box-shadow: none !important;
    color: #1a1a1d !important;
  }
  .cv-entry-role {
    color: #8d1d29 !important;
  }
  .cv-entry-company,
  .cv-entry-period,
  .cv-entry-extra {
    color: rgba(26, 26, 29, 0.65) !important;
  }
  .cv-entry-stack {
    color: rgba(26, 26, 29, 0.5) !important;
  }
  .cv-entry-list,
  .cv-entry-text {
    color: #1a1a1d !important;
  }
  .cv-signature {
    color: rgba(26, 26, 29, 0.6) !important;
  }

  .cv-root {
    min-height: 0 !important;
  }

  .cv-container {
    max-width: 100% !important;
    /* left/right padding applies on every page; top/bottom via element margins */
    padding: 0 13mm 10mm !important;
  }

  .cv-grid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 2fr) !important;
    gap: 6mm !important;
  }

  .cv-sidebar,
  .cv-main {
    gap: 5mm !important;
    padding-top: 0 !important;
  }

  .cv-stack {
    gap: 3mm !important;
    margin-top: 4mm !important;
  }

  .cv-signature {
    display: none !important;
  }

  .cv-entry,
  .cv-card,
  .cv-hero-card {
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .cv-entry-head {
    break-after: avoid;
    page-break-after: avoid;
    flex-direction: row;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
  }

  /* Compact typography for print */
  .cv-name {
    font-size: 1.3rem;
    letter-spacing: 0.02em;
  }
  .cv-subtitle {
    font-size: 0.6rem;
    letter-spacing: 0.14em;
    margin: 0.3rem 0 0.5rem;
  }
  .cv-name-inner {
    padding: 0.6rem 0.85rem;
  }
  .cv-profile-list {
    font-size: 0.7rem;
    gap: 0.1rem;
    line-height: 1.45;
    padding-left: 0.95rem;
  }
  .cv-main-title {
    font-size: 0.82rem;
    letter-spacing: 0.06em;
    margin: 0 0 0.4rem;
    break-after: avoid;
    page-break-after: avoid;
  }
  .cv-card-inner {
    padding: 0.4rem 0.6rem;
  }
  .cv-section-title {
    font-size: 0.54rem;
    letter-spacing: 0.14em;
    margin: 0 0 0.25rem;
    padding-bottom: 0.15rem;
  }
  .cv-list {
    font-size: 0.67rem;
    gap: 0.05rem;
    padding-left: 0.85rem;
  }
  .cv-list--plain {
    padding-left: 0;
  }
  .cv-skill-list {
    gap: 0.2rem;
  }
  .cv-skill-list strong {
    font-size: 0.6rem;
  }
  .cv-skill-list span {
    font-size: 0.67rem;
    line-height: 1.2;
  }
  .cv-entry-inner {
    padding: 0.35rem 0.6rem;
  }
  .cv-entry-role {
    font-size: 0.82rem;
  }
  .cv-entry-company,
  .cv-entry-period {
    font-size: 0.69rem;
  }
  .cv-entry-list {
    font-size: 0.69rem;
    line-height: 1.35;
    gap: 0.05rem;
    margin-top: 0.2rem;
    padding-left: 0.85rem;
  }
  .cv-entry-stack {
    font-size: 0.65rem;
    margin: 0.15rem 0 0.2rem;
  }
  .cv-entry-text {
    font-size: 0.69rem;
    line-height: 1.38;
  }
  .cv-entry-extra {
    font-size: 0.67rem;
    margin-top: 0.2rem;
  }
  .cv-divider {
    margin: 2mm 0;
  }
  .cv-signature {
    font-size: 0.7rem;
    margin-top: 0.6rem;
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
