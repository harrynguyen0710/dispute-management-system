import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import type { CasesTrendsResponseDto } from '../types/trends';

const API_BASE = import.meta.env.VITE_API_BASE;

export function useTrends() {
  const [trends, setTrends] = useState<CasesTrendsResponseDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrends = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<CasesTrendsResponseDto>(`${API_BASE}/cases/trends`);
      setTrends(response.data);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'An error occurred while fetching trends.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrends();
  }, [fetchTrends]);

  return {
    trends,
    loading,
    error,
    refresh: fetchTrends,
  };
}
