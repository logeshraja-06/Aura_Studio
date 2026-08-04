import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Award, Clock, MapPin, Film, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import filmsData from '../data/films.js';
import VideoModal from '../components/VideoModal';

// Premium Magnetic Floating Play Button
function MagneticPlayButton({ onClick, size = 'large', label = 'Play Wedding Film' }) {
  const btnRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * 0.35;
    const y = (e.clientY - (rect.top + rect.height / 2)) * 0.35;

    gsap.to(btnRef.current, {
      x,
      y,
      scale: 1.12,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (!btnRef.current) return;
    gsap.to(btnRef.current, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: 'elastic.out(1.2, 0.4)',
    });
  };

  const handleClick = (e) => {
    if (btnRef.current) {
      gsap.fromTo(
        btnRef.current,
        { scale: 0.88 },
        { scale: 1.12, duration: 0.3, ease: 'back.out(2)' }
      );
    }
    if (onClick) onClick(e);
  };

  const isLarge = size === 'large';

  return (
    <div className="relative group/magnetic flex items-center justify-center">
      {/* Soft Pulse & Halo Aura */}
      <div className={`absolute inset-0 rounded-full bg-gold/30 animate-ping opacity-40 pointer-events-none ${isLarge ? 'p-6' : 'p-3'}`} />
      <div className={`absolute -inset-1.5 rounded-full bg-gradient-to-r from-gold via-rust to-gold-glow opacity-70 blur-md group-hover/magnetic:opacity-100 transition-opacity duration-500`} />

      <button
        ref={btnRef}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`relative z-10 rounded-full bg-charcoal/60 backdrop-blur-xl border-2 border-gold/80 text-gold flex items-center justify-center shadow-gold-glow transition-all duration-300 hover:bg-rust hover:text-cream cursor-pointer ${
          isLarge ? 'w-20 h-20 sm:w-24 sm:h-24' : 'w-14 h-14 sm:w-16 sm:h-16'
        }`}
        aria-label={label}
      >
        <Play className={`${isLarge ? 'w-8 h-8 sm:w-10 sm:h-10 ml-1' : 'w-6 h-6 sm:w-7 sm:h-7 ml-0.5'} fill-current transition-transform duration-300 group-hover/magnetic:scale-110`} />
      </button>
    </div>
  );
}

export default function Films({ onBook }) {
  const [activeFilm, setActiveFilm] = useState(null);

  // Safely grab films data
  const films = Array.isArray(filmsData) ? filmsData : [];
  const featuredFilm = films[0];
  const remainingFilms = films.slice(1);

  return (
    <section id="films" className="py-24 bg-charcoal text-cream relative overflow-hidden">
      {/* Background Ambient Shader Glow */}
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-rust/20 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-xs uppercase font-montserrat tracking-[0.25em] text-gold font-semibold flex items-center justify-center gap-2 mb-3">
            <Film className="w-4 h-4 text-gold" />
            Cloudinary 4K Cinema Streaming
            <Film className="w-4 h-4 text-gold" />
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-cream">
            Wedding Films Showcase
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-rust via-gold to-gold-glow mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-sm sm:text-base text-cream/70 font-sans leading-relaxed">
            Hollywood-grade anamorphic optics, custom orchestral scores, and master color grading delivered instantly via Cloudinary CDN streaming.
          </p>
        </motion.div>

        {/* Featured Spotlight Banner */}
        {featuredFilm && (
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16 rounded-3xl overflow-hidden border border-rust/30 hover:border-gold/60 shadow-2xl relative bg-charcoal-light group transition-colors duration-500"
          >
            <div className="relative aspect-video sm:aspect-[21/9] w-full overflow-hidden">
              {/* Cloudinary Poster Image */}
              <img
                src={featuredFilm.poster}
                alt={featuredFilm.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />

              {/* Centered Floating Magnetic Play Button */}
              <div className="absolute inset-0 m-auto flex items-center justify-center z-20">
                <MagneticPlayButton
                  onClick={() => setActiveFilm(featuredFilm)}
                  size="large"
                  label={`Play ${featuredFilm.title}`}
                />
              </div>

              {/* Top Badge */}
              <div className="absolute top-6 left-6 z-10 flex items-center gap-2">
                <span className="px-4 py-1.5 rounded-full bg-rust/90 backdrop-blur-md text-cream text-xs font-montserrat font-bold uppercase tracking-wider border border-gold/40 flex items-center gap-1.5 shadow-gold-glow">
                  <Award className="w-4 h-4 text-gold" />
                  {featuredFilm.badge || 'Featured Cinema'}
                </span>
              </div>

              {/* Bottom Details Overlay */}
              <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 text-xs font-montserrat text-gold-glow tracking-widest uppercase mb-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rust" />
                      {featuredFilm.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-rust" />
                      {featuredFilm.duration}
                    </span>
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-serif font-bold text-cream">
                    {featuredFilm.title}
                  </h3>
                  <p className="text-sm font-serif italic text-gold mt-0.5">
                    Starring: {featuredFilm.couple}
                  </p>
                </div>

                <button
                  onClick={() => setActiveFilm(featuredFilm)}
                  className="px-6 py-3 rounded-full bg-rust hover:bg-rust-dark text-cream text-xs font-montserrat font-semibold uppercase tracking-wider transition-all border border-gold/30 flex items-center gap-2 w-fit hover:scale-105 active:scale-95 shadow-rust-glow"
                >
                  <Play className="w-4 h-4 fill-current text-gold" />
                  <span>Stream Full Film</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Dynamic Film Cards Grid mapped automatically from films.js */}
        {remainingFilms.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {remainingFilms.map((film, index) => (
              <motion.div
                key={film.id || index}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -8 }}
                className="group bg-charcoal-light rounded-3xl overflow-hidden border border-rust/20 shadow-lg hover:border-gold/60 hover:shadow-gold-glow transition-all duration-500 flex flex-col justify-between"
              >
                <div
                  className="relative aspect-video overflow-hidden cursor-pointer"
                  onClick={() => setActiveFilm(film)}
                >
                  <img
                    src={film.poster}
                    alt={film.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-charcoal/40 group-hover:bg-charcoal/20 transition-colors flex items-center justify-center">
                    <MagneticPlayButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveFilm(film);
                      }}
                      size="small"
                      label={`Play ${film.title}`}
                    />
                  </div>

                  <span className="absolute bottom-3 right-3 bg-charcoal/80 text-cream text-[10px] font-montserrat px-2.5 py-1 rounded-full border border-rust/20 flex items-center gap-1 backdrop-blur-md">
                    <Clock className="w-3 h-3 text-gold" />
                    {film.duration}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-montserrat tracking-widest text-gold block mb-1">
                      {film.location}
                    </span>
                    <h4 className="text-xl font-serif font-bold text-cream group-hover:text-gold transition-colors">
                      {film.title}
                    </h4>
                    <p className="text-xs font-serif italic text-cream/60 mt-0.5">
                      {film.couple}
                    </p>
                    {film.synopsis && (
                      <p className="text-xs text-cream/70 font-sans mt-3 line-clamp-2 leading-relaxed">
                        {film.synopsis}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => setActiveFilm(film)}
                    className="mt-6 w-full py-2.5 rounded-xl bg-rust/10 hover:bg-rust text-gold hover:text-cream text-xs font-montserrat font-semibold uppercase tracking-wider transition-all duration-300 border border-rust/30 flex items-center justify-center gap-2 hover:shadow-rust-glow"
                  >
                    <Play className="w-3.5 h-3.5 fill-current text-gold group-hover:text-cream transition-colors" />
                    <span>Watch Stream</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
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
