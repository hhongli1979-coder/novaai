
import React, { useState } from 'react';
import { GeneratedImage } from '../../types';
import { generateImageWithGemini } from '../../services/geminiService';
import { useSystem } from '../../context/SystemContext';

const ImageForge: React.FC = () => {
  const { settings } = useSystem();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<GeneratedImage[]>([]);
  const [isPro, setIsPro] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const imageUrl = await generateImageWithGemini(prompt, isPro);
      const newResult: GeneratedImage = {
        id: Date.now().toString(),
        url: imageUrl,
        prompt: prompt,
        timestamp: new Date()
      };
      setResults(prev => [newResult, ...prev]);
    } catch (err) {
      console.error(err);
      alert("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (settings.maintenanceMode || !settings.isImageEnabled) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-10 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-rose-600/20 text-rose-500 rounded-3xl flex items-center justify-center text-4xl mb-8 shadow-2xl">
          <i className="fa-solid fa-palette"></i>
        </div>
        <h2 className="text-4xl font-black mb-4 text-white tracking-tighter">Pixel Foundry Offline</h2>
        <p className="text-slate-400 max-w-lg text-lg leading-relaxed font-medium">
          The autonomous image generation engine has been temporarily restricted for system optimization.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-700">
      <div className="lg:col-span-1 space-y-6">
        <div className="glass-card rounded-3xl p-8 border border-slate-700 shadow-xl">
          <h2 className="text-2xl font-bold mb-6">Forge Parameters</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-2">Prompt Description</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A futuristic solarpunk library with giant floating trees, glowing blue dust, 8k resolution, cinematic lighting..."
                className="w-full bg-slate-950/80 border border-slate-700 rounded-2xl p-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-h-[160px]"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-900 rounded-2xl border border-slate-800">
              <div>
                <p className="font-bold text-slate-200">Pro Quality</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Ultra-HD Rendering</p>
              </div>
              <button 
                onClick={() => setIsPro(!isPro)}
                className={`w-12 h-6 rounded-full transition-colors relative ${isPro ? 'bg-indigo-600' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isPro ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/20 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <i className="fa-solid fa-circle-notch animate-spin"></i>
                  <span>Forging...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-palette"></i>
                  <span>Forge Asset</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-8 border border-slate-700 shadow-xl">
          <h3 className="text-lg font-bold mb-4">Neural Health</h3>
          <div className="space-y-4">
             <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                <span>Rendering Engine</span>
                <span className="text-emerald-400">Stable</span>
             </div>
             <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <p className="text-[10px] text-slate-400 font-medium">Using: <span className="text-white font-bold">{isPro ? 'Gemini 3 Pro' : 'Gemini 2.5 Flash'}</span></p>
             </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Generated Assets</h2>
          <span className="text-sm text-slate-500">{results.length} total creations</span>
        </div>

        {results.length === 0 && !isGenerating ? (
          <div className="h-[500px] glass-card rounded-3xl border-dashed border-2 border-slate-800 flex flex-col items-center justify-center text-slate-600">
            <i className="fa-regular fa-image text-8xl mb-6 opacity-20"></i>
            <p className="text-xl font-medium">Your forge is cold. Start a generation to see results.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {isGenerating && (
              <div className="aspect-square bg-slate-900/50 rounded-3xl border border-slate-800 flex flex-col items-center justify-center text-slate-500 animate-pulse">
                <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                <p className="font-medium">Crafting pixels...</p>
              </div>
            )}
            {results.map(res => (
              <div key={res.id} className="group relative bg-slate-900 rounded-3xl overflow-hidden shadow-2xl transition-all hover:scale-[1.01] border border-slate-800">
                <img src={res.url} alt={res.prompt} className="w-full h-full object-cover aspect-square" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                  <p className="text-xs text-white line-clamp-2 mb-4 font-medium italic">"{res.prompt}"</p>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => window.open(res.url, '_blank')}
                      className="flex-1 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white py-2 rounded-xl text-xs font-bold transition-all"
                    >
                      <i className="fa-solid fa-expand mr-2"></i> View Full
                    </button>
                    <a 
                      href={res.url} 
                      download={`nova-forge-${res.id}.png`}
                      className="w-10 h-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center justify-center transition-all"
                    >
                      <i className="fa-solid fa-download"></i>
                    </a>
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

export default ImageForge;
