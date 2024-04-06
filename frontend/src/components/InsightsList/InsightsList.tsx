import { DonutChart } from '../Chart';
import { InsightItem } from '../InsightItem';
import { useFetchInsights } from '../../api';

export const InsightsList = () => {
  
  const apiUrl = import.meta.env.VITE_API_URL;
  const { insights, isLoading, error } = useFetchInsights(apiUrl);
  return (
    <div>
		<DonutChart insights={insights} />
      {isLoading && <p>Loading insights...</p>}
      {error && <p>Error fetching insights: {error}</p>}
      {insights.length > 0 ? (
        insights.map((insight) => <InsightItem key={insight._id} insight={insight} />)
      ) : (
        <p>No insights found.</p>
      )}
    </div>
  );
};
