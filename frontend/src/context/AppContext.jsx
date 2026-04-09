import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const now = new Date();
  const [origin, setOrigin] = useState('São Paulo (GRU)');
  const [dest, setDest] = useState('');
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [calData, setCalData] = useState([]);
  const [smartData, setSmartData] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [messages, setMessages] = useState([]);
  const [streaming, setStreaming] = useState(false);
  const [flights, setFlights] = useState([]);
  const [activeTab, setActiveTab] = useState('comercial');

  const addMessage = useCallback((msg) => {
    setMessages(prev => [...prev, msg]);
  }, []);

  const updateLastAssistant = useCallback((content) => {
    setMessages(prev => {
      const copy = [...prev];
      for (let i = copy.length - 1; i >= 0; i--) {
        if (copy[i].role === 'assistant') {
          copy[i] = { ...copy[i], content };
          break;
        }
      }
      return copy;
    });
  }, []);

  const getAgentMessages = useCallback(() => {
    return messages.slice(-20).map(m => ({ role: m.role, content: m.content }));
  }, [messages]);

  return (
    <AppContext.Provider value={{
      origin, dest, year, month, calData, smartData, selectedDay,
      messages, streaming, flights, activeTab,
      setOrigin, setDest, setYear, setMonth, setCalData, setSmartData,
      setSelectedDay, addMessage, updateLastAssistant, setStreaming, setFlights, setActiveTab,
      getAgentMessages,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
