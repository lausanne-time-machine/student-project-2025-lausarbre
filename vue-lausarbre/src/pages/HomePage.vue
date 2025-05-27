<template>
    <div v-if="!waitInitialized">
        <v-card class="combobox-card pa-6">
            <v-card-title>Remplissez les champs que vous souhaitez</v-card-title>
            <v-row class="mb-4" dense>
                <v-col cols="12" sm="6" md="4" lg="3" v-for="([raw, pretty], index) in RAW_TO_PRETTY" :key="index">
                    <v-combobox :label="pretty" v-model="models[raw]" class="combobox" clearable dense
                        variant="outlined" hide-details />
                </v-col>
            </v-row>

            <div class="button-wrapper">
                <v-btn color="primary" class="search-btn" @click="findGoodTree">
                    J'ai de la chance
                </v-btn>
            </div>
        </v-card>

        <display-people :data="displayPeople" :searching="searching" />

    </div>
    <div class="loading-spinner" v-else>
        <v-progress-circular :size="100" :width="10" indeterminate></v-progress-circular>
    </div>
</template>



<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed, nextTick } from "vue"
import { RAW_TO_PRETTY } from "../core/constants"
import type { FeatureValue, ID, RawElement } from "../types"
import DisplayPeople from "../components/DisplayPeople.vue"
import { useTreeStore } from "@/core/stores/trees"
import { dataframesStore } from "@/core/stores/dataframes"
import { trackingChainStore } from "@/core/stores/tracking_chains"
import { findTrackersForMultipleFeature } from "@/core/filter"
import { getFeatureValuesForMultipleID } from "@/core/feature_values"
import { useFilterStore } from "@/core/stores/filters"
import { useRouter } from 'vue-router';
import { fetchAndUnzipTrackingChain } from "@/core/fetch"


const models = reactive<Record<string, string>>({})
const displayPeople = ref<Map<ID, RawElement[]> | null>(null)
const router = useRouter();

const tStore = useTreeStore()
const dStore = dataframesStore()
const tcStore = trackingChainStore()
const filterStore = useFilterStore()

const waitInitialized = computed(() => tStore.trees.length == 0 || dStore.dataframes.length == 0 || tcStore.trackingChain.size == 0)
const searching = ref(false)

let initialized = false

watch(models, () => {
    if (!initialized) return
    search()
})

function search() {
    const featureValue = [] as FeatureValue[]
    for (const rawFeature in models) {
        featureValue.push({ feature: rawFeature, value: models[rawFeature] ? models[rawFeature] : "" })
    }

    if (featureValue.length === 0) {
        return

    }

    featureValue.sort((a, b) => b.value.length - a.value.length)

    if (featureValue[0].value.length < 3) {
        return
    }

    searching.value = true

    // Without set timeout searching is not updated before the functions are called
    setTimeout(() => {
        const trackerIds = findTrackersForMultipleFeature(featureValue)
        displayPeople.value = getFeatureValuesForMultipleID(trackerIds)

        filterStore.addFilters(featureValue)
        filterStore.setFilteredPerson(displayPeople.value)
        searching.value = false
    }, 0)
}

function findGoodTree() {

    const node = tStore.goodTrees[Math.floor(Math.random() * tStore.goodTrees.length)]
    router.push({ name: 'GenealogyTree', params: { id: node.id } });

}

onMounted(async () => {
    const filters = filterStore.getFilters
    if (filters.length !== 0) {
        filters.forEach(fv => models[fv.feature] = fv.value)
        displayPeople.value = filterStore.getFilteredPerson

    }
    await nextTick()
    initialized = true
})
</script>

<style scoped>
.combobox-card {
    background-color: #dddddd;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    margin: 20px;
}

.combobox {
    background-color: #f9f9f9;
    border-radius: 8px;
}

.button-wrapper {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
}

.search-btn {
    font-weight: 600;
    text-transform: none;
    border-radius: 8px;
    padding: 0.5rem 1.5rem;
}

.loading-spinner {
    position: fixed;
    /* Ensures it stays in the middle of the viewport */
    top: 47vh;
    left: 47vw;
}
</style>
