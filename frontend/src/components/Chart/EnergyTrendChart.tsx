import * as d3 from 'd3';

import React, { useEffect, useRef } from 'react';

import { Insight } from '../../types';

interface EnergyChartProps {
  data: Insight[];
}

const transformDataForEnergySector = (data: Insight[]) => {
  const filteredData = data
    .filter(d => d.sector === 'Energy')
    .map(({ region, intensity }) => ({
      region,
      intensity
    }));

  return filteredData;
};

export const EnergyTrendChart: React.FC<EnergyChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const transformedData = transformDataForEnergySector(data);
    if (!transformedData.length) return;

    const svg = d3.select(svgRef.current)
      .attr('width', 800)
      .attr('height', 400)
      .html(''); 
    const margin = { top: 20, right: 20, bottom: 80, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const x = d3.scaleBand()
      .domain(transformedData.map(d => d.region))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(transformedData, d => d.intensity)!])
      .range([height - margin.bottom, margin.top]);

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
		.selectAll("text")
		.style("text-anchor", "end")
		.attr("dx", "-.8em")
		.attr("dy", ".15em")
		.attr("transform", "rotate(-65)");

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    svg.selectAll(".bar")
      .data(transformedData)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.region)!)
        .attr("y", d => y(d.intensity ?? 0))
        .attr("width", x.bandwidth())
        .attr("height", d => height - margin.bottom - y(d.intensity ?? 0))
        .attr("fill", "#4daf4a");
  }, [data]); 

  return (
  <>
    <h2>Energy Intensity by Region</h2>
    <svg ref={svgRef} />
  </>);
};