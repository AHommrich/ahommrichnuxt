<script setup lang="ts"></script>

<template>
  <div class="mx-auto w-full max-w-3xl px-4 pt-32 pb-24 sm:px-9 flex flex-col gap-12">

    <!-- 1. Verantwortlicher -->
    <div class="relative w-full">
      <div class="absolute inset-0 w-full translate-x-1.5 translate-y-1.5 rounded-xl border border-[#3b4245] bg-white opacity-80 dark:border-white dark:bg-[#3b4245]" />
      <div class="absolute inset-0 w-full -translate-x-1.5 -translate-y-1.5 rounded-xl border border-[#3b4245] bg-[#8D1D29] opacity-80 dark:border-white" />
      <div class="relative z-10 flex flex-col p-6 gap-3">
        <h2 class="text-2xl font-bold text-gray-200 sm:text-3xl">Datenschutzerklärung</h2>
        <h3 class="text-lg font-semibold text-gray-200">1. Verantwortlicher</h3>
        <p class="text-gray-200 text-sm leading-relaxed">
          André Hommrich<br />
          Dernbacher Str. 26<br />
          56410 Montabaur<br />
          E-Mail:
          <a href="mailto:andre-hommrich@web.de" class="underline">andre-hommrich@web.de</a>
        </p>
      </div>
    </div>

    <!-- 2. Hosting -->
    <div class="relative w-full">
      <div class="absolute inset-0 w-full translate-x-1.5 translate-y-1.5 rounded-xl border border-[#3b4245] bg-white opacity-80 dark:border-white dark:bg-[#3b4245]" />
      <div class="absolute inset-0 w-full -translate-x-1.5 -translate-y-1.5 rounded-xl border border-[#3b4245] bg-[#8D1D29] opacity-80 dark:border-white" />
      <div class="relative z-10 flex flex-col p-6 gap-3">
        <h3 class="text-lg font-semibold text-gray-200">2. Hosting</h3>
        <p class="text-gray-200 text-sm leading-relaxed">
          Diese Website wird gehostet bei der <strong>Hetzner Online GmbH</strong>,
          Industriestr. 25, 91710 Gunzenhausen. Hetzner kann auf Infrastrukturebene
          (Netzwerk, Hypervisor) technische Verbindungsdaten verarbeiten. Informationen
          dazu finden sich in der Datenschutzerklärung von Hetzner:
          <a href="https://www.hetzner.com/de/legal/privacy-policy" target="_blank" rel="noopener noreferrer" class="underline">
            hetzner.com/de/legal/privacy-policy
          </a>
        </p>
        <p class="text-gray-200 text-sm leading-relaxed">
          Der eingesetzte Webserver (Caddy) ist so konfiguriert, dass
          <strong>keine Access-Logs</strong> geschrieben werden. Es werden somit
          keine IP-Adressen oder sonstige Zugriffsdaten auf Anwendungsebene
          gespeichert. Technische Fehlermeldungen des Servers werden ausschließlich
          temporär im Arbeitsspeicher des Containers vorgehalten und sind auf
          maximal 15 MB begrenzt.
        </p>
      </div>
    </div>

    <!-- 3. Cookies & Tracking -->
    <div class="relative w-full">
      <div class="absolute inset-0 w-full translate-x-1.5 translate-y-1.5 rounded-xl border border-[#3b4245] bg-white opacity-80 dark:border-white dark:bg-[#3b4245]" />
      <div class="absolute inset-0 w-full -translate-x-1.5 -translate-y-1.5 rounded-xl border border-[#3b4245] bg-[#8D1D29] opacity-80 dark:border-white" />
      <div class="relative z-10 flex flex-col p-6 gap-3">
        <h3 class="text-lg font-semibold text-gray-200">3. Cookies und Tracking</h3>
        <p class="text-gray-200 text-sm leading-relaxed">
          Diese Website verwendet <strong>keine Cookies</strong> und setzt
          <strong>kein Tracking oder Analytics</strong> ein. Es werden keine
          Nutzungsprofile erstellt und keine Daten an Drittanbieter wie
          Google Analytics oder ähnliche Dienste übermittelt.
        </p>
      </div>
    </div>

    <!-- 4. Externe Links -->
    <div class="relative w-full">
      <div class="absolute inset-0 w-full translate-x-1.5 translate-y-1.5 rounded-xl border border-[#3b4245] bg-white opacity-80 dark:border-white dark:bg-[#3b4245]" />
      <div class="absolute inset-0 w-full -translate-x-1.5 -translate-y-1.5 rounded-xl border border-[#3b4245] bg-[#8D1D29] opacity-80 dark:border-white" />
      <div class="relative z-10 flex flex-col p-6 gap-3">
        <h3 class="text-lg font-semibold text-gray-200">4. Externe Links</h3>
        <p class="text-gray-200 text-sm leading-relaxed">
          Im Impressum dieser Website befinden sich Links zu <strong>unsplash.com</strong>
          zur Quellenangabe verwendeter Fotos. Beim Klick auf diese Links wird Ihre
          IP-Adresse sowie ein Referrer-Parameter an Unsplash übertragen. Auf diese
          Datenverarbeitung haben wir keinen Einfluss. Datenschutzerklärung von Unsplash:
          <a href="https://unsplash.com/privacy" target="_blank" rel="noopener noreferrer" class="underline">
            unsplash.com/privacy
          </a>
        </p>
      </div>
    </div>

    <!-- 5. Ihre Rechte -->
    <div class="relative w-full">
      <div class="absolute inset-0 w-full translate-x-1.5 translate-y-1.5 rounded-xl border border-[#3b4245] bg-white opacity-80 dark:border-white dark:bg-[#3b4245]" />
      <div class="absolute inset-0 w-full -translate-x-1.5 -translate-y-1.5 rounded-xl border border-[#3b4245] bg-[#8D1D29] opacity-80 dark:border-white" />
      <div class="relative z-10 flex flex-col p-6 gap-3">
        <h3 class="text-lg font-semibold text-gray-200">5. Ihre Rechte</h3>
        <p class="text-gray-200 text-sm leading-relaxed">Sie haben gegenüber dem Verantwortlichen folgende Rechte:</p>
        <ul class="list-inside list-disc pl-2 flex flex-col gap-1">
          <li class="text-gray-200 text-sm">Recht auf Auskunft (Art. 15 DSGVO)</li>
          <li class="text-gray-200 text-sm">Recht auf Berichtigung (Art. 16 DSGVO)</li>
          <li class="text-gray-200 text-sm">Recht auf Löschung (Art. 17 DSGVO)</li>
          <li class="text-gray-200 text-sm">Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
          <li class="text-gray-200 text-sm">Recht auf Widerspruch (Art. 21 DSGVO)</li>
          <li class="text-gray-200 text-sm">Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
        </ul>
        <p class="text-gray-200 text-sm leading-relaxed">
          Zur Ausübung Ihrer Rechte wenden Sie sich bitte per E-Mail an:
          <a href="mailto:andre-hommrich@web.de" class="underline text-gray-200">andre-hommrich@web.de</a>
        </p>
        <p class="text-gray-200 text-sm leading-relaxed">
          Zudem haben Sie das Recht, sich bei einer Datenschutz-Aufsichtsbehörde
          zu beschweren. Die zuständige Behörde für Rheinland-Pfalz ist der
          <a href="https://www.datenschutz.rlp.de" target="_blank" rel="noopener noreferrer" class="underline">
            Landesbeauftragte für den Datenschutz und die Informationsfreiheit Rheinland-Pfalz
          </a>.
        </p>
      </div>
    </div>

  </div>
</template>
