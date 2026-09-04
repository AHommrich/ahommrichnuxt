<script setup lang="ts">
useSeoMeta({
  title: "Datenschutzerklärung — André Hommrich",
  robots: "noindex, nofollow",
});
</script>

<template>
  <div
    class="mx-auto w-full max-w-3xl px-4 pt-32 pb-24 sm:px-9 flex flex-col gap-12"
  >
    <!-- 1. Verantwortlicher -->
    <AppCard>
      <h2 class="text-2xl font-bold text-gray-200 sm:text-3xl">
        Datenschutzerklärung
      </h2>
      <h3 class="text-lg font-semibold text-gray-200">1. Verantwortlicher</h3>
      <p class="text-gray-200 text-sm leading-relaxed">
        André Hommrich<br />
        Dernbacher Str. 26<br />
        56410 Montabaur<br />
        E-Mail:
        <a href="mailto:info@hommri.ch" class="underline">info@hommri.ch</a>
      </p>
    </AppCard>

    <!-- 2. Hosting -->
    <AppCard>
      <h3 class="text-lg font-semibold text-gray-200">2. Hosting</h3>
      <p class="text-gray-200 text-sm leading-relaxed">
        Diese Website wird gehostet bei der
        <strong>Hetzner Online GmbH</strong>, Industriestr. 25, 91710
        Gunzenhausen. Der Serverstandort ist
        <strong>Nürnberg, Deutschland</strong>. Hetzner kann auf
        Infrastrukturebene (Netzwerk, Hypervisor) technische Verbindungsdaten
        verarbeiten. Informationen dazu finden sich in der Datenschutzerklärung
        von Hetzner:
        <a
          href="https://www.hetzner.com/de/legal/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
          class="underline"
        >
          hetzner.com/de/legal/privacy-policy
        </a>
      </p>
      <p class="text-gray-200 text-sm leading-relaxed">
        Als Reverse Proxy setzt der Server <strong>Traefik</strong> ein,
        verwaltet über die Deployment-Plattform <strong>Coolify</strong>. Zum
        technischen Betrieb kann Traefik kurzzeitig Verbindungsdaten wie
        IP-Adressen verarbeiten. Diese werden nicht dauerhaft gespeichert und
        dienen ausschließlich der Bereitstellung sowie der Betriebssicherheit
        der Website. Die Nuxt-Anwendung selbst schreibt
        <strong>keine Access-Logs</strong> und speichert keine personenbezogenen
        Nutzungsdaten.
      </p>
    </AppCard>

    <!-- 3. Cookies & Reichweitenmessung -->
    <AppCard>
      <h3 class="text-lg font-semibold text-gray-200">
        3. Cookies und Reichweitenmessung
      </h3>
      <p class="text-gray-200 text-sm leading-relaxed">
        Diese Website verwendet <strong>keine Cookies</strong> und übermittelt
        keine Daten an Drittanbieter wie Google Analytics oder ähnliche Dienste.
      </p>
      <p class="text-gray-200 text-sm leading-relaxed mt-4">
        Zur Reichweitenmessung nutzen wir die selbst gehostete, datensparsame
        Analyse-Software <strong>Umami</strong>. Umami arbeitet ohne Cookies,
        ohne geräteübergreifende Kennungen und ohne die Bildung persönlicher
        Profile. Es werden ausschließlich anonymisierte Nutzungsdaten
        (z.&nbsp;B. aufgerufene Seiten, ungefähre Herkunft auf Länderebene,
        verwendeter Browsertyp) erhoben; ein Rückschluss auf einzelne Personen
        ist dabei nicht möglich, und die Daten verlassen unsere eigene, in
        Deutschland gehostete Serverumgebung nicht. Ihre IP-Adresse wird dabei
        nur kurzzeitig serverseitig verarbeitet, um wiederkehrende Aufrufe zu
        erkennen und die ungefähre Herkunft zu bestimmen; sie wird nicht
        gespeichert, sondern fließt lediglich in einen täglich wechselnden,
        nicht umkehrbaren Kennwert ein. Die so erhobenen statistischen Daten
        werden für höchstens 14 Monate aufbewahrt und anschließend gelöscht.
        Rechtsgrundlage ist unser berechtigtes Interesse an einer statistischen
        Auswertung und Verbesserung des Angebots gemäß Art.&nbsp;6 Abs.&nbsp;1
        lit.&nbsp;f DSGVO.
      </p>
      <p class="text-gray-200 text-sm leading-relaxed mt-4">
        Da diese Website selbst keinerlei Cookies oder sonstige Daten auf Ihrem
        Endgerät speichert oder ausliest, die nicht für den Betrieb der Seite
        unbedingt erforderlich sind, ist hierfür weder ein Einwilligungsbanner
        noch eine Einwilligung nach
        <strong>§&nbsp;25 TDDDG</strong> erforderlich.
      </p>
    </AppCard>

    <!-- 4. Externe Links -->
    <AppCard>
      <h3 class="text-lg font-semibold text-gray-200">4. Externe Links</h3>
      <p class="text-gray-200 text-sm leading-relaxed">
        Im Impressum dieser Website befinden sich Links zu
        <strong>unsplash.com</strong>
        zur Quellenangabe verwendeter Fotos. Beim Klick auf diese Links wird
        Ihre IP-Adresse sowie ein Referrer-Parameter an Unsplash übertragen. Auf
        diese Datenverarbeitung haben wir keinen Einfluss. Datenschutzerklärung
        von Unsplash:
        <a
          href="https://unsplash.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          class="underline"
        >
          unsplash.com/privacy
        </a>
      </p>
    </AppCard>

    <!-- 5. Kontaktformular -->
    <AppCard>
      <h3 class="text-lg font-semibold text-gray-200">5. Kontaktformular</h3>
      <p class="text-gray-200 text-sm leading-relaxed">
        Wenn Sie das Kontaktformular nutzen, verarbeite ich die von Ihnen
        angegebenen Daten (Vor- und Nachname, E-Mail-Adresse, optional
        Telefonnummer, das gewählte Anliegen und Thema sowie Ihre Nachricht), um
        Ihre Anfrage zu bearbeiten und zu beantworten. Zusätzlich werden der
        Zeitpunkt und die Version des von Ihnen bestätigten Datenschutzhinweises
        protokolliert, um Ihre Einwilligung nachweisen zu können.
      </p>
      <p class="text-gray-200 text-sm leading-relaxed mt-4">
        Rechtsgrundlage ist bei Anfragen mit dem Ziel eines Vertrags- oder
        Geschäftsverhältnisses Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;b DSGVO, im
        Übrigen unser berechtigtes Interesse an der Beantwortung Ihrer Anfrage
        gemäß Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;f DSGVO.
      </p>
      <p class="text-gray-200 text-sm leading-relaxed mt-4">
        Für die technische Entgegennahme und die zuverlässige Zustellung der
        Formularnachricht per E-Mail nutze ich einen von mir selbst betriebenen,
        zentralen Zustelldienst („hommrich-hub"), der auf derselben in
        Deutschland gehosteten Serverinfrastruktur (Hetzner, siehe
        Ziffer&nbsp;2) läuft. Der eigentliche E-Mail-Versand erfolgt über den
        Dienstleister
        <strong>Brevo (Sendinblue GmbH)</strong>, Köpenicker Straße 126, 10179
        Berlin, der als Auftragsverarbeiter auf Grundlage eines Vertrags nach
        Art.&nbsp;28 DSGVO tätig ist. Datenschutzerklärung von Brevo:
        <a
          href="https://www.brevo.com/de/legal/privacypolicy/"
          target="_blank"
          rel="noopener noreferrer"
          class="underline"
        >
          brevo.com/de/legal/privacypolicy
        </a>
      </p>
      <p class="text-gray-200 text-sm leading-relaxed mt-4">
        Ihre Angaben werden ausschließlich zur Bearbeitung Ihrer Anfrage
        verwendet und nicht zu Werbezwecken genutzt. Ich lösche die Daten,
        sobald die Bearbeitung Ihrer Anfrage abgeschlossen ist und keine
        gesetzlichen Aufbewahrungspflichten entgegenstehen.
      </p>
    </AppCard>

    <!-- 6. Ihre Rechte -->
    <AppCard>
      <h3 class="text-lg font-semibold text-gray-200">6. Ihre Rechte</h3>
      <p class="text-gray-200 text-sm leading-relaxed">
        Sie haben gegenüber dem Verantwortlichen folgende Rechte:
      </p>
      <ul class="list-inside list-disc pl-2 flex flex-col gap-1">
        <li class="text-gray-200 text-sm">
          Recht auf Auskunft (Art. 15 DSGVO)
        </li>
        <li class="text-gray-200 text-sm">
          Recht auf Berichtigung (Art. 16 DSGVO)
        </li>
        <li class="text-gray-200 text-sm">
          Recht auf Löschung (Art. 17 DSGVO)
        </li>
        <li class="text-gray-200 text-sm">
          Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)
        </li>
        <li class="text-gray-200 text-sm">
          Recht auf Widerspruch (Art. 21 DSGVO)
        </li>
        <li class="text-gray-200 text-sm">
          Recht auf Datenübertragbarkeit (Art. 20 DSGVO)
        </li>
      </ul>
      <p class="text-gray-200 text-sm leading-relaxed">
        Zur Ausübung Ihrer Rechte wenden Sie sich bitte per E-Mail an:
        <a href="mailto:info@hommri.ch" class="underline text-gray-200"
          >info@hommri.ch</a
        >
      </p>
      <p class="text-gray-200 text-sm leading-relaxed">
        Zudem haben Sie das Recht, sich bei einer Datenschutz-Aufsichtsbehörde
        zu beschweren. Die zuständige Behörde für Rheinland-Pfalz ist der
        <a
          href="https://www.datenschutz.rlp.de"
          target="_blank"
          rel="noopener noreferrer"
          class="underline"
        >
          Landesbeauftragte für den Datenschutz und die Informationsfreiheit
          Rheinland-Pfalz </a
        >.
      </p>
    </AppCard>

    <p class="text-gray-400 text-xs italic text-right">Stand: August 2026</p>
  </div>
</template>
