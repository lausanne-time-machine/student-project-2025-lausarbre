<template>
    <div ref="containerRef" class="chart-container">
        <svg ref="svgRef" :viewBox="`0 0 ${width} ${height}`" preserveAspectRatio="xMidYMid meet"></svg>
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
const width = ref(0)
const height = ref(0)

onMounted(() => {
    if (!containerRef.value || !svgRef.value) return

    const observer = new ResizeObserver(([entry]) => {
        width.value = entry.contentRect.width
        height.value = entry.contentRect.height

        drawGraph() // run your graph drawing function with new size
    })

    observer.observe(containerRef.value)
})

function buildParents(node: GenealogyNode, middleX: number, middleY: number, shift: number) {
    const svg = d3.select(svgRef.value)
    const nodes = [{ x: middleX - width.value * 0.1, y: middleY }, { x: middleX + width.value * 0.1, y: middleY }]

    svg.append('path')
        .attr('d', d3.line()([[nodes[0].x, nodes[0].y], [nodes[1].x, nodes[1].y]]))
        .attr('stroke', 'blue')
        .attr('stroke-width', 5)
        .attr('fill', 'none')

    svg.selectAll('circle.node')
        .data(nodes)
        .enter()
        .append('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => 40)
        .attr('fill', d => 'blue')


}

function buildChildren(genNodes: GenealogyNode[], middleX: number, middleY: number, shift: number) {
    if (genNodes.length == 0) {
        return
    }

    const svg = d3.select(svgRef.value)
    const nodes = [{ x: middleX, y: middleY }, { x: middleX, y: middleY + shift * height.value }]

    svg.append('path')
        .attr('d', d3.line()([[nodes[0].x, nodes[0].y], [nodes[1].x, nodes[1].y]]))
        .attr('stroke', 'blue')
        .attr('stroke-width', 5)
        .attr('fill', 'none')

    genNodes.forEach(node => {
        buildParents(node, middleX - 0.1 * width.value, middleY + shift * height.value, shift)
        buildChildren(node.children, middleX - 0.1 * width.value, middleY + shift * height.value, shift)
    })


}

function drawGraph() {
    if (!svgRef.value || width.value === 0 || height.value === 0) return


    const node = findTreeForID(props.id)
    if (!node) {
        return
    }
    
    const depth = findTreeDepth(node)
    const values = getFeatureValuesForID(props.id)
    console.log(depth)
    console.log(node)


    const svg = d3.select(svgRef.value)
    svg.selectAll("*").remove() // clear previous render

    const shift = 0.6 / depth

    buildParents(node, width.value / 2, height.value / 2 - height.value * shift, shift)

    buildChildren(node.children, width.value / 2, height.value / 2 - height.value * shift, shift)
    console.log(node.children)
    // const A = { x: width.value / 2 - 100, y: height.value / 2 }
    // const B = { x: width.value / 2 + 100, y: height.value / 2 }
    // const C = { x: width.value / 2, y: 100 }

    // const midAB = {
    //     x: (A.x + B.x) / 2,
    //     y: (A.y + B.y) / 2
    // }

    // svg.append('path')
    //     .attr('d', d3.line()([[A.x, A.y], [B.x, B.y]]))
    //     .attr('stroke', 'steelblue')
    //     .attr('stroke-width', 3)
    //     .attr('fill', 'none')

    // svg.append('path')
    //     .attr('d', d3.line()([[C.x, C.y], [midAB.x, midAB.y]]))
    //     .attr('stroke', 'crimson')
    //     .attr('stroke-width', 2)
    //     .attr('stroke-dasharray', '4 2')
    //     .attr('fill', 'none')

    // const nodes = [
    //     { ...A, label: 'A' },
    //     { ...B, label: 'B' },
    //     { ...C, label: 'C' },
    //     { ...midAB, label: 'Mid', color: 'orange', radius: 4 }
    // ]

    // svg.selectAll('circle.node')
    //     .data(nodes)
    //     .enter()
    //     .append('circle')
    //     .attr('cx', d => d.x)
    //     .attr('cy', d => d.y)
    //     .attr('r', d => 6)
    //     .attr('fill', d => 'black')

    // svg.selectAll('text.label')
    //     .data(nodes)
    //     .enter()
    //     .append('text')
    //     .attr('x', d => d.x)
    //     .attr('y', d => d.y)
    //     .attr('dy', 4) // Slightly adjust vertical position for centering
    //     .attr('text-anchor', 'middle') // Center text horizontally
    //     .text(d => d.label)
    //     .attr('font-size', 12)
    //     .attr('fill', 'white')
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