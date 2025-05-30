<template>
  <v-app>
    <v-main class="app d-flex">
      <Sidebar class="sidebar" />
      <v-container fluid class="content">
        <router-view />
      </v-container>
    </v-main>
  </v-app>

</template>

<script setup lang="ts">
import { fetchAndUnzip, fetchAndUnzipTrees } from './core/fetch';
import { dataframesStore } from './core/stores/dataframes';
import { trackingChainStore } from './core/stores/tracking_chains';
import { useTreeStore } from './core/stores/trees';
import { computed, watch } from 'vue'



const treeStore = useTreeStore()
treeStore.fetchTrees()

const dStore = dataframesStore()
dStore.fetchDataframes()


const tcStore = trackingChainStore()
const allIDs = computed(() => treeStore.getAllIDs)
watch(allIDs, (newAllIDs) => tcStore.fetchTrackingChain(newAllIDs))



</script>

<style lang="scss" scoped>
button {
  cursor: pointer;
  appearance: none;
  border: none;
  outline: none;
  background: none;
}

.app {
  display: flex;
  height: 100vh;
  overflow: hidden; // Prevent double scrolling

  .sidebar {
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    background-color: var(--sidebar-bg);
    z-index: 100;
  }

  .content {
    margin-left: var(--sidebar-width, 280px); // Push content to the right of sidebar
    height: 100vh;
    overflow-y: auto;
    padding: 2rem;
    flex-grow: 1;
    background-color: var(--background);
  }
}
</style>
