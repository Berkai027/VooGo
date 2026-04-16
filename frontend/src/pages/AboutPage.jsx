const CARDS = [
  {
    icon: '✈️',
    title: 'Voos Comerciais',
    desc: 'Comparamos preços em tempo real para encontrar as melhores tarifas nas principais companhias aéreas do mundo.',
  },
  {
    icon: '🚁',
    title: 'Voos Privados',
    desc: 'Conectamos você a operadores de jatos executivos, helicópteros e aeronaves charter para viagens sob medida.',
  },
  {
    icon: '📊',
    title: 'Inteligência de Preços',
    desc: 'Nossa IA analisa histórico de tarifas e identifica o melhor momento para comprar sua passagem.',
  },
  {
    icon: '🌎',
    title: 'Destinos Globais',
    desc: 'De destinos nacionais a rotas internacionais, cobrimos aeroportos em mais de 50 países.',
  },
];

const ABOUT_PARAS = [
  'A VooGo nasceu da crença de que viajar deveria ser simples, transparente e acessível. Fundada em 2025, somos uma plataforma brasileira que combina tecnologia de ponta com inteligência artificial para oferecer a melhor experiência de busca de voos do mercado.',
  'Para voos comerciais, nossa IA analisa dados de preços em tempo real e exibe um calendário visual que mostra quando é mais barato voar — sem complicação. Para voos privados, atuamos como intermediária entre clientes e operadores certificados, garantindo conforto, flexibilidade e segurança.',
  'Acreditamos que a democratização do transporte aéreo passa por informação clara e ferramentas inteligentes. É com esse propósito que trabalhamos todos os dias para fazer a VooGo a escolha certa para quem quer voar bem.',
];

export default function AboutPage() {
  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 py-16">
      {/* Title */}
      <div className="text-center mb-12">
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue/10 border border-blue/20 text-blue tracking-wider uppercase">
          Nossa história
        </span>
        <h1 className="mt-4 text-4xl sm:text-5xl font-brico font-bold text-text">
          Quem é a{' '}
          <span className="bg-gradient-to-r from-blue to-s1 bg-clip-text text-transparent">
            VooGo?
          </span>
        </h1>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        {CARDS.map((card) => (
          <div
            key={card.title}
            className="glass border border-glass-border rounded-2xl p-5 flex flex-col gap-3 hover:border-blue/30 transition-colors"
          >
            <span className="text-3xl">{card.icon}</span>
            <h3 className="font-brico font-bold text-text text-lg">{card.title}</h3>
            <p className="text-sm text-muted leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* About paragraphs */}
      <div className="glass border border-glass-border rounded-2xl p-8 flex flex-col gap-5">
        <h2 className="font-brico font-bold text-2xl text-text">Nossa missão</h2>
        {ABOUT_PARAS.map((p, i) => (
          <p key={i} className="text-muted leading-relaxed text-sm">{p}</p>
        ))}

        <div className="pt-4 border-t border-glass-border">
          <p className="text-xs text-muted2">Dúvidas ou parcerias?</p>
          <a href="mailto:contato@voogo.io" className="text-blue text-sm hover:underline">
            contato@voogo.io
          </a>
        </div>
      </div>
    </div>
  );
}
