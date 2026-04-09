import { useState, useEffect } from 'react';

const STORAGE_KEY = 'voogo_cookies';

export default function CookieBanner({ onOpenLegal }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, 'declined');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-3xl mx-auto glass border border-glass-border rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center gap-4 shadow-2xl">
        <p className="text-sm text-muted flex-1">
          🍪 Usamos cookies para melhorar sua experiência.{' '}
          <button
            onClick={() => onOpenLegal?.('privacidade')}
            className="text-blue underline hover:no-underline"
          >
            Saiba mais
          </button>
          .
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={decline}
            className="px-4 py-1.5 rounded-lg text-sm text-muted hover:text-text border border-glass-border hover:border-muted transition-all"
          >
            Recusar
          </button>
          <button
            onClick={accept}
            className="px-4 py-1.5 rounded-lg text-sm font-medium bg-blue text-white hover:bg-blue/90 transition-all"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
