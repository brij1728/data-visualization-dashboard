import { DonutChart, EnergyTrendChart, TemporalTrendLineChart } from '../Chart';

import { useFetchInsights } from '../../api';

export const InsightsList = () => {
  
  const apiUrl = import.meta.env.VITE_API_URL;
  const { insights, isLoading, error } = useFetchInsights(apiUrl);
  
  return (
     <div>
      {isLoading && <p>Loading insights...</p>}
      {error && <p>Error fetching insights: {error}</p>}

      {!isLoading && !error && insights && <DonutChart insights={insights} />}
      {!isLoading && !error && insights && <EnergyTrendChart data={insights} />}
      {!isLoading && !error && insights && <TemporalTrendLineChart data={insights} />}
      
    </div>
  );
};
