import { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const now = new Date();
  const [origin, setOrigin] = useState('São Paulo (GRU)');
  const [dest, setDest] = useState('');
  const [originAirport, setOriginAirport] = useState({ iata: 'GRU', city: 'São Paulo' });
  const [destAirport, setDestAirport] = useState(null);
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [calData, setCalData] = useState([]);
  const [smartData, setSmartData] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(false);
  const [flights, setFlights] = useState([]);
  const [activeTab, setActiveTab] = useState('comercial');

  return (
    <AppContext.Provider value={{
      origin, dest, originAirport, destAirport, year, month,
      calData, smartData, selectedDay, loading, flights, activeTab,
      setOrigin, setDest, setOriginAirport, setDestAirport, setYear, setMonth,
      setCalData, setSmartData, setSelectedDay,
      setLoading, setFlights, setActiveTab,
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
