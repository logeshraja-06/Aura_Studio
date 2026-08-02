import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Sparkles, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import testimonialsData from '../data/testimonials.json';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : testimonialsData.length - 1));
  };

  const next = () => {
    setCurrentIndex((prev) => (prev < testimonialsData.length - 1 ? prev + 1 : 0));
  };

  const current = testimonialsData[currentIndex];

  return (
    <section id="testimonials" className="py-24 bg-charcoal text-cream relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-gold/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-montserrat tracking-[0.25em] text-gold font-semibold flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-gold" />
            Client Love Stories
            <Sparkles className="w-4 h-4 text-gold" />
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-cream">
            Words From Our Couples
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-rust via-gold to-gold-glow mx-auto mt-4 rounded-full" />
        </div>

        {/* Featured Testimonial Card */}
        <div className="relative bg-charcoal-light border border-rust/30 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden">
          <Quote className="absolute top-8 right-8 w-24 h-24 text-rust/15 pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-2 border-gold shadow-gold-glow shrink-0">
              <img
                src={current.image}
                alt={current.couple}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              {/* Rating Stars */}
              <div className="flex items-center justify-center md:justify-start gap-1 mb-4 text-gold">
                {[...Array(current.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-gold" />
                ))}
              </div>

              <blockquote className="text-xl sm:text-2xl md:text-3xl font-serif italic text-cream leading-relaxed">
                "{current.quote}"
              </blockquote>

              <div className="mt-6 pt-4 border-t border-rust/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xl font-serif font-bold text-gold">
                    {current.couple}
                  </h4>
                  <span className="text-xs font-montserrat text-cream/60 block">
                    {current.weddingType}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-cream/70 font-sans">
                  <MapPin className="w-3.5 h-3.5 text-rust" />
                  <span>{current.location} • {current.date}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full bg-rust/20 text-cream border border-gold/40 flex items-center justify-center hover:bg-rust hover:text-gold transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-montserrat text-gold tracking-widest font-semibold">
              0{currentIndex + 1} / 0{testimonialsData.length}
            </span>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full bg-rust/20 text-cream border border-gold/40 flex items-center justify-center hover:bg-rust hover:text-gold transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
