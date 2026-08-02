import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles, Award, Clock, MapPin, Film } from 'lucide-react';
import filmsData from '../data/films.json';
import VideoModal from '../components/VideoModal';

export default function Films({ onBook }) {
  const [activeFilm, setActiveFilm] = useState(null);
  const featuredFilm = filmsData[0];

  return (
    <section id="films" className="py-24 bg-charcoal text-cream relative overflow-hidden">
      {/* Background Ambient Shader Glow */}
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-rust/20 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-montserrat tracking-[0.25em] text-gold font-semibold flex items-center justify-center gap-2 mb-3">
            <Film className="w-4 h-4 text-gold" />
            4K Ultra-HD Cinema
            <Film className="w-4 h-4 text-gold" />
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-cream">
            Wedding Films Showcase
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-rust via-gold to-gold-glow mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-sm sm:text-base text-cream/70 font-sans leading-relaxed">
            Hollywood-grade anamorphic optics, custom orchestral scores, and master color grading that bring your love story to life on the silver screen.
          </p>
        </div>

        {/* Featured Spotlight Banner */}
        <div className="mb-16 rounded-3xl overflow-hidden border border-rust/30 shadow-2xl relative bg-charcoal-light group">
          <div className="relative aspect-video sm:aspect-[21/9] w-full overflow-hidden">
            <img
              src={featuredFilm.poster}
              alt={featuredFilm.title}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />

            {/* Centered Play Button Pulse */}
            <button
              onClick={() => setActiveFilm(featuredFilm)}
              className="absolute inset-0 m-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-rust/90 border-2 border-gold text-gold flex items-center justify-center shadow-gold-glow group-hover:scale-110 transition-transform duration-300 z-10"
              aria-label="Play featured wedding film"
            >
              <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-gold ml-1" />
            </button>

            {/* Top Badge */}
            <div className="absolute top-6 left-6 z-10 flex items-center gap-2">
              <span className="px-4 py-1.5 rounded-full bg-rust text-cream text-xs font-montserrat font-bold uppercase tracking-wider border border-gold/40 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-gold" />
                Featured Masterpiece
              </span>
            </div>

            {/* Bottom Details Overlay */}
            <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-montserrat text-gold-glow tracking-widest uppercase">
                  {featuredFilm.location} • {featuredFilm.duration}
                </span>
                <h3 className="text-3xl sm:text-4xl font-serif font-bold text-cream mt-1">
                  {featuredFilm.title}
                </h3>
                <p className="text-sm font-serif italic text-gold mt-0.5">
                  Starring: {featuredFilm.couple}
                </p>
              </div>

              <button
                onClick={() => setActiveFilm(featuredFilm)}
                className="px-6 py-3 rounded-full bg-rust hover:bg-rust-dark text-cream text-xs font-montserrat font-semibold uppercase tracking-wider transition-colors border border-gold/30 flex items-center gap-2 w-fit"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Watch Trailer</span>
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Film Cards Carousel / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filmsData.slice(1).map((film) => (
            <motion.div
              key={film.id}
              whileHover={{ y: -8 }}
              className="group bg-charcoal-light rounded-3xl overflow-hidden border border-rust/20 shadow-lg hover:border-gold/50 transition-all duration-300"
            >
              <div className="relative aspect-video overflow-hidden cursor-pointer" onClick={() => setActiveFilm(film)}>
                <img
                  src={film.poster}
                  alt={film.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-charcoal/40 group-hover:bg-charcoal/20 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-rust/80 text-gold border border-gold/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-gold ml-0.5" />
                  </div>
                </div>

                <span className="absolute bottom-3 right-3 bg-charcoal/80 text-cream text-[10px] font-montserrat px-2.5 py-1 rounded-full border border-rust/20 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-gold" />
                  {film.duration}
                </span>
              </div>

              <div className="p-6">
                <span className="text-[10px] uppercase font-montserrat tracking-widest text-gold block mb-1">
                  {film.location}
                </span>
                <h4 className="text-xl font-serif font-bold text-cream group-hover:text-gold transition-colors">
                  {film.title}
                </h4>
                <p className="text-xs font-serif italic text-cream/60 mt-0.5">
                  {film.couple}
                </p>
                <p className="text-xs text-cream/70 font-sans mt-3 line-clamp-2 leading-relaxed">
                  {film.synopsis}
                </p>

                <button
                  onClick={() => setActiveFilm(film)}
                  className="mt-4 w-full py-2.5 rounded-xl bg-rust/10 hover:bg-rust text-gold hover:text-cream text-xs font-montserrat font-semibold uppercase tracking-wider transition-colors border border-rust/30 flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play Film</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Video Modal Player */}
      <VideoModal
        film={activeFilm}
        onClose={() => setActiveFilm(null)}
        onBook={onBook}
      />
    </section>
  );
}
