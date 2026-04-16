import { useApp } from '@/context/AppContext';
import { formatPrice } from '@/utils/format';
import { useScrollReveal, useCounterAnimation } from '@/hooks/useScrollReveal';

function Card({ label, value, sub, color, icon, delay = 0 }) {
  const animatedValue = useCounterAnimation(value, 900, true);

  const colorMap = {
    green: 'border-green/30 bg-green/5 text-green hover:bg-green/10 hover:border-green/50',
    yellow: 'border-yellow/30 bg-yellow/5 text-yellow hover:bg-yellow/10 hover:border-yellow/50',
    orange: 'border-orange/30 bg-orange/5 text-orange hover:bg-orange/10 hover:border-orange/50',
    blue: 'border-blue/30 bg-blue/5 text-blue hover:bg-blue/10 hover:border-blue/50',
  };

  return (
    <div
      className={`glass border rounded-2xl p-3 sm:p-4 flex flex-col gap-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${colorMap[color]}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-2 text-sm font-medium opacity-80">
        <span aria-hidden="true">{icon}</span>
        <span>{label}</span>
      </div>
      <p className="text-xl sm:text-2xl font-brico font-bold mt-1 tabular-nums">
        {value != null ? `R$ ${formatPrice(Math.round(animatedValue))}` : '—'}
      </p>
      {sub && <p className="text-xs opacity-60 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function SummaryCards() {
  const { calData, smartData } = useApp();
  const ref = useScrollReveal();

  const prices = calData.map((d) => d.price).filter(Boolean);
  const minPrice = prices.length ? Math.min(...prices) : null;
  const maxPrice = prices.length ? Math.max(...prices) : null;
  const avgPrice = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : null;

  const bestDay = smartData?.best_day;
  const economy = smartData?.economy_pct;

  const tendencyLabel = economy != null
    ? `Economize até ${economy}% no melhor dia`
    : bestDay
    ? `Melhor dia: ${bestDay}`
    : 'melhor opção';

  return (
    <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full reveal stagger">
      <Card label="Menor preço" value={minPrice} icon="💚" color="green" sub="no mês" />
      <Card label="Preço médio" value={avgPrice} icon="🟡" color="yellow" sub="média do mês" />
      <Card label="Maior preço" value={maxPrice} icon="🟠" color="orange" sub="no mês" />
      <Card label="Tendência" value={minPrice} icon="💙" color="blue" sub={tendencyLabel} />
    </div>
  );
}
