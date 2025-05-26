import type { FeatureValue, GenealogyNode, ID, RawElement, TrackingChainNode } from "@/types";
import { trackingChainStore } from "./stores/tracking_chains";
import { dataframesStore } from "./stores/dataframes";
import { getFeatureValuesForID } from "./feature_values";
import { RAW_TO_PRETTY } from "./constants";

export function findTrackersForMultipleFeatureOld(featureValue: FeatureValue[]): ID[] {
    const chain = trackingChainStore().trackingChain;
    const dataframes = dataframesStore().dataframes;
    const trackers = new Set<ID>();

    const filteredFeatureValues = featureValue.filter(fv => fv.value !== "");

    chain.forEach((nodes, id) => {

        for (const node of nodes) {
            let matchesAllFeatures = true;

            for (const fv of filteredFeatureValues) {
                const rawElements = dataframes[node.frame_idx]?.get(fv.feature);
                if (!rawElements) {
                    matchesAllFeatures = false;
                    break;
                }

                const elem = rawElements[node.record_idx];
                if (typeof elem === "string") {
                    if (!elem.includes(fv.value)) {
                        matchesAllFeatures = false;
                        break;
                    }
                } else if (Array.isArray(elem)) {
                    const match = elem.some(entry => entry.includes(fv.value));
                    if (!match) {
                        matchesAllFeatures = false;
                        break;
                    }
                } else {
                    matchesAllFeatures = false;
                    break;
                }
            }

            if (matchesAllFeatures) {
                trackers.add(id);
            }
        }
    });

    return Array.from(trackers);
}

export function findTrackersForMultipleFeature(featureValue: FeatureValue[], ids: ID[] = []): ID[] {
    const chain = ids.length === 0 ? Array.from(trackingChainStore().trackingChain.keys()) : ids;
    const trackers = new Set<ID>();

    const filteredFeatureValues = featureValue.filter(fv => fv.value !== "");
    const rawFeatures = Array.from(RAW_TO_PRETTY.keys())
    
    chain.forEach(id => {
        const values = getFeatureValuesForID(id)
        const featureValues = new Map<string, RawElement>()
        rawFeatures.forEach((feature, index) => featureValues.set(feature, values[index]))

        let matchesAllFeatures = true;
        for (const fv of filteredFeatureValues) {
            const elem = featureValues.get(fv.feature)
            if (typeof elem === "string") {
                if (!elem.includes(fv.value)) {
                    matchesAllFeatures = false;
                    break;
                }
            } else if (Array.isArray(elem)) {
                const match = elem.some(entry => entry.includes(fv.value));
                if (!match) {
                    matchesAllFeatures = false;
                    break;
                }
            } else {
                matchesAllFeatures = false;
                break;
            }
        }
        if (matchesAllFeatures) {
            trackers.add(id);
        }
    });

    return Array.from(trackers);
}



export function findTrackersForFeature(rawFeature: string, value: string): ID[] {
    const featureValue: FeatureValue = { feature: rawFeature, value: value }
    return findTrackersForMultipleFeature([featureValue])
}









