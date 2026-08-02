import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ChevronLeft, ChevronRight, Camera, Film, Aperture, Heart, Sparkles, Music, Gift, Smile, Award, Globe, Sun, ArrowRight } from 'lucide-react';
import servicesData from '../data/services.json';

const ICON_MAP = {
  Camera,
  Film,
  Aperture,
  Heart,
  Sparkles,
  Music,
  Gift,
  Smile,
  Award,
  Globe,
  Sun,
};

export default function ServiceFanCards() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredCardId, setHoveredCardId] = useState(null);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : servicesData.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < servicesData.length - 1 ? prev + 1 : 0));
  };

  // Compute offset cards array centered around activeIndex
  const getVisibleCards = () => {
    const total = servicesData.length;
    const cards = [];
    for (let i = -2; i <= 2; i++) {
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

    cardElements.forEach((el, idx) => {
      const cardId = el.getAttribute('data-id');
      const offsetIndex = parseInt(el.getAttribute('data-offset'), 10);
      const isHovered = hoveredCardId === cardId;

      // Base 3D fan parameters
      let rotationAngle = offsetIndex * 9;
      let translateX = offsetIndex * (window.innerWidth < 640 ? 45 : 125);
      let translateY = Math.abs(offsetIndex) * (window.innerWidth < 640 ? 12 : 22);
      let scale = 1 - Math.abs(offsetIndex) * 0.08;
      let zIndex = 30 - Math.abs(offsetIndex) * 5;

      // Hover Focus Logic: Prominent Main Card Focus
      if (isHovered) {
        rotationAngle = 0; // Straighten upright
        translateY -= 25; // Lift up noticeably
        scale = 1.15; // Scale up to main focus
        zIndex = 50; // Jump to highest zIndex in front
      } else if (hoveredCardId) {
        // Push neighbor cards further outward
        const hoveredCard = visibleCards.find((c) => c.id === hoveredCardId);
        if (hoveredCard) {
          const distance = offsetIndex - hoveredCard.offsetIndex;
          if (distance !== 0) {
            translateX += (distance > 0 ? 35 : -35);
            scale -= 0.04;
          }
        }
      }

      // Execute smooth GSAP GPU animation with overwrite protection
      gsap.to(el, {
        x: translateX,
        y: translateY,
        rotation: rotationAngle,
        scale: scale,
        zIndex: zIndex,
        duration: 0.5,
        ease: 'power3.out',
        force3D: true,
        overwrite: 'auto',
      });
    });
  }, [activeIndex, hoveredCardId, visibleCards]);

  return (
    <div className="relative w-full py-12 flex flex-col items-center select-none overflow-hidden">
      {/* 3D Fanned Semicircle Cards Container */}
      <div
        ref={containerRef}
        className="relative w-full max-w-5xl h-[440px] sm:h-[480px] flex items-center justify-center perspective-1000"
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
              className={`fan-card-item absolute cursor-pointer rounded-3xl overflow-hidden border shadow-2xl transition-shadow duration-300 w-64 sm:w-80 h-96 flex flex-col justify-between p-6 will-change-transform ${
                isHovered
                  ? 'bg-charcoal text-cream border-2 border-gold shadow-gold-glow ring-2 ring-gold/40'
                  : isCenter
                  ? 'bg-charcoal text-cream border-2 border-gold/70 shadow-luxury'
                  : 'bg-white text-charcoal border-rust/20 backdrop-blur-md opacity-95'
              }`}
            >
              {/* Image Header */}
              <div className="relative h-44 -mx-6 -mt-6 mb-4 overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />
                
                <span className={`absolute top-3 left-3 text-[9px] uppercase font-montserrat font-bold tracking-wider px-2.5 py-1 rounded-full border ${
                  isHovered || isCenter ? 'bg-rust text-cream border-gold/40' : 'bg-white/90 text-rust border-rust/20'
                }`}>
                  {card.category}
                </span>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-md ${
                    isHovered || isCenter ? 'bg-rust text-gold border-gold/40' : 'bg-white text-rust border-rust/20'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-montserrat font-bold text-gold bg-charcoal/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-gold/30">
                    From {card.priceStarting}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h4 className={`text-xl font-serif font-bold ${isHovered || isCenter ? 'text-cream' : 'text-rust'}`}>
                    {card.title}
                  </h4>
                  <p className={`text-xs font-serif italic mt-0.5 ${isHovered || isCenter ? 'text-gold-glow' : 'text-clay'}`}>
                    "{card.tagline}"
                  </p>
                  <p className={`text-[11px] font-sans mt-2 line-clamp-2 leading-relaxed ${
                    isHovered || isCenter ? 'text-cream/70' : 'text-charcoal/70'
                  }`}>
                    {card.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-rust/15 flex items-center justify-between">
                  <span className={`text-[10px] font-montserrat font-semibold uppercase tracking-wider ${
                    isHovered || isCenter ? 'text-gold' : 'text-rust'
                  }`}>
                    Book Dedicated Page
                  </span>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                    isHovered || isCenter ? 'bg-rust text-gold' : 'bg-rust/10 text-rust'
                  }`}>
                    <ArrowRight className="w-3.5 h-3.5" />
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
