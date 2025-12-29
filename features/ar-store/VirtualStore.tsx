
import React, { useState, useRef, useEffect } from 'react';
import { analyzeSpatialScene } from '../../services/geminiService';

interface PlacedAsset {
  id: number;
  itemId: number;
  x: number; // percentage of container width
  y: number; // percentage of container height
  scale: number;
  rotation: number;
  shader: string;
  wireframe: boolean;
  isNew?: boolean; // For materializing effect
}

const VirtualStore: React.FC = () => {
  const [activeItem, setActiveItem] = useState(0);
  const [showAR, setShowAR] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasDetectedSurface, setHasDetectedSurface] = useState(false);
  const [spatialAdvice, setSpatialAdvice] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [showInspector, setShowInspector] = useState(false);
  
  const [placedAssets, setPlacedAssets] = useState<PlacedAsset[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const [currentScale, setCurrentScale] = useState(1);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [currentShader, setCurrentShader] = useState('standard');
  const [isWireframeGlobal, setIsWireframeGlobal] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const mockItems = [
    { 
      name: 'Nova Pods Max', 
      price: '$549', 
      img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800', 
      description: 'Immersive spatial audio with neural noise cancellation. Industry-leading fidelity for the spatial era.',
      polyCount: 42901,
      vram: '124 MB',
      drawCalls: 12,
      materials: ['Neural Chrome', 'Obsidian Matte', 'Iridescent Glass']
    },
    { 
      name: 'Creative Tablet Pro', 
      price: '$1,299', 
      img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800', 
      description: 'The ultimate canvas for autonomous workflows. Precision OLED display with neural haptics.',
      polyCount: 68242,
      vram: '210 MB',
      drawCalls: 18,
      materials: ['Brushed Silicon', 'Titanium Void', 'Optic Clear']
    },
    { 
      name: 'Studio Lens Kit', 
      price: '$899', 
      img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800', 
      description: 'Cinema-grade optics for the modern creator. Optimized for 8K autonomous cinematography.',
      polyCount: 102155,
      vram: '440 MB',
      drawCalls: 24,
      materials: ['Optical Quartz', 'Carbon Frame', 'Gold Trace']
    }
  ];

  const shaders = [
    { id: 'standard', label: 'Default PBR', filter: 'brightness(1)' },
    { id: 'chrome', label: 'Neural Chrome', filter: 'contrast(1.5) brightness(1.2) saturate(0.8) hue-rotate(-10deg)' },
    { id: 'matte', label: 'Obsidian Matte', filter: 'contrast(0.9) brightness(0.7) grayscale(0.5)' },
    { id: 'glass', label: 'Iridescent Glass', filter: 'contrast(1.3) saturate(2) hue-rotate(180deg) opacity(0.8)' }
  ];

  const startAR = async () => {
    try {
      let mediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment', 
            width: { ideal: 1920 }, 
            height: { ideal: 1080 } 
          } 
        });
      } catch (e: any) {
        console.warn("Environment camera not found, using default.", e);
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      }
      
      setStream(mediaStream);
      setShowAR(true);
      setIsScanning(true);
      
      setTimeout(() => {
        setIsScanning(false);
        setSpatialAdvice("Neural Grid Synchronized. Scan surface for anchor point.");
        setTimeout(() => setHasDetectedSurface(true), 1500);
      }, 2500);
    } catch (err: any) {
      console.error("AR Initialization Failed:", err);
      alert("AR requires camera permissions.");
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
    setShowInspector(false);
  };

  const handleAIAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current || isAnalyzing) return;

    setIsAnalyzing(true);
    setSpatialAdvice("Analyzing spatial entropy via Gemini Vision...");

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Canvas context failure");
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64Image = canvas.toDataURL('image/jpeg');
      
      const advice = await analyzeSpatialScene(base64Image);
      setSpatialAdvice(advice || "Environmental analysis concluded.");
      setHasDetectedSurface(true);
    } catch (error) {
      console.error("Spatial analysis failed:", error);
      setSpatialAdvice("Neural link timeout. Proceed with caution.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleInteractionStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!showAR || isScanning) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
    
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    const clickedAsset = placedAssets.find(a => Math.abs(a.x - x) < 8 && Math.abs(a.y - y) < 8);
    
    if (clickedAsset) {
      setSelectedAssetId(clickedAsset.id);
      setCurrentScale(clickedAsset.scale);
      setCurrentRotation(clickedAsset.rotation);
      setCurrentShader(clickedAsset.shader);
      setIsDragging(true);
    } else if (hasDetectedSurface) {
      const newId = Date.now();
      const newAsset: PlacedAsset = {
        id: newId,
        itemId: activeItem,
        x,
        y,
        scale: 1.0,
        rotation: 0,
        shader: currentShader,
        wireframe: false,
        isNew: true
      };
      setPlacedAssets(prev => [...prev, newAsset]);
      setSelectedAssetId(newId);
      setCurrentScale(1.0);
      setCurrentRotation(0);
      setIsDragging(true);
      
      setTimeout(() => {
        setPlacedAssets(prev => prev.map(a => a.id === newId ? { ...a, isNew: false } : a));
      }, 1000);
    } else {
      setSpatialAdvice("Scan a surface before deploying assets.");
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

  const updateSelectedAsset = (property: string, value: any) => {
    if (property === 'scale') setCurrentScale(value);
    if (property === 'rotation') setCurrentRotation(value);
    if (property === 'shader') setCurrentShader(value);

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
    }
  };

  useEffect(() => {
    if (showAR && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [showAR, stream]);

  const selectedAsset = placedAssets.find(a => a.id === selectedAssetId);
  const inspectingItem = selectedAsset ? mockItems[selectedAsset.itemId] : mockItems[activeItem];

  return (
    <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-700 pb-10">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center px-4 py-1.5 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">Spatial_Retail_Interface</div>
          <h2 className="text-5xl font-black text-white tracking-tighter leading-tight">VIRTUAL <span className="gradient-text">STORE</span></h2>
          <p className="text-slate-400 text-lg font-medium max-w-xl">Autonomous XR Retail Node. Anchor high-fidelity products in your real-world environment with precision mapping.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowInspector(!showInspector)} 
            className={`px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border flex items-center group active:scale-95 ${showInspector ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}
          >
            <i className={`fa-solid ${showInspector ? 'fa-eye-slash' : 'fa-microscope'} mr-3`}></i> {showInspector ? 'Hide Metrics' : 'Model Inspector'}
          </button>
          {!showAR && (
            <button 
              onClick={startAR} 
              className="px-12 py-6 bg-white text-black hover:bg-slate-200 rounded-3xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl flex items-center group active:scale-95 border-none"
            >
              <i className="fa-solid fa-expand mr-4 text-xl group-hover:rotate-45 transition-transform"></i> Launch AR View
            </button>
          )}
        </div>
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
                className="w-full h-full object-cover brightness-110 contrast-105" 
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {!isScanning && (
                <div className={`absolute inset-0 pointer-events-none z-10 transition-opacity duration-1000 ${hasDetectedSurface ? 'opacity-40' : 'opacity-10'}`}>
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.2)_1px,transparent_1px)] bg-[size:60px_60px] [transform:perspective(1200px)_rotateX(75deg)_translateY(-15%)]"></div>
                  {/* Surface scanner scanning lines */}
                  {!hasDetectedSurface && (
                    <div className="absolute inset-0 bg-indigo-500/5 animate-[pulse_2s_infinite]">
                       <div className="h-full w-full bg-[repeating-linear-gradient(0deg,transparent,transparent_49%,rgba(99,102,241,0.1)_50%,transparent_51%)] bg-[length:100%_40px] animate-[slide_10s_linear_infinite]"></div>
                    </div>
                  )}
                </div>
              )}

              {isScanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-2xl z-30">
                  <div className="w-44 h-44 border-[10px] border-white/5 border-t-indigo-500 rounded-full animate-spin mb-10 shadow-[0_0_100px_rgba(99,102,241,0.4)]"></div>
                  <h3 className="text-3xl font-black text-white uppercase tracking-[0.5em] animate-pulse">Neural Synchronization</h3>
                  <p className="text-slate-500 font-bold mt-4 uppercase tracking-widest text-[10px]">Mapping Environment Topography</p>
                </div>
              )}

              <div className="absolute inset-0 pointer-events-none z-20">
                {placedAssets.map((asset) => {
                  const shader = shaders.find(s => s.id === asset.shader);
                  const isSelected = selectedAssetId === asset.id;
                  return (
                    <div 
                      key={asset.id} 
                      className={`absolute transition-all duration-75 ${isSelected ? 'z-40' : 'z-20'}`} 
                      style={{ 
                        left: `${asset.x}%`, 
                        top: `${asset.y}%`, 
                        transform: `translate(-50%, -50%) scale(${asset.scale}) rotate(${asset.rotation}deg)` 
                      }}
                    >
                      <div className="relative group p-14 pointer-events-auto cursor-grab active:cursor-grabbing flex items-center justify-center">
                         {isSelected && (
                           <>
                            {/* Selection HUD Indicators */}
                            <div className="absolute inset-0 border-[2px] border-white/20 rounded-full scale-125 animate-[spin_20s_linear_infinite]"></div>
                            <div className="absolute inset-0 border-[1px] border-indigo-500/40 rounded-full scale-150 animate-[spin_30s_linear_infinite_reverse] border-dashed"></div>
                            
                            {/* Corner Brackets */}
                            <div className="absolute -top-6 -left-6 w-16 h-16 border-t-4 border-l-4 border-indigo-400 rounded-tl-2xl shadow-[0_0_20px_rgba(99,102,241,0.4)]"></div>
                            <div className="absolute -top-6 -right-6 w-16 h-16 border-t-4 border-r-4 border-indigo-400 rounded-tr-2xl shadow-[0_0_20px_rgba(99,102,241,0.4)]"></div>
                            <div className="absolute -bottom-6 -left-6 w-16 h-16 border-b-4 border-l-4 border-indigo-400 rounded-bl-2xl shadow-[0_0_20px_rgba(99,102,241,0.4)]"></div>
                            <div className="absolute -bottom-6 -right-6 w-16 h-16 border-b-4 border-r-4 border-indigo-400 rounded-br-2xl shadow-[0_0_20px_rgba(99,102,241,0.4)]"></div>
                           </>
                         )}

                         {/* Placement materialization visual */}
                         {asset.isNew && (
                           <div className="absolute inset-0 bg-indigo-500/30 rounded-full animate-ping z-0 opacity-50 blur-xl"></div>
                         )}

                         <div className={`relative transition-all duration-1000 ease-out ${asset.isNew ? 'scale-0 opacity-0 blur-3xl translate-y-12' : 'scale-100 opacity-100 blur-0 translate-y-0'}`}>
                            <img 
                              src={mockItems[asset.itemId].img} 
                              className={`w-56 h-56 object-contain drop-shadow-[0_80px_100px_rgba(0,0,0,0.9)] transition-all duration-500 ${isSelected ? 'scale-110 brightness-110' : 'opacity-100'}`} 
                              style={{ filter: shader?.filter }}
                              alt="Spatial Product" 
                              draggable={false}
                            />
                            {(isWireframeGlobal || asset.wireframe) && (
                              <div className="absolute inset-0 w-full h-full mix-blend-screen opacity-60 pointer-events-none" style={{ maskImage: `url(${mockItems[asset.itemId].img})`, maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center', backgroundColor: '#6366f1', backgroundImage: 'repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 10px), repeating-linear-gradient(90deg, #fff, #fff 1px, transparent 1px, transparent 10px)' }}></div>
                            )}
                         </div>
                        <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 w-48 h-12 bg-black/60 blur-3xl rounded-full opacity-60"></div>
                      </div>
                    </div>
                  );
                })}

                {/* Surface targeting reticle */}
                {!isScanning && !selectedAssetId && (
                  <div 
                    className={`absolute translate-x-[-50%] translate-y-[-50%] pointer-events-none flex flex-col items-center transition-all duration-300`}
                    style={{ left: `${cursorPos.x}%`, top: `${cursorPos.y}%` }}
                  >
                    <div className={`w-40 h-40 border-[3px] rounded-full flex flex-col items-center justify-center animate-pulse shadow-2xl transition-all duration-500 ${hasDetectedSurface ? 'border-emerald-500 bg-emerald-500/10 scale-110 shadow-emerald-500/20' : 'border-white/20 bg-white/5'}`}>
                      <div className={`w-6 h-6 rounded-full shadow-[0_0_25px_rgba(99,102,241,0.8)] flex items-center justify-center ${hasDetectedSurface ? 'bg-emerald-400' : 'bg-indigo-500'}`}>
                         <i className={`fa-solid ${hasDetectedSurface ? 'fa-plus' : 'fa-crosshairs'} text-[10px] text-black`}></i>
                      </div>
                      
                      {/* Reticle brackets */}
                      <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-white/40"></div>
                      <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-white/40"></div>
                      <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-white/40"></div>
                      <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white/40"></div>
                    </div>
                    <div className="mt-8 px-6 py-2.5 bg-slate-950/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl animate-in zoom-in-50 duration-500 flex items-center space-x-3">
                       <span className={`w-2 h-2 rounded-full ${hasDetectedSurface ? 'bg-emerald-400 animate-pulse' : 'bg-slate-700'}`}></span>
                       <span className={`text-[10px] font-black uppercase tracking-widest ${hasDetectedSurface ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {hasDetectedSurface ? 'Neural Anchor Locked • Tap to Deploy' : 'Mapping Physical Planes...'}
                       </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center relative bg-slate-950 group overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08),transparent_70%)]"></div>
              <div className="relative z-10 transition-transform duration-1000 group-hover:scale-110 p-24">
                <img 
                  src={mockItems[activeItem].img} 
                  className="w-full max-h-[75vh] object-contain drop-shadow-[0_80px_160px_rgba(0,0,0,1)] animate-float" 
                  style={{ filter: shaders.find(s => s.id === currentShader)?.filter }}
                  alt="Product Preview" 
                  draggable={false}
                />
                {isWireframeGlobal && (
                  <div className="absolute inset-0 w-full h-full mix-blend-screen opacity-70 pointer-events-none" style={{ maskImage: `url(${mockItems[activeItem].img})`, maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center', backgroundColor: '#6366f1', backgroundImage: 'repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 10px), repeating-linear-gradient(90deg, #fff, #fff 1px, transparent 1px, transparent 10px)' }}></div>
                )}
              </div>
              
              <div className="absolute inset-x-0 bottom-0 p-24 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-20 text-center">
                 <div className="flex flex-col items-center">
                    <div className="space-y-4 mb-10">
                       <h3 className="text-7xl font-black text-white tracking-tighter leading-none">{mockItems[activeItem].name}</h3>
                       <p className="text-indigo-400 font-bold tracking-[0.5em] uppercase text-[10px] opacity-80">Autonomous Architecture Unit Ready</p>
                    </div>
                    <div className="flex items-center space-x-12">
                       <div className="text-left">
                          <p className="text-5xl font-black text-white tracking-tighter leading-none">{mockItems[activeItem].price}</p>
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Vault Verified Identity</span>
                       </div>
                       <div className="w-[1px] h-12 bg-white/10"></div>
                       <button onClick={startAR} className="px-12 py-5 bg-indigo-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/30 active:scale-95 border-none">
                          Forge AR
                       </button>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {/* Asset Inspector HUD */}
          {showInspector && (
            <div className="absolute top-12 left-12 w-80 glass-card rounded-[3rem] border border-indigo-500/20 p-8 shadow-2xl animate-in slide-in-from-left-12 duration-500 z-50 space-y-8 max-h-[85%] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between sticky top-0 bg-slate-900/50 backdrop-blur-md py-2 -mt-2 border-b border-white/5 mb-4">
                <h3 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center">
                  <i className="fa-solid fa-microscope mr-3 text-indigo-400"></i>
                  Technical Audit
                </h3>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>
              </div>

              <div className="space-y-6">
                <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Mesh Topology</p>
                    <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded text-[8px] font-black uppercase border border-indigo-500/20">LOD-0 High</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <p className="text-xl font-black text-white">{inspectingItem.polyCount.toLocaleString()}</p>
                        <p className="text-[8px] font-bold text-slate-600 uppercase">Faces</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-xl font-black text-white">{(inspectingItem.polyCount * 1.2).toFixed(0).toLocaleString()}</p>
                        <p className="text-[8px] font-bold text-slate-600 uppercase">Vertices</p>
                     </div>
                  </div>
                  <div className="pt-2 border-t border-white/5 space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold">
                       <span className="text-slate-500 uppercase">Draw Calls</span>
                       <span className="text-white">{inspectingItem.drawCalls}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold">
                       <span className="text-slate-500 uppercase">VRAM Estimation</span>
                       <span className="text-emerald-400">{inspectingItem.vram}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center">
                       <i className="fa-solid fa-lines-leaning mr-2 text-indigo-400"></i>
                       Wireframe View
                    </span>
                    <button 
                      onClick={() => setIsWireframeGlobal(!isWireframeGlobal)}
                      className={`w-12 h-6 rounded-full transition-all relative ${isWireframeGlobal ? 'bg-indigo-600 shadow-[0_0_10px_#6366f144]' : 'bg-slate-700'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isWireframeGlobal ? 'left-7' : 'left-1'}`}></div>
                    </button>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-4 flex items-center">
                       <i className="fa-solid fa-fill-drip mr-2 text-indigo-400"></i>
                       Material Shaders
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      {shaders.map(s => (
                        <button 
                          key={s.id}
                          onClick={() => updateSelectedAsset('shader', s.id)}
                          className={`p-3 rounded-xl border text-[9px] font-black uppercase tracking-tighter transition-all flex flex-col items-center gap-2 ${currentShader === s.id ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-white/5 border-white/5 text-slate-500 hover:text-white'}`}
                        >
                          <i className={`fa-solid ${s.id === 'chrome' ? 'fa-wand-magic-sparkles' : s.id === 'glass' ? 'fa-droplet' : s.id === 'matte' ? 'fa-ghost' : 'fa-cube'}`}></i>
                          {s.label.split(' ')[1] || s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Transformation Controls HUD */}
          {showAR && selectedAssetId && (
            <div className="absolute bottom-12 left-12 right-12 z-50 flex flex-col space-y-6 pointer-events-auto">
               <div className="bg-slate-950/95 backdrop-blur-3xl p-10 rounded-[3.5rem] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] animate-in slide-in-from-bottom-12 duration-500 max-w-4xl mx-auto w-full">
                 <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    <div className="flex-1 space-y-6 w-full">
                       <div className="flex justify-between items-center px-2">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center">
                            <i className="fa-solid fa-maximize mr-3 text-indigo-400"></i> Anchor Scale
                          </span>
                          <span className="text-xs font-black text-white">x{currentScale.toFixed(2)}</span>
                       </div>
                       <input 
                          type="range" min="0.2" max="4" step="0.05" 
                          value={currentScale} 
                          onChange={(e) => updateSelectedAsset('scale', parseFloat(e.target.value))}
                          className="w-full h-2 bg-slate-800 rounded-full appearance-none accent-indigo-500 cursor-pointer"
                       />
                       <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase tracking-widest px-1">
                          <span>0.2x</span>
                          <span>4.0x</span>
                       </div>
                    </div>
                    <div className="flex-1 space-y-6 w-full">
                       <div className="flex justify-between items-center px-2">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center">
                            <i className="fa-solid fa-rotate mr-3 text-indigo-400"></i> Spatial Orientation
                          </span>
                          <span className="text-xs font-black text-white">{currentRotation}°</span>
                       </div>
                       <input 
                          type="range" min="0" max="360" step="1" 
                          value={currentRotation} 
                          onChange={(e) => updateSelectedAsset('rotation', parseInt(e.target.value))}
                          className="w-full h-2 bg-slate-800 rounded-full appearance-none accent-indigo-500 cursor-pointer"
                       />
                       <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase tracking-widest px-1">
                          <span>0°</span>
                          <span>360°</span>
                       </div>
                    </div>
                    <div className="flex space-x-4">
                      <button 
                        onClick={removeSelected}
                        className="w-16 h-16 bg-rose-600/10 text-rose-500 rounded-2xl flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all border border-rose-500/20 group shadow-lg"
                        title="De-anchor Asset"
                      >
                        <i className="fa-solid fa-trash-can text-lg"></i>
                      </button>
                      <button 
                        onClick={() => setSelectedAssetId(null)}
                        className="w-16 h-16 bg-white text-black rounded-2xl flex items-center justify-center hover:bg-slate-200 transition-all shadow-2xl"
                        title="Commit Transformation"
                      >
                        <i className="fa-solid fa-check text-xl"></i>
                      </button>
                    </div>
                 </div>
               </div>
            </div>
          )}

          {/* Floating UI Overlays */}
          {showAR && (
            <div className="absolute bottom-12 left-12 right-12 flex items-center justify-between pointer-events-none">
                <button 
                  onClick={handleAIAnalyze}
                  disabled={isAnalyzing}
                  className={`px-10 py-5 bg-slate-950/80 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all backdrop-blur-xl border border-white/10 shadow-2xl flex items-center pointer-events-auto ${isAnalyzing ? 'animate-pulse' : ''}`}
                >
                  {isAnalyzing ? (
                    <i className="fa-solid fa-atom animate-spin mr-4 text-indigo-400"></i>
                  ) : (
                    <i className="fa-solid fa-brain mr-4 text-indigo-400"></i>
                  )}
                  {isAnalyzing ? 'Mapping Environment Topology...' : 'Audit Physical Space'}
                </button>

                <button 
                  onClick={stopAR} 
                  className="w-20 h-20 bg-rose-600 text-white rounded-[2.5rem] flex items-center justify-center transition-all shadow-2xl shadow-rose-600/30 active:scale-90 border border-white/10 pointer-events-auto"
                >
                  <i className="fa-solid fa-power-off text-2xl"></i>
                </button>
            </div>
          )}

          {spatialAdvice && !isScanning && (
            <div className="absolute top-12 right-12 w-[22rem] bg-slate-950/90 backdrop-blur-3xl p-10 rounded-[3rem] border border-indigo-500/30 shadow-2xl animate-in fade-in slide-in-from-right-12 z-50">
               <div className="flex items-center space-x-4 mb-6">
                  <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                    <i className="fa-solid fa-wand-magic-sparkles text-indigo-400 text-sm animate-pulse"></i>
                  </div>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Neural Spatial Advisor</span>
               </div>
               <p className="text-sm text-slate-200 leading-relaxed font-bold italic opacity-90">"{spatialAdvice}"</p>
            </div>
          )}
        </div>

        {/* Sidebar Inventory */}
        <div className="space-y-8 h-full flex flex-col">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Asset Inventory</h3>
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">3 Units Synced</span>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-4">
            {mockItems.map((item, i) => (
              <button 
                key={i} 
                onClick={() => { setActiveItem(i); setSpatialAdvice(null); setSelectedAssetId(null); }} 
                className={`w-full p-6 rounded-[2.5rem] border transition-all flex items-center space-x-6 group relative overflow-hidden ${
                  activeItem === i ? 'bg-indigo-600 border-indigo-500 shadow-2xl' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'
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
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Asset Parameters</h4>
             </div>
             <p className="text-sm text-slate-400 leading-relaxed font-semibold italic opacity-80 leading-relaxed">"{mockItems[activeItem].description}"</p>
          </div>
          
          <button className="w-full py-8 bg-white text-black rounded-[2.5rem] font-black text-sm uppercase tracking-[0.3em] hover:bg-slate-200 transition-all shadow-2xl border-none">
            Forge Acquisition
          </button>
        </div>
      </div>
    </div>
  );
};

export default VirtualStore;
