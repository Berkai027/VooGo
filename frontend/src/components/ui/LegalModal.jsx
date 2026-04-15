import { useEffect } from 'react';

const CONTENT = {
  termos: {
    title: 'Termos de Uso',
    body: `
**1. Aceitação dos Termos**
Ao usar a plataforma VooGo, você concorda com estes Termos de Uso. Se não concordar, não utilize o serviço.

**2. Descrição do Serviço**
A VooGo é uma plataforma de busca e comparação de passagens aéreas, tanto em voos comerciais quanto em voos privados/charter. Atuamos como intermediária, facilitando o contato entre passageiros e companhias aéreas ou operadores de aeronaves.

**3. Uso do Serviço**
Você concorda em usar a plataforma apenas para fins legais e pessoais. É proibido usar a VooGo para qualquer atividade ilícita, incluindo fraude ou violação de direitos de terceiros.

**4. Preços e Disponibilidade**
Os preços exibidos são estimativas obtidas de fontes públicas e parceiros. A VooGo não garante a exatidão nem a disponibilidade das tarifas no momento da reserva.

**5. Limitação de Responsabilidade**
A VooGo não se responsabiliza por cancelamentos, atrasos, mudanças de rota ou qualquer outro evento sob responsabilidade das companhias aéreas.

**6. Propriedade Intelectual**
Todo o conteúdo da plataforma VooGo, incluindo textos, gráficos e software, é propriedade da VooGo e protegido por leis de direitos autorais.

**7. Alterações**
Reservamo-nos o direito de alterar estes termos a qualquer momento. Notificaremos os usuários por meio do site.

**8. Contato**
Para dúvidas: contato@voogo.io
    `.trim(),
  },
  privacidade: {
    title: 'Política de Privacidade',
    body: `
**1. Dados Coletados**
Coletamos dados de navegação (como origem, destino, datas de pesquisa) e, quando fornecidos, dados de contato para voos privados (nome, telefone).

**2. Uso dos Dados**
Os dados são usados para melhorar a experiência de busca, personalizar sugestões e, no caso de voos privados, transmitir sua solicitação à equipe comercial.

**3. Cookies**
Utilizamos cookies essenciais para o funcionamento do site e cookies analíticos (Google Analytics) para entender o uso da plataforma. Você pode recusar cookies não essenciais.

**4. Compartilhamento**
Não vendemos seus dados. Podemos compartilhar informações com parceiros operacionais exclusivamente para concluir solicitações de voos privados.

**5. Retenção**
Dados de navegação anônimos são retidos por até 24 meses. Dados de contato são retidos enquanto necessário para a prestação do serviço.

**6. Seus Direitos**
Você tem direito a acessar, corrigir ou excluir seus dados pessoais. Entre em contato: privacidade@voogo.io

**7. Segurança**
Adotamos medidas técnicas e organizacionais para proteger seus dados contra acesso não autorizado.

**8. Contato DPO**
privacidade@voogo.io
    `.trim(),
  },
};

function renderBody(text) {
  return text.split('\n\n').map((para, i) => {
    if (para.startsWith('**') && para.includes('**\n')) {
      const [title, ...rest] = para.split('\n');
      const cleanTitle = title.replace(/\*\*/g, '');
      return (
        <div key={i} className="mb-4">
          <h3 className="font-brico font-bold text-text mb-1">{cleanTitle}</h3>
          <p className="text-sm text-muted leading-relaxed">{rest.join(' ')}</p>
        </div>
      );
    }
    return <p key={i} className="text-sm text-muted leading-relaxed mb-4">{para}</p>;
  });
}

export default function LegalModal({ type, onClose }) {
  const content = CONTENT[type];

  useEffect(() => {
    function handleKey(e) { if (e.key === 'Escape') onClose?.(); }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!content) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <div className="glass border border-glass-border rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl animate-fadeInUp">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-glass-border">
          <h2 className="font-brico font-bold text-xl text-text">{content.title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full glass border border-glass-border flex items-center justify-center text-muted hover:text-text transition-colors text-lg"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-5 flex-1">
          {renderBody(content.body)}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-glass-border">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-blue text-white font-medium text-sm hover:bg-blue/90 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
