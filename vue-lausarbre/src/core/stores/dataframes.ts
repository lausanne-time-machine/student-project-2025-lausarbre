import type { Dataframes, ID, RawElement } from '@/types';
import { defineStore } from 'pinia'
import { fetchAndUnzipDataframes } from '../fetch';



export const dataframesStore = defineStore('dataframesStore', {
    state: () => ({ dataframes: [] as Dataframes }),

    getters: {
        getDataframes: (state) => state.dataframes,
    },

    actions: {
        fetchDataframes() {
            fetchAndUnzipDataframes().then(d => {
                for (let i = 0; i < d.length; i++) {
                    const m = new Map<string, RawElement[]>()
                    Object.entries(d[i]).forEach(([feature, value], index) => m.set(feature, value))
                    this.dataframes.push(m)
                }
                console.log("dataframes")

            })
        }

    }
});