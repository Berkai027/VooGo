import { useApp } from '@/context/AppContext';
import { useFlights } from '@/hooks/useFlights';
import { logSearch } from '@/api/client';
import { AIRPORTS } from '@/data/airports';
import AirportAutocomplete from './AirportAutocomplete';

/**
 * Try to match airport from text like "São Paulo (GRU)" or just "GRU"
 */
function matchAirport(text) {
  if (!text) return null;
  const iataMatch = text.match(/\(([A-Z]{3})\)/);
  const iata = iataMatch ? iataMatch[1] : text.trim().toUpperCase();
  return AIRPORTS.find((a) => a.iata === iata) || null;
}

export default function SearchBox() {
  const {
    origin, dest, setOrigin, setDest,
    originAirport, destAirport, setOriginAirport, setDestAirport,
    year, month, setYear, setMonth, loading,
  } = useApp();
  const { loadCalendar } = useFlights();

  async function handleSearch() {
    // Fallback: resolve airports from text if user typed without clicking autocomplete
    const resolvedOrigin = originAirport || matchAirport(origin);
    const resolvedDest = destAirport || matchAirport(dest);

    if (!resolvedDest || !resolvedOrigin || loading) return;

    // Ensure state is updated
    if (!originAirport && resolvedOrigin) setOriginAirport(resolvedOrigin);
    if (!destAirport && resolvedDest) setDestAirport(resolvedDest);

    // Auto-advance month if most days already past
    const now = new Date();
    let y = year, m = month;
    if (y === now.getFullYear() && m === now.getMonth() + 1 && now.getDate() > 20) {
      if (m === 12) { m = 1; y++; } else m++;
      setYear(y); setMonth(m);
    }

    // GA4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'flight_search', {
        origin: resolvedOrigin.iata,
        destination: resolvedDest.iata,
      });
    }

    // Log (non-blocking)
    logSearch(resolvedOrigin.iata, resolvedDest.iata);

    // Fast calendar load — direct API, no AI
    try {
      await loadCalendar(resolvedOrigin.iata, resolvedDest.iata, y, m);
    } catch {
      // Error is handled by useFlights / AppContext state
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSearch();
  }

  const canSearch = !loading && (destAirport || matchAirport(dest)) && (originAirport || matchAirport(origin));

  return (
    <div className="glass border border-glass-border rounded-2xl p-4 sm:p-6 shadow-xl w-full max-w-2xl mx-auto">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <AirportAutocomplete
            value={origin}
            onChange={setOrigin}
            onSelect={(a) => {
              setOriginAirport(a);
              setOrigin(`${a.city} (${a.iata})`);
            }}
            label="Saída"
            icon="🛫"
            placeholder="Ex: São Paulo (GRU)"
          />
          <AirportAutocomplete
            value={dest}
            onChange={setDest}
            onSelect={(a) => {
              setDestAirport(a);
              setDest(`${a.city} (${a.iata})`);
            }}
            label="Destino"
            icon="🛬"
            placeholder="Ex: Lisboa (LIS)"
          />
        </div>

        <button
          onClick={handleSearch}
          onKeyDown={handleKeyDown}
          disabled={!canSearch}
          className={[
            'w-full py-3 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2',
            canSearch
              ? 'bg-gradient-to-r from-blue to-s1 text-white shadow-md hover:opacity-90 hover:shadow-lg'
              : 'bg-glass text-muted2 cursor-not-allowed border border-glass-border',
          ].join(' ')}
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Buscando...
            </>
          ) : (
            'Buscar voos →'
          )}
        </button>

        <div className="flex items-center justify-center gap-2 pt-1">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-blue font-semibold bg-blue/10 border border-blue/25 rounded-full px-3 py-1">
            <span aria-hidden="true">✈</span>
            Mostramos apenas <span className="underline decoration-blue/40 underline-offset-2">preços de ida</span>
          </span>
        </div>
      </div>
    </div>
  );
}
