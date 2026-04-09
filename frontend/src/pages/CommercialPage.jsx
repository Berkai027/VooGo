import { useApp } from '@/context/AppContext';
import ParticleCanvas from '@/components/ui/ParticleCanvas';
import SearchBox from '@/components/ui/SearchBox';
import ChatSection from '@/components/ui/ChatSection';
import SuggestionBanner from '@/components/ui/SuggestionBanner';
import SummaryCards from '@/components/ui/SummaryCards';
import Legend from '@/components/ui/Legend';
import MonthNav from '@/components/ui/MonthNav';
import CalendarGrid from '@/components/ui/CalendarGrid';
import DetailPanel from '@/components/ui/DetailPanel';

export default function CommercialPage() {
  const { calData, streaming } = useApp();
  const hasResults = calData.length > 0;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[480px] flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(61,126,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(61,126,255,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Particle canvas */}
        <ParticleCanvas />

        {/* Glow elements */}
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-s1/10 rounded-full blur-3xl pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-2xl text-center">
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue/10 border border-blue/20 text-blue tracking-wider uppercase">
            Voos Comerciais
          </span>

          <h1 className="text-4xl sm:text-5xl font-brico font-bold text-text leading-tight">
            Para onde você quer{' '}
            <span className="bg-gradient-to-r from-blue to-s1 bg-clip-text text-transparent">
              voar?
            </span>
          </h1>

          <p className="text-muted max-w-md text-base">
            Busque passagens aéreas e veja quando é mais barato voar. Nossa IA encontra as melhores datas e preços para você.
          </p>

          <SearchBox />
        </div>
      </section>

      {/* Chat section */}
      <div className="max-w-2xl mx-auto px-4">
        <ChatSection />
      </div>

      {/* Loading bar when streaming */}
      {streaming && (
        <div className="max-w-2xl mx-auto px-4 mt-2">
          <div className="h-0.5 bg-glass rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue to-s1 animate-loadbar rounded-full" />
          </div>
        </div>
      )}

      {/* Results */}
      {hasResults && (
        <section className="max-w-4xl mx-auto px-4 py-10 flex flex-col gap-6 animate-fadeInUp">
          <SuggestionBanner />
          <SummaryCards />

          <div className="glass border border-glass-border rounded-2xl p-6 flex flex-col gap-5">
            <MonthNav />
            <Legend />
            <CalendarGrid />
          </div>

          <DetailPanel />
        </section>
      )}
    </div>
  );
}
