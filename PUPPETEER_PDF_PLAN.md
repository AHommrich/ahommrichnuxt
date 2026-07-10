# Puppeteer PDF-Generator — Implementierungsplan

> **Status: UMGESETZT — alle 5 Phasen abgeschlossen**
>
> Dieses Dokument fasst alle Entscheidungen aus der Planungsphase zusammen
> und dient als direkte Arbeitsgrundlage für die Umsetzung.

---

## Kontext & Ziel

Die Seiten `/lebenslauf` und `/anschreiben` nutzen aktuell `window.print()` für
den PDF-Export. Chrome ignoriert dabei `background-size` für SVG-Background-Images
und rendert den Hintergrund falsch skaliert.

**Ziel:** Serverseitiger PDF-Export via Puppeteer, der die Seite exakt so rendert
wie sie im Browser aussieht — korrekter Hintergrund, Farben, Schriften, Vektortext.

---

## Entscheidungen (bereits getroffen, nicht mehr diskutieren)

| Frage | Entscheidung | Begründung |
|---|---|---|
| Deployment | Dockerfile bleibt einzelner Container | Kein zweiter Service nötig, Chromium läuft als Node.js-Subprocess |
| Docker Compose | Nicht nötig | Keine Datenbank, keine isolierten Services |
| Puppeteer-Paket | `puppeteer-core` + System-Chromium via apt | Kleineres Image (~500MB) vs. `puppeteer` mit bundled Chrome (~900MB) |
| Architektur | Interne Server-Route im bestehenden Nuxt-Server | Keine neue Instanz, kein neuer Port, Coolify/Traefik sehen keinen Unterschied |
| DSGVO | Unbedenklich | Alles läuft auf eigenem Server, keine externen Dienste |
| Anschreiben-Daten | Bestehende `getContent()`-Funktion liefert JSON | Bereits implementiert für Import/Export — gleiche Struktur |

---

## Architektur-Überblick

```
Browser
  ↓  "Als PDF speichern" Klick
  ↓  POST /api/pdf/anschreiben  { datum, firma, zh, ... }
  ↓  (für /lebenslauf: GET /api/pdf/lebenslauf, kein Body)

Nuxt Server (bestehende Instanz)
  ↓  server/api/pdf/anschreiben.post.ts
  ↓  Puppeteer rendert /anschreiben/print?data=...
  ↓  gibt PDF-Buffer zurück (application/pdf)

Browser
  ↓  löst direkten Download aus (kein Druckdialog)
```

---

## Abhakbare Aufgabenliste

### Phase 1 — Docker vorbereiten

- [ ] **Dockerfile erweitern**: Chromium + System-Fonts installieren

  ```dockerfile
  RUN apt-get update && apt-get install -y \
      chromium \
      fonts-liberation \
      fonts-noto-color-emoji \
      fonts-dejavu-core \
      --no-install-recommends \
      && rm -rf /var/lib/apt/lists/*

  ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
  ```

- [ ] **`puppeteer-core` installieren**

  ```bash
  npm install puppeteer-core
  ```

- [ ] Lokaler Build-Test: `docker compose build` — Chromium muss sauber installiert sein

### Phase 2 — Print-Routen anlegen

- [ ] **`/anschreiben/print` Route** anlegen (`pages/anschreiben/print.vue`)
  - `layout: false`, `noindex`
  - Empfängt Feldinhalte via URL-Query-Params oder Session-Storage
  - Rendert nur den Brief ohne Action-Bar, ohne Hint-Text
  - Print-CSS bereits vorhanden, hier nur sauber aktivieren

- [ ] **`/lebenslauf/print` Route** anlegen (oder bestehende Seite direkt nutzen)
  - Lebenslauf ist statisch → Puppeteer kann direkt `/lebenslauf` rendern
  - Alternativ dedizierte Print-Route ohne Action-Bar

### Phase 3 — Server-Endpunkte

- [ ] **`server/api/pdf/anschreiben.post.ts`** implementieren

  ```typescript
  import puppeteer from 'puppeteer-core'

  export default defineEventHandler(async (event) => {
    const body = await readBody(event)  // { datum, firma, zh, ... }

    const browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    const page = await browser.newPage()
    await page.setViewport({ width: 794, height: 1123 })  // A4 bei 96 DPI

    // Seite aufrufen (Self-Call) oder HTML direkt injecten
    const params = new URLSearchParams(body).toString()
    await page.goto(`http://localhost:3000/anschreiben/print?${params}`, {
      waitUntil: 'networkidle0',
    })

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '15mm', right: '20mm', bottom: '15mm', left: '20mm' },
    })

    await browser.close()

    setHeader(event, 'Content-Type', 'application/pdf')
    setHeader(event, 'Content-Disposition', 'attachment; filename="anschreiben.pdf"')
    return pdf
  })
  ```

- [ ] **`server/api/pdf/lebenslauf.get.ts`** implementieren (analog, kein Body)

- [ ] **Puppeteer Browser-Instanz** warmhalten (optional, Optimierung):
  Browser beim Server-Start einmal öffnen statt pro Request neu starten → spart ~2-3s pro PDF

### Phase 4 — Frontend anpassen

- [ ] **`anschreiben.vue`** — `downloadPdf()` auf API-Call umstellen

  ```typescript
  async function downloadPdf() {
    const response = await fetch('/api/pdf/anschreiben', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(getContent()),
    })
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'anschreiben.pdf'
    a.click()
    URL.revokeObjectURL(url)
  }
  ```

- [ ] **`lebenslauf.vue`** — `downloadPdf()` analog auf `/api/pdf/lebenslauf` umstellen

- [ ] Ladeindikator während PDF generiert wird (Puppeteer braucht 2-5s)

### Phase 5 — Testen & Abschluss

- [ ] Lokaler Test: PDF generieren, Background prüfen
- [ ] Docker-Test: `docker compose up -d`, dann PDF testen
- [ ] Deployment via Coolify: Push → Build → fertig
- [ ] Alten `window.print()`-Fallback entfernen (oder als Fallback drin lassen)
- [ ] `npm run lintfix` ausführen

---

## Offene Fragen / Stop-Punkte

Diese Fragen erst mit André klären bevor weitergemacht wird:

1. **Self-Call vs. HTML-Injection**: Puppeteer kann entweder `http://localhost:3000/anschreiben/print` aufrufen (einfacher, aber Server ruft sich selbst) oder HTML direkt via `page.setContent()` injecten (kein Netzwerk-Overhead, komplexer). Bevorzugter Ansatz?

2. **Browser warmhalten**: Für eine persönliche Portfolio-Seite mit sporadischer Nutzung wahrscheinlich nicht nötig (Cold-Start ~3s ist ok). Trotzdem implementieren?

3. **Fehlerfall**: Was passiert wenn Puppeteer abstürzt oder Timeout? Fallback auf `window.print()`?

---

## Technische Referenz

```
Node.js:         v20 (laut .nvmrc)
Nuxt Preset:     node-server
Deployment:      Docker + Coolify + Traefik
Puppeteer-Pkg:   puppeteer-core (kein bundled Browser)
Chromium:        /usr/bin/chromium (via apt im Dockerfile)
Env-Variable:    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
Image-Größe:     ~250MB (aktuell) → ~500MB (nach Chromium)
RAM-Overhead:    +200-400MB pro Chromium-Instanz
```
