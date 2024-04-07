import * as d3 from 'd3';

import React, { useEffect, useRef } from 'react';

import { Insight } from '../../types';

interface DonutChartProps {
  insights: Insight[];
}
interface SectorDistribution {
  sector: string;
  count: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({ insights }) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current || insights.length === 0) return;

    const width = 1200; 
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

    const sectorCounts: SectorDistribution[] = d3.rollups(
      insights,
      vs => vs.length,
      d => d.sector
    ).map(([sector, count]) => ({ sector, count }));

    const pie = d3.pie<SectorDistribution>()
      .sort(null) 
      .value(d => d.count)(sectorCounts);

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
      .on('mouseover', function (event, d) {
        d3.select(this).transition().duration(200).style('opacity', 0.85);
        labels.filter(dd => dd.data === d.data).style('opacity', 1).style('fill', 'black');
      })
      .on('mouseout', function (event, d) {
        d3.select(this).transition().duration(200).style('opacity', 0.7);
        labels.filter(dd => dd.data === d.data).style('opacity', 0).style('fill', 'white');
      });

    const legend = svg.selectAll('.legend')
      .data(sectorCounts)
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(${radius * 1.5}, ${i * 20 - sectorCounts.length * 10})`);

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

  }, [insights]);

  return (
  <>
    <h2>Insights by Sector</h2>
    <svg ref={ref} />
  </>);
};
