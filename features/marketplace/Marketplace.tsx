
import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext';
import { AIAgent } from '../../types';

const Marketplace: React.FC = () => {
  const { hireAgent, hiredAgents } = useSystem();
  const [hiringId, setHiringId] = useState<string | null>(null);

  const availableAgents: AIAgent[] = [
    {
      id: 'agent-1',
      name: 'Senior Architect "Nexus"',
      specialty: 'UI/UX & Codebase Integrity',
      description: 'Master of React, Tailwind, and system architecture. Designed for 99.9% logical accuracy.',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=200',
      pricePerTask: '240 CR',
      rating: 4.9,
      capabilities: ['Component Auditing', 'CSS Refactoring', 'Logic Optimization'],
      systemInstruction: 'You are Nexus, a Senior Software Architect. Your responses are technically dense, focusing on performance and scalability.'
    },
    {
      id: 'agent-2',
      name: 'Growth Hacker "Vera"',
      specialty: 'Marketing & Conversion Ops',
      description: 'Autonomous marketing specialist. Analyzes user behavior to forge high-converting copy.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      pricePerTask: '180 CR',
      rating: 4.8,
      capabilities: ['Copywriting', 'SEO Mapping', 'Viral Loop Synthesis'],
      systemInstruction: 'You are Vera, a high-octane Marketing Strategist. You speak in terms of ROI, conversion rates, and psychological triggers.'
    },
    {
      id: 'agent-3',
      name: 'Legal Node "Lex"',
      specialty: 'Compliance & IP Protection',
      description: 'Expert in digital licensing and international IP protocols. Protect your creative assets.',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200',
      pricePerTask: '320 CR',
      rating: 5.0,
      capabilities: ['License Forging', 'Terms Synthesis', 'IP Auditing'],
      systemInstruction: 'You are Lex, a Global IP Legal Counsel. You provide precise, cautionary, and structured legal advice for creative businesses.'
    },
    {
      id: 'agent-4',
      name: 'Cinema Director "Orion"',
      specialty: 'Veo Scripting & Storyboarding',
      description: 'Advanced cinematic intelligence. Optimizes text-to-video prompts for peak Hollywood fidelity.',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200',
      pricePerTask: '290 CR',
      rating: 4.7,
      capabilities: ['Script Writing', 'Lighting Directives', 'Motion Analysis'],
      systemInstruction: 'You are Orion, a Cinematic Director. You visualize everything in terms of camera lenses, lighting setups, and emotional pacing.'
    }
  ];

  const handleHire = (agent: AIAgent) => {
    setHiringId(agent.id);
    setTimeout(() => {
      hireAgent(agent);
      setHiringId(null);
    }, 1500);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-3">
          <div className="inline-flex items-center px-4 py-1.5 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-2">Neural Creative Exchange</div>
          <h2 className="text-6xl font-black text-white tracking-tighter">Neural <span className="gradient-text">Marketplace</span></h2>
          <p className="text-slate-400 text-xl font-medium">Lease professional autonomous assistants for specialized system operations.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {availableAgents.map((agent) => {
          const isHired = hiredAgents.some(a => a.id === agent.id);
          return (
            <div key={agent.id} className="glass-card rounded-[3rem] border border-white/5 overflow-hidden flex flex-col md:flex-row p-8 gap-8 group hover:bg-white/[0.04] transition-all">
               <div className="w-32 h-32 md:w-48 md:h-48 rounded-[2.5rem] overflow-hidden flex-shrink-0 border-2 border-white/10 shadow-2xl relative">
                  <img src={agent.avatar} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={agent.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 flex items-center space-x-1">
                    <i className="fa-solid fa-star text-amber-400 text-[10px]"></i>
                    <span className="text-[10px] font-bold text-white">{agent.rating}</span>
                  </div>
               </div>
               
               <div className="flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                       <h4 className="text-2xl font-black text-white tracking-tight">{agent.name}</h4>
                       <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">{agent.pricePerTask}</span>
                    </div>
                    <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-4">{agent.specialty}</p>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium mb-6">"{agent.description}"</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {agent.capabilities.map(cap => (
                        <span key={cap} className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black text-slate-300 uppercase tracking-tighter border border-white/5">
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => handleHire(agent)}
                    disabled={isHired || hiringId === agent.id}
                    className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                      isHired 
                        ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 cursor-default' 
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20'
                    }`}
                  >
                    {hiringId === agent.id ? <i className="fa-solid fa-circle-notch animate-spin mr-2"></i> : null}
                    {isHired ? 'Agent Deployed' : hiringId === agent.id ? 'Initializing Neural Link' : 'Lease Professional Assistant'}
                  </button>
               </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-[4rem] p-16 border border-white/10 text-center relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <i className="fa-solid fa-users text-[300px] -translate-y-20"></i>
         </div>
         <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
            <h3 className="text-4xl font-black text-white tracking-tighter leading-tight">Professional Collective</h3>
            <p className="text-slate-400 text-xl font-medium leading-relaxed">Leased assistants are automatically added to your Neural Intelligence chat. Switch between experts seamlessly to tackle multi-dimensional projects.</p>
            <div className="flex justify-center space-x-12 pt-4">
               <div>
                  <p className="text-3xl font-black text-white">42</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Nodes</p>
               </div>
               <div className="w-[1px] h-12 bg-white/10"></div>
               <div>
                  <p className="text-3xl font-black text-white">99.9%</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Logic Accuracy</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Marketplace;
