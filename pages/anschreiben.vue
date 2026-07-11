<script setup lang="ts">
// Standalone cover-letter page — no site layout so print output stays clean.
definePageMeta({ layout: false });

useSeoMeta({
  title: "Anschreiben — André Hommrich",
  robots: "noindex, nofollow, noarchive",
});

useHead({
  htmlAttrs: { lang: "de", class: "cv-route" },
});

// DOM refs for every editable field
const elDatum = ref<HTMLElement | null>(null);
const elFirma = ref<HTMLElement | null>(null);
const elZH = ref<HTMLElement | null>(null);
const elStrasse = ref<HTMLElement | null>(null);
const elOrt = ref<HTMLElement | null>(null);
const elStelle = ref<HTMLElement | null>(null);
const elAnrede = ref<HTMLElement | null>(null);
const elInteresse = ref<HTMLElement | null>(null);
const elAktuell = ref<HTMLElement | null>(null);
const elProjekte = ref<HTMLElement | null>(null);
const elGeschichte = ref<HTMLElement | null>(null);
const elReferenzen = ref<HTMLElement | null>(null);
const elAbschluss = ref<HTMLElement | null>(null);

const refsMap = {
  datum: elDatum,
  firma: elFirma,
  zh: elZH,
  strasse: elStrasse,
  ort: elOrt,
  stelle: elStelle,
  anrede: elAnrede,
  interesse: elInteresse,
  aktuell: elAktuell,
  projekte: elProjekte,
  geschichte: elGeschichte,
  referenzen: elReferenzen,
  abschluss: elAbschluss,
};

const DEFAULTS = {
  datum: "Montabaur, den [Datum]",
  firma: "[Unternehmen]",
  zh: "z. H. [Ansprechpartner]",
  strasse: "[Straße Hausnummer]",
  ort: "[PLZ Ort]",
  stelle: "Bewerbung als [Jobtitel]",
  anrede: "Sehr geehrte Damen und Herren,",
  interesse:
    "[Wie Sie auf die Stelle aufmerksam wurden und was Sie am Unternehmen, Produkt oder der Branche konkret angesprochen hat.]",
  aktuell:
    "[Aktuelle Rolle, eingesetzte Technologien und Art der Projekte — was Sie täglich machen und welche Verantwortung Sie tragen.]",
  projekte:
    "Privat entwickle ich eigene Projekte Fullstack und betreibe sie selbst per Docker auf eigener Infrastruktur. Dadurch weiß ich aus eigener Erfahrung, was ein Backend liefern muss, damit Website und App gut damit arbeiten können. Eine ausführliche Übersicht der Technologien, mit denen ich bereits gearbeitet habe, finden Sie unter https://ahommrich.de/#technologien",
  geschichte:
    "Seit 2025 bin ich ausgebildeter Fachinformatiker für Anwendungsentwicklung. Davor war ich seit 2013 in der Elektrotechnik tätig, mit Abschluss als Elektriker 2017. Aus der Zeit habe ich mir eine praxisnahe Herangehensweise an technische Probleme mitgenommen und ein gutes Gespür dafür, wie Anwender Software im Alltag wirklich benutzen.",
  referenzen:
    "Damit Sie sich ein Bild von meiner Arbeitsweise machen können, habe ich drei eigene Referenzprojekte beigefügt:\n\nEvePlan – Selbst entwickelte Hochzeitssoftware für Planung, Einladungen, RSVP-Verwaltung und Event-Organisation.\nRepository: https://github.com/AHommrich/eventplaner\n\nEvePlan App – Die begleitende Smartphone-App für Gäste, angebunden an das EvePlan-System.\nRepository: https://github.com/AHommrich/eventplaner-app\n\nahommrich.de – Meine persönliche Website zu meinem Werdegang und meinen technischen Schwerpunkten.\nLive-Demo: https://ahommrich.de | Repository: https://github.com/AHommrich/ahommrichnuxt",
  abschluss:
    "Da ich mich aus einer ungekündigten Festanstellung heraus bewerbe, bitte ich um vertrauliche Behandlung meiner Bewerbung. Für den Erstkontakt erreichen Sie mich am besten per E-Mail. Gerne können wir darüber auch direkt einen Termin für ein erstes Telefonat oder einen Videocall ausmachen.\nIch freue mich, wenn wir ins Gespräch kommen.",
};

function getContent(): Record<string, string> {
  return Object.fromEntries(
    Object.entries(refsMap).map(([key, r]) => [key, r.value?.innerText ?? ""]),
  );
}

function setContent(data: Partial<Record<string, string>>) {
  for (const [key, r] of Object.entries(refsMap)) {
    if (r.value && data[key] !== undefined) {
      r.value.innerText = data[key]!;
    }
  }
}

function exportJson() {
  const blob = new Blob([JSON.stringify(getContent(), null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "anschreiben.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importJson() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json,application/json";
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        setContent(JSON.parse(ev.target?.result as string));
      } catch {
        // Unchanged on invalid JSON
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

const isPdfLoading = ref(false);

async function downloadPdf() {
  isPdfLoading.value = true;
  try {
    const response = await fetch("/api/pdf/anschreiben", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(getContent()),
    });
    if (!response.ok) throw new Error("PDF-Generierung fehlgeschlagen");
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "anschreiben.pdf";
    a.click();
    URL.revokeObjectURL(url);
  } finally {
    isPdfLoading.value = false;
  }
}

onMounted(() => {
  const dataParam = useRoute().query.data;
  if (dataParam) {
    try {
      // atob() decodes to Latin-1 bytes — TextDecoder re-interprets them as UTF-8
      const bytes = Uint8Array.from(atob(dataParam as string), (c) =>
        c.charCodeAt(0),
      );
      setContent(JSON.parse(new TextDecoder().decode(bytes)));
    } catch {
      // Invalid base64/JSON — fall through to defaults
    }
  } else {
    setContent(DEFAULTS);
  }
  document.documentElement.setAttribute("data-ready", "1");
});
</script>

<template>
  <div class="cv-root">
    <AppCvPattern />

    <!-- Action bar — screen only -->
    <div class="cv-actions">
      <NuxtLink to="/" class="cv-action-btn">← Zur Startseite</NuxtLink>
      <button type="button" class="cv-action-btn" @click="importJson">
        Importieren
      </button>
      <button type="button" class="cv-action-btn" @click="exportJson">
        Exportieren
      </button>
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
      <div class="letter-card">
        <!-- Header: fixed sender block left, editable date right -->
        <div class="letter-header">
          <address class="letter-sender">
            <strong>André Hommrich</strong><br />
            Dernbacher Str. 26 · 56410 Montabaur<br />
            <a href="mailto:andre-hommrich@web.de">andre-hommrich@web.de</a>
            ·
            <a
              href="https://ahommrich.de"
              target="_blank"
              rel="noopener noreferrer"
              >ahommrich.de</a
            >
          </address>
          <div
            ref="elDatum"
            class="letter-field letter-date"
            contenteditable="plaintext-only"
            spellcheck="false"
            @keydown.enter.prevent
          />
        </div>

        <div class="letter-sep" aria-hidden="true" />

        <!-- Recipient block -->
        <div class="letter-recipient">
          <div
            ref="elFirma"
            class="letter-field"
            contenteditable="plaintext-only"
            @keydown.enter.prevent
          />
          <div
            ref="elZH"
            class="letter-field"
            contenteditable="plaintext-only"
            @keydown.enter.prevent
          />
          <div
            ref="elStrasse"
            class="letter-field"
            contenteditable="plaintext-only"
            @keydown.enter.prevent
          />
          <div
            ref="elOrt"
            class="letter-field"
            contenteditable="plaintext-only"
            @keydown.enter.prevent
          />
        </div>

        <!-- Subject -->
        <div
          ref="elStelle"
          class="letter-field letter-subject"
          contenteditable="plaintext-only"
          @keydown.enter.prevent
        />

        <!-- Salutation -->
        <div
          ref="elAnrede"
          class="letter-field letter-anrede"
          contenteditable="plaintext-only"
          @keydown.enter.prevent
        />

        <!-- Body: 6 structured paragraphs, labels are screen-only hints -->
        <div class="letter-body">
          <div class="section-label" aria-hidden="true">① Interesse am Job</div>
          <div
            ref="elInteresse"
            class="letter-field letter-section"
            contenteditable="plaintext-only"
          />

          <div class="section-label" aria-hidden="true">
            ② Aktuelle Jobposition
          </div>
          <div
            ref="elAktuell"
            class="letter-field letter-section"
            contenteditable="plaintext-only"
          />

          <div class="section-label" aria-hidden="true">
            ③ Eigene Entwicklungssituation
          </div>
          <div
            ref="elProjekte"
            class="letter-field letter-section"
            contenteditable="plaintext-only"
          />

          <div class="section-label" aria-hidden="true">④ Jobgeschichte</div>
          <div
            ref="elGeschichte"
            class="letter-field letter-section"
            contenteditable="plaintext-only"
          />

          <div class="section-label" aria-hidden="true">⑤ Referenzen</div>
          <div
            ref="elReferenzen"
            class="letter-field letter-section"
            contenteditable="plaintext-only"
          />

          <div class="section-label" aria-hidden="true">⑥ Abschluss</div>
          <div
            ref="elAbschluss"
            class="letter-field letter-section"
            contenteditable="plaintext-only"
          />
        </div>

        <!-- Closing — fixed -->
        <div class="letter-closing">
          <p>Mit freundlichen Grüßen,</p>
          <p class="letter-name">André Hommrich</p>
        </div>
      </div>

      <p class="letter-hint">
        Felder sind direkt bearbeitbar — klicken zum Editieren
      </p>
    </div>
  </div>
</template>

<style scoped>
/* ------------------------------------------------------------------ */
/* Theme tokens (mirrored from lebenslauf.vue)                        */
/* ------------------------------------------------------------------ */
.cv-root {
  --cv-bg: #ffffff;
  --cv-text: #1a1a1d;
  --cv-text-muted: rgba(26, 26, 29, 0.65);
  --cv-text-subtle: rgba(26, 26, 29, 0.5);
  --cv-card-bg: #ffffff;
  --cv-card-border: rgba(0, 0, 0, 0.1);
  --cv-card-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
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
    --cv-action-bg: rgba(59, 66, 69, 0.85);
    --cv-action-bg-hover: rgba(75, 85, 89, 0.95);
    --cv-action-color: #e5e7eb;
    --cv-action-border: rgba(229, 231, 235, 0.2);
  }
}

/* ------------------------------------------------------------------ */
/* Action bar                                                          */
/* ------------------------------------------------------------------ */
.cv-actions {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 50;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: flex-end;
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

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */
.cv-container {
  position: relative;
  z-index: 10;
  max-width: 210mm;
  margin: 0 auto;
  padding: 3rem 1rem 2rem;
}

/* ------------------------------------------------------------------ */
/* Letter card                                                         */
/* ------------------------------------------------------------------ */
.letter-card {
  background: var(--cv-card-bg);
  border: 1px solid var(--cv-card-border);
  border-top: 3px solid #8d1d29;
  box-shadow: var(--cv-card-shadow);
  padding: 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.letter-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.letter-sender {
  font-size: 0.88rem;
  line-height: 1.65;
  color: var(--cv-text-muted);
  font-style: normal;
}
.letter-sender strong {
  display: block;
  font-size: 0.95rem;
  color: #8d1d29;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.letter-sender a {
  color: inherit;
  text-decoration: underline;
}

.letter-date {
  text-align: right;
  font-size: 0.88rem;
  color: var(--cv-text-muted);
  white-space: nowrap;
}

.letter-sep {
  height: 1px;
  background: rgba(141, 29, 41, 0.2);
}

.letter-recipient {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  font-size: 0.9rem;
}

.letter-subject {
  font-size: 1rem;
  font-weight: 700;
  color: #8d1d29;
  margin-top: 0.35rem;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.letter-anrede {
  font-size: 0.95rem;
}

.letter-body {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.section-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(141, 29, 41, 0.45);
  margin-top: 0.65rem;
  margin-bottom: 0.1rem;
  pointer-events: none;
  user-select: none;
}
.section-label:first-child {
  margin-top: 0;
}

.letter-section {
  font-size: 0.95rem;
  line-height: 1.75;
  white-space: pre-wrap;
  min-height: 1.4em;
}

.letter-closing {
  font-size: 0.95rem;
  line-height: 2;
  margin-top: 0.25rem;
}
.letter-closing p {
  margin: 0;
}
.letter-name {
  font-weight: 700;
  color: #8d1d29;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* ------------------------------------------------------------------ */
/* Editable field visual feedback — screen only                       */
/* ------------------------------------------------------------------ */
.letter-field {
  cursor: text;
  border-radius: 3px;
  outline: none;
  min-height: 1.2em;
  transition: background 0.15s;
}
.letter-field:hover {
  background: rgba(141, 29, 41, 0.04);
  outline: 1px dashed rgba(141, 29, 41, 0.3);
}
.letter-field:focus {
  background: rgba(141, 29, 41, 0.06);
  outline: 1.5px solid rgba(141, 29, 41, 0.45);
}

.letter-hint {
  text-align: center;
  font-size: 0.78rem;
  color: var(--cv-text-subtle);
  margin-top: 0.75rem;
  letter-spacing: 0.04em;
}

/* ------------------------------------------------------------------ */
/* Mobile                                                              */
/* ------------------------------------------------------------------ */
@media (max-width: 640px) {
  .cv-container {
    padding: 3.5rem 0.5rem 1.5rem;
  }
  .letter-card {
    padding: 1.25rem 1rem;
    gap: 0.85rem;
  }
  .letter-header {
    flex-direction: column;
    gap: 0.5rem;
  }
  .letter-date {
    text-align: left;
    white-space: normal;
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
  }
}

/* ------------------------------------------------------------------ */
/* Print                                                               */
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
    --cv-card-bg: #ffffff;
    --cv-card-border: rgba(0, 0, 0, 0.15);
    --cv-card-shadow: none;
    min-height: 0 !important;
    background-color: transparent !important;
  }

  .cv-actions,
  .letter-hint {
    display: none !important;
  }

  :deep(.pattern-wrap) {
    display: none !important;
  }

  .cv-container {
    max-width: 100% !important;
    padding: 0 !important;
  }

  /* explicit print padding so box-decoration-break:clone repeats it on page 2 */
  .letter-card {
    padding: 12mm !important;
  }

  .letter-card {
    background: #ffffff !important;
    border: 1px solid rgba(0, 0, 0, 0.15) !important;
    border-top: 3px solid #8d1d29 !important;
    box-shadow: none !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    /* Repeat border + padding at every page break so each page gets the red top line */
    -webkit-box-decoration-break: clone !important;
    box-decoration-break: clone !important;
  }

  .letter-body {
    orphans: 4;
    widows: 4;
  }

  .section-label {
    display: none !important;
  }

  .letter-field:hover,
  .letter-field:focus {
    background: transparent !important;
    outline: none !important;
  }

  .letter-subject,
  .letter-name,
  .letter-sender strong {
    color: #8d1d29 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
</style>

<!--
  Non-scoped: applies smaller root font-size on mobile for this route.
  Mirrors the same block in lebenslauf.vue — cv-route class is set on <html>.
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
    font-size: 14px !important;
  }
}
</style>
