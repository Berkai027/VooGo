import { useRef, useEffect } from 'react';

const PARTICLE_COUNT = 80;
const LINK_DISTANCE = 120;
const COLOR = 'rgba(61,126,255,';

function makeParticle(w, h) {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6,
    size: Math.random() * 2 + 1,
    alpha: Math.random() * 0.5 + 0.2,
  };
}

export default function ParticleCanvas({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respect prefers-reduced-motion — draw a single static frame, no animation
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d');

    let w = canvas.offsetWidth;
    let h = canvas.offsetHeight;
    canvas.width = w;
    canvas.height = h;

    let particles = Array.from({ length: PARTICLE_COUNT }, () => makeParticle(w, h));
    let rafId;

    function resize() {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w;
      canvas.height = h;
      particles = Array.from({ length: PARTICLE_COUNT }, () => makeParticle(w, h));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = COLOR + p.alpha + ')';
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DISTANCE) {
            const lineAlpha = (1 - dist / LINK_DISTANCE) * 0.25;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = COLOR + lineAlpha + ')';
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      if (!prefersReducedMotion) {
        rafId = requestAnimationFrame(draw);
      }
    }

    draw();
    window.addEventListener('resize', resize);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={['absolute inset-0 w-full h-full pointer-events-none', className].join(' ')}
    />
  );
}
