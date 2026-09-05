<script setup lang="ts">
const { t } = useI18n();

useSeoMeta({
  title: () => t("seo.datenschutz.title"),
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
        {{ $t("legal.datenschutz.title") }}
      </h2>
      <h3 class="text-lg font-semibold text-gray-200">
        {{ $t("legal.datenschutz.controllerHeading") }}
      </h3>
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
      <h3 class="text-lg font-semibold text-gray-200">
        {{ $t("legal.datenschutz.hostingHeading") }}
      </h3>
      <RichText
        class="text-gray-200 text-sm leading-relaxed"
        :html="$t('legal.datenschutz.hostingP1')"
      />
      <RichText
        class="text-gray-200 text-sm leading-relaxed"
        :html="$t('legal.datenschutz.hostingP2')"
      />
    </AppCard>

    <!-- 3. Cookies & Reichweitenmessung -->
    <AppCard>
      <h3 class="text-lg font-semibold text-gray-200">
        {{ $t("legal.datenschutz.cookiesHeading") }}
      </h3>
      <RichText
        class="text-gray-200 text-sm leading-relaxed"
        :html="$t('legal.datenschutz.cookiesP1')"
      />
      <RichText
        class="text-gray-200 text-sm leading-relaxed mt-4"
        :html="$t('legal.datenschutz.cookiesP2')"
      />
      <RichText
        class="text-gray-200 text-sm leading-relaxed mt-4"
        :html="$t('legal.datenschutz.cookiesP3')"
      />
    </AppCard>

    <!-- 4. Externe Links -->
    <AppCard>
      <h3 class="text-lg font-semibold text-gray-200">
        {{ $t("legal.datenschutz.linksHeading") }}
      </h3>
      <RichText
        class="text-gray-200 text-sm leading-relaxed"
        :html="$t('legal.datenschutz.linksP1')"
      />
    </AppCard>

    <!-- 5. Kontaktformular -->
    <AppCard>
      <h3 class="text-lg font-semibold text-gray-200">
        {{ $t("legal.datenschutz.contactFormHeading") }}
      </h3>
      <RichText
        class="text-gray-200 text-sm leading-relaxed"
        :html="$t('legal.datenschutz.contactFormP1')"
      />
      <RichText
        class="text-gray-200 text-sm leading-relaxed mt-4"
        :html="$t('legal.datenschutz.contactFormP2')"
      />
      <RichText
        class="text-gray-200 text-sm leading-relaxed mt-4"
        :html="$t('legal.datenschutz.contactFormP3')"
      />
      <RichText
        class="text-gray-200 text-sm leading-relaxed mt-4"
        :html="$t('legal.datenschutz.contactFormP4')"
      />
    </AppCard>

    <!-- 6. Ihre Rechte -->
    <AppCard>
      <h3 class="text-lg font-semibold text-gray-200">
        {{ $t("legal.datenschutz.rightsHeading") }}
      </h3>
      <p class="text-gray-200 text-sm leading-relaxed">
        {{ $t("legal.datenschutz.rightsIntro") }}
      </p>
      <ul class="list-inside list-disc pl-2 flex flex-col gap-1">
        <li class="text-gray-200 text-sm">
          {{ $t("legal.datenschutz.rightsAccess") }}
        </li>
        <li class="text-gray-200 text-sm">
          {{ $t("legal.datenschutz.rightsRectification") }}
        </li>
        <li class="text-gray-200 text-sm">
          {{ $t("legal.datenschutz.rightsErasure") }}
        </li>
        <li class="text-gray-200 text-sm">
          {{ $t("legal.datenschutz.rightsRestriction") }}
        </li>
        <li class="text-gray-200 text-sm">
          {{ $t("legal.datenschutz.rightsObjection") }}
        </li>
        <li class="text-gray-200 text-sm">
          {{ $t("legal.datenschutz.rightsPortability") }}
        </li>
      </ul>
      <p class="text-gray-200 text-sm leading-relaxed">
        {{ $t("legal.datenschutz.rightsContact") }}
        <a href="mailto:info@hommri.ch" class="underline text-gray-200"
          >info@hommri.ch</a
        >
      </p>
      <RichText
        class="text-gray-200 text-sm leading-relaxed"
        :html="$t('legal.datenschutz.supervisoryAuthority')"
      />
    </AppCard>

    <p class="text-gray-400 text-xs italic text-right">
      {{ $t("legal.datenschutz.lastUpdated") }}
    </p>
  </div>
</template>
