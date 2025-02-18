<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';

const activeSection = ref('');

// Scrollfunktion: Aktualisiert die URL und scrollt sanft mit Offset
// const scrollToSection = (id: string) => {
//     const element = document.getElementById(id);
//     if (element) {
//         // Scrollen mit Offset
//         window.scrollTo({
//             top: element.offsetTop - 400, // 100px Offset von oben
//             behavior: 'smooth', // Sanftes Scrollen
//         });

//         // Inertia.visit mit Hash anpassen
//         router.visit(window.location.href.split('#')[0] + `#${id}`, {
//             preserveState: true, // Zustand der Seite bewahren
//             replace: true, // Keine zusätzliche Eintragung in die History
//         });
//     }
// };

onMounted(async () => {
    // Warte, bis alle Elemente gerendert wurden
    await nextTick();

    // Prüfe, ob in der URL ein Hash steht, ansonsten setze "home" als Standard
    const hash = window.location.hash;
    if (hash) {
        activeSection.value = hash.replace('#', '');
    } else {
        activeSection.value = 'home';
    }

    // IntersectionObserver zur Bestimmung des aktiven Abschnitts
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                // Wenn der Abschnitt zu mindestens 50% sichtbar ist, setze ihn als aktiv
                if (entry.isIntersecting) {
                    activeSection.value = entry.target.id;
                }
            });
        },
        {
            threshold: 0.5, // 50% des Elements müssen sichtbar sein
        },
    );

    // Beobachte alle Elemente, die eine ID haben
    const sections = document.querySelectorAll('[id]');
    sections.forEach((section) => observer.observe(section));
});
</script>

<template>
    <header
        class="fixed -top-4 left-1/2 z-50 w-full max-w-7xl -translate-x-1/2 transform shadow-lg"
    >
        >

        <div
            class="absolute inset-0 z-0 rounded-b-xl bg-[#8D1D29] opacity-80"
        ></div>

        <div
            class="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-3 text-gray-200 opacity-100"
        >
            <!-- Logo links -->
            <div class="text-lg font-bold">
                <NuxtLink to="/" class="text-lg font-bold">
                    <img
                        src="@/assets/logo-white.svg"
                        alt="Logo"
                        class="h-10 w-auto"
                    />
                </NuxtLink>
            </div>

            <!-- Navigation rechts -->
            <nav class="flex gap-6">
                <a
                    class="mb-2 cursor-pointer text-gray-200"
                    :class="{
                        'border-b-2 border-black dark:border-white':
                            activeSection === 'home',
                    }"
                >
                    Home
                </a>
                <a
                    class="mb-2 cursor-pointer text-gray-200"
                    :class="{
                        'border-b-2 border-black dark:border-white':
                            activeSection === 'ueber-mich',
                    }"
                >
                    Über mich
                </a>
                <a
                    class="mb-2 cursor-pointer text-gray-200"
                    :class="{
                        'border-b-2 border-black dark:border-white':
                            activeSection === 'technologien',
                    }"
                >
                    Skills
                </a>
                <!-- <template v-if="$page.props.auth.user">
                    <Link
                        :href="route('dashboard')"
                        class="border-b-2 pb-2"
                        :class="
                            route().current('dashboard')
                                ? 'border-black dark:border-white'
                                : 'border-transparent'
                        "
                    >
                        Dashboard
                    </Link>
                </template>

                <te mplate v-else>
                    <Link
                        :href="route('login')"
                        class="border-b-2 pb-2"
                        :class="
                            route().current('login')
                                ? 'border-black dark:border-white'
                                : 'border-transparent'
                        "
                    >
                        Log in
                    </Link>

                    <Link
                        v-if="$page.props.canRegister"
                        :href="route('register')"
                        class="border-b-2 pb-2"
                        :class="
                            route().current('register')
                                ? 'border-black dark:border-white'
                                : 'border-transparent'
                        "
                    >
                        Register
                    </Link>
                </te> -->
            </nav>
        </div>
    </header>
</template>
