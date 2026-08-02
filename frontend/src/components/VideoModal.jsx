import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Film, MapPin, Clock, Award } from 'lucide-react';

export default function VideoModal({ film, onClose, onBook }) {
  if (!film) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-8"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-30 w-12 h-12 rounded-full bg-rust/30 text-cream border border-gold/40 flex items-center justify-center hover:bg-rust hover:text-gold transition-colors duration-300 shadow-gold-glow"
          aria-label="Close video player"
        >
          <X className="w-6 h-6" />
        </button>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-5xl w-full bg-charcoal border border-rust/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        >
          {/* Video Container */}
          <div className="relative w-full aspect-video bg-black">
            <video
              src={film.videoUrl}
              controls
              autoPlay
              poster={film.poster}
              className="w-full h-full object-cover"
            >
              Your browser does not support HTML5 video playback.
            </video>
          </div>

          {/* Film Metadata */}
          <div className="p-6 md:p-8 bg-gradient-to-b from-charcoal to-charcoal-light flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-t border-rust/20">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-montserrat font-semibold uppercase tracking-wider border border-gold/30 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  {film.badge}
                </span>
                <span className="text-xs font-montserrat text-cream/60 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-rust" />
                  {film.duration}
                </span>
                <span className="text-xs font-montserrat text-cream/60 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rust" />
                  {film.location}
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-serif text-cream font-bold">
                {film.title}
              </h2>
              <p className="text-sm font-serif italic text-gold-glow mt-1">
                Starring: {film.couple} ({film.year})
              </p>
              <p className="text-xs text-cream/80 font-sans mt-3 max-w-2xl leading-relaxed">
                {film.synopsis}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button
                onClick={() => {
                  onClose();
                  onBook();
                }}
                className="px-6 py-3 rounded-xl bg-rust text-cream text-xs font-montserrat font-semibold uppercase tracking-wider shadow-rust-glow hover:bg-rust-dark transition-colors border border-gold/30 whitespace-nowrap"
              >
                Inquire Film Shooting
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
