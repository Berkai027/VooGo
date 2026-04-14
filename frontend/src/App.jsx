import { useState } from 'react';
import { AppProvider } from '@/context/AppContext';
import { useApp } from '@/context/AppContext';

import LoadingScreen from '@/components/ui/LoadingScreen';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import CookieBanner from '@/components/layout/CookieBanner';
import LegalModal from '@/components/ui/LegalModal';

import CommercialPage from '@/pages/CommercialPage';
import PrivatePage from '@/pages/PrivatePage';
import AboutPage from '@/pages/AboutPage';

function AppContent() {
  const { activeTab } = useApp();
  const [loading, setLoading] = useState(true);
  const [legalType, setLegalType] = useState(null);

  function handleOpenLegal(type) {
    if (type === 'sobre') {
      // Navigate to about tab instead of modal
      return;
    }
    setLegalType(type);
  }

  if (loading) {
    return <LoadingScreen onDone={() => setLoading(false)} />;
  }

  return (
    <div className="min-h-screen bg-bg text-text">
      <a href="#main" className="skip-link">Pular para o conteúdo</a>
      <Nav />

      <main id="main">
        {activeTab === 'comercial' && <CommercialPage />}
        {activeTab === 'particular' && <PrivatePage />}
        {activeTab === 'sobre' && <AboutPage />}
      </main>

      <Footer onOpenLegal={handleOpenLegal} />
      <CookieBanner onOpenLegal={handleOpenLegal} />

      {legalType && (
        <LegalModal type={legalType} onClose={() => setLegalType(null)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
