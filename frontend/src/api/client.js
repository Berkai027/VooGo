/**
 * VooGo API client — direct flight data endpoints
 */

export async function fetchConfig() {
  const res = await fetch('/api/v1/config');
  const data = await res.json();
  return data.data;
}

/**
 * Fetch price calendar for a month
 */
export async function fetchCalendar(originSkyId, destSkyId, year, month) {
  const qs = new URLSearchParams({ originSkyId, destSkyId, year, month });
  const res = await fetch(`/api/v1/flights/calendar?${qs}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Erro ao buscar calendário');
  return json.data;
}

/**
 * Fetch flights for a specific day
 */
export async function fetchFlightsDay(originSkyId, destSkyId, originEntityId, destEntityId, date) {
  const qs = new URLSearchParams({ originSkyId, destSkyId, originEntityId, destEntityId, date });
  const res = await fetch(`/api/v1/flights/day?${qs}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Erro ao buscar voos');
  return json.data;
}

/**
 * Fetch nearby airports by lat/lng
 */
export async function fetchNearbyAirports(lat, lng) {
  const res = await fetch(`/api/v1/flights/nearby?lat=${lat}&lng=${lng}`);
  const json = await res.json();
  if (!json.success) return null;
  return json.data;
}

/**
 * Fetch cheapest destinations from an origin (Flight Everywhere)
 */
export async function fetchEverywhere(originSkyId, originEntityId) {
  const res = await fetch(`/api/v1/flights/everywhere?originSkyId=${encodeURIComponent(originSkyId)}&originEntityId=${encodeURIComponent(originEntityId)}`);
  const json = await res.json();
  if (!json.success) return [];
  return json.data;
}

/**
 * Log a search (non-blocking)
 */
export async function logSearch(origin, destination) {
  fetch('/api/v1/search-log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ origin, destination, city: destination }),
  }).catch(() => {});
}
