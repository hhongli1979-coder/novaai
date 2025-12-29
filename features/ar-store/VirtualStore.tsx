
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
  isNew?: boolean; 
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
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      setShowAR(true);
      setIsScanning(true);
      
      setTimeout(() => {
        setIsScanning(false);
        setSpatialAdvice("Neural Grid Synchronized. Scan surface for anchor point.");
        setTimeout(() => setHasDetectedSurface(true), 1500);
      }, 2500);
    } catch (err) {
      alert("Spatial rendering requires camera access.");
    }
  };

  const stopAR = () => {
    if (stream) stream.getTracks().forEach(track => track.stop());
    setStream(null);
    setShowAR(false);
    setPlacedAssets([]);
    setSelectedAssetId(null);
    setHasDetectedSurface(false);
  };

  const handleInteractionStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!showAR || isScanning) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const clientX = 'touches' in e ? (e as any).touches[0].clientX : (e as any).clientX;
    const clientY = 'touches' in e ? (e as any).touches[0].clientY : (e as any).clientY;
    
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    // Check if clicking an existing asset (collision detection)
    const clickedAsset = placedAssets.find(a => Math.abs(a.x - x) < 8 && Math.abs(a.y - y) < 8);
    
    if (clickedAsset) {
      setSelectedAssetId(clickedAsset.id);
      setCurrentScale(clickedAsset.scale);
      setCurrentRotation(clickedAsset.rotation);
      setCurrentShader(clickedAsset.shader);
      setIsDragging(true);
    } else if (hasDetectedSurface) {
      // Place new asset
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
      setIsDragging(true);
      
      setTimeout(() => {
        setPlacedAssets(prev => prev.map(a => a.id === newId ? { ...a, isNew: false } : a));
      }, 800);
    }
  };

  const handleInteractionMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!showAR || isScanning) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const clientX = 'touches' in e ? (e as any).touches[0].clientX : (e as any).clientX;
    const clientY = 'touches' in e ? (e as any).touches[0].clientY : (e as any).clientY;
    
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

  return (
    <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-700 pb-10">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center px-4 py-1.5 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">Spatial_Retail_Interface</div>
          <h2 className="text-5xl font-black text-white tracking-tighter leading-tight">VIRTUAL <span className="gradient-text">STORE</span></h2>
          <p className="text-slate-400 text-lg font-medium max-w-xl">Autonomous XR Retail Node. Map physical topography and manifest high-fidelity creative assets.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowInspector(!showInspector)} 
            className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border flex items-center group ${showInspector ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}
          >
            <i className={`fa-solid ${showInspector ? 'fa-eye-slash' : 'fa-microscope'} mr-3`}></i> Model Metrics
          </button>
          {!showAR && (
            <button 
              onClick={startAR} 
              className="px-12 py-5 bg-white text-black hover:bg-slate-200 rounded-3xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl flex items-center border-none"
            >
              <i className="fa-solid fa-expand mr-4 text-xl"></i> Launch AR View
            </button>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-stretch h-full">
        <div 
          ref={containerRef}
          onMouseDown={handleInteractionStart}
          onMouseMove={handleInteractionMove}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={handleInteractionStart}
          onTouchMove={handleInteractionMove}
          onTouchEnd={() => setIsDragging(false)}
          className="xl:col-span-3 glass-card rounded-[4rem] aspect-video relative overflow-hidden border border-white/10 shadow-2xl bg-slate-950 group cursor-crosshair select-none"
        >
          {showAR ? (
            <div className="absolute inset-0">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover brightness-110" />
              
              {!isScanning && (
                <div className={`absolute inset-0 pointer-events-none z-10 transition-opacity duration-1000 ${hasDetectedSurface ? 'opacity-30' : 'opacity-10'}`}>
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.2)_1px,transparent_1px)] bg-[size:60px_60px] [transform:perspective(1200px)_rotateX(75deg)_translateY(-15%)]"></div>
                </div>
              )}

              {isScanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-2xl z-30">
                  <div className="w-40 h-40 border-[10px] border-white/5 border-t-indigo-500 rounded-full animate-spin mb-10 shadow-[0_0_80px_rgba(99,102,241,0.4)]"></div>
                  <h3 className="text-3xl font-black text-white uppercase tracking-[0.5em] animate-pulse">Synchronizing Grid</h3>
                  <p className="text-slate-500 font-bold mt-4 uppercase tracking-widest text-[10px]">Mapping Spatial Entropy</p>
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
                            <div className="absolute inset-0 border-[2px] border-white/20 rounded-full scale-125 animate-[spin_20s_linear_infinite]"></div>
                            <div className="absolute -top-4 -left-4 w-12 h-12 border-t-4 border-l-4 border-indigo-400 rounded-tl-xl shadow-lg"></div>
                            <div className="absolute -top-4 -right-4 w-12 h-12 border-t-4 border-r-4 border-indigo-400 rounded-tr-xl shadow-lg"></div>
                            <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-4 border-l-4 border-indigo-400 rounded-bl-xl shadow-lg"></div>
                            <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-4 border-r-4 border-indigo-400 rounded-br-xl shadow-lg"></div>
                           </>
                         )}

                         <div className={`relative transition-all duration-1000 ease-out ${asset.isNew ? 'scale-0 opacity-0 blur-3xl' : 'scale-100 opacity-100 blur-0'}`}>
                            <img 
                              src={mockItems[asset.itemId].img} 
                              className={`w-48 h-48 object-contain drop-shadow-[0_60px_80px_rgba(0,0,0,0.8)] transition-all duration-500 ${isSelected ? 'scale-110' : ''}`} 
                              style={{ filter: shader?.filter }}
                              alt="Placed Product" 
                              draggable={false}
                            />
                            {(isWireframeGlobal || asset.wireframe) && (
                              <div className="absolute inset-0 w-full h-full mix-blend-screen opacity-60 pointer-events-none" style={{ maskImage: `url(${mockItems[asset.itemId].img})`, maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center', backgroundColor: '#6366f1', backgroundImage: 'repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 10px), repeating-linear-gradient(90deg, #fff, #fff 1px, transparent 1px, transparent 10px)' }}></div>
                            )}
                         </div>
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-40 h-8 bg-black/40 blur-2xl rounded-full opacity-60"></div>
                      </div>
                    </div>
                  );
                })}

                {!isScanning && !selectedAssetId && (
                  <div 
                    className="absolute translate-x-[-50%] translate-y-[-50%] pointer-events-none flex flex-col items-center transition-all duration-300"
                    style={{ left: `${cursorPos.x}%`, top: `${cursorPos.y}%` }}
                  >
                    <div className={`w-32 h-32 border-[3px] rounded-full flex items-center justify-center animate-pulse shadow-2xl transition-colors duration-500 ${hasDetectedSurface ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/20'}`}>
                      <div className={`w-4 h-4 rounded-full shadow-xl ${hasDetectedSurface ? 'bg-emerald-400' : 'bg-indigo-500'}`}></div>
                    </div>
                    <div className="mt-6 px-4 py-2 bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl animate-in zoom-in-50 duration-500">
                       <span className="text-[10px] font-black uppercase tracking-widest text-white">
                          {hasDetectedSurface ? 'Anchor Active • Tap to Forge' : 'Searching for physical plane...'}
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
                  className="w-full max-h-[65vh] object-contain drop-shadow-[0_60px_120px_rgba(0,0,0,1)] animate-float" 
                  alt="Product" 
                  draggable={false}
                />
              </div>
              
              <div className="absolute inset-x-0 bottom-0 p-20 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-20 text-center">
                 <div className="flex flex-col items-center">
                    <h3 className="text-6xl font-black text-white tracking-tighter leading-none mb-8">{mockItems[activeItem].name}</h3>
                    <div className="flex items-center space-x-10">
                       <div className="text-left">
                          <p className="text-4xl font-black text-white tracking-tighter leading-none">{mockItems[activeItem].price}</p>
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Master Identity</span>
                       </div>
                       <div className="w-[1px] h-10 bg-white/10"></div>
                       <button onClick={startAR} className="px-12 py-5 bg-indigo-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-2xl active:scale-95 border-none">
                          Manifest AR
                       </button>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {/* Controls HUD */}
          {showAR && selectedAssetId && (
            <div className="absolute bottom-10 left-10 right-10 z-50 flex flex-col space-y-4 pointer-events-auto">
               <div className="bg-slate-950/90 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.8)] animate-in slide-in-from-bottom-10 duration-500 max-w-4xl mx-auto w-full">
                 <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                    <div className="flex-1 space-y-4 w-full">
                       <div className="flex justify-between items-center px-2">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Scale Shard</span>
                          <span className="text-xs font-black text-white">x{currentScale.toFixed(2)}</span>
                       </div>
                       <input 
                          type="range" min="0.3" max="3" step="0.01" 
                          value={currentScale} 
                          onChange={(e) => updateSelectedAsset('scale', parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-slate-800 rounded-full appearance-none accent-indigo-500 cursor-pointer"
                       />
                    </div>
                    <div className="flex-1 space-y-4 w-full">
                       <div className="flex justify-between items-center px-2">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Spatial Orientation</span>
                          <span className="text-xs font-black text-white">{currentRotation}°</span>
                       </div>
                       <input 
                          type="range" min="0" max="360" step="1" 
                          value={currentRotation} 
                          onChange={(e) => updateSelectedAsset('rotation', parseInt(e.target.value))}
                          className="w-full h-1.5 bg-slate-800 rounded-full appearance-none accent-indigo-500 cursor-pointer"
                       />
                    </div>
                    <div className="flex space-x-3">
                      <button 
                        onClick={removeSelected}
                        className="w-14 h-14 bg-rose-600/10 text-rose-500 rounded-2xl flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all border border-rose-500/20"
                        title="De-anchor Asset"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                      <button 
                        onClick={() => setSelectedAssetId(null)}
                        className="w-14 h-14 bg-white text-black rounded-2xl flex items-center justify-center hover:bg-slate-200 transition-all shadow-xl"
                        title="Deselect"
                      >
                        <i className="fa-solid fa-check text-xl"></i>
                      </button>
                    </div>
                 </div>
               </div>
            </div>
          )}

          {showAR && (
            <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between pointer-events-none">
                <div className="hidden lg:block"></div>
                <button 
                  onClick={stopAR} 
                  className="w-16 h-16 bg-rose-600 text-white rounded-[1.5rem] flex items-center justify-center transition-all shadow-2xl active:scale-90 border border-white/10 pointer-events-auto"
                >
                  <i className="fa-solid fa-power-off text-xl"></i>
                </button>
            </div>
          )}

          {spatialAdvice && (
            <div className="absolute top-10 right-10 w-72 bg-slate-950/80 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-indigo-500/20 shadow-2xl animate-in fade-in slide-in-from-right-10 z-50">
               <div className="flex items-center space-x-3 mb-4">
                  <i className="fa-solid fa-wand-magic-sparkles text-indigo-400 text-xs animate-pulse"></i>
                  <span className="text-[9px] font-black text-white uppercase tracking-widest">Neural Spatial Advisor</span>
               </div>
               <p className="text-xs text-slate-300 leading-relaxed font-bold italic opacity-90">"{spatialAdvice}"</p>
            </div>
          )}
        </div>

        <div className="space-y-8 h-full flex flex-col">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Inventory</h3>
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">3 Units Locked</span>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-4">
            {mockItems.map((item, i) => (
              <button 
                key={i} 
                onClick={() => { setActiveItem(i); setSelectedAssetId(null); }} 
                className={`w-full p-5 rounded-[2rem] border transition-all flex items-center space-x-5 group ${
                  activeItem === i ? 'bg-indigo-600 border-indigo-500 shadow-2xl' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'
                }`}
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-950 flex-shrink-0 border border-white/10 shadow-inner">
                  <img src={item.img} className="w-full h-full object-contain p-2" alt={item.name} draggable={false} />
                </div>
                <div className="text-left">
                  <p className={`font-black text-base tracking-tight ${activeItem === i ? 'text-white' : 'text-slate-200'}`}>{item.name}</p>
                  <p className={`text-xs font-bold mt-1 ${activeItem === i ? 'text-indigo-200' : 'text-slate-500'}`}>{item.price}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 space-y-4 shadow-xl">
             <div className="flex items-center space-x-3">
                <i className="fa-solid fa-cube text-indigo-400 text-sm"></i>
                <h4 className="text-[9px] font-black text-white uppercase tracking-widest">Asset Parameters</h4>
             </div>
             <p className="text-xs text-slate-400 leading-relaxed font-semibold italic opacity-80">"{mockItems[activeItem].description}"</p>
          </div>
          
          <button className="w-full py-6 bg-white text-black rounded-3xl font-black text-sm uppercase tracking-[0.3em] hover:bg-slate-200 transition-all shadow-xl border-none">
            Acquire Logic Shard
          </button>
        </div>
      </div>
    </div>
  );
};

export default VirtualStore;
