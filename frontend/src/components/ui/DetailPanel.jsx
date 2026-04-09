import { useApp } from '@/context/AppContext';
import { formatPrice } from '@/utils/format';
import { MONTHS_PT } from '@/data/constants';
import FlightCard from './FlightCard';

export default function DetailPanel() {
  const { selectedDay, flights, month, year, origin, dest, setSelectedDay } = useApp();

  if (!selectedDay || flights.length === 0) return null;

  const minPrice = Math.min(...flights.map((f) => f.price).filter(Boolean));

  return (
    <div className="w-full animate-fadeInUp">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-brico font-bold text-text text-lg">
            {selectedDay} de {MONTHS_PT[month]} de {year}
          </h3>
          <p className="text-sm text-muted">
            {origin} → {dest}
            {minPrice ? ` · a partir de R$ ${formatPrice(minPrice)}` : ''}
          </p>
        </div>
        <button
          onClick={() => setSelectedDay(null)}
          className="w-8 h-8 rounded-full glass border border-glass-border flex items-center justify-center text-muted hover:text-text transition-colors"
        >
          ×
        </button>
      </div>

      {/* Flight cards */}
      <div className="flex flex-col gap-3">
        {flights.map((flight, i) => (
          <FlightCard
            key={flight.id || i}
            flight={flight}
            isCheapest={flight.price === minPrice}
          />
        ))}
      </div>
    </div>
  );
}
