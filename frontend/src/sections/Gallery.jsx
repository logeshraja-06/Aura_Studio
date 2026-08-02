import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Eye, Heart, MapPin } from 'lucide-react';
import galleryData from '../data/gallery.json';
import LightboxModal from '../components/LightboxModal';

const CATEGORIES = ['All', 'Wedding', 'Pre Wedding', 'Drone', 'Reception', 'Outdoor'];

// Scoped Gallery Tile with Cursor Spotlight, Gold Inset Border & Sequenced Overlay Reveal
function GalleryTile({ item, onClick }) {
  const tileRef = useRef(null);
  const [pos, setPos] = useState({ x: -200, y: -200 });

  useEffect(() => {
    const el = tileRef.current;
    if (!el) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let rafId = null;
    const handlePointerMove = (e) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setPos({ x, y });
        el.style.setProperty('--x', `${x}px`);
        el.style.setProperty('--y', `${y}px`);
      });
    };

    el.addEventListener('pointermove', handlePointerMove);
    return () => {
      el.removeEventListener('pointermove', handlePointerMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <motion.div
      ref={tileRef}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      onClick={onClick}
      style={{
        '--x': `${pos.x}px`,
        '--y': `${pos.y}px`,
      }}
      className="group relative cursor-pointer rounded-3xl overflow-hidden shadow-luxury border border-rust/15 bg-white break-inside-avoid"
    >
      {/* Base Photo Image with Subtle Scale Zoom */}
      <img
        src={item.image}
        alt={item.title}
        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />

      {/* Mouse-Tracking Gold Spotlight Radial Gradient (mix-blend-mode: overlay) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl z-10 mix-blend-overlay"
        style={{
          background: `radial-gradient(240px circle at var(--x, 50%) var(--y, 50%), rgba(201, 162, 39, 0.45), transparent 75%)`,
        }}
      />

      {/* Thin Gold Inset Ring / Border */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl z-10"
        style={{
          boxShadow: `inset 0 0 0 1.5px rgba(201, 162, 39, 0.7), inset 0 0 20px rgba(201, 162, 39, 0.25)`,
        }}
      />

      {/* Sequenced Information Overlay (Dark Scrim) */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6 z-20 pointer-events-none">
        {/* Top Badges (Category & Eye Icon) */}
        <div className="flex items-center justify-between transition-all duration-400 -translate-y-2 group-hover:translate-y-0">
          <span className="bg-gold/95 text-charcoal text-[10px] uppercase font-montserrat font-bold tracking-wider px-3 py-1 rounded-full shadow-md border border-gold/40">
            {item.category}
          </span>
          <div className="w-10 h-10 rounded-full bg-cream/20 text-cream backdrop-blur-md border border-cream/30 flex items-center justify-center transition-transform duration-400 group-hover:scale-105">
            <Eye className="w-5 h-5 text-gold" />
          </div>
        </div>

        {/* Bottom Info Block (Title, Couple, Location, Likes) with Sequenced Upward Slide */}
        <div className="transform transition-transform duration-400 ease-out translate-y-3 group-hover:translate-y-0">
          <h3 className="text-2xl font-serif font-bold text-cream">
            {item.title}
          </h3>
          <p className="text-xs font-serif italic text-gold-glow mt-0.5">
            {item.couple}
          </p>

          <div className="mt-3 flex items-center justify-between pt-3 border-t border-cream/20 text-xs text-cream/80">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gold" />
              <span className="truncate max-w-[150px] font-sans">{item.location}</span>
            </div>
            <div className="flex items-center gap-1 text-gold font-montserrat font-semibold">
              <Heart className="w-3.5 h-3.5 fill-gold text-gold" />
              <span>{item.likes}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Gallery({ onBook }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeLightboxItem, setActiveLightboxItem] = useState(null);

  const filteredItems = activeCategory === 'All'
    ? galleryData
    : galleryData.filter((item) => item.category === activeCategory);

  return (
    <section id="gallery" className="py-24 bg-cream-soft relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase font-montserrat tracking-[0.25em] text-rust font-semibold flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-gold" />
            Visual Portfolio
            <Sparkles className="w-4 h-4 text-gold" />
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-rust">
            Featured Gallery
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-rust to-gold mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-sm sm:text-base text-charcoal-soft font-sans leading-relaxed">
            Explore moments captured in golden light, raw intimacy, and regal splendor across breathtaking destinations.
          </p>
        </div>

        {/* Filter Category Tabs */}
        <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap mb-12">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-5 py-2 rounded-full text-xs font-montserrat font-semibold tracking-wider uppercase transition-all duration-300 ${
                  isActive
                    ? 'bg-rust text-cream shadow-rust-glow-shadow border border-gold/40'
                    : 'bg-white text-charcoal-soft hover:text-rust border border-rust/15'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Pinterest Masonry Grid */}
        <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <GalleryTile
                key={item.id}
                item={item}
                onClick={() => setActiveLightboxItem(item)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        item={activeLightboxItem}
        items={filteredItems}
        onClose={() => setActiveLightboxItem(null)}
        onNavigate={(item) => setActiveLightboxItem(item)}
        onBook={onBook}
      />
    </section>
  );
}

