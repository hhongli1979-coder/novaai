
import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext';

const ControlCenter: React.FC = () => {
  const { settings, updateSettings, systemHealth } = useSystem();
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState(0);

  const deploySequence = [
    "Synchronizing manifest with mdio.shop cluster...",
    "Provisioning isolated container Shard-7...",
    "Mapping recursive neural gateways...",
    "Injecting soul-forged instructions...",
    "Optimizing edge throughput...",
    "Shard Live: Deployment Successful."
  ];

  const handleServerDeploy = () => {
    setIsDeploying(true);
    let current = 0;
    const interval = setInterval(() => {
      if (current < deploySequence.length - 1) {
        current++;
        setDeployStep(current);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsDeploying(false);
          setDeployStep(0);
          alert("Server Shard Update: Global cluster successfully synchronized.");
        }, 1000);
      }
    }, 1200);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Core System Evolution */}
        <div className="glass-card rounded-[3.5rem] p-12 border border-white/5 space-y-10 bg-slate-900/50 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
              <i className="fa-solid fa-microchip text-[120px]"></i>
           </div>
           
           <div className="flex items-center justify-between relative z-10">
              <h3 className="text-2xl font-black text-white tracking-tighter uppercase">Evolution Protocol</h3>
              <div className="flex items-center space-x-3">
                 <span className="text-[10px] font-black text-emerald-500 uppercase">Self-Repair: ON</span>
                 <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
           </div>

           <div className="space-y-8 relative z-10">
              <div className="p-8 bg-white/5 rounded-[2rem] border border-white/5 space-y-6">
                 <div className="flex justify-between items-center text-xs font-black text-slate-500 uppercase tracking-widest">
                    <span>Neural Manifest Integrity</span>
                    <span className="text-yellow-500">98.4%</span>
                 </div>
                 <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-white/5 shadow-inner">
                    <div className="h-full bg-yellow-600 shadow-[0_0_15px_rgba(202,138,4,0.6)]" style={{ width: '98.4%' }}></div>
                 </div>
                 <p className="text-[10px] text-slate-600 font-bold leading-relaxed italic">"Nova is currently utilizing 14.2% of its compute budget for autonomous instruction refinement."</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div className="p-6 bg-slate-950 rounded-3xl border border-white/5">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Recursive Depth</p>
                    <p className="text-3xl font-black text-white">v2.5.8</p>
                 </div>
                 <div className="p-6 bg-slate-950 rounded-3xl border border-white/5">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Active Shards</p>
                    <p className="text-3xl font-black text-indigo-400">42</p>
                 </div>
              </div>
           </div>

           <button className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95">
             Upgrade Neural Kernel
           </button>
        </div>

        {/* Direct Server Infrastructure */}
        <div className="glass-card rounded-[3.5rem] p-12 border border-yellow-500/20 space-y-10 bg-gradient-to-br from-yellow-500/5 to-transparent shadow-2xl">
           <h3 className="text-2xl font-black text-white tracking-tighter uppercase flex items-center">
             <i className="fa-solid fa-server mr-4 text-yellow-500"></i> Server Orchestration
           </h3>

           {!isDeploying ? (
             <div className="space-y-8">
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Primary Server Endpoint</label>
                  <div className="relative">
                    <input 
                      type="text"
                      placeholder="https://shard.mdio.shop/v1"
                      className="w-full bg-slate-950 border border-white/10 rounded-2xl p-5 text-white font-mono text-sm outline-none focus:ring-2 focus:ring-yellow-500/30"
                    />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-yellow-500 animate-pulse">
                       <i className="fa-solid fa-satellite-dish"></i>
                    </div>
                  </div>
               </div>

               <div className="space-y-6 pt-4">
                  <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5">
                     <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500">
                           <i className="fa-solid fa-shield-halved"></i>
                        </div>
                        <div>
                           <p className="font-black text-white uppercase text-xs tracking-widest">Cluster Shielding</p>
                           <p className="text-[10px] text-slate-500 font-bold uppercase">Automated DDoS & Logic Filter</p>
                        </div>
                     </div>
                     <button className="w-12 h-6 bg-yellow-600 rounded-full relative">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                     </button>
                  </div>

                  <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 opacity-50 grayscale cursor-not-allowed">
                     <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500">
                           <i className="fa-solid fa-database"></i>
                        </div>
                        <div>
                           <p className="font-black text-white uppercase text-xs tracking-widest">Global Sharding</p>
                           <p className="text-[10px] text-slate-500 font-bold uppercase">Sync assets to edge nodes</p>
                        </div>
                     </div>
                     <i className="fa-solid fa-lock text-slate-700 mr-2"></i>
                  </div>
               </div>

               <button 
                onClick={handleServerDeploy}
                className="w-full py-8 bg-white text-black rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] hover:bg-slate-200 transition-all shadow-2xl active:scale-95"
               >
                 Trigger Production Manifest
               </button>
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center space-y-10 py-10 animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 relative">
                   <div className="absolute inset-0 border-4 border-yellow-500/20 rounded-full"></div>
                   <div className="absolute inset-0 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                   <div className="absolute inset-0 flex items-center justify-center text-yellow-500 animate-pulse">
                      <i className="fa-solid fa-cloud-arrow-up text-2xl"></i>
                   </div>
                </div>
                <div className="text-center space-y-4">
                   <p className="text-xl font-black text-white uppercase tracking-tighter animate-pulse">{deploySequence[deployStep]}</p>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em]">Node-Target: ep-noisy-recipe-732</p>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                   <div 
                    className="h-full bg-yellow-500 transition-all duration-700 shadow-[0_0_10px_#eab308]" 
                    style={{ width: `${((deployStep + 1) / deploySequence.length) * 100}%` }}
                   ></div>
                </div>
             </div>
           )}
        </div>
      </div>

      {/* Global Metadata Oversight */}
      <div className="glass-card rounded-[4rem] p-12 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-10 bg-slate-900/30">
         <div className="flex items-center space-x-8">
            <div className="w-20 h-20 bg-indigo-600/10 border border-indigo-500/20 rounded-3xl flex items-center justify-center text-indigo-400 text-3xl">
               <i className="fa-solid fa-globe"></i>
            </div>
            <div>
               <h4 className="text-3xl font-black text-white tracking-tighter">Autonomous Domain Mesh</h4>
               <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">Routing all traffic through *.{settings.baseDomain}</p>
            </div>
         </div>
         <div className="flex space-x-6">
            <div className="text-right">
               <p className="text-2xl font-black text-white tracking-tight">842,901</p>
               <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Active Packets / Sec</p>
            </div>
            <div className="w-[1px] h-12 bg-white/10"></div>
            <div className="text-right">
               <p className="text-2xl font-black text-emerald-400 tracking-tight">12ms</p>
               <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Global Latency</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ControlCenter;
