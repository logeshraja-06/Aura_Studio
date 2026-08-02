import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, Camera, Film, Aperture, Heart, Music, Gift, Smile, Award, Globe, Sun, Users, HardDrive, Calendar } from 'lucide-react';
import servicesData from '../data/services.json';

const ICON_MAP = {
  Camera,
  Film,
  Aperture,
  Heart,
  Sparkles,
  Music,
  Gift,
  Smile,
  Award,
  Globe,
  Sun,
};

export default function BuildPackage({ onBookPackage }) {
  const [selectedServiceId, setSelectedServiceId] = useState(servicesData[0].id);
  const selectedService = servicesData.find((s) => s.id === selectedServiceId) || servicesData[0];
  const [selectedTierIndex, setSelectedTierIndex] = useState(0);

  const activeTier = selectedService.tiers[selectedTierIndex] || selectedService.tiers[0];

  return (
    <section id="build-package" className="py-24 bg-cream relative overflow-hidden">
      {/* Background Soft Orbs */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-rust/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-montserrat tracking-[0.25em] text-rust font-semibold flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-gold" />
            Custom Collection Configurator
            <Sparkles className="w-4 h-4 text-gold" />
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-rust">
            Build Your Perfect Package
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-rust to-gold mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-sm sm:text-base text-charcoal-soft font-sans leading-relaxed">
            Configure a bespoke photography & cinema collection tailored to your exact Tamil Nadu event vision, crew requirements, and optics preferences.
          </p>
        </div>

        {/* Step 1: Choose a Service */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs uppercase font-montserrat tracking-widest text-rust font-bold flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-rust text-cream flex items-center justify-center text-[10px]">1</span>
              Step 1 — Choose Your Event Service
            </h3>
            <span className="text-xs text-charcoal/60 font-sans hidden sm:block">
              Select any card to configure its custom options
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {servicesData.map((srv) => {
              const isSelected = srv.id === selectedServiceId;
              const Icon = ICON_MAP[srv.icon] || Camera;
              return (
                <motion.button
                  key={srv.id}
                  whileHover={{ y: -6, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedServiceId(srv.id);
                    setSelectedTierIndex(0);
                  }}
                  className={`relative text-left rounded-3xl p-6 transition-all duration-300 overflow-hidden flex flex-col justify-between h-48 border shadow-luxury ${
                    isSelected
                      ? 'bg-charcoal text-cream border-2 border-gold shadow-gold-glow scale-[1.02] z-10'
                      : 'bg-white text-charcoal border-rust/15 hover:border-rust/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      isSelected ? 'bg-rust text-gold border border-gold/40' : 'bg-rust/10 text-rust'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <span className={`text-[10px] uppercase font-montserrat font-bold tracking-wider px-3 py-1 rounded-full ${
                      isSelected ? 'bg-gold/20 text-gold border border-gold/30' : 'bg-cream text-rust border border-rust/15'
                    }`}>
                      {srv.category}
                    </span>
                  </div>

                  <div>
                    <h4 className={`text-xl font-serif font-bold ${isSelected ? 'text-cream' : 'text-rust'}`}>
                      {srv.title}
                    </h4>
                    <p className={`text-xs font-serif italic mt-0.5 ${isSelected ? 'text-gold-glow' : 'text-clay'}`}>
                      Starting at {srv.priceStarting}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Step 2 & 3 Dynamic Configuration Split Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedService.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Left: Dynamic Service Tier Options & Equipment */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rust/15 shadow-luxury">
                <div className="flex items-center justify-between border-b border-rust/10 pb-4 mb-6">
                  <div>
                    <span className="text-[10px] uppercase font-montserrat tracking-widest text-rust font-bold">
                      Step 2 • Custom Tiers & Gear
                    </span>
                    <h4 className="text-2xl font-serif font-bold text-rust">
                      {selectedService.title} Collection Options
                    </h4>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-rust/10 text-rust text-xs font-montserrat font-bold">
                    Price Range: {selectedService.estimatedCost}
                  </span>
                </div>

                {/* Selectable Tier Pills */}
                <div className="mb-6">
                  <label className="block text-xs font-montserrat font-semibold text-rust uppercase tracking-wider mb-3">
                    Select Collection Tier
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {selectedService.tiers.map((t, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedTierIndex(idx)}
                        className={`p-3.5 rounded-xl border text-left text-xs font-montserrat font-medium transition-all ${
                          selectedTierIndex === idx
                            ? 'bg-rust text-cream border-gold shadow-sm font-semibold'
                            : 'bg-cream-soft text-charcoal border-rust/15 hover:border-rust/30'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="truncate">{t.name}</span>
                          {selectedTierIndex === idx && <Check className="w-3.5 h-3.5 text-gold shrink-0" />}
                        </div>
                        <span className={`text-[11px] block font-bold ${
                          selectedTierIndex === idx ? 'text-gold' : 'text-rust'
                        }`}>
                          {t.price}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Team & Equipment Specifications */}
                <div className="space-y-4 pt-4 border-t border-rust/10 text-xs font-sans">
                  <div className="flex items-start gap-3 bg-cream-soft p-4 rounded-2xl border border-rust/10">
                    <Users className="w-5 h-5 text-rust shrink-0 mt-0.5" />
                    <div>
                      <span className="font-montserrat font-bold text-rust block">Dedicated Production Crew</span>
                      <span className="text-charcoal-soft">{selectedService.teamSize}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-cream-soft p-4 rounded-2xl border border-rust/10">
                    <HardDrive className="w-5 h-5 text-rust shrink-0 mt-0.5" />
                    <div>
                      <span className="font-montserrat font-bold text-rust block">Cinema Optics & Equipment</span>
                      <ul className="mt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-charcoal/80">
                        {selectedService.equipment.map((eq, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                            <span>{eq}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Step 3 Summary Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-5 bg-charcoal text-cream p-6 sm:p-8 rounded-3xl border-2 border-gold shadow-2xl space-y-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[100px] pointer-events-none" />

              <div>
                <span className="text-[10px] uppercase font-montserrat tracking-[0.2em] text-gold font-bold flex items-center gap-1 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-gold" />
                  Step 3 • Selected Package Summary
                </span>
                <h4 className="text-3xl font-serif font-bold text-cream">
                  {selectedService.title}
                </h4>
                <p className="text-xs font-serif italic text-gold-glow mt-1">
                  Tier: {activeTier.name}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-charcoal-light border border-rust/30 space-y-3 text-xs font-sans">
                <div className="flex justify-between border-b border-rust/20 pb-2">
                  <span className="text-cream/70">Coverage Duration:</span>
                  <span className="font-semibold text-gold">{activeTier.coverage}</span>
                </div>
                <div className="flex justify-between border-b border-rust/20 pb-2">
                  <span className="text-cream/70">Tier Collection Rate:</span>
                  <span className="font-semibold text-gold">{activeTier.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cream/70">Service Cost Range:</span>
                  <span className="font-semibold text-gold-glow">{selectedService.estimatedCost}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs font-sans text-cream/80">
                <span className="font-montserrat font-bold text-gold uppercase tracking-wider block">
                  Deliverables Summary:
                </span>
                <p className="leading-relaxed text-cream/70">
                  {activeTier.deliverables}
                </p>
              </div>

              <div className="pt-4 border-t border-rust/20">
                <button
                  onClick={() => onBookPackage(`${selectedService.title} - ${activeTier.name}`)}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-rust via-clay to-rust text-cream font-montserrat text-xs font-bold uppercase tracking-widest shadow-rust-glow-shadow hover:shadow-gold-glow hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 border border-gold/40"
                >
                  <Calendar className="w-4 h-4 text-gold" />
                  <span>Book This Package</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
