export function formatPrice(p) {
  if (p == null) return '—';
  return Number(p).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function tierLabel(t) {
  return { cheap: 'Barato', mid: 'Normal', high: 'Alto', pricey: 'Caro' }[t] || '';
}

export function calcTier(price, q25, q60, q85) {
  if (price <= q25) return 'cheap';
  if (price <= q60) return 'mid';
  if (price <= q85) return 'high';
  return 'pricey';
}

export function calcQuartiles(prices) {
  const sorted = [...prices].sort((a, b) => a - b);
  return {
    q25: sorted[Math.floor(sorted.length * 0.25)] ?? Infinity,
    q60: sorted[Math.floor(sorted.length * 0.60)] ?? Infinity,
    q85: sorted[Math.floor(sorted.length * 0.85)] ?? Infinity,
  };
}
