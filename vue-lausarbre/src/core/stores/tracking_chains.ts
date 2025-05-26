import type { ID, RawElement, TrackingChain } from '@/types';
import { defineStore } from 'pinia'
import { fetchAndUnzipDataframes, fetchAndUnzipTrackingChain } from '../fetch';



export const trackingChainStore = defineStore('trackingChainStore', {
    state: () => ({ trackingChain: new Map() as TrackingChain }),

    getters: {
        getTrackingChain: (state) => state.trackingChain,
   
    },

    actions: {
        fetchTrackingChain(trackedIDs: Set<ID>) {
            fetchAndUnzipTrackingChain().then(c => {
                Object.entries(c).forEach(([_id, trackingChainNode], index) => {
                 
                    const id = Number(_id)
                    if (trackedIDs.has(id)) {
                        this.trackingChain.set(id, trackingChainNode)
                    }
                })
                console.log("Tracking chain")
            })
        }

    }
});