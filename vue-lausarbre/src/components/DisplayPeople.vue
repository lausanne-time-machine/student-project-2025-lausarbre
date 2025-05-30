<template>

    <v-card class="display-card">
        <v-row>
            <v-card-title class="text-h6">Personnes trouvées</v-card-title>
        </v-row>
        <v-row>
            <v-card-subtitle>Nombre de résultats: {{ props.data === null ? 0 : props.data?.size }}</v-card-subtitle>
        </v-row>

        <!-- Table Header -->
        <v-row class="table-header-row">
            <v-col class="table-header-text" v-for="([raw, pretty], index) in RAW_TO_PRETTY" :key="index">
                {{ pretty }}
            </v-col>

        </v-row>

        <div v-if="props.searching">
            <v-card>
                <v-card-text class="loading-content">
                    Recherche en cours, veuillez patienter..
                </v-card-text>
            </v-card>
        </div>
        <div v-else-if="error">
            <v-card>
                <v-card-text class="error-content">
                    <v-icon class="error-icon">mdi-alert-circle</v-icon>
                    <span class="error-text">Pas de résultat</span>
                </v-card-text>
            </v-card>
        </div>

        <div v-else class="table-body">
            <v-row v-for="([ID, record], index) of props.data" :key="ID" class="table-data-row" @click="handleRowClick(ID)">
                <v-col class="table-data-text" v-for="(value, index) in record" :key="index">
                    <div v-if="Array.isArray(value)">
                        <div v-for="(val, i) in value" :key="i">{{ val }},</div>
                    </div>
                    <div v-else>
                        {{ value }}
                    </div>
                </v-col>
            </v-row>
        </div>
    </v-card>

</template>

<script setup lang="ts">
import { RAW_TO_PRETTY } from '@/core/constants';
import type { DisplayPeopleProps, ID } from '@/types';
import '../styles/main.css';
import { useRouter } from 'vue-router';

import { computed, watch, ref } from 'vue';


const props = defineProps<DisplayPeopleProps>();
const router = useRouter();

const handleRowClick = (_id: ID): void => {
    router.push({ name: '/GenealogyTree', params: { id: _id } });
};

const error = computed(() => props.data == null || props.data?.size === 0)
</script>


<style scoped>
.display-card {
    border-radius: 8px;
    box-shadow: 0 4px 8px "box-shadow";
    background-color: var(--background);
    display: flex;
    flex-direction: column;
    max-height: 80vh;
    overflow: hidden;
    border-radius: 12px;
    color: "surface"
}

.text-h6 {
    color: "primary";
    font-weight: bold;
    margin: 10px;
    text-align: center;
}

.error-content {
    display: flex;
    align-items: center;
    gap: 10px;
}

.loading-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 40px 0;
    font-size: 18px;
    font-weight: 500;
    color: #555;
}



.error-icon {
    font-size: 28px;
}

.error-text {
    font-weight: bold;
    font-size: 18px;
}
</style>