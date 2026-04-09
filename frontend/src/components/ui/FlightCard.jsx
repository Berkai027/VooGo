import { formatPrice } from '@/utils/format';
import { AIRLINE_COLORS } from '@/data/constants';

function StopsLabel({ stops }) {
  if (stops === 0) return <span className="text-green text-xs">Direto</span>;
  if (stops === 1) return <span className="text-yellow text-xs">1 parada</span>;
  return <span className="text-orange text-xs">{stops} paradas</span>;
}

export default function FlightCard({ flight, isCheapest }) {
  const {
    departure_time, arrival_time,
    origin, destination,
    duration, stops,
    price, airline, flight_number,
    baggage, source, booking_url,
  } = flight;

  const airlineColor = AIRLINE_COLORS[flight?.airline_code] || '#3D7EFF';

  return (
    <div className={[
      'glass border rounded-2xl p-4 flex flex-col gap-3 transition-all hover:border-blue/40',
      isCheapest ? 'border-green/40' : 'border-glass-border',
    ].join(' ')}>
      {/* Cheapest badge */}
      {isCheapest && (
        <div className="flex">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green/20 text-green border border-green/30">
            ✓ Mais barato
          </span>
        </div>
      )}

      {/* Route visual */}
      <div className="flex items-center justify-between gap-2">
        {/* Departure */}
        <div className="text-left">
          <p className="text-xl font-brico font-bold text-text">{departure_time}</p>
          <p className="text-sm font-mono text-muted">{origin}</p>
        </div>

        {/* Middle */}
        <div className="flex-1 flex flex-col items-center gap-0.5">
          <p className="text-xs text-muted2">{duration}</p>
          <div className="w-full flex items-center gap-1">
            <div className="flex-1 h-px bg-glass-border" />
            <span className="text-base">✈</span>
            <div className="flex-1 h-px bg-glass-border" />
          </div>
          <StopsLabel stops={stops ?? 0} />
        </div>

        {/* Arrival */}
        <div className="text-right">
          <p className="text-xl font-brico font-bold text-text">{arrival_time}</p>
          <p className="text-sm font-mono text-muted">{destination}</p>
        </div>

        {/* Price */}
        <div className="text-right shrink-0 ml-2 pl-3 border-l border-glass-border">
          <p className="text-xl font-brico font-bold text-text">R$ {formatPrice(price)}</p>
          <p className="text-xs text-muted2">por pessoa</p>
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-glass-border">
        <div className="flex items-center gap-3 text-xs text-muted2 flex-wrap">
          <span style={{ color: airlineColor }} className="font-medium">
            {airline}
          </span>
          {flight_number && <span>{flight_number}</span>}
          {baggage && <span>🧳 {baggage}</span>}
          {source && <span className="opacity-60">{source}</span>}
        </div>

        {booking_url && (
          <a
            href={booking_url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-4 py-1.5 bg-blue text-white text-xs font-medium rounded-xl hover:bg-blue/90 transition-colors"
          >
            Reservar →
          </a>
        )}
      </div>
    </div>
  );
}
