
import React, { createContext, useContext, useState, useEffect } from 'react';

interface SystemSettings {
  isChatEnabled: boolean;
  isImageEnabled: boolean;
  isVideoEnabled: boolean;
  isBuilderEnabled: boolean;
  globalComputeBudget: number;
  activeModel: string;
  maintenanceMode: boolean;
}

interface SystemContextType {
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  systemHealth: number;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('nova_system_settings');
    return saved ? JSON.parse(saved) : {
      isChatEnabled: true,
      isImageEnabled: true,
      isVideoEnabled: true,
      isBuilderEnabled: true,
      globalComputeBudget: 50000,
      activeModel: 'gemini-3-pro-preview',
      maintenanceMode: false
    };
  });

  const [systemHealth, setSystemHealth] = useState(98.4);

  useEffect(() => {
    localStorage.setItem('nova_system_settings', JSON.stringify(settings));
  }, [settings]);

  // Simulate slight health fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemHealth(prev => {
        const jitter = (Math.random() - 0.5) * 0.4;
        return Math.min(100, Math.max(90, prev + jitter));
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <SystemContext.Provider value={{ settings, updateSettings, systemHealth }}>
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) throw new Error('useSystem must be used within a SystemProvider');
  return context;
};
