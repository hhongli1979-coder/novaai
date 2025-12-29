
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getFigmaFile, exportFigmaNodes, getFigmaNodesData, extractFileKeyFromUrl, FigmaNode } from '../../services/figmaService';
import { analyzeDesignShard, generateReactComponentFromImage, generateReactComponentFromStructure } from '../../services/geminiService';

/**
 * Design Ingest: Figma to React Manifest Pipeline
 * High-performance UI for syncing design tokens and structures into production code.
 */
const FigmaIngest: React.FC = () => {
  const [token, setToken] = useState(localStorage.getItem('figma_token') || '');
  const [fileUrl, setFileUrl] = useState('');
  const [nodes, setNodes] = useState<FigmaNode[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNodeIds, setSelectedNodeIds] = useState<Set<string>>(new Set());
  const [isFetching, setIsFetching] = useState(false);
  const [exportFormat, setExportFormat] = useState('png');
  const [isExporting, setIsExporting] = useState(false);
  const [exports, setExports] = useState<{ id: string, url: string, name: string }[]>([]);
  
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [activeCodeName, setActiveCodeName] = useState<string>('');
  const [customComponentName, setCustomComponentName] = useState<string>('');

  useEffect(() => {
    if (token) localStorage.setItem('figma_token', token);
  }, [token]);

  const handleFetchFile = async () => {
    if (!token || !fileUrl) return;
    setIsFetching(true);
    setNodes([]);
    setSelectedNodeIds(new Set());
    try {
      const fileKey = extractFileKeyFromUrl(fileUrl);
      const data = await getFigmaFile(token, fileKey);
      
      const flatNodes: FigmaNode[] = [];
      const traverse = (node: any) => {
        // High-level exportable containers and meaningful UI blocks
        if (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE' || node.type === 'GROUP') {
          flatNodes.push({ id: node.id, name: node.name, type: node.type });
        }
        if (node.children) node.children.forEach(traverse);
      };
      traverse(data.document);
      setNodes(flatNodes);
    } catch (err: any) {
      console.error(err);
      alert("Neural Bridge Fault: Could not access Figma file. Verify token permissions.");
    } finally {
      setIsFetching(false);
    }
  };

  const toggleNode = useCallback((id: string) => {
    setSelectedNodeIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleBatchIngest = async () => {
    if (selectedNodeIds.size === 0) return;
    setIsExporting(true);
    try {
      const fileKey = extractFileKeyFromUrl(fileUrl);
      const imageUrls: Record<string, string> = await exportFigmaNodes(token, fileKey, Array.from(selectedNodeIds), exportFormat);
      
      const newExports = Array.from(selectedNodeIds).map((id: string) => ({
        id,
        url: imageUrls[id],
        name: nodes.find(n => n.id === id)?.name || id
      }));
      setExports(newExports);
      
      // Auto-scroll to workspace on first ingestion
      if (exports.length === 0) {
        window.scrollTo({ top: 600, behavior: 'smooth' });
      }
    } catch (err: any) {
      console.error(err);
      alert("Neural Ingestion Interrupted.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleManifestReactShard = async (nodeId: string, name: string) => {
    setIsSynthesizing(true);
    setGeneratedCode(null);
    setAnalysisResult(null);
    setActiveCodeName(name);
    try {
      const fileKey = extractFileKeyFromUrl(fileUrl);
      const structureData = await getFigmaNodesData(token, fileKey, [nodeId]);
      const finalName = customComponentName.trim() || name.replace(/[^a-zA-Z0-9]/g, '') || 'LogicShard';
      
      const code = await generateReactComponentFromStructure(structureData.nodes[nodeId], finalName);
      setGeneratedCode(code || '// Manifest sequence returned null logic.');
    } catch (err: any) {
      console.error(err);
      alert("Neural Structural Manifest Failure: Could not transmute Figma metadata.");
    } finally {
      setIsSynthesizing(false);
      setCustomComponentName('');
    }
  };

  const handleVisionToCode = async (imageUrl: string, name: string) => {
    setIsSynthesizing(true);
    setGeneratedCode(null);
    setAnalysisResult(null);
    setActiveCodeName(name);
    try {
      const finalName = customComponentName.trim() || name.replace(/[^a-zA-Z0-9]/g, '') || 'VisionShard';
      const code = await generateReactComponentFromImage(imageUrl, finalName);
      setGeneratedCode(code || '// Vision synthesis failed.');
    } catch (err: any) {
      console.error(err);
      alert("Neural Vision Synth Failure.");
    } finally {
      setIsSynthesizing(false);
    }
  };

  const downloadManifest = () => {
    if (!generatedCode) return;
    const blob = new Blob([generatedCode], { type: 'text/typescript-react' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeCodeName.replace(/[^a-zA-Z0-9]/g, '')}.tsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredNodes = useMemo(() => {
    if (!searchTerm) return nodes;
    return nodes.filter(n => n.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [nodes, searchTerm]);

  const renderedNodesList = useMemo(() => {
    return filteredNodes.slice(0, 200).map(node => (
      <button 
        key={node.id}
        onClick={() => toggleNode(node.id)}
        className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left group accelerate ${
          selectedNodeIds.has(node.id) 
            ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-lg' 
            : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10 hover:text-slate-200'
        }`}
      >
        <div className="flex items-center space-x-4 min-w-0">
          <i className={`fa-solid ${node.type === 'FRAME' ? 'fa-window-maximize' : node.type === 'COMPONENT' ? 'fa-cubes' : 'fa-clone'} text-[10px] opacity-40 group-hover:opacity-100`}></i>
          <span className="text-xs font-bold truncate uppercase tracking-tighter">{node.name}</span>
        </div>
        <div className="flex items-center space-x-3">
           <span className="text-[8px] font-black text-slate-700 uppercase">{node.type}</span>
           {selectedNodeIds.has(node.id) && <i className="fa-solid fa-check text-[10px] text-indigo-400"></i>}
        </div>
      </button>
    ));
  }, [filteredNodes, selectedNodeIds, toggleNode]);

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500 pb-32">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center px-4 py-1.5 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">Module_Design_Ops_v4.2</div>
          <h1 className="text-6xl font-black tracking-tighter text-white uppercase leading-none">Design <span className="gradient-text">Ingest</span></h1>
          <p className="text-slate-400 text-xl font-medium max-w-2xl">Transmute Figma structural metadata into high-fidelity, ARIA-accessible React components with Tailwind CSS.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* CONFIGURATION & NODE SELECTOR */}
        <div className="xl:col-span-1 space-y-8">
           <div className="glass-card rounded-[2.5rem] p-10 space-y-8 bg-slate-900/40 border border-white/5 shadow-2xl">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center">
                <i className="fa-solid fa-link mr-3 text-indigo-400"></i> Figma Core Pipeline
              </h3>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-2">Access Token</label>
                  <input 
                    type="password"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="figd_..."
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl p-5 text-white font-mono text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-2">Canonical File URL</label>
                  <input 
                    type="text"
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    placeholder="https://figma.com/file/..."
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl p-5 text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-inner"
                  />
                </div>
                <button 
                  onClick={handleFetchFile}
                  disabled={isFetching || !token || !fileUrl}
                  className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-2xl disabled:opacity-30 group"
                >
                  {isFetching ? <i className="fa-solid fa-circle-notch animate-spin mr-2"></i> : <i className="fa-solid fa-satellite-dish mr-2"></i>}
                  Establish Synchronization
                </button>
              </div>
           </div>

           {nodes.length > 0 && (
             <div className="glass-card rounded-[2.5rem] p-10 space-y-8 animate-in slide-in-from-bottom-4 duration-500 border border-white/5 bg-slate-900/20 shadow-xl flex flex-col">
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Select Nodes for Manifest</h3>
                      <span className="text-[10px] font-black text-indigo-400">{selectedNodeIds.size} Marked</span>
                   </div>
                   <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Search nodes by designation..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-950 border border-white/5 rounded-xl p-4 text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500/30 shadow-inner"
                      />
                      <i className="fa-solid fa-magnifying-glass absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 text-[10px]"></i>
                   </div>
                </div>
                
                <div className="space-y-2 max-h-[460px] overflow-y-auto custom-scrollbar pr-2 -mx-2 px-2">
                   {renderedNodesList}
                   {filteredNodes.length === 0 && (
                     <p className="text-center py-10 text-[10px] font-bold text-slate-700 uppercase">No nodes match protocol</p>
                   )}
                </div>

                <div className="pt-4 space-y-6">
                   <div className="flex justify-between items-center px-2">
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Preview Scale</span>
                      <div className="flex bg-slate-950 p-1 rounded-xl border border-white/5">
                        {['png', 'svg', 'jpg'].map(fmt => (
                          <button 
                            key={fmt} 
                            onClick={() => setExportFormat(fmt)}
                            className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${exportFormat === fmt ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 hover:text-slate-400'}`}
                          >
                            {fmt}
                          </button>
                        ))}
                      </div>
                   </div>

                   <button 
                    onClick={handleBatchIngest}
                    disabled={isExporting || selectedNodeIds.size === 0}
                    className="w-full py-5 bg-white text-black hover:bg-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-2xl disabled:opacity-30 border-none"
                   >
                     {isExporting ? <i className="fa-solid fa-atom animate-spin mr-2"></i> : <i className="fa-solid fa-bolt mr-2"></i>}
                     {isExporting ? 'Manifesting Assets...' : 'Ingest Selected Shards'}
                   </button>
                </div>
             </div>
           )}
        </div>

        {/* WORKSPACE AREA */}
        <div className="xl:col-span-2 space-y-10">
           <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 flex items-center justify-between gap-8 bg-white/5">
              <div className="flex items-center space-x-6">
                 <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                    <i className="fa-solid fa-signature"></i>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Component Name Override</p>
                    <input 
                      type="text" 
                      placeholder="Deriving from Figma Node..."
                      value={customComponentName}
                      onChange={(e) => setCustomComponentName(e.target.value)}
                      className="bg-transparent border-none p-0 text-white text-xl font-black outline-none placeholder:text-slate-800 w-full"
                    />
                 </div>
              </div>
           </div>

           {exports.length === 0 ? (
             <div className="glass-card rounded-[4rem] h-[720px] border-dashed border-2 border-white/5 flex flex-col items-center justify-center text-slate-800 space-y-10 animate-pulse">
                <i className="fa-brands fa-figma text-[160px] opacity-5"></i>
                <div className="text-center space-y-3">
                   <p className="text-2xl font-black uppercase tracking-[0.4em] opacity-20">Awaiting Designation</p>
                   <p className="text-[10px] font-bold uppercase tracking-widest opacity-10">Neural connection stable. Ingest nodes to build manifest workspace.</p>
                </div>
             </div>
           ) : (
             <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {exports.map(exp => (
                     <div key={exp.id} className="glass-card rounded-[3rem] border border-white/5 overflow-hidden group hover:border-indigo-500/40 transition-all flex flex-col bg-slate-900/40 shadow-2xl accelerate">
                        <div className="aspect-video bg-slate-950 flex items-center justify-center p-8 relative overflow-hidden group/img">
                           <img src={exp.url} alt={exp.name} className="max-w-full max-h-full object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.7)] transition-transform group-hover/img:scale-105 duration-1000" />
                           <div className="absolute top-4 left-4">
                              <span className="px-3 py-1 bg-black/60 backdrop-blur-xl rounded-lg text-[8px] font-black text-slate-400 uppercase border border-white/5">{exp.id}</span>
                           </div>
                           <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        </div>
                        <div className="p-8 space-y-8 flex-1 flex flex-col justify-between">
                           <div className="space-y-2">
                              <h4 className="text-xl font-black text-white uppercase tracking-tighter truncate leading-none">{exp.name}</h4>
                              <div className="flex items-center space-x-3">
                                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Locked for Component Manifest</p>
                              </div>
                           </div>
                           <div className="flex flex-col gap-3">
                              <button 
                                onClick={() => handleManifestReactShard(exp.id, exp.name)}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center group/btn"
                              >
                                <i className="fa-solid fa-code-branch mr-3 group-hover/btn:rotate-12 transition-transform"></i> Manifest React Logic
                              </button>
                              <div className="grid grid-cols-2 gap-3">
                                 <button 
                                    onClick={() => handleVisionToCode(exp.url, exp.name)}
                                    className="w-full py-3 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                                 >
                                    Vision Synth
                                 </button>
                                 <button 
                                    onClick={() => { 
                                      setAnalysisResult(null); 
                                      setGeneratedCode(null);
                                      setActiveCodeName(exp.name);
                                      analyzeDesignShard(exp.url, `Audit design shard "${exp.name}" for ARIA compliance and semantic structural accessibility. Return a categorized technical report with implementation details for React.`).then(setAnalysisResult); 
                                    }}
                                    className="w-full py-3 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                                 >
                                    A11y Audit
                                 </button>
                              </div>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>

                {(generatedCode || isSynthesizing || analysisResult) && (
                  <div className="glass-card rounded-[3.5rem] p-12 border border-indigo-500/30 bg-slate-950/80 shadow-[0_60px_140px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-500 space-y-10 relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 animate-pulse"></div>
                     
                     <div className="flex items-center justify-between border-b border-white/5 pb-10">
                        <div className="flex items-center space-x-8">
                           <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white text-3xl shadow-[0_0_60px_rgba(99,102,241,0.6)] animate-pulse">
                              <i className={`fa-solid ${analysisResult ? 'fa-shield-heart' : 'fa-terminal'}`}></i>
                           </div>
                           <div>
                              <h3 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">{analysisResult ? 'Intelligence Audit' : 'Component Manifest'}</h3>
                              <div className="flex items-center space-x-3 mt-3">
                                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em]">Target Entity: {activeCodeName}</span>
                                <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Protocol: React 19 + ARIA v5</span>
                              </div>
                           </div>
                        </div>
                        <button onClick={() => { setGeneratedCode(null); setAnalysisResult(null); }} className="w-14 h-14 bg-white/5 hover:bg-rose-600 hover:text-white rounded-2xl flex items-center justify-center text-slate-500 transition-all border border-white/5">
                           <i className="fa-solid fa-xmark text-2xl"></i>
                        </button>
                     </div>
                     
                     <div className="relative">
                        {isSynthesizing ? (
                          <div className="flex flex-col items-center justify-center py-32 space-y-12">
                             <div className="w-32 h-32 border-[12px] border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin shadow-[0_0_100px_rgba(99,102,241,0.4)]"></div>
                             <div className="text-center space-y-4">
                                <p className="text-xl font-black text-indigo-400 uppercase tracking-[0.7em] animate-pulse">DNA Structural Mapping</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Transmuting Figma Attributes to ARIA Layer 4 & Tailwind JIT...</p>
                             </div>
                          </div>
                        ) : (
                          <div className="space-y-8 animate-in fade-in duration-700">
                             <div className="flex justify-between items-center px-6">
                                <div className="flex items-center space-x-5">
                                   <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">{analysisResult ? 'Structural Report' : 'Synthesized Logic Shard'}</span>
                                   <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
                                </div>
                                <div className="flex space-x-4">
                                  {generatedCode && (
                                    <>
                                      <button 
                                        onClick={() => { navigator.clipboard.writeText(generatedCode!); alert("Logic shard copied to secure clipboard."); }}
                                        className="text-[10px] font-black text-indigo-400 hover:text-white uppercase tracking-widest flex items-center bg-indigo-500/10 hover:bg-indigo-600 px-6 py-3 rounded-2xl transition-all border border-indigo-500/20"
                                      >
                                         <i className="fa-solid fa-copy mr-3"></i> Copy Logic
                                      </button>
                                      <button 
                                        onClick={downloadManifest}
                                        className="text-[10px] font-black text-emerald-400 hover:text-white uppercase tracking-widest flex items-center bg-emerald-500/10 hover:bg-emerald-600 px-6 py-3 rounded-2xl transition-all border border-emerald-500/20 shadow-xl"
                                      >
                                         <i className="fa-solid fa-cloud-arrow-down mr-3"></i> Export Shard
                                      </button>
                                    </>
                                  )}
                                </div>
                             </div>
                             <div className="bg-black/80 rounded-[3.5rem] p-12 border border-white/5 font-mono text-sm text-indigo-200 overflow-x-auto shadow-inner custom-scrollbar max-h-[720px] relative">
                                <pre className="leading-relaxed whitespace-pre-wrap">{analysisResult || generatedCode}</pre>
                             </div>
                          </div>
                        )}
                     </div>

                     {!isSynthesizing && generatedCode && (
                       <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
                          <div className="flex items-center space-x-6">
                             <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                                <i className="fa-solid fa-shield-check text-xl"></i>
                             </div>
                             <div>
                                <p className="text-[11px] text-white font-black uppercase tracking-widest">Logic Stream Integrity Verified</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Architected for: Nova Creative Mesh v4.0</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Shard Stability</p>
                             <p className="text-2xl font-black text-white tracking-tighter">SYNCHRONIZED</p>
                          </div>
                       </div>
                     )}
                  </div>
                )}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default FigmaIngest;
