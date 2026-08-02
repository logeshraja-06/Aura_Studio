import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Play, Calendar } from 'lucide-react';
import HeroCanvas from '../components/HeroCanvas';
import HeroVideo from '../components/HeroVideo';

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ onOpenBooking, onOpenFilms }) {
  const navigate = useNavigate();
  const headlineRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);

  const videoWrapperRef = useRef(null);
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Lightweight mouse parallax for video background
  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 12; // max ±6px
    const y = (e.clientY / window.innerHeight - 0.5) * 12;
    setMouseOffset({ x, y });
  };

  // GSAP Entrance Stagger & ScrollTrigger Scrubbing Effects
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Text Entrance Reveal
      gsap.fromTo(
        [headlineRef.current, subtitleRef.current, ctaRef.current],
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.2,
          ease: 'power3.out',
          delay: 0.3,
        }
      );

      // 2. ScrollTrigger Ken Burns Video Scale
      gsap.to(videoWrapperRef.current, {
        scale: 1.03,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // 3. ScrollTrigger Overlay Darken
      gsap.to(overlayRef.current, {
        opacity: 0.85,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // 4. ScrollTrigger Content Drift & Fade
      gsap.to(contentRef.current, {
        y: -80,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: '60% top',
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      onMouseMove={handleMouseMove}
      className="relative h-screen min-h-[650px] flex items-center justify-center overflow-hidden text-cream pt-28 pb-16 selection:bg-gold selection:text-white"
    >
      {/* 1. Fullscreen Video Background Layer with Parallax Translate */}
      <div
        ref={videoWrapperRef}
        style={{
          transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0px)`,
          willChange: 'transform',
        }}
        className="absolute inset-0 z-0 transition-transform duration-300 ease-out"
      >
        <HeroVideo />
      </div>

      {/* 2. Cinematic Dark Gradient Overlay (40-50% opacity for text readability) */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-gradient-to-b from-charcoal/50 via-charcoal/35 to-charcoal/55 z-10 pointer-events-none"
      />

      {/* 3. Subtle Warm Vignette Overlay at Edges */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-charcoal/40 z-10 pointer-events-none" />

      {/* 4. Subtle Gold Dust Particle Canvas Layer (opacity 40 with mix-blend-screen on top of video) */}
      <div className="absolute inset-0 z-20 opacity-40 mix-blend-screen pointer-events-none">
        <HeroCanvas />
      </div>

      {/* 5. Main Hero Text & CTA Content Layer */}
      <div
        ref={contentRef}
        className="max-w-5xl mx-auto px-6 sm:px-8 relative z-30 text-center flex flex-col items-center"
      >
        {/* Luxury Tagline Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-charcoal/60 border border-gold/40 shadow-lg backdrop-blur-md mb-6"
        >
          <Sparkles className="w-4 h-4 text-gold" />
          <span className="text-xs font-montserrat uppercase tracking-[0.25em] text-gold font-semibold">
            Award-Winning Luxury Cinema
          </span>
        </motion.div>

        {/* Editorial Headline */}
        <h1
          ref={headlineRef}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-cream tracking-tight leading-[1.1] drop-shadow-md"
        >
          Every Love Story Deserves a{' '}
          <span className="bg-gradient-to-r from-cream via-gold-glow to-gold bg-clip-text text-transparent italic">
            Masterpiece
          </span>
        </h1>

        {/* Editorial Subtitle */}
        <p
          ref={subtitleRef}
          className="mt-6 text-base sm:text-lg md:text-xl font-sans text-cream/90 max-w-2xl leading-relaxed font-normal drop-shadow-sm"
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
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/15 text-cream font-montserrat text-xs font-semibold uppercase tracking-widest hover:bg-white hover:text-charcoal hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 border border-gold/40 backdrop-blur-md shadow-md group"
          >
            <div className="w-6 h-6 rounded-full bg-rust/30 flex items-center justify-center text-gold group-hover:bg-rust group-hover:text-gold transition-colors">
              <Play className="w-3 h-3 fill-current ml-0.5" />
            </div>
            <span>Watch Wedding Films</span>
          </button>
        </div>
      </div>
    </section>
  );
}

