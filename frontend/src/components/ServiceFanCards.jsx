import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ChevronLeft, ChevronRight, Camera, Film, Aperture, Heart, HeartHandshake, Gem, Flame, Sun, Music, Sparkles, Baby, Flower2, Gift, Award, Globe, Landmark, ArrowRight } from 'lucide-react';
import servicesData from '../data/services.json';

const ICON_MAP = {
  Camera,
  Film,
  Aperture,
  Heart,
  HeartHandshake,
  Gem,
  Flame,
  Sun,
  Music,
  Sparkles,
  Baby,
  Flower2,
  Gift,
  Award,
  Globe,
  Landmark,
};


export default function ServiceFanCards() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [viewportWidth, setViewportWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : servicesData.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < servicesData.length - 1 ? prev + 1 : 0));
  };

  // Compute offset cards array centered around activeIndex (Symmetric range: -4 to +4 for balanced 3D fan)
  const getVisibleCards = () => {
    const total = servicesData.length;
    const cards = [];
    const isMobile = viewportWidth < 640;
    const start = isMobile ? -2 : -4;
    const end = isMobile ? 2 : 4;
    for (let i = start; i <= end; i++) {
      const idx = (activeIndex + i + total) % total;
      cards.push({ ...servicesData[idx], offsetIndex: i });
    }
    return cards;
  };

  const visibleCards = getVisibleCards();


  // GSAP 3D Fan Entrance & Hover Overwrite Animation Loop
  useEffect(() => {
    if (!containerRef.current) return;

    const cardElements = containerRef.current.querySelectorAll('.fan-card-item');

    cardElements.forEach((el) => {
      const cardId = el.getAttribute('data-id');
      const offsetIndex = parseInt(el.getAttribute('data-offset'), 10);
      const isHovered = hoveredCardId === cardId;

      // Responsive 3D fan layout spread based on viewport width
      const isMobile = viewportWidth < 640;
      const isTablet = viewportWidth < 1024;
      const spreadUnit = isMobile ? viewportWidth * 0.08 : isTablet ? viewportWidth * 0.075 : viewportWidth * 0.082;

      let rotationAngle = offsetIndex * (isMobile ? 5 : 6);
      let translateX = offsetIndex * spreadUnit;
      let translateY = Math.abs(offsetIndex) * (isMobile ? 6 : 11);
      let scale = 1 - Math.abs(offsetIndex) * 0.035;
      let zIndex = 40 - Math.abs(offsetIndex) * 3;

      // Hover Focus Logic: Prominent Main Card Focus
      if (isHovered) {
        rotationAngle = 0; // Straighten upright
        translateY -= 24; // Lift up noticeably
        scale = 1.15; // Scale up to main focus
        zIndex = 50; // Jump to highest zIndex in front
      } else if (hoveredCardId) {
        // Push neighbor cards further outward smoothly
        const hoveredCard = visibleCards.find((c) => c.id === hoveredCardId);
        if (hoveredCard) {
          const distance = offsetIndex - hoveredCard.offsetIndex;
          if (distance !== 0) {
            translateX += distance > 0 ? 24 : -24;
            scale -= 0.02;
          }
        }
      }

      // Execute smooth GSAP GPU animation with elastic/power easing & overwrite protection
      gsap.to(el, {
        x: translateX,
        y: translateY,
        rotation: rotationAngle,
        scale: scale,
        zIndex: zIndex,
        duration: isHovered ? 0.45 : 0.6,
        ease: isHovered ? 'power3.out' : 'elastic.out(1, 0.75)',
        force3D: true,
        overwrite: 'auto',
      });
    });
  }, [activeIndex, hoveredCardId, visibleCards, viewportWidth]);


  return (
    <div className="relative w-full py-8 flex flex-col items-center select-none overflow-visible px-2">
      {/* 3D Fanned Semicircle Cards Container (Full Bleed Width, No max-w constraint) */}
      <div
        ref={containerRef}
        className="relative w-full h-[380px] sm:h-[460px] flex items-center justify-center perspective-1000 overflow-visible"
      >
        {visibleCards.map((card) => {
          const isCenter = card.offsetIndex === 0;
          const isHovered = hoveredCardId === card.id;
          const Icon = ICON_MAP[card.icon] || Camera;

          return (
            <div
              key={card.id}
              data-id={card.id}
              data-offset={card.offsetIndex}
              onClick={() => navigate(`/booking/${card.id}`)}
              onMouseEnter={() => setHoveredCardId(card.id)}
              onMouseLeave={() => setHoveredCardId(null)}
              className={`fan-card-item absolute cursor-pointer rounded-3xl overflow-hidden border shadow-2xl transition-all duration-500 ease-out w-40 sm:w-56 h-80 sm:h-[420px] flex flex-col justify-between p-4 sm:p-5 will-change-transform ${
                isHovered
                  ? 'bg-charcoal text-cream border-2 border-gold shadow-gold-glow ring-2 ring-gold/40'
                  : isCenter
                  ? 'bg-charcoal text-cream border-2 border-gold/70 shadow-luxury'
                  : 'bg-white text-charcoal border-rust/20 shadow-xl'
              }`}
            >
              {/* Image Header */}
              <div className="relative h-36 sm:h-44 -mx-4 sm:-mx-5 -mt-4 sm:-mt-5 mb-3 overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
                
                {/* Conditional Dark Gradient Overlay — Full strength for center/hover, light transparent gradient for side cards */}
                <div
                  className={`absolute inset-0 transition-opacity duration-500 ease-out ${
                    isHovered || isCenter
                      ? 'bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent opacity-100'
                      : 'bg-gradient-to-t from-charcoal/45 via-transparent to-transparent opacity-75'
                  }`}
                />
                
                <span className={`absolute top-2.5 left-2.5 text-[8px] sm:text-[9px] uppercase font-montserrat font-bold tracking-wider px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border transition-colors duration-300 ${
                  isHovered || isCenter ? 'bg-rust text-cream border-gold/40' : 'bg-white/95 text-rust border-rust/20 shadow-sm font-extrabold'
                }`}>
                  {card.category}
                </span>

                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center border shadow-md transition-colors duration-300 ${
                    isHovered || isCenter ? 'bg-rust text-gold border-gold/40' : 'bg-white text-rust border-rust/20'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-montserrat font-bold text-gold bg-charcoal/85 backdrop-blur-md px-2 py-0.5 rounded-full border border-gold/30">
                    From {card.priceStarting}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h4 className={`text-base sm:text-xl font-serif font-bold transition-colors duration-300 ${isHovered || isCenter ? 'text-cream' : 'text-rust'}`}>
                    {card.title}
                  </h4>
                  <p className={`text-[11px] sm:text-xs font-serif italic mt-0.5 transition-colors duration-300 ${isHovered || isCenter ? 'text-gold-glow' : 'text-clay font-medium'}`}>
                    "{card.tagline}"
                  </p>
                  <p className={`text-[10px] sm:text-[11px] font-sans mt-1.5 sm:mt-2 line-clamp-2 leading-relaxed transition-colors duration-300 ${
                    isHovered || isCenter ? 'text-cream/80' : 'text-charcoal/80 font-medium'
                  }`}>
                    {card.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-rust/15 flex items-center justify-between">
                  <span className={`text-[9px] sm:text-[10px] font-montserrat font-bold uppercase tracking-wider transition-colors duration-300 ${
                    isHovered || isCenter ? 'text-gold' : 'text-rust'
                  }`}>
                    Book Page
                  </span>
                  <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isHovered || isCenter ? 'bg-rust text-gold' : 'bg-rust/10 text-rust'
                  }`}>
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>




      {/* Fan Carousel Controls & Pagination Dots */}
      <div className="mt-8 flex items-center gap-6 z-40">
        <button
          onClick={handlePrev}
          className="w-11 h-11 rounded-full bg-rust/15 text-rust border border-rust/30 flex items-center justify-center hover:bg-rust hover:text-gold transition-colors shadow-md"
          aria-label="Previous service"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Pagination Dot Indicators */}
        <div className="flex items-center gap-2">
          {servicesData.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === i ? 'w-6 bg-rust' : 'w-2 bg-rust/25 hover:bg-rust/50'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-11 h-11 rounded-full bg-rust/15 text-rust border border-rust/30 flex items-center justify-center hover:bg-rust hover:text-gold transition-colors shadow-md"
          aria-label="Next service"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
