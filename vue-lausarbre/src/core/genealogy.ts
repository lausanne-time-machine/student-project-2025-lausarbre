import type { GenealogyNode, ID } from "@/types"
import { useTreeStore } from "./stores/trees"

function findNode(rootNode: GenealogyNode, node: GenealogyNode, id: ID): GenealogyNode | null | undefined {
    if (node.id == id) {
        return rootNode
    }

    if (node.children.length == 0) {
        return null
    }

    for (let i = 0; i < node.children.length; i++) {
        const r = findNode(rootNode, node.children[i], id)
        if (r) {
            return r
        }
    }
    return null
}


export function findRootTreeForID(id: ID): GenealogyNode | null {
    const trees = useTreeStore().trees

    for (let i = 0; i < trees.length; i++) {
        const node = findNode(trees[i], trees[i], id)

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