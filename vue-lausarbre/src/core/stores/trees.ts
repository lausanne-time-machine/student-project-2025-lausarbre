import type { GenealogyData, GenealogyNode, ID } from '@/types';
import { defineStore } from 'pinia';
import { fetchAndUnzipTrees } from '../fetch';

export const useTreeStore = defineStore('treeStore', {
    state: () => ({
        trees: [] as GenealogyNode[], // Assuming trees is an array of root nodes
        goodTrees: [] as GenealogyNode[]
    }),

    getters: {
        getTrees: (state): GenealogyNode[] => state.trees,

        getAllIDs(state): Set<ID> {
            const allIDs = new Set<ID>();

            function collectIDs(node: GenealogyNode) {
                allIDs.add(node.id);
                node.children.forEach(child => collectIDs(child));
            }

            state.trees.forEach(root => collectIDs(root));
            return allIDs;
        },
        getGoodTree(): GenealogyNode {
            return this.goodTrees[Math.floor(Math.random() * this.goodTrees.length)];
        }
    },

    actions: {
        async fetchTrees(): Promise<void> {
            const data = await fetchAndUnzipTrees();
            this.trees = data
            this.goodTrees = []; // Make sure it's initialized if not already

            for (const root of this.trees) {
                let maxDepth = 0;

                const collectDepths = (node: GenealogyNode, depth: number) => {
                    if (depth > maxDepth) maxDepth = depth;
                    node.children.forEach(child => collectDepths(child, depth + 1));
                };

                collectDepths(root, 0);

                if (maxDepth >= 2) {
                    this.goodTrees.push(root);
                }
            }
            console.log("Trees")
        }
    }
});
