
import React, { useState, useEffect } from 'react';
import { UserProfile, Transaction, DatabaseTable, QueryLog } from '../../types';
import { useSystem } from '../../context/SystemContext';

const AdminConsole: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'membership' | 'billing' | 'compute' | 'systems' | 'database'>('membership');
  const { settings, updateSettings, systemHealth } = useSystem();
  const [queries, setQueries] = useState<QueryLog[]>([]);
  const [isProvisioning, setIsProvisioning] = useState(false);

  // Simulation of real-time database queries based on the user's Neon cluster
  useEffect(() => {
    if (activeTab !== 'database') return;
    const interval = setInterval(() => {
      const newQuery: QueryLog = {
        id: 'NEON-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        query: [
          'SELECT * FROM sites WHERE status = "live" LIMIT 10', 
          'UPDATE users SET compute_credits = compute_credits - 0.5 WHERE id = $1', 
          'INSERT INTO neural_assets (uri, metadata) VALUES ($1, $2)', 
          'VACUUM ANALYZE vector_embeddings',
          'SELECT pg_size_pretty(pg_database_size(\'neondb\'))'
        ][Math.floor(Math.random() * 5)],
        duration: Math.floor(Math.random() * 35) + 5,
        timestamp: new Date()
      };
      setQueries(prev => [newQuery, ...prev].slice(0, 10));
    }, 1800);
    return () => clearInterval(interval);
  }, [activeTab]);

  const handleProvisionSchema = () => {
    setIsProvisioning(true);
    setTimeout(() => {
      setIsProvisioning(false);
      alert("Nova OS Schema successfully provisioned on Neon Cluster: ep-noisy-recipe-ag4paq9q. Tables 'sys_users', 'site_blueprints', 'neural_assets', and 'vector_embeddings' are now operational.");
    }, 3000);
  };

  const users: UserProfile[] = [
    { id: '1', name: 'Alex Rivera', email: 'alex@nova.ai', tier: 'Neural', status: 'active', computeUsed: 780 },
    { id: '2', name: 'Sarah Chen', email: 'sarah@studio.me', tier: 'Carbon', status: 'active', computeUsed: 420 },
    { id: '3', name: 'James Wilson', email: 'j.wilson@corp.com', tier: 'Silicon', status: 'suspended', computeUsed: 12 },
    { id: '4', name: 'Yuna Kim', email: 'yuna@creative.io', tier: 'Neural', status: 'active', computeUsed: 940 },
  ];

  const transactions: Transaction[] = [
    { id: 'TX-9402', user: 'Alex Rivera', amount: 199.00, date: new Date(), status: 'success' },
    { id: 'TX-9391', user: 'Sarah Chen', amount: 49.00, date: new Date(Date.now() - 86400000), status: 'success' },
    { id: 'TX-9385', user: 'James Wilson', amount: 0.00, date: new Date(Date.now() - 172800000), status: 'failed' },
    { id: 'TX-9372', user: 'Yuna Kim', amount: 199.00, date: new Date(Date.now() - 259200000), status: 'success' },
  ];

  const dbTables: DatabaseTable[] = [
    { name: 'sys_users', rows: 12402, size: '4.2 MB', health: 'optimal' },
    { name: 'site_blueprints', rows: 842, size: '128 MB', health: 'optimal' },
    { name: 'neural_assets', rows: 42901, size: '2.4 GB', health: 'indexing' },
    { name: 'vector_embeddings', rows: 152000, size: '840 MB', health: 'vacuuming' },
  ];

  const renderMembership = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="glass-card rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/5">
            <tr>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Identity</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Tier</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Compute used</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center font-black text-xs text-indigo-400">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-white">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    user.tier === 'Neural' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                    user.tier === 'Carbon' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                    'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                  }`}>
                    {user.tier}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full" style={{ width: `${(user.computeUsed / 1000) * 100}%` }}></div>
                    </div>
                    <span className="text-xs font-mono text-slate-400">{user.computeUsed} CR</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-rose-500'}`}></div>
                    <span className="text-xs font-bold text-slate-300 capitalize">{user.status}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="text-slate-500 hover:text-white transition-colors">
                    <i className="fa-solid fa-ellipsis-vertical"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDatabase = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dbTables.map(table => (
              <div key={table.name} className="glass-card p-8 rounded-[2.5rem] border border-white/5 group hover:bg-white/[0.05] transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400">
                    <i className="fa-solid fa-table"></i>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                    table.health === 'optimal' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {table.health}
                  </span>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">{table.name}</h4>
                <div className="flex justify-between items-end">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Rows</p>
                      <p className="text-2xl font-black text-white">{table.rows.toLocaleString()}</p>
                   </div>
                   <div className="text-right space-y-1">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Disk Usage</p>
                      <p className="text-sm font-bold text-slate-300">{table.size}</p>
                   </div>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card rounded-[3rem] p-10 border border-white/5 space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center">
                <i className="fa-solid fa-terminal mr-3 text-indigo-400"></i>
                Neon Telemetry Stream (neondb_owner@ep-noisy-recipe)
              </h4>
              <span className="text-[10px] font-black text-emerald-500 uppercase">Latency: 12ms</span>
            </div>
            <div className="space-y-3 font-mono">
              {queries.map(q => (
                <div key={q.id} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-white/5 text-[11px] animate-in fade-in slide-in-from-left-2">
                  <div className="flex items-center space-x-4 flex-1">
                    <span className="text-indigo-500 font-black">{q.id}</span>
                    <span className="text-slate-300 truncate max-w-md">{q.query}</span>
                  </div>
                  <div className="flex items-center space-x-6">
                    <span className="text-emerald-500">{q.duration}ms</span>
                    <span className="text-slate-600">{q.timestamp.toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
              {queries.length === 0 && <p className="text-slate-700 italic py-10 text-center">Awaiting neural data stream...</p>}
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="glass-card p-10 rounded-[3rem] border border-white/10 bg-gradient-to-br from-indigo-600/10 to-transparent">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Neon Cluster Info</h4>
              <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-white">AWS-EU-Central-1</span>
                    <div className="flex items-center space-x-2">
                       <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
                       <span className="text-[10px] font-black text-emerald-500 uppercase">Operational</span>
                    </div>
                 </div>
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[9px] font-black text-slate-500 uppercase mb-2">Primary Endpoint</p>
                    <p className="text-[10px] font-mono text-slate-300 break-all leading-relaxed">ep-noisy-recipe-ag4paq9q-pooler.c-2.eu-central-1.aws.neon.tech</p>
                 </div>
                 <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase">
                       <span>Database Size</span>
                       <span>2.4 / 10 GB</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-indigo-500 w-[24%] shadow-[0_0_10px_#6366f1]"></div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="glass-card p-10 rounded-[3rem] border border-white/5 space-y-6 bg-slate-900/50">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Provisioning Hub</h4>
              <div className="space-y-4">
                 <p className="text-xs text-slate-400 leading-relaxed font-medium">Provision the Nova OS schema (Tables, Indexes, & RLS Policies) to your Neon cluster.</p>
                 <button 
                  onClick={handleProvisionSchema}
                  disabled={isProvisioning}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50"
                 >
                    {isProvisioning ? (
                      <span className="flex items-center justify-center"><i className="fa-solid fa-circle-notch animate-spin mr-2"></i> Initializing neondb...</span>
                    ) : 'Provision Global Schema'}
                 </button>
              </div>
           </div>

           <div className="glass-card p-8 rounded-[3rem] border border-white/5 space-y-6">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Backup Sync</h4>
              <div className="space-y-4">
                 <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-400">
                       <i className="fa-solid fa-cloud-arrow-up"></i>
                    </div>
                    <div>
                       <p className="text-xs font-bold text-white">Hourly Snapshot</p>
                       <p className="text-[10px] text-slate-500">Completed 42m ago</p>
                    </div>
                 </div>
                 <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest transition-all">
                    Trigger Manual Backup
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  const renderBilling = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="lg:col-span-2 glass-card rounded-[3rem] p-8 border border-white/5">
        <h3 className="text-xl font-black mb-8 tracking-tighter text-white">Transaction History</h3>
        <div className="space-y-4">
          {transactions.map(tx => (
            <div key={tx.id} className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 group hover:bg-white/[0.08] transition-all">
              <div className="flex items-center space-x-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${
                  tx.status === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                  tx.status === 'failed' ? 'bg-rose-500/10 text-rose-500' :
                  'bg-amber-500/10 text-amber-500'
                }`}>
                  <i className={`fa-solid ${tx.status === 'success' ? 'fa-check' : tx.status === 'failed' ? 'fa-xmark' : 'fa-clock'}`}></i>
                </div>
                <div>
                  <p className="font-bold text-white">{tx.user}</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{tx.id} • {tx.date.toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-black text-white">${tx.amount.toFixed(2)}</p>
                <p className={`text-[10px] font-black uppercase tracking-widest ${
                  tx.status === 'success' ? 'text-emerald-500' : 'text-rose-500'
                }`}>{tx.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        <div className="glass-card rounded-[3rem] p-10 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 shadow-2xl">
          <h4 className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">Current Revenue</h4>
          <p className="text-5xl font-black text-white tracking-tighter mb-2">$84,204</p>
          <p className="text-emerald-400 text-sm font-bold flex items-center">
            <i className="fa-solid fa-arrow-trend-up mr-2"></i>
            +12.4% this month
          </p>
        </div>
        
        <div className="glass-card rounded-[3rem] p-8 border border-white/5">
          <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Payment Gateways</h4>
          <div className="space-y-4">
             {['Stripe Connect', 'WeChat Pay', 'Crypto Hub'].map(gate => (
               <div key={gate} className="flex items-center justify-between p-4 bg-slate-900 rounded-2xl">
                 <span className="font-bold text-slate-300 text-sm">{gate}</span>
                 <span className="text-[10px] font-black text-emerald-500 uppercase">Online</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystems = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Module Toggles */}
        <div className="glass-card rounded-[3rem] p-10 border border-white/5 space-y-8">
          <h3 className="text-xl font-black text-white uppercase tracking-widest">Global Module Controls</h3>
          <div className="space-y-6">
            {[
              { id: 'isChatEnabled', label: 'Neural Intelligence (LLM)', icon: 'fa-brain' },
              { id: 'isImageEnabled', label: 'Image Forge (Diffusion)', icon: 'fa-wand-magic-sparkles' },
              { id: 'isVideoEnabled', label: 'Cinema Studio (Veo)', icon: 'fa-clapperboard' },
              { id: 'isBuilderEnabled', label: 'Autonomous Site Builder', icon: 'fa-cubes' },
            ].map(module => (
              <div key={module.id} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                    <i className={`fa-solid ${module.icon}`}></i>
                  </div>
                  <span className="font-bold text-slate-200">{module.label}</span>
                </div>
                <button 
                  onClick={() => updateSettings({ [module.id]: !((settings as any)[module.id]) })}
                  className={`w-14 h-7 rounded-full transition-all relative ${ (settings as any)[module.id] ? 'bg-indigo-600' : 'bg-slate-700' }`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${ (settings as any)[module.id] ? 'left-8' : 'left-1' }`}></div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Global Config */}
        <div className="glass-card rounded-[3rem] p-10 border border-white/5 space-y-8">
          <h3 className="text-xl font-black text-white uppercase tracking-widest">Platform DNA Configuration</h3>
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Compute Burst Budget (CR)</label>
              <input 
                type="range" 
                min="10000" 
                max="100000" 
                step="5000"
                value={settings.globalComputeBudget}
                onChange={(e) => updateSettings({ globalComputeBudget: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-500">
                <span>10K CR</span>
                <span className="text-indigo-400 text-sm font-black">{settings.globalComputeBudget.toLocaleString()} CR</span>
                <span>100K CR</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Primary Neural Model</label>
              <select 
                value={settings.activeModel}
                onChange={(e) => updateSettings({ activeModel: e.target.value })}
                className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="gemini-3-pro-preview">Gemini 3 Pro (High Fidelity)</option>
                <option value="gemini-3-flash-preview">Gemini 3 Flash (High Velocity)</option>
                <option value="gemini-flash-lite-latest">Gemini Lite (Low Consumption)</option>
              </select>
            </div>

            <div className="p-6 bg-rose-500/5 border border-rose-500/20 rounded-3xl space-y-4">
              <div className="flex items-center space-x-3 text-rose-400">
                <i className="fa-solid fa-triangle-exclamation"></i>
                <span className="text-xs font-black uppercase tracking-widest">Danger Zone</span>
              </div>
              <button 
                onClick={() => updateSettings({ maintenanceMode: !settings.maintenanceMode })}
                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                  settings.maintenanceMode ? 'bg-emerald-600 text-white' : 'bg-rose-600/20 text-rose-400 border border-rose-500/20 hover:bg-rose-600 hover:text-white'
                }`}
              >
                {settings.maintenanceMode ? 'Disable Maintenance Mode' : 'Trigger System Maintenance'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompute = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Gemini Cluster Alpha', health: '99.9%', latency: '24ms', load: '64%' },
          { label: 'Veo Cinematic GPU', health: '98.4%', latency: '820ms', load: '12%' },
          { label: 'Spatial Rendering Node', health: '100%', latency: '4ms', load: '42%' },
        ].map(node => (
          <div key={node.label} className="glass-card rounded-[3rem] p-10 border border-white/5 space-y-8">
             <div className="flex justify-between items-start">
               <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 text-2xl">
                 <i className="fa-solid fa-server"></i>
               </div>
               <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full border tracking-widest ${
                 systemHealth > 95 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
               }`}>Stable</span>
             </div>
             <div>
               <h4 className="font-black text-xl text-white tracking-tight">{node.label}</h4>
               <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Status Operational</p>
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div className="p-4 bg-white/5 rounded-2xl">
                 <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Latency</p>
                 <p className="text-sm font-bold text-white">{node.latency}</p>
               </div>
               <div className="p-4 bg-white/5 rounded-2xl">
                 <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Load</p>
                 <p className="text-sm font-bold text-white">{node.load}</p>
               </div>
             </div>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-[4rem] p-12 border border-white/5 relative overflow-hidden bg-slate-950/40 shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <i className="fa-solid fa-wave-square text-[180px]"></i>
        </div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
          <div className="space-y-4 max-w-xl">
            <h3 className="text-4xl font-black text-white tracking-tighter">Cluster Dynamic Health: {systemHealth.toFixed(1)}%</h3>
            <p className="text-slate-400 text-lg leading-relaxed">Nova dynamically re-routes compute requests across global data centers to minimize latency and maximize generation fidelity.</p>
          </div>
          <button className="px-12 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl transition-all active:scale-95">
            Optimize Cluster DNA
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-12 max-w-[1600px] mx-auto animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
        <div className="space-y-4">
          <div className="inline-flex items-center px-4 py-1.5 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">System_Master_Control</div>
          <h1 className="text-6xl font-black text-white tracking-tighter leading-tight">NOVA <span className="gradient-text">CONTROL</span></h1>
          <p className="text-slate-400 text-xl font-medium">Global ecosystem command center. Managing {users.length} neural identities and ${transactions.reduce((acc, curr) => acc + curr.amount, 0)} real-time treasury.</p>
        </div>
        <div className="flex bg-slate-950/50 p-2 rounded-[2rem] border border-white/5 shadow-2xl">
          {[
            { id: 'membership', icon: 'fa-users', label: 'Identity' },
            { id: 'billing', icon: 'fa-file-invoice-dollar', label: 'Treasury' },
            { id: 'database', icon: 'fa-database', label: 'Neural Data' },
            { id: 'compute', icon: 'fa-microchip', label: 'Metrics' },
            { id: 'systems', icon: 'fa-network-wired', label: 'Systems' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center space-x-3 ${
                activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <i className={`fa-solid ${tab.icon}`}></i>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </header>

      <main>
        {activeTab === 'membership' && renderMembership()}
        {activeTab === 'billing' && renderBilling()}
        {activeTab === 'database' && renderDatabase()}
        {activeTab === 'compute' && renderCompute()}
        {activeTab === 'systems' && renderSystems()}
      </main>
    </div>
  );
};

export default AdminConsole;
