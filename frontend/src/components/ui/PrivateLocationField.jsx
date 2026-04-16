import { useState, useRef, useEffect } from 'react';
import { searchCities } from '@/data/cities';

/**
 * City autocomplete for the Private Flights page.
 *
 * We only ask for the city — the exact location (heliport, address,
 * rooftop, resort, airport) is confirmed with the client during the
 * human service step, so no need to force airport or helipoint selection.
 */
export default function PrivateLocationField({
  value,
  onChange,
  placeholder,
  label,
  icon,
}) {
  const [query, setQuery] = useState(value || '');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { setQuery(value || ''); }, [value]);

  useEffect(() => {
    if (!query || query.length < 1) {
      setResults([]);
      return;
    }
    setResults(searchCities(query));
  }, [query]);

  function handleInput(e) {
    const q = e.target.value;
    setQuery(q);
    onChange?.(q);
    setOpen(q.length >= 1);
    setCursor(-1);
  }

  function pickCity(city) {
    const display = city.state
      ? `${city.name}, ${city.state}`
      : `${city.name}, ${city.country}`;
    setQuery(display);
    onChange?.(display);
    setOpen(false);
  }

  function useFreeText() {
    onChange?.(query);
    setOpen(false);
    inputRef.current?.blur();
  }

  function handleKeyDown(e) {
    if (!open) return;
    const total = results.length + (query.trim() ? 1 : 0);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, total - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === 'Enter') {
      if (cursor >= 0 && cursor < results.length) {
        e.preventDefault();
        pickCity(results[cursor]);
      } else if (cursor === results.length) {
        e.preventDefault();
        useFreeText();
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  useEffect(() => {
    function handleClick(e) {
      if (!containerRef.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const showFreeText = query.trim().length >= 1;

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
        onFocus={() => query.length >= 1 && (results.length > 0 || showFreeText) && setOpen(true)}
        placeholder={placeholder}
        className="w-full bg-glass border border-glass-border rounded-xl px-4 py-3 text-text placeholder-muted2 text-sm focus:outline-none focus:border-green/60 focus:ring-2 focus:ring-green/20 transition-all"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />

      {open && (results.length > 0 || showFreeText) && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-s2/95 backdrop-blur-xl border border-glass-border rounded-2xl overflow-hidden shadow-2xl shadow-black/60 animate-fadeInUp">
          <div className="p-1.5">
            {results.map((city, i) => {
              const isActive = cursor === i;
              return (
                <button
                  key={city.id}
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); pickCity(city); }}
                  onMouseEnter={() => setCursor(i)}
                  className={[
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150',
                    isActive
                      ? 'bg-green/10 border border-green/30'
                      : 'border border-transparent hover:bg-white/[0.04]',
                  ].join(' ')}
                >
                  <div className={[
                    'shrink-0 w-11 h-11 rounded-lg flex items-center justify-center text-lg border transition-colors',
                    isActive ? 'bg-green/20 border-green/40' : 'bg-glass border-glass-border',
                  ].join(' ')}>
                    📍
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-sm text-text truncate">{city.name}</span>
                      {city.state && (
                        <span className="text-[10px] text-muted2 uppercase tracking-wider shrink-0">{city.state}</span>
                      )}
                    </div>
                    <p className="text-xs text-muted truncate mt-0.5">{city.country}</p>
                  </div>
                  {isActive && <span className="shrink-0 text-green text-sm" aria-hidden="true">→</span>}
                </button>
              );
            })}

            {showFreeText && (
              <>
                {results.length > 0 && (
                  <div className="my-1 mx-3 border-t border-glass-border" />
                )}
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); useFreeText(); }}
                  onMouseEnter={() => setCursor(results.length)}
                  className={[
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150',
                    cursor === results.length
                      ? 'bg-green/10 border border-green/30'
                      : 'border border-transparent hover:bg-white/[0.04]',
                  ].join(' ')}
                >
                  <div className="shrink-0 w-11 h-11 rounded-lg flex items-center justify-center text-lg bg-glass border border-glass-border">
                    ✏️
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-text truncate">
                      Usar "{query}"
                    </div>
                    <p className="text-xs text-muted truncate mt-0.5">
                      Nossa equipe confirma o local exato com você
                    </p>
                  </div>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
