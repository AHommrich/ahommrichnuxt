<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from "vue";
import AppCard from "~/components/AppCard.vue";
import {
  contactIntents,
  contactPrivacyNoticeVersion,
  getContactIntent,
  type ContactIconName,
  type ContactIntentId,
  type ContactTopicId,
} from "~~/data/contact";
import type {
  ContactFormPayload,
  ContactSubmissionResponse,
} from "~~/types/contact";

// FontAwesome ist ein client-only Plugin — Rendern auf dem Server erzeugt eine
// Hydration-Mismatch. Dieser Flag gated alle <font-awesome-icon>-Nutzungen.
const isClient = ref(false);
onMounted(() => {
  isClient.value = import.meta.client;
});

const iconFor: Record<ContactIconName, string> = {
  screen: "display",
  message: "comment-dots",
};

// Formularzustand
const intent = ref<ContactIntentId>(contactIntents[0].id);
const topic = ref<ContactTopicId>(contactIntents[0].topics[0].id);
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const phone = ref("");
const message = ref("");
const privacyConsent = ref(false);
const website = ref(""); // Honeypot

const privacyNoticeAcceptedAt = ref("");
const privacyNoticeTimezone = ref("");

const isSubmitting = ref(false);
const formSubmitted = ref(false);
const errorMessage = ref("");

const activeIntent = computed(() => getContactIntent(intent.value));

// Beim Wechsel des Anliegens das Thema auf das erste gültige des neuen Anliegens setzen.
watch(intent, (next) => {
  topic.value = getContactIntent(next).topics[0].id;
});

type FieldKey =
  "firstName" | "lastName" | "email" | "message" | "privacyConsent";
const fieldErrors = reactive<Record<FieldKey, string>>({
  firstName: "",
  lastName: "",
  email: "",
  message: "",
  privacyConsent: "",
});
const clearFieldError = (key: FieldKey) => {
  fieldErrors[key] = "";
};

const clientTimezone = () =>
  Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

const handlePrivacyConsentChange = () => {
  clearFieldError("privacyConsent");
  if (privacyConsent.value) {
    privacyNoticeAcceptedAt.value = new Date().toISOString();
    privacyNoticeTimezone.value = clientTimezone();
  } else {
    privacyNoticeAcceptedAt.value = "";
    privacyNoticeTimezone.value = "";
  }
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = () => {
  fieldErrors.firstName = firstName.value.trim()
    ? ""
    : "Bitte geben Sie Ihren Vornamen an.";
  fieldErrors.lastName = lastName.value.trim()
    ? ""
    : "Bitte geben Sie Ihren Nachnamen an.";
  fieldErrors.email = !email.value.trim()
    ? "Bitte geben Sie Ihre E-Mail-Adresse an."
    : emailPattern.test(email.value.trim())
      ? ""
      : "Bitte geben Sie eine gültige E-Mail-Adresse an.";
  fieldErrors.message = message.value.trim()
    ? ""
    : "Bitte beschreiben Sie kurz Ihr Anliegen.";
  fieldErrors.privacyConsent = privacyConsent.value
    ? ""
    : "Bitte bestätigen Sie die Kenntnisnahme des Datenschutzhinweises.";

  return (Object.keys(fieldErrors) as FieldKey[]).every(
    (key) => !fieldErrors[key],
  );
};

const errorSummaryRef = ref<HTMLElement | null>(null);

const submitForm = async () => {
  errorMessage.value = "";
  if (!validate()) {
    await nextTick();
    errorSummaryRef.value?.focus();
    return;
  }

  isSubmitting.value = true;
  try {
    const body: ContactFormPayload = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      phone: phone.value,
      message: message.value,
      intent: intent.value,
      topic: topic.value,
      privacyNoticeAccepted: privacyConsent.value,
      privacyNoticeVersion: contactPrivacyNoticeVersion,
      privacyNoticeAcceptedAt:
        privacyNoticeAcceptedAt.value || new Date().toISOString(),
      privacyNoticeTimezone: privacyNoticeTimezone.value || clientTimezone(),
      website: website.value,
    };

    const response = await $fetch<ContactSubmissionResponse>("/api/contact", {
      method: "POST",
      body,
    });

    if (response.success) {
      formSubmitted.value = true;
      firstName.value = "";
      lastName.value = "";
      email.value = "";
      phone.value = "";
      message.value = "";
      privacyConsent.value = false;
      privacyNoticeAcceptedAt.value = "";
      privacyNoticeTimezone.value = "";
    }
  } catch {
    errorMessage.value =
      "Die Nachricht konnte gerade nicht gesendet werden. Bitte versuchen Sie es später erneut oder schreiben Sie mir direkt an info@hommri.ch.";
  } finally {
    isSubmitting.value = false;
  }
};

const inputClass =
  "w-full rounded-none border border-white/25 bg-white/95 px-3 py-2 text-sm text-[#3b4245] " +
  "placeholder:text-[#3b4245]/50 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/60";
</script>

<template>
  <section
    id="kontakt"
    class="relative mx-auto mb-16 w-full max-w-7xl scroll-mt-28"
  >
    <div
      class="relative z-10 flex w-full flex-col items-center sm:px-9 sm:py-9"
    >
      <AppCard group-class="mx-auto w-[95%]" content-class="p-6 sm:p-10">
        <!-- Kopf -->
        <p
          class="text-xs font-semibold uppercase tracking-[0.22em] text-white/70"
        >
          Kontakt
        </p>
        <h2 class="mt-2 text-2xl text-gray-200 sm:text-3xl md:text-4xl">
          Schreiben Sie mir
        </h2>
        <p
          class="mt-3 max-w-2xl text-sm leading-relaxed text-gray-200/90 md:text-base"
        >
          Haben Sie ein Website-Vorhaben oder eine technische Frage? Oder
          möchten Sie sich einfach unverbindlich austauschen? Schreiben Sie mir
          kurz, worum es geht. Ich melde mich persönlich bei Ihnen und gebe
          Ihnen eine ehrliche Einschätzung.
        </p>

        <!-- Erfolgsmeldung -->
        <div
          v-if="formSubmitted"
          class="mt-8 border border-white/30 bg-white/10 p-6"
          role="status"
          aria-live="polite"
        >
          <p class="text-lg font-semibold text-gray-200">
            Vielen Dank für Ihre Nachricht!
          </p>
          <p class="mt-2 text-sm text-gray-200/90">
            Ich habe Ihre Anfrage erhalten und melde mich zeitnah bei Ihnen.
          </p>
          <button
            type="button"
            class="mt-5 inline-flex items-center gap-2 border border-white/40 px-4 py-2 text-sm text-gray-200 transition hover:bg-white/10"
            @click="formSubmitted = false"
          >
            Weitere Nachricht schreiben
          </button>
        </div>

        <!-- Formular -->
        <form
          v-else
          class="mt-8 flex flex-col gap-6"
          novalidate
          @submit.prevent="submitForm"
        >
          <!-- Fehlerzusammenfassung -->
          <div
            v-if="Object.values(fieldErrors).some(Boolean)"
            ref="errorSummaryRef"
            tabindex="-1"
            class="border border-white/40 bg-white/10 p-4 text-sm text-gray-200"
            role="alert"
          >
            <p class="font-semibold">Bitte prüfen Sie Ihre Angaben:</p>
            <ul class="mt-2 list-inside list-disc">
              <li v-for="(msg, key) in fieldErrors" v-show="msg" :key="key">
                {{ msg }}
              </li>
            </ul>
          </div>

          <!-- Anliegen (neutraler Kontaktpunkt: „Worum geht es?") -->
          <fieldset>
            <legend class="mb-3 text-sm font-semibold text-gray-200">
              Worum geht es?
            </legend>
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label
                v-for="option in contactIntents"
                :key="option.id"
                :class="[
                  'flex cursor-pointer items-center gap-3 border px-4 py-3 text-sm transition',
                  intent === option.id
                    ? 'border-white bg-white/15 text-gray-200'
                    : 'border-white/25 text-gray-200/80 hover:border-white/60 hover:bg-white/5',
                ]"
              >
                <input
                  v-model="intent"
                  type="radio"
                  :value="option.id"
                  class="sr-only"
                />
                <font-awesome-icon
                  v-if="isClient"
                  :icon="['fas', iconFor[option.icon]]"
                  class="h-4 w-4 shrink-0 text-white/80"
                />
                <span>{{ option.label }}</span>
              </label>
            </div>
          </fieldset>

          <!-- Thema (abhängig vom Anliegen) -->
          <div>
            <label
              for="contact-topic"
              class="mb-2 block text-sm font-semibold text-gray-200"
            >
              {{ activeIntent.topicLabel }}
            </label>
            <select id="contact-topic" v-model="topic" :class="inputClass">
              <option
                v-for="t in activeIntent.topics"
                :key="t.id"
                :value="t.id"
              >
                {{ t.label }}
              </option>
            </select>
          </div>

          <!-- Name -->
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                for="contact-first-name"
                class="mb-2 block text-sm font-semibold text-gray-200"
              >
                Vorname
              </label>
              <input
                id="contact-first-name"
                v-model="firstName"
                type="text"
                autocomplete="given-name"
                :class="inputClass"
                :aria-invalid="Boolean(fieldErrors.firstName)"
                @input="clearFieldError('firstName')"
              />
            </div>
            <div>
              <label
                for="contact-last-name"
                class="mb-2 block text-sm font-semibold text-gray-200"
              >
                Nachname
              </label>
              <input
                id="contact-last-name"
                v-model="lastName"
                type="text"
                autocomplete="family-name"
                :class="inputClass"
                :aria-invalid="Boolean(fieldErrors.lastName)"
                @input="clearFieldError('lastName')"
              />
            </div>
          </div>

          <!-- E-Mail + Telefon -->
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                for="contact-email"
                class="mb-2 block text-sm font-semibold text-gray-200"
              >
                E-Mail
              </label>
              <input
                id="contact-email"
                v-model="email"
                type="email"
                autocomplete="email"
                :class="inputClass"
                :aria-invalid="Boolean(fieldErrors.email)"
                @input="clearFieldError('email')"
              />
            </div>
            <div>
              <label
                for="contact-phone"
                class="mb-2 block text-sm font-semibold text-gray-200"
              >
                Telefon
                <span class="font-normal text-gray-200/60">(optional)</span>
              </label>
              <input
                id="contact-phone"
                v-model="phone"
                type="tel"
                autocomplete="tel"
                :class="inputClass"
              />
            </div>
          </div>

          <!-- Nachricht -->
          <div>
            <label
              for="contact-message"
              class="mb-2 block text-sm font-semibold text-gray-200"
            >
              Ihre Nachricht
            </label>
            <textarea
              id="contact-message"
              v-model="message"
              rows="5"
              :class="inputClass"
              :aria-invalid="Boolean(fieldErrors.message)"
              @input="clearFieldError('message')"
            />
          </div>

          <!-- Honeypot: für Menschen unsichtbar, wird von Bots gern ausgefüllt. -->
          <div class="hidden" aria-hidden="true">
            <label for="contact-website">Website (bitte leer lassen)</label>
            <input
              id="contact-website"
              v-model="website"
              type="text"
              tabindex="-1"
              autocomplete="off"
            />
          </div>

          <!-- Datenschutz-Consent -->
          <div>
            <label
              class="flex cursor-pointer items-start gap-3 text-sm text-gray-200"
            >
              <input
                id="contact-privacy-consent"
                v-model="privacyConsent"
                type="checkbox"
                class="mt-1 h-4 w-4 shrink-0 accent-white"
                :aria-invalid="Boolean(fieldErrors.privacyConsent)"
                @change="handlePrivacyConsentChange"
              />
              <span>
                Ich habe den
                <NuxtLink to="/datenschutz" class="underline hover:text-white">
                  Datenschutzhinweis
                </NuxtLink>
                zur Kenntnis genommen und bin damit einverstanden, dass meine
                Angaben zur Bearbeitung meiner Anfrage verarbeitet werden.
              </span>
            </label>
          </div>

          <!-- Versandfehler -->
          <p v-if="errorMessage" class="text-sm text-white" role="alert">
            {{ errorMessage }}
          </p>

          <!-- Absenden -->
          <div>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="inline-flex items-center gap-2 bg-white px-6 py-3 text-sm font-semibold text-[#8D1D29] transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <font-awesome-icon
                v-if="isClient"
                :icon="['fas', isSubmitting ? 'spinner' : 'paper-plane']"
                :class="['h-4 w-4', { 'animate-spin': isSubmitting }]"
              />
              {{ isSubmitting ? "Wird gesendet …" : "Nachricht senden" }}
            </button>
          </div>
        </form>
      </AppCard>
    </div>
  </section>
</template>
