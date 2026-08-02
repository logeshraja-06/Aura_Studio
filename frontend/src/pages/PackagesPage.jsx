import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Film, Aperture, Heart, HeartHandshake, Gem, Flame, Sun, Music, Sparkles, Baby, Flower2, Gift, Award, Globe, Landmark, ArrowRight } from 'lucide-react';
import servicesData from '../data/services.json';
import Footer from '../sections/Footer';
import GlowCard from '../components/GlowCard';

const ICON_MAP = {
  Camera,
  Film,
  Aperture,
  Heart,
  HeartHandshake,
  Gem,
  Flame,
  Sun,
  Music,
  Sparkles,
  Baby,
  Flower2,
  Gift,
  Award,
  Globe,
  Landmark,
};


const CATEGORY_ACCENT = {
  Signature: {
    icon: 'bg-gold text-charcoal border-gold/60 shadow-md',
    badge: 'bg-gold/15 text-rust font-bold border-gold/30',
    ring: 'group-hover/card:border-gold/70',
    glow: 'gold',
  },
  Video: {
    icon: 'bg-rust text-cream border-rust/60 shadow-md',
    badge: 'bg-rust/15 text-rust font-bold border-rust/30',
    ring: 'group-hover/card:border-rust/60',
    glow: 'rust',
  },
  Aerial: {
    icon: 'bg-clay text-cream border-clay/60 shadow-md',
    badge: 'bg-clay/15 text-clay font-bold border-clay/30',
    ring: 'group-hover/card:border-clay/60',
    glow: 'rust',
  },
  Editorial: {
    icon: 'bg-rust/90 text-cream border-rust/50 shadow-md',
    badge: 'bg-rust/15 text-rust font-bold border-rust/30',
    ring: 'group-hover/card:border-rust/60',
    glow: 'rust',
  },
  Traditional: {
    icon: 'bg-gold text-charcoal border-gold/60 shadow-md',
    badge: 'bg-gold/15 text-rust font-bold border-gold/30',
    ring: 'group-hover/card:border-gold/70',
    glow: 'gold',
  },
  Corporate: {
    icon: 'bg-rust text-cream border-rust/60 shadow-md',
    badge: 'bg-rust/15 text-rust font-bold border-rust/30',
    ring: 'group-hover/card:border-rust/60',
    glow: 'rust',
  },
  Events: {
    icon: 'bg-gold text-charcoal border-gold/60 shadow-md',
    badge: 'bg-gold/15 text-rust font-bold border-gold/30',
    ring: 'group-hover/card:border-gold/70',
    glow: 'gold',
  },
  Lifestyle: {
    icon: 'bg-clay text-cream border-clay/60 shadow-md',
    badge: 'bg-clay/15 text-clay font-bold border-clay/30',
    ring: 'group-hover/card:border-clay/60',
    glow: 'rust',
  },
};

// Interactive 3D Perspective Tilt Card wrapped in GlowCard Spotlight with Vivid Watermark & Per-Category Accents
function TiltWatermarkCard({ srv, idx, onClick }) {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const Icon = ICON_MAP[srv.icon] || Camera;
  const isFeatured = idx === 0 || srv.id === 'muhurtham' || srv.id === 'destination-wedding';
  const accent = CATEGORY_ACCENT[srv.category] || CATEGORY_ACCENT.Signature;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Enhanced 18 degree 3D perspective tilt
    const rotX = -((y - centerY) / centerY) * 18;
    const rotY = ((x - centerX) / centerX) * 18;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  return (
    <GlowCard
      glowColor={isFeatured ? 'gold' : accent.glow}
      className="rounded-3xl h-full"
    >
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: idx * 0.04 }}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          transformStyle: 'preserve-3d',
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${
            isHovered
              ? 'scale3d(1.04, 1.04, 1.04) translateY(-10px) translateZ(20px)'
              : 'scale3d(1, 1, 1) translateY(0px) translateZ(0px)'
          }`,
        }}
        className={`group/card cursor-pointer rounded-3xl p-6 transition-all duration-300 overflow-hidden flex flex-col justify-between h-72 relative backdrop-blur-xl border will-change-transform ${
          isFeatured
            ? 'bg-white/95 text-charcoal border-2 border-gold/70 shadow-gold-glow'
            : `bg-white/90 text-charcoal border-rust/15 shadow-luxury ${accent.ring}`
        }`}
      >
        {/* Dynamic Gold Glare Reflection following tilt */}
        {isHovered && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-35 rounded-3xl"
            style={{
              background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(201, 162, 39, 0.45), transparent 65%)`,
            }}
          />
        )}

        {/* Background Image Backdrop — Clearly Visible at Idle, Fully Vivid & Colorful on Hover */}
        <div className="absolute inset-0 opacity-40 group-hover/card:opacity-90 transition-opacity duration-500 pointer-events-none overflow-hidden">
          <img
            src={srv.image}
            alt={srv.title}
            className="w-full h-full object-cover grayscale-[60%] group-hover/card:grayscale-0 transition-all duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/65 group-hover/card:via-cream/25 to-cream/10 group-hover/card:to-transparent transition-all duration-500" />
        </div>



        {/* Featured Ribbon / Gold Tag */}
        {isFeatured && (
          <div className="absolute top-0 right-6 bg-gradient-to-r from-rust to-gold text-cream text-[9px] font-montserrat uppercase font-bold tracking-wider px-3 py-1 rounded-b-lg shadow-md z-20">
            ★ Featured Collection
          </div>
        )}

        {/* Card Header Layer (Icon & Tag) — translateZ(35px) */}
        <div
          className="relative z-10 flex items-center justify-between transition-transform duration-300"
          style={{ transform: isHovered ? 'translateZ(35px)' : 'translateZ(0px)', transformStyle: 'preserve-3d' }}
        >
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center border group-hover/card:scale-110 group-hover/card:rotate-6 transition-all duration-300 ${accent.icon}`}
          >
            <Icon className="w-6 h-6" />
          </div>

          <span className={`text-[10px] uppercase font-montserrat tracking-wider px-3 py-1 rounded-full border ${accent.badge}`}>
            {srv.category}
          </span>
        </div>

        {/* Card Text Content Layer — translateZ(25px) */}
        <div
          className="relative z-10 my-auto transition-transform duration-300"
          style={{ transform: isHovered ? 'translateZ(25px)' : 'translateZ(0px)', transformStyle: 'preserve-3d' }}
        >
          <h3 className="text-xl font-serif font-bold text-rust group-hover/card:text-gold transition-colors duration-300">
            {srv.title}
          </h3>
          <p className="text-xs font-serif italic text-clay mt-0.5">
            "{srv.tagline}"
          </p>
          <span className="text-xs font-montserrat font-bold block mt-3 text-rust group-hover/card:scale-105 group-hover/card:text-gold transition-all duration-300 origin-left">
            Starting at {srv.priceStarting}
          </span>
        </div>

        {/* Footer CTA Line Layer — translateZ(15px) */}
        <div
          className="relative z-10 pt-3 border-t border-rust/15 flex items-center justify-between transition-transform duration-300"
          style={{ transform: isHovered ? 'translateZ(15px)' : 'translateZ(0px)', transformStyle: 'preserve-3d' }}
        >
          <span className="text-[10px] font-montserrat font-semibold uppercase tracking-wider text-rust group-hover/card:text-gold transition-colors">
            Configure Tiers & Book
          </span>
          <div className="w-7 h-7 rounded-full bg-rust/10 text-rust flex items-center justify-center transition-all duration-300 group-hover/card:bg-rust group-hover/card:text-gold">
            <motion.div
              animate={isHovered ? { x: [0, 4, 0] } : { x: 0 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </GlowCard>
  );
}


export default function PackagesPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-cream text-charcoal selection:bg-gold selection:text-white">
      {/* Hero Header */}
      <section className="relative pt-36 pb-20 bg-charcoal text-cream overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rust/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 text-center">
          <span className="text-xs uppercase font-montserrat tracking-[0.25em] text-gold font-bold flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-gold" />
            Tailored Photography & Cinema Collections
            <Sparkles className="w-4 h-4 text-gold" />
          </span>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-cream">
            Build Your Perfect Package
          </h1>

          <div className="w-24 h-1 bg-gradient-to-r from-rust via-gold to-rust mx-auto mt-4 rounded-full" />

          <p className="mt-6 text-sm sm:text-base text-cream/80 font-sans max-w-2xl mx-auto leading-relaxed">
            Configure a bespoke luxury photography & film collection tailored to your exact Tamil Nadu event vision, ritual timings, and crew specifications.
          </p>
        </div>
      </section>

      {/* Step 1: Responsive Grid of 16 Light 3D Tilt Watermark Cards with 1500px Perspective */}
      <section className="py-20 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-xs uppercase font-montserrat font-bold text-rust tracking-wider block">
              Step 1 — Choose Your Event Service
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-rust mt-1">
              Select an Event to Configure Tiers & Booking
            </h2>
          </div>

          <span className="text-xs text-charcoal/60 font-sans hidden sm:block">
            Click any card to open its dedicated booking page
          </span>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          style={{ perspective: '1500px' }}
        >
          {servicesData.map((srv, idx) => (
            <TiltWatermarkCard
              key={srv.id}
              srv={srv}
              idx={idx}
              onClick={() => navigate(`/booking/${srv.id}`)}
            />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

