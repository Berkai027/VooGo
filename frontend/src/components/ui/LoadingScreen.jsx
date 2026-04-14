import { useEffect, useRef, useState } from 'react';

const TOTAL_DURATION = 2500; // ms total

export default function LoadingScreen({ onDone }) {
  const [count, setCount] = useState(0);
  const [hiding, setHiding] = useState(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    // Respect reduced motion — skip loading screen
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onDoneRef.current?.();
      return;
    }

    const startTime = performance.now();
    let rafId;

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / TOTAL_DURATION, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const nextCount = Math.round(eased * 100);
      setCount(nextCount);

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setHiding(true);
          setTimeout(() => onDoneRef.current?.(), 500);
        }, 200);
      }
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      className={[
        'fixed inset-0 z-[100] bg-bg flex flex-col items-center justify-center transition-transform duration-500',
        hiding ? '-translate-y-full' : 'translate-y-0',
      ].join(' ')}
      role="status"
      aria-live="polite"
      aria-label="Carregando VooGo"
    >
      <div className="animate-float text-6xl mb-8 select-none" aria-hidden="true">✈️</div>
      <h1 className="text-3xl font-brico font-bold bg-gradient-to-r from-blue to-s1 bg-clip-text text-transparent mb-2">
        VooGo
      </h1>
      <p className="text-muted text-sm mb-8">Preparando decolagem...</p>
      <div className="w-64 h-1.5 bg-glass rounded-full overflow-hidden border border-glass-border">
        <div
          className="h-full bg-gradient-to-r from-blue to-s1 rounded-full"
          style={{ width: `${count}%`, transition: 'width 60ms linear' }}
        />
      </div>
      <p className="mt-3 text-xs text-muted2 font-mono tabular-nums">{count}%</p>
    </div>
  );
}
