import { useState, useEffect } from 'react';
import { fetchConfig } from '@/api/client';

const AIRCRAFT_OPTIONS = [
  { value: 'turboelice', label: 'Turboélice', icon: '🛩️', desc: 'Até 9 pax · curto alcance' },
  { value: 'jato_leve', label: 'Jato Leve', icon: '✈️', desc: 'Até 7 pax · médio alcance' },
  { value: 'jato_medio', label: 'Jato Médio', icon: '🛫', desc: 'Até 9 pax · longo alcance' },
  { value: 'jato_pesado', label: 'Jato Pesado', icon: '🛬', desc: 'Até 18 pax · intercontinental' },
  { value: 'helicoptero', label: 'Helicóptero', icon: '🚁', desc: 'Até 6 pax · voos urbanos' },
  { value: 'sugestao', label: 'Escolha pra mim', icon: '✨', desc: 'Recomendamos a melhor opção' },
];

const inputClass =
  'w-full bg-glass border border-glass-border rounded-xl px-4 py-3 text-text placeholder-muted2 text-sm focus:outline-none focus:border-green/60 focus:ring-2 focus:ring-green/20 transition-all';

const labelClass = 'text-xs text-muted font-medium mb-1 block';

export default function PrivatePage() {
  const [form, setForm] = useState({
    destino: '', saida: '', dataIda: '', dataVolta: '',
    passageiros: 1, aeronave: 'jato_leve', observacoes: '',
  });
  const [tripType, setTripType] = useState('roundtrip'); // 'roundtrip' | 'oneway'
  const [whatsapp, setWhatsapp] = useState('5555997044152');

  useEffect(() => {
    fetchConfig().then((cfg) => {
      if (cfg?.whatsappNumber) setWhatsapp(cfg.whatsappNumber);
    }).catch(() => {});
  }, []);

  function handleChange(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function buildMessage() {
    const aircraft = AIRCRAFT_OPTIONS.find((a) => a.value === form.aeronave)?.label || form.aeronave;
    const tripLine = tripType === 'oneway'
      ? `🎫 *Tipo:* Apenas ida\n📅 *Data:* ${form.dataIda}\n`
      : `🎫 *Tipo:* Ida e volta\n📅 *Data ida:* ${form.dataIda}\n📅 *Data volta:* ${form.dataVolta || 'A definir'}\n`;

    return encodeURIComponent(
      `Olá! Gostaria de solicitar um voo privado pela VooGo 🛩️\n\n` +
      `🛫 *Saída:* ${form.saida}\n` +
      `✈ *Destino:* ${form.destino}\n` +
      tripLine +
      `👥 *Passageiros:* ${form.passageiros}\n` +
      `🛩 *Aeronave:* ${aircraft}\n` +
      `📝 *Observações:* ${form.observacoes || 'Nenhuma'}\n\n` +
      `Aguardo o contato. Obrigado!`
    );
  }

  function handleWhatsApp() {
    const msg = buildMessage();
    window.open(`https://wa.me/${whatsapp}?text=${msg}`, '_blank');
  }

  const isValid = form.destino && form.saida && form.dataIda;

  return (
    <div className="min-h-screen">
      {/* Hero with helicopter video */}
      <section className="relative h-[480px] sm:h-[520px] flex flex-col items-center justify-center overflow-hidden">
        <video
          src="/helicopter-bg.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
          aria-hidden="true"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg/70 via-bg/40 to-bg" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/30 via-transparent to-bg/30" />

        {/* Glow accent */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-green/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 text-center px-4 max-w-2xl">
          <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-green/10 border border-green/30 text-green tracking-wider uppercase shadow-lg shadow-green/10">
            <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
            Voos Privados
          </span>
          <h1 className="mt-5 text-4xl sm:text-6xl font-brico font-bold text-text leading-tight">
            Voe no seu{' '}
            <span className="bg-gradient-to-r from-green via-green/80 to-green/50 bg-clip-text text-transparent">
              tempo
            </span>
          </h1>
          <p className="mt-4 text-muted2 max-w-md mx-auto text-base leading-relaxed">
            Jatos executivos, helicópteros e aeronaves charter. Viaje com conforto e flexibilidade totais.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="max-w-2xl mx-auto px-4 py-10 -mt-16 relative z-20">
        <div className="glass border border-green/20 rounded-2xl p-6 shadow-2xl shadow-green/5 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-green text-xl" aria-hidden="true">🛩️</span>
            <h2 className="font-brico font-bold text-xl text-text">Solicitar voo privado</h2>
          </div>

          {/* Trip type toggle */}
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-glass border border-glass-border self-start">
            <button
              type="button"
              onClick={() => setTripType('roundtrip')}
              className={[
                'px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200',
                tripType === 'roundtrip'
                  ? 'bg-green text-bg shadow-sm'
                  : 'text-muted hover:text-text',
              ].join(' ')}
            >
              Ida e volta
            </button>
            <button
              type="button"
              onClick={() => {
                setTripType('oneway');
                setForm((f) => ({ ...f, dataVolta: '' }));
              }}
              className={[
                'px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200',
                tripType === 'oneway'
                  ? 'bg-green text-bg shadow-sm'
                  : 'text-muted hover:text-text',
              ].join(' ')}
            >
              Apenas ida
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Saída</label>
              <input className={inputClass} placeholder="Ex: São Paulo (CGH)" value={form.saida} onChange={handleChange('saida')} />
            </div>
            <div>
              <label className={labelClass}>Destino</label>
              <input className={inputClass} placeholder="Ex: Angra dos Reis (AIA)" value={form.destino} onChange={handleChange('destino')} />
            </div>
            <div className={tripType === 'oneway' ? 'sm:col-span-2' : ''}>
              <label className={labelClass}>
                {tripType === 'oneway' ? 'Data do voo' : 'Data de ida'}
              </label>
              <input type="date" className={inputClass} value={form.dataIda} onChange={handleChange('dataIda')} />
            </div>
            {tripType === 'roundtrip' && (
              <div>
                <label className={labelClass}>Data de volta</label>
                <input type="date" className={inputClass} value={form.dataVolta} onChange={handleChange('dataVolta')} />
              </div>
            )}
            <div className="sm:col-span-2">
              <label className={labelClass}>Passageiros</label>
              <div className="flex items-center gap-3 bg-glass border border-glass-border rounded-xl px-3 py-2 focus-within:border-green/60 focus-within:ring-2 focus-within:ring-green/20 transition-all">
                {/* Decrement */}
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, passageiros: Math.max(1, (parseInt(f.passageiros) || 1) - 1) }))}
                  disabled={parseInt(form.passageiros) <= 1}
                  className="shrink-0 w-10 h-10 rounded-lg border border-glass-border bg-white/[0.03] hover:bg-green/10 hover:border-green/40 hover:text-green text-muted text-lg font-bold transition-all flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/[0.03] disabled:hover:border-glass-border disabled:hover:text-muted active:scale-95"
                  aria-label="Menos um passageiro"
                >
                  −
                </button>

                {/* Value display */}
                <div className="flex-1 flex items-center justify-center gap-2">
                  <span className="text-text font-brico font-bold text-2xl tabular-nums">
                    {form.passageiros || 1}
                  </span>
                  <span className="text-muted2 text-sm">
                    {parseInt(form.passageiros) === 1 ? 'passageiro' : 'passageiros'}
                  </span>
                </div>

                {/* Increment */}
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, passageiros: Math.min(50, (parseInt(f.passageiros) || 1) + 1) }))}
                  disabled={parseInt(form.passageiros) >= 50}
                  className="shrink-0 w-10 h-10 rounded-lg border border-glass-border bg-white/[0.03] hover:bg-green/10 hover:border-green/40 hover:text-green text-muted text-lg font-bold transition-all flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                  aria-label="Mais um passageiro"
                >
                  +
                </button>
              </div>
              <p className="text-[11px] text-muted2 mt-1.5 ml-1">
                Mínimo 1 · máximo 50 passageiros
              </p>
            </div>
          </div>

          {/* Aeronave — chip selector (custom, replaces ugly native select) */}
          <div>
            <label className={labelClass}>Aeronave preferida</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AIRCRAFT_OPTIONS.map((opt) => {
                const selected = form.aeronave === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, aeronave: opt.value }))}
                    className={[
                      'group relative flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all duration-200',
                      selected
                        ? 'bg-green/10 border-green/50 shadow-[0_0_0_1px_rgba(0,214,143,0.3),0_8px_24px_rgba(0,214,143,0.15)]'
                        : 'bg-glass border-glass-border hover:border-green/30 hover:bg-green/5',
                    ].join(' ')}
                    aria-pressed={selected}
                  >
                    {/* Check mark when selected */}
                    {selected && (
                      <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-green flex items-center justify-center text-bg text-xs font-bold shadow-sm" aria-hidden="true">
                        ✓
                      </span>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-lg" aria-hidden="true">{opt.icon}</span>
                      <span className={`font-semibold text-sm ${selected ? 'text-green' : 'text-text'}`}>
                        {opt.label}
                      </span>
                    </div>
                    <span className="text-[11px] text-muted2 leading-tight">{opt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className={labelClass}>Observações</label>
            <textarea
              className={`${inputClass} resize-none`}
              rows={3}
              placeholder="Informações adicionais, preferências, rota alternativa..."
              value={form.observacoes}
              onChange={handleChange('observacoes')}
            />
          </div>

          {/* CTA — Solicitar via WhatsApp (same design as DetailPanel) */}
          <button
            onClick={handleWhatsApp}
            disabled={!isValid}
            className={[
              'group relative overflow-hidden rounded-2xl transition-all duration-300',
              isValid
                ? 'bg-gradient-to-r from-[#25D366] via-[#20BC5A] to-[#128C7E] shadow-[0_8px_32px_rgba(37,211,102,0.35)] hover:shadow-[0_12px_40px_rgba(37,211,102,0.5)] hover:-translate-y-0.5 active:translate-y-0'
                : 'bg-glass border border-glass-border cursor-not-allowed',
            ].join(' ')}
            aria-label="Solicitar cotação via WhatsApp"
          >
            {/* Shine */}
            {isValid && (
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
            )}

            <div className="relative flex items-center gap-4 px-6 py-5">
              <div className={[
                'shrink-0 w-12 h-12 rounded-full flex items-center justify-center border',
                isValid ? 'bg-white/15 backdrop-blur-sm border-white/20' : 'bg-glass border-glass-border',
              ].join(' ')}>
                <svg className={`w-7 h-7 ${isValid ? 'text-white' : 'text-muted2'}`} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
                </svg>
              </div>

              <div className="flex-1 text-left min-w-0">
                <p className={`text-[11px] font-medium uppercase tracking-wider leading-tight ${isValid ? 'text-white/80' : 'text-muted2'}`}>
                  Cotação em até 2 horas úteis
                </p>
                <p className={`font-brico font-bold text-xl leading-tight mt-0.5 ${isValid ? 'text-white' : 'text-muted2'}`}>
                  Solicitar via WhatsApp
                </p>
              </div>

              <span className={`shrink-0 text-2xl font-bold transition-transform duration-300 ${isValid ? 'text-white group-hover:translate-x-1' : 'text-muted2'}`} aria-hidden="true">
                →
              </span>
            </div>
          </button>

          <p className="text-xs text-muted2 text-center flex items-center justify-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
            Atendimento humano · sem robô · resposta em minutos
          </p>
        </div>
      </section>
    </div>
  );
}
