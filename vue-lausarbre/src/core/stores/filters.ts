import type { FeatureValue, GenealogyData, GenealogyNode, ID, RawElement } from '@/types';
import { defineStore } from 'pinia';
import { fetchAndUnzipTrees } from '../fetch';

export const useFilterStore = defineStore('filterStore', {
    state: () => ({
        filters: [] as FeatureValue[],
        filteredPerson: new Map<ID, RawElement[]>()
    }),

    getters: {
        getFilters: (state): FeatureValue[] => state.filters,
        getFilteredPerson: (state): Map<ID, RawElement[]> => state.filteredPerson
    },

    actions: {
        addFilter(filter: FeatureValue) {
            this.filters.push(filter)
        },
        addFilters(filters: FeatureValue[]) {
            this.filters.push(...filters)
        },
        clearFilters() {
            this.filters = []
        },
        setFilteredPerson(filteredPerson: Map<ID, RawElement[]>) {
            this.filteredPerson = filteredPerson
        }
    }
});
