import { useState, useRef, useEffect } from 'react';

const MONTHS_PT = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

/**
 * Custom date picker — premium dark theme that matches VooGo palette
 * Theme auto-adapts based on body.theme-green class
 */
export default function DateField({ value, onChange, placeholder = 'dd/mm/aaaa', minDate, maxDate }) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    if (value) return new Date(value);
    return new Date();
  });
  const containerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (!containerRef.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Detect current theme (green for private, blue otherwise)
  const isGreen = typeof document !== 'undefined' && document.body.classList.contains('theme-green');
  const accentClass = isGreen ? 'green' : 'blue';

  const selected = value ? new Date(value + 'T12:00:00') : null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const min = minDate ? new Date(minDate + 'T12:00:00') : today;

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  function formatDisplay(d) {
    if (!d) return '';
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  }

  function formatIso(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function selectDay(day) {
    const d = new Date(year, month, day);
    onChange(formatIso(d));
    setOpen(false);
  }

  function prevMonth() {
    setViewDate(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setViewDate(new Date(year, month + 1, 1));
  }

  function goToday() {
    const t = new Date();
    setViewDate(t);
    onChange(formatIso(t));
    setOpen(false);
  }

  function clear() {
    onChange('');
    setOpen(false);
  }

  // Build cells
  const cells = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function isSelected(day) {
    if (!selected) return false;
    return selected.getFullYear() === year && selected.getMonth() === month && selected.getDate() === day;
  }

  function isToday(day) {
    const t = new Date();
    return t.getFullYear() === year && t.getMonth() === month && t.getDate() === day;
  }

  function isDisabled(day) {
    const d = new Date(year, month, day);
    if (min && d < min) return true;
    if (maxDate && d > new Date(maxDate + 'T12:00:00')) return true;
    return false;
  }

  const accentStyles = {
    blue: {
      selected: 'bg-blue text-white shadow-lg shadow-blue/30',
      today: 'text-blue font-bold ring-1 ring-blue/40',
      hover: 'hover:bg-blue/10 hover:text-blue',
      nav: 'hover:bg-blue/10 hover:text-blue',
      link: 'text-blue hover:text-blue/80',
      borderFocus: 'focus-within:border-blue/60 focus-within:ring-2 focus-within:ring-blue/20',
    },
    green: {
      selected: 'bg-green text-bg shadow-lg shadow-green/30',
      today: 'text-green font-bold ring-1 ring-green/40',
      hover: 'hover:bg-green/10 hover:text-green',
      nav: 'hover:bg-green/10 hover:text-green',
      link: 'text-green hover:text-green/80',
      borderFocus: 'focus-within:border-green/60 focus-within:ring-2 focus-within:ring-green/20',
    },
  };
  const s = accentStyles[accentClass];

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between gap-2 bg-glass border border-glass-border rounded-xl px-4 py-3 text-left text-sm transition-all ${s.borderFocus} ${open ? s.borderFocus.replace('focus-within:', '') : ''}`}
      >
        <span className={selected ? 'text-text' : 'text-muted2'}>
          {selected ? formatDisplay(selected) : placeholder}
        </span>
        <svg className="w-4 h-4 text-muted2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 left-0 right-0 w-full bg-s2/95 backdrop-blur-xl border border-glass-border rounded-2xl p-3 sm:p-4 shadow-2xl shadow-black/60 animate-fadeInUp">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={prevMonth}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-muted transition-colors ${s.nav}`}
              aria-label="Mês anterior"
            >
              ←
            </button>
            <div className="font-brico font-bold text-text capitalize">
              {MONTHS_PT[month]} {year}
            </div>
            <button
              type="button"
              onClick={nextMonth}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-muted transition-colors ${s.nav}`}
              aria-label="Próximo mês"
            >
              →
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {WEEKDAYS.map((w, i) => (
              <div key={i} className="text-center text-[10px] font-semibold uppercase tracking-wider text-muted2 py-1">
                {w}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (day === null) return <div key={`e${i}`} />;
              const sel = isSelected(day);
              const td = isToday(day);
              const dis = isDisabled(day);
              return (
                <button
                  key={day}
                  type="button"
                  disabled={dis}
                  onClick={() => selectDay(day)}
                  className={[
                    'h-10 w-full sm:h-9 rounded-lg text-sm font-medium transition-all',
                    dis && 'text-muted/30 cursor-not-allowed',
                    !dis && !sel && !td && 'text-text ' + s.hover,
                    !dis && !sel && td && s.today + ' ' + s.hover,
                    sel && s.selected,
                  ].filter(Boolean).join(' ')}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-glass-border">
            <button
              type="button"
              onClick={clear}
              className={`text-xs font-medium transition-colors ${s.link}`}
            >
              Limpar
            </button>
            <button
              type="button"
              onClick={goToday}
              className={`text-xs font-medium transition-colors ${s.link}`}
            >
              Hoje
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
