import { Insight } from '../../types';

export interface TransformedSectorData {
  region: string;
  intensity: number;
}

export const transformDataForEnergySector = (data: Insight[]): TransformedSectorData[] => {
  const filteredAndMappedData = data
    .filter(d => d.sector === 'Energy')
    .map(({ region, intensity }) => ({
      region: region || 'Others',
      intensity: intensity ?? 0, 
    }));

 
  filteredAndMappedData.sort((a, b) => b.intensity - a.intensity);

  return filteredAndMappedData;
};
