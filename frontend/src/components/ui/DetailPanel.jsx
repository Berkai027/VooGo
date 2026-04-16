import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { formatPrice, tierLabel, calcTier, calcQuartiles } from '@/utils/format';
import { MONTHS_PT } from '@/data/constants';
import { fetchConfig } from '@/api/client';

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
  low: 'Baixa temporada',
  medium: 'Temporada regular',
  high: 'Alta temporada / feriado',
};

/**
 * Reusable accordion section — compact
 */
function Accordion({ icon, title, children, defaultOpen = false, badge = null, variant = 'default' }) {
  const [open, setOpen] = useState(defaultOpen);

  const variantClass = variant === 'warning'
    ? 'border-yellow/20 bg-yellow/[0.03]'
    : 'border-glass-border/60 bg-white/[0.02]';

  const titleColor = variant === 'warning' ? 'text-yellow/90' : 'text-muted';

  return (
    <div className={`border ${variantClass} rounded-xl overflow-hidden mb-2`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-2.5 flex items-center justify-between gap-3 hover:bg-white/[0.03] transition-colors"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs shrink-0 opacity-70" aria-hidden="true">{icon}</span>
          <h4 className={`font-medium text-xs ${titleColor}`}>
            {title}
          </h4>
          {badge}
        </div>
        <span className={`text-sm shrink-0 transition-transform duration-300 ${open ? 'rotate-45' : ''} ${titleColor} opacity-60`} aria-hidden="true">
          +
        </span>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 animate-fadeInUp">
          {children}
        </div>
      )}
    </div>
  );
}

export default function DetailPanel() {
  const { selectedDay, calData, month, year, originAirport, destAirport, setSelectedDay } = useApp();
  const [whatsappNumber, setWhatsappNumber] = useState(null);

  useEffect(() => {
    fetchConfig().then((cfg) => setWhatsappNumber(cfg?.whatsappNumber)).catch(() => {});
  }, []);

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

  const basePrice = entry.price;
  const estimatedTaxes = Math.round(basePrice * 0.18);
  const estimatedTotal = basePrice + estimatedTaxes;

  // Date info
  const weekday = WEEKDAYS_LONG[new Date(year, month - 1, selectedDay).getDay()];
  const originCode = originAirport?.iata || '';
  const originCity = originAirport?.city || 'Origem';
  const destCode = destAirport?.iata || '';
  const destCity = destAirport?.city || 'Destino';

  // Format date as DD/MM/YYYY
  const dateFmt = `${String(selectedDay).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;

  function handleWhatsAppBuy() {
    if (!whatsappNumber) return;
    const phone = whatsappNumber;
    const searchId = `VG-${year}${String(month).padStart(2, '0')}${String(selectedDay).padStart(2, '0')}-${originCode}${destCode}-${Date.now().toString().slice(-5)}`;

    const message = `Olá! Quero comprar uma passagem pela VooGo 🛫

*Busca #${searchId}*

📍 *Origem:* ${originCity} (${originCode})
📍 *Destino:* ${destCity} (${destCode})
📅 *Data:* ${dateFmt} (${weekday})

💰 *Preço encontrado:* R$ ${formatPrice(basePrice)}
📊 *Classificação:* ${tierLabel(tier)} (${diff < 0 ? `${Math.abs(diff)}% abaixo` : `${diff}% acima`} da média do mês)
💵 *Total estimado com taxas:* R$ ${formatPrice(estimatedTotal)}

Pode me ajudar a finalizar a reserva?`;

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${phone}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');

    // GA4 event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'buy_click', {
        origin: originCode,
        destination: destCode,
        date: dateFmt,
        price: basePrice,
        tier,
      });
    }
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

      {/* Price card (always visible, destaque) */}
      <div className={`glass border-2 ${colors.border} rounded-2xl p-6 mb-4 shadow-lg ${colors.glow}`}>
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
              {diff > 0
                ? <>⬆ <span className="text-red font-medium">{diff}% acima da média</span></>
                : <>⬇ <span className="text-green font-medium">{Math.abs(diff)}% abaixo da média</span></>}
            </span>
          )}
          {basePrice === min && (
            <span className="text-xs text-green font-medium">· 🏆 Melhor preço do mês</span>
          )}
        </div>
        <p className="text-sm text-muted2 leading-relaxed border-t border-glass-border pt-4 mt-4">
          {TIER_MEANING[tier]}
        </p>
      </div>

      {/* CTA principal — Comprar agora via WhatsApp */}
      <button
        onClick={handleWhatsAppBuy}
        className="group w-full mb-4 relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#25D366] via-[#20BC5A] to-[#128C7E] shadow-[0_8px_32px_rgba(37,211,102,0.35)] hover:shadow-[0_12px_40px_rgba(37,211,102,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
        aria-label="Comprar agora via WhatsApp"
      >
        {/* Shine effect on hover */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

        <div className="relative flex items-center gap-4 px-6 py-5">
          {/* Icon circle */}
          <div className="shrink-0 w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
            </svg>
          </div>

          {/* Text block */}
          <div className="flex-1 text-left min-w-0">
            <p className="text-[11px] text-white/80 font-medium uppercase tracking-wider leading-tight">
              Atendimento direto via WhatsApp
            </p>
            <p className="text-white font-brico font-bold text-xl leading-tight mt-0.5">
              Comprar agora
            </p>
          </div>

          {/* Arrow */}
          <span className="shrink-0 text-white text-2xl font-bold transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
            →
          </span>
        </div>
      </button>

      {/* Trust line below button */}
      <p className="text-center text-[11px] text-muted2 mb-5 flex items-center justify-center gap-1.5">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
        Atendimento humano · sem robô · resposta em minutos
      </p>

      {/* Accordion: Detalhamento do preço */}
      <Accordion icon="💰" title="Como este preço é calculado" defaultOpen={false}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm text-text">Tarifa base</p>
              <p className="text-xs text-muted2">Valor base encontrado pelo agregador</p>
            </div>
            <p className="text-sm font-medium text-text tabular-nums shrink-0 ml-3">R$ {formatPrice(basePrice)}</p>
          </div>

          <div className="flex items-center justify-between opacity-80">
            <div className="min-w-0 flex-1">
              <p className="text-sm text-text">Taxas e impostos (estimativa)</p>
              <p className="text-xs text-muted2">~18% sobre a tarifa base · embarque, ICMS, RAV</p>
            </div>
            <p className="text-sm font-medium text-muted2 tabular-nums shrink-0 ml-3">+ R$ {formatPrice(estimatedTaxes)}</p>
          </div>

          <div className="border-t border-glass-border pt-3 flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-text">Total estimado</p>
              <p className="text-xs text-muted2">Aproximado · valor final varia por companhia</p>
            </div>
            <p className="text-base font-brico font-bold text-blue tabular-nums shrink-0 ml-3">R$ {formatPrice(estimatedTotal)}</p>
          </div>
        </div>
      </Accordion>

      {/* Accordion: Disclaimers importantes */}
      <Accordion
        icon="⚠"
        title="Importante antes de comprar"
        variant="warning"
        badge={<span className="text-[9px] px-1.5 py-0.5 rounded-full bg-yellow/15 text-yellow/80 font-medium uppercase tracking-wider">Leia</span>}
      >
        <ul className="text-xs text-muted2 space-y-2.5 leading-relaxed">
          <li className="flex gap-2">
            <span className="text-yellow mt-0.5 shrink-0">•</span>
            <span>
              <strong className="text-text">Valor base</strong> é o menor preço encontrado no momento
              da busca em agregadores como Skyscanner. Preços aéreos são dinâmicos e podem variar
              a qualquer momento.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-yellow mt-0.5 shrink-0">•</span>
            <span>
              <strong className="text-text">Taxas e impostos</strong> (taxa de embarque, ICMS, IRRF, RAV)
              NÃO estão inclusos no valor base exibido. Podem representar 10% a 25% da tarifa.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-yellow mt-0.5 shrink-0">•</span>
            <span>
              <strong className="text-text">Comissões</strong> de agências de turismo e companhias
              aéreas podem ser aplicadas ao finalizar a compra.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-yellow mt-0.5 shrink-0">•</span>
            <span>
              A <strong className="text-text">VooGo não vende passagens diretamente</strong> — somos um
              comparador inteligente. A venda final é intermediada pelo atendimento via WhatsApp.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-yellow mt-0.5 shrink-0">•</span>
            <span>
              Preços podem variar por horário do voo, número de conexões, classe (econômica,
              executiva) e disponibilidade de assentos no momento da compra.
            </span>
          </li>
        </ul>
      </Accordion>
    </div>
  );
}
