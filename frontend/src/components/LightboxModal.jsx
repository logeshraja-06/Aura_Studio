import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Heart, MapPin, Sparkles, Calendar } from 'lucide-react';

export default function LightboxModal({ item, items, onClose, onNavigate, onBook }) {
  if (!item) return null;

  const currentIndex = items.findIndex((i) => i.id === item.id);
  const prevItem = items[currentIndex > 0 ? currentIndex - 1 : items.length - 1];
  const nextItem = items[currentIndex < items.length - 1 ? currentIndex + 1 : 0];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-charcoal/90 backdrop-blur-2xl flex items-center justify-center p-4 md:p-8"
        onClick={onClose}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 w-12 h-12 rounded-full bg-rust/20 text-cream border border-gold/40 flex items-center justify-center hover:bg-rust hover:text-gold transition-colors duration-300 shadow-gold-glow"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Previous Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(prevItem);
          }}
          className="absolute left-4 md:left-8 z-20 w-12 h-12 rounded-full bg-rust/20 text-cream border border-gold/40 flex items-center justify-center hover:bg-rust hover:text-gold transition-colors duration-300 shadow-lg"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Next Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(nextItem);
          }}
          className="absolute right-4 md:right-8 z-20 w-12 h-12 rounded-full bg-rust/20 text-cream border border-gold/40 flex items-center justify-center hover:bg-rust hover:text-gold transition-colors duration-300 shadow-lg"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Content Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-5xl w-full max-h-[88vh] bg-charcoal-light border border-rust/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
        >
          {/* Main Image View */}
          <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[350px] md:min-h-[500px]">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-contain max-h-[75vh]"
            />
            <div className="absolute bottom-4 left-4 bg-charcoal/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-gold/30 text-gold text-xs font-montserrat flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{item.category} Category</span>
            </div>
          </div>

          {/* Details Sidebar */}
          <div className="w-full md:w-80 p-6 md:p-8 flex flex-col justify-between bg-charcoal text-cream border-t md:border-t-0 md:border-l border-rust/20">
            <div>
              <span className="text-xs uppercase font-montserrat tracking-[0.2em] text-gold block mb-2 font-semibold">
                Featured Portfolio
              </span>
              <h3 className="text-2xl md:text-3xl font-serif text-cream font-bold leading-tight">
                {item.title}
              </h3>
              <p className="text-sm font-serif italic text-gold-glow mt-1">
                Couple: {item.couple}
              </p>

              <div className="mt-6 flex items-center gap-2 text-xs text-cream/70 font-sans">
                <MapPin className="w-4 h-4 text-rust" />
                <span>{item.location}</span>
              </div>

              <div className="mt-4 flex items-center gap-3 pt-4 border-t border-rust/15 text-xs text-cream/80">
                <div className="flex items-center gap-1 text-gold">
                  <Heart className="w-4 h-4 fill-gold" />
                  <span className="font-semibold">{item.likes} Appreciation Likes</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={() => {
                  onClose();
                  onBook();
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rust to-clay text-cream text-xs font-montserrat font-semibold uppercase tracking-wider shadow-rust-glow-shadow hover:shadow-gold-glow transition-all duration-300 flex items-center justify-center gap-2 border border-gold/40"
              >
                <Calendar className="w-4 h-4 text-gold" />
                <span>Book Similar Shoot</span>
              </button>
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-charcoal-light text-cream/70 text-xs font-montserrat font-medium uppercase tracking-wider border border-rust/20 hover:text-cream transition-colors"
              >
                Back to Gallery
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
