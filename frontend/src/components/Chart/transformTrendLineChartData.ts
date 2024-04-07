import * as d3 from 'd3';

import { isValid, parse } from 'date-fns';

import { Insight } from '../../types';

export interface GroupedData {
  date: Date;
  averageIntensity: number;
  averageImpact: number;
  averageLikelihood: number;
}

export const transformData = (data: Insight[]): GroupedData[] => {
  const parsedData = data.map(insight => {
    const parsedDate = parse(insight.published, "MMMM, dd yyyy HH:mm:ss", new Date());
    return {
      date: parsedDate,
      intensity: insight.intensity ?? 0,
      impact: insight.impact ?? 0,
      likelihood: insight.likelihood ?? 0,
    };
  }).filter(d => isValid(d.date));

  const grouped = d3.groups(parsedData, d => d.date.getFullYear());
  const transformed = grouped.map(([year, insights]) => ({
    date: new Date(year, 0, 1),
    averageIntensity: d3.mean(insights, d => d.intensity) ?? 0,
    averageImpact: d3.mean(insights, d => d.impact) ?? 0,
    averageLikelihood: d3.mean(insights, d => d.likelihood) ?? 0,
  }));

  return transformed.sort((a, b) => a.date.getTime() - b.date.getTime());
};
