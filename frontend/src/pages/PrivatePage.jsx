import { useState, useEffect } from 'react';
import { fetchConfig } from '@/api/client';

const AIRCRAFT_OPTIONS = [
  { value: 'turboelice', label: 'Turboélice' },
  { value: 'jato_leve', label: 'Jato Leve' },
  { value: 'jato_medio', label: 'Jato Médio' },
  { value: 'jato_pesado', label: 'Jato Pesado' },
  { value: 'helicoptero', label: 'Helicóptero' },
];

const inputClass =
  'w-full bg-glass border border-glass-border rounded-xl px-4 py-3 text-text placeholder-muted2 text-sm focus:outline-none focus:border-blue/60 transition-colors';

const labelClass = 'text-xs text-muted font-medium mb-1 block';

export default function PrivatePage() {
  const [form, setForm] = useState({
    destino: '', saida: '', dataIda: '', dataVolta: '',
    passageiros: 1, aeronave: 'jato_leve', observacoes: '',
  });
  const [whatsapp, setWhatsapp] = useState('5511999999999');

  useEffect(() => {
    fetchConfig().then((cfg) => {
      if (cfg?.whatsapp) setWhatsapp(cfg.whatsapp);
    }).catch(() => {});
  }, []);

  function handleChange(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function buildMessage() {
    const aircraft = AIRCRAFT_OPTIONS.find((a) => a.value === form.aeronave)?.label || form.aeronave;
    return encodeURIComponent(
      `Olá! Gostaria de solicitar um voo particular pela VooGo.\n\n` +
      `✈ Destino: ${form.destino}\n` +
      `🛫 Saída: ${form.saida}\n` +
      `📅 Data ida: ${form.dataIda}\n` +
      `📅 Data volta: ${form.dataVolta || 'Não informada'}\n` +
      `👥 Passageiros: ${form.passageiros}\n` +
      `🛩 Aeronave: ${aircraft}\n` +
      `📝 Observações: ${form.observacoes || 'Nenhuma'}\n\n` +
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
      {/* Hero with video */}
      <section className="relative h-[380px] flex flex-col items-center justify-center overflow-hidden">
        <video
          src="/helicopter-pexels.mp4"
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/60 to-bg" />

        <div className="relative z-10 text-center px-4">
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-green/10 border border-green/20 text-green tracking-wider uppercase">
            Voos Particulares
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl font-brico font-bold text-text">
            Voe no seu{' '}
            <span className="bg-gradient-to-r from-green to-s1 bg-clip-text text-transparent">
              tempo
            </span>
          </h1>
          <p className="mt-3 text-muted max-w-md mx-auto">
            Jatos executivos, helicópteros e aeronaves charter. Viaje com conforto e flexibilidade totais.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="max-w-2xl mx-auto px-4 py-10">
        <div className="glass border border-glass-border rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="font-brico font-bold text-xl text-text">Solicitar voo particular</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Destino</label>
              <input className={inputClass} placeholder="Ex: Bonito (BYO)" value={form.destino} onChange={handleChange('destino')} />
            </div>
            <div>
              <label className={labelClass}>Saída</label>
              <input className={inputClass} placeholder="Ex: São Paulo (CGH)" value={form.saida} onChange={handleChange('saida')} />
            </div>
            <div>
              <label className={labelClass}>Data de ida</label>
              <input type="date" className={inputClass} value={form.dataIda} onChange={handleChange('dataIda')} />
            </div>
            <div>
              <label className={labelClass}>Data de volta</label>
              <input type="date" className={inputClass} value={form.dataVolta} onChange={handleChange('dataVolta')} />
            </div>
            <div>
              <label className={labelClass}>Passageiros</label>
              <input type="number" min={1} max={50} className={inputClass} value={form.passageiros} onChange={handleChange('passageiros')} />
            </div>
            <div>
              <label className={labelClass}>Aeronave preferida</label>
              <select className={inputClass} value={form.aeronave} onChange={handleChange('aeronave')}>
                {AIRCRAFT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
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

          <button
            onClick={handleWhatsApp}
            disabled={!isValid}
            className={[
              'w-full py-3.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200',
              isValid
                ? 'bg-green text-white hover:bg-green/90 shadow-md hover:shadow-lg'
                : 'bg-glass text-muted2 cursor-not-allowed border border-glass-border',
            ].join(' ')}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Solicitar via WhatsApp
          </button>

          <p className="text-xs text-muted2 text-center">
            Nossa equipe retornará em até 2 horas úteis com orçamento personalizado.
          </p>
        </div>
      </section>
    </div>
  );
}
