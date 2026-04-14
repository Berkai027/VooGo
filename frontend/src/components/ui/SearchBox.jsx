import { useApp } from '@/context/AppContext';
import { useFlights } from '@/hooks/useFlights';
import { logSearch } from '@/api/client';
import AirportAutocomplete from './AirportAutocomplete';

export default function SearchBox() {
  const {
    origin, dest, setOrigin, setDest,
    originAirport, destAirport, setOriginAirport, setDestAirport,
    year, month, setYear, setMonth, streaming,
  } = useApp();
  const { loadCalendar } = useFlights();

  async function handleSearch() {
    if (!destAirport || !originAirport || streaming) return;

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
        origin: originAirport.iata,
        destination: destAirport.iata,
      });
    }

    // Log (non-blocking)
    logSearch(originAirport.iata, destAirport.iata);

    // Fast calendar load — direct API, no AI
    try {
      await loadCalendar(originAirport.iata, destAirport.iata, y, m);
    } catch (err) {
      console.error('Search failed:', err);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSearch();
  }

  const canSearch = originAirport && destAirport && !streaming;

  return (
    <div className="glass border border-glass-border rounded-2xl p-6 shadow-xl w-full max-w-2xl mx-auto">
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
          {streaming ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Buscando...
            </>
          ) : (
            'Buscar voos →'
          )}
        </button>
      </div>
    </div>
  );
}
