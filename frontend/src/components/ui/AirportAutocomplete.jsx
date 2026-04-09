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
      setResults(searchAirports(q).slice(0, 8));
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
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor(c => Math.min(c + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setCursor(c => Math.max(c - 1, 0)); }
    else if (e.key === 'Enter' && cursor >= 0) { e.preventDefault(); handleSelect(results[cursor]); }
    else if (e.key === 'Escape') { setOpen(false); }
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
        <label className="text-xs text-muted font-medium flex items-center gap-1">
          {icon && <span>{icon}</span>}
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
        className="w-full bg-glass border border-glass-border rounded-xl px-4 py-3 text-text placeholder-muted2 text-sm focus:outline-none focus:border-blue/60 transition-colors"
        autoComplete="off"
      />

      {open && results.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-1 z-50 glass border border-glass-border rounded-xl overflow-hidden shadow-xl">
          {results.map((airport, i) => (
            <li
              key={airport.iata}
              onMouseDown={() => handleSelect(airport)}
              className={[
                'flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors text-sm',
                cursor === i ? 'bg-blue/20 text-text' : 'hover:bg-glass text-muted',
              ].join(' ')}
            >
              <div>
                <span className="font-medium text-text">{airport.city}</span>
                <span className="ml-1 text-muted2">{airport.name}</span>
              </div>
              <div className="text-right shrink-0 ml-4">
                <span className="font-mono text-blue text-xs font-bold">{airport.iata}</span>
                <p className="text-muted2 text-xs">{airport.country}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
