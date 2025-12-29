
import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext';

const SiteBuilder: React.FC = () => {
  const { settings } = useSystem();
  const [isBuilding, setIsBuilding] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [step, setStep] = useState(0);

  const buildSteps = [
    'Synthesizing UI architecture...',
    'Generating responsive layout nodes...',
    'Forging visual brand identity...',
    'Injecting automated content copy...',
    'Optimizing for edge delivery...',
    'Finalizing deployment...'
  ];

  const handleBuild = () => {
    if (!prompt.trim()) return;
    setIsBuilding(true);
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < buildSteps.length - 1) {
        currentStep++;
        setStep(currentStep);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsBuilding(false);
          setStep(0);
          const sub = Math.random().toString(36).substring(7);
          alert(`Site generation complete! Your site is now live at: https://${sub}.${settings.baseDomain}`);
        }, 1000);
      }
    }, 1500);
  };

  if (settings.maintenanceMode || !settings.isBuilderEnabled) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-10 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-rose-600/20 text-rose-500 rounded-3xl flex items-center justify-center text-4xl mb-8 shadow-2xl">
          <i className="fa-solid fa-cubes"></i>
        </div>
        <h2 className="text-4xl font-black mb-4 text-white tracking-tighter">Forge Restricted</h2>
        <p className="text-slate-400 max-w-lg text-lg leading-relaxed font-medium">
          Autonomous site synthesis is currently suspended for node maintenance. Please check the System Master console.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col space-y-12 animate-in fade-in duration-700">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center px-4 py-1.5 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-2">Architectural Logic Cluster v9</div>
        <h2 className="text-6xl font-black text-white tracking-tighter leading-tight">Automated Site Builder</h2>
        <p className="text-slate-400 text-2xl max-w-3xl mx-auto font-medium">Describe your vision. Nova builds the logic, the pixels, and the global infrastructure.</p>
      </header>

      <div className="glass-card rounded-[4rem] p-16 border border-white/10 shadow-2xl relative overflow-hidden flex flex-col items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none"></div>
        
        {!isBuilding ? (
          <div className="w-full space-y-10 relative z-10">
            <div className="space-y-4">
              <label className="text-sm font-black text-slate-500 uppercase tracking-widest text-center block">Deployment Instruction</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Build a minimalist high-end architectural firm portfolio with a focus on sustainable concrete designs. Include a 3D gallery and a dark-mode first aesthetic."
                className="w-full bg-slate-950/80 border border-slate-700 rounded-[2.5rem] p-10 text-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 text-2xl text-center min-h-[200px] shadow-inner transition-all"
              />
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleBuild}
                disabled={!prompt.trim()}
                className="px-16 py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2rem] font-black text-xl uppercase tracking-widest transition-all shadow-2xl shadow-indigo-600/40 transform hover:-translate-y-2 active:scale-95 disabled:opacity-50"
              >
                Launch Automated Forge
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center space-y-12 relative z-10">
            <div className="w-32 h-32 relative">
               <div className="absolute inset-0 border-8 border-indigo-500/20 rounded-full"></div>
               <div className="absolute inset-0 border-8 border-indigo-500 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(99,102,241,0.5)]"></div>
            </div>
            <div className="space-y-4 text-center">
               <h3 className="text-4xl font-black text-white tracking-tight animate-pulse">{buildSteps[step]}</h3>
               <p className="text-slate-500 font-bold uppercase tracking-widest">Processing Node: Cluster-9 • {settings.activeModel} Oversight</p>
            </div>
            <div className="w-full max-w-xl bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
               <div 
                className="bg-indigo-600 h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(99,102,241,0.8)]" 
                style={{ width: `${((step + 1) / buildSteps.length) * 100}%` }}
               ></div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center pb-20">
         <div className="p-8 space-y-4">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-indigo-400">
              <i className="fa-solid fa-code text-2xl"></i>
            </div>
            <h4 className="text-xl font-bold text-white">Production Ready</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Built with React and Tailwind CSS. Optimized for sub-second LCP and edge delivery.</p>
         </div>
         <div className="p-8 space-y-4 border-x border-white/5">
            <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-pink-400">
              <i className="fa-solid fa-database text-2xl"></i>
            </div>
            <h4 className="text-xl font-bold text-white">Autonomous CMS</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Neural asset indexing. Media assets are automatically tagged and optimized for different device clusters.</p>
         </div>
         <div className="p-8 space-y-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-emerald-400">
              <i className="fa-solid fa-shield-halved text-2xl"></i>
            </div>
            <h4 className="text-xl font-bold text-white">Global Security</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Automated SSL, DDoS shielding, and distributed backups are standard protocol.</p>
         </div>
      </div>
    </div>
  );
};

export default SiteBuilder;
