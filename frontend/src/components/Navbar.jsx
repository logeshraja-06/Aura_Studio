import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useVelocity, useTransform, useSpring } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Camera, Sparkles, ChevronRight, ShieldCheck } from 'lucide-react';
import { useScrollProgress } from '../hooks/useScrollProgress';
import GooeyNav from './GooeyNav';

export default function Navbar({ onOpenBooking }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isScrolled, activeSection } = useScrollProgress();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice(!window.matchMedia('(pointer: fine)').matches);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Track scroll velocity for silk-smooth 3D perspective tilt
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  // Map velocity to subtle 3D tilt (rotateX around 6–8deg) and translateZ (-8px)
  const rawRotateX = useTransform(scrollVelocity, [-2500, 0, 2500], [7, 0, 7]);
  const rawTranslateZ = useTransform(scrollVelocity, [-2500, -10, 0, 10, 2500], [-8, 0, 0, 0, -8]);

  // Refined spring configuration (lower stiffness & smooth damping for zero jitter)
  const springConfig = { stiffness: 180, damping: 24, mass: 0.5 };
  const springRotateX = useSpring(rawRotateX, springConfig);
  const springTranslateZ = useSpring(rawTranslateZ, springConfig);

  // Public Nav Items
  const navItems = [
    { label: 'Home', href: '#hero', sectionId: 'hero' },
    { label: 'Services', href: '#services', sectionId: 'services' },
    { label: 'Gallery', href: '#gallery', sectionId: 'gallery' },
    { label: 'Packages', href: '/packages', isRoute: true },
    { label: 'Testimonials', href: '#testimonials', sectionId: 'testimonials' },
    { label: 'Contact', href: '#contact', sectionId: 'contact' },
  ];

  // Compute controlled active Index for GooeyNav & Mobile Menu driven by route + scroll progress
  const computedActiveIndex = useMemo(() => {
    if (location.pathname === '/packages') return 3;
    if (location.pathname !== '/') return 0;

    switch (activeSection) {
      case 'hero':
        return 0;
      case 'services':
        return 1;
      case 'gallery':
        return 2;
      case 'testimonials':
        return 4;
      case 'contact':
        return 5;
      default:
        return 0;
    }
  }, [location.pathname, activeSection]);

  const handleNavClick = (item, e) => {
    setMobileMenuOpen(false);
    if (item.isRoute) {
      if (e) e.preventDefault();
      navigate(item.href);
      return;
    }

    if (location.pathname !== '/') {
      if (e) e.preventDefault();
      navigate('/');
      setTimeout(() => {
        const target = document.querySelector(item.href);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }, 250);
      return;
    }

    if (e) e.preventDefault();
    const target = document.querySelector(item.href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookNowClick = () => {
    setMobileMenuOpen(false);
    navigate('/packages');
  };

  // Staggered Entrance Variants
  const navContainerVariants = {
    hidden: { y: -60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: [0.25, 1, 0.5, 1],
        staggerChildren: 0.08,
      },
    },
  };

  const navItemVariants = {
    hidden: { y: -15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  const isDarkHero = !isScrolled && location.pathname === '/';

  const toggleMobileMenu = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <>
      <motion.header
        variants={navContainerVariants}
        initial="hidden"
        animate="visible"
        style={
          isTouchDevice
            ? {}
            : {
                rotateX: springRotateX,
                translateZ: springTranslateZ,
                transformPerspective: 1200,
                transformOrigin: 'top center',
              }
        }
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          isDarkHero
            ? 'py-4 sm:py-5 bg-charcoal/30 backdrop-blur-md border-b border-cream/10'
            : isScrolled || location.pathname !== '/'
            ? 'py-3 sm:py-3.5 bg-white/90 backdrop-blur-xl border-b border-rust/10 shadow-luxury'
            : 'py-4 sm:py-5 bg-white/80 backdrop-blur-md border-b border-rust/10'
        }`}
      >
        {/* Luxury Bottom Accent Gradient Line */}
        <div className={`absolute bottom-0 left-0 right-0 h-[1px] transition-colors duration-500 pointer-events-none ${
          isDarkHero
            ? 'bg-gradient-to-r from-transparent via-gold/40 via-cream/60 via-gold/40 to-transparent'
            : 'bg-gradient-to-r from-transparent via-rust/30 via-gold/50 via-rust/30 to-transparent'
        }`} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Studio Editorial Aperture Logo Monogram */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              navigate('/');
            }}
            className="group flex items-center gap-2.5 sm:gap-3 focus:outline-none cursor-pointer"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
                className="absolute -inset-1 sm:-inset-1.5 rounded-full border border-dashed border-gold/60 opacity-70 pointer-events-none"
              />
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-rust via-clay to-gold p-[1px] shadow-rust-glow-shadow group-hover:scale-105 transition-transform duration-300 ease-out">
                <div className="w-full h-full bg-[#181512] rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <svg className="absolute inset-0 w-full h-full opacity-35" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="14" stroke="#C9A227" strokeWidth="1" fill="none" strokeDasharray="3 2" />
                    <line x1="20" y1="6" x2="20" y2="34" stroke="#C9A227" strokeWidth="0.8" />
                    <line x1="6" y1="20" x2="34" y2="20" stroke="#C9A227" strokeWidth="0.8" />
                    <line x1="10" y1="10" x2="30" y2="30" stroke="#C9A227" strokeWidth="0.8" />
                    <line x1="10" y1="30" x2="30" y2="10" stroke="#C9A227" strokeWidth="0.8" />
                  </svg>
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-gold group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300 ease-out relative z-10" />
                </div>
              </div>
            </div>

            <div className="text-left">
              <span className="text-lg sm:text-2xl font-serif font-extrabold tracking-widest block bg-gradient-to-r from-rust via-gold to-rust bg-clip-text text-transparent group-hover:from-gold group-hover:to-gold transition-all duration-300">
                AURA
              </span>
              <div className="h-[1px] w-full bg-gradient-to-r from-gold/60 via-rust/40 to-transparent -mt-0.5 mb-0.5" />
              <span className={`block text-[7.5px] sm:text-[8.5px] uppercase font-montserrat tracking-[0.25em] font-bold transition-colors duration-300 ${
                isDarkHero ? 'text-gold-glow' : 'text-clay group-hover:text-rust'
              }`}>
                Cinematic Studio
              </span>
            </div>
          </button>

          {/* Desktop GooeyNav Navigation Component */}
          <div className="hidden lg:block">
            <GooeyNav
              items={navItems}
              activeIndex={computedActiveIndex}
              onItemClick={(item, idx, e) => handleNavClick(item, e)}
              isDarkHero={isDarkHero}
            />
          </div>

          {/* Desktop Actions */}
          <motion.div variants={navItemVariants} className="hidden lg:flex items-center gap-3">
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              onClick={() => navigate('/admin')}
              className={`px-3.5 py-2 rounded-full border transition-all duration-300 flex items-center gap-1.5 text-xs font-montserrat font-bold uppercase tracking-wider cursor-pointer ${
                isDarkHero
                  ? 'bg-gold/15 text-gold border-gold/40 hover:bg-gold/25'
                  : 'bg-cream/90 text-rust border-gold/40 hover:bg-gold/15 hover:border-gold hover:text-gold shadow-luxury'
              }`}
              title="Admin Control Room"
            >
              <ShieldCheck className="w-4 h-4 text-gold" />
              <span>Admin</span>
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              onClick={handleBookNowClick}
              className={`relative group px-6 py-2.5 rounded-full overflow-hidden bg-gradient-to-r from-rust via-gold via-clay to-rust bg-[length:200%_auto] hover:bg-right transition-all duration-500 text-cream text-xs font-montserrat font-bold tracking-wider uppercase shadow-rust-glow-shadow hover:shadow-gold-glow border border-gold/40 cursor-pointer ${
                isDarkHero ? 'ring-1 ring-cream/30' : ''
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-gold group-hover:rotate-12 transition-transform duration-300" />
                <span>Book Now</span>
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
            </motion.button>
          </motion.div>

          {/* Mobile Menu Hamburger Toggle Button (44px min touch target) */}
          <button
            type="button"
            onClick={toggleMobileMenu}
            onTouchEnd={(e) => {
              e.preventDefault();
              toggleMobileMenu(e);
            }}
            className={`lg:hidden w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 cursor-pointer z-50 ${
              isDarkHero
                ? 'text-cream bg-white/10 hover:bg-white/20 border border-white/20'
                : 'text-rust bg-rust/10 hover:bg-rust/20 border border-rust/20'
            }`}
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-gold" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.header>

      {/* Refined Mobile Menu Backdrop & Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Dark Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-md z-40 lg:hidden"
            />

            {/* Mobile Navigation Drawer */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-16 left-3 right-3 max-h-[85vh] overflow-y-auto bg-[#181512]/95 border border-gold/30 rounded-3xl shadow-2xl z-50 p-6 backdrop-blur-2xl lg:hidden text-cream"
            >
              <div className="flex items-center justify-between pb-4 mb-2 border-b border-gold/20">
                <span className="text-xs font-montserrat uppercase font-bold tracking-[0.2em] text-gold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-gold" />
                  Navigation Menu
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-gold/15 text-gold flex items-center justify-center hover:bg-gold/30 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1 py-2">
                {navItems.map((item, idx) => {
                  const isActive = computedActiveIndex === idx;
                  return (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={(e) => handleNavClick(item, e)}
                      className={`flex items-center justify-between px-4 py-3 rounded-2xl min-h-[44px] text-sm font-montserrat font-semibold transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-rust to-gold/90 text-cream shadow-rust-glow'
                          : 'text-cream/90 hover:text-gold hover:bg-white/5'
                      }`}
                    >
                      <span className="tracking-wide">{item.label}</span>
                      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-cream' : 'text-gold/60'}`} />
                    </motion.a>
                  );
                })}
              </div>

              <div className="pt-4 mt-2 border-t border-gold/20 space-y-3">
                <button
                  type="button"
                  onClick={handleBookNowClick}
                  className="w-full min-h-[44px] py-3.5 rounded-2xl bg-gradient-to-r from-rust via-gold to-rust text-charcoal font-montserrat text-xs font-bold uppercase tracking-widest shadow-rust-glow-shadow flex items-center justify-center gap-2 border border-gold/50 cursor-pointer active:scale-98"
                >
                  <Sparkles className="w-4 h-4 text-charcoal" />
                  <span>Book Now</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/admin');
                  }}
                  className="w-full min-h-[44px] py-3 px-4 rounded-2xl bg-black/60 border border-gold/40 text-gold font-montserrat text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-gold/10 transition-colors cursor-pointer active:scale-98"
                >
                  <ShieldCheck className="w-4 h-4 text-gold" />
                  <span>Admin Control Portal</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
