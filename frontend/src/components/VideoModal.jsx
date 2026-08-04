import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Film, MapPin, Clock, Award, AlertCircle } from 'lucide-react';

export default function VideoModal({ film, onClose, onBook }) {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Prevent background body scrolling when modal is active & clean up playback on exit
  useEffect(() => {
    if (!film) return;

    setIsLoading(true);
    setHasError(false);

    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalStyle;
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    };
  }, [film]);

  // Autoplay attempt when film opens or updates
  useEffect(() => {
    if (!film || !videoRef.current) return;
    const playPromise = videoRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsLoading(false);
        })
        .catch(() => {
          // Autoplay blocked by browser policy; user can click standard controls to play
          setIsLoading(false);
        });
    }
  }, [film]);

  // Keyboard accessibility (ESC key to close, Space to toggle play, F for fullscreen)
  useEffect(() => {
    if (!film) return;

    const handleKeyDown = (e) => {
      // Don't intercept if user is typing in form inputs
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      if (e.key === 'Escape') {
        handleClose();
      } else if (e.code === 'Space' && videoRef.current) {
        e.preventDefault();
        if (videoRef.current.paused) {
          videoRef.current.play().catch(() => {});
        } else {
          videoRef.current.pause();
        }
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        toggleFullScreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [film, onClose]);

  const toggleFullScreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    } else {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen().catch(() => {});
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      }
    }
  };

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    onClose();
  };

  if (!film) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 md:p-8"
        onClick={handleClose}
      >
        {/* Soft Ambient Shader Lighting Background */}
        <div className="absolute w-[650px] h-[650px] bg-rust/20 rounded-full blur-[220px] pointer-events-none" />
        <div className="absolute w-[500px] h-[500px] bg-gold/15 rounded-full blur-[200px] pointer-events-none" />

        {/* Floating Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-charcoal-light/80 text-cream border border-gold/50 flex items-center justify-center hover:bg-rust hover:text-gold transition-all duration-300 shadow-gold-glow hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
          aria-label="Close video modal player"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-5xl w-full bg-charcoal/95 border border-rust/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col backdrop-blur-2xl"
        >
          {/* Video Player Container */}
          <div
            className="relative w-full aspect-video bg-black overflow-hidden group/video flex items-center justify-center"
            onDoubleClick={toggleFullScreen}
          >
            {/* Cloudinary Stream Loading Spinner */}
            <AnimatePresence>
              {isLoading && !hasError && (
                <motion.div
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 z-20 bg-charcoal-dark/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-4"
                >
                  <div className="relative flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border-2 border-gold/20 border-t-gold animate-spin" />
                    <Film className="w-6 h-6 text-gold absolute" />
                  </div>
                  <span className="text-xs font-montserrat tracking-[0.2em] uppercase text-gold/90 animate-pulse">
                    Streaming 4K Cinema from Cloudinary...
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Overlay */}
            {hasError && (
              <div className="absolute inset-0 z-20 bg-charcoal-dark flex flex-col items-center justify-center gap-3 p-6 text-center">
                <AlertCircle className="w-12 h-12 text-rust" />
                <h4 className="text-lg font-serif text-cream font-bold">Unable to Stream Video</h4>
                <p className="text-xs text-cream/70 max-w-md">
                  Please verify your Cloudinary video URL or connection.
                </p>
              </div>
            )}

            {/* HTML5 Video Element with Cloudinary CDN Stream */}
            <video
              ref={videoRef}
              src={film.videoUrl}
              poster={film.poster}
              controls
              autoPlay
              playsInline
              preload="metadata"
              onCanPlay={() => setIsLoading(false)}
              onPlaying={() => setIsLoading(false)}
              onWaiting={() => setIsLoading(true)}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
              className="w-full h-full object-cover"
            >
              Your browser does not support HTML5 video streaming.
            </video>
          </div>

          {/* Film Metadata Details Footer */}
          <div className="p-5 sm:p-6 md:p-8 bg-gradient-to-b from-charcoal via-charcoal/95 to-charcoal-light flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-t border-rust/30">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-montserrat font-semibold uppercase tracking-wider border border-gold/30 flex items-center gap-1.5 shadow-gold-glow">
                  <Award className="w-3.5 h-3.5" />
                  {film.badge || 'Cloudinary Stream'}
                </span>
                {film.duration && (
                  <span className="text-xs font-montserrat text-cream/60 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-rust" />
                    {film.duration}
                  </span>
                )}
                {film.location && (
                  <span className="text-xs font-montserrat text-cream/60 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rust" />
                    {film.location}
                  </span>
                )}
              </div>

              <h2 className="text-2xl md:text-3xl font-serif text-cream font-bold">
                {film.title}
              </h2>
              {film.couple && (
                <p className="text-sm font-serif italic text-gold-glow mt-1">
                  Starring: {film.couple} {film.year ? `(${film.year})` : ''}
                </p>
              )}
              {film.synopsis && (
                <p className="text-xs text-cream/80 font-sans mt-3 max-w-2xl leading-relaxed">
                  {film.synopsis}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button
                onClick={() => {
                  handleClose();
                  if (onBook) onBook();
                }}
                className="px-6 py-3.5 rounded-xl bg-rust text-cream text-xs font-montserrat font-semibold uppercase tracking-wider shadow-rust-glow hover:bg-rust-dark transition-all duration-300 border border-gold/30 whitespace-nowrap hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
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
