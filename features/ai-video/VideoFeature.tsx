
import React, { useState } from 'react';
import { GeneratedVideo } from '../../types';
import { generateVideoWithVeo } from '../../services/geminiService';

const VideoFeature: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [resolution, setResolution] = useState<'720p' | '1080p'>('720p');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [videos, setVideos] = useState<GeneratedVideo[]>([]);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setStatusMsg("Starting generation process...");
    try {
      // Fix: Added the missing aspectRatio argument and provided resolution state
      const url = await generateVideoWithVeo(prompt, resolution, aspectRatio, setStatusMsg);
      const newVideo: GeneratedVideo = {
        id: Date.now().toString(),
        url,
        prompt,
        status: 'completed',
        timestamp: new Date()
      };
      setVideos(prev => [newVideo, ...prev]);
    } catch (error) {
      console.error(error);
      alert("Video generation failed. Ensure you have selected a paid API key via window.aistudio.");
    } finally {
      setIsGenerating(false);
      setStatusMsg('');
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <i className="fa-solid fa-clapperboard text-9xl"></i>
        </div>

        <h2 className="text-2xl font-bold mb-2">Cinematic Video Studio</h2>
        <p className="text-slate-400 mb-8 max-w-2xl">
          Bring your ideas to life with state-of-the-art video generation powered by Google Veo.
        </p>

        <div className="flex flex-col space-y-4 mb-6 relative">
          <div className="relative">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A slow tracking shot of a mysterious forest with bioluminescent plants..."
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-5 pr-40 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="absolute right-2 top-2 bottom-2 bg-indigo-600 text-white px-8 rounded-xl font-bold hover:bg-indigo-500 transition-all disabled:opacity-50"
            >
              {isGenerating ? 'Processing...' : 'Create Video'}
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Quality:</span>
              <div className="flex p-1 bg-slate-900 rounded-xl border border-slate-700">
                {(['720p', '1080p'] as const).map((res) => (
                  <button
                    key={res}
                    onClick={() => setResolution(res)}
                    disabled={isGenerating}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      resolution === res 
                        ? 'bg-indigo-600 text-white shadow-lg' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {res}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Ratio:</span>
              <div className="flex p-1 bg-slate-900 rounded-xl border border-slate-700">
                {(['16:9', '9:16'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    disabled={isGenerating}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      aspectRatio === ratio 
                        ? 'bg-indigo-600 text-white shadow-lg' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <span className="text-[10px] text-slate-500 italic">
            {resolution === '1080p' ? 'Higher resolution takes slightly longer to render.' : 'Standard high definition.'}
          </span>
        </div>

        {isGenerating && (
          <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-2xl p-4 flex items-center space-x-4 animate-pulse">
            <i className="fa-solid fa-circle-notch animate-spin text-indigo-400"></i>
            <span className="text-indigo-300 font-medium">{statusMsg}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {videos.map(vid => (
          <div key={vid.id} className="bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden shadow-xl">
            <video 
              src={vid.url} 
              controls 
              className="w-full aspect-video object-cover"
              poster="https://picsum.photos/800/450"
            />
            <div className="p-6">
              <p className="text-sm text-slate-300 line-clamp-2 mb-4">"{vid.prompt}"</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {vid.timestamp.toLocaleDateString()}
                </span>
                <a 
                  href={vid.url} 
                  download={`nova-vid-${vid.id}.mp4`}
                  className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold flex items-center"
                >
                  <i className="fa-solid fa-download mr-2"></i> Download MP4
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoFeature;
