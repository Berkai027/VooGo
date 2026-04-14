import { useApp } from '@/context/AppContext';
import { formatPrice, tierLabel, calcTier, calcQuartiles } from '@/utils/format';
import { MONTHS_PT } from '@/data/constants';

export default function DetailPanel() {
  const { selectedDay, calData, month, year, originAirport, destAirport, setSelectedDay } = useApp();

  if (!selectedDay) return null;

  const entry = calData.find((d) => d.day === selectedDay);
  if (!entry) return null;

  // Calculate tier for this day
  const prices = calData.map((d) => d.price).filter(Boolean);
  const { q25, q60, q85 } = prices.length ? calcQuartiles(prices) : { q25: 0, q60: 0, q85: 0 };
  const tier = entry.price ? calcTier(entry.price, q25, q60, q85) : null;

  const tierColors = {
    cheap: { text: 'text-green', bg: 'bg-green/15', border: 'border-green/30' },
    mid: { text: 'text-yellow', bg: 'bg-yellow/15', border: 'border-yellow/30' },
    high: { text: 'text-orange', bg: 'bg-orange/15', border: 'border-orange/30' },
    pricey: { text: 'text-red', bg: 'bg-red/15', border: 'border-red/30' },
  };
  const colors = tier ? tierColors[tier] : tierColors.mid;

  // Average price for comparison
  const avg = prices.length ? prices.reduce((s, p) => s + p, 0) / prices.length : 0;
  const diff = avg && entry.price ? Math.round(((entry.price / avg) - 1) * 100) : 0;

  // Google Flights deep link
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
  const originCode = originAirport?.iata || 'GRU';
  const destCode = destAirport?.iata || '';
  const googleFlightsUrl = `https://www.google.com/travel/flights?q=Flights%20from%20${originCode}%20to%20${destCode}%20on%20${dateStr}`;

  return (
    <div className="w-full animate-fadeInUp">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-brico font-bold text-text text-xl">
            {selectedDay} de {MONTHS_PT[month]} de {year}
          </h3>
          <p className="text-sm text-muted mt-1">
            {originAirport?.city || 'Origem'} ({originCode}) → {destAirport?.city || 'Destino'} ({destCode})
          </p>
        </div>
        <button
          onClick={() => setSelectedDay(null)}
          className="w-9 h-9 rounded-full glass border border-glass-border flex items-center justify-center text-muted hover:text-text transition-colors"
          aria-label="Fechar"
        >
          ×
        </button>
      </div>

      {/* Main card — price + tier + comparison */}
      <div className={`glass border ${colors.border} rounded-2xl p-6 mb-4`}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-xs text-muted uppercase tracking-wider mb-1">Preço a partir de</p>
            <p className={`font-brico font-bold text-4xl ${colors.text}`}>
              R$ {formatPrice(entry.price)}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} font-medium`}>
                {tierLabel(tier)}
              </span>
              {diff !== 0 && (
                <span className="text-xs text-muted">
                  {diff > 0 ? `${diff}% acima` : `${Math.abs(diff)}% abaixo`} da média
                </span>
              )}
            </div>
          </div>

          {entry.group && (
            <div className="text-right">
              <p className="text-xs text-muted uppercase tracking-wider mb-1">Classificação</p>
              <p className="text-sm text-muted2 capitalize">{entry.group}</p>
            </div>
          )}
        </div>

        {/* Extra info if available */}
        {(entry.airline || entry.departure) && (
          <div className="pt-4 border-t border-glass-border grid grid-cols-2 gap-3">
            {entry.airline && (
              <div>
                <p className="text-[10px] text-muted uppercase tracking-wider">Companhia</p>
                <p className="text-sm text-text font-medium">{entry.airline}</p>
              </div>
            )}
            {entry.departure && (
              <div>
                <p className="text-[10px] text-muted uppercase tracking-wider">Partida</p>
                <p className="text-sm text-text font-medium">{entry.departure}</p>
              </div>
            )}
            {entry.duration && (
              <div>
                <p className="text-[10px] text-muted uppercase tracking-wider">Duração</p>
                <p className="text-sm text-text font-medium">{entry.duration}</p>
              </div>
            )}
            {typeof entry.stops === 'number' && (
              <div>
                <p className="text-[10px] text-muted uppercase tracking-wider">Escalas</p>
                <p className="text-sm text-text font-medium">
                  {entry.stops === 0 ? 'Direto' : `${entry.stops} escala${entry.stops > 1 ? 's' : ''}`}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Call to action */}
      <div className="glass border border-glass-border rounded-2xl p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h4 className="font-brico font-semibold text-text text-base mb-1">
              Ver voos disponíveis
            </h4>
            <p className="text-xs text-muted2 leading-relaxed">
              Veja horários, companhias, escalas e reserve no Google Voos.
            </p>
          </div>
          <span className="text-2xl">✈️</span>
        </div>

        <a
          href={googleFlightsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-blue to-s1 text-white shadow-md hover:opacity-90 hover:shadow-lg"
        >
          Buscar no Google Voos
          <span>→</span>
        </a>
      </div>
    </div>
  );
}
