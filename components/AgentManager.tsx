
import React, { useState } from 'react';
import { AIAgent } from '../types';
import { useSystem } from '../context/SystemContext';
import { GoogleGenAI } from "@google/genai";
import { MODELS } from "../constants";

const AgentManager: React.FC = () => {
  const { hireAgent, hiredAgents } = useSystem();
  const [isForging, setIsForging] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'collective'>('create');
  const [showDeploymentCode, setShowDeploymentCode] = useState<string | null>(null);
  
  const [newAgent, setNewAgent] = useState<Partial<AIAgent>>({
    name: '',
    specialty: '',
    description: '',
    model: 'gemini-3-pro-preview',
    systemInstruction: '',
    avatar: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?auto=format&fit=crop&q=80&w=200'
  });

  const [evolvingId, setEvolvingId] = useState<string | null>(null);

  const handleForge = () => {
    if (!newAgent.name || !newAgent.systemInstruction) return;
    setIsForging(true);
    
    // Neural Soul Synthesis Simulation
    setTimeout(() => {
      const id = `custom-${Date.now()}`;
      const completedAgent: AIAgent = {
        id,
        name: newAgent.name!,
        specialty: newAgent.specialty || 'Generalist Agent',
        description: newAgent.description || 'Custom manifested autonomous node.',
        avatar: newAgent.avatar!,
        pricePerTask: 'INTERNAL',
        rating: 5.0,
        capabilities: ['Custom Logic', 'Instruction Adherence'],
        systemInstruction: newAgent.systemInstruction!,
        model: newAgent.model,
        status: 'active',
        evolutionLevel: 1,
        neuralDensity: 0.12,
        deploymentUrl: `https://api.nova.ai/v1/agents/${id}/execute`
      };
      hireAgent(completedAgent);
      setIsForging(false);
      setNewAgent({
        name: '',
        specialty: '',
        description: '',
        model: 'gemini-3-pro-preview',
        systemInstruction: '',
        avatar: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?auto=format&fit=crop&q=80&w=200'
      });
      setActiveTab('collective');
    }, 2500);
  };

  const triggerEvolution = async (agent: AIAgent) => {
    if (evolvingId) return;
    setEvolvingId(agent.id);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: MODELS.TEXT,
        contents: `Analyze this AI Agent's system instruction and refine it to be 20% more efficient, professional, and logically dense. Use higher-level vocabulary and structured constraints.
        
        Current Instruction: "${agent.systemInstruction}"
        
        Return ONLY the refined system instruction text.`,
        config: {
          systemInstruction: "You are the Nova Evolution Engine. Your task is to recursively improve system prompts for sub-agents.",
          temperature: 0.4,
        },
      });

      const refinedInstruction = response.text;
      
      // In this system, hireAgent with same ID replaces the existing agent
      const updatedAgent = {
        ...agent,
        systemInstruction: refinedInstruction || agent.systemInstruction,
        evolutionLevel: (agent.evolutionLevel || 1) + 1,
        neuralDensity: Math.min(1.0, (agent.neuralDensity || 0.1) + 0.08)
      };
      
      hireAgent(updatedAgent);
      alert(`${agent.name} has evolved to Level ${updatedAgent.evolutionLevel}. Neural density increased by 8%.`);
    } catch (err) {
      console.error("Evolution sequence interrupted:", err);
    } finally {
      setEvolvingId(null);
    }
  };

  const getDeploymentSnippet = (agent: AIAgent) => {
    return `// Nova Agent Integration Shard
const fetch = require('node-fetch');

async function runAgent(input) {
  const response = await fetch('${agent.deploymentUrl}', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_NOVA_TOKEN',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      prompt: input,
      model: '${agent.model}'
    })
  });
  return await response.json();
}

// Invoke ${agent.name}
runAgent("Synthesize project roadmap...").then(console.log);`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center px-4 py-1.5 bg-yellow-500/10 rounded-full border border-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase tracking-[0.3em]">Neural_Soul_Forge_v2.5</div>
          <h1 className="text-6xl font-black tracking-tighter text-white uppercase leading-none">Agent <span className="gradient-text">Manager</span></h1>
          <p className="text-slate-400 text-xl font-medium">Manifest, govern, and deploy specialized neural entities for your creative cluster.</p>
        </div>
        
        <div className="flex bg-slate-950/50 p-1.5 rounded-2xl border border-white/5 shadow-2xl">
          <button 
            onClick={() => setActiveTab('create')}
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'create' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Forge Entity
          </button>
          <button 
            onClick={() => setActiveTab('collective')}
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'collective' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
          >
            The Collective ({hiredAgents.length})
          </button>
        </div>
      </header>

      {activeTab === 'create' ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          {/* CONFIGURATION PANEL */}
          <div className="xl:col-span-2 glass-card rounded-[3rem] p-12 border border-white/5 space-y-10 relative overflow-hidden bg-slate-900/40 shadow-2xl">
             <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <i className="fa-solid fa-dna text-[220px]"></i>
             </div>
             
             <div className="space-y-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Entity Designation (Name)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Architect Prime"
                        value={newAgent.name}
                        onChange={e => setNewAgent({...newAgent, name: e.target.value})}
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl p-6 text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-inner"
                      />
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Operational Specialty (Role)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Codebase Integrity"
                        value={newAgent.specialty}
                        onChange={e => setNewAgent({...newAgent, specialty: e.target.value})}
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl p-6 text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-inner"
                      />
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Neural Engine Core</label>
                     <div className="relative">
                        <select 
                          value={newAgent.model}
                          onChange={e => setNewAgent({...newAgent, model: e.target.value})}
                          className="w-full bg-slate-950 border border-white/10 rounded-2xl p-6 text-white font-black uppercase tracking-widest outline-none appearance-none cursor-pointer hover:bg-slate-900 transition-colors shadow-inner"
                        >
                            <option value="gemini-3-pro-preview">Gemini 3 Pro (Complex Reasoning)</option>
                            <option value="gemini-3-flash-preview">Gemini 3 Flash (High Throughput)</option>
                            <option value="gemini-flash-lite-latest">Gemini Lite (Logistics)</option>
                        </select>
                        <i className="fa-solid fa-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none"></i>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Visual Identity (Avatar URL)</label>
                     <input 
                        type="text" 
                        placeholder="Image URL..."
                        value={newAgent.avatar}
                        onChange={e => setNewAgent({...newAgent, avatar: e.target.value})}
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl p-6 text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-inner"
                      />
                  </div>
                </div>

                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 flex justify-between">
                     System Blueprint (System Instructions)
                     <span className="text-indigo-400">Context Window: 2M Tokens</span>
                   </label>
                   <textarea 
                     rows={8}
                     placeholder="Define the core logic, behavioral constraints, and expertise for this neural entity..."
                     value={newAgent.systemInstruction}
                     onChange={e => setNewAgent({...newAgent, systemInstruction: e.target.value})}
                     className="w-full bg-slate-950 border border-white/10 rounded-[2.5rem] p-8 text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/30 font-medium leading-relaxed resize-none shadow-inner"
                   />
                </div>

                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                   <div className="flex items-center space-x-5">
                      <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-lg">
                         <i className="fa-solid fa-shield-halved text-xl"></i>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-black text-white uppercase tracking-widest">Nova Isolation Protocol</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase max-w-xs leading-relaxed">Entities are containerized. Manifestation is immutable but evolution-ready.</p>
                      </div>
                   </div>
                   <button 
                    onClick={handleForge}
                    disabled={isForging || !newAgent.name || !newAgent.systemInstruction}
                    className="px-20 py-7 bg-indigo-600 hover:bg-indigo-500 text-white rounded-3xl font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-30 flex items-center group overflow-hidden relative"
                   >
                     <span className="relative z-10 flex items-center">
                        {isForging ? <i className="fa-solid fa-atom animate-spin mr-4 text-xl"></i> : <i className="fa-solid fa-fire-glow mr-4 text-xl group-hover:animate-pulse"></i>}
                        {isForging ? 'Synthesizing Neural Soul...' : 'Manifest Agent'}
                     </span>
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                   </button>
                </div>
             </div>
          </div>

          {/* PREVIEW HUD */}
          <div className="space-y-8">
             <div className="glass-card rounded-[3rem] p-10 border border-indigo-500/20 bg-indigo-500/5 shadow-[0_50px_100px_rgba(0,0,0,0.4)] space-y-10 flex flex-col items-center text-center group">
                <div className="relative">
                   <div className="w-48 h-48 rounded-[4rem] overflow-hidden border-8 border-slate-950 shadow-2xl group-hover:scale-105 transition-transform duration-700 relative z-10">
                      <img src={newAgent.avatar} className="w-full h-full object-cover" alt="Agent Preview" />
                   </div>
                   <div className="absolute inset-0 bg-indigo-500/20 blur-[50px] rounded-full scale-110 animate-pulse"></div>
                </div>
                <div className="space-y-3 relative z-10">
                   <h3 className="text-4xl font-black text-white tracking-tighter uppercase">{newAgent.name || 'Awaiting Manifestation'}</h3>
                   <p className="text-sm font-bold text-indigo-400 uppercase tracking-widest">{newAgent.specialty || 'Defining Specialty'}</p>
                </div>
                
                <div className="w-full grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                   <div className="p-5 bg-slate-950 rounded-2xl border border-white/5 shadow-inner">
                      <p className="text-[8px] font-black text-slate-600 uppercase mb-2">Neural Status</p>
                      <p className="text-xs font-black text-emerald-400">READY</p>
                   </div>
                   <div className="p-5 bg-slate-950 rounded-2xl border border-white/5 shadow-inner">
                      <p className="text-[8px] font-black text-slate-600 uppercase mb-2">Evolution</p>
                      <p className="text-xs font-black text-amber-400 uppercase">Tier 1</p>
                   </div>
                </div>
             </div>

             <div className="bg-gradient-to-br from-yellow-500/10 to-slate-900/40 rounded-[3rem] p-10 border border-yellow-500/10 shadow-2xl space-y-6">
                <div className="flex items-center space-x-4">
                   <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                      <i className="fa-solid fa-bolt-lightning text-yellow-500"></i>
                   </div>
                   <h4 className="text-xs font-black text-white uppercase tracking-widest">Self-Evolution Protocol</h4>
                </div>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed">Deployed entities can recursively self-refine. The evolution engine analyzes past performance to increase logical density and operational precision automatically.</p>
             </div>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
           {hiredAgents.length === 0 ? (
             <div className="glass-card rounded-[4rem] p-24 text-center border-dashed border-2 border-white/10 space-y-10 animate-in zoom-in-95 duration-500 shadow-inner">
                <div className="w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center text-slate-800 text-5xl mx-auto border border-white/5 shadow-2xl">
                   <i className="fa-solid fa-user-slash"></i>
                </div>
                <div className="space-y-4">
                   <h3 className="text-4xl font-black text-white tracking-tighter uppercase">The Collective is Void</h3>
                   <p className="text-slate-500 text-xl font-medium max-w-md mx-auto leading-relaxed">No autonomous entities have been manifested into your cluster. Forge your first assistant to begin.</p>
                </div>
                <button 
                  onClick={() => setActiveTab('create')}
                  className="px-12 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl active:scale-95"
                >
                  Initiate Soul Forge
                </button>
             </div>
           ) : (
             <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
                {hiredAgents.map(agent => (
                  <div key={agent.id} className="glass-card rounded-[3.5rem] p-10 border border-white/5 group hover:border-indigo-500/40 transition-all flex flex-col bg-slate-900/60 relative overflow-hidden shadow-2xl">
                     {evolvingId === agent.id && (
                        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-300">
                           <div className="w-20 h-20 border-[6px] border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin shadow-[0_0_40px_rgba(99,102,241,0.3)]"></div>
                           <div className="text-center space-y-2">
                              <p className="text-sm font-black text-indigo-400 uppercase tracking-[0.5em] animate-pulse">Recursive Refinement</p>
                              <p className="text-[10px] text-slate-500 font-bold uppercase">Optimizing Logical Density...</p>
                           </div>
                        </div>
                     )}

                     <div className="flex items-center space-x-8 mb-10">
                        <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-white/10 flex-shrink-0 group-hover:scale-105 transition-transform duration-700 shadow-2xl">
                           <img src={agent.avatar} className="w-full h-full object-cover" alt={agent.name} />
                        </div>
                        <div className="min-w-0 flex-1">
                           <h4 className="text-2xl font-black text-white truncate tracking-tighter uppercase">{agent.name}</h4>
                           <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest truncate mt-1 opacity-80">{agent.specialty}</p>
                           <div className="flex items-center space-x-2 mt-3">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></span>
                              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Shard</span>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-8 flex-1">
                        <div className="p-6 bg-slate-950/80 rounded-[2rem] border border-white/5 space-y-5 shadow-inner">
                           <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
                              <span>Neural Density</span>
                              <span className="text-white">{( (agent.neuralDensity || 0.12) * 100).toFixed(0)}%</span>
                           </div>
                           <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                              <div className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-1000 shadow-[0_0_12px_rgba(99,102,241,0.6)]" style={{ width: `${(agent.neuralDensity || 0.12) * 100}%` }}></div>
                           </div>
                           <div className="flex justify-between items-center px-1">
                              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Level: <span className="text-yellow-500 ml-1">{agent.evolutionLevel || 1}</span></p>
                              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Engine: <span className="text-white ml-1">{agent.model?.split('-')[1].toUpperCase()}</span></p>
                           </div>
                        </div>

                        <div className="space-y-3">
                           <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-2">Core logic Blueprint</p>
                           <p className="text-xs text-slate-300 italic line-clamp-4 bg-white/5 p-6 rounded-3xl border border-white/5 leading-relaxed font-medium">
                             "{agent.systemInstruction}"
                           </p>
                        </div>
                     </div>

                     <div className="pt-10 mt-auto border-t border-white/5 grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => triggerEvolution(agent)}
                          className="py-4 bg-yellow-600/10 hover:bg-yellow-600 text-yellow-500 hover:text-black border border-yellow-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg"
                        >
                          Trigger Evolution
                        </button>
                        <button 
                          onClick={() => setShowDeploymentCode(agent.id)}
                          className="py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                          Deployment Shard
                        </button>
                     </div>
                  </div>
                ))}
             </div>
           )}

           <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900/60 to-purple-950/60 rounded-[4rem] p-16 border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden group">
              <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-indigo-500/5 blur-[100px] group-hover:scale-150 transition-transform duration-1000"></div>
              <div className="flex items-center space-x-10 relative z-10">
                 <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center text-slate-950 text-5xl shadow-2xl shadow-white/10 animate-float">
                    <i className="fa-solid fa-users-rays"></i>
                 </div>
                 <div className="space-y-3">
                    <h4 className="text-4xl font-black text-white tracking-tighter uppercase">The Collective Protocol</h4>
                    <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl">Every manifested entity contributes to the global creative mesh. Entities communicate via Nova gRPC channels for synchronized, multi-agent generation workflows.</p>
                 </div>
              </div>
              <div className="flex space-x-6 relative z-10">
                 <div className="text-center p-8 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 min-w-[160px] shadow-2xl">
                    <p className="text-4xl font-black text-white tracking-tighter">{hiredAgents.length}</p>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Active Entities</p>
                 </div>
                 <div className="text-center p-8 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 min-w-[160px] shadow-2xl">
                    <p className="text-4xl font-black text-emerald-400 tracking-tighter">99.9%</p>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Uptime Node</p>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Deployment Modal */}
      {showDeploymentCode && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[999] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="glass-card max-w-4xl w-full rounded-[4rem] p-12 border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] space-y-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <i className="fa-solid fa-code text-[180px]"></i>
              </div>
              
              <div className="flex items-center justify-between relative z-10">
                 <div className="flex items-center space-x-5">
                    <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-2xl shadow-indigo-600/20">
                       <i className="fa-solid fa-cloud-arrow-up"></i>
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Deployment Shard</h3>
                       <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Connect to this entity via Nova API Gateway</p>
                    </div>
                 </div>
                 <button 
                  onClick={() => setShowDeploymentCode(null)}
                  className="w-12 h-12 bg-white/5 hover:bg-rose-600 hover:text-white rounded-xl flex items-center justify-center text-slate-400 transition-all border border-white/5"
                 >
                    <i className="fa-solid fa-xmark text-xl"></i>
                 </button>
              </div>

              <div className="space-y-4 relative z-10">
                 <p className="text-xs font-black text-indigo-400 uppercase tracking-widest px-2">Node Integration Code (Node.js)</p>
                 <div className="bg-slate-950 rounded-[2.5rem] p-8 border border-white/10 font-mono text-sm text-indigo-300 relative group">
                    <pre className="overflow-x-auto custom-scrollbar leading-relaxed">
                       {getDeploymentSnippet(hiredAgents.find(a => a.id === showDeploymentCode)!)}
                    </pre>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(getDeploymentSnippet(hiredAgents.find(a => a.id === showDeploymentCode)!));
                        alert("Logic shard copied to clipboard.");
                      }}
                      className="absolute top-6 right-6 px-4 py-2 bg-white/5 hover:bg-white text-slate-400 hover:text-black rounded-lg text-[10px] font-black uppercase tracking-widest transition-all opacity-0 group-hover:opacity-100 border border-white/5"
                    >
                       Copy Shard
                    </button>
                 </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed max-w-sm italic">
                    "This shard provides direct programmatic access to the entity's neural cluster. Keep your Nova Token strictly confidential."
                 </p>
                 <button 
                  onClick={() => setShowDeploymentCode(null)}
                  className="px-12 py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all shadow-2xl active:scale-95"
                 >
                    Acknowledge Manifest
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AgentManager;
