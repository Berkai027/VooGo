/**
 * SSE-based agent API client
 * Streams events from the backend agent endpoint
 */
export async function* streamAgent(messages, searchContext) {
  const response = await fetch('/api/v1/agent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, searchContext }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    yield { type: 'error', data: { message: err.message || `Erro ${response.status}` } };
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let eventType = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('event: ')) {
        eventType = line.slice(7).trim();
      } else if (line.startsWith('data: ')) {
        try {
          yield { type: eventType, data: JSON.parse(line.slice(6)) };
        } catch { /* skip malformed */ }
        eventType = '';
      }
    }
  }
}

/**
 * Fetch app config (WhatsApp number, etc)
 */
export async function fetchConfig() {
  const res = await fetch('/api/v1/config');
  const data = await res.json();
  return data.data;
}

/**
 * Fetch price calendar directly (fast, no AI)
 */
export async function fetchCalendar(originSkyId, destSkyId, year, month) {
  const qs = new URLSearchParams({ originSkyId, destSkyId, year, month });
  const res = await fetch(`/api/v1/flights/calendar?${qs}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Erro ao buscar calendário');
  return json.data;
}

/**
 * Fetch flights for a specific day (fast, no AI)
 */
export async function fetchFlightsDay(originSkyId, destSkyId, originEntityId, destEntityId, date) {
  const qs = new URLSearchParams({ originSkyId, destSkyId, originEntityId, destEntityId, date });
  const res = await fetch(`/api/v1/flights/day?${qs}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Erro ao buscar voos');
  return json.data;
}

/**
 * Search airports (fast, no AI)
 */
export async function fetchAirports(query) {
  const res = await fetch(`/api/v1/flights/airports?q=${encodeURIComponent(query)}`);
  const json = await res.json();
  if (!json.success) return [];
  return json.data;
}

/**
 * Log a search
 */
export async function logSearch(origin, destination) {
  fetch('/api/v1/search-log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ origin, destination, city: destination }),
  }).catch(() => {});
}
