<template>

    <v-card class="display-card">
        <v-row>
            <v-card-title class="text-h6">Person Matching</v-card-title>
        </v-row>

        <!-- Table Header -->
        <v-row class="table-header-row">
            <v-col class="table-header-text" v-for="([raw, pretty], index) in RAW_TO_PRETTY" :key="index">
                {{ pretty }}
            </v-col>
        </v-row>

        <div class="table-body">
            <v-row v-for="([ID, record], index) of props.data" :key="ID" class="table-data-row"
                @click="handleRowClick(ID)">

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

import { computed, watch } from 'vue';


const props = defineProps<DisplayPeopleProps>();
const router = useRouter();

const handleRowClick = (_id: ID): void => {
    router.push({ name: 'GenealogyTree', params: { id: _id } });
};


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
</style>