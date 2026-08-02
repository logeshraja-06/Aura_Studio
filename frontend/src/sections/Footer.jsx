import React from 'react';
import { Camera, ArrowUp, Sparkles, Heart } from 'lucide-react';
import { InstagramIcon, VimeoIcon, FacebookIcon } from '../components/SocialIcons';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-charcoal text-cream pt-20 pb-10 border-t border-rust/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-rust/20">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rust text-cream flex items-center justify-center border border-gold/40 shadow-gold-glow">
                <Camera className="w-5 h-5 text-gold" />
              </div>
              <div>
                <span className="text-2xl font-serif font-bold tracking-widest text-cream block leading-none">
                  A U R A
                </span>
                <span className="text-[9px] uppercase font-montserrat tracking-[0.25em] text-gold font-medium block mt-1">
                  Luxury Wedding Studio
                </span>
              </div>
            </div>

            <p className="text-xs font-sans text-cream/70 leading-relaxed">
              Capturing timeless romance and regal celebrations with cinematic storytelling and fine-art elegance worldwide.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-rust/20 hover:bg-rust text-gold flex items-center justify-center transition-colors border border-gold/20">
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a href="https://vimeo.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-rust/20 hover:bg-rust text-gold flex items-center justify-center transition-colors border border-gold/20">
                <VimeoIcon className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-rust/20 hover:bg-rust text-gold flex items-center justify-center transition-colors border border-gold/20">
                <FacebookIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Nav Links Col 1 */}
          <div>
            <h4 className="text-xs font-montserrat font-bold uppercase tracking-widest text-gold mb-4">
              Explore Studio
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-cream/70">
              <li><a href="#hero" className="hover:text-gold transition-colors">Home Experience</a></li>
              <li><a href="#services" className="hover:text-gold transition-colors">Services & Offerings</a></li>
              <li><a href="#gallery" className="hover:text-gold transition-colors">Featured Gallery</a></li>
              <li><a href="#films" className="hover:text-gold transition-colors">4K Wedding Cinema</a></li>
              <li><a href="#packages" className="hover:text-gold transition-colors">Pricing Collections</a></li>
            </ul>
          </div>

          {/* Nav Links Col 2 */}
          <div>
            <h4 className="text-xs font-montserrat font-bold uppercase tracking-widest text-gold mb-4">
              Behind The Scenes
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-cream/70">
              <li><a href="#why-us" className="hover:text-gold transition-colors">The AURA Advantage</a></li>
              <li><a href="#team" className="hover:text-gold transition-colors">Meet Our Crew</a></li>
              <li><a href="#booking-process" className="hover:text-gold transition-colors">Production Process</a></li>
              <li><a href="#faq" className="hover:text-gold transition-colors">Frequently Asked Questions</a></li>
              <li><a href="#contact" className="hover:text-gold transition-colors">Studio Contact & Map</a></li>
            </ul>
          </div>

          {/* Newsletter / Awards Col */}
          <div className="space-y-4">
            <h4 className="text-xs font-montserrat font-bold uppercase tracking-widest text-gold mb-2">
              Recognized Excellence
            </h4>
            <div className="p-4 rounded-2xl bg-charcoal-light border border-rust/30 text-xs font-sans text-cream/80 space-y-2">
              <div className="flex items-center gap-2 text-gold">
                <Sparkles className="w-4 h-4" />
                <span className="font-semibold font-montserrat">Vogue Wedding Studio of the Year</span>
              </div>
              <p className="text-[11px] text-cream/60">
                Awarded top honors for destination cinematography & fine-art photo albums.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-cream/60">
          <p>© {new Date().getFullYear()} AURA Wedding Studio. All rights reserved.</p>
          <div className="flex items-center gap-1 text-gold-glow">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 fill-rust text-rust inline" />
            <span>for timeless love stories.</span>
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-rust/20 hover:bg-rust text-gold hover:text-cream transition-colors border border-gold/30"
          >
            <span>Back to top</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
