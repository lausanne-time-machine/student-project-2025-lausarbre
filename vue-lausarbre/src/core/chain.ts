import type { ID, TrackingChainNode } from "@/types"
import { trackingChainStore } from "./stores/tracking_chains"

export function getChainForNode(id: ID): TrackingChainNode[] | null {
    const chain = trackingChainStore().trackingChain
    for (const [_id, nodes] of chain) {
        if (_id == id && nodes.length > 0) {
            return nodes
        }
    }

    return null
}