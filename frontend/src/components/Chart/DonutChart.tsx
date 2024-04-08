import * as d3 from 'd3';

import { Box, Typography } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { SectorDistribution, transformDataForDonutChart } from './transformDataForDonutChart';

import { Insight } from '../../types';

interface DonutChartProps {
  data: Insight[];
}

export const DonutChart: React.FC<DonutChartProps> = ({ data }) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current || data.length === 0) return;

    const transformedData = transformDataForDonutChart(data);
    const width = 800; 
    const height = 500;
    const margin = 40;
    const radius = Math.min(width, height) / 2 - margin;

    d3.select(ref.current).selectAll("*").remove();

    const svg = d3.select(ref.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${radius + margin},${height / 2})`); 

    const color = d3.scaleOrdinal(d3.schemeCategory10);


    const pie = d3.pie<SectorDistribution>()
      .sort(null) 
      .value(d => d.count)(transformedData);

    const arc = d3.arc<d3.PieArcDatum<SectorDistribution>>()
      .innerRadius(radius * 0.5)
      .outerRadius(radius * 0.8);

      const slices = svg.selectAll('path')
      .data(pie)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.sector))
      .style('opacity', 0.7);

    const labels = svg.selectAll('text')
      .data(pie)
      .enter()
      .append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .text(d => d.data.sector)
      .style('fill', '#df3a3a')
      .style('opacity', 0);

    slices
      .on('mouseover', function (_, d) {
        d3.select(this).transition().duration(200).style('opacity', 0.85);
        labels.filter(dd => dd.data === d.data).style('opacity', 1).style('fill', 'black');
      })
      .on('mouseout', function (_, d) {
        d3.select(this).transition().duration(200).style('opacity', 0.7);
        labels.filter(dd => dd.data === d.data).style('opacity', 0).style('fill', 'white');
      });

    const legend = svg.selectAll('.legend')
      .data(transformedData)
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', (_, i) => `translate(${radius * 1.5}, ${i * 20 - transformedData.length * 10})`);

    legend.append('rect')
      .attr('width', 18)
      .attr('height', 18)
      .attr('fill', d => color(d.sector));

    legend.append('text')
      .attr('x', 24)
      .attr('y', 9)
      .attr('dy', '.35em')
      .text(d => d.sector)
      .style('text-anchor', 'start')
      .style('alignment-baseline', 'middle');

  }, [data]);

  return (
  <Box > 
      <Typography variant="h4" component="h2" gutterBottom>
        Insights by Sector
      </Typography>
      <Box
        ref={ref}
        component="svg"
      />
    
    </Box>
  );
};
