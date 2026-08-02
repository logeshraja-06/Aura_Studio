import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Camera, Sparkles, ChevronRight } from 'lucide-react';
import { useScrollProgress } from '../hooks/useScrollProgress';

export default function Navbar({ onOpenBooking }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isScrolled, activeSection } = useScrollProgress();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled || location.pathname !== '/'
            ? 'py-3.5 bg-white/85 backdrop-blur-xl border-b border-rust/10 shadow-luxury'
            : 'py-5 bg-white/40 backdrop-blur-md border-b border-rust/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Studio Brand Monogram Logo */}
          <button
            onClick={() => navigate('/')}
            className="group flex items-center gap-3 focus:outline-none"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rust via-clay to-gold flex items-center justify-center shadow-rust-glow-shadow group-hover:scale-105 transition-transform duration-300">
              <Camera className="w-5 h-5 text-cream" />
            </div>
            <div className="text-left">
              <span className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-rust group-hover:text-gold transition-colors duration-300">
                AURA
              </span>
              <span className="block text-[9px] uppercase font-montserrat tracking-[0.25em] text-clay font-semibold -mt-1">
                Cinematic Studio
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navItems.map((item) => {
              const isActive = item.isRoute
                ? location.pathname === item.href
                : location.pathname === '/' && activeSection === item.sectionId;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(item, e)}
                  className={`relative text-xs uppercase font-montserrat font-medium tracking-wider transition-colors duration-300 py-1 ${
                    isActive
                      ? 'text-rust font-bold'
                      : 'text-charcoal/80 hover:text-rust'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-rust to-gold rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Desktop "Book Now" CTA Button */}
          <div className="hidden lg:flex items-center">
            <button
              onClick={handleBookNowClick}
              className="relative group px-6 py-2.5 rounded-full overflow-hidden bg-gradient-to-r from-rust via-clay to-rust text-cream text-xs font-montserrat font-semibold tracking-wider uppercase shadow-rust-glow-shadow hover:shadow-gold-glow transition-all duration-300 border border-gold/30 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-gold group-hover:rotate-12 transition-transform" />
                <span>Book Now</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-gold via-rust to-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-full text-rust hover:bg-rust/10 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Glass Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-[65px] left-0 right-0 z-40 bg-white/95 backdrop-blur-2xl border-b border-rust/15 shadow-2xl overflow-hidden lg:hidden"
          >
            <div className="max-w-7xl mx-auto px-6 py-6 space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(item, e)}
                  className="flex items-center justify-between py-2 text-sm font-montserrat font-semibold text-charcoal hover:text-rust border-b border-rust/10"
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-gold" />
                </a>
              ))}

              <div className="pt-2">
                <button
                  onClick={handleBookNowClick}
                  className="w-full py-3 rounded-full bg-rust text-cream font-montserrat text-xs font-bold uppercase tracking-wider shadow-rust-glow-shadow flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span>Book Now</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
