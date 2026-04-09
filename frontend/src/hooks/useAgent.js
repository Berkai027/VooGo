import { useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { streamAgent } from '@/api/client';

export function useAgent() {
  const {
    addMessage, updateLastAssistant, setStreaming,
    setCalData, setSmartData, setFlights,
    getAgentMessages, streaming,
  } = useApp();

  const sendMessage = useCallback(async (text, searchContext) => {
    if (streaming) return;
    setStreaming(true);

    addMessage({ id: crypto.randomUUID(), role: 'user', content: text });
    addMessage({ id: crypto.randomUUID(), role: 'assistant', content: '' });

    try {
      const history = getAgentMessages();
      const agentMessages = [...history, { role: 'user', content: text }];

      for await (const event of streamAgent(agentMessages, searchContext)) {
        switch (event.type) {
          case 'text':
            updateLastAssistant(event.data.content);
            break;
          case 'calendar_data':
            setCalData(event.data.days || []);
            setSmartData(event.data);
            break;
          case 'flights_data':
            setFlights(event.data);
            break;
          case 'done':
            if (event.data.assistantContent) {
              const textParts = (event.data.assistantContent)
                .filter(b => b.type === 'text')
                .map(b => b.text)
                .join('');
              const cleaned = textParts
                .replace(/<calendar_data>[\s\S]*?<\/calendar_data>/g, '')
                .replace(/<flights_data>[\s\S]*?<\/flights_data>/g, '')
                .trim();
              if (cleaned) updateLastAssistant(cleaned);
            }
            break;
          case 'error':
            updateLastAssistant(event.data.message || 'Erro ao processar.');
            break;
        }
      }
    } catch (err) {
      updateLastAssistant(err.message || 'Erro de conexão.');
    } finally {
      setStreaming(false);
    }
  }, [streaming, addMessage, updateLastAssistant, setStreaming, setCalData, setSmartData, setFlights, getAgentMessages]);

  return { sendMessage, streaming };
}
