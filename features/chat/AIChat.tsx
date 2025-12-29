
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../../types';
import { chatWithGemini } from '../../services/geminiService';
import { useSystem } from '../../context/SystemContext';

const AIChat: React.FC = () => {
  const { settings } = useSystem();
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
      
      const aiResponse = await chatWithGemini(input, history);
      
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
    <div className="flex flex-col h-full glass-card rounded-3xl overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex items-center space-x-4">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl">
          <i className="fa-solid fa-robot"></i>
        </div>
        <div>
          <h2 className="text-xl font-bold">Creative Assistant</h2>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            <span className="text-xs text-slate-400">Nova is online • Running {settings.activeModel}</span>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950/20">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
            }`}>
              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              <p className={`text-[10px] mt-2 opacity-50 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-800 text-slate-200 border border-slate-700 rounded-2xl rounded-bl-none p-4 flex space-x-1">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-slate-900/50 border-t border-slate-800">
        <div className="relative flex items-end space-x-4">
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
              placeholder="Ask Nova anything..."
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-5 py-4 pr-12 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none min-h-[60px]"
              rows={1}
            />
            <div className="absolute right-3 bottom-3 flex space-x-2">
              <button className="p-2 text-slate-500 hover:text-indigo-400 transition-colors">
                <i className="fa-solid fa-microphone"></i>
              </button>
            </div>
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="w-14 h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:hover:bg-indigo-600"
          >
            <i className="fa-solid fa-paper-plane text-xl"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
