import React from 'react';
import { Sparkles } from 'lucide-react';
import ServiceFanCards from '../components/ServiceFanCards';

export default function Services() {
  return (
    <section id="services" className="py-24 bg-cream relative overflow-visible w-full">
      {/* Background Soft Radial Orbs clipped safely */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-rust/5 rounded-full blur-[140px]" />
      </div>

      {/* Section Header */}
      <div className="max-w-3xl mx-auto px-4 text-center mb-8 relative z-10">
        <span className="text-xs uppercase font-montserrat tracking-[0.25em] text-rust font-semibold flex items-center justify-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-gold" />
          Curated Indian & Luxury Event Offerings
          <Sparkles className="w-4 h-4 text-gold" />
        </span>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-rust">
          Bespoke Services & Functions
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-rust to-gold mx-auto mt-4 rounded-full" />
        <p className="mt-4 text-sm sm:text-base text-charcoal-soft font-sans leading-relaxed">
          From regal Haldi & Mehendi rituals to grand Muhurtham, Sangeet galas, and destination weddings, explore 15 specialized photography & film disciplines.
        </p>
      </div>

      {/* 3D Fan Carousel Animation Component — Full Bleed Width */}
      <div className="w-full relative z-10 overflow-visible">
        <ServiceFanCards />
      </div>
    </section>
  );
}


