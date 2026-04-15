import { useApp } from '@/context/AppContext';
import { formatPrice, tierLabel, calcTier, calcQuartiles } from '@/utils/format';

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const TIER_BG = {
  cheap: 'bg-green/15 border-green/30 hover:bg-green/25',
  mid: 'bg-yellow/15 border-yellow/30 hover:bg-yellow/25',
  high: 'bg-orange/15 border-orange/30 hover:bg-orange/25',
  pricey: 'bg-red/15 border-red/30 hover:bg-red/25',
  empty: 'bg-glass border-glass-border opacity-40 cursor-default',
};

const TIER_TEXT = {
  cheap: 'text-green',
  mid: 'text-yellow',
  high: 'text-orange',
  pricey: 'text-red',
};

export default function CalendarGrid() {
  const { calData, year, month, selectedDay, setSelectedDay, originAirport, destAirport, loading } = useApp();

  const now = new Date();
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  const prices = calData.map((d) => d.price).filter(Boolean);
  const { q25, q60, q85 } = prices.length ? calcQuartiles(prices) : { q25: 0, q60: 0, q85: 0 };

  const dataByDay = {};
  calData.forEach((d) => { dataByDay[d.day] = d; });

  function handleDayClick(day) {
    if (loading || !originAirport || !destAirport) return;
    const entry = dataByDay[day];
    if (!entry) return;
    setSelectedDay(day);
    // Detail panel reads directly from calData — no API call needed
    // (Sky Scrapper searchFlights endpoint is unreliable; we use Google Flights deep link instead)
  }

  function isPast(day) {
    const d = new Date(year, month - 1, day);
    d.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d < today;
  }

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="w-full">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((w) => (
          <div key={w} className="text-center text-xs text-muted2 py-1 font-medium">{w}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) => {
          if (day === null) return <div key={`empty-${idx}`} />;

          const entry = dataByDay[day];
          const past = isPast(day);
          const tier = entry && !past ? calcTier(entry.price, q25, q60, q85) : null;
          const isSelected = selectedDay === day;

          if (!entry || past) {
            return (
              <div
                key={day}
                className={[
                  'rounded-xl border p-1.5 text-center',
                  past ? 'opacity-25 cursor-default bg-glass border-glass-border' : 'bg-glass border-glass-border opacity-50',
                ].join(' ')}
              >
                <p className="text-xs text-muted">{day}</p>
              </div>
            );
          }

          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              className={[
                'rounded-xl border p-1.5 text-center transition-all duration-150 cursor-pointer',
                TIER_BG[tier],
                isSelected ? 'ring-2 ring-blue ring-offset-1 ring-offset-bg scale-105' : '',
              ].join(' ')}
            >
              <p className="text-xs text-muted">{day}</p>
              <p className={`text-[10px] font-bold mt-0.5 leading-tight ${TIER_TEXT[tier]}`}>
                R${formatPrice(entry.price)}
              </p>
              <p className={`text-[9px] mt-0.5 opacity-70 ${TIER_TEXT[tier]}`}>
                {tierLabel(tier)}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
