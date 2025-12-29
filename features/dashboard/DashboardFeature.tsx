
import React from 'react';
import { AppRoute, UserSite } from '../../types';

interface DashboardFeatureProps {
  onNavigate: (route: AppRoute) => void;
}

const DashboardFeature: React.FC<DashboardFeatureProps> = ({ onNavigate }) => {
  const stats = [
    { label: 'AI Credits', value: '840 / 1000', trend: 'Monthly Reset', icon: 'fa-bolt', color: 'text-yellow-400' },
    { label: 'Active Sites', value: '3', trend: '1 Pending', icon: 'fa-globe', color: 'text-emerald-400' },
    { label: 'Total Visits', value: '12.4K', trend: '+18%', icon: 'fa-chart-line', color: 'text-indigo-400' },
    { label: 'Assets', value: '142', trend: '2.4 GB', icon: 'fa-folder', color: 'text-pink-400' },
  ];

  const recentSites: UserSite[] = [
    { id: '1', name: 'Tech Blog Pro', domain: 'tech-blog.nova.ai', thumbnail: 'https://picsum.photos/400/250?random=11', lastModified: new Date() },
    { id: '2', name: 'Creative Portfolio', domain: 'portfolio.me', thumbnail: 'https://picsum.photos/400/250?random=22', lastModified: new Date() },
    { id: '3', name: 'Nova E-shop', domain: 'shop.nova.ai', thumbnail: 'https://picsum.photos/400/250?random=33', lastModified: new Date() },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">System Console</h1>
          <p className="text-slate-400 text-lg">Manage your AI ecosystem and digital properties.</p>
        </div>
        <button 
          onClick={() => onNavigate(AppRoute.BUILDER)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-1"
        >
          <i className="fa-solid fa-plus mr-2"></i> Create New Site
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-slate-800/50 backdrop-blur-md rounded-3xl p-6 border border-slate-700/50 hover:border-indigo-500/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center ${stat.color}`}>
                <i className={`fa-solid ${stat.icon} text-xl`}></i>
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.trend}</span>
            </div>
            <h3 className="text-slate-400 text-sm font-medium mb-1">{stat.label}</h3>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Sites Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">My AI Sites</h2>
            <button className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold">View All</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentSites.map(site => (
              <div key={site.id} className="group bg-slate-800 border border-slate-700 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all">
                <div className="h-48 relative overflow-hidden">
                  <img src={site.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={site.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-6">
                    <span className="bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full">LIVE</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-1">{site.name}</h3>
                  <p className="text-slate-400 text-sm mb-4">{site.domain}</p>
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded-xl text-xs font-bold transition-colors">Editor</button>
                    <button className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-xl flex items-center justify-center transition-colors">
                      <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Tools Quick Access */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Creative Suite</h2>
          <div className="space-y-4">
            {[
              { route: AppRoute.CHAT, label: 'Intelligent Chat', icon: 'fa-comments', color: 'bg-indigo-500' },
              { route: AppRoute.IMAGE, label: 'Image Forge', icon: 'fa-wand-magic-sparkles', color: 'bg-pink-500' },
              { route: AppRoute.VIDEO, label: 'Video Studio', icon: 'fa-clapperboard', color: 'bg-cyan-500' },
            ].map((tool, i) => (
              <button 
                key={i}
                onClick={() => onNavigate(tool.route)}
                className="w-full flex items-center p-4 bg-slate-800/40 border border-slate-700 rounded-2xl hover:bg-slate-700 transition-all group"
              >
                <div className={`w-12 h-12 ${tool.color} rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}>
                  <i className={`fa-solid ${tool.icon} text-white`}></i>
                </div>
                <div className="text-left">
                  <h4 className="font-bold">{tool.label}</h4>
                  <p className="text-xs text-slate-500">Launch AI tool</p>
                </div>
                <i className="fa-solid fa-chevron-right ml-auto text-slate-600"></i>
              </button>
            ))}
          </div>

          <div className="p-6 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-[2rem] border border-indigo-500/20">
            <h4 className="font-bold text-indigo-400 mb-2">Upgrade to Pro</h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">Unlock Veo 4K generation, custom domains, and team collaboration tools.</p>
            <button className="w-full bg-indigo-600 py-3 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20">Get Started</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardFeature;
