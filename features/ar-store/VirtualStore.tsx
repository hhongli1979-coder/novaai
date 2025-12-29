
import React, { useState, useRef, useEffect } from 'react';
import { analyzeSpatialScene } from '../../services/geminiService';

interface PlacedAsset {
  id: number;
  itemId: number;
  x: number; // percentage of container width
  y: number; // percentage of container height
  scale: number;
  rotation: number;
}

const VirtualStore: React.FC = () => {
  const [activeItem, setActiveItem] = useState(0);
  const [showAR, setShowAR] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasDetectedSurface, setHasDetectedSurface] = useState(false);
  const [spatialAdvice, setSpatialAdvice] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isWebXRSupported, setIsWebXRSupported] = useState(false);
  
  const [placedAssets, setPlacedAssets] = useState<PlacedAsset[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const [currentScale, setCurrentScale] = useState(1);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const mockItems = [
    { 
      name: 'Nova Pods Max', 
      price: '$549', 
      img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800', 
      description: 'Immersive spatial audio with neural noise cancellation. Industry-leading fidelity for the spatial era.' 
    },
    { 
      name: 'Creative Tablet Pro', 
      price: '$1,299', 
      img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800', 
      description: 'The ultimate canvas for autonomous workflows. Precision OLED display with neural haptics.' 
    },
    { 
      name: 'Studio Lens Kit', 
      price: '$899', 
      img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800', 
      description: 'Cinema-grade optics for the modern creator. Optimized for 8K autonomous cinematography.' 
    }
  ];

  // Detect native AR capabilities on mount
  useEffect(() => {
    if ('xr' in navigator) {
      (navigator as any).xr.isSessionSupported('immersive-ar').then((supported: boolean) => {
        setIsWebXRSupported(supported);
      });
    }
  }, []);

  const startARSession = async () => {
    try {
      // Prioritize high-definition environment camera for spatial mapping
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', 
          width: { ideal: 1920 }, 
          height: { ideal: 1080 } 
        } 
      });
      setStream(mediaStream);
      setShowAR(true);
      setIsScanning(true);
      
      // Nova Neural Calibration Sequence
      setTimeout(() => {
        setIsScanning(false);
        setSpatialAdvice("Neural Grid Synchronized. Tap detected surfaces to anchor assets.");
      }, 2500);
    } catch (err) {
      console.error("Spatial module initialization failed:", err);
      alert("AR requires camera passthrough authorization. Please verify system permissions.");
    }
  };

  const stopAR = () => {
    if (stream) stream.getTracks().forEach(track => track.stop());
    setStream(null);
    setShowAR(false);
    setSpatialAdvice(null);
    setPlacedAssets([]);
    setSelectedAssetId(null);
    setIsDragging(false);
    setHasDetectedSurface(false);
  };

  const handleAIAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsAnalyzing(true);
    setSpatialAdvice("Nova AI performing environmental audit...");
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      try {
        const advice = await analyzeSpatialScene(canvas.toDataURL('image/jpeg', 0.8));
        setSpatialAdvice(advice || "Surface confirmed. Anchor ready.");
        setHasDetectedSurface(true);
      } catch (err) {
        setSpatialAdvice("Spatial link unstable. Fallback placement active.");
      }
    }
    setIsAnalyzing(false);
  };

  const handleInteractionStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!showAR || isScanning) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
    
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    const clickedAsset = placedAssets.find(a => Math.abs(a.x - x) < 10 && Math.abs(a.y - y) < 10);
    
    if (clickedAsset) {
      setSelectedAssetId(clickedAsset.id);
      setCurrentScale(clickedAsset.scale);
      setCurrentRotation(clickedAsset.rotation);
      setIsDragging(true);
    } else {
      const newId = Date.now();
      const newAsset: PlacedAsset = {
        id: newId,
        itemId: activeItem,
        x,
        y,
        scale: 1.0,
        rotation: 0
      };
      setPlacedAssets(prev => [...prev, newAsset]);
      setSelectedAssetId(newId);
      setCurrentScale(1.0);
      setCurrentRotation(0);
      setIsDragging(true);
      setSpatialAdvice("Digital twin anchored. HUD activated.");
    }
  };

  const handleInteractionMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!showAR || isScanning) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
    
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    if (isDragging && selectedAssetId) {
      setPlacedAssets(prev => prev.map(a => 
        a.id === selectedAssetId ? { ...a, x, y } : a
      ));
    } else {
      setCursorPos({ x, y });
    }
  };

  const handleInteractionEnd = () => {
    setIsDragging(false);
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

  const removeSelected = () => {
    if (selectedAssetId) {
      setPlacedAssets(prev => prev.filter(a => a.id !== selectedAssetId));
      setSelectedAssetId(null);
      setSpatialAdvice("Asset de-materialized.");
    }
  };

  useEffect(() => {
    if (showAR && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [showAR, stream]);

  return (
    <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-700 pb-10">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center px-4 py-1.5 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">Spatial_Mapping_Protocol</div>
          <h2 className="text-5xl font-black text-white tracking-tighter leading-tight">VIRTUAL <span className="gradient-text">STORE</span></h2>
          <p className="text-slate-400 text-lg font-medium max-w-xl">Immersive retail node. Project high-fidelity digital twins into your physical domain via Nova Neural AR.</p>
        </div>
        {!showAR && (
          <div className="flex gap-4">
             {isWebXRSupported && (
               <button className="px-8 py-6 bg-indigo-600 text-white hover:bg-indigo-500 rounded-3xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl flex items-center border-none">
                 <i className="fa-solid fa-vr-cardboard mr-4 text-xl"></i> Native AR
               </button>
             )}
             <button 
              onClick={startARSession} 
              className="px-10 py-6 bg-white text-black hover:bg-slate-200 rounded-3xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl flex items-center group active:scale-95 border-none"
            >
              <i className="fa-solid fa-expand mr-4 text-xl group-hover:rotate-45 transition-transform"></i> Neural AR Passthrough
            </button>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-stretch h-full">
        <div 
          ref={containerRef}
          onMouseDown={handleInteractionStart}
          onMouseMove={handleInteractionMove}
          onMouseUp={handleInteractionEnd}
          onTouchStart={handleInteractionStart}
          onTouchMove={handleInteractionMove}
          onTouchEnd={handleInteractionEnd}
          className="xl:col-span-3 glass-card rounded-[4rem] aspect-video relative overflow-hidden border border-white/10 shadow-2xl bg-slate-950 group cursor-crosshair select-none"
        >
          {showAR ? (
            <div className="absolute inset-0">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover grayscale-[0.05] brightness-110 contrast-105" 
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {isScanning && (
                <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500/80 blur-sm shadow-[0_0_20px_#6366f1] animate-[scan_2.5s_linear_infinite] z-20"></div>
              )}

              <div className="absolute inset-0 pointer-events-none z-10 opacity-20">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [transform:perspective(1000px)_rotateX(60deg)_translateY(-20%)]"></div>
              </div>

              {isScanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-3xl z-30">
                  <div className="w-48 h-48 border-[12px] border-white/5 border-t-indigo-500 rounded-full animate-spin mb-12 shadow-[0_0_100px_rgba(99,102,241,0.5)]"></div>
                  <h3 className="text-4xl font-black text-white uppercase tracking-[0.5em] animate-pulse">Syncing Environment</h3>
                  <p className="text-slate-500 font-bold mt-6 uppercase tracking-widest text-[10px]">Lidar Emulation Active</p>
                </div>
              )}

              <div className="absolute inset-0 pointer-events-none z-20">
                {placedAssets.map((asset) => (
                  <div 
                    key={asset.id} 
                    className={`absolute transition-all duration-75 ${selectedAssetId === asset.id ? 'z-40' : 'z-20'}`} 
                    style={{ 
                      left: `${asset.x}%`, 
                      top: `${asset.y}%`, 
                      transform: `translate(-50%, -50%) scale(${asset.scale}) rotate(${asset.rotation}deg)` 
                    }}
                  >
                    <div className="relative group p-12 pointer-events-auto cursor-grab active:cursor-grabbing">
                       {selectedAssetId === asset.id && (
                         <div className="absolute -inset-10 border-2 border-dashed border-indigo-400 rounded-full animate-spin-slow opacity-60"></div>
                       )}
                       <img 
                        src={mockItems[asset.itemId].img} 
                        className={`w-52 h-52 object-contain drop-shadow-[0_80px_100px_rgba(0,0,0,0.9)] transition-all ${selectedAssetId === asset.id ? 'scale-110 brightness-125' : 'opacity-100'}`} 
                        alt="Spatial Asset" 
                        draggable={false}
                      />
                      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-48 h-12 bg-black/60 blur-[60px] rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="absolute bottom-12 left-12 right-12 z-50 flex flex-col space-y-8 pointer-events-none">
                 {selectedAssetId && (
                   <div className="bg-slate-950/95 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/10 shadow-[0_60px_120px_rgba(0,0,0,1)] animate-in slide-in-from-bottom-16 duration-700 pointer-events-auto">
                     <div className="flex flex-col md:flex-row items-center gap-20">
                        <div className="flex-1 space-y-8 w-full">
                           <div className="flex justify-between items-center">
                              <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Neural Scale Mapping</span>
                              <span className="text-sm font-black text-white">x{currentScale.toFixed(2)}</span>
                           </div>
                           <input 
                              type="range" min="0.2" max="4" step="0.05" 
                              value={currentScale} 
                              onChange={(e) => updateSelectedAsset('scale', parseFloat(e.target.value))}
                              className="w-full h-2 bg-slate-800 rounded-full appearance-none accent-indigo-500 cursor-pointer"
                           />
                        </div>
                        <div className="flex-1 space-y-8 w-full">
                           <div className="flex justify-between items-center">
                              <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Holographic Rotation</span>
                              <span className="text-sm font-black text-white">{currentRotation}°</span>
                           </div>
                           <input 
                              type="range" min="0" max="360" step="1" 
                              value={currentRotation} 
                              onChange={(e) => updateSelectedAsset('rotation', parseInt(e.target.value))}
                              className="w-full h-2 bg-slate-800 rounded-full appearance-none accent-indigo-500 cursor-pointer"
                           />
                        </div>
                        <div className="flex space-x-4">
                          <button onClick={removeSelected} className="w-20 h-20 bg-rose-600/10 text-rose-500 rounded-3xl border border-rose-500/20 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all">
                            <i className="fa-solid fa-trash-can text-xl"></i>
                          </button>
                          <button onClick={() => setSelectedAssetId(null)} className="w-20 h-20 bg-white text-black rounded-3xl flex items-center justify-center hover:bg-slate-200 transition-all shadow-2xl">
                            <i className="fa-solid fa-check text-2xl"></i>
                          </button>
                        </div>
                     </div>
                   </div>
                 )}

                 <div className="flex items-center justify-between pointer-events-auto">
                    <button 
                      onClick={handleAIAnalyze} 
                      disabled={isAnalyzing} 
                      className={`px-12 py-7 rounded-full font-black text-[12px] uppercase tracking-widest transition-all flex items-center shadow-2xl ${
                        isAnalyzing ? 'bg-indigo-600/20 text-indigo-400' : 'bg-slate-950 text-white border border-white/10 hover:bg-slate-900'
                      }`}
                    >
                      {isAnalyzing ? <i className="fa-solid fa-atom animate-spin mr-5"></i> : <i className="fa-solid fa-brain mr-5 text-indigo-400"></i>} 
                      Audit Physical Space
                    </button>

                    <button 
                      onClick={stopAR} 
                      className="w-24 h-24 bg-rose-600 text-white rounded-full flex items-center justify-center transition-all shadow-2xl shadow-rose-600/40 border border-white/10"
                    >
                      <i className="fa-solid fa-power-off text-3xl"></i>
                    </button>
                 </div>
              </div>

              {spatialAdvice && !isScanning && (
                <div className="absolute top-12 right-12 w-96 bg-slate-950/95 backdrop-blur-3xl p-10 rounded-[3rem] border border-indigo-500/40 shadow-2xl animate-in fade-in slide-in-from-right-16 z-50">
                   <div className="flex items-center space-x-4 mb-6">
                      <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center">
                        <i className="fa-solid fa-wand-magic-sparkles text-indigo-400 text-lg"></i>
                      </div>
                      <span className="text-[11px] font-black text-white uppercase tracking-widest">Spatial Intelligence</span>
                   </div>
                   <p className="text-base text-slate-200 leading-relaxed font-bold italic opacity-90">"{spatialAdvice}"</p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center relative bg-slate-950 group overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08),transparent_70%)]"></div>
              <img 
                src={mockItems[activeItem].img} 
                className="w-[45%] max-h-[75%] object-contain drop-shadow-[0_80px_160px_rgba(0,0,0,1)] animate-float relative z-10 transition-transform duration-1000 group-hover:scale-110" 
                alt="Product Preview" 
                draggable={false}
              />
              <div className="absolute inset-x-0 bottom-0 p-24 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-20 text-center">
                 <div className="flex flex-col items-center">
                    <div className="space-y-4 mb-10">
                       <h3 className="text-7xl font-black text-white tracking-tighter leading-none">{mockItems[activeItem].name}</h3>
                       <p className="text-indigo-400 font-bold tracking-[0.5em] uppercase text-[10px] opacity-80">Autonomous Architecture Unit Ready</p>
                    </div>
                    <div className="flex items-center space-x-12">
                       <div className="text-left">
                          <p className="text-5xl font-black text-white tracking-tighter leading-none">{mockItems[activeItem].price}</p>
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Vault Verified</span>
                       </div>
                       <div className="w-[1px] h-12 bg-white/10"></div>
                       <button onClick={startARSession} className="px-12 py-6 bg-indigo-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/30 active:scale-95 border-none">
                          Deploy in Space
                       </button>
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8 h-full flex flex-col">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.5em]">Inventory Hub</h3>
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">3 Nodes Syncing</span>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-4">
            {mockItems.map((item, i) => (
              <button 
                key={i} 
                onClick={() => { setActiveItem(i); setSpatialAdvice(null); setSelectedAssetId(null); }} 
                className={`w-full p-6 rounded-[2.5rem] border transition-all flex items-center space-x-6 group relative overflow-hidden ${
                  activeItem === i ? 'bg-indigo-600 border-indigo-500 shadow-2xl' : 'bg-white/5 border-white/5 hover:bg-white/10'
                }`}
              >
                <div className="w-24 h-24 rounded-3xl overflow-hidden bg-slate-950 flex-shrink-0 border border-white/10 shadow-inner group-hover:scale-110 transition-transform">
                  <img src={item.img} className="w-full h-full object-contain p-4" alt={item.name} draggable={false} />
                </div>
                <div className="text-left flex-1">
                  <p className={`font-black text-lg tracking-tight ${activeItem === i ? 'text-white' : 'text-slate-200'}`}>{item.name}</p>
                  <p className={`text-sm font-bold mt-1 ${activeItem === i ? 'text-indigo-200' : 'text-slate-500'}`}>{item.price}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="glass-card p-10 rounded-[3rem] border border-white/5 space-y-6 shadow-2xl">
             <div className="flex items-center space-x-4">
                <i className="fa-solid fa-cube text-indigo-400 text-lg"></i>
                <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Asset Parameters</h4>
             </div>
             <p className="text-sm text-slate-400 leading-relaxed font-semibold italic opacity-80">"{mockItems[activeItem].description}"</p>
          </div>
          
          <button className="w-full py-8 bg-white text-black rounded-[2.5rem] font-black text-sm uppercase tracking-[0.3em] hover:bg-slate-200 transition-all shadow-2xl border-none">
            Forge Identity
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-50px); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(600px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default VirtualStore;
