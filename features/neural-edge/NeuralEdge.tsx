
import React, { useState } from 'react';
import { processEdgeOperation } from '../../services/geminiService';

const NeuralEdge: React.FC = () => {
  const [taskType, setTaskType] = useState('metadata-extraction');
  const [inputData, setInputData] = useState('');
  const [output, setOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);

  const tasks = [
    { id: 'metadata-extraction', label: 'Metadata Forge', icon: 'fa-tags', desc: 'Extract clean tags and structured data.' },
    { id: 'sentiment-analysis', label: 'Sentiment Audit', icon: 'fa-face-smile', desc: 'Identify emotional vector of input.' },
    { id: 'code-optimization', label: 'Logic Shaper', icon: 'fa-code', desc: 'Review and refine code snippets.' },
    { id: 'operational-sanity', label: 'Sanity Check', icon: 'fa-shield-check', desc: 'Verify data integrity and logic.' }
  ];

  const handleProcess = async () => {
    if (!inputData.trim() || isProcessing) return;

    const start = performance.now();
    setIsProcessing(true);
    try {
      const selectedTask = tasks.find(t => t.id === taskType)?.label || taskType;
      const result = await processEdgeOperation(selectedTask, inputData);
      const end = performance.now();
      setLatency(end - start);
      setOutput(result || 'Operational failure. Data corrupted.');
    } catch (error) {
      console.error(error);
      setOutput('Critical Node Error: Request timeout.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-4">
        <div className="inline-flex items-center px-4 py-1.5 bg-amber-500/10 rounded-full border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-[0.3em]">Edge_Compute_Node_Gamma</div>
        <h1 className="text-6xl font-black tracking-tighter text-white">Neural <span className="text-amber-400">Edge</span></h1>
        <p className="text-slate-400 text-xl font-medium">Local-speed operational intelligence. High-throughput, low-latency node for automated system logistics.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
        {/* Task Selection */}
        <div className="lg:col-span-1 space-y-6">
           <div className="glass-card rounded-[3rem] p-10 border border-white/5 space-y-8">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Select Operational Task</h3>
              <div className="space-y-4">
                 {tasks.map(task => (
                   <button
                    key={task.id}
                    onClick={() => setTaskType(task.id)}
                    className={`w-full p-6 rounded-2xl border transition-all flex items-center space-x-6 text-left group ${
                      taskType === task.id 
                        ? 'bg-amber-600 border-amber-500 shadow-xl text-white' 
                        : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                   >
                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all ${
                       taskType === task.id ? 'bg-white text-amber-600' : 'bg-slate-900 text-slate-600 group-hover:text-amber-400'
                     }`}>
                       <i className={`fa-solid ${task.icon}`}></i>
                     </div>
                     <div>
                       <p className="font-black text-sm uppercase tracking-widest">{task.label}</p>
                       <p className={`text-[10px] font-bold ${taskType === task.id ? 'text-amber-100' : 'text-slate-500'}`}>{task.desc}</p>
                     </div>
                   </button>
                 ))}
              </div>
           </div>

           <div className="glass-card rounded-[3rem] p-10 border border-white/5 bg-amber-600/5">
              <div className="flex justify-between items-center mb-6">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Edge Health</span>
                 <span className="text-[10px] font-black text-amber-500 uppercase">Synchronized</span>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-500">Node Latency</span>
                    <span className="text-white">{latency ? `${latency.toFixed(0)}ms` : '--'}</span>
                 </div>
                 <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full w-[94%]" style={{ width: latency ? '98%' : '20%' }}></div>
                 </div>
                 <p className="text-[10px] text-slate-600 leading-relaxed italic">"Using Gemini Flash Lite to emulate local high-performance processing."</p>
              </div>
           </div>
        </div>

        {/* Console Interface */}
        <div className="lg:col-span-2 flex flex-col space-y-8">
           <div className="glass-card rounded-[4rem] flex-1 border border-white/5 overflow-hidden flex flex-col bg-slate-950 shadow-2xl">
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5">
                 <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Neural Console Stream</span>
                 </div>
                 <div className="flex space-x-4">
                    <button onClick={() => { setInputData(''); setOutput(''); setLatency(null); }} className="text-slate-500 hover:text-white transition-colors">
                       <i className="fa-solid fa-rotate-right"></i>
                    </button>
                 </div>
              </div>

              <div className="flex-1 flex flex-col p-10 space-y-10">
                 <div className="flex-1 space-y-4 flex flex-col">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Input Stream</label>
                    <textarea 
                      value={inputData}
                      onChange={(e) => setInputData(e.target.value)}
                      placeholder="Paste logs, code, or metadata to process..."
                      className="flex-1 bg-transparent border-none text-xl text-white font-mono resize-none focus:outline-none placeholder:text-slate-800"
                    />
                 </div>

                 <div className="w-full h-[1px] bg-white/5"></div>

                 <div className="flex-1 space-y-4 flex flex-col relative">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Processed Logic</label>
                    {isProcessing ? (
                       <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                          <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
                          <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] animate-pulse">Compressing neural packets...</p>
                       </div>
                    ) : (
                       <textarea 
                        readOnly
                        value={output}
                        placeholder="Awaiting input data..."
                        className="flex-1 bg-transparent border-none text-xl text-amber-100 font-mono resize-none focus:outline-none placeholder:text-slate-900"
                      />
                    )}
                 </div>
              </div>

              <div className="p-10 border-t border-white/5 bg-white/5 flex justify-between items-center">
                 <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Nova Edge v1.0.4</p>
                 <button 
                  onClick={handleProcess}
                  disabled={!inputData.trim() || isProcessing}
                  className="px-14 py-5 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-2xl shadow-amber-600/20 disabled:opacity-50"
                 >
                   Execute Operation
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default NeuralEdge;
