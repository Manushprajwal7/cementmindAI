import { useState, useEffect, useCallback } from 'react';

interface AnalysisData {
  id: string;
  [key: string]: any;
}

export function usePlantAnalysis(plantId: string) {
  const [data, setData] = useState<AnalysisData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/plants/${plantId}/analysis`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch plant analysis: ${response.statusText}`);
      }
      
      const result = await response.json();
      setData(result.data || []);
    } catch (err) {
      console.error('Error fetching plant analysis:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [plantId]);

  useEffect(() => {
    if (plantId) {
      fetchData();
    } else {
      setData([]);
      setLoading(false);
    }
  }, [plantId, fetchData]);

  return {
    data,
    loading,
    error,
    refresh: fetchData,
  };
}
