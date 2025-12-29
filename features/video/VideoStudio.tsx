
import React, { useState, useEffect, useRef } from 'react';
import { GeneratedVideo } from '../../types';
import { generateVideoWithVeo } from '../../services/geminiService';
import { useSystem } from '../../context/SystemContext';

/**
 * Nova Cinema Studio
 * High-fidelity motion synthesis powered by Google Veo.
 */
const VideoStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [resolution, setResolution] = useState<'720p' | '1080p'>('1080p');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [results, setResults] = useState<GeneratedVideo[]>([]);
  const [hasApiKey, setHasApiKey] = useState(false);
  
  // Custom dropdown states
  const [resDropdownOpen, setResDropdownOpen] = useState(false);
  const [ratioDropdownOpen, setRatioDropdownOpen] = useState(false);
  
  const { settings } = useSystem();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkKeyStatus();
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setResDropdownOpen(false);
        setRatioDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const checkKeyStatus = async () => {
    try {
      const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
      setHasApiKey(!!hasKey);
    } catch (e) {
      console.error("Neural Authorization Check Failed", e);
    }
  };

  const handleOpenKeySelector = async () => {
    try {
      await (window as any).aistudio?.openSelectKey();
      setHasApiKey(true);
    } catch (e) {
      console.error("Authorization Interface Failed", e);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setProgressMsg("Connecting to Cinematic Render Cluster...");
    try {
      const videoUrl = await generateVideoWithVeo(prompt, resolution, aspectRatio, setProgressMsg);
      const newResult: GeneratedVideo = {
        id: Date.now().toString(),
        url: videoUrl,
        prompt: prompt,
        timestamp: new Date(),
        status: 'completed'
      };
      setResults(prev => [newResult, ...prev]);
    } catch (err: any) {
      console.error("Render Core Error:", err);
      if (err.message?.includes("Requested entity was not found")) {
        setHasApiKey(false);
        alert("API Session expired. Re-authorization required.");
      } else {
        alert("Cinematic forge encountered an error. Please verify your Billing-enabled API key.");
      }
    } finally {
      setIsGenerating(false);
      setProgressMsg('');
    }
  };

  if (settings.maintenanceMode || !settings.isVideoEnabled) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-10 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-rose-600/20 text-rose-500 rounded-3xl flex items-center justify-center text-4xl mb-8 shadow-2xl">
          <i className="fa-solid fa-clapperboard"></i>
        </div>
        <h2 className="text-4xl font-black mb-4 text-white tracking-tighter">Cinema Nodes Restricted</h2>
        <p className="text-slate-400 max-w-lg text-lg leading-relaxed font-medium">
          Autonomous motion synthesis is currently suspended for node calibration.
        </p>
      </div>
    );
  }

  if (!hasApiKey) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-10 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-indigo-600/20 text-indigo-400 rounded-3xl flex items-center justify-center text-4xl mb-8 animate-float shadow-2xl">
          <i className="fa-solid fa-shield-halved"></i>
        </div>
        <h2 className="text-4xl font-black mb-4 text-white tracking-tighter">Render Authorization Required</h2>
        <p className="text-slate-400 max-w-lg mb-10 text-lg leading-relaxed font-medium">
          Accessing Veo Cinema clusters requires a verified Master API Key linked to a paid billing project.
        </p>
        <button 
          onClick={handleOpenKeySelector}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/30 transition-all active:scale-95"
        >
          Initialize Key Sync
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center px-4 py-1.5 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">Neural_Motion_Synthesis</div>
          <h1 className="text-6xl font-black tracking-tighter text-white">CINEMA <span className="gradient-text">STUDIO</span></h1>
          <p className="text-slate-400 text-xl font-medium">Generate cinema-grade motion assets from pure linguistic blueprints.</p>
        </div>
      </header>

      <div className="glass-card rounded-[4rem] p-12 shadow-2xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <i className="fa-solid fa-video text-[160px]"></i>
        </div>

        <div className="space-y-10 relative z-10">
          <div className="space-y-4">
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest px-2">Production Script</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the cinematic sequence in high-fidelity detail..."
              className="w-full bg-slate-950/80 border border-slate-700 rounded-[2.5rem] p-8 text-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 text-xl min-h-[180px] transition-all shadow-inner"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10" ref={dropdownRef}>
            {/* RESOLUTION SELECTOR (CUSTOM DROPDOWN) */}
            <div className="space-y-4 relative">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest px-2 flex items-center">
                <i className="fa-solid fa-expand mr-3 text-indigo-400"></i> Output Fidelity
              </label>
              <button
                onClick={() => { setResDropdownOpen(!resDropdownOpen); setRatioDropdownOpen(false); }}
                disabled={isGenerating}
                className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest text-white flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer disabled:opacity-50 transition-all hover:bg-slate-900 shadow-inner group"
              >
                <span>{resolution === '1080p' ? '1080p Ultra High Fidelity' : '720p Standard Definition'}</span>
                <i className={`fa-solid fa-chevron-down transition-transform duration-300 ${resDropdownOpen ? 'rotate-180' : ''}`}></i>
              </button>
              
              {resDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-950/90 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden z-[100] shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                  <button
                    onClick={() => { setResolution('720p'); setResDropdownOpen(false); }}
                    className={`w-full text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b border-white/5 ${resolution === '720p' ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                  >
                    720p - Standard High Definition
                  </button>
                  <button
                    onClick={() => { setResolution('1080p'); setResDropdownOpen(false); }}
                    className={`w-full text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${resolution === '1080p' ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                  >
                    1080p - Ultra High Fidelity Cinema
                  </button>
                </div>
              )}
            </div>

            {/* ASPECT RATIO SELECTOR (CUSTOM DROPDOWN) */}
            <div className="space-y-4 relative">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest px-2 flex items-center">
                <i className="fa-solid fa-crop mr-3 text-indigo-400"></i> Frame Mapping
              </label>
              <button
                onClick={() => { setRatioDropdownOpen(!ratioDropdownOpen); setResDropdownOpen(false); }}
                disabled={isGenerating}
                className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest text-white flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer disabled:opacity-50 transition-all hover:bg-slate-900 shadow-inner group"
              >
                <span>{aspectRatio === '16:9' ? 'Landscape Cinema (16:9)' : 'Portrait / Mobile (9:16)'}</span>
                <i className={`fa-solid fa-chevron-down transition-transform duration-300 ${ratioDropdownOpen ? 'rotate-180' : ''}`}></i>
              </button>

              {ratioDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-950/90 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden z-[100] shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                  <button
                    onClick={() => { setAspectRatio('16:9'); setRatioDropdownOpen(false); }}
                    className={`w-full text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b border-white/5 ${aspectRatio === '16:9' ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                  >
                    Landscape Cinema (16:9)
                  </button>
                  <button
                    onClick={() => { setAspectRatio('9:16'); setRatioDropdownOpen(false); }}
                    className={`w-full text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${aspectRatio === '9:16' ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                  >
                    Portrait / Mobile (9:16)
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pt-6 border-t border-white/5">
            <div className="flex-1 space-y-3 w-full">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                 <span className="flex items-center">
                    <i className="fa-solid fa-check-double text-emerald-500 mr-2"></i>
                    Neural Sync: Active
                 </span>
                 <span>{isGenerating ? progressMsg : 'System Idle'}</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-700 ${isGenerating ? 'w-full animate-pulse' : 'w-0'}`}></div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="px-16 py-6 bg-white text-black rounded-3xl font-black text-sm uppercase tracking-[0.3em] hover:bg-slate-200 transition-all active:scale-95 shadow-2xl disabled:opacity-50 flex items-center group"
            >
              {isGenerating ? (
                <i className="fa-solid fa-atom animate-spin mr-4 text-xl"></i>
              ) : (
                <i className="fa-solid fa-bolt-lightning mr-4 group-hover:animate-bounce"></i>
              )}
              {isGenerating ? 'Synthesizing...' : 'Initialize Render'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {results.map(vid => (
          <div key={vid.id} className="glass-card rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl group flex flex-col hover:border-indigo-500/30 transition-all">
            <div className="aspect-video bg-black relative overflow-hidden">
              <video 
                src={vid.url} 
                controls 
                className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-1000"
                poster="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800"
              />
              <div className="absolute top-6 right-6">
                 <span className="px-4 py-1.5 bg-indigo-600/80 backdrop-blur-xl rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/20 shadow-lg">Veo v3.1 Engine</span>
              </div>
            </div>
            <div className="p-10 flex-1 flex flex-col justify-between space-y-6 bg-slate-900/40">
              <p className="text-slate-300 font-medium italic text-lg leading-relaxed">"{vid.prompt}"</p>
              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{vid.timestamp.toLocaleString()}</span>
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Format: {vid.url.includes('1080p') || resolution === '1080p' ? '1080p' : '720p'}</span>
                </div>
                <a 
                  href={vid.url} 
                  download={`nova-cinema-${vid.id}.mp4`}
                  className="px-8 py-3 bg-white/5 hover:bg-white text-white hover:text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10"
                >
                  Export Master
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoStudio;
