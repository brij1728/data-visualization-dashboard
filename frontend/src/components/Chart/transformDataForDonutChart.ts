import * as d3 from 'd3';

import { Insight } from '../../types';

export interface SectorDistribution {
  sector: string;
  count: number;
}

export const transformDataForDonutChart = (insights: Insight[]): SectorDistribution[] => {
  const sectorCounts: SectorDistribution[] = d3.rollups(
    insights,
    vs => vs.length, 
    d => d.sector || 'Others'
  ).map(([sector, count]) => ({ sector, count }));

  
  sectorCounts.sort((a, b) => b.count - a.count);

  return sectorCounts;
};
