
import React from 'react';
import { AppRoute } from '../types';
import { useSystem } from '../context/SystemContext';

interface SidebarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentRoute, onNavigate }) => {
  const { systemHealth } = useSystem();
  
  const menuItems = [
    { id: AppRoute.DASHBOARD, icon: 'fa-house', label: 'Command Center' },
    { id: AppRoute.CHAT, icon: 'fa-brain', label: 'Nova Intelligence' },
    { id: AppRoute.IMAGE, icon: 'fa-wand-magic-sparkles', label: 'Image Forge' },
    { id: AppRoute.VIDEO, icon: 'fa-clapperboard', label: 'Cinema Studio' },
    { id: AppRoute.TRANSLATE, icon: 'fa-language', label: 'Neural Translator' },
    { id: AppRoute.AR_STORE, icon: 'fa-vr-cardboard', label: 'AR Store' },
    { id: AppRoute.MARKETPLACE, icon: 'fa-store', label: 'Marketplace' },
    { id: AppRoute.BUILDER, icon: 'fa-cubes', label: 'Site Builder' },
    { id: AppRoute.ADMIN, icon: 'fa-shield-halved', label: 'Nova Admin Console' },
    { id: AppRoute.SETTINGS, icon: 'fa-sliders', label: 'System Config' },
  ];

  return (
    <div className="w-72 bg-slate-950/50 backdrop-blur-3xl h-screen flex flex-col border-r border-white/5 relative z-50">
      <div className="p-8 flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/40">
          <i className="fa-solid fa-atom text-white text-2xl animate-spin-slow"></i>
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black tracking-tighter text-white">NOVA OS</span>
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">v2.5 Enterprise</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
              currentRoute === item.id
                ? 'bg-gradient-to-r from-indigo-600/20 to-transparent text-white border-l-4 border-indigo-500 shadow-[inset_10px_0_30px_-10px_rgba(99,102,241,0.2)]'
                : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            <i className={`fa-solid ${item.icon} text-lg w-6 group-hover:scale-110 transition-transform`}></i>
            <span className="font-bold text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6">
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-[2rem] p-5 border border-white/5">
          <div className="flex justify-between items-center mb-4">
             <span className="text-xs font-bold text-slate-400 uppercase">Compute Power</span>
             <span className={`text-xs font-black transition-colors ${systemHealth > 95 ? 'text-indigo-400' : 'text-amber-400'}`}>
               {systemHealth.toFixed(1)}%
             </span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-1.5 mb-3 overflow-hidden">
            <div 
              className={`h-full rounded-full shadow-[0_0_10px_#6366f1] transition-all duration-1000 ${systemHealth > 95 ? 'bg-indigo-500' : 'bg-amber-500'}`} 
              style={{ width: `${systemHealth}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-slate-500 text-center">
            {systemHealth > 95 ? 'Nova Clusters are operating at peak efficiency.' : 'Minor latency detected in Neural Node Sigma.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
