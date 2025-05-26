import type { ID, RawElement } from "@/types";
import { RAW_TO_PRETTY, START_YEAR } from "./constants";
import { dataframesStore } from "./stores/dataframes";
import { getChainForNode } from "./chain";

export function getFeatureValuesForID(id: ID): RawElement[] {
    const dataframes = dataframesStore().dataframes;
    const nodes = getChainForNode(id);

    if (!nodes) return [];

    // Feature -> serializedValue -> count
    const countsMap = new Map<string, Map<string, number>>();
    // Feature -> serializedValue -> originalValue
    const originalMap = new Map<string, Map<string, string | string[]>>();

    RAW_TO_PRETTY.forEach((_, feature) => {
        countsMap.set(feature, new Map());
        originalMap.set(feature, new Map());
    });

    for (const node of nodes) {
        const frame = dataframes[node.frame_idx];

        frame.forEach((column, feature) => {
            const rawValue = column[node.record_idx];
            if (rawValue == null) return;

            const valuesCount = countsMap.get(feature);
            const originalValues = originalMap.get(feature);

            if (!valuesCount || !originalValues) return;

            let key: string;
            if (Array.isArray(rawValue)) {
                //const sorted = [...rawValue].sort(); // Avoid mutating original
                //key = JSON.stringify(sorted);


                key = "children"
                const children = originalValues.get(key) as string[] | undefined
                const updatedChildren = children ? children.concat([...rawValue]) : [...rawValue]
                originalValues.set(key, Array.from(new Set(updatedChildren)))

                //originalValues.set(key, sorted);
            } else {
                key = rawValue as string;
                originalValues.set(key, key);
            }

            const currentCount = valuesCount.get(key) || 0;
            valuesCount.set(key, currentCount + 1);
        });
    }

    const result: RawElement[] = [];

    countsMap.forEach((valueMap, feature) => {
        let maxCount = 0;
        let selectedKey = "";
        valueMap.forEach((count, key) => {
            if (count > maxCount) {
                maxCount = count;
                selectedKey = key;
            }
        });

        const original = originalMap.get(feature)?.get(selectedKey);
        result.push(original ?? "?");
    });


    return result;
}


export function getFeatureValuesForMultipleID(ids: ID[]): Map<ID, RawElement[]> {
    const m = new Map<ID, RawElement[]>()

    for (const id of ids) {
        m.set(id, getFeatureValuesForID(id))
    }

    return m
}

export function getStartEndYearsForID(id: ID): number[] {
    const nodes = getChainForNode(id);
    console.log(nodes)
    if (!nodes) return []
    if (nodes.length < 2) return []
    return [nodes[0].frame_idx + START_YEAR, nodes[nodes.length - 1].frame_idx + START_YEAR]
}

