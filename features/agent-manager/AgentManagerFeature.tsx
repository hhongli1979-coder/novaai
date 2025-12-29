
import React, { useState } from 'react';
import { AIAgent } from '../../types';
import { useSystem } from '../../context/SystemContext';
import { GoogleGenAI } from "@google/genai";
import { MODELS } from "../../constants";

/**
 * Agent Manager: Soul Forge, Collective & Deployment Hub
 * The primary interface for manifesting and governing autonomous neural entities.
 */
const AgentManagerFeature: React.FC = () => {
  const { hireAgent, hiredAgents } = useSystem();
  const [isForging, setIsForging] = useState(false);
  const [activeTab, setActiveTab] = useState<'forge' | 'collective' | 'deployments'>('forge');
  const [showDeploymentCode, setShowDeploymentCode] = useState<string | null>(null);
  const [evolvingId, setEvolvingId] = useState<string | null>(null);
  
  const [newAgent, setNewAgent] = useState<Partial<AIAgent>>({
    name: '',
    specialty: '',
    description: '',
    model: 'gemini-3-pro-preview',
    systemInstruction: '',
    avatar: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?auto=format&fit=crop&q=80&w=200'
  });

  const handleForge = () => {
    if (!newAgent.name || !newAgent.systemInstruction) return;
    setIsForging(true);
    
    // Simulating Neural Soul Synthesis Sequence
    setTimeout(() => {
      const id = `agent-${Date.now()}`;
      const completedAgent: AIAgent = {
        id,
        name: newAgent.name!,
        specialty: newAgent.specialty || 'Generalist Intelligence',
        description: newAgent.description || 'User-manifested autonomous node.',
        avatar: newAgent.avatar!,
        pricePerTask: 'INTERNAL',
        rating: 5.0,
        capabilities: ['Custom Reasoning', 'Protocol Mapping', 'Recursive Logic'],
        systemInstruction: newAgent.systemInstruction!,
        model: newAgent.model,
        status: 'active',
        evolutionLevel: 1,
        neuralDensity: 0.15,
        deploymentUrl: `https://nova-cluster.io/v1/agents/${id}/exec`
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
    }, 3000);
  };

  const triggerEvolution = async (agent: AIAgent) => {
    if (evolvingId) return;
    setEvolvingId(agent.id);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analyze the current system instructions for an AI agent and refine them to be significantly more efficient, logically dense, and professional. 
        Focus on structural constraints and domain expertise.
        
        Entity Name: ${agent.name}
        Specialty: ${agent.specialty}
        Current Instruction: "${agent.systemInstruction}"
        
        Return ONLY the refined system instruction text.`,
        config: {
          systemInstruction: "You are the Nova Evolution Kernel. You recursively optimize neural logic paths for sub-agents.",
          temperature: 0.4,
        },
      });

      const refinedInstruction = response.text;
      
      const updatedAgent = {
        ...agent,
        systemInstruction: refinedInstruction || agent.systemInstruction,
        evolutionLevel: (agent.evolutionLevel || 1) + 1,
        neuralDensity: Math.min(1.0, (agent.neuralDensity || 0.1) + 0.12)
      };
      
      hireAgent(updatedAgent); 
    } catch (err) {
      console.error("Evolution sequence interrupted:", err);
    } finally {
      setEvolvingId(null);
    }
  };

  const getDeploymentSnippet = (agent: AIAgent) => {
    return `// Nova Agent Deployment Shard
import { NovaAgent } from '@nova-os/sdk';

const ${agent.name.replace(/[^a-zA-Z]/g, '')} = new NovaAgent({
  id: '${agent.id}',
  model: '${agent.model}',
  credentials: process.env.NOVA_KEY
});

async function main() {
  const result = await ${agent.name.replace(/[^a-zA-Z]/g, '')}.run({
    task: "Execute architectural audit on target...",
    recursionLevel: 2
  });
  console.log(result.output);
}

main();`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700 pb-32 selection:bg-indigo-500/30">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center px-4 py-1.5 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">Module_Entity_Ops_v2.7</div>
          <h1 className="text-6xl font-black tracking-tighter text-white uppercase leading-none">Agent <span className="gradient-text">Manager</span></h1>
          <p className="text-slate-400 text-xl font-medium max-w-2xl">Forge, define, and manifest specialized neural entities into your autonomous creative cluster.</p>
        </div>
        
        <div className="flex bg-slate-950/50 p-1.5 rounded-[1.5rem] border border-white/5 shadow-2xl backdrop-blur-xl">
          <button 
            onClick={() => setActiveTab('forge')}
            className={`px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'forge' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Forge
          </button>
          <button 
            onClick={() => setActiveTab('collective')}
            className={`px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'collective' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Collective ({hiredAgents.length})
          </button>
          <button 
            onClick={() => setActiveTab('deployments')}
            className={`px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'deployments' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Deployments
          </button>
        </div>
      </header>

      {activeTab === 'forge' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          {/* CONFIGURATION PANEL */}
          <div className="xl:col-span-2 glass-card rounded-[3.5rem] p-12 border border-white/5 space-y-12 relative overflow-hidden bg-slate-900/40 shadow-2xl">
             <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <i className="fa-solid fa-dna text-[240px]"></i>
             </div>
             
             <div className="space-y-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Entity Identity (Name)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Nexus Architect"
                        value={newAgent.name}
                        onChange={e => setNewAgent({...newAgent, name: e.target.value})}
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl p-6 text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-inner"
                      />
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Operational Node (Role/Specialty)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. System Security Audit"
                        value={newAgent.specialty}
                        onChange={e => setNewAgent({...newAgent, specialty: e.target.value})}
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl p-6 text-white font-bold outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-inner"
                      />
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Neural Engine (Model)</label>
                     <div className="relative">
                        <select 
                          value={newAgent.model}
                          onChange={e => setNewAgent({...newAgent, model: e.target.value})}
                          className="w-full bg-slate-950 border border-white/10 rounded-2xl p-6 text-white font-black uppercase tracking-widest outline-none appearance-none cursor-pointer hover:bg-slate-900 transition-colors shadow-inner"
                        >
                            <option value="gemini-3-pro-preview">Gemini 3 Pro (Complex Reasoning)</option>
                            <option value="gemini-3-flash-preview">Gemini 3 Flash (High Velocity)</option>
                            <option value="gemini-flash-lite-latest">Gemini Lite (Standard Ops)</option>
                        </select>
                        <i className="fa-solid fa-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none"></i>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Visual Mapping (Avatar URL)</label>
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
                     System Instruction Shard
                     <span className="text-indigo-400">Context Window: 2.0M Tokens</span>
                   </label>
                   <textarea 
                     rows={8}
                     placeholder="Define logic, constraints, and behavioral blueprints for this entity..."
                     value={newAgent.systemInstruction}
                     onChange={e => setNewAgent({...newAgent, systemInstruction: e.target.value})}
                     className="w-full bg-slate-950 border border-white/10 rounded-[2.5rem] p-8 text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/30 font-medium leading-relaxed resize-none shadow-inner"
                   />
                </div>

                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                   <div className="flex items-center space-x-6">
                      <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-lg animate-pulse">
                         <i className="fa-solid fa-microchip text-xl"></i>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-black text-white uppercase tracking-widest leading-none mb-1">Isolation Protocol: ACTIVE</p>
                        <p className="text-[9px] text-slate-500 font-bold uppercase max-w-xs leading-relaxed">Entities are sandboxed via Nova Isolation Tier 4. Manifestation is immutable upon forge.</p>
                      </div>
                   </div>
                   <button 
                    onClick={handleForge}
                    disabled={isForging || !newAgent.name || !newAgent.systemInstruction}
                    className="px-20 py-7 bg-indigo-600 hover:bg-indigo-500 text-white rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-indigo-600/40 transition-all active:scale-95 disabled:opacity-30 flex items-center group relative overflow-hidden"
                   >
                     <span className="relative z-10 flex items-center">
                        {isForging ? <i className="fa-solid fa-atom animate-spin mr-4 text-xl"></i> : <i className="fa-solid fa-fire-glow mr-4 text-xl group-hover:animate-pulse"></i>}
                        {isForging ? 'Synthesizing...' : 'Trigger Manifestation'}
                     </span>
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                   </button>
                </div>
             </div>
          </div>

          {/* PREVIEW HUD */}
          <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
             <div className="glass-card rounded-[3rem] p-10 border border-indigo-500/20 bg-indigo-500/5 shadow-[0_50px_100px_rgba(0,0,0,0.6)] space-y-10 flex flex-col items-center text-center group">
                <div className="relative">
                   <div className="w-56 h-56 rounded-[4.5rem] overflow-hidden border-8 border-slate-950 shadow-2xl group-hover:scale-105 transition-transform duration-700 relative z-10">
                      <img src={newAgent.avatar} className="w-full h-full object-cover" alt="Agent Preview" />
                   </div>
                   <div className="absolute inset-0 bg-indigo-500/20 blur-[60px] rounded-full scale-110 animate-pulse"></div>
                </div>
                <div className="space-y-3 relative z-10">
                   <h3 className="text-4xl font-black text-white tracking-tighter uppercase leading-tight">{newAgent.name || 'Nova Node-7'}</h3>
                   <p className="text-sm font-bold text-indigo-400 uppercase tracking-widest">{newAgent.specialty || 'Awaiting Logic Blueprint'}</p>
                </div>
                
                <div className="w-full grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                   <div className="p-5 bg-slate-950 rounded-2xl border border-white/5 shadow-inner">
                      <p className="text-[8px] font-black text-slate-600 uppercase mb-2">Neural Link</p>
                      <p className="text-xs font-black text-emerald-400 tracking-widest">READY</p>
                   </div>
                   <div className="p-5 bg-slate-950 rounded-2xl border border-white/5 shadow-inner">
                      <p className="text-[8px] font-black text-slate-600 uppercase mb-2">Evolution</p>
                      <p className="text-xs font-black text-amber-400 uppercase tracking-widest">Tier 1</p>
                   </div>
                </div>
             </div>

             <div className="bg-slate-900/60 rounded-[3rem] p-10 border border-white/5 shadow-2xl space-y-6">
                <div className="flex items-center space-x-4">
                   <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                      <i className="fa-solid fa-code-branch"></i>
                   </div>
                   <h4 className="text-xs font-black text-white uppercase tracking-widest">Logic Stream Metrics</h4>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase">
                      <span>Instruction Entropy</span>
                      <span>0.042 (LOW)</span>
                   </div>
                   <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 w-[12%]"></div>
                   </div>
                   <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic opacity-80">"Logical density will increase dynamically through recursive evolution sequences."</p>
                </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'collective' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
           {hiredAgents.length === 0 ? (
             <div className="glass-card rounded-[4rem] p-32 text-center border-dashed border-2 border-white/10 space-y-10 shadow-inner">
                <div className="w-24 h-24 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-slate-800 text-5xl mx-auto border border-white/5 shadow-2xl">
                   <i className="fa-solid fa-users-slash"></i>
                </div>
                <div className="space-y-4">
                   <h3 className="text-4xl font-black text-white tracking-tighter uppercase leading-tight">The Collective is Void</h3>
                   <p className="text-slate-500 text-xl font-medium max-w-md mx-auto leading-relaxed">No autonomous entities have been manifested. Forge your first assistant to begin clustering intelligence.</p>
                </div>
                <button 
                  onClick={() => setActiveTab('forge')}
                  className="px-14 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl active:scale-95 border-none"
                >
                  Initiate Soul Forge
                </button>
             </div>
           ) : (
             <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
                {hiredAgents.map(agent => (
                  <div key={agent.id} className="glass-card rounded-[3.5rem] p-10 border border-white/5 group hover:border-indigo-500/40 transition-all flex flex-col bg-slate-900/60 shadow-2xl relative overflow-hidden">
                     {evolvingId === agent.id && (
                        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-300">
                           <div className="w-24 h-24 border-[8px] border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin shadow-[0_0_50px_rgba(99,102,241,0.4)]"></div>
                           <div className="text-center space-y-3">
                              <p className="text-sm font-black text-indigo-400 uppercase tracking-[0.6em] animate-pulse">Recursive Evolution</p>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Optimizing Neural Shards...</p>
                           </div>
                        </div>
                     )}

                     <div className="flex items-center space-x-8 mb-10">
                        <div className="w-28 h-28 rounded-[2.5rem] overflow-hidden border-4 border-white/10 flex-shrink-0 group-hover:scale-105 transition-transform duration-700 shadow-2xl">
                           <img src={agent.avatar} className="w-full h-full object-cover" alt={agent.name} />
                        </div>
                        <div className="min-w-0 flex-1">
                           <h4 className="text-2xl font-black text-white truncate tracking-tighter uppercase leading-tight">{agent.name.split('"')[1] || agent.name}</h4>
                           <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest truncate mt-1.5 opacity-80">{agent.specialty}</p>
                           <div className="flex items-center space-x-2 mt-4">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></span>
                              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Shard Active</span>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-8 flex-1">
                        <div className="p-6 bg-slate-950/80 rounded-[2rem] border border-white/5 space-y-5 shadow-inner">
                           <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
                              <span>Neural Density</span>
                              <span className="text-white">{( (agent.neuralDensity || 0.15) * 100).toFixed(0)}%</span>
                           </div>
                           <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                              <div className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-1000 shadow-[0_0_15px_rgba(99,102,241,0.5)]" style={{ width: `${(agent.neuralDensity || 0.15) * 100}%` }}></div>
                           </div>
                           <div className="flex justify-between items-center px-1">
                              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Level: <span className="text-yellow-500 ml-1.5">{agent.evolutionLevel || 1}</span></p>
                              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Engine: <span className="text-white ml-1.5">{agent.model?.split('-')[1].toUpperCase() || 'GEMINI'}</span></p>
                           </div>
                        </div>

                        <div className="space-y-3">
                           <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-2">Core Logic Instruction</p>
                           <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 min-h-[120px] max-h-[120px] overflow-y-auto custom-scrollbar">
                              <p className="text-xs text-slate-300 italic leading-relaxed font-medium">
                                "{agent.systemInstruction}"
                              </p>
                           </div>
                        </div>
                     </div>

                     <div className="pt-10 mt-auto border-t border-white/5 grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => triggerEvolution(agent)}
                          className="py-4.5 bg-yellow-600/10 hover:bg-yellow-600 text-yellow-500 hover:text-black border border-yellow-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg flex items-center justify-center"
                        >
                          <i className="fa-solid fa-bolt mr-2 text-[8px]"></i> Evolve
                        </button>
                        <button 
                          onClick={() => { setShowDeploymentCode(agent.id); setActiveTab('deployments'); }}
                          className="py-4.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center"
                        >
                          <i className="fa-solid fa-cloud-arrow-up mr-2 text-[8px]"></i> View Shard
                        </button>
                     </div>
                  </div>
                ))}
             </div>
           )}
        </div>
      )}

      {activeTab === 'deployments' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-500">
           <div className="flex items-center justify-between border-b border-white/5 pb-8">
             <div className="space-y-1">
               <h2 className="text-3xl font-black text-white tracking-tight uppercase">Registry & Shards</h2>
               <p className="text-slate-500 text-sm font-medium">Monitoring programmatic connectivity for manifested neural nodes.</p>
             </div>
             <div className="flex space-x-8">
                <div className="text-right">
                   <p className="text-3xl font-black text-emerald-400 tracking-tighter">12ms</p>
                   <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Mesh Latency</p>
                </div>
             </div>
           </div>

           {hiredAgents.length === 0 ? (
             <div className="glass-card rounded-[4rem] p-32 text-center border-dashed border-2 border-white/10 space-y-10 shadow-inner">
                <p className="text-slate-500 text-xl font-medium">No agents registered for deployment.</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 gap-8">
                {hiredAgents.map(agent => (
                  <div key={agent.id} className="glass-card rounded-[2.5rem] p-8 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 bg-slate-900/40 hover:border-indigo-500/20 transition-all group">
                    <div className="flex items-center space-x-8">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/10 flex-shrink-0 shadow-lg">
                        <img src={agent.avatar} className="w-full h-full object-cover" alt={agent.name} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xl font-black text-white truncate tracking-tight uppercase">{agent.name}</h4>
                        <div className="flex items-center space-x-4 mt-1">
                           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest truncate">{agent.deploymentUrl}</p>
                           <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                           <span className="text-[10px] text-indigo-400 font-black uppercase">gRPC Enabled</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-4">
                       <button 
                        onClick={() => setShowDeploymentCode(agent.id)}
                        className="px-8 py-3.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95"
                       >
                         SDK Shard
                       </button>
                       <button className="w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl flex items-center justify-center text-slate-400 transition-all">
                          <i className="fa-solid fa-chart-line"></i>
                       </button>
                    </div>
                  </div>
                ))}
             </div>
           )}

           {/* SDK SHARD PREVIEW MODAL INTEGRATED */}
           {showDeploymentCode && (
             <div className="glass-card rounded-[4rem] p-16 border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.9)] space-y-12 relative overflow-hidden animate-in zoom-in-95 duration-500 bg-slate-950/80">
                <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none">
                  <i className="fa-solid fa-terminal text-[220px]"></i>
                </div>
                
                <div className="flex items-center justify-between relative z-10">
                   <div className="flex items-center space-x-6">
                      <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white text-3xl shadow-2xl shadow-indigo-600/30">
                         <i className="fa-solid fa-satellite-dish"></i>
                      </div>
                      <div>
                         <h3 className="text-4xl font-black text-white tracking-tighter uppercase leading-tight">Deployment Shard</h3>
                         <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">programmatic connection for {hiredAgents.find(a => a.id === showDeploymentCode)?.name}</p>
                      </div>
                   </div>
                   <button 
                    onClick={() => setShowDeploymentCode(null)}
                    className="w-14 h-14 bg-white/5 hover:bg-rose-600 hover:text-white rounded-2xl flex items-center justify-center text-slate-400 transition-all border border-white/5"
                   >
                      <i className="fa-solid fa-xmark text-2xl"></i>
                   </button>
                </div>

                <div className="space-y-4 relative z-10">
                   <div className="flex justify-between items-center px-4">
                      <p className="text-xs font-black text-indigo-400 uppercase tracking-[0.4em]">Node.js SDK Integration</p>
                      <span className="text-[9px] font-bold text-slate-600 uppercase">Protocol: HTTPS/gRPC</span>
                   </div>
                   <div className="bg-slate-950 rounded-[3rem] p-10 border border-white/5 font-mono text-sm text-indigo-300 relative group shadow-inner">
                      <pre className="overflow-x-auto custom-scrollbar leading-relaxed">
                         {getDeploymentSnippet(hiredAgents.find(a => a.id === showDeploymentCode)!)}
                      </pre>
                      <button 
                        onClick={() => {
                          const snippet = getDeploymentSnippet(hiredAgents.find(a => a.id === showDeploymentCode)!);
                          navigator.clipboard.writeText(snippet);
                          alert("Logic shard copied to secure clipboard.");
                        }}
                        className="absolute top-8 right-8 px-6 py-2.5 bg-white/5 hover:bg-white text-slate-400 hover:text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all opacity-0 group-hover:opacity-100 border border-white/5"
                      >
                         Copy Shard
                      </button>
                   </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed max-w-sm italic opacity-60">
                      "Each deployment shard creates a dedicated logical socket. Keep your API Master Token strictly isolated."
                   </p>
                   <button 
                    onClick={() => setShowDeploymentCode(null)}
                    className="px-14 py-6 bg-white text-black rounded-3xl font-black text-xs uppercase tracking-[0.3em] hover:bg-slate-200 transition-all shadow-2xl active:scale-95 border-none"
                   >
                      Acknowledge Manifest
                   </button>
                </div>
             </div>
           )}
        </div>
      )}

      {/* Global Metadata Footer Card */}
      <div className="bg-gradient-to-r from-indigo-950/40 via-slate-900/40 to-purple-950/40 rounded-[4rem] p-16 border border-white/10 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden group">
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-indigo-500/5 blur-[120px] group-hover:scale-150 transition-transform duration-1000"></div>
          <div className="flex items-center space-x-12 relative z-10">
             <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center text-slate-950 text-5xl shadow-2xl shadow-white/10 animate-float border-none">
                <i className="fa-solid fa-network-wired"></i>
             </div>
             <div className="space-y-3">
                <h4 className="text-4xl font-black text-white tracking-tighter uppercase leading-tight">Mesh Intelligence Protocol</h4>
                <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl">Every entity manifested contributes to the personal creative mesh. Synchronized multi-agent workflows are enabled via Nova's gRPC high-throughput logic channels.</p>
             </div>
          </div>
       </div>
    </div>
  );
};

export default AgentManagerFeature;
