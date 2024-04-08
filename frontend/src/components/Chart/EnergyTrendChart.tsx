import * as d3 from 'd3';

import { Box, Typography } from '@mui/material';
import React, { useEffect, useRef } from 'react';

import { Insight } from '../../types';
import { transformDataForEnergySector } from './ transformDataBySector';

interface EnergyChartProps {
  data: Insight[];
}

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

    const xScale = d3.scaleBand()
      .domain(transformedData.map(d => d.region))
      .rangeRound([margin.left, width - margin.right])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(transformedData, d => d.intensity)!])
      .range([height - margin.bottom, margin.top]);

    svg.selectAll(".bar")
      .data(transformedData)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.region)!)
        .attr("y", d => yScale(d.intensity))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - margin.bottom - yScale(d.intensity))
        .attr("fill", "#4daf4a");

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));
  }, [data]);

  return (
   <Box > 
      <Typography variant="h4" component="h2" gutterBottom>
        Energy Intensity by Region
      </Typography>
      <Box
        ref={svgRef}
        component="svg"
      />
    
    </Box>
  );
};

