<template>
    <v-row align="center" class="container">
        <v-col cols="auto">
            <v-icon @click="goBack" class="clickable">mdi-arrow-left</v-icon>
        </v-col>

        <v-col>
            <h1 class="top-bar-title">{{ props.title }}</h1>
        </v-col>
    </v-row>
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
.container {
    margin-bottom: 10px;
    box-shadow: 2px 5px 10px rgba(0, 0, 0, 0.1)

}

.top-bar-title {
    color: var(--primary);
    font-weight: 500;
    font-size: 1.5rem;
    margin: 0;
}

.clickable {
    cursor: pointer;
    font-size: 24px;
}
</style>
