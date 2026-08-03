import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useVelocity, useTransform, useSpring } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Camera, Sparkles, ChevronRight, ShieldCheck } from 'lucide-react';
import { useScrollProgress } from '../hooks/useScrollProgress';

export default function Navbar({ onOpenBooking }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isScrolled, activeSection } = useScrollProgress();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice(!window.matchMedia('(pointer: fine)').matches);
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

  const handleNavClick = (item, e) => {
    if (item.isRoute) {
      if (e) e.preventDefault();
      navigate(item.href);
      setMobileMenuOpen(false);
      return;
    }

    if (location.pathname !== '/') {
      if (e) e.preventDefault();
      navigate('/');
      setTimeout(() => {
        const target = document.querySelector(item.href);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }, 250);
      setMobileMenuOpen(false);
      return;
    }

    if (e) e.preventDefault();
    const target = document.querySelector(item.href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const handleBookNowClick = () => {
    navigate('/packages');
    setMobileMenuOpen(false);
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
            ? 'py-5 bg-charcoal/25 backdrop-blur-md border-b border-cream/10'
            : isScrolled || location.pathname !== '/'
            ? 'py-3.5 bg-white/85 backdrop-blur-xl border-b border-rust/10 shadow-luxury'
            : 'py-5 bg-white/80 backdrop-blur-md border-b border-rust/10'
        }`}
      >
        {/* Luxury Bottom Accent Gradient Line */}
        <div className={`absolute bottom-0 left-0 right-0 h-[1px] transition-colors duration-500 pointer-events-none ${
          isDarkHero
            ? 'bg-gradient-to-r from-transparent via-gold/40 via-cream/60 via-gold/40 to-transparent'
            : 'bg-gradient-to-r from-transparent via-rust/30 via-gold/50 via-rust/30 to-transparent'
        }`} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Studio Brand Logo */}
          <motion.button
            variants={navItemVariants}
            onClick={() => navigate('/')}
            className="group flex items-center gap-3 focus:outline-none"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
                className="absolute -inset-1 rounded-full border border-dashed border-gold/50 opacity-60 pointer-events-none"
              />
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rust via-clay to-gold flex items-center justify-center shadow-rust-glow-shadow group-hover:scale-105 transition-transform duration-300 ease-out">
                <Camera className="w-5 h-5 text-cream group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300 ease-out" />
              </div>
            </div>
            <div className="text-left">
              <span className={`text-xl sm:text-2xl font-serif font-bold tracking-tight transition-colors duration-300 ease-out ${
                isDarkHero ? 'text-cream group-hover:text-gold' : 'text-rust group-hover:text-gold'
              }`}>
                AURA
              </span>
              <span className={`block text-[9px] uppercase font-montserrat tracking-[0.25em] font-semibold -mt-1 transition-colors duration-300 ease-out ${
                isDarkHero ? 'text-gold group-hover:text-cream' : 'text-clay group-hover:text-rust'
              }`}>
                Cinematic Studio
              </span>
            </div>
          </motion.button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
            {navItems.map((item) => {
              const isActive = item.isRoute
                ? location.pathname === item.href
                : location.pathname === '/' && activeSection === item.sectionId;

              const navTextColor = isDarkHero
                ? isActive ? 'text-gold font-bold' : 'text-cream/90 group-hover:text-gold'
                : isActive ? 'text-rust font-bold' : 'text-charcoal/80 group-hover:text-rust';

              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(item, e)}
                  className="group relative px-3.5 py-1.5 text-xs uppercase font-montserrat font-medium tracking-wider transition-colors duration-300 ease-out"
                >
                  <span className="absolute inset-0 rounded-full bg-gold/15 scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 ease-out pointer-events-none" />

                  <motion.span
                    whileHover={{ y: -2 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`relative z-10 inline-block transition-colors duration-300 ${navTextColor}`}
                  >
                    {item.label}
                  </motion.span>
                  
                  {/* Underline Center-Drawing Animation */}
                  {!isActive && (
                    <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-[75%] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-center ${
                      isDarkHero
                        ? 'bg-gradient-to-r from-gold via-cream to-gold'
                        : 'bg-gradient-to-r from-rust via-gold to-rust'
                    }`} />
                  )}

                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className={`absolute inset-0 rounded-full border shadow-sm ${
                        isDarkHero
                          ? 'bg-gradient-to-r from-gold/20 via-cream/25 to-gold/20 border-gold/50'
                          : 'bg-gradient-to-r from-rust/15 via-gold/20 to-rust/15 border-gold/40'
                      }`}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Desktop Actions: Admin Button + Book Now CTA */}
          <motion.div variants={navItemVariants} className="hidden lg:flex items-center gap-3">
            {/* Styled Admin Portal Access Button */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              onClick={() => navigate('/admin')}
              className={`px-3.5 py-2 rounded-full border transition-all duration-300 flex items-center gap-1.5 text-xs font-montserrat font-bold uppercase tracking-wider ${
                isDarkHero
                  ? 'bg-gold/15 text-gold border-gold/40 hover:bg-gold/25'
                  : 'bg-charcoal text-gold border-gold/40 hover:bg-black shadow-luxury'
              }`}
              title="Admin Control Room"
            >
              <ShieldCheck className="w-4 h-4 text-gold" />
              <span>Admin</span>
            </motion.button>

            {/* Desktop "Book Now" CTA Button with Animated Gold Shimmer Sweep */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              onClick={handleBookNowClick}
              className={`relative group px-6 py-2.5 rounded-full overflow-hidden bg-gradient-to-r from-rust via-gold via-clay to-rust bg-[length:200%_auto] hover:bg-right transition-all duration-500 text-cream text-xs font-montserrat font-bold tracking-wider uppercase shadow-rust-glow-shadow hover:shadow-gold-glow border border-gold/40 ${
                isDarkHero ? 'ring-1 ring-cream/30' : ''
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-gold group-hover:rotate-12 transition-transform duration-300" />
                <span>Book Now</span>
              </span>

              {/* Gold Shimmer Sweep Highlight */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
            </motion.button>
          </motion.div>

          {/* Mobile Menu Hamburger Toggle */}
          <motion.button
            variants={navItemVariants}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 rounded-full transition-colors ${
              isDarkHero ? 'text-cream hover:bg-cream/10' : 'text-rust hover:bg-rust/10'
            }`}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>
      </motion.header>

      {/* Refined Mobile Menu Drawer with Smooth Staggered Slide & Scale */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.98 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
            className="fixed top-[65px] left-0 right-0 z-40 bg-white/95 backdrop-blur-2xl border-b border-rust/15 shadow-2xl overflow-hidden lg:hidden"
          >
            <div className="max-w-7xl mx-auto px-6 py-6 space-y-4">
              {navItems.map((item, idx) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={(e) => handleNavClick(item, e)}
                  className="flex items-center justify-between py-2 text-sm font-montserrat font-semibold text-charcoal hover:text-rust border-b border-rust/10"
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-gold" />
                </motion.a>
              ))}

              <div className="pt-2 space-y-3">
                <button
                  onClick={handleBookNowClick}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-rust via-gold to-rust text-cream font-montserrat text-xs font-bold uppercase tracking-wider shadow-rust-glow-shadow flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span>Book Now</span>
                </button>

                {/* Mobile Drawer Admin Portal Button */}
                <button
                  onClick={() => {
                    navigate('/admin');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-4 rounded-full bg-charcoal border border-gold/40 text-gold font-montserrat text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-luxury"
                >
                  <ShieldCheck className="w-4 h-4 text-gold" />
                  <span>Admin Control Portal</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
