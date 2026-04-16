import { useState } from 'react';
import { fetchNearbyAirports } from '@/api/client';
import { useApp } from '@/context/AppContext';

export default function NearbyAirportsCard() {
  const { originAirport, setOrigin, setOriginAirport } = useApp();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  async function handleOpen() {
    if (open) { setOpen(false); return; }
    setOpen(true);

    if (data) return;

    setLoading(true);
    setError(null);
    try {
      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 });
      });

      const result = await fetchNearbyAirports(pos.coords.latitude, pos.coords.longitude);
      if (!result || !result.nearby?.length) {
        setError('Nenhum aeroporto encontrado perto de você.');
      } else {
        setData(result);
      }
    } catch (err) {
      setError(
        err?.code === 1
          ? 'Localização negada. Permita o acesso para ver aeroportos próximos.'
          : 'Não foi possível obter sua localização.'
      );
    } finally {
      setLoading(false);
    }
  }

  function selectAirport(airport) {
    const parts = [airport.city, airport.state].filter(Boolean).join('/');
    const label = parts
      ? `${parts} — ${airport.airportName} (${airport.skyId})`
      : `${airport.airportName} (${airport.skyId})`;
    setOrigin(label);
    setOriginAirport({
      iata: airport.skyId,
      entityId: airport.entityId,
      name: airport.airportName,
      city: airport.city || airport.airportName,
      country: airport.country || '',
    });
  }

  function buildLocationLine(airport) {
    const parts = [];
    if (airport.city) parts.push(airport.city);
    if (airport.state) parts.push(airport.state);
    if (airport.country) parts.push(airport.country);
    return parts.join(', ');
  }

  return (
    <div className="glass border border-glass-border rounded-2xl overflow-hidden transition-all duration-300">
      <button
        type="button"
        onClick={handleOpen}
        className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-white/[0.03] transition-colors"
      >
        <div className="shrink-0 w-11 h-11 rounded-xl bg-blue/10 border border-blue/25 flex items-center justify-center text-lg">
          📍
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-brico font-bold text-sm text-text">Aeroportos próximos</h3>
          <p className="text-xs text-muted2 mt-0.5">Talvez saia mais barato por outro aeroporto perto de você</p>
        </div>
        <span className={`text-muted text-sm shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {open && (
        <div className="px-5 pb-5 animate-fadeInUp">
          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted2 py-4">
              <span className="w-4 h-4 border-2 border-blue/30 border-t-blue rounded-full animate-spin" />
              Buscando aeroportos próximos...
            </div>
          )}

          {error && (
            <p className="text-sm text-red py-3">{error}</p>
          )}

          {data && (
            <div className="grid gap-2">
              {data.current && (
                <div className="text-xs text-muted2 mb-2">
                  Aeroporto mais próximo: <span className="text-text font-medium">{data.current.suggestionTitle || data.current.name}</span>
                </div>
              )}
              {data.nearby.map((airport) => {
                const isCurrentOrigin = originAirport?.iata === airport.skyId;
                return (
                  <div
                    key={airport.entityId}
                    className={[
                      'flex items-center gap-3 p-3 rounded-xl border transition-all',
                      isCurrentOrigin
                        ? 'bg-blue/10 border-blue/30'
                        : 'bg-glass border-glass-border hover:border-blue/30 hover:bg-blue/5',
                    ].join(' ')}
                  >
                    {/* IATA badge */}
                    <div className={[
                      'shrink-0 w-11 h-11 rounded-lg font-mono text-xs font-bold flex items-center justify-center border',
                      isCurrentOrigin ? 'bg-blue/20 text-blue border-blue/40' : 'bg-glass text-muted border-glass-border',
                    ].join(' ')}>
                      {airport.skyId}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-text truncate">
                        Aeroporto {airport.airportName}
                      </p>
                      <p className="text-xs text-muted2 truncate">
                        {buildLocationLine(airport)}
                      </p>
                      {/* Map link */}
                      {airport.mapUrl && (
                        <a
                          href={airport.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-blue hover:text-blue/80 mt-1 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          Ver no mapa
                        </a>
                      )}
                    </div>

                    {/* Action */}
                    {isCurrentOrigin ? (
                      <span className="text-[10px] px-2.5 py-1 rounded-full bg-blue/20 text-blue font-medium shrink-0">Selecionado</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => selectAirport(airport)}
                        className="shrink-0 text-xs text-blue font-medium hover:text-blue/80 transition-colors px-2 py-1"
                      >
                        Usar →
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
