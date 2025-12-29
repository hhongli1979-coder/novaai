
import React, { useState, useEffect } from 'react';
import { GeneratedVideo } from '../../types';
import { generateVideoWithVeo } from '../../services/geminiService';
import { useSystem } from '../../context/SystemContext';

const VideoStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [resolution, setResolution] = useState<'720p' | '1080p'>('1080p');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [results, setResults] = useState<GeneratedVideo[]>([]);
  const [hasApiKey, setHasApiKey] = useState(false);
  const { settings } = useSystem();

  useEffect(() => {
    checkKeyStatus();
  }, []);

  const checkKeyStatus = async () => {
    try {
      const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
      setHasApiKey(!!hasKey);
    } catch (e) {
      console.error("AI Studio API check failed", e);
    }
  };

  const handleOpenKeySelector = async () => {
    try {
      await (window as any).aistudio?.openSelectKey();
      // Assume success as per guidelines to avoid race condition
      setHasApiKey(true);
    } catch (e) {
      console.error("Failed to open key selector", e);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      // Pass both selected resolution and aspect ratio to the Veo service
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
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        setHasApiKey(false);
        alert("API Key session expired. Please re-select your Billing-enabled API key.");
      } else {
        alert("Video generation encountered an error. Please ensure you have a valid Billing-enabled project and are using a Veo-compatible API key.");
      }
    } finally {
      setIsGenerating(false);
      setProgressMsg('');
    }
  };

  if (settings.maintenanceMode || !settings.isVideoEnabled) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-10 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-rose-600/20 text-rose-500 rounded-3xl flex items-center justify-center text-4xl mb-8 shadow-2xl shadow-rose-500/10">
          <i className="fa-solid fa-server"></i>
        </div>
        <h2 className="text-4xl font-black mb-4 text-white tracking-tighter">Cinema Cluster Offline</h2>
        <p className="text-slate-400 max-w-lg mb-10 text-lg leading-relaxed font-medium">
          The cinematic rendering nodes are currently restricted for maintenance. Please check the System Master console for real-time status.
        </p>
      </div>
    );
  }

  if (!hasApiKey) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-10 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-indigo-600/20 text-indigo-500 rounded-3xl flex items-center justify-center text-4xl mb-8 animate-float shadow-2xl shadow-indigo-500/10">
          <i className="fa-solid fa-key"></i>
        </div>
        <h2 className="text-4xl font-black mb-4 text-white tracking-tighter">Premium Authorization Required</h2>
        <p className="text-slate-400 max-w-lg mb-10 text-lg leading-relaxed font-medium">
          Nova Cinema Studio requires a dedicated Billing-enabled project to access Veo generation models.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={handleOpenKeySelector}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-indigo-500/30 transition-all transform hover:-translate-y-1"
          >
            Authenticate API Key
          </button>
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-10 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all"
          >
            Billing Docs
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center px-4 py-1.5 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-2">Autonomous Cinematography Node</div>
        <h1 className="text-6xl font-black tracking-tighter text-white">Cinema <span className="gradient-text">Studio</span></h1>
        <p className="text-slate-400 text-xl max-w-2xl mx-auto font-medium">Convert textual script into high-fidelity cinematic motion assets.</p>
      </header>

      <div className="glass-card rounded-[4rem] p-10 shadow-2xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
          <i className="fa-solid fa-film text-[140px]"></i>
        </div>

        <div className="space-y-10 relative z-10">
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Production Blueprint</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g. A panoramic drone shot of a futuristic neon mountain range at dusk, cinematic lighting, 8k textures, high-quality rendering..."
              className="w-full bg-slate-950/80 border border-slate-700 rounded-[2.5rem] p-8 text-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 text-xl min-h-[160px] transition-all shadow-inner"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 px-2">Resolution</label>
              <div className="flex items-center bg-slate-950/50 p-1.5 rounded-[2rem] border border-slate-800">
                {(['720p', '1080p'] as const).map((res) => (
                  <button
                    key={res}
                    onClick={() => setResolution(res)}
                    disabled={isGenerating}
                    className={`flex-1 py-4 rounded-[1.5rem] font-black transition-all flex flex-col items-center ${
                      resolution === res 
                        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' 
                        : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <span className="text-base">{res}</span>
                    <span className={`text-[9px] uppercase tracking-tighter opacity-60 font-bold ${resolution === res ? 'text-indigo-100' : 'text-slate-600'}`}>
                      {res === '720p' ? 'Rapid' : 'Ultra'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 px-2">Aspect Ratio</label>
              <div className="flex items-center bg-slate-950/50 p-1.5 rounded-[2rem] border border-slate-800">
                {(['16:9', '9:16'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    disabled={isGenerating}
                    className={`flex-1 py-4 rounded-[1.5rem] font-black transition-all flex flex-col items-center ${
                      aspectRatio === ratio 
                        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' 
                        : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <span className="text-base">{ratio === '16:9' ? 'Landscape' : 'Portrait'}</span>
                    <span className={`text-[9px] uppercase tracking-tighter opacity-60 font-bold ${aspectRatio === ratio ? 'text-indigo-100' : 'text-slate-600'}`}>
                      {ratio}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pt-4">
            <div className="flex-1 space-y-4 w-full bg-white/5 p-6 rounded-[2.5rem] border border-white/5">
              <div className="flex items-center space-x-2 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">
                <i className="fa-solid fa-bolt text-indigo-400"></i>
                <span>Node Prediction</span>
              </div>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">
                Allocating resources for <b>{resolution}</b> generation in <b>{aspectRatio}</b>. 
                Estimated compute cycle: ~{resolution === '1080p' ? '180' : '90'}s.
              </p>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="w-full lg:w-auto px-20 py-6 bg-white text-black rounded-[2.5rem] font-black text-xl uppercase tracking-widest shadow-2xl shadow-white/10 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:transform-none"
            >
              {isGenerating ? (
                <span className="flex items-center space-x-3">
                  <i className="fa-solid fa-atom animate-spin"></i>
                  <span>Forging...</span>
                </span>
              ) : (
                'Forge Video'
              )}
            </button>
          </div>

          {isGenerating && (
            <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-6 flex items-center space-x-5 animate-pulse">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-xl text-indigo-400 shadow-inner">
                <i className="fa-solid fa-film"></i>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-indigo-100 font-black uppercase tracking-widest">{progressMsg}</span>
                <span className="text-[10px] text-indigo-400/60 font-bold uppercase tracking-widest">Global Compute Cluster 09 • Node Active</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-10">
        <div className="flex items-center justify-between px-4">
          <h2 className="text-3xl font-black flex items-center space-x-4 text-white tracking-tighter">
            <i className="fa-solid fa-layer-group text-indigo-400"></i>
            <span>Vault Archive</span>
          </h2>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{results.length} Digital Assets</span>
        </div>

        {results.length === 0 ? (
          <div className="h-64 glass-card rounded-[4rem] flex flex-col items-center justify-center text-slate-700 border-dashed border-2 border-slate-800/50">
            <i className="fa-solid fa-circle-play text-7xl mb-6 opacity-5"></i>
            <p className="text-xl font-bold tracking-tight opacity-30">Your cinematic archive is empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {results.map(vid => (
              <div key={vid.id} className="glass-card rounded-[3.5rem] overflow-hidden shadow-2xl group border border-white/5 transition-all hover:bg-white/[0.03]">
                <div className="aspect-video relative overflow-hidden bg-slate-950">
                  <video 
                    src={vid.url} 
                    controls 
                    className="w-full h-full object-cover"
                    poster={`https://picsum.photos/seed/${vid.id}/1280/720?grayscale`}
                  />
                  <div className="absolute top-6 right-6 pointer-events-none">
                    <span className="bg-black/70 backdrop-blur-xl text-white text-[10px] font-black px-4 py-1.5 rounded-full border border-white/10 uppercase tracking-widest shadow-2xl">Master_Render</span>
                  </div>
                </div>
                <div className="p-8 space-y-8">
                  <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed font-medium italic opacity-80">"{vid.prompt}"</p>
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{vid.timestamp.toLocaleDateString()}</span>
                      <span className="text-[9px] text-indigo-400 font-black tracking-widest uppercase">Neural Blueprint Node</span>
                    </div>
                    <div className="flex space-x-4">
                       <button className="text-slate-500 hover:text-indigo-400 transition-colors p-3 bg-white/5 rounded-xl border border-white/5">
                        <i className="fa-solid fa-share-nodes"></i>
                       </button>
                       <a 
                        href={vid.url} 
                        download={`nova-cinema-${vid.id}.mp4`} 
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center shadow-xl shadow-indigo-600/20 active:scale-95"
                       >
                          <i className="fa-solid fa-download mr-3"></i>
                          Download
                       </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoStudio;
