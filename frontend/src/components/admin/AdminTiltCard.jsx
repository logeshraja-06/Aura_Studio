import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function AdminTiltCard({
  children,
  className = '',
  glowColor = 'gold',
  onClick,
  ...rest
}) {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 12;
    const rotY = ((x - centerX) / centerX) * 12;

    setRotateX(rotX);
    setRotateY(rotY);
    setSpotlightPos({ x, y });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  const glowColorMap = {
    gold: 'rgba(201, 162, 39, 0.25)',
    rust: 'rgba(168, 101, 74, 0.25)',
    green: 'rgba(34, 197, 94, 0.25)',
  };

  const accentColor = glowColorMap[glowColor] || glowColorMap.gold;

  return (
    <div className="relative group" style={{ perspective: '1000px' }}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${
            isHovered ? 'scale3d(1.02, 1.02, 1.02) translateZ(10px)' : 'scale3d(1, 1, 1)'
          }`,
        }}
        className={`relative overflow-hidden rounded-3xl bg-[#121212]/90 border border-white/10 backdrop-blur-xl transition-all duration-200 shadow-2xl ${
          isHovered ? 'border-gold/50 shadow-gold-glow-shadow' : ''
        } ${className}`}
        {...rest}
      >
        {/* Radial Mouse Spotlight Effect */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-3xl z-0"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(300px circle at ${spotlightPos.x}px ${spotlightPos.y}px, ${accentColor}, transparent 70%)`,
          }}
        />

        {/* Ambient Top Border Glow */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent pointer-events-none" />

        {/* Card Content Container */}
        <div className="relative z-10">{children}</div>
      </motion.div>
    </div>
  );
}
