import { useEffect, useState } from 'react';

const DURATION = 1800; // ms total — short and sweet

export default function LoadingScreen({ onDone }) {
  const [count, setCount] = useState(0);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    // Respect reduced motion — skip instantly
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onDone?.();
      return;
    }

    const startTime = performance.now();
    let rafId;
    let finished = false;

    function tick(now) {
      if (finished) return;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * 100));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        finished = true;
        setCount(100);
        setHiding(true);
        // Fire onDone after the slide-up finishes
        setTimeout(() => onDone?.(), 450);
      }
    }

    rafId = requestAnimationFrame(tick);

    // Safety net — force exit after 3s max, no matter what
    const safety = setTimeout(() => {
      if (!finished) {
        finished = true;
        cancelAnimationFrame(rafId);
        setCount(100);
        setHiding(true);
        setTimeout(() => onDone?.(), 300);
      }
    }, 3000);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(safety);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={[
        'fixed inset-0 z-[100] bg-bg flex flex-col items-center justify-center transition-transform duration-500 ease-out',
        hiding ? '-translate-y-full' : 'translate-y-0',
      ].join(' ')}
      role="status"
      aria-live="polite"
      aria-label="Carregando VooGo"
    >
      <div className="text-6xl mb-8 select-none animate-float" aria-hidden="true">✈️</div>
      <h1 className="text-3xl font-brico font-bold bg-gradient-to-r from-blue to-s1 bg-clip-text text-transparent mb-2">
        VooGo
      </h1>
      <p className="text-muted text-sm mb-8">Preparando decolagem...</p>
      <div className="w-64 h-1.5 bg-glass rounded-full overflow-hidden border border-glass-border">
        <div
          className="h-full bg-gradient-to-r from-blue to-s1 rounded-full"
          style={{ width: `${count}%`, transition: 'width 50ms linear' }}
        />
      </div>
      <p className="mt-3 text-xs text-muted2 font-mono tabular-nums">{count}%</p>
    </div>
  );
}
