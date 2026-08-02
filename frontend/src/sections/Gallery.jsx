import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Eye, Heart, MapPin } from 'lucide-react';
import galleryData from '../data/gallery.json';
import LightboxModal from '../components/LightboxModal';

const CATEGORIES = ['All', 'Wedding', 'Pre Wedding', 'Drone', 'Reception', 'Outdoor'];

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
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                key={item.id}
                onClick={() => setActiveLightboxItem(item)}
                className="group relative cursor-pointer rounded-3xl overflow-hidden shadow-luxury border border-rust/15 bg-white break-inside-avoid"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Dark Vignette Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                  <div className="flex items-center justify-between">
                    <span className="bg-gold/90 text-charcoal text-[10px] uppercase font-montserrat font-bold tracking-wider px-3 py-1 rounded-full shadow-md">
                      {item.category}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-cream/20 text-cream backdrop-blur-md border border-cream/30 flex items-center justify-center">
                      <Eye className="w-5 h-5" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-serif font-bold text-cream">
                      {item.title}
                    </h3>
                    <p className="text-xs font-serif italic text-gold-glow mt-0.5">
                      {item.couple}
                    </p>

                    <div className="mt-3 flex items-center justify-between pt-3 border-t border-cream/20 text-xs text-cream/80">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gold" />
                        <span className="truncate max-w-[150px]">{item.location}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gold">
                        <Heart className="w-3.5 h-3.5 fill-gold" />
                        <span>{item.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
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
