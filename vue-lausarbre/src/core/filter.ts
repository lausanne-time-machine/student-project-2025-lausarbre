import type { FeatureValue, GenealogyNode, ID, RawElement, TrackingChainNode } from "@/types";
import { fetchAndUnzipDataframes, fetchAndUnzipTrackingChain, fetchAndUnzipTrees } from "./fetch";
import { trackingChainStore } from "./stores/tracking_chains";
import { dataframesStore } from "./stores/dataframes";
import { useTreeStore } from "./stores/trees";


export function findTrackersForFeature(rawFeature: string, value: string): ID[] {
    const chain = trackingChainStore().trackingChain
    const dataframes = dataframesStore().dataframes

    const trackers = new Set<ID>();

    chain.forEach((nodes, id) => {
        for (const node of nodes) {
            const rawElements = dataframes[node.frame_idx].get(rawFeature)
            if (!rawElements) {
                continue
            }

            const elem = rawElements[node.record_idx];

            if (typeof elem !== 'string' || !elem.includes(value)) {
                continue
            }

            trackers.add(id)
            break
        }
    })

    return Array.from(trackers)
}

export function findTrackersForMultipleFeature(featureValue: FeatureValue[]): ID[] {

    const chain = trackingChainStore().trackingChain
    const dataframes = dataframesStore().dataframes
    const trackers = new Set<ID>();
    const filteredFeatureValues = featureValue.filter(fv => fv.value != "")

    chain.forEach((nodes, id) => {
        for (const node of nodes) {

            let addId = true
            for (const fv of filteredFeatureValues) {
                const rawElements = dataframes[node.frame_idx].get(fv.feature)
                if (!rawElements) {
                    addId = false
                    break
                }

                const elem = rawElements[node.record_idx];
                if (typeof elem !== 'string' || !elem.includes(fv.value)) {
                    addId = false
                    break
                }
            }

            if (addId) {
                trackers.add(id)
            }

        }
    })
    return Array.from(trackers)
}

function getFirstNodeForID(id: ID): TrackingChainNode | null {
    const chain = trackingChainStore().trackingChain
    for (const [_id, nodes] of chain) {
        if (_id == id && nodes.length > 0) {
            return nodes[0]
        }
    }

    return null
}

export function getFeatureValuesForID(id: ID): RawElement[] {
    const dataframes = dataframesStore().dataframes

    const firstNode = getFirstNodeForID(id)
    if (firstNode == null) {
        return []
    }

    const frame = dataframes[firstNode.frame_idx]
    const values: RawElement[] = []
    frame.forEach((_values, feature) => values.push(_values[firstNode.record_idx]))


    return values
}

export function getFeatureValuesForMultipleID(ids: ID[]): Map<ID, RawElement[]> {
    const m = new Map<ID, RawElement[]>()

    for (const id of ids) {
        m.set(id, getFeatureValuesForID(id))
    }

    return m
}


function findNode(node: GenealogyNode, id: ID): GenealogyNode | null | undefined {
    if (node.id == id) {
        return node
    }

    if (node.children.length == 0) {
        return null
    }

    for (let i = 0; i < node.children.length; i++) {
        const r = findNode(node.children[i], id)
        if (r) {
            return r
        }
    }
    return null
}

export function findTreeForID(id: ID): GenealogyNode | null {
    const trees = useTreeStore().trees

    for (let i = 0; i < trees.length; i++) {
        const node = findNode(trees[i], id)

        if (node) {
            return node
        }
    }

    return null
}

export function findTreeDepth(node: GenealogyNode): number {
    let maxDepth = 0;
    const collectDepths = (node: GenealogyNode, depth: number) => {
        if (depth > maxDepth) maxDepth = depth;
        node.children.forEach(child => collectDepths(child, depth + 1));
    };

    collectDepths(node, 0);
    return maxDepth
}


