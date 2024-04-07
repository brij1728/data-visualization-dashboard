import * as d3 from 'd3';

import React, { useEffect, useRef } from 'react';
import { isValid, parse } from 'date-fns';

import { Insight } from '../../types';

interface GroupedData {
  date: Date;
  averageIntensity: number;
}

const transformData = (data: Insight[]): GroupedData[] => {
  const parsedData = data.map(insight => {
    const parsedDate = parse(insight.published, "MMMM, dd yyyy HH:mm:ss", new Date());
    return {
      date: parsedDate,
      value: insight.intensity ?? 0,
    };
  }).filter(d => isValid(d.date) && d.value);

 
  const grouped = d3.groups(parsedData, d => d.date.getFullYear());
  const transformed: GroupedData[] = grouped.map(([year, insights]) => {
    const averageIntensity = d3.mean(insights, d => d.value) ?? 0;
   
    return {
      date: new Date(year, 0, 1),
      averageIntensity,
    };
  });

  return transformed.sort((a, b) => a.date.getTime() - b.date.getTime());
};

export const TemporalTrendLineChart: React.FC<{ data: Insight[] }> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  console.log(transformData(data));

  useEffect(() => {
    const transformedData = transformData(data);
    if (transformedData.length === 0) return;

    const width = 900;
    const height = 500;
    const margin = { top: 20, right: 30, bottom: 30, left: 60 };

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('overflow', 'visible');

    const xScale = d3.scaleTime()
      .domain(d3.extent(transformedData, d => d.date) as [Date, Date])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(transformedData, d => d.averageIntensity) ?? 0])
      .range([height - margin.bottom, margin.top]);

    const lineGenerator = d3.line<GroupedData>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.averageIntensity))
      .curve(d3.curveMonotoneX);

    svg.selectAll("*").remove();

    svg.append("path")
      .datum(transformedData)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", lineGenerator);

    svg.append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    svg.append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale));

  }, [data]);

  return <svg ref={svgRef}></svg>;
};
