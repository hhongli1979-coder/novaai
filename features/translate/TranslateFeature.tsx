
import React, { useState, useEffect, useRef } from 'react';
import { translateText, generateSpeech, decodeBase64, playPcmAudio } from '../../services/geminiService';

const TranslateFeature: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [targetLang, setTargetLang] = useState('English');
  const [tone, setTone] = useState('professional');
  const [selectedVoice, setSelectedVoice] = useState('Kore');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  const languages = [
    'English', 'Chinese (Simplified)', 'Japanese', 'Spanish', 
    'French', 'German', 'Korean', 'Italian', 'Russian', 'Portuguese', 'Arabic', 'Hindi'
  ];

  const voices = [
    { id: 'Kore', label: 'Kore (Neutral)' },
    { id: 'Puck', label: 'Puck (Soft)' },
    { id: 'Charon', label: 'Charon (Deep)' },
    { id: 'Fenrir', label: 'Fenrir (Bold)' },
    { id: 'Zephyr', label: 'Zephyr (Bright)' }
  ];

  const tones = [
    { id: 'professional', label: 'Professional', icon: 'fa-briefcase' },
    { id: 'casual', label: 'Casual', icon: 'fa-comments' },
    { id: 'creative', label: 'Creative', icon: 'fa-wand-magic-sparkles' },
    { id: 'formal', label: 'Formal', icon: 'fa-user-tie' }
  ];

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => prev ? `${prev} ${transcript}` : transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const handleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

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

  const handleSpeak = async () => {
    if (!outputText || isSpeaking) return;
    setIsSpeaking(true);
    try {
      const base64Audio = await generateSpeech(outputText, selectedVoice);
      const audioData = decodeBase64(base64Audio);
      await playPcmAudio(audioData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSpeaking(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center px-4 py-1.5 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">Neural_Linguistics_v4.2</div>
          <h1 className="text-6xl font-black tracking-tighter text-white">NEURAL <span className="gradient-text">TRANSLATOR</span></h1>
          <p className="text-slate-400 text-xl font-medium">Context-aware global mapping for autonomous communication.</p>
        </div>
        <div className="flex bg-slate-900 border border-white/5 rounded-2xl p-2 gap-2">
           {voices.map(v => (
             <button 
                key={v.id} 
                onClick={() => setSelectedVoice(v.id)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedVoice === v.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
             >
                {v.id}
             </button>
           ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
        {/* Source Input */}
        <div className="glass-card rounded-[3rem] p-10 border border-white/5 flex flex-col space-y-6 group hover:border-white/10 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Natural Language Input</span>
            <span className="text-[10px] font-bold text-indigo-400 uppercase bg-indigo-500/10 px-3 py-1 rounded-full">Source Detected</span>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your instruction or speak into the microphone..."
            className="flex-1 bg-transparent border-none text-2xl text-white font-medium resize-none focus:outline-none placeholder:text-slate-800 scrollbar-hide"
          />
          <div className="flex justify-between items-center pt-6 border-t border-white/5">
             <div className="flex space-x-4">
                <button 
                  onClick={handleListen}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isListening ? 'bg-rose-500 text-white animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.4)]' : 'bg-white/5 text-slate-500 hover:bg-white/10 hover:text-white'}`}
                  title="Speech to Text"
                >
                   <i className={`fa-solid ${isListening ? 'fa-stop' : 'fa-microphone'} text-xl`}></i>
                </button>
                <button 
                  onClick={() => setInputText('')}
                  className="w-14 h-14 rounded-2xl bg-white/5 text-slate-500 hover:bg-white/10 hover:text-rose-400 flex items-center justify-center transition-all"
                  title="Clear Input"
                >
                   <i className="fa-solid fa-trash-can text-lg"></i>
                </button>
             </div>
             <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{inputText.length} Neural Packets</p>
          </div>
        </div>

        {/* Translation Output */}
        <div className="glass-card rounded-[3rem] p-10 border border-white/5 flex flex-col space-y-6 bg-indigo-600/5 group hover:border-indigo-500/20 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
               <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Mapping to</span>
               <select 
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="bg-slate-900 border border-white/10 text-white rounded-xl px-4 py-1.5 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer shadow-xl"
               >
                {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
               </select>
            </div>
            <i className="fa-solid fa-bolt-lightning text-indigo-400 animate-pulse"></i>
          </div>
          
          <div className="flex-1 flex flex-col justify-center relative">
            {isTranslating ? (
              <div className="flex flex-col items-center space-y-6">
                <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin shadow-[0_0_30px_rgba(99,102,241,0.2)]"></div>
                <p className="text-xs font-black text-indigo-400 uppercase tracking-[0.4em] animate-pulse">Synthesizing Dialect...</p>
              </div>
            ) : (
              <textarea
                readOnly
                value={outputText}
                placeholder="Localized synthesis will materialize here..."
                className="w-full h-full bg-transparent border-none text-2xl text-indigo-100 font-medium resize-none focus:outline-none placeholder:text-slate-900 scrollbar-hide"
              />
            )}
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-white/5">
             <div className="flex space-x-4">
                <button onClick={copyToClipboard} className="w-14 h-14 rounded-2xl bg-white/5 text-slate-500 hover:bg-white/10 hover:text-indigo-400 flex items-center justify-center transition-all" title="Copy Translation">
                   <i className="fa-solid fa-copy text-lg"></i>
                </button>
                <button 
                  onClick={handleSpeak}
                  disabled={!outputText || isSpeaking}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isSpeaking ? 'bg-indigo-500 text-white animate-bounce shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'bg-white/5 text-slate-500 hover:bg-white/10 hover:text-indigo-400 disabled:opacity-30'}`}
                  title="Vocalize"
                >
                   <i className={`fa-solid ${isSpeaking ? 'fa-spinner animate-spin' : 'fa-volume-high'} text-xl`}></i>
                </button>
             </div>
             <button 
                onClick={handleTranslate}
                disabled={!inputText.trim() || isTranslating}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl shadow-indigo-600/30 disabled:opacity-50 active:scale-95 flex items-center"
             >
                {isTranslating ? 'Processing...' : 'Engage Map'}
             </button>
          </div>
        </div>
      </div>

      {/* Tone & Context Section */}
      <div className="glass-card rounded-[4rem] p-12 border border-white/5 space-y-10 shadow-2xl">
        <div className="flex items-center justify-between">
           <h3 className="text-2xl font-black text-white tracking-tighter flex items-center">
             <i className="fa-solid fa-sliders mr-4 text-indigo-400"></i> Contextual Nuance Forge
           </h3>
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Algorithm: NeuralMapping_v4</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {tones.map((t) => (
            <button
              key={t.id}
              onClick={() => setTone(t.id)}
              className={`p-8 rounded-[2.5rem] border transition-all flex flex-col items-center space-y-6 group relative overflow-hidden ${
                tone === t.id 
                  ? 'bg-indigo-600 border-indigo-500 shadow-2xl scale-105' 
                  : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06]'
              }`}
            >
              {tone === t.id && (
                <div className="absolute top-0 right-0 p-4">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_10px_#fff]"></div>
                </div>
              )}
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all ${
                tone === t.id ? 'bg-white text-indigo-600' : 'bg-slate-900 text-slate-500 group-hover:text-white shadow-inner'
              }`}>
                <i className={`fa-solid ${t.icon}`}></i>
              </div>
              <div className="text-center">
                <span className={`text-sm font-black uppercase tracking-widest block ${
                  tone === t.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                }`}>{t.label}</span>
                <span className={`text-[9px] font-bold mt-1 block opacity-50 uppercase ${tone === t.id ? 'text-indigo-100' : 'text-slate-600'}`}>Target Logic</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TranslateFeature;
