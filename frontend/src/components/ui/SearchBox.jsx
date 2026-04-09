import { useApp } from '@/context/AppContext';
import { useAgent } from '@/hooks/useAgent';
import AirportAutocomplete from './AirportAutocomplete';

export default function SearchBox() {
  const { origin, dest, setOrigin, setDest, year, month, streaming } = useApp();
  const { sendMessage } = useAgent();

  function handleSearch() {
    if (!dest || streaming) return;

    const searchContext = { origin, destination: dest, year, month };
    const msg = `Buscar voos de ${origin} para ${dest} em ${month}/${year}`;
    sendMessage(msg, searchContext);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSearch();
  }

  return (
    <div className="glass border border-glass-border rounded-2xl p-6 shadow-xl w-full max-w-2xl mx-auto">
      <div className="flex flex-col gap-4">
        {/* Origin + Destination */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <AirportAutocomplete
            value={origin}
            onChange={setOrigin}
            onSelect={(a) => setOrigin(`${a.city} (${a.iata})`)}
            label="Saída"
            icon="🛫"
            placeholder="Ex: São Paulo (GRU)"
          />
          <AirportAutocomplete
            value={dest}
            onChange={setDest}
            onSelect={(a) => setDest(`${a.city} (${a.iata})`)}
            label="Destino"
            icon="🛬"
            placeholder="Ex: Lisboa (LIS)"
          />
        </div>

        {/* Search button */}
        <button
          onClick={handleSearch}
          onKeyDown={handleKeyDown}
          disabled={!dest || streaming}
          className={[
            'w-full py-3 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2',
            dest && !streaming
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
