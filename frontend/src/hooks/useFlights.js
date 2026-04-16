import { useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { fetchCalendar } from '@/api/client';

/**
 * Hook for direct flight API calls (fast, no AI)
 * Used for calendar rendering
 */
export function useFlights() {
  const { setCalData, setSmartData, setLoading } = useApp();

  const loadCalendar = useCallback(async (originSkyId, destSkyId, year, month) => {
    setLoading(true);
    try {
      const data = await fetchCalendar(originSkyId, destSkyId, year, month);
      setCalData(data.days || []);
      setSmartData(data);
      return data;
    } finally {
      setLoading(false);
    }
  }, [setCalData, setSmartData, setLoading]);

  return { loadCalendar };
}
