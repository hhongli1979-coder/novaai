
import React, { useState } from 'react';
import { translateText } from '../../services/geminiService';

const TranslateFeature: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [targetLang, setTargetLang] = useState('English');
  const [tone, setTone] = useState('professional');
  const [isTranslating, setIsTranslating] = useState(false);

  const languages = [
    'English', 'Chinese (Simplified)', 'Japanese', 'Spanish', 
    'French', 'German', 'Korean', 'Italian', 'Russian', 'Portuguese'
  ];

  const tones = [
    { id: 'professional', label: 'Professional', icon: 'fa-briefcase' },
    { id: 'casual', label: 'Casual', icon: 'fa-comments' },
    { id: 'creative', label: 'Creative', icon: 'fa-wand-magic-sparkles' },
    { id: 'formal', label: 'Formal', icon: 'fa-user-tie' }
  ];

  const handleTranslate = async () => {
    if (!inputText.trim() || isTranslating) return;

    setIsTranslating(true);
    try {
      const result = await translateText(inputText, targetLang, tone);
      setOutputText(result || '');
    } catch (error) {
      console.error(error);
      alert("Neural bridge unstable. Translation failed.");
    } finally {
      setIsTranslating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    alert("Translated text secured in clipboard.");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-4">
        <div className="inline-flex items-center px-4 py-1.5 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">Linguistic_Mapping_Node</div>
        <h1 className="text-6xl font-black tracking-tighter text-white">Neural <span className="gradient-text">Translator</span></h1>
        <p className="text-slate-400 text-xl font-medium">Context-aware global communication powered by Nova Intelligence.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
        {/* Source Input */}
        <div className="glass-card rounded-[3rem] p-10 border border-white/5 flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Source Input</span>
            <span className="text-[10px] font-bold text-indigo-400 uppercase bg-indigo-500/10 px-3 py-1 rounded-full">Auto-Detect</span>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text to translate..."
            className="flex-1 bg-transparent border-none text-2xl text-white font-medium resize-none focus:outline-none placeholder:text-slate-700"
          />
          <div className="flex justify-between items-center pt-6 border-t border-white/5">
             <div className="flex space-x-4">
                <button className="text-slate-500 hover:text-white transition-colors">
                   <i className="fa-solid fa-microphone"></i>
                </button>
             </div>
             <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{inputText.length} Characters</p>
          </div>
        </div>

        {/* Translation Output */}
        <div className="glass-card rounded-[3rem] p-10 border border-white/5 flex flex-col space-y-6 bg-indigo-600/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Neural Mapping</span>
            <select 
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="bg-slate-900 border border-white/10 text-white rounded-xl px-4 py-1 text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
            </select>
          </div>
          
          <div className="flex-1 flex flex-col justify-center relative">
            {isTranslating ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="text-xs font-black text-indigo-400 uppercase tracking-widest animate-pulse">Forging Dialect...</p>
              </div>
            ) : (
              <textarea
                readOnly
                value={outputText}
                placeholder="Translation will appear here..."
                className="w-full h-full bg-transparent border-none text-2xl text-indigo-100 font-medium resize-none focus:outline-none placeholder:text-slate-800"
              />
            )}
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-white/5">
             <div className="flex space-x-4">
                <button onClick={copyToClipboard} className="text-slate-500 hover:text-indigo-400 transition-colors">
                   <i className="fa-solid fa-copy"></i>
                </button>
                <button className="text-slate-500 hover:text-indigo-400 transition-colors">
                   <i className="fa-solid fa-volume-high"></i>
                </button>
             </div>
             <button 
                onClick={handleTranslate}
                disabled={!inputText.trim() || isTranslating}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50"
             >
                Synthesize
             </button>
          </div>
        </div>
      </div>

      {/* Tone Configuration */}
      <div className="glass-card rounded-[3rem] p-12 border border-white/5 space-y-8">
        <h3 className="text-xl font-black text-white uppercase tracking-widest flex items-center">
          <i className="fa-solid fa-sliders mr-4 text-indigo-400"></i> Contextual Nuance Forge
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {tones.map((t) => (
            <button
              key={t.id}
              onClick={() => setTone(t.id)}
              className={`p-8 rounded-[2rem] border transition-all flex flex-col items-center space-y-4 group ${
                tone === t.id 
                  ? 'bg-indigo-600 border-indigo-500 shadow-2xl' 
                  : 'bg-white/5 border-white/5 hover:bg-white/10'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all ${
                tone === t.id ? 'bg-white text-indigo-600' : 'bg-slate-900 text-slate-500 group-hover:text-white'
              }`}>
                <i className={`fa-solid ${t.icon}`}></i>
              </div>
              <span className={`text-[11px] font-black uppercase tracking-widest ${
                tone === t.id ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'
              }`}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TranslateFeature;
