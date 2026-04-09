import { useApp } from '@/context/AppContext';
import { formatPrice } from '@/utils/format';

function Card({ label, value, sub, color, icon }) {
  const colorMap = {
    green: 'border-green/30 bg-green/5 text-green',
    yellow: 'border-yellow/30 bg-yellow/5 text-yellow',
    orange: 'border-orange/30 bg-orange/5 text-orange',
    blue: 'border-blue/30 bg-blue/5 text-blue',
  };

  return (
    <div className={`glass border rounded-2xl p-4 flex flex-col gap-1 ${colorMap[color]}`}>
      <div className="flex items-center gap-2 text-sm font-medium opacity-80">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <p className="text-2xl font-brico font-bold mt-1">
        {value != null ? `R$ ${formatPrice(value)}` : '—'}
      </p>
      {sub && <p className="text-xs opacity-60 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function SummaryCards() {
  const { calData, smartData } = useApp();

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
    : null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full animate-fadeInUp">
      <Card label="Menor preço" value={minPrice} icon="💚" color="green" sub="no mês" />
      <Card label="Preço médio" value={avgPrice} icon="🟡" color="yellow" sub="média do mês" />
      <Card label="Maior preço" value={maxPrice} icon="🟠" color="orange" sub="no mês" />
      <Card
        label="Tendência"
        value={minPrice}
        icon="💙"
        color="blue"
        sub={tendencyLabel || 'melhor opção'}
      />
    </div>
  );
}
