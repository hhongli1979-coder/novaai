
import React, { useState, useEffect } from 'react';
import { AppRoute } from '../../types';
import { useSystem } from '../../context/SystemContext';

interface DashboardProps {
  onNavigate: (route: AppRoute) => void;
}

interface ActivityLog {
  id: string;
  action: string;
  meta: string;
  time: string;
  status: 'success' | 'processing';
}

/**
 * Main dashboard view for Nova OS command center.
 */
const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { systemHealth } = useSystem();
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]);

  // Simulation of kernel log stream
  useEffect(() => {
    const logs: ActivityLog[] = [
      { id: '1', action: 'Synchronized AR Mesh', meta: 'Shard-7 Ready', time: 'Just now', status: 'success' },
      { id: '2', action: 'Forged Design Manifest', meta: 'Figma-Ingest v4.2', time: '2m ago', status: 'success' },
      { id: '3', action: 'Allocating GPU Cluster', meta: 'Veo-Cinema 4K', time: '12m ago', status: 'processing' },
      { id: '4', action: 'Neural Packet Optimized', meta: 'Latency: 12ms', time: '24m ago', status: 'success' },
      { id: '5', action: 'Identity Shard Verified', meta: 'Root Access Tier', time: '1h ago', status: 'success' },
    ];
    setRecentActivity(logs);
  }, []);
  
  const stats = [
    { label: 'Compute Prowess', value: `${systemHealth.toFixed(1)}%`, trend: 'PEAK', icon: 'fa-microchip', color: 'text-cyan-400' },
    { label: 'Neural Throughput', value: '842 GB/s', trend: 'STABLE', icon: 'fa-wave-square', color: 'text-indigo-400' },
    { label: 'Logic Shards', value: '42', trend: 'SYNCED', icon: 'fa-bolt-lightning', color: 'text-pink-400' },
    { label: 'Uptime Node', value: '99.99%', trend: 'ACTIVE', icon: 'fa-shield-halved', color: 'text-emerald-400' },
  ];

  return (
    <div className="space-y-12 max-w-[1600px] mx-auto animate-in fade-in duration-500 pb-20 selection:bg-indigo-500/30">
      <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-10">
        <div className="space-y-4">
          <div className="inline-flex items-center px-4 py-1.5 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">Command_Center_Oversight</div>
          <h1 className="text-7xl font-black tracking-tighter text-white uppercase leading-none">Command <span className="gradient-text">Center</span></h1>
          <p className="text-slate-500 text-xl font-medium max-w-2xl">Autonomous ecosystem governance. Nova OS is monitoring all global neural mesh activity.</p>
        </div>
        <div className="flex flex-wrap gap-4">
           <div className="flex flex-col items-end pr-8 border-r border-white/5 hidden md:flex">
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Global Compute</span>
              <span className="text-2xl font-black text-indigo-400 tracking-tighter">8.2 PFLOPS</span>
           </div>
           <button onClick={() => onNavigate(AppRoute.BUILDER)} className="px-10 py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all shadow-2xl active:scale-95 border-none">Quick Forge Site</button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-card rounded-[3rem] p-8 hover:bg-white/[0.04] transition-all group relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <div className={`w-14 h-14 rounded-2xl bg-slate-950 border border-white/5 flex items-center justify-center ${stat.color} shadow-inner group-hover:scale-110 transition-transform`}>
                <i className={`fa-solid ${stat.icon} text-2xl`}></i>
              </div>
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{stat.trend}</span>
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-white tracking-tighter">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 glass-card rounded-[3.5rem] p-10 border border-white/5 bg-slate-900/40 shadow-2xl space-y-8">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center">
              <i className="fa-solid fa-clock-rotate-left mr-3 text-indigo-400"></i>
              Recent Activity Shards
            </h3>
            <span className="text-[10px] font-black text-emerald-500 uppercase">Synchronized</span>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map(log => (
              <div key={log.id} className="flex items-center justify-between p-6 bg-slate-950/50 rounded-2xl border border-white/5 group hover:bg-white/5 transition-all">
                <div className="flex items-center space-x-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${log.status === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-indigo-500/10 text-indigo-500 animate-pulse'}`}>
                    <i className={`fa-solid ${log.status === 'success' ? 'fa-check' : 'fa-circle-notch animate-spin'}`}></i>
                  </div>
                  <div>
                    <p className="font-bold text-slate-200">{log.action}</p>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{log.meta}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-600 uppercase">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-card rounded-[3rem] p-10 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 shadow-2xl space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest">Compute Oversight</h3>
              <i className="fa-solid fa-microchip text-indigo-400"></i>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase">
                  <span>Logic Throughput</span>
                  <span className="text-white">84%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: '84%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase">
                  <span>Memory Entropy</span>
                  <span className="text-white">12%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: '12%' }}></div>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 font-bold leading-relaxed italic">"Dynamic node balancing is currently maintaining optimal latency across all global mesh clusters."</p>
          </div>
          
          <button className="w-full py-6 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-3xl font-black text-xs uppercase tracking-widest transition-all">
            System Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
