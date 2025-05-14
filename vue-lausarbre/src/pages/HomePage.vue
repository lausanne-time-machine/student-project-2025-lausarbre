<template>

    <v-card class="combobox-card pa-6">
        <v-card-title>Fill in the fields you want</v-card-title>
        <v-row class="mb-4" dense>
            <v-col cols="12" sm="6" md="4" lg="3" v-for="([raw, pretty], index) in RAW_TO_PRETTY" :key="index">
                <v-combobox :label="pretty" v-model="models[raw]" class="combobox" clearable dense variant="outlined"
                    hide-details />
            </v-col>
        </v-row>

        <div class="button-wrapper">
            <v-btn color="primary" class="search-btn" @click="search">
                Search
            </v-btn>
        </div>
    </v-card>

    <display-people :data="displayPeople" />



</template>



<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue"
import { RAW_TO_PRETTY } from "../core/constants"
import { findTrackersForFeature, findTrackersForMultipleFeature, getFeatureValuesForMultipleID } from "@/core/filter"
import type { FeatureValue, ID, RawElement } from "../types"
import DisplayPeople from "../components/DisplayPeople.vue"
import { useTreeStore } from "@/core/stores/trees"


const models = reactive<Record<string, string>>({})
const displayPeople = ref<Map<ID, RawElement[]> | null>(null)
const treeStore = useTreeStore()

watch(models, (newModel) => {
    search()
})

function search() {
    const featureValue = [] as FeatureValue[]
    for (const rawFeature in models) {
        featureValue.push({ feature: rawFeature, value: models[rawFeature] ? models[rawFeature] : "" })
    }

    featureValue.sort((a, b) => b.value.length - a.value.length)

    if (featureValue[0].value.length < 3) {
        return
    }

    const trackerIds = findTrackersForMultipleFeature(featureValue)
    displayPeople.value = getFeatureValuesForMultipleID(trackerIds)

}
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
    justify-content: flex-end;
    margin-top: 1rem;
}

.search-btn {
    font-weight: 600;
    text-transform: none;
    border-radius: 8px;
    padding: 0.5rem 1.5rem;
}
</style>
