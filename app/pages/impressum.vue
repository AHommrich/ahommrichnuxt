<script setup lang="ts">
const { t } = useI18n();

useSeoMeta({
  title: () => t("seo.impressum.title"),
  robots: "noindex, nofollow",
});
</script>

<template>
  <div
    class="mx-auto w-full max-w-3xl px-4 pt-32 pb-24 sm:px-9 flex flex-col gap-12"
  >
    <!-- Contact info card -->
    <AppCard>
      <h2 class="text-2xl font-bold text-gray-200 sm:text-3xl">
        {{ $t("legal.impressum.title") }}
      </h2>
      <p class="text-gray-200 text-sm">{{ $t("legal.impressum.tmg") }}</p>
      <p class="text-gray-200">André Hommrich</p>
      <p class="text-gray-200">Dernbacher Str. 26</p>
      <p class="text-gray-200">56410 Montabaur</p>

      <p class="text-gray-200 mt-4">{{ $t("legal.impressum.contactLabel") }}</p>
      <a href="mailto:info@hommri.ch" class="text-gray-200 underline"
        >info@hommri.ch</a
      >
      <a href="tel:+4915257415832" class="text-gray-200 underline"
        >0152 57415832</a
      >

      <p class="text-gray-200 text-sm mt-4">
        {{ $t("legal.impressum.smallBusiness") }}
      </p>
      <p class="text-gray-200 text-sm mt-4">
        {{ $t("legal.impressum.responsible") }}
      </p>
    </AppCard>

    <!-- Photo credits card -->
    <AppCard>
      <h3 class="text-xl font-semibold text-gray-200">
        {{ $t("legal.impressum.creditsTitle") }}
      </h3>
      <p class="text-gray-200 text-sm">
        {{ $t("legal.impressum.creditsIntro") }}
      </p>
      <ul class="list-inside list-decimal flex flex-col gap-2">
        <li class="text-gray-200 text-sm">
          {{ $t("legal.impressum.photoBy") }}
          <a
            href="https://unsplash.com/de/@afgprogrammer?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
            target="_blank"
            rel="noopener noreferrer"
            class="underline"
            >Mohammad Rahmani</a
          >
          {{ $t("legal.impressum.photoOn") }}
          <a
            href="https://unsplash.com/de/fotos/schwarzer-laptop-computer-mit-blauem-bildschirm-eingeschaltet-N5bT5RctFZ8?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
            target="_blank"
            rel="noopener noreferrer"
            class="underline"
            >Unsplash</a
          >
        </li>
        <li class="text-gray-200 text-sm">
          {{ $t("legal.impressum.photoBy") }}
          <a
            href="https://unsplash.com/de/@joeynicotra?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
            target="_blank"
            rel="noopener noreferrer"
            class="underline"
            >Joey Nicotra</a
          >
          {{ $t("legal.impressum.photoOn") }}
          <a
            href="https://unsplash.com/de/fotos/mann-spielt-gitarre-in-nahaufnahme-OZzu3Euverk?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
            target="_blank"
            rel="noopener noreferrer"
            class="underline"
            >Unsplash</a
          >
        </li>
        <li class="text-gray-200 text-sm">
          {{ $t("legal.impressum.photoBy") }}
          <a
            href="https://unsplash.com/de/@hobiindustri?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
            target="_blank"
            rel="noopener noreferrer"
            class="underline"
            >Hobi industri</a
          >
          {{ $t("legal.impressum.photoOn") }}
          <a
            href="https://unsplash.com/de/fotos/schwarz-gelbe-stromzange-NLBJ2I0lNr4?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
            target="_blank"
            rel="noopener noreferrer"
            class="underline"
            >Unsplash</a
          >
        </li>
        <li class="text-gray-200 text-sm">
          {{ $t("legal.impressum.photoBy") }}
          <a
            href="https://unsplash.com/de/@campaign_creators?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
            target="_blank"
            rel="noopener noreferrer"
            class="underline"
            >Campaign Creators</a
          >
          {{ $t("legal.impressum.photoOn") }}
          <a
            href="https://unsplash.com/de/fotos/person-using-macbook-pro-OGOWDVLbMSc?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
            target="_blank"
            rel="noopener noreferrer"
            class="underline"
            >Unsplash</a
          >
        </li>
      </ul>
    </AppCard>
  </div>
</template>
