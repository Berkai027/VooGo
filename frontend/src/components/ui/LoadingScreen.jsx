import { useState, useEffect } from 'react';

export default function LoadingScreen({ onDone }) {
  const [count, setCount] = useState(0);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    if (count >= 100) {
      setTimeout(() => {
        setHiding(true);
        setTimeout(() => onDone?.(), 400);
      }, 300);
      return;
    }
    const speed = count < 60 ? 25 : count < 85 ? 40 : 60;
    const timer = setTimeout(() => setCount(c => Math.min(c + 1, 100)), speed);
    return () => clearTimeout(timer);
  }, [count, onDone]);

  return (
    <div
      className={[
        'fixed inset-0 z-[100] bg-bg flex flex-col items-center justify-center transition-transform duration-400',
        hiding ? '-translate-y-full' : 'translate-y-0',
      ].join(' ')}
    >
      {/* Floating airplane */}
      <div className="animate-float text-6xl mb-8 select-none">✈️</div>

      {/* Brand */}
      <h1 className="text-3xl font-brico font-bold bg-gradient-to-r from-blue to-s1 bg-clip-text text-transparent mb-2">
        VooGo
      </h1>

      {/* Subtitle */}
      <p className="text-muted text-sm mb-8">Preparando decolagem...</p>

      {/* Progress bar */}
      <div className="w-64 h-1.5 bg-glass rounded-full overflow-hidden border border-glass-border">
        <div
          className="h-full bg-gradient-to-r from-blue to-s1 rounded-full transition-all duration-100"
          style={{ width: `${count}%` }}
        />
      </div>

      {/* Counter */}
      <p className="mt-3 text-xs text-muted2 font-mono">{count}%</p>
    </div>
  );
}
