
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AIAgent, UserRole } from '../types';

interface SystemSettings {
  isChatEnabled: boolean;
  isImageEnabled: boolean;
  isVideoEnabled: boolean;
  isBuilderEnabled: boolean;
  globalComputeBudget: number;
  activeModel: string;
  maintenanceMode: boolean;
  vercelToken: string;
  vercelOrgId: string;
  vercelProjectId: string;
  isAiGatewayEnabled: boolean;
  aiGatewayUrl: string;
  baseDomain: string;
}

interface SystemContextType {
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  systemHealth: number;
  hiredAgents: AIAgent[];
  hireAgent: (agent: AIAgent) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>(UserRole.GUEST);
  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('nova_system_settings');
    return saved ? JSON.parse(saved) : {
      isChatEnabled: true,
      isImageEnabled: true,
      isVideoEnabled: true,
      isBuilderEnabled: true,
      globalComputeBudget: 50000,
      activeModel: 'gemini-3-pro-preview',
      maintenanceMode: false,
      vercelToken: 'PErQ5t3NuiAhmAqQItLOs5bu',
      vercelOrgId: 'team_dStSuF1KPFzCGimCSrbIwE1G',
      vercelProjectId: 'prj_1L4JOA8gf4iDgAg7d8JDyhCv426n',
      isAiGatewayEnabled: false,
      aiGatewayUrl: 'https://gateway.mdio.shop/v1',
      baseDomain: 'mdio.shop'
    };
  });

  const [hiredAgents, setHiredAgents] = useState<AIAgent[]>(() => {
    const saved = localStorage.getItem('nova_hired_agents');
    return saved ? JSON.parse(saved) : [];
  });

  const [systemHealth, setSystemHealth] = useState(98.4);

  useEffect(() => {
    localStorage.setItem('nova_system_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('nova_hired_agents', JSON.stringify(hiredAgents));
  }, [hiredAgents]);

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

  const hireAgent = (agent: AIAgent) => {
    setHiredAgents(prev => {
      if (prev.find(a => a.id === agent.id)) return prev;
      return [...prev, agent];
    });
  };

  return (
    <SystemContext.Provider value={{ settings, updateSettings, systemHealth, hiredAgents, hireAgent, userRole, setUserRole }}>
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) throw new Error('useSystem must be used within a SystemProvider');
  return context;
};
