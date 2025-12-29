
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import { AppRoute, UserRole } from './types';
import Dashboard from './features/dashboard/Dashboard';
import AIChat from './features/chat/AIChat';
import ImageForge from './features/image/ImageForge';
import VideoStudio from './features/video/VideoStudio';
import TranslateFeature from './features/translate/TranslateFeature';
import NeuralEdge from './features/neural-edge/NeuralEdge';
import VirtualStore from './features/ar-store/VirtualStore';
import Marketplace from './features/marketplace/Marketplace';
import SiteBuilder from './features/builder/SiteBuilder';
import AdminConsole from './features/admin/AdminConsole';
import { useSystem } from './context/SystemContext';

const App: React.FC = () => {
  const { userRole, setUserRole } = useSystem();
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.DASHBOARD);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [bootLog, setBootLog] = useState<string[]>([]);

  // System Boot Sequence Simulation
  useEffect(() => {
    const sequences = [
      "Initializing Nova Kernel v2.5...",
      "Connecting to Global Neural Mesh...",
      "Mapping Vercel Cloud Infrastructure...",
      "Synchronizing with mdio.shop edge nodes...",
      "Activating Gemini 3 Pro reasoning cluster...",
      "Deploying Neural Edge (Lite) operational cache...",
      "System Ready. Awaiting Master Identity..."
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < sequences.length) {
        setBootLog(prev => [...prev, `[OK] ${sequences[i]}`]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setIsBooting(false), 800);
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setIsAuthenticated(true);
    setCurrentRoute(AppRoute.DASHBOARD);
  };

  const renderContent = () => {
    // Route guard for Admin/Settings
    if ((currentRoute === AppRoute.ADMIN || currentRoute === AppRoute.SETTINGS) && userRole !== UserRole.ADMIN) {
      return <Dashboard onNavigate={setCurrentRoute} />;
    }

    // Route guard for Creator-tier features (Video, AR, etc)
    const creatorRoutes = [AppRoute.VIDEO, AppRoute.TRANSLATE, AppRoute.NEURAL_EDGE, AppRoute.AR_STORE, AppRoute.MARKETPLACE, AppRoute.BUILDER];
    if (creatorRoutes.includes(currentRoute) && userRole === UserRole.GUEST) {
      return <Dashboard onNavigate={setCurrentRoute} />;
    }

    switch (currentRoute) {
      case AppRoute.DASHBOARD:
        return <Dashboard onNavigate={setCurrentRoute} />;
      case AppRoute.CHAT:
        return <AIChat />;
      case AppRoute.IMAGE:
        return <ImageForge />;
      case AppRoute.VIDEO:
        return <VideoStudio />;
      case AppRoute.TRANSLATE:
        return <TranslateFeature />;
      case AppRoute.NEURAL_EDGE:
        return <NeuralEdge />;
      case AppRoute.AR_STORE:
        return <VirtualStore />;
      case AppRoute.MARKETPLACE:
        return <Marketplace />;
      case AppRoute.BUILDER:
        return <SiteBuilder />;
      case AppRoute.ADMIN:
        return <AdminConsole />;
      case AppRoute.SETTINGS:
        return (
          <div className="max-w-4xl mx-auto py-10 space-y-12">
            <h2 className="text-4xl font-black mb-10 tracking-tight text-white">Global Configuration</h2>
            <div className="glass-card bg-white/5 rounded-[3rem] p-12 border border-white/10 space-y-12 shadow-2xl">
               <div className="flex items-center justify-between p-8 bg-white/5 rounded-3xl border border-white/5">
                  <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-indigo-500/20 text-white">
                      <i className="fa-solid fa-key"></i>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white">Billing API Infrastructure</h4>
                      <p className="text-slate-400">Manage keys for high-throughput automated rendering.</p>
                    </div>
                  </div>
                  <button className="px-8 py-3 bg-white text-black rounded-xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all">
                    Configure Keys
                  </button>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-8 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all">
                     <div className="flex items-center space-x-3 mb-4">
                        <i className="fa-solid fa-microchip text-indigo-400"></i>
                        <h4 className="font-bold text-white">Auto-Optimization</h4>
                     </div>
                     <p className="text-sm text-slate-400">Nova will dynamically adjust model parameters for peak generation quality.</p>
                  </div>
                  <div className="p-8 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all">
                     <div className="flex items-center space-x-3 mb-4">
                        <i className="fa-solid fa-cloud-arrow-up text-pink-400"></i>
                        <h4 className="font-bold text-white">Edge Distribution</h4>
                     </div>
                     <p className="text-sm text-slate-400">Automatically cache AI assets globally for sub-100ms delivery.</p>
                  </div>
               </div>
            </div>
          </div>
        );
      default:
        return <Dashboard onNavigate={setCurrentRoute} />;
    }
  };

  if (isBooting) {
    return (
      <div className="h-screen w-screen bg-[#020617] flex flex-col items-center justify-center p-10 font-mono">
        <div className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center text-white text-4xl mb-12 animate-pulse shadow-[0_0_50px_rgba(79,70,229,0.4)]">
           <i className="fa-solid fa-atom animate-spin-slow"></i>
        </div>
        <div className="w-full max-w-md space-y-2">
          {bootLog.map((log, idx) => (
            <p key={idx} className="text-indigo-400 text-xs tracking-wider animate-in fade-in slide-in-from-left-2">{log}</p>
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="h-screen w-screen bg-[#020617] flex items-center justify-center p-10 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[150px] rounded-full"></div>
        
        <div className="glass-card max-w-xl w-full rounded-[3rem] p-12 border border-white/10 shadow-2xl flex flex-col items-center text-center space-y-10 relative z-10">
           <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-indigo-400 text-3xl">
              <i className="fa-solid fa-fingerprint animate-pulse"></i>
           </div>
           <div className="space-y-3">
              <h1 className="text-4xl font-black text-white tracking-tighter">NOVA <span className="gradient-text">OS</span></h1>
              <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Neural Identity Access</p>
           </div>

           <div className="grid grid-cols-1 gap-4 w-full">
              <button 
                onClick={() => handleLogin(UserRole.ADMIN)}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-600/20 transition-all active:scale-95 flex items-center justify-center space-x-3"
              >
                <i className="fa-solid fa-crown"></i>
                <span>Admin Master Link</span>
              </button>
              <button 
                onClick={() => handleLogin(UserRole.CREATOR)}
                className="w-full py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center space-x-3"
              >
                <i className="fa-solid fa-wand-sparkles"></i>
                <span>Creator Identity</span>
              </button>
              <button 
                onClick={() => handleLogin(UserRole.GUEST)}
                className="w-full py-4 bg-transparent hover:bg-white/5 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center space-x-3"
              >
                <i className="fa-solid fa-user-secret"></i>
                <span>Guest Protocol</span>
              </button>
           </div>

           <p className="text-[9px] text-slate-600 font-medium">By connecting, you agree to the Nova Autonomous System Protocols.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#020617] text-slate-100 relative selection:bg-indigo-500/30">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[250px] rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[200px] rounded-full animate-pulse"></div>
        <div className="absolute top-[30%] right-[10%] w-[40%] h-[40%] bg-blue-600/5 blur-[180px] rounded-full"></div>
      </div>

      <Sidebar currentRoute={currentRoute} onNavigate={setCurrentRoute} />
      
      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        <header className="h-24 flex items-center justify-between px-12 bg-slate-950/20 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
          <div className="flex items-center space-x-4">
             <div className="px-4 py-1.5 bg-white/5 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-indigo-400 shadow-inner">Nova Autonomous OS</div>
             <i className="fa-solid fa-chevron-right text-[10px] opacity-20"></i>
             <span className="text-sm font-bold capitalize text-white opacity-80">{(currentRoute as string).replace('-', ' ')}</span>
          </div>
          
          <div className="flex items-center space-x-8">
            <div className="hidden lg:flex items-center space-x-6">
               <div className="flex flex-col items-end">
                  <span className="text-xs font-black text-indigo-400 tracking-tighter uppercase">{userRole} IDENTITY</span>
                  <span className="text-[10px] text-slate-500 font-bold">{userRole === UserRole.ADMIN ? 'Root Privileges Active' : 'Restricted Access'}</span>
               </div>
               <div className="w-[1px] h-10 bg-white/10"></div>
            </div>
            <div className="flex items-center space-x-5">
               <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-white">{userRole === UserRole.ADMIN ? 'System Architect' : userRole === UserRole.CREATOR ? 'Content Engine' : 'Anonymous Guest'}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{userRole} Access</p>
               </div>
               <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl p-0.5 shadow-2xl transform hover:scale-105 transition-all cursor-pointer">
                  <img src="https://picsum.photos/200/200?grayscale" className="w-full h-full rounded-[0.85rem] object-cover border-2 border-slate-950 shadow-inner" alt="Identity" />
               </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
