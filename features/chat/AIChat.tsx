
import React, { useState, useRef, useEffect } from 'react';
import { Message, AIAgent } from '../../types';
import { chatWithGemini } from '../../services/geminiService';
import { useSystem } from '../../context/SystemContext';
import { GoogleGenAI } from "@google/genai";
import { MODELS } from "../../constants";

const AIChat: React.FC = () => {
  const { settings, hiredAgents } = useSystem();
  const [activeAgent, setActiveAgent] = useState<AIAgent | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: "Hello! I'm Nova, your creative AI assistant. How can I help you build today?", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const history = messages.map(m => ({
        role: (m.role === 'assistant' ? 'model' : 'user') as 'user' | 'model',
        parts: [{ text: m.content }]
      }));
      
      let aiResponse;
      if (activeAgent) {
        // Direct call to Gemini using the agent's custom instruction
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: MODELS.TEXT,
          contents: history.concat([{ role: 'user', parts: [{ text: input }] }]),
          config: {
            systemInstruction: activeAgent.systemInstruction,
            temperature: 0.7,
          },
        });
        aiResponse = response.text;
      } else {
        aiResponse = await chatWithGemini(input, history);
      }
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse || "I'm sorry, I couldn't process that.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Oops, something went wrong. Please check your connection and try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const switchAgent = (agent: AIAgent | null) => {
    setActiveAgent(agent);
    const welcomeMsg = agent 
      ? `System Protocol: Switching to ${agent.name} neural cluster. How can my expertise assist you?`
      : "Returning to Nova Core Intelligence.";
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'assistant',
      content: welcomeMsg,
      timestamp: new Date()
    }]);
  };

  if (settings.maintenanceMode || !settings.isChatEnabled) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-10 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-rose-600/20 text-rose-500 rounded-3xl flex items-center justify-center text-4xl mb-8 shadow-2xl">
          <i className="fa-solid fa-brain"></i>
        </div>
        <h2 className="text-4xl font-black mb-4 text-white tracking-tighter">Neural Link Offline</h2>
        <p className="text-slate-400 max-w-lg text-lg leading-relaxed font-medium">
          The Nova Intelligence module is currently undergoing optimization. Please revert to the Command Center.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full gap-8 animate-in fade-in duration-700">
      {/* Chat Interface */}
      <div className="flex-1 flex flex-col glass-card rounded-[3rem] overflow-hidden shadow-2xl border border-white/5">
        <div className="p-8 border-b border-white/5 bg-slate-900/50 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl shadow-2xl ${activeAgent ? 'bg-indigo-600 animate-pulse' : 'bg-slate-800'}`}>
              <i className={`fa-solid ${activeAgent ? 'fa-user-tie' : 'fa-robot'}`}></i>
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">{activeAgent ? activeAgent.name : 'Nova Core'}</h2>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{activeAgent ? activeAgent.specialty : 'Base Creative Engine'}</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Neural Link: Stable</span>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 bg-slate-950/20 custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-[2rem] p-6 shadow-2xl ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white/5 text-slate-200 border border-white/10 rounded-tl-none backdrop-blur-xl'
              }`}>
                <p className="whitespace-pre-wrap leading-relaxed text-sm font-medium">{msg.content}</p>
                <p className={`text-[10px] mt-3 opacity-40 font-black uppercase tracking-widest ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white/5 text-slate-200 border border-white/5 rounded-2xl rounded-bl-none p-5 flex space-x-1 shadow-2xl">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
        </div>

        <div className="p-8 bg-slate-900/50 border-t border-white/5">
          <div className="relative flex items-center space-x-4">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={activeAgent ? `Consult ${activeAgent.name}...` : "Command Nova Intelligence..."}
                className="w-full bg-slate-950 border border-white/10 rounded-[2rem] px-8 py-6 text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 resize-none min-h-[72px] transition-all shadow-inner"
                rows={1}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="w-16 h-16 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-indigo-600/30 transition-all disabled:opacity-50 active:scale-90"
            >
              <i className="fa-solid fa-bolt-lightning text-xl"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Assistant Selector Panel */}
      <div className="w-80 flex flex-col space-y-6">
        <div className="glass-card rounded-[2.5rem] p-8 border border-white/5 flex flex-col h-full shadow-2xl">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Neural Collective</h3>
              <i className="fa-solid fa-users-viewfinder text-indigo-400"></i>
           </div>

           <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
              <button 
                onClick={() => switchAgent(null)}
                className={`w-full p-5 rounded-2xl border transition-all flex items-center space-x-4 ${
                  activeAgent === null ? 'bg-indigo-600/10 border-indigo-500 text-white' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'
                }`}
              >
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-inner">
                  <i className="fa-solid fa-atom"></i>
                </div>
                <div className="text-left">
                  <p className="text-xs font-black uppercase tracking-widest">Nova Core</p>
                  <p className="text-[9px] font-bold opacity-50">Base Intelligence</p>
                </div>
              </button>

              <div className="pt-4 border-t border-white/5">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4 text-center">Leased Experts</p>
                {hiredAgents.length === 0 ? (
                  <div className="text-center py-8 space-y-4">
                     <p className="text-[10px] text-slate-500 font-bold leading-relaxed px-4">No specialized assistants leased from marketplace.</p>
                     <i className="fa-solid fa-store text-slate-800 text-3xl opacity-20"></i>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {hiredAgents.map(agent => (
                      <button 
                        key={agent.id}
                        onClick={() => switchAgent(agent)}
                        className={`w-full p-5 rounded-2xl border transition-all flex items-center space-x-4 group ${
                          activeAgent?.id === agent.id ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-inner border border-white/10 flex-shrink-0">
                           <img src={agent.avatar} className="w-full h-full object-cover" alt={agent.name} />
                        </div>
                        <div className="text-left flex-1 min-w-0">
                          <p className="text-xs font-black uppercase tracking-widest truncate">{agent.name.split('"')[1] || agent.name}</p>
                          <p className={`text-[9px] font-bold truncate ${activeAgent?.id === agent.id ? 'text-indigo-200' : 'text-slate-500'}`}>{agent.specialty.split(' ')[0]}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
           </div>

           <div className="mt-8 p-6 bg-indigo-600/5 rounded-3xl border border-indigo-500/10">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">System Insight</p>
              <p className="text-[10px] text-slate-500 font-bold leading-relaxed italic">"Switching agents dynamically reconfigures the neural gateway for specialized logical throughput."</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
