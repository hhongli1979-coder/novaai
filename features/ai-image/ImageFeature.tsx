
import React, { useState } from 'react';
import { GeneratedImage } from '../../types';
import { generateImageWithGemini } from '../../services/geminiService';

const ImageFeature: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "16:9" | "9:16">("1:1");

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const url = await generateImageWithGemini(prompt, aspectRatio);
      const newImg: GeneratedImage = {
        id: Date.now().toString(),
        url,
        prompt,
        timestamp: new Date()
      };
      setHistory(prev => [newImg, ...prev]);
    } catch (error) {
      console.error(error);
      alert("Failed to generate image.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Prompt</h2>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A futuristic city with flying cars and neon lights, highly detailed, cyberpunk style..."
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-h-[150px] mb-4"
            />
            
            <h3 className="text-sm font-semibold text-slate-400 mb-2">Aspect Ratio</h3>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {(["1:1", "16:9", "9:16"] as const).map(ratio => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`py-2 rounded-xl text-sm font-medium border transition-all ${
                    aspectRatio === ratio 
                      ? 'bg-indigo-600 border-indigo-500 text-white' 
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>

            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-indigo-500/20 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center space-x-2">
                  <i className="fa-solid fa-circle-notch animate-spin"></i>
                  <span>Generating...</span>
                </span>
              ) : (
                'Generate Image'
              )}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 shadow-xl min-h-[400px]">
            <h2 className="text-xl font-bold mb-6">Generated Results</h2>
            {history.length === 0 && !isGenerating ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                <i className="fa-regular fa-image text-6xl mb-4 opacity-20"></i>
                <p>Your generated images will appear here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isGenerating && (
                  <div className="aspect-square bg-slate-900 rounded-2xl border border-slate-700 border-dashed animate-pulse flex items-center justify-center">
                    <i className="fa-solid fa-wand-magic-sparkles text-4xl text-indigo-500/50"></i>
                  </div>
                )}
                {history.map(img => (
                  <div key={img.id} className="group relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-700">
                    <img src={img.url} alt={img.prompt} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                      <p className="text-xs text-white line-clamp-2 mb-2">{img.prompt}</p>
                      <div className="flex space-x-2">
                         <a href={img.url} download={`nova-ai-${img.id}.png`} className="flex-1 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white py-2 rounded-lg text-center text-xs font-semibold">
                           <i className="fa-solid fa-download mr-1"></i> Download
                         </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageFeature;
