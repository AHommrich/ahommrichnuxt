<script setup lang="ts">
// Standalone cover-letter page — no site layout so print output stays clean.
definePageMeta({ layout: false });

// i18n (auto-imported by @nuxtjs/i18n).
const { t, locale } = useI18n();
const localePath = useLocalePath();

useSeoMeta({
  title: () => t("letter.seo.title"),
  robots: "noindex, nofollow, noarchive",
});

// html lang follows the active locale so the English PDF/HTML gets lang="en".
useHead(() => ({
  htmlAttrs: { lang: locale.value, class: "cv-route" },
}));

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

// Editable field defaults come from the letter.defaults.* i18n keys so the
// blank letter starts in the active language (German on /, English on /en).
const DEFAULTS = computed<Record<string, string>>(() => ({
  datum: t("letter.defaults.datum"),
  firma: t("letter.defaults.firma"),
  zh: t("letter.defaults.zh"),
  strasse: t("letter.defaults.strasse"),
  ort: t("letter.defaults.ort"),
  stelle: t("letter.defaults.stelle"),
  anrede: t("letter.defaults.anrede"),
  interesse: t("letter.defaults.interesse"),
  aktuell: t("letter.defaults.aktuell"),
  projekte: t("letter.defaults.projekte"),
  geschichte: t("letter.defaults.geschichte"),
  referenzen: t("letter.defaults.referenzen"),
  abschluss: t("letter.defaults.abschluss"),
}));

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

const { isPdfLoading, downloadPdf } = useDocumentPdf(
  locale.value === "en" ? "cover-letter.pdf" : "anschreiben.pdf",
);

async function generatePdf() {
  await downloadPdf(`/api/pdf/anschreiben?locale=${locale.value}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(getContent()),
  });
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
    setContent(DEFAULTS.value);
  }
  document.documentElement.setAttribute("data-ready", "1");
});
</script>

<template>
  <div class="cv-root">
    <AppCvPattern />

    <!-- Action bar — screen only -->
    <div class="cv-actions">
      <NuxtLink :to="localePath('/')" class="cv-action-btn">{{
        $t("letter.actions.home")
      }}</NuxtLink>
      <button type="button" class="cv-action-btn" @click="importJson">
        {{ $t("letter.actions.import") }}
      </button>
      <button type="button" class="cv-action-btn" @click="exportJson">
        {{ $t("letter.actions.export") }}
      </button>
      <button
        type="button"
        class="cv-action-btn cv-action-btn--primary"
        :disabled="isPdfLoading"
        @click="generatePdf"
      >
        {{
          isPdfLoading
            ? $t("letter.actions.pdfLoading")
            : $t("letter.actions.pdf")
        }}
      </button>
    </div>

    <!-- Document paper — floats over the site pattern -->
    <div class="cv-paper">
      <!-- SIGNATURE: same header band as /lebenslauf, contact block right -->
      <header class="cv-band">
        <div>
          <p class="cv-band-name">André Hommrich</p>
          <p class="cv-band-sub">{{ $t("letter.jobTitle") }}</p>
        </div>
        <address class="cv-band-contact">
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
      </header>
      <div class="cv-band-pin" aria-hidden="true"><span /></div>

      <div class="letter">
        <div
          ref="elDatum"
          class="letter-field letter-date"
          contenteditable="plaintext-only"
          spellcheck="false"
          @keydown.enter.prevent
        />

        <address class="letter-recipient">
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
        </address>

        <div
          ref="elStelle"
          class="letter-field letter-subject"
          contenteditable="plaintext-only"
          @keydown.enter.prevent
        />

        <div
          ref="elAnrede"
          class="letter-field letter-anrede"
          contenteditable="plaintext-only"
          @keydown.enter.prevent
        />

        <!-- Body: 6 structured paragraphs, labels are screen-only hints -->
        <div class="letter-body">
          <div class="section-label" aria-hidden="true">
            {{ $t("letter.sections.interesse") }}
          </div>
          <div
            ref="elInteresse"
            class="letter-field letter-section"
            contenteditable="plaintext-only"
          />

          <div class="section-label" aria-hidden="true">
            {{ $t("letter.sections.aktuell") }}
          </div>
          <div
            ref="elAktuell"
            class="letter-field letter-section"
            contenteditable="plaintext-only"
          />

          <div class="section-label" aria-hidden="true">
            {{ $t("letter.sections.entwicklung") }}
          </div>
          <div
            ref="elProjekte"
            class="letter-field letter-section"
            contenteditable="plaintext-only"
          />

          <div class="section-label" aria-hidden="true">
            {{ $t("letter.sections.geschichte") }}
          </div>
          <div
            ref="elGeschichte"
            class="letter-field letter-section"
            contenteditable="plaintext-only"
          />

          <div class="section-label" aria-hidden="true">
            {{ $t("letter.sections.referenzen") }}
          </div>
          <div class="letter-refs">
            <div
              ref="elReferenzen"
              class="letter-field letter-section"
              contenteditable="plaintext-only"
            />
          </div>

          <div class="section-label" aria-hidden="true">
            {{ $t("letter.sections.abschluss") }}
          </div>
          <div
            ref="elAbschluss"
            class="letter-field letter-section"
            contenteditable="plaintext-only"
          />
        </div>

        <!-- Diamond divider — brand echo, visible in print -->
        <div class="cv-divider" aria-hidden="true">
          <span class="cv-divider-line" />
          <span class="cv-divider-square" />
          <span class="cv-divider-line" />
        </div>

        <!-- Closing — fixed -->
        <div class="letter-closing">
          <p>{{ $t("letter.closing.greeting") }}</p>
          <p class="letter-name">André Hommrich</p>
        </div>
      </div>

      <p class="letter-hint">
        {{ $t("letter.hint") }}
      </p>
    </div>
  </div>
</template>

<style scoped>
/* ------------------------------------------------------------------ */
/* Header band — compact height, contact block replaces the diamonds  */
/* ------------------------------------------------------------------ */
.cv-band {
  padding: 1.9rem 2.6rem 1.7rem;
}
.cv-band-name {
  margin: 0;
  font-size: 1.55rem;
}
.cv-band-sub {
  font-size: 0.68rem;
}

.cv-band-contact {
  margin: 0;
  text-align: right;
  font-size: 0.74rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.85);
  font-style: normal;
}
.cv-band-contact a {
  color: #fff;
  text-decoration: none;
}

@media (max-width: 640px) {
  .cv-band-contact {
    text-align: left;
  }
}

/* ------------------------------------------------------------------ */
/* Letter — classic anatomy, no more boxes                            */
/* ------------------------------------------------------------------ */
.letter {
  padding: 2.4rem 2.6rem 2.8rem;
}

.letter-date {
  text-align: right;
  font-size: 0.85rem;
  color: var(--cv-text-muted);
  margin: 0 0 1.8rem;
}

.letter-recipient {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  font-size: 0.9rem;
  line-height: 1.65;
  color: var(--cv-text);
  margin: 0 0 2rem;
  font-style: normal;
}

.letter-subject {
  font-size: 1.02rem;
  font-weight: 700;
  color: var(--cv-accent);
  margin: 0 0 1.4rem;
}

.letter-anrede,
.letter-section {
  font-size: 0.93rem;
  line-height: 1.7;
  color: var(--cv-text);
}

/* Reference block: indented with a burgund line — echoes the timeline
   border used in the CV */
.letter-refs {
  border-left: 2px solid var(--cv-line-soft);
  padding-left: 1.1rem;
  margin: 0.65rem 0;
}

.letter-closing {
  margin-top: 2rem;
  font-size: 0.93rem;
  line-height: 2;
}
.letter-closing p {
  margin: 0 0 0.4rem;
}
.letter-name {
  font-weight: 700;
  color: var(--cv-accent-strong);
  font-size: 0.98rem;
}

.cv-divider {
  margin: 1.6rem 0;
}

/* ------------------------------------------------------------------ */
/* Body — 6 structured fields, section labels are screen-only hints   */
/* ------------------------------------------------------------------ */
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
  white-space: pre-wrap;
  min-height: 1.4em;
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
  .cv-band {
    padding: 1.5rem 1.2rem 1.3rem;
  }
  .letter {
    padding: 1.4rem 1.2rem 1.8rem;
  }
}

/* ------------------------------------------------------------------ */
/* Print                                                               */
/* ------------------------------------------------------------------ */
@media print {
  .cv-band {
    padding: 12mm 20mm 9mm;
  }
  .letter {
    padding: 10mm 20mm 15mm;
    /* Repeats the padding on every page fragment — without it, only the
       first page gets top clearance and subsequent pages start flush
       against the page edge. */
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
  }
  .letter-anrede,
  .letter-section {
    orphans: 4;
    widows: 4;
  }
  .letter-refs,
  .letter-closing {
    break-inside: avoid;
  }

  .letter-hint,
  .section-label {
    display: none !important;
  }

  .letter-field:hover,
  .letter-field:focus {
    background: transparent !important;
    outline: none !important;
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
