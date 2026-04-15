import { useState, useRef, useEffect } from 'react';
import { searchAirports } from '@/data/airports';

export default function AirportAutocomplete({ value, onChange, onSelect, placeholder, label, icon }) {
  const [query, setQuery] = useState(value || '');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Keep local query in sync when value prop changes externally
  useEffect(() => { setQuery(value || ''); }, [value]);

  function handleInput(e) {
    const q = e.target.value;
    setQuery(q);
    onChange?.(q);
    if (q.length >= 1) {
      setResults(searchAirports(q).slice(0, 6));
      setOpen(true);
      setCursor(-1);
    } else {
      setResults([]);
      setOpen(false);
    }
  }

  function handleSelect(airport) {
    const display = `${airport.city} (${airport.iata})`;
    setQuery(display);
    onChange?.(display);
    onSelect?.(airport);
    setOpen(false);
    setResults([]);
  }

  function handleKeyDown(e) {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor(c => Math.min(c + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor(c => Math.max(c - 1, 0));
    } else if (e.key === 'Enter' && cursor >= 0) {
      e.preventDefault();
      handleSelect(results[cursor]);
    } else if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (!containerRef.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={containerRef} className="relative flex flex-col gap-1">
      {label && (
        <label className="text-xs text-muted font-medium flex items-center gap-1.5 mb-1">
          {icon && <span className="text-[13px]" aria-hidden="true">{icon}</span>}
          {label}
        </label>
      )}
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={() => query.length >= 1 && results.length > 0 && setOpen(true)}
        placeholder={placeholder}
        className="w-full bg-glass border border-glass-border rounded-xl px-4 py-3 text-text placeholder-muted2 text-sm focus:outline-none focus:border-blue/60 focus:ring-2 focus:ring-blue/20 transition-all"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-s2/95 backdrop-blur-xl border border-glass-border rounded-2xl overflow-hidden shadow-2xl shadow-black/60 animate-fadeInUp">
          <div className="p-1.5">
            {results.map((airport, i) => {
              const isActive = cursor === i;
              return (
                <button
                  key={airport.iata}
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); handleSelect(airport); }}
                  onMouseEnter={() => setCursor(i)}
                  className={[
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150',
                    isActive
                      ? 'bg-blue/10 border border-blue/30 shadow-[inset_0_0_0_1px_rgba(61,126,255,0.1)]'
                      : 'border border-transparent hover:bg-white/[0.04]',
                  ].join(' ')}
                >
                  {/* IATA badge */}
                  <div className={[
                    'shrink-0 w-11 h-11 rounded-lg flex items-center justify-center font-mono text-xs font-bold border transition-colors',
                    isActive
                      ? 'bg-blue/20 text-blue border-blue/40'
                      : 'bg-glass text-muted border-glass-border',
                  ].join(' ')}>
                    {airport.iata}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className={`font-semibold text-sm truncate ${isActive ? 'text-text' : 'text-text/90'}`}>
                        {airport.city}
                      </span>
                      <span className="text-[10px] text-muted2 uppercase tracking-wider shrink-0">
                        {airport.country}
                      </span>
                    </div>
                    <p className="text-xs text-muted truncate mt-0.5">
                      {airport.name}
                    </p>
                  </div>

                  {/* Chevron when active */}
                  {isActive && (
                    <span className="shrink-0 text-blue text-sm" aria-hidden="true">→</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
