import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { formatPrice, tierLabel, calcTier, calcQuartiles } from '@/utils/format';
import { MONTHS_PT } from '@/data/constants';

const WEEKDAYS_LONG = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

const TIER_COLORS = {
  cheap: { text: 'text-green', bg: 'bg-green/10', border: 'border-green/30', glow: 'shadow-green/20' },
  mid: { text: 'text-yellow', bg: 'bg-yellow/10', border: 'border-yellow/30', glow: 'shadow-yellow/20' },
  high: { text: 'text-orange', bg: 'bg-orange/10', border: 'border-orange/30', glow: 'shadow-orange/20' },
  pricey: { text: 'text-red', bg: 'bg-red/10', border: 'border-red/30', glow: 'shadow-red/20' },
};

const TIER_MEANING = {
  cheap: 'Esta é uma das datas mais baratas do mês — excelente oportunidade.',
  mid: 'Preço dentro da média do mês — um bom momento para voar.',
  high: 'Acima da média — considere datas próximas para economizar.',
  pricey: 'Esta é uma das datas mais caras do mês — recomendamos outro dia.',
};

const GROUP_LABEL = {
  low: 'Baixa temporada (alta procura por preço baixo)',
  medium: 'Temporada regular',
  high: 'Alta temporada / feriado',
};

export default function DetailPanel() {
  const { selectedDay, calData, month, year, originAirport, destAirport, setSelectedDay } = useApp();
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [alertEmail, setAlertEmail] = useState('');
  const [alertSent, setAlertSent] = useState(false);

  if (!selectedDay) return null;

  const entry = calData.find((d) => d.day === selectedDay);
  if (!entry) return null;

  // Stats
  const prices = calData.map((d) => d.price).filter(Boolean);
  const { q25, q60, q85 } = prices.length ? calcQuartiles(prices) : { q25: 0, q60: 0, q85: 0 };
  const tier = entry.price ? calcTier(entry.price, q25, q60, q85) : null;
  const colors = tier ? TIER_COLORS[tier] : TIER_COLORS.mid;

  const avg = prices.length ? prices.reduce((s, p) => s + p, 0) / prices.length : 0;
  const min = prices.length ? Math.min(...prices) : 0;
  const diff = avg && entry.price ? Math.round(((entry.price / avg) - 1) * 100) : 0;
  const vsMin = min && entry.price ? Math.round(((entry.price / min) - 1) * 100) : 0;

  // Estimated taxes breakdown (regulatory, approx ~15-20% of base fare in Brazil for international)
  const basePrice = entry.price;
  const estimatedTaxes = Math.round(basePrice * 0.18); // ~18% avg
  const estimatedTotal = basePrice + estimatedTaxes;

  // Date info
  const weekday = WEEKDAYS_LONG[new Date(year, month - 1, selectedDay).getDay()];
  const originCode = originAirport?.iata || '';
  const originCity = originAirport?.city || 'Origem';
  const destCode = destAirport?.iata || '';
  const destCity = destAirport?.city || 'Destino';

  function handleAlertSubmit(e) {
    e.preventDefault();
    if (!alertEmail.trim()) return;
    // TODO: send to backend /api/v1/price-alerts
    setAlertSent(true);
    setTimeout(() => {
      setShowAlertForm(false);
      setAlertSent(false);
      setAlertEmail('');
    }, 2500);
  }

  return (
    <div className="w-full animate-fadeInUp">
      {/* Header */}
      <div className="flex items-start justify-between mb-5 gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted uppercase tracking-wider mb-1">{weekday}</p>
          <h3 className="font-brico font-bold text-text text-2xl sm:text-3xl leading-tight">
            {selectedDay} de {MONTHS_PT[month]} de {year}
          </h3>
          <p className="text-sm text-muted2 mt-1">
            {originCity} <span className="text-muted">({originCode})</span>
            {' → '}
            {destCity} <span className="text-muted">({destCode})</span>
          </p>
        </div>
        <button
          onClick={() => setSelectedDay(null)}
          className="w-9 h-9 rounded-full glass border border-glass-border flex items-center justify-center text-muted hover:text-text transition-colors shrink-0"
          aria-label="Fechar detalhes"
        >
          ×
        </button>
      </div>

      {/* Price card */}
      <div className={`glass border-2 ${colors.border} rounded-2xl p-6 mb-4 shadow-lg ${colors.glow}`}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <p className="text-xs text-muted uppercase tracking-wider mb-2">Menor preço encontrado</p>
            <p className={`font-brico font-bold text-5xl ${colors.text} leading-none tabular-nums`}>
              R$ {formatPrice(basePrice)}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className={`text-xs px-2.5 py-1 rounded-full ${colors.bg} ${colors.text} font-semibold border ${colors.border}`}>
                {tierLabel(tier)}
              </span>
              {diff !== 0 && (
                <span className="text-xs text-muted">
                  {diff > 0 ? (
                    <>⬆ <span className="text-red font-medium">{diff}% acima da média</span></>
                  ) : (
                    <>⬇ <span className="text-green font-medium">{Math.abs(diff)}% abaixo da média</span></>
                  )}
                </span>
              )}
              {vsMin > 0 && (
                <span className="text-xs text-muted">
                  · R$ {formatPrice(entry.price - min)} mais caro que o menor do mês
                </span>
              )}
              {vsMin === 0 && (
                <span className="text-xs text-green font-medium">· 🏆 Melhor preço do mês</span>
              )}
            </div>
          </div>
        </div>

        <p className="text-sm text-muted2 leading-relaxed border-t border-glass-border pt-4">
          {TIER_MEANING[tier]}
        </p>
      </div>

      {/* Detailed breakdown */}
      <div className="glass border border-glass-border rounded-2xl p-5 mb-4">
        <h4 className="font-brico font-semibold text-text text-sm mb-4 flex items-center gap-2">
          <span>📊</span> Detalhamento do preço
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text">Tarifa base</p>
              <p className="text-xs text-muted2">Valor base encontrado pelo agregador</p>
            </div>
            <p className="text-sm font-medium text-text tabular-nums">R$ {formatPrice(basePrice)}</p>
          </div>

          <div className="flex items-center justify-between opacity-70">
            <div>
              <p className="text-sm text-text">Taxas e impostos (estimativa)</p>
              <p className="text-xs text-muted2">~18% sobre a tarifa base (taxa embarque, ICMS, RAV)</p>
            </div>
            <p className="text-sm font-medium text-muted2 tabular-nums">+ R$ {formatPrice(estimatedTaxes)}</p>
          </div>

          <div className="border-t border-glass-border pt-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-text">Total estimado</p>
              <p className="text-xs text-muted2">Aproximado — valor final varia por companhia</p>
            </div>
            <p className="text-base font-brico font-bold text-blue tabular-nums">R$ {formatPrice(estimatedTotal)}</p>
          </div>
        </div>
      </div>

      {/* Context info */}
      <div className="glass border border-glass-border rounded-2xl p-5 mb-4">
        <h4 className="font-brico font-semibold text-text text-sm mb-4 flex items-center gap-2">
          <span>🧭</span> Contexto da data
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Classificação</p>
            <p className="text-sm text-text font-medium capitalize">{entry.group || 'Regular'}</p>
            {entry.group && (
              <p className="text-[11px] text-muted2 mt-0.5 leading-snug">{GROUP_LABEL[entry.group] || ''}</p>
            )}
          </div>
          <div>
            <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Preço médio do mês</p>
            <p className="text-sm text-text font-medium tabular-nums">R$ {formatPrice(Math.round(avg))}</p>
            <p className="text-[11px] text-muted2 mt-0.5">Base de comparação</p>
          </div>
          <div>
            <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Menor do mês</p>
            <p className="text-sm text-green font-medium tabular-nums">R$ {formatPrice(min)}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Moeda</p>
            <p className="text-sm text-text font-medium">BRL · Real Brasileiro</p>
          </div>
        </div>
      </div>

      {/* Disclaimers — IMPORTANT */}
      <div className="glass border border-yellow/30 bg-yellow/5 rounded-2xl p-5 mb-4">
        <h4 className="font-brico font-semibold text-yellow text-sm mb-3 flex items-center gap-2">
          <span>⚠️</span> Importante sobre este preço
        </h4>
        <ul className="text-xs text-muted2 space-y-2 leading-relaxed">
          <li className="flex gap-2">
            <span className="text-yellow mt-0.5">•</span>
            <span>
              <strong className="text-text">Valor base</strong> é o menor preço encontrado no momento
              da busca em agregadores como Skyscanner. Preços aéreos são dinâmicos e podem variar
              a qualquer momento.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-yellow mt-0.5">•</span>
            <span>
              <strong className="text-text">Taxas e impostos</strong> (taxa de embarque, ICMS, IRRF, RAV)
              NÃO estão inclusos no valor exibido e serão adicionados na compra final.
              Podem representar 10% a 25% da tarifa base.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-yellow mt-0.5">•</span>
            <span>
              <strong className="text-text">Comissões de agências de turismo</strong> e companhias
              aéreas podem ser aplicadas ao finalizar a compra fora da VooGo.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-yellow mt-0.5">•</span>
            <span>
              A <strong className="text-text">VooGo não vende passagens</strong> — somos um comparador
              inteligente. O preço final, bagagem, assentos e políticas de cancelamento são
              responsabilidade da companhia aérea ou agência escolhida no checkout.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-yellow mt-0.5">•</span>
            <span>
              Preços podem variar por horário do voo, número de conexões, classe (econômica,
              executiva) e disponibilidade de assentos no momento da compra.
            </span>
          </li>
        </ul>
      </div>

      {/* CTA — Price alert */}
      <div className="glass border border-blue/30 bg-blue/5 rounded-2xl p-5">
        {!showAlertForm && !alertSent && (
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h4 className="font-brico font-semibold text-text text-base mb-1 flex items-center gap-2">
                <span>🔔</span> Seguir este preço
              </h4>
              <p className="text-xs text-muted2 leading-relaxed">
                Receba um alerta quando o preço para <strong className="text-text">{selectedDay}/{month}/{year}</strong> baixar.
                Sem spam, só quando valer a pena.
              </p>
            </div>
            <button
              onClick={() => setShowAlertForm(true)}
              className="shrink-0 px-4 py-2 rounded-xl bg-gradient-to-r from-blue to-s1 text-white text-sm font-medium shadow-md hover:opacity-90 transition-all"
            >
              Criar alerta
            </button>
          </div>
        )}

        {showAlertForm && !alertSent && (
          <form onSubmit={handleAlertSubmit} className="animate-fadeInUp">
            <h4 className="font-brico font-semibold text-text text-base mb-3 flex items-center gap-2">
              <span>🔔</span> Alerta de preço
            </h4>
            <div className="flex gap-2">
              <input
                type="email"
                required
                value={alertEmail}
                onChange={(e) => setAlertEmail(e.target.value)}
                placeholder="seu@email.com"
                className="flex-1 px-4 py-2.5 rounded-xl bg-glass border border-glass-border text-text text-sm placeholder-muted2 focus:outline-none focus:border-blue transition-colors"
                autoFocus
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue to-s1 text-white text-sm font-medium shadow-md hover:opacity-90 transition-all"
              >
                Ativar
              </button>
            </div>
            <p className="text-[11px] text-muted2 mt-2">
              Ao ativar, você concorda com a <button type="button" className="underline hover:text-text">Política de Privacidade</button>.
            </p>
          </form>
        )}

        {alertSent && (
          <div className="text-center py-2 animate-fadeInUp">
            <p className="text-green font-medium text-sm flex items-center justify-center gap-2">
              <span>✅</span> Alerta criado! Você será avisado quando o preço baixar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
