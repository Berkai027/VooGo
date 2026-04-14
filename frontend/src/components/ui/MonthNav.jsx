import { useApp } from '@/context/AppContext';
import { useFlights } from '@/hooks/useFlights';
import { MONTHS_PT } from '@/data/constants';

export default function MonthNav() {
  const { year, month, setYear, setMonth, originAirport, destAirport, streaming } = useApp();
  const { loadCalendar } = useFlights();

  async function navigate(dir) {
    if (streaming || !originAirport || !destAirport) return;
    let newMonth = month + dir;
    let newYear = year;
    if (newMonth < 1) { newMonth = 12; newYear -= 1; }
    if (newMonth > 12) { newMonth = 1; newYear += 1; }
    setMonth(newMonth);
    setYear(newYear);

    try {
      await loadCalendar(originAirport.iata, destAirport.iata, newYear, newMonth);
    } catch (err) {
      console.error('Month nav error:', err);
    }
  }

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={() => navigate(-1)}
        disabled={streaming}
        className="w-9 h-9 rounded-full glass border border-glass-border flex items-center justify-center text-muted hover:text-text hover:border-muted disabled:opacity-40 transition-all"
      >
        ←
      </button>

      <h2 className="text-lg font-brico font-semibold text-text min-w-[180px] text-center">
        {MONTHS_PT[month]} {year}
      </h2>

      <button
        onClick={() => navigate(1)}
        disabled={streaming}
        className="w-9 h-9 rounded-full glass border border-glass-border flex items-center justify-center text-muted hover:text-text hover:border-muted disabled:opacity-40 transition-all"
      >
        →
      </button>
    </div>
  );
}
