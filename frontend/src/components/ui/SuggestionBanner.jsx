import { useApp } from '@/context/AppContext';
import { useAgent } from '@/hooks/useAgent';
import { formatPrice } from '@/utils/format';

export default function SuggestionBanner() {
  const { smartData, month, year, origin, dest, setSelectedDay } = useApp();
  const { sendMessage, streaming } = useAgent();

  if (!smartData?.best_day) return null;

  const { best_day, best_airline, economy_pct, best_price } = smartData;

  function handleView() {
    if (streaming) return;
    setSelectedDay(best_day);
    const searchContext = { origin, destination: dest, year, month, day: best_day };
    sendMessage(
      `Mostrar voos do dia ${best_day}/${month}/${year}`,
      searchContext,
    );
  }

  return (
    <div className="w-full glass border border-blue/30 bg-blue/5 rounded-2xl px-5 py-4 flex items-center gap-4 animate-fadeInUp">
      <span className="text-2xl shrink-0">💡</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text">
          Melhor dia para voar:{' '}
          <span className="text-blue font-bold">dia {best_day}</span>
          {best_airline && (
            <> com a <span className="font-semibold">{best_airline}</span></>
          )}
          {economy_pct != null && (
            <> — economize até{' '}
              <span className="text-green font-bold">{economy_pct}%</span>
            </>
          )}
        </p>
        {best_price != null && (
          <p className="text-xs text-muted mt-0.5">
            A partir de <span className="text-text font-medium">R$ {formatPrice(best_price)}</span>
          </p>
        )}
      </div>
      <button
        onClick={handleView}
        disabled={streaming}
        className="shrink-0 px-4 py-2 rounded-xl bg-blue text-white text-sm font-medium hover:bg-blue/90 disabled:opacity-50 transition-all"
      >
        Ver voos →
      </button>
    </div>
  );
}
