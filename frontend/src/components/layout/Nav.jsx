import { useApp } from '@/context/AppContext';

const TABS = [
  { id: 'comercial', label: 'Voos Comerciais', short: 'Comercial', accent: 'blue' },
  { id: 'particular', label: 'Voos Privados', short: 'Privado', accent: 'green' },
  { id: 'sobre', label: 'Quem Somos', short: 'Sobre', accent: 'blue' },
];

const ACTIVE_STYLES = {
  blue: 'bg-blue text-white shadow-md shadow-blue/20',
  green: 'bg-green text-white shadow-md shadow-green/20',
};

export default function Nav() {
  const { activeTab, setActiveTab } = useApp();
  const isPrivate = activeTab === 'particular';

  const logoGradient = isPrivate
    ? 'from-green to-green/50'
    : 'from-blue to-s1';

  return (
    <nav className="sticky top-0 z-50 glass border-b border-glass-border backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Logo */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <span className="text-xl sm:text-2xl">✈</span>
          <span className={`text-lg sm:text-xl font-brico font-bold bg-gradient-to-r ${logoGradient} bg-clip-text text-transparent transition-all duration-500`}>
            VooGo
          </span>
          {/* Live badge — hidden on small screens to save space */}
          <span className="hidden sm:flex items-center gap-1 ml-2 px-2 py-0.5 rounded-full bg-green/10 border border-green/30 text-green text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
            ao vivo
          </span>
        </div>

        {/* Tab buttons */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={[
                  'px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap',
                  isActive
                    ? ACTIVE_STYLES[tab.accent]
                    : 'text-muted hover:text-text hover:bg-glass',
                ].join(' ')}
              >
                <span className="sm:hidden">{tab.short}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
