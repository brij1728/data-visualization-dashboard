import { useEffect, useState } from 'react';

import { Insight } from '../types';

interface UseFetchInsightsReturn {
  insights: Insight[];
  isLoading: boolean;
  error: string | null;
}

export const useFetchInsights = (apiUrl: string): UseFetchInsightsReturn => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!apiUrl) {
      console.error('API URL is not defined');
      setError('API URL is not defined');
      return;
    }

    const fetchInsights = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Insight[] = await response.json();
        setInsights(data);
      } catch (error: unknown) {
        console.error('Error fetching insights:', error);
        if (error instanceof Error) {
          setError(error.message);
        }
	} finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, [apiUrl]); 

  return { insights, isLoading, error };
};
