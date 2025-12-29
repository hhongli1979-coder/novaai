
import React, { useState, useRef, useEffect } from 'react';
import { analyzeSpatialScene } from '../../services/geminiService';

interface PlacedAsset {
  id: number;
  itemId: number;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

const VirtualStore: React.FC = () => {
  const [activeItem, setActiveItem] = useState(0);
  const [showAR, setShowAR] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [spatialAdvice, setSpatialAdvice] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  // Placement State
  const [placedAssets, setPlacedAssets] = useState<PlacedAsset[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null);
  
  // Ghost / Current Manipulation State
  const [currentPos, setCurrentPos] = useState({ x: 50, y: 50 });
  const [currentScale, setCurrentScale] = useState(1);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const mockItems = [
    { 
      name: 'Nova Pods Max', 
      price: '$549', 
      img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800', 
      description: 'Immersive spatial audio with neural noise cancellation and ultra-low latency rendering.' 
    },
    { 
      name: 'Creative Tablet Pro', 
      price: '$1,299', 
      img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800', 
      description: 'The ultimate canvas for autonomous design workflows. Precision OLED spatial display.' 
    },
    { 
      name: 'Studio Lens Kit', 
      price: '$899', 
      img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800', 
      description: 'Cinema-grade optics for the modern creator. Optimized for 8K neural cinematography.' 
    }
  ];

  const startAR = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } 
      });
      setStream(mediaStream);
      setShowAR(true);
      setIsScanning(true);
      setTimeout(() => setIsScanning(false), 2500);
    } catch (err) {
      console.error("Camera access failed:", err);
      alert("AR View requires camera permissions.");
    }
  };

  const stopAR = () => {
    if (stream) stream.getTracks().forEach(track => track.stop());
    setStream(null);
    setShowAR(false);
    setSpatialAdvice(null);
    setPlacedAssets([]);
    setSelectedAssetId(null);
  };

  const handleAIAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsAnalyzing(true);
    setSpatialAdvice("Analyzing room geometry...");
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      try {
        const advice = await analyzeSpatialScene(canvas.toDataURL('image/jpeg', 0.8));
        setSpatialAdvice(advice || "Surface detected. Tap to anchor asset.");
      } catch (err) {
        setSpatialAdvice("Neural node unavailable. Using local spatial rules.");
      }
    }
    setIsAnalyzing(false);
  };

  const handleCanvasInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    if (!showAR || isScanning) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    if (e.type === 'mousedown' || e.type === 'touchstart') {
      // Check if clicking near an existing asset to select it
      const clickedAsset = placedAssets.find(a => Math.abs(a.x - x) < 5 && Math.abs(a.y - y) < 5);
      if (clickedAsset) {
        setSelectedAssetId(clickedAsset.id);
        setCurrentScale(clickedAsset.scale);
        setCurrentRotation(clickedAsset.rotation);
        setSpatialAdvice(`Editing ${mockItems[clickedAsset.itemId].name}`);
      } else {
        setSelectedAssetId(null);
        setIsDragging(true);
      }
      setCurrentPos({ x, y });
    } else if ((e.type === 'mousemove' || e.type === 'touchmove') && isDragging) {
      setCurrentPos({ x, y });
    } else if (e.type === 'mouseup' || e.type === 'touchend') {
      setIsDragging(false);
    }
  };

  const placeAsset = () => {
    const newAsset: PlacedAsset = {
      id: Date.now(),
      itemId: activeItem,
      x: currentPos.x,
      y: currentPos.y,
      scale: currentScale,
      rotation: currentRotation
    };
    setPlacedAssets([...placedAssets, newAsset]);
    setSelectedAssetId(newAsset.id);
    setSpatialAdvice("Asset Anchored. Adjust scale and rotation below.");
  };

  const updateSelectedAsset = (property: 'scale' | 'rotation', value: number) => {
    if (property === 'scale') setCurrentScale(value);
    if (property === 'rotation') setCurrentRotation(value);

    if (selectedAssetId) {
      setPlacedAssets(prev => prev.map(a => 
        a.id === selectedAssetId ? { ...a, [property]: value } : a
      ));
    }
  };

  const deleteSelected = () => {
    if (selectedAssetId) {
      setPlacedAssets(prev => prev.filter(a => a.id !== selectedAssetId));
      setSelectedAssetId(null);
    } else {
      setPlacedAssets([]);
    }
  };

  useEffect(() => {
    if (showAR && videoRef.current && stream) videoRef.current.srcObject = stream;
  }, [showAR, stream]);

  return (
    <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-700 pb-10">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center px-4 py-1.5 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em]">Neural_AR_Passthrough</div>
          <h2 className="text-5xl font-black text-white tracking-tighter leading-none">SPATIAL <span className="gradient-text">STORE</span></h2>
          <p className="text-slate-400 text-lg font-medium">Merge digital assets with physical reality. Use the spatial reticle to anchor and manipulate products.</p>
        </div>
        {!showAR && (
          <button onClick={startAR} className="px-10 py-5 bg-white text-black hover:bg-indigo-50 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center group active:scale-95">
            <i className="fa-solid fa-vr-cardboard mr-4 text-lg"></i> Launch AR Viewport
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">
        <div ref={containerRef} onMouseDown={handleCanvasInteraction} onMouseMove={handleCanvasInteraction} onMouseUp={handleCanvasInteraction} onTouchStart={handleCanvasInteraction} onTouchMove={handleCanvasInteraction} onTouchEnd={handleCanvasInteraction} className="xl:col-span-3 glass-card rounded-[3rem] aspect-video relative overflow-hidden border border-white/10 shadow-2xl bg-slate-950 group select-none">
          {showAR ? (
            <div className="absolute inset-0">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover grayscale-[0.2] brightness-110" />
              <canvas ref={canvasRef} className="hidden" />
              
              <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute inset-0 transition-opacity duration-1000 ${isScanning ? 'opacity-40' : 'opacity-10'}`}>
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                </div>

                {placedAssets.map((asset) => (
                  <div key={asset.id} className={`absolute transition-all ${selectedAssetId === asset.id ? 'ring-2 ring-indigo-500 ring-offset-4 ring-offset-transparent rounded-full' : ''}`} style={{ left: `${asset.x}%`, top: `${asset.y}%`, transform: `translate(-50%, -50%) rotate(${asset.rotation}deg) scale(${asset.scale})`, zIndex: 10 }}>
                    <img src={mockItems[asset.itemId].img} className={`w-48 h-48 object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.8)] ${selectedAssetId === asset.id ? 'brightness-125' : ''}`} alt="Placed" />
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-32 h-6 bg-black/40 blur-2xl rounded-full"></div>
                  </div>
                ))}

                {!isScanning && !selectedAssetId && (
                  <div className="absolute border-2 border-indigo-500/50 rounded-full p-1" style={{ left: `${currentPos.x}%`, top: `${currentPos.y}%`, transform: `translate(-50%, -50%) rotate(${currentRotation}deg) scale(${currentScale})`, width: '180px', height: '180px' }}>
                    <div className="absolute inset-0 border border-white/20 rounded-full animate-spin-slow"></div>
                    <img src={mockItems[activeItem].img} className="w-full h-full object-contain opacity-50 drop-shadow-2xl" alt="Preview" />
                  </div>
                )}
              </div>

              <div className="absolute bottom-10 left-10 right-10 flex flex-col space-y-6 pointer-events-auto">
                {!isScanning && (
                  <div className="flex flex-col md:flex-row items-center justify-center gap-6 bg-slate-950/80 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl">
                    <div className="flex items-center space-x-4 flex-1">
                      <i className="fa-solid fa-maximize text-indigo-400"></i>
                      <input type="range" min="0.3" max="2.5" step="0.1" value={currentScale} onChange={(e) => updateSelectedAsset('scale', parseFloat(e.target.value))} className="w-full accent-indigo-500" />
                      <span className="text-[10px] font-black text-white w-8">x{currentScale.toFixed(1)}</span>
                    </div>
                    <div className="w-px h-8 bg-white/10 hidden md:block"></div>
                    <div className="flex items-center space-x-4 flex-1">
                      <i className="fa-solid fa-rotate text-indigo-400"></i>
                      <input type="range" min="0" max="360" step="1" value={currentRotation} onChange={(e) => updateSelectedAsset('rotation', parseInt(e.target.value))} className="w-full accent-indigo-500" />
                      <span className="text-[10px] font-black text-white w-10">{currentRotation}°</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {!selectedAssetId ? (
                      <button onClick={placeAsset} disabled={isScanning} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center">
                        <i className="fa-solid fa-anchor mr-3"></i> Anchor Asset
                      </button>
                    ) : (
                      <button onClick={() => setSelectedAssetId(null)} className="px-8 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl">
                        Deselect
                      </button>
                    )}
                    <button onClick={deleteSelected} className="w-14 h-14 bg-white/10 hover:bg-rose-600 text-white border border-white/10 rounded-2xl flex items-center justify-center transition-all shadow-xl backdrop-blur-md">
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button onClick={handleAIAnalyze} disabled={isAnalyzing} className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center shadow-xl ${isAnalyzing ? 'bg-indigo-500/40 text-indigo-200' : 'bg-slate-950 text-white border border-white/10'}`}>
                      {isAnalyzing ? <i className="fa-solid fa-circle-notch animate-spin mr-3"></i> : <i className="fa-solid fa-brain mr-3"></i>} Neural Audit
                    </button>
                    <button onClick={stopAR} className="w-14 h-14 bg-rose-600 text-white rounded-2xl flex items-center justify-center transition-all shadow-xl active:scale-95"><i className="fa-solid fa-xmark text-xl"></i></button>
                  </div>
                </div>
              </div>
              
              {spatialAdvice && !isScanning && (
                <div className="absolute top-8 right-8 w-72 bg-slate-950/90 backdrop-blur-2xl p-6 rounded-[2rem] border border-indigo-500/40 shadow-xl animate-in fade-in slide-in-from-right-4">
                   <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 bg-indigo-500/20 rounded-xl flex items-center justify-center"><i className="fa-solid fa-sparkles text-indigo-400 text-xs animate-pulse"></i></div>
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Nova_Insight</span>
                   </div>
                   <p className="text-[11px] text-slate-300 leading-relaxed font-medium">"{spatialAdvice}"</p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center relative bg-slate-950">
              <img src={mockItems[activeItem].img} className="w-[30%] max-h-[60%] object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.8)] animate-float relative z-10" alt="Preview" />
              <div className="absolute inset-x-0 bottom-0 p-12 bg-gradient-to-t from-slate-950 to-transparent z-20">
                 <div className="flex items-center justify-between">
                    <div className="space-y-1">
                       <h3 className="text-4xl font-black text-white tracking-tighter">{mockItems[activeItem].name}</h3>
                       <p className="text-indigo-400 font-bold tracking-widest uppercase text-[10px]">High-Fidelity Spatial Asset</p>
                    </div>
                    <p className="text-4xl font-black text-white tracking-tighter">{mockItems[activeItem].price}</p>
                 </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8 h-full flex flex-col">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">Neural Catalog</h3>
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{mockItems.length} Sync'd</span>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto">
            {mockItems.map((item, i) => (
              <button key={i} onClick={() => { setActiveItem(i); setSpatialAdvice(null); setSelectedAssetId(null); }} className={`w-full p-4 rounded-2xl border transition-all flex items-center space-x-4 group relative ${activeItem === i ? 'bg-indigo-600 border-indigo-500 shadow-xl' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0 border border-white/10"><img src={item.img} className="w-full h-full object-cover" alt={item.name} /></div>
                <div className="text-left flex-1"><p className={`font-black text-sm ${activeItem === i ? 'text-white' : 'text-slate-200'}`}>{item.name}</p><p className={`text-[10px] font-bold mt-1 ${activeItem === i ? 'text-indigo-200' : 'text-slate-500'}`}>{item.price}</p></div>
              </button>
            ))}
          </div>
          <div className="glass-card p-6 rounded-[2rem] border border-white/5 space-y-4">
             <div className="flex items-center space-x-3"><i className="fa-solid fa-circle-info text-indigo-400 text-xs"></i><h4 className="text-[10px] font-black text-white uppercase tracking-widest">Metadata</h4></div>
             <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{mockItems[activeItem].description}</p>
          </div>
          <button className="w-full py-6 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95">Procure License</button>
        </div>
      </div>
    </div>
  );
};

export default VirtualStore;
