<script setup lang="ts">
import AppFooter from '@/components/AppFooter.vue';
import AppHeader from '@/components/AppHeader.vue';
import { onMounted, ref } from 'vue';

const isFooterFixed = ref(false);

onMounted(() => {
    const contentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    isFooterFixed.value = contentHeight <= windowHeight;
});
</script>

<template>
    <div>
        <div
            class="bg-background-light bg-light-pattern text-black/50 dark:bg-background-dark dark:bg-dark-pattern dark:text-gray-200/50"
        >
            <div
                class="relative flex min-h-screen w-full flex-col selection:bg-[#9c5258] selection:text-gray-200"
            >
                <AppHeader />
                <slot />
                <AppFooter :isFooterFixed="isFooterFixed" />
            </div>
        </div>
    </div>
</template>
