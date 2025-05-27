<template>
    <v-app-bar>
        <template v-slot:prepend>
            <v-icon @click="goBack">mdi mdi-arrow-left</v-icon>
        </template>

        <v-app-bar-title class="top-bar-title"> {{ title }}</v-app-bar-title>

    </v-app-bar>
</template>

<script setup lang="ts">
import type { TopBarProps } from '@/types';
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps<TopBarProps>()


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