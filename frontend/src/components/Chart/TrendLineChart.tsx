import * as d3 from 'd3';

import { Box, Typography } from '@mui/material';
import { GroupedData, transformData } from './transformTrendLineChartData';
import React, { useEffect, useRef } from 'react';

import { Insight } from '../../types';

type LineAttributeKey = 'averageIntensity' | 'averageImpact' | 'averageLikelihood';

const formatAttributeKey = (key: LineAttributeKey): string => {
  return key
    .replace(/average/g, '') 
    .replace(/([A-Z])/g, ' $1') 
    .replace(/^./, (str) => str.toUpperCase());
};

export const TrendLineChart: React.FC<{ data: Insight[] }> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const transformedData = transformData(data);
    console.log(transformedData);
    if (transformedData.length === 0) return;

    const width = 900;
    const height = 500;
    const margin = { top: 20, right: 80, bottom: 50, left: 60 };

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('overflow', 'visible');

    const xScale = d3.scaleTime()
      .domain(d3.extent(transformedData, d => d.date) as [Date, Date])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(transformedData, d => Math.max(d.averageIntensity, d.averageImpact, d.averageLikelihood)) ?? 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg.selectAll("*").remove();

    const colors: Record<LineAttributeKey, string> = {
      averageIntensity: 'steelblue',
      averageImpact: 'red',
      averageLikelihood: 'green',
    };

    const lineGenerators: Record<LineAttributeKey, d3.Line<GroupedData>> = {
      averageIntensity: d3.line<GroupedData>().x(d => xScale(d.date)).y(d => yScale(d.averageIntensity)).curve(d3.curveMonotoneX),
      averageImpact: d3.line<GroupedData>().x(d => xScale(d.date)).y(d => yScale(d.averageImpact)).curve(d3.curveMonotoneX),
      averageLikelihood: d3.line<GroupedData>().x(d => xScale(d.date)).y(d => yScale(d.averageLikelihood)).curve(d3.curveMonotoneX),
    };

    (Object.keys(colors) as LineAttributeKey[]).forEach((attr) => {
      const lineGenerator = lineGenerators[attr];
      svg.append("path")
        .datum(transformedData)
        .attr("fill", "none")
        .attr("stroke", colors[attr])
        .attr("stroke-width", 2)
        .attr("d", lineGenerator(transformedData));
    });

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    const lastDatum = transformedData[transformedData.length - 1];
    (Object.keys(colors) as LineAttributeKey[]).forEach((attr) => {
      svg.append('text')
        .attr('transform', `translate(${width - margin.right + 10}, ${yScale(lastDatum[attr])})`)
        .attr('dy', '.35em')
        .attr('fill', colors[attr])
        .style('font-size', '12px')
        .text(formatAttributeKey(attr)); 
    });

    svg.append('text')
      .attr('transform', `translate(${(width - margin.left - margin.right) / 2 + margin.left}, ${height - margin.top + 20})`)
      .style('text-anchor', 'middle')
      .text('Year');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', margin.left / 4)
      .attr('x', -(height / 2))
      .style('text-anchor', 'middle')
      .text('Value');
  }, [data]);

  return (
  <Box> 
      <Typography variant="h4" component="h2" gutterBottom>
        Annual Trends: Intensity, Impact, and Likelihood
      </Typography>
      <Box
        ref={svgRef}
        component="svg"
      />
    
    </Box>
  );
};

