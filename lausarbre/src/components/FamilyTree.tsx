import React, { useEffect, useRef } from 'react';
import { Person } from '../App';
import * as d3 from 'd3';
import { Box, Typography, Paper } from '@mui/material';

type Props = {
    person: Person;
};

const FamilyTree: React.FC<Props> = ({ person }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        const width = 600;
        const height = 400;

        const treeData = {
            name: `${person.name} ${person.surname}`,
            children: [
                { name: 'Spouse: Anna Curie' },
                {
                    name: 'Children',
                    children: [
                        { name: 'Pierre Curie' },
                        { name: 'Irene Curie' },
                    ],
                },
            ],
        };

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const root = d3.hierarchy<{ name: string; children?: { name: string; children?: { name: string }[] }[] }>(treeData);
        const treeLayout = d3.tree().size([width - 100, height - 100]);
        treeLayout(root);

        svg
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', 'translate(50,50)')
            .selectAll('line')
            .data(root.links())
            .enter()
            .append('line')
            .attr('x1', (d) => d.source.x)
            .attr('y1', (d) => d.source.y)
            .attr('x2', (d) => d.target.x)
            .attr('y2', (d) => d.target.y)
            .attr('stroke', '#ccc');

        svg
            .select('g')
            .selectAll('circle')
            .data(root.descendants())
            .enter()
            .append('circle')
            .attr('cx', (d) => d.x)
            .attr('cy', (d) => d.y)
            .attr('r', 20)
            .attr('fill', '#90caf9');

        svg
            .select('g')
            .selectAll('text')
            .data(root.descendants())
            .enter()
            .append('text')
            .attr('x', (d) => d.x)
            .attr('y', (d) => d.y - 30)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .text((d) => d.data.name);
    }, [person]);

    return (
        <Box component={Paper} elevation={3} padding={2}>
            <Typography variant="h5" gutterBottom>
                Family Tree of {person.name} {person.surname}
            </Typography>
            <Box display="flex" justifyContent="center">
                <svg ref={svgRef}></svg>
            </Box>
        </Box>
    );
};

export default FamilyTree;

