import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Camera, Film, Aperture, Heart, Music, Gift, Smile, Award, Globe, Sun } from 'lucide-react';
import servicesData from '../data/services.json';
import Navbar from '../components/Navbar';
import Footer from '../sections/Footer';
import CustomCursor from '../components/CustomCursor';

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

// Interactive 3D Perspective Tilt Card with Translucent Watermark & Light Glass Styling
function TiltWatermarkCard({ srv, idx, onClick }) {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const Icon = ICON_MAP[srv.icon] || Camera;
  const isFeatured = idx === 0 || srv.id === 'muhurtham' || srv.id === 'destination-wedding';

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Max 10 degree 3D tilt
    const rotX = -((y - centerY) / centerY) * 10;
    const rotY = ((x - centerX) / centerX) * 10;

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
          isHovered ? 'scale3d(1.03, 1.03, 1.03) translateY(-8px)' : 'scale3d(1, 1, 1)'
        }`,
      }}
      className={`group cursor-pointer rounded-3xl p-6 transition-all duration-300 overflow-hidden flex flex-col justify-between h-72 relative backdrop-blur-xl border ${
        isFeatured
          ? 'bg-white/95 text-charcoal border-2 border-gold/70 shadow-gold-glow'
          : 'bg-white/90 text-charcoal border-rust/15 hover:border-rust/40 shadow-luxury'
      }`}
    >
      {/* Dynamic Gold Glare Reflection following tilt */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-25 rounded-3xl"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(201, 162, 39, 0.4), transparent 70%)`,
          }}
        />
      )}

      {/* 15–20% Translucent Photo Watermark Backdrop */}
      <div className="absolute inset-0 opacity-[0.18] group-hover:opacity-[0.28] transition-opacity duration-500 pointer-events-none overflow-hidden">
        <img
          src={srv.image}
          alt={srv.title}
          className="w-full h-full object-cover grayscale mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/50 to-transparent" />
      </div>

      {/* Featured Ribbon / Gold Tag */}
      {isFeatured && (
        <div className="absolute top-0 right-6 bg-gradient-to-r from-rust to-gold text-cream text-[9px] font-montserrat uppercase font-bold tracking-wider px-3 py-1 rounded-b-lg shadow-md z-20">
          ★ Featured Collection
        </div>
      )}

      {/* Card Header: Icon & Category Tag */}
      <div className="relative z-10 flex items-center justify-between">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm ${
          isFeatured ? 'bg-rust text-gold border-gold/40' : 'bg-rust/10 text-rust border-rust/20'
        }`}>
          <Icon className="w-6 h-6" />
        </div>

        <span className="text-[10px] uppercase font-montserrat font-bold tracking-wider px-3 py-1 rounded-full bg-cream-soft text-rust border border-rust/15">
          {srv.category}
        </span>
      </div>

      {/* Card Text Content */}
      <div className="relative z-10 my-auto">
        <h3 className="text-xl font-serif font-bold text-rust group-hover:text-gold transition-colors duration-300">
          {srv.title}
        </h3>
        <p className="text-xs font-serif italic text-clay mt-0.5">
          "{srv.tagline}"
        </p>
        <span className="text-xs font-montserrat font-bold block mt-3 text-rust">
          Starting at {srv.priceStarting}
        </span>
      </div>

      {/* Footer CTA Line */}
      <div className="relative z-10 pt-3 border-t border-rust/15 flex items-center justify-between">
        <span className="text-[10px] font-montserrat font-semibold uppercase tracking-wider text-rust group-hover:text-gold transition-colors">
          Configure Tiers & Book
        </span>
        <div className="w-7 h-7 rounded-full bg-rust/10 text-rust flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-rust group-hover:text-gold">
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </motion.div>
  );
}

export default function PackagesPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-cream text-charcoal selection:bg-gold selection:text-white">
      <CustomCursor />
      <Navbar onOpenBooking={() => navigate('/packages')} />

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

      {/* Step 1: Responsive Grid of 16 Light 3D Tilt Watermark Cards */}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
