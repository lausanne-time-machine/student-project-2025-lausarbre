<template>
    <TopBar :title="title"></TopBar>

    <v-dialog v-model="showDialog" max-width="600" persistent>
        <v-card>
            <template v-slot:actions>
                <v-col>
                    <OnePersonInformation :id="personId"></OnePersonInformation>

                    <v-btn class="ok-btn" @click="showDialog = false">
                        Close
                    </v-btn>
                </v-col>
            </template>
        </v-card>
    </v-dialog>

    <div ref="containerRef" class="chart-container">
        <svg ref="svgRef" :viewBox="`0 0 ${screen_width} ${screen_height}`" preserveAspectRatio="xMidYMid meet"></svg>
    </div>


</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import * as d3 from 'd3'
import type { GenealogyNode, GenealogyTreeProps, RawElement } from '@/types'
import OnePersonInformation from '@/components/OnePersonInformation.vue'
import "../styles/main.css"
import { RAW_TO_PRETTY } from '@/core/constants'
import { getFeatureValuesForID, getStartEndYearsForID } from '@/core/feature_values'
import { findRootTreeForID } from '@/core/genealogy'

const props = defineProps<GenealogyTreeProps>()
const containerRef = ref<HTMLDivElement | null>(null)
const svgRef = ref<SVGSVGElement | null>(null)
const screen_width = ref(0)
const screen_height = ref(0)
const familyName = ref("")
const showDialog = ref(false)
const personId = ref<number | null>()


const svgContainer = ref<d3.Selection<SVGGElement, unknown, null, undefined>>()

onMounted(() => {
    if (!containerRef.value || !svgRef.value) return

    const observer = new ResizeObserver(([entry]) => {
        screen_width.value = entry.contentRect.width
        screen_height.value = entry.contentRect.height

        drawGraph() // run your graph drawing function with new size
    })

    observer.observe(containerRef.value)
})

const GENERATION_BAR_HEIGHT: number = 100;
const NODE_WIDTH: number = 200;
const NODE_HEIGHT: number = 80
const BAR_THICKNESS: number = 3;

const PAIR_BAR_WIDTH: number = 300;
const LEAF_CHILDREN_WIDTH: number = 250;
const PAIR_WIDTH: number = PAIR_BAR_WIDTH + 2 * NODE_WIDTH;
const BORDER_MARGIN: number = 20;

const familyStartYear = ref(0)
const familyEndYear = ref(0)

const title = computed(() => {
    if(familyStartYear.value == 0 || familyEndYear.value == 0){
        return familyName.value
    }

    return familyName.value + ` (${familyStartYear.value} - ${familyEndYear.value})`
})

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
    for (let i = 0; i < node.leaf_children.length; i++) {
        children_widths.push(LEAF_CHILDREN_WIDTH);
    }

    if (children_widths.length < 2) {
        return 0;
    }

    width += children_widths[0] / 2;
    width += children_widths[children_widths.length - 1] / 2;
    for (let i = 1; i < children_widths.length - 1; i++) {
        width += children_widths[i];
    }
    return width;
}
function drawPair(
    id: number,
    x: number,
    y: number,
    trackedPersonFirstName: string | null,
    startYear: number | null,
    endYear: number | null,
    spouseName: string | null,
    lastName: string | null
) {
    const trackedName = trackedPersonFirstName ?? "?";
    const spouse = spouseName ?? "?";
    const surname = lastName ?? "?";

    const nodes = [
        {
            x: x - PAIR_BAR_WIDTH / 2,
            y,
            firstName: trackedName,
            color: '#AEDFF7', // Light blue
            isTracked: true,
        },
        {
            x: x + PAIR_BAR_WIDTH / 2,
            y,
            firstName: spouse,
            color: '#F7C5E0', // Light pink
            isTracked: false,
        },
    ];

    drawBar(nodes[0].x, y, nodes[1].x, y);

    nodes.forEach((d) => {
        const group = svgContainer.value?.append('g')
            .attr('class', 'pair-node')
            .attr('data-id', id)
            .style('cursor', d.isTracked ? 'pointer' : 'default');

        if (!group) return;

        // Draw rect
        group.append('rect')
            .attr('x', d.x - NODE_WIDTH / 2)
            .attr('y', d.y - NODE_HEIGHT / 2)
            .attr('width', NODE_WIDTH)
            .attr('height', NODE_HEIGHT)
            .attr('fill', d.color)
            .attr('stroke', '#003366')
            .attr('stroke-width', 2)
            .attr('rx', 10)
            .attr('ry', 10);

        // First name
        group.append('text')
            .attr('x', d.x)
            .attr('y', d.y - 15)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px')
            .attr('font-weight', 'bold')
            .attr('fill', '#222')
            .text(d.firstName);

        // Last name
        group.append('text')
            .attr('x', d.x)
            .attr('y', d.y + 5)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px')
            .attr('fill', '#444')
            .text(surname);

        if (d.isTracked) {
            if (startYear && endYear) {
                group.append('text')
                    .attr('x', d.x)
                    .attr('y', d.y + 27)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', '14px')
                    .attr('fill', '#444')
                    .text(`(${startYear} - ${endYear})`);
            }


            group
                .on('mouseover', function () {
                    d3.select(this).select('rect')
                        .attr('stroke', 'orange');
                    d3.select(this).selectAll('text')
                        .attr('fill', 'darkorange');
                })
                .on('mouseout', function () {
                    d3.select(this).select('rect')
                        .attr('stroke', '#003366');
                    d3.select(this).selectAll('text')
                        .attr('fill', (d, i) => (i === 0 ? '#222' : '#444'));
                })
                .on('click', function (event) {
                    personId.value = Number(d3.select(this).attr('data-id'));
                    showDialog.value = true;

                    d3.select(this).select('rect')
                        .attr('stroke', 'orange');
                    d3.select(this).selectAll('text')
                        .attr('fill', 'darkorange');
                });
        }
    });
}


function drawLeafChild(x: number, y: number, firstName: string | null, lastName: string | null) {

    const group = svgContainer.value?.append('g')
        .attr('class', 'leaf-node')
        .style('cursor', 'default');



    if (!group) { return }
    group.append('rect')
        .attr('x', x - NODE_WIDTH / 2)
        .attr('y', y - NODE_HEIGHT / 2)
        .attr('width', NODE_WIDTH)
        .attr('height', NODE_HEIGHT)
        .attr('fill', '#D9F0C1')  // soft green
        .attr('stroke', '#4CAF50')
        .attr('stroke-width', 2)
        .attr('rx', 10)
        .attr('ry', 10);

    group.append('text')
        .attr('x', x)
        .attr('y', y - 5) // Slightly above center
        .attr('text-anchor', 'middle')
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .attr('fill', '#222')
        .text(firstName == null ? "?" : firstName); // First name

    group.append('text')
        .attr('x', x)
        .attr('y', y + 15) // Slightly below center
        .attr('text-anchor', 'middle')
        .attr('font-size', '14px')
        .attr('fill', '#444')
        .text(lastName == null ? "?" : lastName);

}


function drawBar(fromX: number, fromY: number, toX: number, toY: number) {
    svgContainer.value?.append('path')
        .attr('d', d3.line()([[fromX, fromY], [toX, toY]]))
        .attr('stroke', '#888')
        .attr('stroke-width', BAR_THICKNESS)
        .attr('fill', 'none');
}


function drawTree(node: GenealogyNode, x: number, y: number, lastName: string | null) {


    const info = getFeatureValuesForID(node.id)
    const firstName = info[1] as string | null
    const spouseName = info[4] as string | null

    const years = getStartEndYearsForID(node.id)
    let startYear = null
    let endYear = null

    if (years.length) {
        startYear = years[0]
        endYear = years[1]
        familyEndYear.value = endYear > familyEndYear.value ? endYear : familyEndYear.value
    }

    drawPair(node.id, x, y, firstName, startYear, endYear, spouseName, lastName);


    if (node.children.length == 0 && node.leaf_children.length == 0) {
        return
    }

    drawBar(x, y, x, y + GENERATION_BAR_HEIGHT);

    // draw children bar
    const y_children_bar = y + GENERATION_BAR_HEIGHT;
    const children_bar_width = getChildrenBarWidth(node);
    drawBar(x - children_bar_width / 2, y_children_bar, x + children_bar_width / 2, y_children_bar);

    let child_x = x - children_bar_width / 2;
    const child_y = y_children_bar + GENERATION_BAR_HEIGHT;

    for (let i = 0; i < node.children.length - 1; i++) {
        const child = node.children[i];
        const next_child = node.children[i + 1];
        drawBar(child_x, y_children_bar, child_x, child_y);
        drawTree(child, child_x, child_y, lastName);
        child_x += getTreeWidth(child) / 2 + getTreeWidth(next_child) / 2;
    }

    // draw last child
    if (node.children.length > 0) {
        const child = node.children[node.children.length - 1];
        drawBar(child_x, y_children_bar, child_x, child_y);
        drawTree(child, child_x, child_y, lastName);
        child_x += getTreeWidth(child) / 2 + LEAF_CHILDREN_WIDTH / 2;;
    }

    for (let i = 0; i < node.leaf_children.length; i++) {
        drawBar(child_x, y_children_bar, child_x, child_y);
        drawLeafChild(child_x, child_y, node.leaf_children[i], lastName);
        child_x += LEAF_CHILDREN_WIDTH;
    }
}

function drawGraph() {
    if (!svgRef.value || screen_width.value === 0 || screen_height.value === 0) return


    const node = findRootTreeForID(props.id)

    if (!node) {
        return
    }

    const svg = d3.select(svgRef.value)
    svg.selectAll("*").remove() // clear previous render

    svgContainer.value = svg.append('g').attr('class', 'zoom-container')

    // Apply zoom/pan
    svg.call(
        d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.5, 1])
            .on("zoom", (event) => {
                svgContainer.value?.attr("transform", event.transform)
            })
    )



    const info = getFeatureValuesForID(node.id)
    const lastName = info[2] as string | null

    familyName.value = `Famille ${lastName?.toLocaleUpperCase()}`
    const years = getStartEndYearsForID(node.id)

    if (years.length > 0) {
        familyStartYear.value = years[0]
    }

    console.log(node)
    drawTree(node, screen_width.value / 2, 50, lastName)
}

</script>

<style scoped>
.chart-container {
    width: 100vw;
    height: 90vh;
}


svg {
    width: 100%;
    height: 100%;
    display: block;
    cursor: grab;
}

svg:active {
    cursor: grabbing;
}
</style>