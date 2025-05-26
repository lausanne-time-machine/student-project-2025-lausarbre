<template>
    <v-app-bar>
        <template v-slot:prepend>
            <v-icon @click="goBack">mdi mdi-arrow-left</v-icon>
        </template>

        <v-app-bar-title class="top-bar-title"> {{ title }}</v-app-bar-title>

        <v-btn color="secondary" size="large" class="mx-2" @click="goToHomePage">
            <template v-slot:prepend>
                <v-icon>mdi mdi-home</v-icon>
            </template>
            Home
        </v-btn>
    </v-app-bar>
</template>

<script setup lang="ts">
import type { TopBarProps } from '@/types';
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps<TopBarProps>()
function goToHomePage() {
    router.push({ name: 'HomePage' });
}


function goBack() {
    router.back()
}

</script>

<style scoped>
.top-bar-title {
    color: var(--primary);
    font-weight: 500;

}
</style>