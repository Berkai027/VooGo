import { useState } from 'react';
import { fetchEverywhere } from '@/api/client';
import { useApp } from '@/context/AppContext';
import { formatPrice } from '@/utils/format';

export default function FlightEverywhereCard() {
  const { originAirport, setDest, setDestAirport } = useApp();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [error, setError] = useState(null);

  async function handleOpen() {
    if (open) { setOpen(false); return; }
    setOpen(true);

    if (destinations.length) return;

    if (!originAirport) {
      setError('Selecione uma cidade de saída primeiro.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Use the origin's city-level skyId/entityId or airport-level
      const skyId = originAirport.citySkyId || originAirport.iata || '';
      const entityId = originAirport.cityEntityId || originAirport.entityId || '';

      const data = await fetchEverywhere(skyId, entityId);
      if (!data?.length) {
        setError('Nenhum destino encontrado para essa origem.');
      } else {
        setDestinations(data);
      }
    } catch {
      setError('Erro ao buscar destinos.');
    } finally {
      setLoading(false);
    }
  }

  function selectDestination(dest) {
    setDest(dest.name);
    setDestAirport({
      iata: dest.skyCode || dest.name,
      name: dest.name,
      city: dest.name,
      country: dest.continent || '',
    });
  }

  return (
    <div className="glass border border-glass-border rounded-2xl overflow-hidden transition-all duration-300">
      <button
        type="button"
        onClick={handleOpen}
        className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-white/[0.03] transition-colors"
      >
        <div className="shrink-0 w-11 h-11 rounded-xl bg-blue/10 border border-blue/25 flex items-center justify-center text-lg">
          🌍
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-brico font-bold text-sm text-text">Me surpreenda</h3>
          <p className="text-xs text-muted2 mt-0.5">Destinos mais baratos saindo da sua cidade</p>
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
              Buscando destinos baratos{originAirport ? ` saindo de ${originAirport.city || originAirport.iata}` : ''}...
            </div>
          )}

          {error && (
            <p className="text-sm text-red py-3">{error}</p>
          )}

          {destinations.length > 0 && (
            <>
              <p className="text-xs text-muted2 mb-3">
                Preços mais baratos saindo de <span className="text-text font-medium">{originAirport?.city || originAirport?.iata}</span> (ida)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[400px] overflow-y-auto scrollbar-thin pr-1">
                {destinations.map((dest) => (
                  <button
                    key={dest.id}
                    type="button"
                    onClick={() => selectDestination(dest)}
                    className="group relative flex items-center gap-3 p-3 rounded-xl border border-glass-border bg-glass hover:border-blue/30 hover:bg-blue/5 text-left transition-all overflow-hidden"
                  >
                    {/* Background image if available */}
                    {dest.image && (
                      <div
                        className="absolute inset-0 opacity-10 group-hover:opacity-15 transition-opacity bg-cover bg-center"
                        style={{ backgroundImage: `url(${dest.image})` }}
                      />
                    )}

                    <div className="relative flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-text truncate">{dest.name}</span>
                        {dest.direct && (
                          <span className="shrink-0 text-[9px] px-1.5 py-0.5 rounded-full bg-green/15 text-green font-medium">Direto</span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted2 mt-0.5">
                        {dest.type === 'Nation' ? 'País' : dest.type === 'City' ? 'Cidade' : dest.continent || ''}
                      </p>
                    </div>

                    <div className="relative text-right shrink-0">
                      <p className="text-xs text-muted2">a partir de</p>
                      <p className="font-brico font-bold text-green text-sm">
                        {dest.priceFormatted || `R$ ${formatPrice(dest.price)}`}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
