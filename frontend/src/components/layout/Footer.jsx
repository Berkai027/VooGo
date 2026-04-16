export default function Footer({ onOpenLegal }) {
  return (
    <footer className="border-t border-glass-border bg-bg mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="text-lg font-brico font-bold bg-gradient-to-r from-blue to-s1 bg-clip-text text-transparent">
            ✈ VooGo
          </span>
          <p className="text-xs text-muted2">Sua jornada começa aqui.</p>
        </div>

        {/* Links */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-sm text-muted">
          <button
            onClick={() => onOpenLegal?.('termos')}
            className="hover:text-text transition-colors"
          >
            Termos de Uso
          </button>
          <button
            onClick={() => onOpenLegal?.('privacidade')}
            className="hover:text-text transition-colors"
          >
            Política de Privacidade
          </button>
          <button
            onClick={() => onOpenLegal?.('sobre')}
            className="hover:text-text transition-colors"
          >
            Quem Somos
          </button>
        </div>

        {/* Copyright */}
        <p className="text-xs text-muted2">
          © {new Date().getFullYear()} VooGo. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
