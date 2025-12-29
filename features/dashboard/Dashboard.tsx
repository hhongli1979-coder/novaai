
import React from 'react';
import { AppRoute } from '../../types';
import { useSystem } from '../../context/SystemContext';

interface DashboardProps {
  onNavigate: (route: AppRoute) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { settings, systemHealth } = useSystem();
  
  const stats = [
    { label: 'Compute Power', value: `${systemHealth.toFixed(1)}%`, trend: systemHealth > 95 ? 'OPTIMAL' : 'STABLE', icon: 'fa-microchip', color: 'text-cyan-400' },
    { label: 'Total Budget', value: `${(settings.globalComputeBudget / 1000).toFixed(1)}K`, trend: 'ACTIVE', icon: 'fa-coins', color: 'text-amber-400' },
    { label: 'Total Traffic', value: '842K', trend: '+28%', icon: 'fa-bolt', color: 'text-indigo-400' },
    { label: 'Render Nodes', value: '42', trend: 'ACTIVE', icon: 'fa-server', color: 'text-emerald-400' },
  ];

  return (
    <div className="space-y-12 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {settings.maintenanceMode && (
        <div className="bg-rose-600 text-white px-8 py-4 rounded-3xl flex items-center justify-between shadow-2xl animate-pulse">
           <div className="flex items-center space-x-4">
              <i className="fa-solid fa-triangle-exclamation text-2xl"></i>
              <span className="font-black uppercase tracking-widest">Global Maintenance Mode Active - System Privileges Restricted</span>
           </div>
           <span className="text-[10px] font-black opacity-50">Root ID: Master</span>
        </div>
      )}

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-3">
          <h1 className="text-6xl font-black tracking-tighter text-white">System Command</h1>
          <p className="text-slate-400 text-xl font-medium flex items-center">
            <span className={`w-3 h-3 rounded-full mr-3 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)] ${systemHealth > 95 ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            Nova Autonomous OS v2.5. Creative core is synchronized via {settings.activeModel}.
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => onNavigate(AppRoute.BUILDER)}
            className="px-10 py-4 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95 shadow-2xl shadow-white/10"
          >
            Deploy Site
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-card bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 hover:bg-white/[0.06] transition-all group shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className={`w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center ${stat.color} shadow-inner`}>
                <i className={`fa-solid ${stat.icon} text-2xl`}></i>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{stat.trend}</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-4xl font-black text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 glass-card bg-gradient-to-br from-indigo-600/20 to-transparent rounded-[3rem] p-12 border border-indigo-500/20 relative overflow-hidden group cursor-pointer" onClick={() => onNavigate(AppRoute.AR_STORE)}>
           <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/10 blur-[100px] rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
           <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-1.5 bg-indigo-500/20 rounded-full border border-indigo-500/30 text-indigo-400 text-[10px] font-black uppercase tracking-widest">Active Neural Engine</div>
                <h2 className="text-5xl font-black text-white leading-none tracking-tighter">AR Retail Node</h2>
                <p className="text-slate-400 text-xl max-w-lg leading-relaxed font-medium">Nova AR auto-generates immersive 3D commerce environments from standard images instantly.</p>
              </div>
              <div className="mt-16 flex items-center space-x-6">
                <div className="flex -space-x-4">
                   {[1,2,3,4].map(i => <img key={i} src={`https://picsum.photos/120/120?random=${i+20}`} className="w-16 h-16 rounded-full border-4 border-slate-950 object-cover shadow-2xl" alt="Retail Store" />)}
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-black text-white">2.4K Stores Live</span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Updated 2m ago</span>
                </div>
              </div>
           </div>
        </div>

        <div className="glass-card bg-slate-900/50 rounded-[3rem] p-10 border border-white/5 flex flex-col justify-between shadow-2xl">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
               <h3 className="text-3xl font-black text-white tracking-tighter">Asset Hub</h3>
               <i className="fa-solid fa-chart-line text-indigo-400 text-xl"></i>
            </div>
            <div className="space-y-5">
              {[
                { name: 'Abstract Film Pack', trend: '+42%', icon: 'fa-film', color: 'bg-pink-500/20 text-pink-500' },
                { name: 'Neumorphic Pro UI', trend: '+18%', icon: 'fa-layer-group', color: 'bg-cyan-500/20 text-cyan-400' },
                { name: 'Ambient Soundscape', trend: '+11%', icon: 'fa-music', color: 'bg-amber-500/20 text-amber-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center shadow-lg`}><i className={`fa-solid ${item.icon}`}></i></div>
                    <span className="text-sm font-bold text-slate-200 group-hover:text-white">{item.name}</span>
                  </div>
                  <span className="text-xs font-black text-emerald-400">{item.trend}</span>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => onNavigate(AppRoute.MARKETPLACE)} className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-indigo-600/20 mt-10">Marketplace Entry</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
