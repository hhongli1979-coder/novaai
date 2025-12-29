
import React, { memo } from 'react';
import { AppRoute, UserRole } from '../types';
import { useSystem } from '../context/SystemContext';

interface SidebarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentRoute, onNavigate }) => {
  const { systemHealth, userRole } = useSystem();
  
  const allMenuItems = [
    { id: AppRoute.DASHBOARD, icon: 'fa-house', label: 'Command Center', roles: [UserRole.ADMIN, UserRole.CREATOR, UserRole.GUEST] },
    { id: AppRoute.CHAT, icon: 'fa-brain', label: 'Nova Intelligence', roles: [UserRole.ADMIN, UserRole.CREATOR, UserRole.GUEST] },
    { id: AppRoute.IMAGE, icon: 'fa-wand-magic-sparkles', label: 'Image Forge', roles: [UserRole.ADMIN, UserRole.CREATOR, UserRole.GUEST] },
    { id: AppRoute.TRANSLATE, icon: 'fa-language', label: 'Neural Translator', roles: [UserRole.ADMIN, UserRole.CREATOR, UserRole.GUEST] },
    { id: AppRoute.FIGMA, icon: 'fa-brands fa-figma', label: 'Design Ingest', roles: [UserRole.ADMIN, UserRole.CREATOR] },
    { id: AppRoute.VIDEO, icon: 'fa-clapperboard', label: 'Cinema Studio', roles: [UserRole.ADMIN, UserRole.CREATOR] },
    { id: AppRoute.AGENT_MANAGER, icon: 'fa-user-gear', label: 'Agent Manager', roles: [UserRole.ADMIN, UserRole.CREATOR] },
    { id: AppRoute.NEURAL_EDGE, icon: 'fa-bolt-lightning', label: 'Neural Edge (Ops)', roles: [UserRole.ADMIN, UserRole.CREATOR] },
    { id: AppRoute.AR_STORE, icon: 'fa-vr-cardboard', label: 'AR Store', roles: [UserRole.ADMIN, UserRole.CREATOR] },
    { id: AppRoute.MARKETPLACE, icon: 'fa-store', label: 'Marketplace', roles: [UserRole.ADMIN, UserRole.CREATOR] },
    { id: AppRoute.BUILDER, icon: 'fa-cubes', label: 'Site Builder', roles: [UserRole.ADMIN, UserRole.CREATOR] },
    { id: AppRoute.ADMIN, icon: 'fa-shield-halved', label: 'Nova Admin Console', roles: [UserRole.ADMIN] },
    { id: AppRoute.SETTINGS, icon: 'fa-sliders', label: 'System Config', roles: [UserRole.ADMIN] },
  ];

  const menuItems = allMenuItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="w-72 bg-slate-950/80 h-screen flex flex-col border-r border-white/5 relative z-50 accelerate">
      <div className="p-8 flex items-center space-x-4">
        <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
          <i className="fa-solid fa-atom text-white text-xl"></i>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-black tracking-tighter text-white">NOVA OS</span>
          <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">v2.5.8 active</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center space-x-4 px-5 py-3.5 rounded-xl transition-all duration-200 group ${
              currentRoute === item.id
                ? 'bg-indigo-600/10 text-white border-l-4 border-indigo-500'
                : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            <i className={`fa-solid ${item.icon} text-base w-5 transition-transform duration-200 group-hover:scale-110`}></i>
            <span className="font-bold text-xs">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6">
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
          <div className="flex justify-between items-center mb-2">
             <span className="text-[9px] font-bold text-slate-500 uppercase">Latency Optimizer</span>
             <span className="text-[9px] font-black text-emerald-400">ACTIVE</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-1 overflow-hidden">
            <div 
              className="h-full bg-indigo-500 transition-all duration-1000" 
              style={{ width: `${systemHealth}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Sidebar);
