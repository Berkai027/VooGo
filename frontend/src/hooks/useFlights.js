import { useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { fetchCalendar, fetchFlightsDay } from '@/api/client';

/**
 * Hook for direct flight API calls (fast, no AI)
 * Used for calendar rendering and day detail panel
 */
export function useFlights() {
  const {
    setCalData,
    setSmartData,
    setFlights,
    setLoading,
  } = useApp();

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

  const loadFlightsDay = useCallback(async (originSkyId, destSkyId, originEntityId, destEntityId, date) => {
    const flights = await fetchFlightsDay(originSkyId, destSkyId, originEntityId, destEntityId, date);
    setFlights(flights);
    return flights;
  }, [setFlights]);

  return { loadCalendar, loadFlightsDay };
}
