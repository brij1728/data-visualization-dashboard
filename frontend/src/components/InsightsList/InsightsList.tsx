import { useEffect, useState } from 'react';

import { Insight } from '../../types';

export const InsightsList = () => {
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
   
    const apiUrl = import.meta.env.VITE_API_URL; 

    if (!apiUrl) {
      console.error('VITE_API_URL is not defined');
      return;
    }

   
    fetch(`${apiUrl}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setInsights(data);
      })
      .catch(error => console.error('Error fetching insights:', error));
  }, []); 

  return (
    <div>
      {insights.length > 0 ? (
        insights.map(insight => (
          <div key={insight._id}>
            <h3>{insight.title}</h3>
            <p>{insight.insight}</p>
          
          </div>
        ))
      ) : (
        <p>No insights found.</p> 
      )}
    </div>
  );
};
