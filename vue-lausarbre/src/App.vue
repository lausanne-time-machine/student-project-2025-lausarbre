<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { fetchAndUnzip, fetchAndUnzipTrees } from './core/fetch';
import { dataframesStore } from './core/stores/dataframes';
import { trackingChainStore } from './core/stores/tracking_chains';
import { useTreeStore } from './core/stores/trees';
import { computed, watch } from 'vue'


const tStore = useTreeStore()
tStore.fetchTrees()

const dStore = dataframesStore()
dStore.fetchDataframes()


const tcStore = trackingChainStore()
const allIDs = computed(() => tStore.getAllIDs)
watch(allIDs, (newAllIDs) => tcStore.fetchTrackingChain(newAllIDs))



</script>
