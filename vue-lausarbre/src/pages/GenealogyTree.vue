<template>
    <div ref="containerRef" class="chart-container">
        <svg ref="svgRef" :viewBox="`0 0 ${screen_width} ${screen_height}`" preserveAspectRatio="xMidYMid meet"></svg>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as d3 from 'd3'
import { findTreeDepth, findTreeForID, getFeatureValuesForID } from '@/core/filter'
import type { GenealogyNode, GenealogyTreeProps } from '@/types'

const props = defineProps<GenealogyTreeProps>()
const containerRef = ref<HTMLDivElement | null>(null)
const svgRef = ref<SVGSVGElement | null>(null)
const screen_width = ref(0)
const screen_height = ref(0)

onMounted(() => {
    if (!containerRef.value || !svgRef.value) return

    const observer = new ResizeObserver(([entry]) => {
        screen_width.value = entry.contentRect.width
        screen_height.value = entry.contentRect.height

        drawGraph() // run your graph drawing function with new size
    })

    observer.observe(containerRef.value)
})

const PAIR_BAR_WIDTH: number = 140;
const GENERATION_BAR_HEIGHT: number = 140;
const NODE_RADIUS: number = 30;
const BAR_THICKNESS: number = 5;

const LEAF_CHILDREN_WIDTH: number = 140;
const PAIR_WIDTH: number = PAIR_BAR_WIDTH + 2* NODE_RADIUS;
const BORDER_MARGIN: number = 20;


function getTreeWidth(node: GenealogyNode): number {
    let children_width = 0;
    for (const child of node.children) {
        children_width += getTreeWidth(child)
    }
    children_width += node.leaf_children.length * LEAF_CHILDREN_WIDTH;

    // node without children
    const width = children_width > PAIR_WIDTH ? children_width : PAIR_WIDTH;
    
    return width + 2 * BORDER_MARGIN;
}

function getChildrenBarWidth(node: GenealogyNode): number {
    let width = 0;

    let children_widths = []
    for (const child of node.children) {
        children_widths.push(getTreeWidth(child))
    }
    for (let i=0; i<node.leaf_children.length;i++) {
        children_widths.push(LEAF_CHILDREN_WIDTH);
    }

    if (children_widths.length < 2) {
        return 0;
    }

    width += children_widths[0] / 2;
    width += children_widths[children_widths.length - 1] / 2;
    for (let i=1; i<children_widths.length-1; i++) {
        width += children_widths[i];
    }
    return width;
}

function drawPair(x: number, y: number) {
    const svg = d3.select(svgRef.value)
    const nodes = [{ x: x - PAIR_BAR_WIDTH / 2, y: y }, { x: x + PAIR_BAR_WIDTH / 2, y: y }]

    svg.append('path')
        .attr('d', d3.line()([[nodes[0].x, nodes[0].y], [nodes[1].x, nodes[1].y]]))
        .attr('stroke', 'blue')
        .attr('stroke-width', BAR_THICKNESS)
        .attr('fill', 'none')

    svg.selectAll('circle.node')
        .data(nodes)
        .enter()
        .append('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => NODE_RADIUS)
        .attr('fill', d => 'blue')
}

function drawLeafChild(x: number, y: number) {
    const svg = d3.select(svgRef.value)
    const nodes = [{ x: x, y: y }]
    svg.selectAll('circle.node')
        .data(nodes)
        .enter()
        .append('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => NODE_RADIUS)
        .attr('fill', d => 'blue')
}

function drawBar(fromX: number, fromY: number, toX: number, toY: number) {
    const svg = d3.select(svgRef.value)
    svg.append('path')
        .attr('d', d3.line()([[fromX, fromY], [toX, toY]]))
        .attr('stroke', 'blue')
        .attr('stroke-width', BAR_THICKNESS)
        .attr('fill', 'none')
}

function drawTree(node: GenealogyNode, x: number, y: number) {
    
    drawPair(x, y);
    
    if (node.children.length == 0 && node.leaf_children.length == 0) {
        return
    }

    drawBar(x, y, x, y + GENERATION_BAR_HEIGHT);
    
    // draw children bar
    const y_children_bar= y + GENERATION_BAR_HEIGHT;
    const children_bar_width = getChildrenBarWidth(node);
    drawBar(x- children_bar_width / 2, y_children_bar, x + children_bar_width / 2, y_children_bar);
    
    let child_x = x - children_bar_width / 2;
    const child_y = y_children_bar + GENERATION_BAR_HEIGHT;

    for (let i=0; i<node.children.length - 1; i++) {
        const child = node.children[i];
        const next_child = node.children[i+1];
        drawBar(child_x, y_children_bar, child_x, child_y);
        drawTree(child, child_x, child_y);
        child_x += getTreeWidth(child) / 2 + getTreeWidth(next_child) / 2;
    }

    // draw last child
    if (node.children.length > 0) {
        const child = node.children[node.children.length-1];
        drawBar(child_x, y_children_bar, child_x, child_y);
        drawTree(child, child_x, child_y);
        child_x += getTreeWidth(child) / 2 + LEAF_CHILDREN_WIDTH / 2;;
    }

    for (let i=0; i<node.leaf_children.length; i++) {
        drawBar(child_x, y_children_bar, child_x, child_y);
        drawLeafChild(child_x, child_y);
        child_x += LEAF_CHILDREN_WIDTH;
    }
}

function drawGraph() {
    if (!svgRef.value || screen_width.value === 0 || screen_height.value === 0) return


    const node = findTreeForID(props.id)
    if (!node) {
        return
    }

    console.log(node)

    const svg = d3.select(svgRef.value)
    svg.selectAll("*").remove() // clear previous render

    drawTree(node, screen_width.value / 2, 50)
}

</script>

<style scoped>
svg {
    border: 1px solid #ccc;
}

.chart-container {
    width: 100vw;
    height: 100vh;
}

svg {
    width: 100%;
    height: 100%;
    display: block;
}
</style>