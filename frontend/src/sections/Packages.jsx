import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Star, Calendar, Shield, HelpCircle } from 'lucide-react';
import packagesData from '../data/packages.json';

export default function Packages({ onSelectPackage }) {
  return (
    <section id="packages" className="py-24 bg-cream relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-montserrat tracking-[0.25em] text-rust font-semibold flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-gold" />
            Transparent Luxury Pricing
            <Sparkles className="w-4 h-4 text-gold" />
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-rust">
            Wedding Collection Packages
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-rust to-gold mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-sm sm:text-base text-charcoal-soft font-sans leading-relaxed">
            All collections include master editing, high-resolution digital rights, private client cloud galleries, and handcrafted Italian albums.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {packagesData.map((pkg, idx) => {
            const isFeatured = pkg.popular;
            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-500 ${
                  isFeatured
                    ? 'bg-charcoal text-cream shadow-2xl border-2 border-gold transform lg:-translate-y-4 shadow-gold-glow'
                    : 'bg-white text-charcoal shadow-luxury border border-rust/15 hover:border-rust/40'
                }`}
              >
                {/* Popular Ribbon Badge */}
                {isFeatured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gold via-gold-glow to-gold text-charcoal font-montserrat font-bold text-xs uppercase tracking-widest px-6 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-charcoal" />
                    <span>{pkg.badge}</span>
                  </div>
                )}

                <div>
                  {!isFeatured && (
                    <span className="text-[10px] uppercase font-montserrat tracking-widest text-rust font-semibold block mb-2">
                      {pkg.badge}
                    </span>
                  )}
                  <h3 className={`text-3xl font-serif font-bold ${isFeatured ? 'text-cream' : 'text-rust'}`}>
                    {pkg.name}
                  </h3>
                  <p className={`text-xs font-serif italic mt-1 ${isFeatured ? 'text-gold-glow' : 'text-clay'}`}>
                    {pkg.tagline}
                  </p>

                  {/* Pricing Header */}
                  <div className="mt-6 pb-6 border-b border-rust/15 flex items-baseline gap-2">
                    <span className={`text-4xl md:text-5xl font-serif font-bold ${isFeatured ? 'text-gold' : 'text-rust'}`}>
                      {pkg.price}
                    </span>
                    <span className={`text-xs font-montserrat ${isFeatured ? 'text-cream/60' : 'text-charcoal/60'}`}>
                      / {pkg.period}
                    </span>
                  </div>

                  <p className={`text-xs font-sans mt-4 leading-relaxed ${isFeatured ? 'text-cream/80' : 'text-charcoal/80'}`}>
                    {pkg.description}
                  </p>

                  {/* Included Features List */}
                  <div className="mt-6 space-y-3">
                    <span className={`text-[11px] font-montserrat font-bold uppercase tracking-wider block ${isFeatured ? 'text-gold' : 'text-rust'}`}>
                      What's Included:
                    </span>
                    {pkg.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs font-sans">
                        <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isFeatured ? 'text-gold' : 'text-rust'}`} />
                        <span className={isFeatured ? 'text-cream/90' : 'text-charcoal-soft'}>
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div className="mt-8 pt-6 border-t border-rust/15">
                  <button
                    onClick={() => onSelectPackage(pkg.name)}
                    className={`w-full py-4 rounded-2xl font-montserrat text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
                      isFeatured
                        ? 'bg-gradient-to-r from-rust to-clay text-cream shadow-rust-glow hover:shadow-gold-glow border border-gold/40'
                        : 'bg-rust/10 hover:bg-rust text-rust hover:text-cream border border-rust/20'
                    }`}
                  >
                    <Calendar className="w-4 h-4 text-gold" />
                    <span>{pkg.cta}</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
