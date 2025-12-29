
import React, { useState } from 'react';

const Marketplace: React.FC = () => {
  const [buyingId, setBuyingId] = useState<number | null>(null);
  const assets = [
    { name: 'Ultra-Realist Portait v4', type: 'Prompt Kit', price: '$24', category: 'Photography', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800' },
    { name: 'Lo-Fi Chill Hop Loop', type: 'Audio Asset', price: '$12', category: 'Music', img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800' },
    { name: 'Cyberpunk Site Layout', type: 'Site Template', price: '$89', category: 'Web', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800' },
    { name: 'Nebula cinematic Background', type: 'Video Asset', price: '$45', category: 'Cinema', img: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?auto=format&fit=crop&q=80&w=800' }
  ];

  const handlePurchase = (id: number) => {
    setBuyingId(id);
    setTimeout(() => {
      setBuyingId(null);
      alert("License forged and allocated to your Master ID vault.");
    }, 2000);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-2">
          <div className="inline-flex items-center px-4 py-1.5 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-2">Neural Creative Exchange</div>
          <h2 className="text-5xl font-black text-white tracking-tighter">AI Marketplace</h2>
          <p className="text-slate-400 text-xl">Discover, license, and deploy high-fidelity autonomous assets.</p>
        </div>
        <div className="flex bg-white/5 rounded-2xl p-2 border border-white/10 shadow-2xl">
           <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg">Trending</button>
           <button className="px-6 py-2 text-slate-500 hover:text-white transition-all text-sm font-bold">Newest</button>
           <button className="px-6 py-2 text-slate-500 hover:text-white transition-all text-sm font-bold">Bestsellers</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {assets.map((asset, i) => (
          <div key={i} className="group glass-card rounded-[2.5rem] border border-white/10 overflow-hidden hover:bg-white/[0.05] transition-all hover:-translate-y-2 shadow-xl relative">
             <div className="h-64 relative overflow-hidden">
                <img src={asset.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={asset.name} />
                <div className="absolute top-4 left-4">
                  <span className="bg-black/50 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full border border-white/10 uppercase tracking-widest">{asset.category}</span>
                </div>
             </div>
             <div className="p-8 space-y-4">
                <div className="space-y-1">
                   <p className="text-xs font-black text-indigo-400 uppercase tracking-widest">{asset.type}</p>
                   <h4 className="text-xl font-bold text-white leading-tight">{asset.name}</h4>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                   <span className="text-2xl font-black text-white">{asset.price}</span>
                   <button 
                    onClick={() => handlePurchase(i)}
                    disabled={buyingId !== null}
                    className="w-12 h-12 bg-white/5 hover:bg-indigo-600 text-white rounded-xl transition-all border border-white/10 flex items-center justify-center disabled:opacity-50"
                   >
                      {buyingId === i ? <i className="fa-solid fa-circle-notch animate-spin"></i> : <i className="fa-solid fa-cart-shopping"></i>}
                   </button>
                </div>
             </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
         <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 pointer-events-none">
            <i className="fa-solid fa-rocket text-[120px] rotate-12 -translate-y-10 translate-x-10"></i>
         </div>
         <div className="relative z-10 space-y-6 max-w-2xl">
            <h3 className="text-4xl font-black tracking-tighter">Monetize Your Intelligence</h3>
            <p className="text-indigo-100 text-xl font-medium">Join 5,000+ AI artists selling their prompts and creative blueprints on the global Nova Creative Exchange.</p>
            <button className="px-12 py-5 bg-white text-indigo-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95 shadow-2xl">
              Start Selling
            </button>
         </div>
      </div>
    </div>
  );
};

export default Marketplace;
