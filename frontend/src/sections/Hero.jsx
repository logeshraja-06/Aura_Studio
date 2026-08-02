import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Sparkles, Play, Calendar } from 'lucide-react';
import HeroCanvas from '../components/HeroCanvas';

export default function Hero({ onOpenBooking, onOpenFilms }) {
  const navigate = useNavigate();
  const headlineRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);

  // GSAP Eased Stagger Reveal Animation for Hero Text & CTAs
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        [headlineRef.current, subtitleRef.current, ctaRef.current],
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.2,
          ease: 'power3.out',
          delay: 0.4,
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      style={{ backgroundColor: '#FDF8F3' }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden text-charcoal pt-28 pb-16 selection:bg-gold selection:text-white"
    >
      {/* 3D WebGL Three.js Particle & Flowing Glass Orbs Scene */}
      <HeroCanvas />

      {/* Soft Warm Radial Ambient Glow Overlays */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-rust/8 rounded-full blur-[180px] pointer-events-none z-10" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[150px] pointer-events-none z-10" />

      {/* Subtle 12% Vignette at Edges for Contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/10 via-transparent to-charcoal/10 pointer-events-none z-10" />

      {/* Content Container */}
      <div className="max-w-5xl mx-auto px-6 sm:px-8 relative z-20 text-center flex flex-col items-center">
        {/* Luxury Tagline Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-rust/20 shadow-sm backdrop-blur-md mb-6"
        >
          <Sparkles className="w-4 h-4 text-gold" />
          <span className="text-xs font-montserrat uppercase tracking-[0.25em] text-rust font-semibold">
            Award-Winning Luxury Cinema
          </span>
        </motion.div>

        {/* Editorial Headline in Warm Rust #A8654A */}
        <h1
          ref={headlineRef}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-rust tracking-tight leading-[1.1]"
        >
          Every Love Story Deserves a{' '}
          <span className="bg-gradient-to-r from-rust via-clay to-gold bg-clip-text text-transparent italic">
            Masterpiece
          </span>
        </h1>

        {/* Editorial Subtitle in Warm Dark Gray #2E2E2E */}
        <p
          ref={subtitleRef}
          className="mt-6 text-base sm:text-lg md:text-xl font-sans text-charcoal/80 max-w-2xl leading-relaxed font-normal"
        >
          Capturing timeless weddings with cinematic storytelling and unforgettable memories.
        </p>

        {/* CTA Button Group */}
        <div
          ref={ctaRef}
          className="mt-10 flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto"
        >
          {/* Primary CTA: Book Your Wedding -> Navigates to /packages */}
          <button
            onClick={() => navigate('/packages')}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-rust via-clay to-rust text-cream font-montserrat text-xs font-bold uppercase tracking-widest shadow-rust-glow-shadow hover:shadow-gold-glow hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 border border-gold/40 group"
          >
            <Calendar className="w-4 h-4 text-gold group-hover:rotate-12 transition-transform" />
            <span>Book Your Wedding</span>
          </button>

          {/* Secondary CTA: Watch Wedding Films */}
          <button
            onClick={onOpenFilms}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/90 text-rust font-montserrat text-xs font-semibold uppercase tracking-widest hover:bg-white hover:text-gold hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 border border-rust/20 shadow-md group"
          >
            <div className="w-6 h-6 rounded-full bg-rust/10 flex items-center justify-center text-rust group-hover:bg-rust group-hover:text-gold transition-colors">
              <Play className="w-3 h-3 fill-current ml-0.5" />
            </div>
            <span>Watch Wedding Films</span>
          </button>
        </div>
      </div>
    </section>
  );
}
