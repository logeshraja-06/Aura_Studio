import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function AdminTiltCard({
  children,
  className = '',
  variant = 'gold',
  onClick,
  ...rest
}) {
  const cardRef = useRef(null);
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setSpotlightPos({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // High-Contrast Light Theme Variant Color Map for AURA Studio
  const variantColorMap = {
    gold: { spotlight: 'rgba(201, 162, 39, 0.12)', border: 'border-gold/60', shadow: 'shadow-gold-glow-shadow' },
    rust: { spotlight: 'rgba(168, 101, 74, 0.12)', border: 'border-rust/60', shadow: 'shadow-rust-glow-shadow' },
    success: { spotlight: 'rgba(201, 162, 39, 0.12)', border: 'border-gold/60', shadow: 'shadow-gold-glow-shadow' },
    warning: { spotlight: 'rgba(180, 115, 90, 0.12)', border: 'border-clay/60', shadow: 'shadow-rust-glow-shadow' },
    danger: { spotlight: 'rgba(168, 101, 74, 0.12)', border: 'border-rust/60', shadow: 'shadow-rust-glow-shadow' },
  };

  const currentVariant = variantColorMap[variant] || variantColorMap.gold;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{ scale: 1.015 }}
      transition={{ duration: 0.2 }}
      className={`relative overflow-hidden rounded-3xl bg-white border border-rust/15 transition-colors duration-200 shadow-luxury ${
        isHovered ? `${currentVariant.border} ${currentVariant.shadow}` : ''
      } ${className}`}
      {...rest}
    >
      {/* Radial Mouse Spotlight Effect */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-3xl z-0"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(320px circle at ${spotlightPos.x}px ${spotlightPos.y}px, ${currentVariant.spotlight}, transparent 70%)`,
        }}
      />

      {/* Ambient Top Border Glow */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent pointer-events-none" />

      {/* Card Content Container */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
