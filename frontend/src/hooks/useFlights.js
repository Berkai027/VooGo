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
    setStreaming,
  } = useApp();

  const loadCalendar = useCallback(async (originSkyId, destSkyId, year, month) => {
    setStreaming(true);
    try {
      const data = await fetchCalendar(originSkyId, destSkyId, year, month);
      setCalData(data.days || []);
      setSmartData(data);
      return data;
    } catch (err) {
      console.error('Calendar error:', err.message);
      throw err;
    } finally {
      setStreaming(false);
    }
  }, [setCalData, setSmartData, setStreaming]);

  const loadFlightsDay = useCallback(async (originSkyId, destSkyId, originEntityId, destEntityId, date) => {
    try {
      const flights = await fetchFlightsDay(originSkyId, destSkyId, originEntityId, destEntityId, date);
      setFlights(flights);
      return flights;
    } catch (err) {
      console.error('Flights error:', err.message);
      throw err;
    }
  }, [setFlights]);

  return { loadCalendar, loadFlightsDay };
}
