import React, { useState } from 'react';
import { Film, Camera, Sparkles, Check, DollarSign } from 'lucide-react';
import servicesData from '../../data/services.json';

export default function AdminServices() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(servicesData.map((s) => s.category))];

  const filteredServices = servicesData.filter(
    (s) => selectedCategory === 'All' || s.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-montserrat uppercase font-bold text-gold tracking-widest block">
            Studio Portfolio Catalog
          </span>
          <h1 className="text-3xl font-serif font-bold text-cream">
            Services & Package Tier Manager
          </h1>
        </div>

        <span className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-gold text-xs font-montserrat font-bold self-start sm:self-auto">
          Total Services: {servicesData.length}
        </span>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-montserrat font-bold transition-all duration-200 shrink-0 border ${isActive
                ? 'bg-gold/20 text-gold border-gold/40 shadow-gold-glow-shadow'
                : 'bg-[#0A0A0A] text-cream/70 border-white/10 hover:text-cream'
                }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredServices.map((srv) => (
          <div
            key={srv.id}
            className="bg-[#0A0A0A] p-6 rounded-3xl border border-white/10 hover:border-gold/30 transition-all duration-300 space-y-5 shadow-2xl relative overflow-hidden flex flex-col justify-between"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="px-3 py-1 rounded-full bg-rust/20 text-rust text-[10px] font-montserrat uppercase font-bold border border-rust/30">
                  {srv.category} Collection
                </span>
                <h3 className="text-2xl font-serif font-bold text-cream mt-2">
                  {srv.title}
                </h3>
                <p className="text-xs font-serif italic text-gold mt-1">
                  "{srv.tagline}"
                </p>
              </div>
              <span className="text-sm font-montserrat font-bold text-gold shrink-0">
                {srv.priceStarting}
              </span>
            </div>

            <p className="text-xs text-cream/70 font-sans leading-relaxed">
              {srv.description}
            </p>

            {/* Package Tiers List */}
            <div className="space-y-2 pt-3 border-t border-white/10">
              <span className="text-[10px] font-montserrat uppercase font-bold text-gold tracking-widest block">
                Configured Tier Offerings:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {srv.tiers?.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-[#121212] border border-white/10 text-xs font-sans space-y-1"
                  >
                    <span className="font-montserrat font-bold text-cream block truncate">{t.name}</span>
                    <span className="text-gold font-bold block">{t.price}</span>
                    <span className="text-[10px] text-cream/50 block">{t.coverage}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
